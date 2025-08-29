/* eslint-disable react/no-unknown-property */
import { useCallback, useEffect, useMemo, useState } from 'react';
import '@lynx-js/react';

import './App.css';
import altoLogo from './assets/logos/alto-logo.png';
import arrowIcon from './assets/arrow.png';
import banana1 from './assets/splash-page/bananas/1.png';
import banana2 from './assets/splash-page/bananas/2.png';
import banana3 from './assets/splash-page/bananas/3.png';
import banana4 from './assets/splash-page/bananas/4.png';
import banana5 from './assets/splash-page/bananas/5.png';
import banana6 from './assets/splash-page/bananas/6.png';
import banana7 from './assets/splash-page/bananas/7.png';
import ViewerSignup from './screens/ViewerSignup.js';
import CreatorSignup from './screens/CreatorSignup.js';
import { CreatorDashboard } from './screens/CreatorDashboard.js';
import { UserDashboard } from './screens/UserDashboard.js';

type Role = 'consumer' | 'creator' | null;

export function App(
  props: Readonly<{
    onRender?: () => void;
  }>,
) {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [stage, setStage] = useState<'splash' | 'home' | 'onboarding' | 'signup' | 'dashboard' | 'user-dashboard'>('splash');
  const [isSplashFading, setIsSplashFading] = useState(false);
  const [isLogoVisible, setIsLogoVisible] = useState(false);

  const bananas = useMemo(() => [banana1, banana2, banana3, banana4, banana5, banana6, banana7], []);
  const particleCount = 20;
  const splashBananaCount = 35;


  useEffect(() => {
    console.info('Alto: streaming micro-credits for short-form creators');
    
    // Logo appears at 2.5 seconds, transition at 5 seconds
    if (stage === 'splash') {
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
        clearTimeout(logoTimer);
        clearTimeout(transitionTimer);
      };
    }
  }, [stage]);
  
  props.onRender?.();

  const onSelectConsumer = useCallback(() => {
    setTimeout(() => {
      setSelectedRole('consumer');
      setStage('onboarding');
    }, 0);
  }, []);

  const onSelectCreator = useCallback(() => {
    setTimeout(() => {
      setSelectedRole('creator');
      setStage('onboarding');
    }, 0);
  }, []);

  const onBackHome = useCallback(() => {
    setTimeout(() => {
      setSelectedRole(null);
      setStage('home');
    }, 0);
  }, []);

  const onContinue = useCallback(() => {
    if (!selectedRole) return;
    setTimeout(() => {
      setStage('signup');
    }, 0);
  }, [selectedRole]);

  const onSignupBack = useCallback(() => {
    setTimeout(() => {
      setStage('onboarding');
    }, 0);
  }, []);

  const onDashboardBack = useCallback(() => {
    setTimeout(() => {
      setStage('home');
    }, 0);
  }, []);

  const onUserDashboardBack = useCallback(() => {
    setTimeout(() => {
      setStage('home');
    }, 0);
  }, []);

  const onViewerSubmit = useCallback(
    (payload: { name: string; email: string; interests: string }) => {
      console.info('Viewer signup submit', payload);
      // integrate API here when backend is ready
    },
    [],
  );

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
        {Array.from({ length: particleCount }).map((_, index) => (
          <view 
            key={index} 
            className="BananaParticle"
            style={{
              left: `${Math.min(100, Math.max(0, ((index + 0.5) / particleCount) * 100 + (Math.random() * 15 - 7.5)))}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
              opacity: 0.3 + Math.random() * 0.4
            }}
          >
            <image 
              src={bananas[index % bananas.length]} 
              className="BananaParticleImage"
            />
          </view>
        ))}
      </view>
      )}
      <view className="App">
        {stage === 'splash' && (
          <view className={`Splash ${isSplashFading ? 'Splash--fading' : ''}`}>
            <view className="SplashBackground">
              <view className="BananaContainer">
                {!isLogoVisible && Array.from({ length: splashBananaCount }).map((_, index) => (
                  <view 
                    key={index} 
                    className="Banana"
                    style={{
                      left: `${Math.min(100, Math.max(0, ((index + 0.5) / splashBananaCount) * 100 + (Math.random() * 15 - 7.5)))}%`,
                      top: `-${120 + Math.random() * 500}px`,
                      animationDelay: `${Math.random() * 1}s`,
                      animationDuration: `${3 + Math.random() * 2}s`
                    }}
                  >
                    <image 
                      src={bananas[index % bananas.length]} 
                      className="BananaImage"
                    />
                  </view>
                ))}
              </view>
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
            <view className="Logo">
              <image src={altoLogo} className="Logo--alto" />
            </view>
            <text className="Subtitle">Make every watch count — for creators and viewers</text>
            <text className="Tagline">
              Streaming micro‑credits from viewers to creators,
              transparently and compliantly — no fraud, no guesswork.
            </text>
            <view className="CTAGroup">
              <view className="CTAButton" bindtap={onSelectConsumer}>
                <image src={arrowIcon} className="CTAButtonIcon" />
                <text className="CTAButtonText">I’m a Viewer</text>
              </view>
              <view
                className="CTAButton CTAButton--secondary"
                bindtap={onSelectCreator}
              >
                <image src={arrowIcon} className="CTAButtonIcon" />
                <text className="CTAButtonText">I’m a Creator</text>
              </view>
            </view>
            <text className="NavHint">Choose your path to get started</text>
            <view className="DebugButton" bindtap={() => setStage('dashboard')}>
              <text className="DebugButtonText">Debug: Creator Dashboard</text>
            </view>
            <view className="DebugButton" bindtap={() => setStage('user-dashboard')}>
              <text className="DebugButtonText">Debug: User Dashboard</text>
            </view>
          </view>
        )}

        {stage === 'onboarding' && selectedRole !== null && (
          <view className="Onboarding">
            <text className="OnboardingTitle">
              {selectedRole === 'consumer'
                ? 'Join as a Viewer'
                : 'Join as a Creator'}
            </text>
            <text className="OnboardingCopy">
              {selectedRole === 'consumer'
                ? 'Support creators you love as you watch. Alto streams micro‑credits tied to your genuine engagement — no extra steps required.'
                : 'Earn fairly in real time. Alto streams micro‑credits from engaged viewers to you, with transparency, analytics, and compliance baked in.'}
            </text>
            <view className="CTAGroup">
              <view className="CTAButton" bindtap={onContinue}>
                <image src={arrowIcon} className="CTAButtonIcon" />
                <text className="CTAButtonText">Continue</text>
              </view>
              <view
                className="CTAButton CTAButton--secondary"
                bindtap={onBackHome}
              >
                <image
                  src={arrowIcon}
                  className="CTAButtonIcon CTAButtonIcon--back"
                />
                <text className="CTAButtonText">Back</text>
              </view>
            </view>
          </view>
        )}

        {stage === 'signup' && selectedRole === 'consumer' && (
          <ViewerSignup onBack={onSignupBack} onSubmit={onViewerSubmit} />
        )}

        {stage === 'signup' && selectedRole === 'creator' && (
          <CreatorSignup onBack={onSignupBack} onSubmit={onCreatorSubmit} />
        )}

        {stage === 'dashboard' && (
          <CreatorDashboard onBack={onDashboardBack} />
        )}

        {stage === 'user-dashboard' && (
          <UserDashboard onBack={onUserDashboardBack} />
        )}
      </view>
    </view>
  );
}
