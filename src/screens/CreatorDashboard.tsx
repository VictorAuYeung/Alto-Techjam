/* eslint-disable react/no-unknown-property */
import { useEffect, useState, useRef } from 'react';
import '@lynx-js/react';
import arrowIcon from '../assets/arrow.png';
import backArrowIcon from '../assets/icons/back-arrow.png';
import graphIcon from '../assets/icons/graph.png';
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
import { CashOut } from './CashOut.js';
import { BalanceChart } from '../components/BalanceChart.js';

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

// Image-based icons for bottom navigation
const HomeIcon = ({ isActive }: { isActive: boolean }) => (
  <view className="NavIconContainer">
    <image src={isActive ? homeYellow : homeWhite} className="NavIcon"/>
  </view>
);
const VideosIcon = ({ isActive }: { isActive: boolean }) => (
  <view className="NavIconContainer">
    <image src={isActive ? videoYellow : videoWhite} className="NavIcon" style={{ width: '30px', height: '30px' }}/>
  </view>
);
const ReceiptsIcon = ({ isActive }: { isActive: boolean }) => (
  <view className="NavIconContainer">
    <image src={isActive ? receiptsYellow : receiptsWhite} className="NavIcon" style={{ width: '30px', height: '30px' }}/>
  </view>
);
const AnalyticsIcon = ({ isActive }: { isActive: boolean }) => (
  <view className="NavIconContainer">
    <image src={isActive ? analyticsYellow : analyticsWhite} className="NavIcon"/>
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

export function CreatorDashboard(
  props: Readonly<{
    onBack: () => void;
  }>,
) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    nanas: 57.35,
    pendingNanas: 12.45,
    totalEarned: 89.23,
    lastUpdated: Date.now()
  });
  const [earningsAnalytics, setEarningsAnalytics] = useState({
    todayEarnings: 12.45,
    weekEarnings: 89.23,
    monthEarnings: 156.78,
    totalViews: 36680,
    avgQseScore: 87
  });
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [showCashOut, setShowCashOut] = useState(false);
  const [showProfileScreen, setShowProfileScreen] = useState(false);
  const walletCardRef = useRef<any>(null);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistoryPoint[]>([]);
  
  // Exchange rate state
  const [exchangeRate, setExchangeRate] = useState(0.25); // 1 Nana = $0.25 USD
  
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
      nanas: 23.45,
      impactScore: 78,
      qualityScore: 92,
      fairnessMultiplier: 1.2,
      totalScore: 83,
      category: 'education',
      creatorTier: 'small',
      ledgerEntryId: 'ledger_001',
      analysisTimestamp: Date.now() - 86400000
    }
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

  const formatNanas = (amount: number) => {
    return `${amount.toFixed(3)} Nanas`;
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
      /tiktok\.com\/t\/(\w+)/
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
    <scroll-view className="DashboardSection" scroll-y>
      <view className="SpinningCoinContainer">
        <image src={coinIcon} className="SpinningCoin" />
      </view>
      <view className="WalletCard" ref={walletCardRef}>
        <image src={graphIcon} className="WalletCardBackground" />
        <view className="WalletHeader">
          <text className="LastUpdated">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </text>
        </view>
        
        <view className="WalletBalance">
          <text className="BalanceLabel">Total Wallet Balance</text>
          <text className="BalanceAmount">{formatNanas(walletBalance.nanas)}</text>
          <text className="ExchangeRate">1 Nana = {formatUSD(exchangeRate)} USD</text>
          {walletBalance.pendingNanas > 0 && (
            <text className="PendingCredits">+{formatNanas(walletBalance.pendingNanas)} pending</text>
          )}
          <view className="CashOutButton" bindtap={() => setShowCashOut(true)}>
            <image src={coinIcon} className="CashOutButtonIcon" />
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
                placeholder="https://www.tiktok.com/@username/video/123456789"
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

  const renderAnalytics = () => (
    <view className="DashboardSection">
      <view className="SectionHeader">
        <text className="SectionTitle">Analytics & Charts</text>
        <text className="SectionSubtitle">Performance insights and trends</text>
      </view>
      
      <scroll-view className="ChartsContainer" scroll-y>
        <view className="ChartCard">
          <text className="ChartTitle">Balance History (30 days)</text>
          <BalanceChart
            data={balanceHistory}
            width={300}
            height={150}
            className="ChartContent"
          />
        </view>

        <view className="ChartCard">
          <text className="ChartTitle">Top Earning Videos</text>
          <view className="ChartPlaceholder">
            <text className="ChartPlaceholderText">Bar chart of top 3 videos</text>
          </view>
        </view>

        <view className="ChartCard">
          <text className="ChartTitle">Engagement Quality Distribution</text>
          <view className="ChartPlaceholder">
            <text className="ChartPlaceholderText">Pie chart of QSE score distribution</text>
          </view>
        </view>
        
        <view className="ChartCard">
          <text className="ChartTitle">Engagement Quality Distribution</text>
          <view className="ChartPlaceholder">
            <text className="ChartPlaceholderText">Pie chart of QSE score distribution</text>
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
            <image src={altoLogo} className="ProfileAvatar" />
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
              <image src={altoLogo} className="ProfileLargeAvatar" style="width: 120px; height: 120px; border-radius: 50%; border: 4px solid #ffd700; margin-bottom: 16px;" />
              <text className="ProfileName" style="font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 4px;">Alex Chen</text>
              <text className="ProfileUsername" style="font-size: 16px; color: rgba(255, 255, 255, 0.7); margin-bottom: 12px;">@alexcreates</text>
              <text className="ProfileBio" style="font-size: 14px; color: rgba(255, 255, 255, 0.8); line-height: 1.5; max-width: 300px; text-align: center;">Content creator passionate about sharing knowledge and creativity</text>
            </view>

            <view className="ProfileStats">
              <view className="ProfileStat">
                <text className="StatNumber">1,247</text>
                <text className="StatLabel">Followers</text>
              </view>
              <view className="ProfileStat">
                <text className="StatNumber">89</text>
                <text className="StatLabel">Videos</text>
              </view>
              <view className="ProfileStat">
                <text className="StatNumber">87%</text>
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
    </view>
  );
}
