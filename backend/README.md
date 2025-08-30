# Alto Techjam 2025
## 📊 TikTok Video Processing Pipeline for **Evaluation** and **Compliance**

The backend evaluates TikTok videos for content quality, originality, engagement potential, and compliance using Google’s Gemini models.
It outputs a structured JSON report for each video and computes a **reward tier** and **payout recommendation**.
It is recommended to use the `gemini-2.5-flash` model in production for better accuracy and reliability, and the `gemini-2.5-flash-lite` model in development for fast and low-cost testing.

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
cp -r ~/your_videos_folder_path/your_videos_folder .
mv your_videos_folder videos
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
### **Sample 1** (AIGC Brainrot Content): Meow Meow Meow Meow
[▶️ Watch Here ](samples/videos/sad_cat_meowing.mp4)

Output (Terminal):
```
Processing videos/sad_cat_meowing.mp4 -> results/sad_cat_meowing-result.json
    📋 Summary:   The video features a series of AI-generated images of sad, crying cartoon cats in the rain, set to melancholic 'meow-meow' music. While visually clear and emotionally evocative for its target audience, it lacks originality and narrative depth.
    💰 Payout:    $0.09 per 1k views.
    ⚠️ Violations: []
✅ Video processed. Get full report at: results/sad_cat_meowing.mp4.json
```

### **Sample 2** (AIGC Promotional / Educational Content): Advertisement on AI Video Enhancer
[▶️ Watch Here ](samples/videos/advertisement_on_ai_video_enhancer.mp4)

Output (Terminal):
```
Processing videos/aigc_advertisement.MP4 -> results/aigc_advertisement-result.json
    📋 Summary:   This video effectively showcases an AI-powered video enhancement tool with clear demonstrations and a concise explanation, providing high value for content creators looking to improve their video quality.
    💰 Payout:    $0.55 per 1k views.
    ⚠️ Violations: [{"timestamp":"00:00","flag":"misinformation","description":"The video promotes 'Wondershare UniConverter' and directs viewers to a link in the description. If this content is sponsored or paid promotion and is not clearly disclosed as an advertisement through TikTok's branded content tools, it could be considered misinformation regarding the commercial nature and intent of the content."}]
✅ Video processed. Get full report at: results/aigc_advertisement.MP4.json
```

### **Sample 3** (AIGC Educational Content): Road Roller Song
[▶️ Watch Here ](samples/videos/road_roller_song.mp4)

Output (Terminal):
```
Processing videos/road_roller_song.mp4 -> results/road_roller_song-result.json
    📋 Summary:   This video provides a highly informative and well-animated explanation of how road rollers work, including their internal mechanisms and design improvements. It effectively blends real-world footage with clear scientific visualizations.
    💰 Payout:    $0.77 per 1k views.
    ⚠️ Violations: []
✅ Video processed. Get full report at: results/road_roller_song.mp4.json
```

### Sample 4 (HGC Brainrot): Chanel Weighing Cash
[▶️ Watch Here ](samples/videos/chanel_weighing_cash.mp4)

Output (Terminal):
```
Processing videos/chanel_weighing_cash.mp4 -> results/chanel_weighing_cash-result.json
    📋 Summary:   The video features a person handling large stacks of money in what appears to be a luxury store, with an intriguing but unverified claim in the text overlay about money being weighed instead of counted. While visually engaging, it lacks proof for its central assertion.
    💰 Payout:    $0.00 per 1k views.
    ⚠️ Violations: [{"timestamp":"00:00","flag":"misinformation","description":"The video caption states, 'They don't even count the money at Chanel they just weigh it ???'. This claim is highly likely to be false. Legitimate businesses count money to ensure accurate transactions, for accounting, and for legal compliance. Weighing money is not a standard or accurate method for counting currency in retail and presents a factual inaccuracy regarding common business practices."}]
✅ Video processed. Get full report at: results/chanel_weighing_cash.mp4.json
```

### Sample 5 (HGC Wholesome Content): Sticking Tongue Out Trend
[▶️ Watch Here ](samples/videos/sticking_out_tongue_trend.mp4)

Output (Terminal):
```
Processing videos/sticking-out-tongue-trend.mp4 -> results/sticking-out-tongue-trend-result.json
    📋 Summary:   This video features a young creator engaging in light-hearted, spontaneous interactions with fellow train passengers, creating a wholesome and humorous moment that's likely to resonate positively with viewers.
    💰 Payout:    $0.39 per 1k views.
    ⚠️ Violations: []
✅ Video processed. Get full report at: results/sticking-out-tongue-trend.mp4.json
```

### Sample 6 (HGC Niche Content): BMWs Cruising
[▶️ Watch Here ](samples/videos/bmws_cruising.mp4)

Output (Terminal):
```
Processing videos/bmws_cruising.mp4 -> results/bmws_cruising-result.json
    📋 Summary:   This video is a well-produced showcase of two BMW cars driving at night, featuring dynamic shots and good editing set to engaging music. It provides strong aesthetic value for car enthusiasts.
    💰 Payout:    $0.49 per 1k views.
    ⚠️ Violations: []
✅ Video processed. Get full report at: results/bmws_cruising.mp4.json
```

### Sample 7 (HGC Educational Content): Visual Hook Ideas
[▶️ Watch Here ](samples/videos/visual_hook_ideas.mp4)

Output (Terminal):
```
Processing videos/visual_hook_ideas.mp4 -> results/visual_hook_ideas-result.json
    📋 Summary:   This video provides practical and creative tips for generating visual hooks in video content, demonstrating each technique clearly and effectively with good pacing and visual appeal.
    💰 Payout:    $0.81 per 1k views.
    ⚠️ Violations: []
✅ Video processed. Get full report at: results/visual_hook_ideas.mp4.json
```
