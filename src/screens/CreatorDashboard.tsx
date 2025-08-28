/* eslint-disable react/no-unknown-property */
import { useEffect, useState } from 'react';
import '@lynx-js/react';
import arrowIcon from '../assets/arrow.png';
import altoLogo from '../assets/logos/13.png';

type Tab = 'overview' | 'videos' | 'receipts' | 'analytics';

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

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCredits = (amount: number) => {
    return `${amount.toFixed(3)} credits`;
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
          <text className="StatLabel">Active Viewers</text>
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
      </view>
      
      <view className="VideoList">
        <view className="VideoCard">
          <image src={altoLogo} className="VideoThumbnail" />
          <view className="VideoInfo">
            <text className="VideoTitle">How to Make Perfect Coffee</text>
            <view className="VideoStats">
              <view className="VideoStat">
                <text className="StatLabel">Views</text>
                <text className="StatValue">15,420</text>
              </view>
              <view className="VideoStat">
                <text className="StatLabel">Credits</text>
                <text className="StatValue">23.450 credits</text>
              </view>
              <view className="VideoStat">
                <text className="StatLabel">QSE Score</text>
                <text className="StatValue">87%</text>
              </view>
            </view>
          </view>
        </view>
      </view>
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
          <text className="ReceiptViewer">From: user_abc123</text>
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
            <text className="BackText">Back</text>
          </view>
          <image src={altoLogo} className="DashboardLogo" />
        </view>
        <text className="DashboardTitle">Creator Dashboard</text>
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
