# Alto Techjam 2025:
## 📊 TikTok Video Processing Pipeline for Evaluation and Compliance

The backend evaluates TikTok videos for content quality, originality, engagement potential, and compliance using Google’s Gemini models.
It outputs a structured JSON report for each video and computes a **reward tier** and **payout recommendation**. It is recommended to use the `gemini-2.5-flash-pro` model for production, and the `gemini-2.5-flash-lite` model for development.

## 🚀 Features
### 1. Video Evalution Agent
Evaluation metrics:
  - Hook
  - Retention
  - Clarity
  - Originality
  - Audience Specific / Niche
  - Engagement
### 2. Video Compliance Agent:
Compliance checks:
  - Age inappropriate
  - Violence
  - Hate Speech
  - Harassment
  - Illegal / Dangerous Activity
  - Privacy Violation
  - Financial Fraud
  - Mmisinformation
  - Regional Restriction
### 3. Structured JSON Output:
  Output from Gemini Flash:
  - Summary / Synopsis
  - Evaluation Metrics
  - AIGC (True / False)
  - Issues (with Timestamps and Descriptions)
  - Compliance (with Violation Flags and Risk Score)
  Outputs from our post-processing algorithm
  - Calculations (Interim and Final Scores)
  - Payouts (Tier and Recommendations)
### 4. Batch processing of multiple .mp4 files
Bash Script to simplify the TikTok Video Processing Flow.
  - Drag & Drop, or scp videos to `videos/` folder
  - Process all videos at once
  - Results saved to `results/` folder in structured JSON
  - Terminal summaries with colored output

## 📦 Dependencies
### You’ll need:
- Python 3.11+
-	pip
-	bash
-	jq

## ⚡ Quickstart
### 1. Clone the repo and enter the backend
```
git clone https://github.com/VictorAuYeung/Alto-Techjam.git
cd backend
```

### 2. Create virtual environment (recommended)
```
python3.11 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies.
```
pip install -r requirements.txt
```

### 4. Set your API key (Google AI Studio).
```
export GEMINI_API_KEY="your_api_key_here"
```

### 5. Put some .mp4 files from your device into the videos/ folder.
```
mkdir -p videos
cp ~/your_local_videos_path videos/
```

### 6a. Run the TikTok Video Processor (Batch Processing).
```
./process_videos.sh
```
Example Output:
```
Processing videos/your_video.mp4 -> results/your_video.json
  📋 Summary: Educational content with clear narration.
  💰 Payout:  $0.90 per 1k views.
  ⚠️ Violations: []
✅ Video processed. Get full report at: results/your_video.json
```

### 6b. Run the TikTok Video Processor (Single Video).
```
python3.11 video_processor/main.py videos/your_video.mp4
```

### 7. View full reports (in structured JSON).
```
cd results
vim results/your_video.json
```

### 8. Customisations.
- Adjust Payout Weights in `video_processor/utils.py`.
-	Adjust Score Weights in `video_processor/utils.py`.
- Adjust Selected Model in `video_processor/utils.py`.
