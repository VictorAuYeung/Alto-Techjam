# Alto - Value Sharing Platform for Creators

Alto is our submission for the **TikTok Value Sharing Challenge**.  
It is a **creator-centric system** designed to make value sharing transparent, explainable, and fair.  Alto fairly rewards creators with credits (called Nanas) per video based on transparent, tamper-resistant quality & impact scores, normalized by content category and creator size, with basic AML/fraud controls for cash-out.

## Value Flow

**Viewer actions (watch, like, comment, share) + AI content/quality assessment → Score → Credits minted to creator's Alto wallet → Creator cashes out (KYC threshold) or spends in-app (gift cards / sponsorship slots).**

We log everything to an append-only ledger for auditability.

## MVP Features

### Creator Dashboard
- **Video Analysis Pipeline**: Paste TikTok link → Fetch metadata → AI scoring → Credits calculation
- **Scoring System**: 
  - Impact Score (60%): Views + engagement metrics (likes, comments, shares)
  - Quality Score (40%): AI analysis of content quality, safety, relevance
  - Fairness Multiplier: Normalized by creator tier (small/mid/large) and category
  - Public Formula: `nanas = (totalScore / 100) * (views / 10000) * 0.1`
- **Wallet Management**: Real-time Nana balance, pending credits, transaction history
- **Cash-Out System**: KYC verification for amounts over $50, multiple payment methods (PayPal, Bank Transfer, Gift Cards)
- **Analytics**: Earnings breakdown, QSE score tracking, performance insights with charts
- **Video Management**: Add TikTok videos, view detailed analysis, track performance metrics
- **Profile System**: Creator profile with stats, tier information, and account management

### Creator Signup Flow
- **Registration**: Display name, email, handle (@username), and niche selection
- **Validation**: Real-time form validation with error handling
- **Onboarding**: Seamless transition to dashboard after signup

### Splash Screen & Landing
- **Animated Splash**: Coin splitting animation with Alto branding
- **Landing Page**: Platform overview with creator stats and call-to-action
- **Navigation**: Smooth transitions between splash, signup, and dashboard

### Technical Implementation
- **Frontend**: React/TypeScript with Lynx.js for cross-platform (iOS/Android/Web) interface
- **Video Analysis Service**: Complete scoring pipeline with TikTok oEmbed integration
- **Wallet Service**: Nana management, cash-out requests, KYC integration
- **Ledger System**: Append-only transaction recording for auditability
- **Mock APIs**: Simulated TikTok integration and backend services for demo purposes
- **Charts & Analytics**: Interactive charts for earnings, QSE scores, and balance history

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

## Demo Walkthrough

### Creator Flow
1. **Splash Screen**: Animated coin splitting with Alto branding
2. **Landing Page**: View platform stats and creator benefits
3. **Sign Up**: Complete registration with display name, email, handle, and niche
4. **Dashboard**: Add TikTok videos, view analysis, and track earnings
5. **Video Analysis**: Detailed QSE scores, compliance checks, and actionable tips
6. **Cash Out**: Request payments with KYC verification for amounts over $50
7. **Analytics**: Monitor performance with interactive charts and insights

## Architecture

### Services
- `videoAnalysis.ts`: Complete scoring pipeline with TikTok oEmbed integration
- `wallet.ts`: Nana management, cash-out, KYC, transactions
- `CreatorDashboard.tsx`: Creator interface with video management and analytics
- `CreatorSignup.tsx`: Registration flow with validation
- `CashOut.tsx`: Cash-out flow with multiple payment methods
- `App.tsx`: Main application with splash screen and navigation

### Key Features
- **Transparent Scoring**: Public formula for Nana calculation
- **Fairness Normalization**: Creator tier and category multipliers
- **KYC Integration**: Identity verification for large cash-outs ($50+)
- **Ledger Recording**: All transactions logged for audit
- **Real-Time Updates**: Live balance and transaction updates
- **Cross-Platform**: Lynx.js for iOS, Android, and Web compatibility
- **Interactive Analytics**: Charts for earnings, QSE scores, and balance history

## Compliance & Security

- **AML Controls**: Basic anti-money laundering screening
- **Fraud Detection**: Velocity monitoring and pattern analysis
- **KYC Threshold**: $50 minimum for identity verification
- **Transaction Limits**: Minimum $5 cash-out, maximum based on balance
- **Audit Trail**: Complete ledger for regulatory compliance
- **Payment Methods**: PayPal, Bank Transfer, and Gift Card options

## Future Enhancements

- **On-Chain Integration**: Move to blockchain for decentralization
- **Advanced AI**: Enhanced content quality analysis with backend pipeline
- **Creator Marketplace**: Sponsorship and collaboration features
- **Real TikTok API**: Direct TikTok API access for live data
- **Enhanced Analytics**: More detailed performance insights and trends
- **Social Features**: Creator discovery and community features

## License

MIT License - see LICENSE file for details.

---

**Alto**: Transparency. Analytics. Compliance. Micro‑credits from viewers to you, in real time.

---

# Backend: TikTok Video Processing Pipeline

## 📊 TikTok Video Processing Pipeline for **Evaluation** and **Compliance**

The backend evaluates TikTok videos for content quality, originality, engagement potential, and compliance using Google's Gemini models.
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
### You'll need:
- Python 3.11+
- pip
- bash
- jq

## ⚡ Quickstart
### 1. Clone the repo and enter the `backend`
```bash
git clone https://github.com/VictorAuYeung/Alto-Techjam.git
cd backend
```

### 2. Create virtual environment (recommended)
```bash
python3.11 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies.
```bash
pip install -r requirements.txt
```

### 4. Set your Gemini API key (Google AI Studio).
```bash
export GEMINI_API_KEY="your_api_key_here"
```

### 5. Put some .mp4 files from your device into the `videos/` folder.
```bash
cp -r ~/your_videos_folder_path/your_videos_folder .
mv your_videos_folder videos
```

### 6a. Run the TikTok Video Processor **(Batch Processing)**.
```bash
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
```bash
python3.11 video_processor/main.py videos/your_video.mp4
```

### 7. View full reports (in structured JSON).
```bash
cd results
vim results/your_video.json
```

### 8. Customisations.
- Adjust Payout Weights in `video_processor/utils.py`.
- Adjust Score Weights in `video_processor/utils.py`.
- Adjust Selected Model in `video_processor/utils.py`.

## 🔍 Sample Results (Full reports can be found in `samples/reports`)

### **Sample 1** (AIGC Brainrot Content): Meow Meow Meow Meow
[▶️ Watch Here](samples/videos/sad_cat_meowing.mp4)

Output (Terminal):
```
Processing videos/sad_cat_meowing.mp4 -> results/sad_cat_meowing-result.json
    📋 Summary:   The video features a series of AI-generated images of sad, crying cartoon cats in the rain, set to melancholic 'meow-meow' music. While visually clear and emotionally evocative for its target audience, it lacks originality and narrative depth.
    💰 Payout:    $0.09 per 1k views.
    ⚠️ Violations: []
✅ Video processed. Get full report at: results/sad_cat_meowing.mp4.json
```

### **Sample 2** (AIGC Promotional / Educational Content): Advertisement on AI Video Enhancer
[▶️ Watch Here](samples/videos/advertisement_on_ai_video_enhancer.mp4)

Output (Terminal):
```
Processing videos/aigc_advertisement.MP4 -> results/aigc_advertisement-result.json
    📋 Summary:   This video effectively showcases an AI-powered video enhancement tool with clear demonstrations and a concise explanation, providing high value for content creators looking to improve their video quality.
    💰 Payout:    $0.55 per 1k views.
    ⚠️ Violations: [{"timestamp":"00:00","flag":"misinformation","description":"The video promotes 'Wondershare UniConverter' and directs viewers to a link in the description. If this content is sponsored or paid promotion and is not clearly disclosed as an advertisement through TikTok's branded content tools, it could be considered misinformation regarding the commercial nature and intent of the content."}]
✅ Video processed. Get full report at: results/aigc_advertisement.MP4.json
```

### **Sample 3** (AIGC Educational Content): Road Roller Song
[▶️ Watch Here](samples/videos/road_roller_song.mp4)

Output (Terminal):
```
Processing videos/road_roller_song.mp4 -> results/road_roller_song-result.json
    📋 Summary:   This video provides a highly informative and well-animated explanation of how road rollers work, including their internal mechanisms and design improvements. It effectively blends real-world footage with clear scientific visualizations.
    💰 Payout:    $0.77 per 1k views.
    ⚠️ Violations: []
✅ Video processed. Get full report at: results/road_roller_song.mp4.json
```

### Sample 4 (HGC Brainrot): Chanel Weighing Cash
[▶️ Watch Here](samples/videos/chanel_weighing_cash.mp4)

Output (Terminal):
```
Processing videos/chanel_weighing_cash.mp4 -> results/chanel_weighing_cash-result.json
    📋 Summary:   The video features a person handling large stacks of money in what appears to be a luxury store, with an intriguing but unverified claim in the text overlay about money being weighed instead of counted. While visually engaging, it lacks proof for its central assertion.
    💰 Payout:    $0.00 per 1k views.
    ⚠️ Violations: [{"timestamp":"00:00","flag":"misinformation","description":"The video caption states, 'They don't even count the money at Chanel they just weigh it ???'. This claim is highly likely to be false. Legitimate businesses count money to ensure accurate transactions, for accounting, and for legal compliance. Weighing money is not a standard or accurate method for counting currency in retail and presents a factual inaccuracy regarding common business practices."}]
✅ Video processed. Get full report at: results/chanel_weighing_cash.mp4.json
```

### Sample 5 (HGC Wholesome Content): Sticking Tongue Out Trend
[▶️ Watch Here](samples/videos/sticking_out_tongue_trend.mp4)

Output (Terminal):
```
Processing videos/sticking-out-tongue-trend.mp4 -> results/sticking-out-tongue-trend-result.json
    📋 Summary:   This video features a young creator engaging in light-hearted, spontaneous interactions with fellow train passengers, creating a wholesome and humorous moment that's likely to resonate positively with viewers.
    💰 Payout:    $0.39 per 1k views.
    ⚠️ Violations: []
✅ Video processed. Get full report at: results/sticking-out-tongue-trend.mp4.json
```

### Sample 6 (HGC Niche Content): BMWs Cruising
[▶️ Watch Here](samples/videos/bmws_cruising.mp4)

Output (Terminal):
```
Processing videos/bmws_cruising.mp4 -> results/bmws_cruising-result.json
    📋 Summary:   This video is a well-produced showcase of two BMW cars driving at night, featuring dynamic shots and good editing set to engaging music. It provides strong aesthetic value for car enthusiasts.
    💰 Payout:    $0.49 per 1k views.
    ⚠️ Violations: []
✅ Video processed. Get full report at: results/bmws_cruising.mp4.json
```

### Sample 7 (HGC Educational Content): Visual Hook Ideas
[▶️ Watch Here](samples/videos/visual_hook_ideas.mp4)

Output (Terminal):
```
Processing videos/visual_hook_ideas.mp4 -> results/visual_hook_ideas-result.json
    📋 Summary:   This video provides practical and creative tips for generating visual hooks in video content, demonstrating each technique clearly and effectively with good pacing and visual appeal.
    💰 Payout:    $0.81 per 1k views.
    ⚠️ Violations: []
✅ Video processed. Get full report at: results/visual_hook_ideas.mp4.json
```
