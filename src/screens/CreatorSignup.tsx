/* eslint-disable react/no-unknown-property */
import { useCallback, useMemo, useState } from 'react';
import '@lynx-js/react';
import arrowIcon from '../assets/arrow.png';
import altoLogo from '../assets/logos/13.png';

export function CreatorSignup(
  props: Readonly<{
    onBack: () => void;
    onSubmit: (payload: {
      displayName: string;
      email: string;
      handle: string;
      niche: string;
    }) => void;
  }>,
) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [handle, setHandle] = useState('');
  const [niche, setNiche] = useState('');
  const [touched, setTouched] = useState<{
    displayName: boolean;
    email: boolean;
    handle: boolean;
  }>({
    displayName: false,
    email: false,
    handle: false,
  });

  const emailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const nameValid = useMemo(() => displayName.trim().length > 1, [displayName]);
  const handleValid = useMemo(
    () => /^@[a-zA-Z0-9_.]{3,20}$/.test(handle),
    [handle],
  );
  const canSubmit = emailValid && nameValid && handleValid;

  const submit = useCallback(() => {
    setTouched({ displayName: true, email: true, handle: true });
    if (!canSubmit) return;
    props.onSubmit({
      displayName: displayName.trim(),
      email: email.trim(),
      handle: handle.trim(),
      niche: niche.trim(),
    });
  }, [canSubmit, displayName, email, handle, niche, props]);

  return (
    <view className="Signup">
      <view className="SignupHeader">
      <image src={altoLogo} className="SignupLogo" />
        <text className="SignupTitle">Join as a Creator</text>
        <text className="SignupSubtitle">
          Earn fairly in real time from engaged viewers
        </text>
      </view>

      <view className="FormCard">
        <view className="FormField">
          <text className="FormLabel">Display name</text>
          {/* @ts-ignore */}
          <input
            className="FormInput"
            placeholder="Acme Productions"
            value={displayName}
            bindinput={(e: any) =>
              setDisplayName(e.detail?.value ?? e.target?.value ?? '')
            }
            bindblur={() =>
              setTouched(
                (v: {
                  displayName: boolean;
                  email: boolean;
                  handle: boolean;
                }) => ({ ...v, displayName: true }),
              )
            }
          />
          {touched.displayName && !nameValid && (
            <text className="FormError">Please enter your display name</text>
          )}
        </view>

        <view className="FormField">
          <text className="FormLabel">Email</text>
          {/* @ts-ignore */}
          <input
            className="FormInput"
            placeholder="creator@example.com"
            value={email}
            type="email"
            bindinput={(e: any) =>
              setEmail(e.detail?.value ?? e.target?.value ?? '')
            }
            bindblur={() =>
              setTouched(
                (v: {
                  displayName: boolean;
                  email: boolean;
                  handle: boolean;
                }) => ({ ...v, email: true }),
              )
            }
          />
          {touched.email && !emailValid && (
            <text className="FormError">Enter a valid email</text>
          )}
        </view>

        <view className="FormField">
          <text className="FormLabel">Handle</text>
          {/* @ts-ignore */}
          <input
            className="FormInput"
            placeholder="@yourname"
            value={handle}
            bindinput={(e: any) =>
              setHandle(e.detail?.value ?? e.target?.value ?? '')
            }
            bindblur={() =>
              setTouched(
                (v: {
                  displayName: boolean;
                  email: boolean;
                  handle: boolean;
                }) => ({ ...v, handle: true }),
              )
            }
          />
          {touched.handle && !handleValid && (
            <text className="FormError">
              Handle must start with @ and be 3–20 characters
            </text>
          )}
        </view>

        <view className="FormField">
          <text className="FormLabel">Niche (optional)</text>
          {/* @ts-ignore */}
          <input
            className="FormInput"
            placeholder="Comedy, tech reviews, beauty…"
            value={niche}
            bindinput={(e: any) =>
              setNiche(e.detail?.value ?? e.target?.value ?? '')
            }
          />
          <text className="FormHint">
            We use this to improve recommendations
          </text>
        </view>

        <view className="CTAGroup">
          <view
            className={`CTAButton ${!canSubmit ? 'CTAButton--disabled' : ''}`}
            bindtap={submit}
          >
            <image src={arrowIcon} className="CTAButtonIcon" />
            <text className="CTAButtonText">Create account</text>
          </view>
          <view
            className="CTAButton CTAButton--secondary"
            bindtap={props.onBack}
          >
            <image
              src={arrowIcon}
              className="CTAButtonIcon CTAButtonIcon--back"
            />
            <text className="CTAButtonText">Back</text>
          </view>
        </view>
      </view>
    </view>
  );
}

export default CreatorSignup;
