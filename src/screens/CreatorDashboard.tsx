/* eslint-disable react/no-unknown-property */
import { useEffect, useState, useRef } from 'react';
import '@lynx-js/react';

import backArrowIcon from '../assets/icons/back-arrow.png';
import graphIcon from '../assets/graph-bg.png';
import groupIcon from '../assets/icons/group.png';

import { mockAnalyzeVideoAPI } from '../services/videoAnalysis.js';
import type { VideoAnalysisRequest } from '../services/videoAnalysis.js';
import {
  getWalletBalance,
  addNanas,
  getEarningsAnalytics,
  getTransactionHistory,
  getBalanceHistory,
  type WalletBalance,
  type Transaction,
  type BalanceHistoryPoint
} from '../services/wallet.js';
import altoLogo from '../assets/logos/alto-logo.png';
import coinIcon from '../assets/coins/coin-banana.png';
import profilePicture from '../assets/profile-picture.png';
import { CashOut } from './CashOut.js';
import { BalanceChart } from '../components/BalanceChart.js';
import { BarChart } from '../components/BarChart.js';
import { HorizontalBarChart } from '../components/HorizontalBarChart.js';

// Navigation icons
import homeWhite from '../assets/nav-bar/home-white.png';
import homeYellow from '../assets/nav-bar/home-yellow.png';
import videoWhite from '../assets/nav-bar/video-white.png';
import videoYellow from '../assets/nav-bar/video-yellow.png';
import receiptsWhite from '../assets/nav-bar/receipts-white.png';
import receiptsYellow from '../assets/nav-bar/receipts-yellow.png';
import analyticsWhite from '../assets/nav-bar/analytics-white.png';
import analyticsYellow from '../assets/nav-bar/analytics-yellow.png';

type Tab = 'overview' | 'videos' | 'receipts' | 'analytics';

// Mock detailed video data based on JSON results
const getVideoDetails = (videoId: string) => {
  const videoDetailsMap: Record<string, any> = {
    '1': { // AI Video Enhancement Tool Demo
      evaluation: {
        summary: "This video effectively showcases an AI-powered video enhancement tool with clear demonstrations and a concise explanation, providing high value for content creators looking to improve their video quality.",
        scores: { hook: 1.0, retention: 0.9, clarity: 1.0, usefulness_originality: 0.9, audience_specific_value: 1.0, engagement: 0.9 },
        ai_generated: false,
        issues: [],
        actionable_tips: [
          "Consider demonstrating the AI enhancement on a wider variety of 'before' footage types (e.g., very dark, heavily pixelated) to showcase the tool's full capability.",
          "Briefly mention another standout feature of Wondershare UniConverter that might appeal to creators to encourage further exploration of the software."
        ]
      },
      compliance: {
        regulatory_flags: "misinformation",
        critical_violation: false,
        compliance_risk: 0.5,
        violations: [{
          timestamp: "00:00",
          flag: "misinformation",
          description: "The video promotes 'Wondershare UniConverter' and directs viewers to a link in the description. If this content is sponsored or paid promotion and is not clearly disclosed as an advertisement through TikTok's branded content tools, it could be considered misinformation regarding the commercial nature and intent of the content."
        }]
      },
      calculation: { base: 93.5, penalty: 15.0, bonus_niche: 6.0, bonus_aigc: 0.0, overall: 84.5, tier: "high" },
      payout: { video_grade: "high", payout: 0.55, max_payout: 1.0, overall_score: 84.5, min_payout_threshold: 40.0 }
    },
    '2': { // BMW Night Cruise Showcase
      evaluation: {
        summary: "This video is a well-produced showcase of two BMW cars driving at night, featuring dynamic shots and good editing set to engaging music. It provides strong aesthetic value for car enthusiasts.",
        scores: { hook: 0.8, retention: 0.8, clarity: 0.9, usefulness_originality: 0.7, audience_specific_value: 0.9, engagement: 0.8 },
        ai_generated: false,
        issues: [],
        actionable_tips: [
          "Consider adding subtle text overlays identifying the car models or locations for viewers interested in specifics.",
          "Experiment with a brief, impactful sound clip of the cars' engines or exhaust to enhance the car enthusiast appeal.",
          "Explore slight variations in shot speed or dynamic camera movements to add further visual flair."
        ]
      },
      compliance: { regulatory_flags: "none", critical_violation: false, compliance_risk: 0.1, violations: [] },
      calculation: { base: 78.5, penalty: 0.6, bonus_niche: 4.0, bonus_aigc: 0.0, overall: 81.9, tier: "high" },
      payout: { video_grade: "high", payout: 0.49, max_payout: 1.0, overall_score: 81.9, min_payout_threshold: 40.0 }
    },
    '3': { // How Road Rollers Work
      evaluation: {
        summary: "This video provides a highly informative and well-animated explanation of how road rollers work, including their internal mechanisms and design improvements. It effectively blends real-world footage with clear scientific visualizations.",
        scores: { hook: 0.9, retention: 0.9, clarity: 1.0, usefulness_originality: 0.8, audience_specific_value: 0.8, engagement: 0.8 },
        ai_generated: true,
        issues: [],
        actionable_tips: [
          "Consider using a more natural-sounding human voiceover to enhance relatability.",
          "Add a brief call-to-action at the end to encourage comments or questions.",
          "Explore showing a side-by-side comparison of the older vs. improved vibration patterns on the ground for even clearer impact."
        ]
      },
      compliance: { regulatory_flags: "none", critical_violation: false, compliance_risk: 0.0, violations: [] },
      calculation: { base: 85.5, penalty: 0.0, bonus_niche: 2.0, bonus_aigc: 5.0, overall: 92.5, tier: "high" },
      payout: { video_grade: "high", payout: 0.77, max_payout: 1.0, overall_score: 92.5, min_payout_threshold: 40.0 }
    },
    '4': { // Chanel Money Weighing Mystery
      evaluation: {
        summary: "The video features a person handling large stacks of money in what appears to be a luxury store, with an intriguing but unverified claim in the text overlay about money being weighed instead of counted. While visually engaging, it lacks proof for its central assertion.",
        scores: { hook: 0.9, retention: 0.5, clarity: 0.9, usefulness_originality: 0.2, audience_specific_value: 0.4, engagement: 0.8 },
        ai_generated: false,
        issues: [{ timestamp: "00:00", issue: "structure", description: "The video makes an intriguing claim ('they just weigh it') but provides no visual evidence to support it. The machine shown appears to be a money counter/detector, not a scale." }],
        actionable_tips: [
          "If the claim is factual, demonstrate the money actually being weighed to provide proof.",
          "If the claim is satirical or a joke, add context or cues (e.g., humor tag) to clarify the intent.",
          "Ensure the visual content directly supports or clarifies the textual claim to avoid misleading viewers."
        ]
      },
      compliance: {
        regulatory_flags: "misinformation",
        critical_violation: false,
        compliance_risk: 0.4,
        violations: [{
          timestamp: "00:00",
          flag: "misinformation",
          description: "The video caption states, 'They don't even count the money at Chanel they just weigh it ???'. This claim is highly likely to be false. Legitimate businesses count money to ensure accurate transactions, for accounting, and for legal compliance. Weighing money is not a standard or accurate method for counting currency in retail and presents a factual inaccuracy regarding common business practices."
        }]
      },
      calculation: { base: 51.5, penalty: 9.6, bonus_niche: 0.0, bonus_aigc: 0.0, overall: 41.9, tier: "low" },
      payout: { video_grade: "low", payout: 0.0, max_payout: 1.0, overall_score: 41.9, min_payout_threshold: 40.0 }
    },
    '5': { // Sad Cat Meowing in the Rain
      evaluation: {
        summary: "The video features a series of AI-generated images of sad, crying cartoon cats in the rain, set to melancholic 'meow-meow' music. While visually clear and emotionally evocative for its target audience, it lacks originality and narrative depth.",
        scores: { hook: 0.8, retention: 0.6, clarity: 0.9, usefulness_originality: 0.3, audience_specific_value: 0.7, engagement: 0.7 },
        ai_generated: true,
        issues: [{ timestamp: "00:00", issue: "structure", description: "The video is a repetitive slideshow of very similar AI-generated images, lacking narrative progression or significant variation." }],
        actionable_tips: [
          "Introduce a simple narrative or progression across the images to maintain engagement.",
          "Vary the emotions or scenarios of the cats to add more depth.",
          "Consider adding comforting text overlays or a unique story behind the 'sad cats' theme."
        ]
      },
      compliance: { regulatory_flags: "none", critical_violation: false, compliance_risk: 0.0, violations: [] },
      calculation: { base: 57.5, penalty: 0.0, bonus_niche: 0.0, bonus_aigc: 0.0, overall: 57.5, tier: "low" },
      payout: { video_grade: "low", payout: 0.09, max_payout: 1.0, overall_score: 57.5, min_payout_threshold: 40.0 }
    },
    '6': { // Train Passenger Tongue Sticking Trend
      evaluation: {
        summary: "This video features a young creator engaging in light-hearted, spontaneous interactions with fellow train passengers, creating a wholesome and humorous moment that's likely to resonate positively with viewers.",
        scores: { hook: 0.8, retention: 0.7, clarity: 0.9, usefulness_originality: 0.7, audience_specific_value: 0.8, engagement: 0.8 },
        ai_generated: false,
        issues: [],
        actionable_tips: [
          "Consider adding a subtle text overlay with a brief, positive message or context about the interaction.",
          "Experiment with slightly different playful prompts to elicit varied reactions from people.",
          "If possible, maintain a consistent lighting quality throughout the video, especially when transitioning between shots or angles."
        ]
      },
      compliance: { regulatory_flags: "none", critical_violation: false, compliance_risk: 0.0, violations: [] },
      calculation: { base: 75.5, penalty: 0.0, bonus_niche: 2.0, bonus_aigc: 0.0, overall: 77.5, tier: "medium" },
      payout: { video_grade: "medium", payout: 0.39, max_payout: 1.0, overall_score: 77.5, min_payout_threshold: 40.0 }
    },
    '7': { // Creative Visual Hook Ideas
      evaluation: {
        summary: "This video provides practical and creative tips for generating visual hooks in video content, demonstrating each technique clearly and effectively with good pacing and visual appeal.",
        scores: { hook: 0.9, retention: 0.9, clarity: 0.9, usefulness_originality: 0.9, audience_specific_value: 0.9, engagement: 0.9 },
        ai_generated: false,
        issues: [],
        actionable_tips: [
          "Consider showing a quick glimpse of the 'effect' of each visual hook (e.g., what it looks like to the viewer) after demonstrating the setup.",
          "Experiment with slightly faster transitions between the setup and the reveal of the 'visual hook' card to maintain dynamic pacing."
        ]
      },
      compliance: { regulatory_flags: "none", critical_violation: false, compliance_risk: 0.0, violations: [] },
      calculation: { base: 90.0, penalty: 0.0, bonus_niche: 4.0, bonus_aigc: 0.0, overall: 94.0, tier: "high" },
      payout: { video_grade: "high", payout: 0.81, max_payout: 1.0, overall_score: 94.0, min_payout_threshold: 40.0 }
    }
  };
  return videoDetailsMap[videoId] || null;
};

// Helper function to format nanas
const formatNanas = (amount: number) => {
  return `${amount.toFixed(3)} Nana`;
};

// Image-based icons for bottom navigation
const HomeIcon = ({ isActive }: { isActive: boolean }) => (
  <view className="NavIconContainer">
    <image src={isActive ? homeYellow : homeWhite} className="NavIcon" />
  </view>
);
const VideosIcon = ({ isActive }: { isActive: boolean }) => (
  <view className="NavIconContainer">
    <image src={isActive ? videoYellow : videoWhite} className="NavIcon" style={{ width: '30px', height: '30px' }} />
  </view>
);
const ReceiptsIcon = ({ isActive }: { isActive: boolean }) => (
  <view className="NavIconContainer">
    <image src={isActive ? receiptsYellow : receiptsWhite} className="NavIcon" style={{ width: '30px', height: '30px' }} />
  </view>
);
const AnalyticsIcon = ({ isActive }: { isActive: boolean }) => (
  <view className="NavIconContainer">
    <image src={isActive ? analyticsYellow : analyticsWhite} className="NavIcon" />
  </view>
);

interface VideoData {
  id: string;
  title: string;
  viewCount: string;
  likeCount: string;
  commentCount: string;
  shareCount: string;
  thumbnail: string;
  url: string;
  qseScore?: number;
  nanas?: number;
  isAnalyzing?: boolean;
  impactScore?: number;
  qualityScore?: number;
  fairnessMultiplier?: number;
  totalScore?: number;
  category?: string;
  creatorTier?: string;
  ledgerEntryId?: string;
  analysisTimestamp?: number;
}

// Video Detail Screen Component
interface VideoDetailScreenProps {
  selectedVideo: VideoData | null;
  onBack: () => void;
}

const VideoDetailScreen = ({ selectedVideo, onBack }: VideoDetailScreenProps) => {
  if (!selectedVideo) return null;
  const details = getVideoDetails(selectedVideo.id);

  if (!details) return null;

  const { evaluation, compliance, calculation, payout } = details;

  return (
    <view className="VideoDetailScreen">
      <view className="DetailHeader">
        <view className="BackButton" bindtap={onBack} style="padding: 8px; cursor: pointer;">
          <image src={backArrowIcon} style="width: 24px; height: 24px;" />
        </view>
        <text className="DetailTitle">Video Analysis Details</text>
      </view>

      <scroll-view className="DetailContent" scroll-y>
        {/* Video Info Card */}
        <view className="DetailCard">
          <image src={selectedVideo.thumbnail} className="DetailThumbnail" />
          <view className="DetailVideoInfo">
            <text className="DetailVideoTitle">{selectedVideo.title}</text>
            <view className="DetailStats">
              <view className="DetailStat">
                <text className="DetailStatLabel">Views</text>
                <text className="DetailStatValue">{selectedVideo.viewCount}</text>
              </view>
              <view className="DetailStat">
                <text className="DetailStatLabel">Likes</text>
                <text className="DetailStatValue">{selectedVideo.likeCount}</text>
              </view>
              <view className="DetailStat">
                <text className="DetailStatLabel">Comments</text>
                <text className="DetailStatValue">{selectedVideo.commentCount}</text>
              </view>
              <view className="DetailStat">
                <text className="DetailStatLabel">Shares</text>
                <text className="DetailStatValue">{selectedVideo.shareCount}</text>
              </view>
            </view>
          </view>
        </view>

        {/* QSE Score Card */}
        <view className="DetailCard">
          <text className="CardTitle">QSE Score & Earnings</text>
          <view className="ScoreGrid">
            <view className="ScoreItem">
              <text className="ScoreLabel">Overall Score</text>
              <text className="ScoreValue">{selectedVideo.qseScore}%</text>
            </view>
            <view className="ScoreItem">
              <text className="ScoreLabel">Earnings</text>
              <text className="ScoreValue">{formatNanas(selectedVideo.nanas || 0)}</text>
            </view>
            <view className="ScoreItem">
              <text className="ScoreLabel">Grade</text>
              <text className={`ScoreValue grade-${payout.video_grade}`}>
                {payout.video_grade.charAt(0).toUpperCase() + payout.video_grade.slice(1)}
              </text>
            </view>
            <view className="ScoreItem">
              <text className="ScoreLabel">Creator Tier</text>
              <text className="ScoreValue">{calculation.tier.charAt(0).toUpperCase() + calculation.tier.slice(1)}</text>
            </view>
          </view>
        </view>

        {/* Evaluation Summary */}
        <view className="DetailCard">
          <text className="CardTitle">AI Evaluation Summary</text>
          <text className="SummaryText">{evaluation.summary}</text>

          <view className="AIGenerated">
            <text className="AIGeneratedLabel">AI Generated Content:</text>
            <text className={`AIGeneratedValue ${evaluation.ai_generated ? 'ai-yes' : 'ai-no'}`}>
              {evaluation.ai_generated ? 'Yes' : 'No'}
            </text>
          </view>
        </view>

        {/* Detailed Scores */}
        <view className="DetailCard">
          <text className="CardTitle">Detailed Performance Scores</text>
          <view className="ScoresList">
            {Object.entries(evaluation.scores).map(([key, value]: [string, any]) => (
              <view key={key} className="ScoreRow">
                <text className="ScoreRowLabel">
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </text>
                <view className="ScoreBar">
                  <view
                    className="ScoreBarFill"
                    style={{ width: `${(value as number) * 100}%` }}
                  />
                </view>
                <text className="ScoreRowValue">{((value as number) * 100).toFixed(0)}%</text>
              </view>
            ))}
          </view>
        </view>

        {/* Calculation Breakdown */}
        <view className="DetailCard">
          <text className="CardTitle">Score Calculation Breakdown</text>
          <view className="CalculationList">
            <view className="CalculationRow">
              <text className="CalculationLabel">Base Score</text>
              <text className="CalculationValue">{calculation.base.toFixed(1)}</text>
            </view>
            <view className="CalculationRow">
              <text className="CalculationLabel">Penalty</text>
              <text className="CalculationValue penalty">-{calculation.penalty.toFixed(1)}</text>
            </view>
            <view className="CalculationRow">
              <text className="CalculationLabel">Niche Bonus</text>
              <text className="CalculationValue bonus">+{calculation.bonus_niche.toFixed(1)}</text>
            </view>
            {calculation.bonus_aigc > 0 && (
              <view className="CalculationRow">
                <text className="CalculationLabel">AI Content Bonus</text>
                <text className="CalculationValue bonus">+{calculation.bonus_aigc.toFixed(1)}</text>
              </view>
            )}
            <view className="CalculationRow total">
              <text className="CalculationLabel">Final Score</text>
              <text className="CalculationValue total">{calculation.overall.toFixed(1)}</text>
            </view>
          </view>
        </view>

        {/* Compliance Information */}
        <view className="DetailCard">
          <text className="CardTitle">Compliance Analysis</text>
          <view className="ComplianceInfo">
            <view className="ComplianceItem">
              <text className="ComplianceLabel">Regulatory Flags</text>
              <text className={`ComplianceValue ${compliance.regulatory_flags === 'none' ? 'safe' : 'warning'}`}>
                {compliance.regulatory_flags.charAt(0).toUpperCase() + compliance.regulatory_flags.slice(1)}
              </text>
            </view>
            <view className="ComplianceItem">
              <text className="ComplianceLabel">Critical Violation</text>
              <text className={`ComplianceValue ${compliance.critical_violation ? 'danger' : 'safe'}`}>
                {compliance.critical_violation ? 'Yes' : 'No'}
              </text>
            </view>
            <view className="ComplianceItem">
              <text className="ComplianceLabel">Compliance Risk</text>
              <text className={`ComplianceValue ${compliance.compliance_risk > 0.3 ? 'warning' : 'safe'}`}>
                {(compliance.compliance_risk * 100).toFixed(0)}%
              </text>
            </view>
          </view>

          {compliance.violations.length > 0 && (
            <view className="ViolationsList">
              <text className="ViolationsTitle">Violations:</text>
              {compliance.violations.map((violation: any, index: number) => (
                <view key={`${selectedVideo.id}-violation-${index}`} className="ViolationItem">
                  <text className="ViolationFlag">{violation.flag}</text>
                  <text className="ViolationDescription">{violation.description}</text>
                </view>
              ))}
            </view>
          )}
        </view>

        {/* Issues */}
        {evaluation.issues.length > 0 && (
          <view className="DetailCard">
            <text className="CardTitle">Content Issues</text>
            <view className="IssuesList">
              {evaluation.issues.map((issue: any, index: number) => (
                <view key={`${selectedVideo.id}-issue-${index}`} className="IssueItem">
                  <text className="IssueType">{issue.issue}</text>
                  <text className="IssueDescription">{issue.description}</text>
                </view>
              ))}
            </view>
          </view>
        )}

        {/* Actionable Tips */}
        <view className="DetailCard">
          <text className="CardTitle">Actionable Improvement Tips</text>
          <view className="TipsList">
            {evaluation.actionable_tips.map((tip: string, index: number) => (
              <view key={`${selectedVideo.id}-tip-${index}`} className="TipItem">
                <text className="TipNumber">{index + 1}</text>
                <text className="TipText">{tip}</text>
              </view>
            ))}
          </view>
        </view>

        {/* Payout Information */}
        <view className="DetailCard">
          <text className="CardTitle">Payout Details</text>
          <view className="PayoutInfo">
            <view className="PayoutItem">
              <text className="PayoutLabel">Current Payout</text>
              <text className="PayoutValue">{formatNanas(payout.payout)}</text>
              <text className="PayoutSubtext">per 1K views</text>
            </view>
            <view className="PayoutItem">
              <text className="PayoutLabel">Maximum Possible</text>
              <text className="PayoutValue">{formatNanas(payout.max_payout)}</text>
              <text className="PayoutSubtext">per 1K views</text>
            </view>
            <view className="PayoutItem">
              <text className="PayoutLabel">Minimum Threshold</text>
              <text className="PayoutValue">{payout.min_payout_threshold.toFixed(0)}%</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  );
};

export function CreatorDashboard(
  props: Readonly<{
    onBack: () => void;
  }>,
) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    nanas: 15.46,
    pendingNanas: 0,
    totalEarned: 15.46,
    lastUpdated: Date.now()
  });
  const [earningsAnalytics, setEarningsAnalytics] = useState({
    todayEarnings: 0.00,
    weekEarnings: 50.70,
    monthEarnings: 122.29,
    totalViews: 366680,
    avgQseScore: 78
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showCashOut, setShowCashOut] = useState(false);
  const [showProfileScreen, setShowProfileScreen] = useState(false);
  const [showVideoDetail, setShowVideoDetail] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null);
  const walletCardRef = useRef<any>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistoryPoint[]>([]);

  // Exchange rate state
  const exchangeRate = 0.25; // 1 Nana = $0.25 USD
  // Video management state
  const [videos, setVideos] = useState<VideoData[]>([
    {
      id: '1',
      title: 'AI Video Enhancement Tool Demo',
      viewCount: '45,230',
      likeCount: '8,921',
      commentCount: '423',
      shareCount: '156',
      thumbnail: altoLogo,
      url: 'https://vt.tiktok.com/ZSAC3ntwQ',
      qseScore: 85,
      nanas: 0.55,
      impactScore: 85,
      qualityScore: 90,
      fairnessMultiplier: 0.5,
      totalScore: 84.5,
      category: 'technology',
      creatorTier: 'high',
      ledgerEntryId: 'ledger_aigc_demo',
      analysisTimestamp: Date.now() - 86400000
    },
    {
      id: '2',
      title: 'BMW Night Cruise Showcase',
      viewCount: '67,890',
      likeCount: '12,345',
      commentCount: '678',
      shareCount: '234',
      thumbnail: altoLogo,
      url: 'https://vt.tiktok.com/ZSAXCErmd',
      qseScore: 82,
      nanas: 0.49,
      impactScore: 80,
      qualityScore: 85,
      fairnessMultiplier: 0.9,
      totalScore: 81.9,
      category: 'automotive',
      creatorTier: 'high',
      ledgerEntryId: 'ledger_bmw_cruise',
      analysisTimestamp: Date.now() - 172800000
    },
    {
      id: '3',
      title: 'How Road Rollers Work - Engineering Explained',
      viewCount: '89,456',
      likeCount: '15,678',
      commentCount: '892',
      shareCount: '345',
      thumbnail: altoLogo,
      url: 'https://vt.tiktok.com/ZSAXCvEvs',
      qseScore: 93,
      nanas: 0.77,
      impactScore: 90,
      qualityScore: 95,
      fairnessMultiplier: 1.0,
      totalScore: 92.5,
      category: 'education',
      creatorTier: 'high',
      ledgerEntryId: 'ledger_road_roller',
      analysisTimestamp: Date.now() - 259200000
    },
    {
      id: '4',
      title: 'Chanel Money Weighing Mystery',
      viewCount: '23,456',
      likeCount: '4,567',
      commentCount: '234',
      shareCount: '89',
      thumbnail: altoLogo,
      url: 'https://vt.tiktok.com/ZSAXV8Ngv',
      qseScore: 42,
      nanas: 0.0,
      impactScore: 40,
      qualityScore: 45,
      fairnessMultiplier: 0.6,
      totalScore: 41.9,
      category: 'lifestyle',
      creatorTier: 'low',
      ledgerEntryId: 'ledger_chanel_money',
      analysisTimestamp: Date.now() - 345600000
    },
    {
      id: '5',
      title: 'Sad Cat Meowing in the Rain',
      viewCount: '34,567',
      likeCount: '6,789',
      commentCount: '345',
      shareCount: '123',
      thumbnail: altoLogo,
      url: 'https://vt.tiktok.com/ZSAXC3Bjt',
      qseScore: 58,
      nanas: 0.09,
      impactScore: 55,
      qualityScore: 60,
      fairnessMultiplier: 1.0,
      totalScore: 57.5,
      category: 'entertainment',
      creatorTier: 'low',
      ledgerEntryId: 'ledger_sad_cat',
      analysisTimestamp: Date.now() - 432000000
    },
    {
      id: '6',
      title: 'Train Passenger Tongue Sticking Trend',
      viewCount: '56,789',
      likeCount: '9,876',
      commentCount: '456',
      shareCount: '178',
      thumbnail: altoLogo,
      url: 'https://vt.tiktok.com/ZSAXCwkAw',
      qseScore: 78,
      nanas: 0.39,
      impactScore: 75,
      qualityScore: 80,
      fairnessMultiplier: 1.0,
      totalScore: 77.5,
      category: 'challenge',
      creatorTier: 'medium',
      ledgerEntryId: 'ledger_tongue_trend',
      analysisTimestamp: Date.now() - 518400000
    },
    {
      id: '7',
      title: 'Creative Visual Hook Ideas for Videos',
      viewCount: '78,901',
      likeCount: '14,567',
      commentCount: '789',
      shareCount: '267',
      thumbnail: altoLogo,
      url: 'https://vt.tiktok.com/ZSAC3ue7k',
      qseScore: 94,
      nanas: 0.81,
      impactScore: 90,
      qualityScore: 95,
      fairnessMultiplier: 1.0,
      totalScore: 94.0,
      category: 'education',
      creatorTier: 'high',
      ledgerEntryId: 'ledger_visual_hooks',
      analysisTimestamp: Date.now() - 604800000
    }
  ]);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [addVideoError, setAddVideoError] = useState('');

  // Function to update video thumbnails and titles with real TikTok data
  const updateVideosWithRealData = async () => {
    try {
      const updatedVideos = await Promise.all(
        videos.map(async (video) => {
          try {
            const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(video.url)}`;
            const response = await fetch(oembedUrl);

            if (!response.ok) {
              throw new Error(`Failed to fetch data for ${video.url}`);
            }

            const data = await response.json();

            return {
              ...video,
              title: data.title || video.title,
              thumbnail: data.thumbnail_url || video.thumbnail
            };
          } catch (error) {
            console.warn(`Failed to fetch real data for video ${video.id}, keeping existing data:`, error);
            return video; // Return original video if API call fails
          }
        })
      );

      setVideos(updatedVideos);
    } catch (error) {
      console.error('Error updating videos with real data:', error);
    }
  };

  useEffect(() => {
    loadWalletData();
    loadAnalytics();
    loadTransactions();
    loadBalanceHistory();
    updateVideosWithRealData(); // Update videos with real TikTok data

    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);

    // Scroll to wallet card after coin animation
    const scrollTimer = setTimeout(() => {
      if (walletCardRef.current) {
        walletCardRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 2000); // Wait 2 seconds for coin spin animation

    return () => {
      clearInterval(interval);
      clearTimeout(scrollTimer);
    };
  }, []);

  const loadWalletData = async () => {
    try {
      const balance = await getWalletBalance();
      setWalletBalance(balance);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
    }
  };

  const loadAnalytics = async () => {
    try {
      const analytics = await getEarningsAnalytics();
      setEarningsAnalytics(analytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    }
  };



  const loadTransactions = async () => {
    try {
      const txns = await getTransactionHistory(20);
      setTransactions(txns);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  const loadBalanceHistory = async () => {
    try {
      const history = await getBalanceHistory(30); // Last 30 days
      setBalanceHistory(history);
    } catch (error) {
      console.error('Failed to load balance history:', error);
    }
  };

  const formatUSD = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };



  const handleLogout = () => {
    setShowProfileScreen(false);
    props.onBack(); // This will take us back to the main page
  };

  const handleProfileClick = () => {
    setShowProfileScreen(true);
  };

  // Extract video ID from TikTok URL
  const extractTikTokVideoId = (url: string): string | null => {
    const patterns = [
      /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
      /vm\.tiktok\.com\/(\w+)/,
      /tiktok\.com\/t\/(\w+)/,
      /vt\.tiktok\.com\/(\w+)/
    ];

    for (const pattern of patterns) {
      const match = pattern.exec(url);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  // Fetch TikTok video data and generate mock stats
  const fetchTikTokVideoData = async (url: string): Promise<Partial<VideoData>> => {
    try {
      // Use TikTok oEmbed API for basic data (title, thumbnail)
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
      const response = await fetch(oembedUrl);

      if (!response.ok) {
        throw new Error(`TikTok oEmbed API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Generate realistic mock stats based on video ID
      const videoId = extractTikTokVideoId(url);
      const seed = parseInt(videoId?.slice(-6) || '0') || 0;
      const randomViews = Math.floor((seed % 90000) + 10000); // 10k-100k views
      const engagementRate = (seed % 10 + 5) / 100; // 5-15% engagement
      const randomLikes = Math.floor(randomViews * engagementRate);

      return {
        title: data.title || 'Untitled Video',
        thumbnail: data.thumbnail_url || altoLogo,
        url: url,
        viewCount: randomViews.toLocaleString(),
        likeCount: randomLikes.toLocaleString()
      };
    } catch (error) {
      console.error('Error fetching TikTok data:', error);
      // Fallback: create basic video data with realistic stats
      const videoId = extractTikTokVideoId(url);
      const randomViews = Math.floor(Math.random() * 100000) + 1000;
      const randomLikes = Math.floor(randomViews * (Math.random() * 0.1 + 0.05));

      return {
        title: `TikTok Video ${videoId || 'Unknown'}`,
        thumbnail: altoLogo,
        url: url,
        viewCount: randomViews.toLocaleString(),
        likeCount: randomLikes.toLocaleString()
      };
    }
  };

  // Analyze video with backend API
  const analyzeVideo = async (videoId: string): Promise<{
    qseScore: number;
    nanas: number;
    viewCount: string;
    likeCount: string;
    commentCount: string;
    shareCount: string;
    impactScore: number;
    qualityScore: number;
    fairnessMultiplier: number;
    totalScore: number;
    category: string;
    creatorTier: string;
    ledgerEntryId: string;
    isAnalyzing?: boolean;
  }> => {
    try {
      // Check if video is in mock data
      const mockData = getVideoDetails(videoId);

      if (!mockData) {
        // Video not in mock data - keep in analyzing state
        console.log(`Video ${videoId} not in mock data - keeping in analyzing state`);
        return {
          qseScore: 0,
          nanas: 0,
          viewCount: '0',
          likeCount: '0',
          commentCount: '0',
          shareCount: '0',
          impactScore: 0,
          qualityScore: 0,
          fairnessMultiplier: 1.0,
          totalScore: 0,
          category: 'general',
          creatorTier: 'small',
          ledgerEntryId: '',
          isAnalyzing: true
        };
      }

      const request: VideoAnalysisRequest = {
        videoId,
        url: tiktokUrl
      };

      const result = await mockAnalyzeVideoAPI(request);

      return {
        qseScore: result.qseScore,
        nanas: result.nanas,
        viewCount: result.viewCount,
        likeCount: result.likeCount,
        commentCount: result.commentCount,
        shareCount: result.shareCount,
        impactScore: result.impactScore,
        qualityScore: result.qualityScore,
        fairnessMultiplier: result.fairnessMultiplier,
        totalScore: result.totalScore,
        category: result.category,
        creatorTier: result.creatorTier,
        ledgerEntryId: result.ledgerEntryId
      };
    } catch (error) {
      console.error('Error analyzing video:', error);
      // For error cases, also keep in analyzing state to avoid showing mock data
      return {
        qseScore: 0,
        nanas: 0,
        viewCount: '0',
        likeCount: '0',
        commentCount: '0',
        shareCount: '0',
        impactScore: 0,
        qualityScore: 0,
        fairnessMultiplier: 1.0,
        totalScore: 0,
        category: 'general',
        creatorTier: 'small',
        ledgerEntryId: '',
        isAnalyzing: true
      };
    }
  };

  // Add new video
  const handleAddVideo = async () => {
    if (!tiktokUrl?.trim()) {
      setAddVideoError('Please enter a TikTok video URL');
      return;
    }

    const videoId = extractTikTokVideoId(tiktokUrl);
    if (!videoId) {
      setAddVideoError('Invalid TikTok video URL');
      return;
    }

    setIsAddingVideo(true);
    setAddVideoError('');

    try {
      // Fetch basic video data
      const videoData = await fetchTikTokVideoData(tiktokUrl);

      // Create temporary video entry
      const tempVideo: VideoData = {
        id: videoId,
        title: videoData.title || 'Loading...',
        viewCount: videoData.viewCount || '0',
        likeCount: videoData.likeCount || '0',
        commentCount: videoData.commentCount || '0',
        shareCount: videoData.shareCount || '0',
        thumbnail: videoData.thumbnail || altoLogo,
        url: tiktokUrl,
        isAnalyzing: true
      };

      setVideos(prev => [tempVideo, ...prev]);
      setShowAddVideoModal(false);
      setTiktokUrl('');

      // Analyze video in background
      const analysisResult = await analyzeVideo(videoId);

      // Only update video with analysis results if not in analyzing state
      if (!analysisResult.isAnalyzing) {
        // Update video with analysis results
        setVideos(prev => prev.map(video =>
          video.id === videoId
            ? {
              ...video,
              ...analysisResult,
              isAnalyzing: false
            }
            : video
        ));

        // Add nanas to wallet
        try {
          await addNanas(analysisResult.nanas, videoData.title || videoId, analysisResult.ledgerEntryId);
          await loadWalletData();
          await loadAnalytics();
          await loadTransactions(); // Refresh transaction history after adding video earnings
          await loadBalanceHistory(); // Refresh balance history after adding video earnings
        } catch (error) {
          console.error('Failed to add nanas to wallet:', error);
        }
      }
      // If analysisResult.isAnalyzing is true, video stays in analyzing state

    } catch (error) {
      console.error('Error adding video:', error);
      setAddVideoError('Failed to add video. Please try again.');
    } finally {
      setIsAddingVideo(false);
    }
  };

  const renderOverview = () => (
    <scroll-view className="DashboardSection" scroll-y>
      {/* <view className="SpinningCoinContainer">
        <image src={coinIcon} className="SpinningCoin" />
      </view> */}
      <view className="WalletCard" ref={walletCardRef}>
        <image src={graphIcon} className="WalletCardBackground" />
        <view className="WalletHeader">
          <text className="LastUpdated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </text>
        </view>

        <view className="WalletBalance">
          <text className="BalanceLabel">Wallet Balance</text>
          <text className="BalanceAmount">{formatNanas(walletBalance.nanas)}</text>
          <text className="BalanceUSD">
            ≈ {formatUSD(walletBalance.nanas * exchangeRate)} USD
          </text>
          <text className="ExchangeRate">
            Tier 1 Creator: 1 NANA = {formatUSD(exchangeRate)} USD
          </text>
          {walletBalance.pendingNanas > 0 && (
            <text className="PendingCredits">
              +{formatNanas(walletBalance.pendingNanas)} pending
              {` (≈ ${formatUSD(walletBalance.pendingNanas * exchangeRate)} USD)`}
            </text>
          )}
          <view className="CashOutButton" bindtap={() => setShowCashOut(true)}>
            <image src={coinIcon} className="CashOutButtonIcon" />
            <text className="CashOutButtonText">Withdraw</text>
          </view>
        </view>

        <view className="EarningsSummary">
          <view className="EarningsCard">
            <text className="EarningsLabel">Today's Earnings</text>
            <text className="EarningsAmount">{formatNanas(earningsAnalytics.todayEarnings)}</text>
            <text className="EarningsChange">No earnings yet today</text>
          </view>
          <view className="EarningsCard">
            <text className="EarningsLabel">Past 7 Days</text>
            <text className="EarningsAmount">{formatNanas(earningsAnalytics.weekEarnings)}</text>
            <text className="EarningsChange">+23.4% from last week</text>
          </view>
        </view>
      </view>

      <view className="QuickStats">
        <view className="StatCard stat-card-views">
          <view className="StatCardIcon">
            <image src={graphIcon} className="StatIcon" />
          </view>
          <text className="StatValue">366,680</text>
          <text className="StatLabel">Total Views</text>
          <text className="StatChange stat-positive">+12.5% this week</text>
        </view>
        <view className="StatCard stat-card-followers">
          <view className="StatCardIcon">
            <image src={groupIcon} className="StatIcon" />
          </view>
          <text className="StatValue">12,456</text>
          <text className="StatLabel">Active Followers</text>
          <text className="StatChange stat-positive">+8.3% this month</text>
        </view>
        <view className="StatCard stat-card-qse">
          <view className="StatCardIcon">
            <image src={analyticsYellow} className="StatIcon" />
          </view>
          <text className="StatValue">78%</text>
          <text className="StatLabel">Avg QSE Score</text>
          <text className="StatChange stat-positive">+2.1% this week</text>
        </view>
      </view>
    </scroll-view>
  );

  const renderVideos = () => (
    <view className="DashboardSection">
      <view className="SectionHeaderWithButton">
        <text className="SectionTitle">By-Video Breakdown</text>
        <text className="SectionSubtitle">Performance and earnings by video</text>
        <view className="AddVideoButton" bindtap={() => setShowAddVideoModal(true)}>
          <text className="AddVideoButtonText">+ Add Video</text>
        </view>
      </view>

      <scroll-view className="VideoList" scroll-y>
        {videos.map((video) => (
          <view
            key={video.id}
            className="VideoCard"
            bindtap={() => {
              setSelectedVideo(video);
              setShowVideoDetail(true);
            }}
          >
            <image src={video.thumbnail} className="VideoThumbnail" />
            <view className="VideoInfo">
              <text className="VideoTitle">{video.title}</text>
              <view className="VideoStats">
                <view className="VideoStat">
                  <text className="StatLabel">Views</text>
                  <text className="StatValue">
                    {video.isAnalyzing ? <view className="LoadingSpinner">
                        <text className="LoadingText">Analyzing...</text>
                      </view> : video.viewCount}
                  </text>
                </view>
                <view className="VideoStat">
                  <text className="StatLabel">Likes</text>
                  <text className="StatValue">
                    {video.isAnalyzing ? <view className="LoadingSpinner">
                        <text className="LoadingText">Analyzing...</text>
                      </view> : video.likeCount}
                  </text>
                </view>
                <view className="VideoStat">
                  <text className="StatLabel">Nanas Ratio</text>
                  <text className="StatValue">
                    {video.isAnalyzing ?
                      <view className="LoadingSpinner">
                        <text className="LoadingText">Analyzing...</text>
                      </view> : formatNanas(video.nanas || 0)}
                  </text>
                </view>
                <view className="VideoStat">
                  <text className="StatLabel">QSE Score</text>
                  <text className="StatValue">
                    {video.isAnalyzing ? (
                      <view className="LoadingSpinner">
                        <text className="LoadingText">Analyzing...</text>
                      </view>
                    ) : (
                      `${video.qseScore || 0}%`
                    )}
                  </text>
                </view>
              </view>
            </view>
          </view>
        ))}
      </scroll-view>

      {/* Add Video Modal */}
      {showAddVideoModal && (
        <view className="ModalOverlay" bindtap={() => setShowAddVideoModal(false)}>
          <view className="ModalContent" bindtap={(e) => e.stopPropagation()}>
            <view className="ModalHeader">
              <text className="ModalTitle">Add TikTok Video</text>
              <view className="ModalClose" bindtap={() => setShowAddVideoModal(false)}>
                <text className="ModalCloseText" style={{ marginTop: '-2px' }}>×</text>
              </view>
            </view>

            <view className="ModalBody">
              <text className="InputLabel">TikTok Video URL</text>
              {/* @ts-ignore */}
              <input
                className="VideoUrlInput"
                placeholder="https://www.tiktok.com/@username/video/123456789 or https://vt.tiktok.com/ABC123"
                value={tiktokUrl}
                bindinput={(e: any) => {
                  const value = e?.detail?.value ?? e?.target?.value ?? '';
                  setTiktokUrl(value);
                }}
              />
              {addVideoError && (
                <text className="ErrorMessage">{addVideoError}</text>
              )}
            </view>

            <view className="ModalFooter">
              <view className="ModalButton ModalButton--secondary" bindtap={() => setShowAddVideoModal(false)}>
                <text className="ModalButtonText">Cancel</text>
              </view>
              <view className="ModalButton ModalButton--primary" bindtap={handleAddVideo}>
                <text className="ModalButtonText">
                  {isAddingVideo ? 'Adding...' : 'Add Video'}
                </text>
              </view>
            </view>
          </view>
        </view>
      )}
    </view>
  );

  const renderReceipts = () => (
    <view className="DashboardSection">
      <view className="SectionHeader">
        <text className="SectionTitle">Transaction History</text>
        <text className="SectionSubtitle">All credits earned and cash-outs</text>
      </view>

      <scroll-view className="ReceiptsList" scroll-y>
        {transactions.length === 0 ? (
          <view className="EmptyState">
            <text className="EmptyStateText">No transactions yet</text>
            <text className="EmptyStateSubtext">Add videos to start earning credits</text>
          </view>
        ) : (
          transactions.map((transaction) => (
            <view key={transaction.id} className="ReceiptCard">
              <view className="ReceiptHeader">
                <text className={`ReceiptAmount ${transaction.type === 'nana' ? 'ReceiptAmount--positive' : 'ReceiptAmount--negative'}`}>
                  {transaction.type === 'nana' ? '+' : ''}{formatNanas(transaction.amount)}
                </text>
                <text className="ReceiptTime">
                  {new Date(transaction.timestamp).toLocaleDateString()}
                </text>
              </view>
              <text className="ReceiptVideo">{transaction.description}</text>
              {transaction.relatedVideoId && (
                <text className="ReceiptViewer">Video ID: {transaction.relatedVideoId}</text>
              )}
              {transaction.ledgerEntryId && (
                <text className="ReceiptLedger">Ledger: {transaction.ledgerEntryId}</text>
              )}
            </view>
          ))
        )}
      </scroll-view>
    </view>
  );

  // Prepare chart data
  const topEarningVideosData = videos
    .filter(video => video.nanas && video.nanas > 0)
    .sort((a, b) => (b.nanas || 0) - (a.nanas || 0))
    .slice(0, 5)
    .map(video => ({
      label: video.title,
      value: video.nanas || 0,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
    }));

  const qseScoreDistribution = videos
    .filter(video => video.qseScore)
    .reduce((acc, video) => {
      const score = video.qseScore || 0;
      let category = '';
      if (score >= 90) category = 'Excellent (90-100)';
      else if (score >= 80) category = 'Very Good (80-89)';
      else if (score >= 70) category = 'Good (70-79)';
      else if (score >= 60) category = 'Average (60-69)';
      else category = 'Needs Improvement (<60)';

      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  const getQseColor = (label: string): string => {
    if (label.includes('Excellent')) return '#4CAF50';
    if (label.includes('Very Good')) return '#8BC34A';
    if (label.includes('Good')) return '#FFC107';
    if (label.includes('Average')) return '#FF9800';
    return '#F44336';
  };

  const qsePieData = Object.entries(qseScoreDistribution).map(([label, value]) => ({
    label,
    value,
    color: getQseColor(label)
  }));

  const renderAnalytics = () => (
    <view className="DashboardSection">
      <view className="SectionHeader">
        <text className="SectionTitle">Analytics & Charts</text>
        <text className="SectionSubtitle">Performance insights and trends</text>
      </view>

      <scroll-view className="ChartsContainer" scroll-y>
        <view className="ChartCard">
          <text className="ChartTitle">Wallet Balance History (30 days)</text>
          <BalanceChart
            data={balanceHistory}
            width={300}
            height={150}
            className="ChartContent"
          />
        </view>

        <view className="ChartCard">
          <text className="ChartTitle">Top Earning Videos</text>
          {topEarningVideosData.length > 0 ? (
            <BarChart
              data={topEarningVideosData}
              width={300}
              height={220}
              showValues={true}
              className="ChartContent"
            />
          ) : (
            <view className="ChartPlaceholder">
              <text className="ChartPlaceholderText">No earning data available yet</text>
              <text className="ChartPlaceholderSubtext">Add videos to start tracking earnings</text>
            </view>
          )}
        </view>

        <view className="ChartCard">
          <text className="ChartTitle">QSE Score Distribution</text>
          {qsePieData.length > 0 ? (
            <HorizontalBarChart
              data={qsePieData}
              width={320}
              height={200}
              showPercentages={true}
              showValues={false}
              animated={true}
              className="ChartContent"
            />
          ) : (
            <view className="ChartPlaceholder">
              <text className="ChartPlaceholderText">No QSE data available</text>
              <text className="ChartPlaceholderSubtext">Add and analyze videos to see score distribution</text>
            </view>
          )}
        </view>

        <view className="ChartCard">
          <text className="ChartTitle">Monthly Earnings Trend</text>
          <view className="ChartPlaceholder">
            <text className="ChartPlaceholderText">Line chart showing earnings over time</text>
            <text className="ChartPlaceholderSubtext">Coming soon with more data</text>
          </view>
        </view>
      </scroll-view>
    </view>
  );



  return (
    <view className="CreatorDashboard">
      <view className="DashboardHeader">
        <view className="HeaderLeft">
        </view>
        <view className="HeaderCenter">
          <image src={altoLogo} className="DashboardLogo" />
        </view>
        <view className="HeaderRight">
          <view className="ProfileIcon" bindtap={handleProfileClick}>
            <image src={profilePicture} className="ProfileAvatar" />
          </view>
        </view>
      </view>

      <view className="DashboardContent">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'videos' && renderVideos()}
        {activeTab === 'receipts' && renderReceipts()}
        {activeTab === 'analytics' && renderAnalytics()}
      </view>

      <view className="BottomNavigation">
        <view
          className={`BottomNavItem ${activeTab === 'overview' ? 'BottomNavItem--active' : ''}`}
          bindtap={() => setActiveTab('overview')}
        >
          <HomeIcon isActive={activeTab === 'overview'} />
          <text className="BottomNavText">Home</text>
        </view>
        <view
          className={`BottomNavItem ${activeTab === 'videos' ? 'BottomNavItem--active' : ''}`}
          bindtap={() => setActiveTab('videos')}
        >
          <VideosIcon isActive={activeTab === 'videos'} />
          <text className="BottomNavText">Videos</text>
        </view>
        <view
          className={`BottomNavItem ${activeTab === 'receipts' ? 'BottomNavItem--active' : ''}`}
          bindtap={() => setActiveTab('receipts')}
        >
          <ReceiptsIcon isActive={activeTab === 'receipts'} />
          <text className="BottomNavText">Receipts</text>
        </view>
        <view
          className={`BottomNavItem ${activeTab === 'analytics' ? 'BottomNavItem--active' : ''}`}
          bindtap={() => setActiveTab('analytics')}
        >
          <AnalyticsIcon isActive={activeTab === 'analytics'} />
          <text className="BottomNavText">Analytics</text>
        </view>
      </view>

      {showCashOut && (
        <CashOut
          currentBalance={walletBalance.nanas}
          onCancel={() => setShowCashOut(false)}
          onSuccess={(request) => {
            setShowCashOut(false);
            loadWalletData();
            loadTransactions();
            loadBalanceHistory();
          }}
        />
      )}

      {showProfileScreen && (
        <view className="ProfileScreen" style="background: #000; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 2000; padding: 20px;">
          <view className="ProfileScreenContent" style="flex: 1; display: flex; flex-direction: column; max-width: 400px; margin: 0 auto; width: 100%;">
            <view className="ProfileHeader" style="display: flex; align-items: center; margin-bottom: 30px; position: relative; padding-top: 40px;">
              <view className="BackButton" bindtap={() => setShowProfileScreen(false)} style="padding: 8px; cursor: pointer;">
                <image src={backArrowIcon} style="width: 24px; height: 24px;" />
              </view>
              <text className="ProfileTitle" style="position: absolute; left: 50%; transform: translateX(-50%); font-size: 20px; font-weight: 700; color: #fff;">Profile</text>
            </view>

            <view className="ProfileInfo" style="text-align: center; margin-bottom: 30px; display: flex; flex-direction: column; align-items: center;">
              <image src={profilePicture} className="ProfileLargeAvatar" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid #ffd700; margin-bottom: 16px;" />
              <text className="ProfileName" style="font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 4px;">Alex Chen</text>
              <text className="ProfileUsername" style="font-size: 16px; color: rgba(255, 255, 255, 0.7); margin-bottom: 12px;">@alexcreates</text>
              <text className="ProfileBio" style="font-size: 14px; color: rgba(255, 255, 255, 0.8); line-height: 1.5; max-width: 300px; text-align: center;">Content creator passionate about sharing knowledge and creativity</text>
            </view>

            <view className="ProfileStats">
              <view className="ProfileStat">
                <text className="StatNumber">12,456</text>
                <text className="StatLabel">Followers</text>
              </view>
              <view className="ProfileStat">
                <text className="StatNumber">7</text>
                <text className="StatLabel">Videos</text>
              </view>
              <view className="ProfileStat">
                <text className="StatNumber">78%</text>
                <text className="StatLabel">Avg QSE</text>
              </view>
            </view>

            <view className="ProfileDetails">
              <view className="DetailItem">
                <text className="DetailLabel">Member Since</text>
                <text className="DetailValue">March 2024</text>
              </view>
              <view className="DetailItem">
                <text className="DetailLabel">Creator Tier</text>
                <text className="DetailValue">Small Creator</text>
              </view>
              <view className="DetailItem">
                <text className="DetailLabel">Total Earned</text>
                <text className="DetailValue">{formatNanas(walletBalance.totalEarned)}</text>
              </view>
            </view>

            <view className="LogoutSection" style="margin-top: 20px; padding-top: 20px;">
              <view className="CTAButton" bindtap={handleLogout} style="width: 100%; justify-content: center;">
                <text className="CTAButtonText">Logout</text>
              </view>
            </view>
          </view>
        </view>
      )}

      {showVideoDetail && (
        <VideoDetailScreen
          selectedVideo={selectedVideo}
          onBack={() => setShowVideoDetail(false)}
        />
      )}
    </view>
  );
}
