/* eslint-disable react/no-unknown-property */
import { useCallback, useEffect, useState } from '@lynx-js/react'

import './App.css'
import lynxLogo from './assets/lynx-logo.png'
import arrowIcon from './assets/arrow.png'

type Role = 'consumer' | 'creator' | null

export function App(props: Readonly<{
  onRender?: () => void
}>) {
  const [selectedRole, setSelectedRole] = useState<Role>(null)

  useEffect(() => {
    console.info('Alto: streaming micro-credits for short-form creators')
  }, [])
  props.onRender?.()

  const onSelectConsumer = useCallback(() => {
    setSelectedRole('consumer')
  }, [])

  const onSelectCreator = useCallback(() => {
    setSelectedRole('creator')
  }, [])

  const onBackHome = useCallback(() => {
    setSelectedRole(null)
  }, [])

  const onContinue = useCallback(() => {
    // Placeholder entry point action for now
    console.info('Proceed with role:', selectedRole)
  }, [selectedRole])

  return (
    <view>
      <view className='Background' />
      <view className='App'>
        {selectedRole === null && (
          <view className='Hero'>
            <view className='Logo'>
              <image src={lynxLogo} className='Logo--lynx' />
            </view>
            <text className='Title'>Alto</text>
            <text className='Subtitle'>Fair & real‑time Value Sharing</text>
            <text className='Tagline'>
              Streaming micro‑credits from engaged viewers to creators, transparently
              and compliantly — no fraud, no guesswork.
            </text>
            <view className='CTAGroup'>
              <view className='CTAButton' bindtap={onSelectConsumer}>
                <image src={arrowIcon} className='CTAButtonIcon' />
                <text className='CTAButtonText'>I’m a Viewer</text>
              </view>
              <view className='CTAButton CTAButton--secondary' bindtap={onSelectCreator}>
                <image src={arrowIcon} className='CTAButtonIcon' />
                <text className='CTAButtonText'>I’m a Creator</text>
              </view>
            </view>
            <text className='NavHint'>Choose your path to get started</text>
          </view>
        )}

        {selectedRole !== null && (
          <view className='Onboarding'>
            <text className='OnboardingTitle'>
              {selectedRole === 'consumer' ? 'Join as a Viewer' : 'Join as a Creator'}
            </text>
            <text className='OnboardingCopy'>
              {selectedRole === 'consumer'
                ? 'Support creators you love as you watch. Alto streams micro‑credits tied to your genuine engagement — no extra steps required.'
                : 'Earn fairly in real time. Alto streams micro‑credits from engaged viewers to you, with transparency, analytics, and compliance baked in.'}
            </text>
            <view className='CTAGroup'>
              <view className='CTAButton' bindtap={onContinue}>
                <image src={arrowIcon} className='CTAButtonIcon' />
                <text className='CTAButtonText'>Continue</text>
              </view>
              <view className='CTAButton CTAButton--secondary' bindtap={onBackHome}>
                <image src={arrowIcon} className='CTAButtonIcon CTAButtonIcon--back' />
                <text className='CTAButtonText'>Back</text>
              </view>
            </view>
          </view>
        )}
      </view>
    </view>
  )
}
