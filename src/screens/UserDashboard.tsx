/* eslint-disable react/no-unknown-property */
import { useCallback, useEffect, useState, useRef } from 'react';
import '@lynx-js/react';
import arrowIcon from '../assets/arrow.png';
import altoLogo from '../assets/logos/13.png';
import { TopUp } from './TopUp.js';

type Tab = 'session' | 'feed' | 'receipts' | 'analytics' | 'security';
type SessionStatus = 'inactive' | 'active' | 'throttled' | 'held' | 'blocked';

export function UserDashboard(
  props: Readonly<{
    onBack: () => void;
  }>,
) {
  const [activeTab, setActiveTab] = useState<Tab>('session');
  const [walletCredits, setWalletCredits] = useState(25.67);
  const [sessionBudget, setSessionBudget] = useState(1.00);
  const [sessionSpent, setSessionSpent] = useState(0.00);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('inactive');
  const [currentPayoutPerSec, setCurrentPayoutPerSec] = useState(0.000);
  const [currentQseScore, setCurrentQseScore] = useState(0.85);
  const [deviceFingerprint] = useState('fp_7d2a9b3c');
  const [showTopUp, setShowTopUp] = useState(false);
  const [showOutOfCreditsBanner, setShowOutOfCreditsBanner] = useState(false);
  
  const sessionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const engagementIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
      if (engagementIntervalRef.current) clearInterval(engagementIntervalRef.current);
    };
  }, []);

  const formatCredits = (amount: number) => {
    return `${amount.toFixed(4)} credits`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(0)}%`;
  };

  const handleTopUp = useCallback(() => {
    setWalletCredits(prev => prev + 10.00);
  }, []);

  const handleStartSession = useCallback(() => {
    setSessionStatus('active');
    setSessionSpent(0.00);
    
    sessionIntervalRef.current = setInterval(() => {
      setSessionSpent(prev => {
        const newSpent = prev + 0.001;
        if (newSpent >= sessionBudget) {
          setSessionStatus('inactive');
          // If exhausted, suggest top up via banner
          if (walletCredits <= 0) {
            setShowOutOfCreditsBanner(true);
          }
          return prev;
        }
        return newSpent;
      });
    }, 1000);

    engagementIntervalRef.current = setInterval(() => {
      setCurrentPayoutPerSec(Math.random() * 0.002);
      setCurrentQseScore(Math.random() * 0.3 + 0.7);
    }, 1000);
  }, [sessionBudget]);

  const handleEndSession = useCallback(() => {
    setSessionStatus('inactive');
    if (sessionIntervalRef.current) clearInterval(sessionIntervalRef.current);
    if (engagementIntervalRef.current) clearInterval(engagementIntervalRef.current);
  }, []);

  const renderSessionControls = () => (
    <view className="DashboardSection">
      {walletCredits === 0 && (
        <view className="NoticeBanner NoticeBanner--warning" aria-live="polite">
          <text className="NoticeText">Your wallet is empty.</text>
          <view className="NoticeAction" bindtap={() => setShowTopUp(true)}>
            <text className="NoticeLink">Top Up</text>
          </view>
        </view>
      )}
      {showOutOfCreditsBanner && (
        <view className="NoticeBanner NoticeBanner--warning" aria-live="polite">
          <text className="NoticeText">You’re out of credits.</text>
          <view className="NoticeAction" bindtap={() => setShowTopUp(true)}>
            <text className="NoticeLink">Top Up</text>
          </view>
        </view>
      )}
      <view className="WalletCard">
        <view className="WalletHeader">
          <view className="UserInfo">
            <image src={altoLogo} className="UserAvatar" />
            <view className="UserDetails">
              <text className="UserName">John Doe</text>
              <text className="UserHandle">@johndoe</text>
            </view>
          </view>
          <view className="TopUpButton" bindtap={() => setShowTopUp(true)}>
            <text className="TopUpText">Top Up</text>
          </view>
        </view>
        
        <view className="WalletBalance">
          <text className="BalanceLabel">Wallet Credits</text>
          <text className="BalanceAmount">{formatCredits(walletCredits)}</text>
        </view>
      </view>

      <view className="SessionCard">
        <view className="SessionHeader">
          <text className="SessionTitle">Session Controls</text>
          <view className={`SessionStatus SessionStatus--${sessionStatus}`}>
            <text className="StatusText">
              {sessionStatus === 'active' ? 'Active' : 
               sessionStatus === 'throttled' ? 'Throttled' :
               sessionStatus === 'held' ? 'Held' :
               sessionStatus === 'blocked' ? 'Blocked' : 'Inactive'}
            </text>
          </view>
        </view>

        <view className="SessionBudget">
          <view className="BudgetInfo">
            <text className="BudgetLabel">Session Budget</text>
            <text className="BudgetAmount">{formatCredits(sessionBudget)}</text>
          </view>
          <view className="BudgetInfo">
            <text className="BudgetLabel">Remaining</text>
            <text className="BudgetAmount">{formatCredits(sessionBudget - sessionSpent)}</text>
          </view>
        </view>

        <view className="BudgetProgress">
          <view className="ProgressBar">
            <view 
              className="ProgressFill" 
              style={{ width: `${(sessionSpent / sessionBudget) * 100}%` }}
            />
          </view>
          <text className="ProgressText">
            {formatPercentage(sessionSpent / sessionBudget)} utilized
          </text>
        </view>

        <view className="SessionActions">
          {sessionStatus === 'inactive' ? (
            <view className="StartButton" bindtap={handleStartSession}>
              <text className="ButtonText">Start Session</text>
            </view>
          ) : (
            <view className="EndButton" bindtap={handleEndSession}>
              <text className="ButtonText">End Session</text>
            </view>
          )}
        </view>
      </view>
    </view>
  );

  const renderVideoFeed = () => (
    <view className="DashboardSection">
      <view className="SectionHeader">
        <text className="SectionTitle">Video Feed</text>
        <text className="SectionSubtitle">Engage with creators and support content</text>
      </view>
      
      <scroll-view className="VideoFeed" scroll-y>
        <view className="VideoCard">
          <image src={altoLogo} className="VideoThumbnail" />
          <view className="VideoInfo">
            <text className="VideoTitle">How to Make Perfect Coffee</text>
            <text className="VideoCreator">Alex Chen @alexcreates</text>
            <text className="VideoStats">Watched: 0s</text>
            
            <view className="VideoActions">
              <view className="ActionButton">
                <text className="ActionText">❤️</text>
              </view>
              <view className="ActionButton">
                <text className="ActionText">💬</text>
              </view>
              <view className="ActionButton">
                <text className="ActionText">📤</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  );

  const renderReceipts = () => (
    <view className="DashboardSection">
      <view className="SectionHeader">
        <text className="SectionTitle">My Micro-Payments</text>
        <text className="SectionSubtitle">Real-time outbound transactions</text>
      </view>
      
      <scroll-view className="ReceiptsList" scroll-y>
        <view className="ReceiptCard">
          <view className="ReceiptHeader">
            <text className="ReceiptAmount">-0.0064 credits</text>
            <text className="ReceiptTime">2 min ago</text>
          </view>
          <text className="ReceiptVideo">How to Make Perfect Coffee</text>
          <text className="ReceiptCreator">To: Alex Chen</text>
          <view className="ReceiptReason">
            <text className="ReasonText">85% watch, high authenticity</text>
            <text className="QseScore">QSE: 85%</text>
          </view>
        </view>
      </scroll-view>
    </view>
  );

  const renderAnalytics = () => (
    <view className="DashboardSection">
      <view className="SectionHeader">
        <text className="SectionTitle">History & Analytics</text>
        <text className="SectionSubtitle">Your contribution insights</text>
      </view>
      
      <scroll-view className="AnalyticsContainer" scroll-y>
        <view className="ChartCard">
          <text className="ChartTitle">Contributions Over Time (7 Days)</text>
          <view className="ChartPlaceholder">
            <text className="ChartPlaceholderText">Bar chart showing daily contributions</text>
          </view>
        </view>

        <view className="ChartCard">
          <text className="ChartTitle">Top Creators Supported</text>
          <view className="ChartPlaceholder">
            <text className="ChartPlaceholderText">Bar chart of top 3 creators</text>
          </view>
        </view>

        <view className="ChartCard">
          <text className="ChartTitle">Quality Score Distribution</text>
          <view className="ChartPlaceholder">
            <text className="ChartPlaceholderText">Pie chart of QSE score distribution</text>
          </view>
        </view>
      </scroll-view>
    </view>
  );

  const renderSecurity = () => (  
    <view className="DashboardSection">
      <view className="SectionHeader">
        <text className="SectionTitle">Security & Device</text>
        <text className="SectionSubtitle">Account security and integrity</text>
      </view>
      
      <view className="SecurityCard">
        <view className="SecurityItem">
          <text className="SecurityLabel">Device Fingerprint</text>
          <text className="SecurityValue">{deviceFingerprint}</text>
        </view>
        
        <view className="SecurityItem">
          <text className="SecurityLabel">Active Sessions</text>
          <text className="SecurityValue">1 device</text>
        </view>
        
        <view className="SecurityItem">
          <text className="SecurityLabel">Integrity Status</text>
          <text className="SecurityValue SecurityValue--success">✓ All good</text>
        </view>
        
        <view className="SecurityItem">
          <text className="SecurityLabel">Multi-tab Detection</text>
          <text className="SecurityValue SecurityValue--success">✓ None detected</text>
        </view>
        
        <view className="SecurityItem">
          <text className="SecurityLabel">Replay Protection</text>
          <text className="SecurityValue SecurityValue--success">✓ Active</text>
        </view>
        
        <view className="SecurityItem">
          <text className="SecurityLabel">Last Velocity Event</text>
          <text className="SecurityValue">None</text>
        </view>
      </view>
    </view>
  );

  return (
    <view className="UserDashboard">
      {showTopUp && (
        <view className="TopUpOverlay">
          <TopUp
            currentBalance={walletCredits}
            isSessionActive={sessionStatus === 'active'}
            sessionBudget={sessionBudget}
            sessionSpent={sessionSpent}
            onCancel={() => setShowTopUp(false)}
            onSuccess={(p) => {
              // Update wallet credits from payload
              setWalletCredits(p.newBalance);
              // Optionally update session budget
              if (p.addToSession && typeof p.newSessionBudget === 'number') {
                setSessionBudget(p.newSessionBudget);
              }
              setShowTopUp(false);
              setShowOutOfCreditsBanner(false);
            }}
          />
        </view>
      )}
      <view className="DashboardHeader">
        <view className="HeaderLeft">
          <view className="BackButton" bindtap={props.onBack}>
            <image src={arrowIcon} className="BackIcon" />
            <text className="BackText">Back</text>
          </view>
          <image src={altoLogo} className="DashboardLogo" />
        </view>
        <text className="DashboardTitle">User Dashboard</text>
      </view>

      <view className="TabNavigation">
        <view 
          className={`Tab ${activeTab === 'session' ? 'Tab--active' : ''}`}
          bindtap={() => setActiveTab('session')}
        >
          <text className="TabText">Session</text>
        </view>
        <view 
          className={`Tab ${activeTab === 'feed' ? 'Tab--active' : ''}`}
          bindtap={() => setActiveTab('feed')}
        >
          <text className="TabText">Feed</text>
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
        <view 
          className={`Tab ${activeTab === 'security' ? 'Tab--active' : ''}`}
          bindtap={() => setActiveTab('security')}
        >
          <text className="TabText">Security</text>
        </view>
      </view>

      <view className="DashboardContent">
        {activeTab === 'session' && renderSessionControls()}
        {activeTab === 'feed' && renderVideoFeed()}
        {activeTab === 'receipts' && renderReceipts()}
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'security' && renderSecurity()}
      </view>

      {sessionStatus === 'active' && (
        <view className="StreamingChip">
          <view className="StreamingHeader">
            <text className="StreamingLabel">Streaming...</text>
            <text className="StreamingScore">QSE: {formatPercentage(currentQseScore)}</text>
          </view>
          <text className="StreamingPayout">
            {formatCredits(currentPayoutPerSec)}/sec
          </text>
          <text className="StreamingBudget">
            {formatCredits(sessionBudget - sessionSpent)} remaining
          </text>
        </view>
      )}
    </view>
  );
}
