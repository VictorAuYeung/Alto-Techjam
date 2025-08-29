/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from 'react';
import '@lynx-js/react';
import arrowIcon from '../assets/arrow.png';
import { mockAnalyzeVideoAPI } from '../services/videoAnalysis.js';
import type { VideoAnalysisRequest } from '../services/videoAnalysis.js';
import altoLogo from '../assets/logos/alto-logo.png';

type Tab = 'overview' | 'videos' | 'receipts' | 'analytics';

interface VideoData {
  id: string;
  title: string;
  viewCount: string;
  likeCount: string;
  thumbnail: string;
  url: string;
  qseScore?: number;
  credits?: number;
  isAnalyzing?: boolean;
}

export function CreatorDashboard(
  props: Readonly<{
    onBack: () => void;
  }>,
) {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [walletBalance, setWalletBalance] = useState(57.35);
  const [todayEarnings, setTodayEarnings] = useState(12.45);
  const [weekEarnings, setWeekEarnings] = useState(89.23);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  // Video management state
  const [videos, setVideos] = useState<VideoData[]>([
    {
      id: '1',
      title: 'How to Make Perfect Coffee',
      viewCount: '15,420',
      likeCount: '2,847',
      thumbnail: altoLogo,
      url: 'https://www.tiktok.com/@alexcreates/video/123456789',
      qseScore: 87,
      credits: 23.45
    }
  ]);
  const [showAddVideoModal, setShowAddVideoModal] = useState(false);
  const [tiktokUrl, setTiktokUrl] = useState('');
  const [isAddingVideo, setIsAddingVideo] = useState(false);
  const [addVideoError, setAddVideoError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCredits = (amount: number) => {
    return `\$${amount.toFixed(3)}`;
  };

  // Extract video ID from TikTok URL
  const extractTikTokVideoId = (url: string): string | null => {
    const patterns = [
      /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
      /vm\.tiktok\.com\/(\w+)/,
      /tiktok\.com\/t\/(\w+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  // Fetch TikTok video data using oEmbed API and additional data fetching
  const fetchTikTokVideoData = async (url: string): Promise<Partial<VideoData>> => {
    try {
      // Use TikTok oEmbed API for basic data
      const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
      const response = await fetch(oembedUrl);
      
      if (!response.ok) {
        throw new Error('Failed to fetch video data');
      }
      
      const data = await response.json();
      
      // Try to fetch additional stats using TikTok's web scraping approach
      let viewCount = '0';
      let likeCount = '0';
      
      try {
        // Attempt to fetch video stats from TikTok's web page
        const videoId = extractTikTokVideoId(url);
        if (videoId) {
          // Use a TikTok stats API service (you may need to replace with your preferred service)
          const statsResponse = await fetch(`https://api.tiktok.com/video/info/?video_id=${videoId}`, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            if (statsData.stats) {
              viewCount = statsData.stats.play_count?.toString() || '0';
              likeCount = statsData.stats.digg_count?.toString() || '0';
            }
          }
        }
      } catch (statsError) {
        console.log('Could not fetch detailed stats, using fallback data');
        // Generate realistic fallback data for demo purposes
        const randomViews = Math.floor(Math.random() * 100000) + 1000;
        const randomLikes = Math.floor(randomViews * (Math.random() * 0.1 + 0.05)); // 5-15% like rate
        viewCount = randomViews.toLocaleString();
        likeCount = randomLikes.toLocaleString();
      }
      
      return {
        title: data.title || 'Untitled Video',
        thumbnail: data.thumbnail_url || altoLogo,
        url: url,
        viewCount: viewCount,
        likeCount: likeCount
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
  const analyzeVideo = async (videoId: string): Promise<{ qseScore: number; credits: number; viewCount: string; likeCount: string }> => {
    try {
      const request: VideoAnalysisRequest = {
        videoId,
        url: tiktokUrl
      };

      const result = await mockAnalyzeVideoAPI(request);
      
      // Generate realistic like count based on view count
      const viewCountNum = parseInt(result.viewCount.replace(/,/g, '')) || 0;
      const likeCount = Math.floor(viewCountNum * (Math.random() * 0.1 + 0.05)).toLocaleString(); // 5-15% like rate
      
      return {
        qseScore: result.qseScore,
        credits: result.credits,
        viewCount: result.viewCount,
        likeCount: likeCount
      };
    } catch (error) {
      console.error('Error analyzing video:', error);
      // Fallback data for demo
      const randomViews = Math.floor(Math.random() * 100000);
      const randomLikes = Math.floor(randomViews * (Math.random() * 0.1 + 0.05));
      
      return {
        qseScore: Math.floor(Math.random() * 30) + 70,
        credits: Math.random() * 50,
        viewCount: randomViews.toLocaleString(),
        likeCount: randomLikes.toLocaleString()
      };
    }
  };

  // Add new video
  const handleAddVideo = async () => {
    if (!tiktokUrl || !tiktokUrl.trim()) {
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
          <text className="BalanceAmount">{formatCredits(walletBalance)}</text>
        </view>

        <view className="EarningsSummary">
          <view className="EarningsCard">
            <text className="EarningsLabel">Today's Earnings</text>
            <text className="EarningsAmount">{formatCredits(todayEarnings)}</text>
            <text className="EarningsChange">+12.5% from yesterday</text>
          </view>
          <view className="EarningsCard">
            <text className="EarningsLabel">Past 7 Days</text>
            <text className="EarningsAmount">{formatCredits(weekEarnings)}</text>
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
      <view className="SectionHeader">
        <text className="SectionTitle">By-Video Breakdown</text>
        <text className="SectionSubtitle">Performance and earnings by video</text>
        <view className="AddVideoButton" bindtap={() => setShowAddVideoModal(true)}>
          <text className="AddVideoButtonText">+ Add Video</text>
        </view>
      </view>
      
      <view className="VideoList">
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
                  <text className="StatLabel">Credits</text>
                  <text className="StatValue">
                    {video.isAnalyzing ? 'Analyzing...' : formatCredits(video.credits || 0)}
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
      </view>

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
        <text className="SectionTitle">Recent Receipts</text>
        <text className="SectionSubtitle">Live stream of incoming transactions</text>
      </view>
      
      <view className="ReceiptsList">
        <view className="ReceiptCard">
          <view className="ReceiptHeader">
            <text className="ReceiptAmount">+0.006 credits</text>
            <text className="ReceiptTime">2 min ago</text>
          </view>
          <text className="ReceiptVideo">How to Make Perfect Coffee</text>
          <text className="ReceiptViewer">From: follower_abc123</text>
          <view className="ReceiptScores">
            <text className="ScoreLabel">QSE: 87%</text>
            <text className="ScoreLabel">Watch: 95%</text>
            <text className="ScoreLabel">Engagement: 92%</text>
          </view>
        </view>
      </view>
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
          <text className="ChartTitle">Earnings Over Time (24h)</text>
          <view className="ChartPlaceholder">
            <text className="ChartPlaceholderText">Line chart showing hourly earnings</text>
          </view>
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
    </view>
  );
}
