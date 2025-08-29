/* eslint-disable react/no-unknown-property */
import { useCallback, useEffect, useMemo, useState } from 'react';
import '@lynx-js/react';
import arrowIcon from '../assets/arrow.png';
import altoLogo from '../assets/logos/alto-logo.png';

const MIN_TOPUP = 0.10;
const MAX_TOPUP = 10.0;
const SESSION_BUDGET_MAX = 5.0;

export function TopUp(
  props: Readonly<{
    currentBalance: number;
    isSessionActive: boolean;
    sessionBudget: number;
    sessionSpent: number;
    onCancel: () => void;
    onSuccess: (payload: { amount: number; newBalance: number; addToSession: boolean; newSessionBudget?: number; receiptId: string; }) => void;
  }>,
) {
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [amountInput, setAmountInput] = useState('');
  const [amount, setAmount] = useState(0);
  const [addToSession, setAddToSession] = useState(false);
  const [status, setStatus] = useState<'idle' | 'valid' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoadingBalance(false), 400);
    return () => clearTimeout(t);
  }, []);

  const formattedBalance = useMemo(() => `₵ ${props.currentBalance.toFixed(2)}`,[props.currentBalance]);

  const setPreset = useCallback((val: number) => {
    const clamped = Math.max(MIN_TOPUP, Math.min(MAX_TOPUP, val));
    setAmount(clamped);
    setAmountInput(clamped.toFixed(2));
    setStatus(clamped > 0 ? 'valid' : 'idle');
    setErrorMsg(null);
  }, []);

  const parseAndValidate = useCallback((raw: string) => {
    const normalized = raw.replace(/[^0-9.]/g, '');
    const parts = normalized.split('.');
    if (parts.length > 2) {
      setErrorMsg('Invalid amount');
      setStatus('idle');
      return;
    }
    let value = Number(normalized);
    if (!isFinite(value)) {
      setErrorMsg('Invalid amount');
      setStatus('idle');
      return;
    }
    // Clamp and fix decimals
    value = Math.round(value * 100) / 100;
    if (value < MIN_TOPUP) {
      setAmount(value);
      setStatus('idle');
      setErrorMsg(null);
      return;
    }
    if (value > MAX_TOPUP) {
      value = MAX_TOPUP;
    }
    setAmount(value);
    setStatus(value > 0 ? 'valid' : 'idle');
    setErrorMsg(null);
  }, []);

  const onInput = useCallback((e: any) => {
    const v = e?.detail?.value ?? e?.target?.value ?? '';
    setAmountInput(v);
    parseAndValidate(v);
  }, [parseAndValidate]);

  const onBlur = useCallback(() => {
    if (!amount || amount < MIN_TOPUP) {
      // keep raw if below min
      return;
    }
    setAmountInput(amount.toFixed(2));
  }, [amount]);

  const sessionCanToggle = props.isSessionActive && props.sessionSpent < props.sessionBudget;
  const sessionProjectedBudget = useMemo(() => {
    return addToSession ? Math.min(SESSION_BUDGET_MAX, Math.round((props.sessionBudget + amount) * 100) / 100) : props.sessionBudget;
  }, [addToSession, props.sessionBudget, amount]);

  const projectedWallet = useMemo(() => {
    return Math.round((props.currentBalance + amount) * 100) / 100;
  }, [props.currentBalance, amount]);

  const canSubmit = status === 'valid' && amount >= MIN_TOPUP && amount <= MAX_TOPUP && amount > 0;
  const isPrimaryDisabled = !canSubmit || (status as any) === 'submitting';

  const submit = useCallback(() => {
    if (!canSubmit) return;
    // If toggle ON but no active session
    if (addToSession && !sessionCanToggle) {
      setErrorMsg('No active session.');
      return;
    }
    // Session budget max check
    if (addToSession && sessionProjectedBudget > SESSION_BUDGET_MAX) {
      setErrorMsg('Session budget limit reached.');
      return;
    }

    setStatus('submitting');
    setErrorMsg(null);
    setSuccessMsg(null);

    // Simulate API call
    setTimeout(() => {
      // Simulate rate limit error occasionally
      if (amount > MAX_TOPUP) {
        setStatus('error');
        setErrorMsg('Daily demo limit reached.');
        return;
      }
      const receiptId = `rcpt_${Date.now()}`;
      setStatus('success');
      setSuccessMsg('Top-up successful.');
      props.onSuccess({
        amount,
        newBalance: projectedWallet,
        addToSession,
        newSessionBudget: addToSession ? sessionProjectedBudget : undefined,
        receiptId,
      });
    }, 800);
  }, [canSubmit, addToSession, sessionCanToggle, sessionProjectedBudget, amount, projectedWallet, props]);

  return (
    <view className="TopUpScreen">
      <view className="DashboardHeader">
        <view className="HeaderLeft">
          <view className="BackButton" bindtap={props.onCancel}>
            <image src={arrowIcon} className="BackIcon" />
            <text className="BackText">Back</text>
          </view>
          <image src={altoLogo} className="DashboardLogo" />
        </view>
        <text className="DashboardTitle">Top Up Nana Coins</text>
      </view>

      <view className="TopUpHeader">
        <text className="TopUpBalanceLabel">Current Balance</text>
        {loadingBalance ? (
          <view className="BalanceSkeleton" aria-live="polite" />
        ) : (
          <text className="TopUpBalance" aria-live="polite">{formattedBalance}</text>
        )}
        <text className="TopUpInfo">Demo Nana Coins only. No real money.</text>
      </view>

      {errorMsg && (
        <view className="NoticeBanner NoticeBanner--error" aria-live="polite">
          <text className="NoticeText">{errorMsg}</text>
        </view>
      )}
      {status === 'success' && successMsg && (
        <view className="NoticeBanner NoticeBanner--success" aria-live="polite">
          <text className="NoticeText">{successMsg}</text>
          <text className="NoticeLink">View Receipt</text>
        </view>
      )}

      <view className="TopUpCard">
        <text className="SectionTitle">Amount</text>
        <view className="PresetChips">
          <view className="Chip" bindtap={() => setPreset(0.5)}>
            <text className="ChipText">₵0.50</text>
          </view>
          <view className="Chip" bindtap={() => setPreset(1.0)}>
            <text className="ChipText">₵1.00</text>
          </view>
          <view className="Chip" bindtap={() => setPreset(2.0)}>
            <text className="ChipText">₵2.00</text>
          </view>
        </view>

        {/* @ts-ignore */}
        <input
          className="TopUpInput"
          type="digit"
          step="0.01"
          min={MIN_TOPUP}
          max={MAX_TOPUP}
          placeholder="0.00"
          aria-label="Top-up amount"
          value={amountInput}
          bindinput={onInput}
          bindblur={onBlur}
        />
        <text className="InputHint">Min ₵{MIN_TOPUP.toFixed(2)} · Max ₵{MAX_TOPUP.toFixed(2)}</text>

        <view className={`SessionToggleRow ${sessionCanToggle ? '' : 'SessionToggleRow--disabled'}`}>
          <view
            className={`Toggle ${addToSession ? 'Toggle--on' : ''} ${sessionCanToggle ? '' : 'Toggle--disabled'}`}
            bindtap={() => sessionCanToggle && setAddToSession(!addToSession)}
          >
            <view className="ToggleKnob" />
          </view>
          <text className="ToggleLabel">Also add to current session budget</text>
        </view>
        {addToSession && (
          <text className="SessionPreview" aria-live="polite">
            Session budget +₵{amount.toFixed(2)} → New session budget: ₵{sessionProjectedBudget.toFixed(2)}
          </text>
        )}
      </view>

      <view className="SummaryCard">
        <text className="SummaryTitle">Summary</text>
        <view className="SummaryRow">
          <text className="SummaryLabel">You will add</text>
          <text className="SummaryValue">₵{amount.toFixed(2)}</text>
        </view>
        <view className="SummaryRow" aria-live="polite">
          <text className="SummaryLabel">New wallet balance (est.)</text>
          <text className="SummaryValue">₵{projectedWallet.toFixed(2)}</text>
        </view>
        <view className="SummaryRow">
          <text className="SummaryLabel">Top-up method</text>
          <text className="SummaryValue">Demo credit</text>
        </view>
        <text className="SummaryNote">Transactions are recorded on the ledger for audit.</text>
      </view>

      <view className="TopUpActions">
        <view
          className={`PrimaryButton ${isPrimaryDisabled ? 'PrimaryButton--disabled' : ''}`}
          bindtap={submit}
        >
          <text className="PrimaryButtonText">
            {status === 'submitting' ? 'Processing…' : 'Top Up Now'}
          </text>
        </view>
        <view className="SecondaryButton" bindtap={props.onCancel}>
          <text className="SecondaryButtonText">Cancel</text>
        </view>
      </view>
    </view>
  );
}
