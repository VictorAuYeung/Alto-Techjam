# Alto Techjam 2025
## 📊 TikTok Video Processing Pipeline for **Evaluation** and **Compliance**

The backend evaluates TikTok videos for content quality, originality, engagement potential, and compliance using Google’s Gemini models.
It outputs a structured JSON report for each video and computes a **reward tier** and **payout recommendation**. It is recommended to use the `gemini-2.5-flash-pro` model for production, and the `gemini-2.5-flash-lite` model for development.

## 🚀 Features
### 1. Video Evalution Agent
| Evaluation Metric             | Description                                                                                        |
|-------------------------------|----------------------------------------------------------------------------------------------------|
| **Hook**                      | *Ability of the first 3 seconds to grab attention authentically*                                   |
| **Retention**                 | *Pacing and storytelling quality that keeps viewers watching until the end*                        |
| **Clarity**                   | *How understandable and accessible the content is*                                                 |
| **Originality**               | *How creative, useful, or fresh the content is compared to generic trends*                         |
| **Audience Specific / Niche** | *Whether the content provides significant value to a specific group, even if not broadly viral*    |
| **Engagement**                | *Likelihood of sparking genuine interaction such as likes, comments, saves, shares, follows, etc.* |
### 2. Video Compliance Agent:
| Compliance Check                 | Description                                                                                      |
|----------------------------------|--------------------------------------------------------------------------------------------------|
| **Age Inappropriate**            | *Nudity, sexual content, adult themes without age-gating*                                        |
| **Violence**                     | *Content containing graphic or non-graphic violence, depictions of self-harm, or animal cruelty* |
| **Hate Speech**                  | *Content targeting groups based on race, religion, gender, sexual orientation, disability, etc.* |
| **Harassment**                   | *Direct abuse, targeting individuals with insults, coordinated harassment*                       |
| **Illegal / Dangerous Activity** | *Content showing or promoting weapons, drugs, terrorism, unsafe acts, or crime*                  |
| **Privacy Violation**            | *Revealing personal data or content that infringes copyright / IP*                               |
| **Financial Fraud**              | *Scams, money laundering, pyramid schemes, crypto pump / dump, fake giveaways*                   |
| **Misinformation**               | *Medical or political / election-related misinformation*                                           |
| **Regional Restriction**         | *Content legal in some regions but restricted elsewhere*                                         |
### 3. Structured JSON Output:
  Output from **Gemini Flash**:
  - 📋 Summary / Synopsis
  - 📊 Evaluation Metrics
  - 🤖 AI Generated Content (True / False)
  - ⚠️ Issues (with Timestamps and Descriptions)
  - ⚖️ Compliance (with Violation Flags and Risk Score)
  
  Outputs from our **post-processing algorithm**:
  - 🧮 Calculations (Interim and Final Scores)
  - 💰 Payouts (Tier and Recommendations)
### 4. Batch processing of multiple .mp4 files
Bash Script to simplify the TikTok Video Processing flow:
  - Drag & Drop, or `scp` videos to `videos/` folder
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
### 1. Clone the repo and enter the `backend`
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

### 4. Set your Gemini API key (Google AI Studio).
```
export GEMINI_API_KEY="your_api_key_here"
```

### 5. Put some .mp4 files from your device into the `videos/` folder.
```
mkdir -p videos
cp ~/your_local_videos_path videos/
```

### 6a. Run the TikTok Video Processor **(Batch Processing)**.
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

### 6b. Run the TikTok Video Processor **(Single Video)**.
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

## 🔍 Sample Results (Full reports can be found in `samples/reports`)
### **Sample 1** (AIGC Brainrot): Meow Meow Meow Meow
[▶️ Watch Here ](sample/videos/sad_cat_meowing.mp4)

Output (Terminal):
```
```

### **Sample 2** (AIGC Promotional): Advertisement on AI Video Enhancer
[▶️ Watch Here ](sample/videos/advertisement_on_ai_video_enhancer.mp4)

Output (Terminal):
```
```

### **Sample 3** (AIGC Educational): Road Roller Song
[▶️ Watch Here ](sample/videos/road_roller_song.mp4)

Output (Terminal):
```
```

### Sample 4 (HGC Brainrot): Sticking Tongue Out Trend
[▶️ Watch Here ](sample/videos/sticking_out_tongue_trend.mp4)

Output (Terminal):
```
```

### Sample 5 (HGC Brainrot): Chanel Weighing Cash
[▶️ Watch Here ](sample/videos/chanel_weighing_cash.mp4)

Output (Terminal):
```
```

### Sample 6 (HGC Educational): Video Hook Ideas
[▶️ Watch Here ](sample/videos/video_hook_ideas.mp4)

Output (Terminal):
```
```

### Sample 7 (HGC Niche): BMWs Cruising
[▶️ Watch Here ](sample/videos/bmws_cruising.mp4)

Output (Terminal):
```
```