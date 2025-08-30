
import json
from enum import Enum
from typing import Any, Dict

class PayoutWeights(float, Enum):
  MAX_PAYOUT_PER_1K_VIEWS = 1.0
  MIN_PAYOUT_THRESHOLD = 40.0

class ScoreWeights(float, Enum):
  HOOK = 0.15
  RETENTION = 0.20
  CLARITY = 0.10
  USEFULNESS_ORIGINALITY = 0.35
  AUDIENCE_SPECIFIC_VALUE = 0.10
  ENGAGEMENT = 0.10

def _parse_json_strict(text: str) -> Dict[str, Any]:
  t = text.strip()
  if t.startswith("```"):
    t = t.strip("` \n")
    if t.lower().startswith("json"):
      t = t[4:].strip()
  return json.loads(t)