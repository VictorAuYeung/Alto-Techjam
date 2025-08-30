
import json, os, sys, time
from typing import Any, Dict, Tuple
from google import genai
from google.genai.errors import ServerError


from utils import _parse_json_strict, selected_model, PayoutWeights, ScoreWeights
from prompts import video_evaluation_prompt, video_compliance_prompt

from dotenv import load_dotenv
load_dotenv()



###########
# Helpers #
###########

def clamp(x: float, low: float, high: float) -> float:
  return max(low, min(high, x))

def make_client() -> genai.Client:
  api_key = os.environ.get("GEMINI_API_KEY")
  if not api_key:
    raise RuntimeError("GEMINI_API_KEY not found.")
  return genai.Client(api_key=api_key)

def upload_video(client: genai.Client, video_path: str, timeout: int = 300, interval: float = 1.5):
  uploaded = client.files.upload(file=video_path)
  
  start = time.time()
  name = getattr(uploaded, "name", None) or getattr(uploaded, "id", None) or str(uploaded)
  while True:
      f = client.files.get(name=name)
      state = (getattr(f, "state", None) or getattr(f, "status", None) or "").upper()

      if state == "ACTIVE":
          return f
      elif state == "FAILED":
          raise RuntimeError(f"File {name} failed to process (state={state}).")
      elif time.time() - start > timeout:
          raise TimeoutError(f"Timed out waiting for file {name} to become ACTIVE (last state={state}).")
      time.sleep(interval)

def run_video_agent(client: genai.Client, model: str, video_ref: Any, prompt: str) -> Dict[str, Any]:
    try:
      resp = client.models.generate_content(model=model, contents=[video_ref, prompt])
    except ServerError as e:
      raise RuntimeError(f"Model generation failed: {e}")
    return _parse_json_strict(resp.text)



#####################
# Scoring & Payouts #
#####################

def compute_final_score(scores: Dict[str, float], compliance_risk: float, ai_generated: bool, critical_violation: bool) -> Tuple[float, str, Dict[str, float]]:
  hook = clamp(scores.get("hook", 0.0), 0, 1)
  retention = clamp(scores.get("retention", 0.0), 0, 1)
  clarity = clamp(scores.get("clarity", 0.0), 0, 1)
  usefulness_originality = clamp(scores.get("usefulness_originality", 0.0), 0, 1)
  audience_specific_value = clamp(scores.get("audience_specific_value", 0.0), 0, 1)
  engagement = clamp(scores.get("engagement", 0.0), 0, 1)
  risk = clamp(float(compliance_risk or 0.0), 0, 1)

  base = 100 * (
  ScoreWeights.HOOK * hook
    + ScoreWeights.RETENTION * retention
    + ScoreWeights.CLARITY * clarity
    + ScoreWeights.USEFULNESS_ORIGINALITY * usefulness_originality
    + ScoreWeights.AUDIENCE_SPECIFIC_VALUE * audience_specific_value
    + ScoreWeights.ENGAGEMENT * engagement
  )

  penalty = 100 * (risk ** 2) * 0.60
  bonus_niche = max(0.0, min(10.0, 20.0 * (audience_specific_value - 0.7)))
  bonus_aigc = 5.0 if (ai_generated and usefulness_originality >= 0.8 and clarity >= 0.8) else 0.0

  overall = clamp(base - penalty + bonus_niche + bonus_aigc, 0, 100)

  tier = ("none" if overall < 40 else
    "low" if overall < 60 else
    "medium" if overall < 80 else
    "high")
  if critical_violation:
    overall = 0.0
    tier = "none"

  breakdown = {
    "base": round(base, 2),
    "penalty": round(penalty, 2),
    "bonus_niche": round(bonus_niche, 2),
    "bonus_aigc": round(bonus_aigc, 2),
    "overall": round(overall, 2),
    "tier": tier
  }
  return overall, tier, breakdown

def compute_payout(overall_score: float, tier: str) -> float:
  MAX_PAYOUT_PER_1K_VIEWS = PayoutWeights.MAX_PAYOUT_PER_1K_VIEWS
  MIN_PAYOUT_THRESHOLD = PayoutWeights.MIN_PAYOUT_THRESHOLD

  if overall_score < MIN_PAYOUT_THRESHOLD or tier == "none":
    return 0.0

  x = (overall_score - MIN_PAYOUT_THRESHOLD) / (100 - MIN_PAYOUT_THRESHOLD)  # [0...1]
  curve = x * x

  tier_caps = {"low": 0.15, "medium": 0.40, "high": 1.00}
  cap = tier_caps.get(tier, 0.0)
  payout = min(MAX_PAYOUT_PER_1K_VIEWS * cap, MAX_PAYOUT_PER_1K_VIEWS * curve)
  return round(payout, 2)



#################
# Orchestration #
#################

def grade_and_disburse(video_ref: Any) -> Dict[str, Any]:
  client = make_client()
  model = selected_model
  video_handle = upload_video(client, video_ref)

  # 1) Evaluation agent (quality & value).
  video_evaluation_output = run_video_agent(client, model, video_handle, video_evaluation_prompt)
  scores = video_evaluation_output.get("scores", {})
  ai_generated = bool(video_evaluation_output.get("ai_generated", False))

  # 2) Compliance agent (policy & risk).
  video_compliance_output = run_video_agent(client, model, video_handle, video_compliance_prompt)
  regulatory_flags = str(video_compliance_output.get("regulatory_flags", "none")).strip() or "none"
  compliance_risk = float(video_compliance_output.get("compliance_risk", 0.0) or 0.0)
  critical_violation = bool(video_compliance_output.get("critical_violation", False))

  # 3) Final score + payout.
  overall, tier, calc = compute_final_score(scores, compliance_risk, ai_generated, critical_violation)
  payout = compute_payout(overall, tier)

  return {
    "evaluation": {
      "summary": video_evaluation_output.get("summary", ""),
      "scores": {
        "hook": scores.get("hook", 0.0),
        "retention": scores.get("retention", 0.0),
        "clarity": scores.get("clarity", 0.0),
        "usefulness_originality": scores.get("usefulness_originality", 0.0),
        "audience_specific_value": scores.get("audience_specific_value", 0.0),
        "engagement": scores.get("engagement", 0.0),
      },
      "ai_generated": ai_generated,
      "issues": video_evaluation_output.get("issues", []),
      "actionable_tips": video_evaluation_output.get("actionable_tips", []),
    },
    "compliance": {
      "regulatory_flags": regulatory_flags,
      "critical_violation": critical_violation,
      "compliance_risk": compliance_risk,
      "violations": video_compliance_output.get("violations", []),
    },
    "calculation": calc,
    "payout": {
      "video_grade": calc["tier"],
      "payout": payout,
      "max_payout": PayoutWeights.MAX_PAYOUT_PER_1K_VIEWS,
      "overall_score": calc["overall"],
      "min_payout_threshold": PayoutWeights.MIN_PAYOUT_THRESHOLD,
    },
    "model": model,
  }

if __name__ == "__main__":
  if len(sys.argv) < 2:
    print("Usage: python3.11 main.py <path_of_video_file_to_evaluate>")
    sys.exit(1)

  video_ref = sys.argv[1]
  if not os.path.isfile(video_ref):
    raise FileNotFoundError(f"Video to evaluate not found: {video_ref}")
  
  try:
    out = grade_and_disburse(video_ref)
    print(json.dumps(out, indent=2))
  except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
