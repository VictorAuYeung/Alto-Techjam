# Alto - Real-Time Value for Every View

Alto fairly rewards TikTok creators with credits per video based on transparent, tamper-resistant quality & impact scores, normalized by content category and creator size, with basic AML/fraud controls for cash-out.

## Value Flow

**Viewer actions (watch, like, comment, share) + AI content/quality assessment → Score → Credits minted to creator's Alto wallet → Creator cashes out (KYC threshold) or spends in-app (gift cards / sponsorship slots).**

We log everything to an append-only ledger for auditability.

## MVP Features

### Creator Dashboard
- **Video Analysis Pipeline**: Paste TikTok link → Fetch metadata → AI scoring → Credits calculation
- **Scoring System**: 
  - Impact Score (60%): Views + engagement metrics
  - Quality Score (40%): AI analysis of content quality, safety, relevance
  - Fairness Multiplier: Normalized by creator tier (small/mid/large) and category
  - Public Formula: `credits = (totalScore / 100) * (views / 10000) * 0.1`
- **Wallet Management**: Real-time credit balance, pending credits, transaction history
- **Cash-Out System**: KYC verification for amounts over $50, multiple payment methods
- **Analytics**: Earnings breakdown, QSE score tracking, performance insights

### User Dashboard (Viewers)
- **Top-Up System**: Add credits to wallet with session budgeting
- **Video Feed**: Browse and support creators with micro-credits
- **Streaming Sessions**: Set budgets and track spending during viewing sessions
- **Support History**: Track all contributions and creator analytics
- **Security**: AML screening, fraud detection, transaction limits

### Technical Implementation
- **Backend Services**: Enhanced video analysis with complete scoring pipeline
- **Wallet Service**: Credit management, cash-out requests, KYC integration
- **Ledger System**: Append-only transaction recording for auditability
- **Lynx UI**: Cross-platform (iOS/Android/Web) interface
- **Mock APIs**: Simulated TikTok integration for demo purposes

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
1. **Sign Up**: Complete creator registration with handle and niche
2. **Add Videos**: Paste TikTok URLs to analyze and earn credits
3. **View Analytics**: Monitor QSE scores, earnings, and performance
4. **Cash Out**: Request payments with KYC verification when needed

### Viewer Flow
1. **Top Up**: Add credits to wallet with session budgeting
2. **Browse Videos**: View creator content with quality scores
3. **Support Creators**: Send micro-credits based on engagement
4. **Track History**: Monitor contributions and analytics

## Architecture

### Services
- `videoAnalysis.ts`: Complete scoring pipeline with AI analysis
- `wallet.ts`: Credit management, cash-out, KYC, transactions
- `CreatorDashboard.tsx`: Creator interface with video management
- `UserDashboard.tsx`: Viewer interface with support features
- `CashOut.tsx`: Cash-out flow with payment methods
- `TopUp.tsx`: Credit top-up with session management

### Key Features
- **Transparent Scoring**: Public formula for credit calculation
- **Fairness Normalization**: Creator tier and category multipliers
- **KYC Integration**: Identity verification for large cash-outs
- **Ledger Recording**: All transactions logged for audit
- **Real-Time Updates**: Live balance and transaction updates

## Compliance & Security

- **AML Controls**: Basic anti-money laundering screening
- **Fraud Detection**: Velocity monitoring and pattern analysis
- **KYC Threshold**: $50 minimum for identity verification
- **Transaction Limits**: Daily spending caps for viewers
- **Audit Trail**: Complete ledger for regulatory compliance

## Future Enhancements

- **On-Chain Integration**: Move to blockchain for decentralization
- **Advanced AI**: Enhanced content quality analysis
- **Creator Marketplace**: Sponsorship and collaboration features
- **Mobile Apps**: Native iOS and Android applications
- **API Integration**: Direct TikTok API access for real data

## License

MIT License - see LICENSE file for details.

---

**Alto**: Transparency. Analytics. Compliance. Micro‑credits from viewers to you, in real time.
