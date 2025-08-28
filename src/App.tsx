/* eslint-disable react/no-unknown-property */
import { useCallback, useEffect, useState } from 'react';
import '@lynx-js/react';

import './App.css';
import altoLogo from './assets/logos/13.png';
import arrowIcon from './assets/arrow.png';
import ViewerSignup from './screens/ViewerSignup.js';
import CreatorSignup from './screens/CreatorSignup.js';

type Role = 'consumer' | 'creator' | null;

export function App(
  props: Readonly<{
    onRender?: () => void;
  }>,
) {
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [stage, setStage] = useState<'home' | 'onboarding' | 'signup'>('home');

  useEffect(() => {
    console.info('Alto: streaming micro-credits for short-form creators');
  }, []);
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
      <view className="App">
        {stage === 'home' && (
          <view className="Hero">
            <view className="Logo">
              <image src={altoLogo} className="Logo--lynx" />
            </view>
            <text className="Title">Alto</text>
            <text className="Subtitle">Fair & real‑time Value Sharing</text>
            <text className="Tagline">
              Streaming micro‑credits from engaged viewers to creators,
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
      </view>
    </view>
  );
}
