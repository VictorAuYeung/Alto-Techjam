/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from 'react';
import '@lynx-js/react';
import arrowIcon from '../assets/arrow.png';
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
import { CashOut } from './CashOut.js';
import { BalanceChart } from '../components/BalanceChart.js';
import { BarChart } from '../components/BarChart.js';
import { HorizontalBarChart } from '../components/HorizontalBarChart.js';

type Tab = 'overview' | 'videos' | 'receipts' | 'analytics';

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
    weekEarnings: 10.23,
    monthEarnings: 10.23,
    totalViews: 15420,
    avgQseScore: 87
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showCashOut, setShowCashOut] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistoryPoint[]>([]);
  
  // Video management state
  const [videos, setVideos] = useState<VideoData[]>([
    {
      id: '1',
      title: 'How to Make Perfect Coffee',
      viewCount: '15,420',
      likeCount: '2,847',
      commentCount: '156',
      shareCount: '89',
      thumbnail: altoLogo,
      url: 'https://www.tiktok.com/@alexcreates/video/123456789',
      qseScore: 87,
      nanas: 15.23,
      impactScore: 78,
      qualityScore: 92,
      fairnessMultiplier: 1.2,
      totalScore: 83,
      category: 'education',
      creatorTier: 'small',
      ledgerEntryId: 'ledger_001',
      analysisTimestamp: Date.now() - 86400000
    },
  ]);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [addVideoError, setAddVideoError] = useState('');

    useEffect(() => {
    loadWalletData();
    loadAnalytics();
    loadTransactions();
    loadBalanceHistory();

    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
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

  const formatNanas = (amount: number) => {
    return `${amount.toFixed(3)} Nanas`;
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
        throw new Error('Failed to fetch video data');
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
  }> => {
    try {
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
      // Fallback data for demo
      const randomViews = Math.floor(Math.random() * 100000);
      const randomLikes = Math.floor(randomViews * (Math.random() * 0.1 + 0.05));
      const randomComments = Math.floor(randomViews * (Math.random() * 0.05 + 0.005));
      const randomShares = Math.floor(randomViews * (Math.random() * 0.03 + 0.002));
      
      return {
        qseScore: Math.floor(Math.random() * 30) + 70,
        nanas: Math.random() * 50,
        viewCount: randomViews.toLocaleString(),
        likeCount: randomLikes.toLocaleString(),
        commentCount: randomComments.toLocaleString(),
        shareCount: randomShares.toLocaleString(),
        impactScore: Math.floor(Math.random() * 40) + 60,
        qualityScore: Math.floor(Math.random() * 30) + 70,
        fairnessMultiplier: 1.0,
        totalScore: Math.floor(Math.random() * 30) + 70,
        category: 'general',
        creatorTier: 'small',
        ledgerEntryId: `ledger_fallback_${Date.now()}`
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

    } catch (error) {
      console.error('Error adding video:', error);
      setAddVideoError('Failed to add video. Please try again.');
    } finally {
      setIsAddingVideo(false);
    }
  };

  const renderOverview = () => (
    <view className="DashboardSection">
      <view className="WalletCard">
        <view className="WalletHeader">
          <view className="CreatorInfo">
            <image src={altoLogo} className="CreatorAvatar" />
            <view className="CreatorDetails">
              <text className="CreatorName">Alex Chen</text>
              <text className="CreatorHandle">@alexcreates</text>
            </view>
          </view>
          <text className="LastUpdated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </text>
        </view>
        
        <view className="WalletBalance">
          <text className="BalanceLabel">Total Wallet Balance</text>
          <text className="BalanceAmount">{formatNanas(walletBalance.nanas)}</text>
          {walletBalance.pendingNanas > 0 && (
            <text className="PendingCredits">+{formatNanas(walletBalance.pendingNanas)} pending</text>
          )}
          <view className="CashOutButton" bindtap={() => setShowCashOut(true)}>
            <text className="CashOutButtonText">Cash Out</text>
          </view>
        </view>

        <view className="EarningsSummary">
          <view className="EarningsCard">
            <text className="EarningsLabel">Today's Earnings</text>
            <text className="EarningsAmount">{formatNanas(earningsAnalytics.todayEarnings)}</text>
            <text className="EarningsChange">+12.5% from yesterday</text>
          </view>
          <view className="EarningsCard">
            <text className="EarningsLabel">Past 7 Days</text>
            <text className="EarningsAmount">{formatNanas(earningsAnalytics.weekEarnings)}</text>
            <text className="EarningsChange">+8.3% from last week</text>
          </view>
        </view>
      </view>

      <view className="QuickStats">
        <view className="StatCard">
          <text className="StatValue">36,680</text>
          <text className="StatLabel">Total Views</text>
        </view>
        <view className="StatCard">
          <text className="StatValue">1,247</text>
          <text className="StatLabel">Active Followers</text>
        </view>
        <view className="StatCard">
          <text className="StatValue">87%</text>
          <text className="StatLabel">Avg QSE Score</text>
        </view>
      </view>
    </view>
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
          <view key={video.id} className="VideoCard">
            <image src={video.thumbnail} className="VideoThumbnail" />
            <view className="VideoInfo">
              <text className="VideoTitle">{video.title}</text>
              <view className="VideoStats">
                <view className="VideoStat">
                  <text className="StatLabel">Views</text>
                  <text className="StatValue">{video.viewCount}</text>
                </view>
                <view className="VideoStat">
                  <text className="StatLabel">Likes</text>
                  <text className="StatValue">{video.likeCount}</text>
                </view>
                <view className="VideoStat">
                  <text className="StatLabel">Nanas</text>
                  <text className="StatValue">
                    {video.isAnalyzing ? 'Analyzing...' : formatNanas(video.nanas || 0)}
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
                <text className="ModalCloseText">×</text>
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
          <view className="BackButton" bindtap={props.onBack}>
            <image src={arrowIcon} className="BackIcon" />
            <text className="BackText">Debug</text>
          </view>
        </view>
        <view className="HeaderCenter">
          <image src={altoLogo} className="DashboardLogo" />
        </view>
        <view className="HeaderRight">
          <view className="ProfileIcon">
            <image src={altoLogo} className="ProfileAvatar" />
          </view>
        </view>
      </view>

      <view className="TabNavigation">
        <view 
          className={`Tab ${activeTab === 'overview' ? 'Tab--active' : ''}`}
          bindtap={() => setActiveTab('overview')}
        >
          <text className="TabText">Overview</text>
        </view>
        <view 
          className={`Tab ${activeTab === 'videos' ? 'Tab--active' : ''}`}
          bindtap={() => setActiveTab('videos')}
        >
          <text className="TabText">Videos</text>
        </view>
        <view 
          className={`Tab ${activeTab === 'receipts' ? 'Tab--active' : ''}`}
          bindtap={() => setActiveTab('receipts')}
        >
          <text className="TabText">Receipts</text>
        </view>
        <view 
          className={`Tab ${activeTab === 'analytics' ? 'Tab--active' : ''}`}
          bindtap={() => setActiveTab('analytics')}
        >
          <text className="TabText">Analytics</text>
        </view>
      </view>

      <view className="DashboardContent">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'videos' && renderVideos()}
        {activeTab === 'receipts' && renderReceipts()}
        {activeTab === 'analytics' && renderAnalytics()}
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
    </view>
  );
}
