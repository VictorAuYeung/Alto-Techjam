/* eslint-disable react/no-unknown-property */
import { useCallback, useEffect, useMemo, useState } from 'react';
import '@lynx-js/react';

import './App.css';
import altoLogo from './assets/logos/alto-logo.png';
import banana1 from './assets/splash-page/bananas/1.png';
import banana2 from './assets/splash-page/bananas/2.png';
import banana3 from './assets/splash-page/bananas/3.png';
import banana4 from './assets/splash-page/bananas/4.png';
import banana5 from './assets/splash-page/bananas/5.png';
import banana6 from './assets/splash-page/bananas/6.png';
import banana7 from './assets/splash-page/bananas/7.png';
import coinBanana from './assets/coins/coin-banana.png';
import coinBananas from './assets/coins/coin-bananas.png';
import groupIcon from './assets/icons/group.png';
import CreatorSignup from './screens/CreatorSignup.js';
import { CreatorDashboard } from './screens/CreatorDashboard.js';

export function App(
  props: Readonly<{
    onRender?: () => void;
  }>,
) {
  const [stage, setStage] = useState<'splash' | 'home' | 'signup' | 'dashboard'>('splash');
  const [isSplashFading, setIsSplashFading] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(false);
  const [isCoinSplitting, setIsCoinSplitting] = useState(false);

  const bananas = useMemo(() => [banana1, banana2, banana3, banana4, banana5, banana6, banana7], []);
  const particleCount = 20;

  useEffect(() => {
    console.info('Alto: streaming micro-credits for short-form creators');
    
    // Coin splitting animation starts at 1 second, logo appears at 2.5 seconds, transition at 5 seconds
    if (stage === 'splash') {
      const coinTimer = setTimeout(() => {
        setIsCoinSplitting(true);
      }, 1000);
      
      const logoTimer = setTimeout(() => {
        setIsLogoVisible(true);
      }, 2500);
      
      const transitionTimer = setTimeout(() => {
        setIsSplashFading(true);
        setTimeout(() => {
          setStage('home');
        }, 800); // Wait for fade transition to complete
      }, 5000);
      
      return () => {
        clearTimeout(coinTimer);
        clearTimeout(logoTimer);
        clearTimeout(transitionTimer);
      };
    }
  }, [stage]);
  
  props.onRender?.();

  const onSelectCreator = useCallback(() => {
    setTimeout(() => {
      setStage('signup');
    }, 0);
  }, []);

  const onLogin = useCallback(() => {
    setTimeout(() => {
      setStage('dashboard');
    }, 0);
  }, []);



  const onSignupBack = useCallback(() => {
    setTimeout(() => {
      setStage('home');
    }, 0);
  }, []);

  const onDashboardBack = useCallback(() => {
    setTimeout(() => {
      setStage('home');
    }, 0);
  }, []);

  const onCreatorSubmit = useCallback(
    (payload: {
      displayName: string;
      email: string;
      handle: string;
      niche: string;
    }) => {
      console.info('Creator signup submit', payload);
      // integrate API here when backend is ready
    },
    [],
  );

  return (
    <view>
      <view className="Background" />
      {stage === 'home' && (
      <view className="BananaParticles">
        {Array.from({ length: particleCount }).map((_, index) => {
          const particleId = `particle-${index}`;
          const bananaIndex = index % bananas.length;
          return (
            <view
              key={particleId}
              className="BananaParticle"
              style={{
                left: `${Math.min(100, Math.max(0, ((index + 0.5) / particleCount) * 100 + (Math.random() * 15 - 7.5)))}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`,
                opacity: 0.3 + Math.random() * 0.4
              }}
            >
              <image
                src={bananas[bananaIndex]}
                className="BananaParticleImage"
              />
            </view>
          );
        })}
      </view>
      )}
      <view className="App">
        {stage === 'splash' && (
          <view className={`Splash ${isSplashFading ? 'Splash--fading' : ''}`}>
            <view className="SplashBackground">
              {/* New singular banana coin animation - bouncing and spinning */}
              {!isLogoVisible && (
                <view className="CoinContainer">
                  <view className={`BananaCoin ${isCoinSplitting ? 'BananaCoin--bouncing' : ''}`}>
                    <image src={coinBanana} className="CoinImage" />
                  </view>
                </view>
              )}
            </view>
            <view className={`SplashContent ${isLogoVisible ? 'SplashContent--visible' : ''}`}>
              <view className="SplashLogo">
                <image src={altoLogo} className="Logo--alto" />
              </view>
            </view>
          </view>
        )}

        {stage === 'home' && (
          <view className="Hero">       
            <view className="HeroHeader">
              <view className="Logo">
                <image src={altoLogo} className="Logo--alto" />
              </view>
              <text className="Subtitle">Value Sharing Platform for Creators</text>
              <view className="CTACard">
                <view className="CTACardContent">
                  {/* Stats Section */}
                  <view className="StatsSection">
                    <view className="StatCard">
                      <image src={groupIcon} className="StatIcon"/>
                      <text className="StatValue">2,847</text>
                      <text className="StatLabel">Active Creators</text>
                    </view>
                    <view className="StatCard">
                      <image src={coinBananas} className="StatIcon" />
                      <text className="StatValue">$1.2M</text>
                      <text className="StatLabel">Total Payouts</text>
                    </view>
                  </view>
                  
                  <text className="Tagline" style={{ marginBottom: '0px', fontWeight: 'bold', fontSize: '18px', color: 'rgba(255, 255, 255, 0.75)' }}>
                    Transparent, Secure, and Fair.
                  </text>
                  <text className="Tagline">
                  Alto rewards creators fairly.
                  Your content is scored for quality and converted into nanas — a transparent, secure way to earn that
                  safeguards against fraud and rewards high quality content creators.
                  </text>
                </view>
              </view>
            </view>

            <view className="HeroFooter">
              <view className="CTAGroup">
                <view className="CTAButton" bindtap={onSelectCreator}>
                  <text className="CTAButtonText">Start Today</text>
                </view>
                <view className="CTAButton CTAButton--secondary" bindtap={onLogin}>
                  <text className="CTAButtonText">Login</text>
                </view>
              </view>

              <text className="NavHint">Start earning from your content today.</text>
            </view>
          </view>
        )}

        {stage === 'signup' && (
          <CreatorSignup onBack={onSignupBack} onSubmit={onCreatorSubmit} />
        )}

        {stage === 'dashboard' && (
          <CreatorDashboard onBack={onDashboardBack} />
        )}
      </view>
    </view>
  );
}
