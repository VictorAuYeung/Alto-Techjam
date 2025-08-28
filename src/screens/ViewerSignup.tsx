/* eslint-disable react/no-unknown-property */
import React from '@lynx-js/react'
import { useCallback, useMemo, useState } from 'react'
import arrowIcon from '../assets/arrow.png'
import lynxLogo from '../assets/lynx-logo.png'

export function ViewerSignup(props: Readonly<{
    onBack: () => void
    onSubmit: (payload: { name: string; email: string; interests: string }) => void
}>) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [interests, setInterests] = useState('')
    const [touched, setTouched] = useState<{ name: boolean; email: boolean }>({ name: false, email: false })

    const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email])
    const nameValid = useMemo(() => name.trim().length > 1, [name])
    const canSubmit = nameValid && emailValid

    const submit = useCallback(() => {
        setTouched({ name: true, email: true })
        if (!canSubmit) return
        props.onSubmit({ name: name.trim(), email: email.trim(), interests: interests.trim() })
    }, [canSubmit, email, interests, name, props])

    return (
        <view className='Signup'>
            <view className='SignupHeader'>
                <image src={lynxLogo} className='SignupLogo' />
                <text className='SignupTitle'>Create your Viewer account</text>
                <text className='SignupSubtitle'>Follow creators and stream micro‑credits as you watch</text>
            </view>

            <view className='FormCard'>
                <view className='FormField'>
                    <text className='FormLabel'>Name</text>
                    {/* @ts-ignore */}
                    <input
                        className='FormInput'
                        placeholder='Jane Doe'
                        value={name}
                        onInput={(e: any) => setName(e.target?.value ?? e.detail?.value ?? '')}
                        onBlur={() => setTouched((v) => ({ ...v, name: true }))}
                    />
                    {touched.name && !nameValid && <text className='FormError'>Please enter your name</text>}
                </view>

                <view className='FormField'>
                    <text className='FormLabel'>Email</text>
                    {/* @ts-ignore */}
                    <input
                        className='FormInput'
                        placeholder='jane@example.com'
                        value={email}
                        type='email'
                        bindinput={(e: any) => setEmail(e.detail?.value ?? e.target?.value ?? '')}
                        bindblur={() => setTouched((v: { name: boolean; email: boolean }) => ({ ...v, email: true }))}
                    />
                    {touched.email && !emailValid && <text className='FormError'>Enter a valid email</text>}
                </view>

                <view className='FormField'>
                    <text className='FormLabel'>Interests (optional)</text>
                    {/* @ts-ignore */}
                    <input
                        className='FormInput'
                        placeholder='Comedy, tech, music…'
                        value={interests}
                        bindinput={(e: any) => setInterests(e.detail?.value ?? e.target?.value ?? '')}
                    />
                    <text className='FormHint'>Helps personalize creator suggestions</text>
                </view>

                <view className='CTAGroup'>
                    <view className={`CTAButton ${!canSubmit ? 'CTAButton--disabled' : ''}`} bindtap={submit}>
                        <image src={arrowIcon} className='CTAButtonIcon' />
                        <text className='CTAButtonText'>Create account</text>
                    </view>
                    <view className='CTAButton CTAButton--secondary' bindtap={props.onBack}>
                        <image src={arrowIcon} className='CTAButtonIcon CTAButtonIcon--back' />
                        <text className='CTAButtonText'>Back</text>
                    </view>
                </view>
            </view>
        </view>
    )
}

export default ViewerSignup


