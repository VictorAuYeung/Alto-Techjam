/* eslint-disable react/no-unknown-property */
import { useCallback, useEffect, useState } from 'react';
import '@lynx-js/react';
import backArrowIcon from '../assets/icons/back-arrow.png';
import altoLogo from '../assets/logos/alto-logo.png';
import { 
  requestCashOut, 
  getCashOutEligibility, 
  getKYCStatus, 
  submitKYCDocuments,
  type CashOutRequest,
  type KYCStatus 
} from '../services/wallet.js';

export function CashOut(
  props: Readonly<{
    currentBalance: number;
    onCancel: () => void;
    onSuccess: (request: CashOutRequest) => void;
  }>,
) {
  const [amountInput, setAmountInput] = useState('');
  const [amount, setAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'paypal' | 'gift_card'>('paypal');
  const [paymentDetails, setPaymentDetails] = useState({
    paypalEmail: '',
    accountName: '',
    accountNumber: '',
    giftCardType: 'amazon'
  });
  
  const [kycStatus, setKycStatus] = useState<KYCStatus | null>(null);
  const [eligibility, setEligibility] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showKYCForm, setShowKYCForm] = useState(false);
  const [kycDocuments, setKycDocuments] = useState<string[]>([]);
  
  // Exchange rate state
  const [exchangeRate, setExchangeRate] = useState(0.25); // 1 Nana = $0.25 USD

  useEffect(() => {
    loadKYCStatus();
  }, []);

  const loadKYCStatus = async () => {
    try {
      const status = await getKYCStatus();
      setKycStatus(status);
    } catch (error) {
      console.error('Failed to load KYC status:', error);
    }
  };

  const validateAmount = useCallback((value: number) => {
    if (value <= 0) {
      setErrorMsg('Amount must be greater than 0');
      return false;
    }
    if (value > props.currentBalance) {
      setErrorMsg('Insufficient balance');
      return false;
    }
    setErrorMsg(null);
    return true;
  }, [props.currentBalance]);

  const checkEligibility = useCallback(async (value: number) => {
    if (!validateAmount(value)) return;
    
    try {
      setStatus('loading');
      const eligibility = await getCashOutEligibility(value);
      setEligibility(eligibility);
      
      if (!eligibility.eligible && eligibility.kycRequired) {
        setShowKYCForm(true);
      }
    } catch (error) {
      setErrorMsg('Failed to check eligibility');
    } finally {
      setStatus('idle');
    }
  }, [validateAmount]);

  const handleAmountChange = useCallback((e: any) => {
    const value = e?.detail?.value ?? e?.target?.value ?? '';
    setAmountInput(value);
    
    const numValue = parseFloat(value) || 0;
    setAmount(numValue);
    
    if (numValue > 0) {
      checkEligibility(numValue);
    } else {
      setEligibility(null);
      setErrorMsg(null);
    }
  }, [checkEligibility]);

  const handlePaymentMethodChange = useCallback((method: 'bank_transfer' | 'paypal' | 'gift_card') => {
    setPaymentMethod(method);
    // Reset payment details when method changes
    setPaymentDetails({
      paypalEmail: '',
      accountName: '',
      accountNumber: '',
      giftCardType: 'amazon'
    });
  }, []);

  const handlePaymentDetailChange = useCallback((field: string, value: string) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleKYCDocumentSubmit = useCallback(async () => {
    if (kycDocuments.length === 0) {
      setErrorMsg('Please select at least one document');
      return;
    }

    try {
      setStatus('submitting');
      await submitKYCDocuments(kycDocuments);
      await loadKYCStatus();
      setShowKYCForm(false);
      setErrorMsg(null);
      // Re-check eligibility after KYC submission
      if (amount > 0) {
        await checkEligibility(amount);
      }
    } catch (error) {
      setErrorMsg('Failed to submit KYC documents');
    } finally {
      setStatus('idle');
    }
  }, [kycDocuments, amount, checkEligibility]);

  const handleSubmit = useCallback(async () => {
    if (!validateAmount(amount)) return;
    
    // Validate payment details
    if (paymentMethod === 'paypal' && !paymentDetails.paypalEmail) {
      setErrorMsg('Please enter PayPal email');
      return;
    }
    if (paymentMethod === 'bank_transfer' && (!paymentDetails.accountName || !paymentDetails.accountNumber)) {
      setErrorMsg('Please enter account details');
      return;
    }

    try {
      setStatus('submitting');
      const request = await requestCashOut(amount, paymentMethod, paymentDetails);
      setStatus('success');
      props.onSuccess(request);
    } catch (error: any) {
      setStatus('error');
      setErrorMsg(error.message || 'Failed to submit cash-out request');
    }
  }, [amount, paymentMethod, paymentDetails, validateAmount, props]);

  const canSubmit = amount > 0 && 
    eligibility?.eligible && 
    status !== 'submitting' && 
    status !== 'loading';

  const formatNanas = (value: number) => `${value.toFixed(2)} Nanas`;
  
  const formatUSD = (value: number) => `$${value.toFixed(2)}`;
  
  const convertNanasToUSD = (nanas: number) => nanas * exchangeRate;

  return (
    <view className="CashOutScreen">
      <view className="DashboardHeader">
        <view className="HeaderLeft">
          <view className="BackButton" bindtap={props.onCancel} style="padding: 8px; cursor: pointer;">
            <image src={backArrowIcon} style="width: 24px; height: 24px;" />
          </view>
        </view>
        <text className="DashboardTitle" style="position: absolute; left: 50%; transform: translateX(-50%); font-size: 20px; font-weight: 700; color: #fff;">Cash Out</text>
      </view>

      <scroll-view className="CashOutContent" scroll-y>
        <view className="CashOutHeader">
          <text className="CashOutBalanceLabel">Available Balance</text>
          <text className="CashOutBalance">{formatNanas(props.currentBalance)}</text>
          <text className="ExchangeRate">1 Nana = {formatUSD(exchangeRate)} USD</text>
          <text className="CashOutInfo">Convert your Nanas to real money</text>
        </view>

        {errorMsg && (
          <view className="NoticeBanner NoticeBanner--error">
            <text className="NoticeText">{errorMsg}</text>
          </view>
        )}

        {status === 'success' && (
          <view className="NoticeBanner NoticeBanner--success">
            <text className="NoticeText">Cash-out request submitted successfully!</text>
          </view>
        )}

        <view className="CashOutCard">
          <text className="SectionTitle">Amount</text>

          {/* @ts-ignore */}
          <input
            className="TopUpInput"
            type="text"
            placeholder="0.00"
            value={amountInput}
            bindinput={handleAmountChange}
          />
          {amount > 0 && (
            <text className="USDConversion">
              {formatNanas(amount)} = {formatUSD(convertNanasToUSD(amount))}
            </text>
          )}
          <text className="InputHint">Min 5.00 Nanas · Max {formatNanas(props.currentBalance)}</text>

          {eligibility && !eligibility.eligible && (
            <view className="NoticeBanner NoticeBanner--warning">
              <text className="NoticeText">{eligibility.reason}</text>
              {eligibility.kycRequired && (
                <view className="NoticeAction" bindtap={() => setShowKYCForm(true)}>
                  <text className="NoticeLink">Complete KYC</text>
                </view>
              )}
            </view>
          )}
        </view>

        <view className="CashOutCard">
          <text className="SectionTitle">Payment Method</text>

          <view className="PaymentMethodOptions">
            <view
              className={`PaymentMethodOption ${paymentMethod === 'paypal' ? 'PaymentMethodOption--selected' : ''}`}
              bindtap={() => handlePaymentMethodChange('paypal')}
            >
              <text className="PaymentMethodLabel">PayPal</text>
              <text className="PaymentMethodDescription">Fastest payout (1-2 business days)</text>
            </view>

            <view
              className={`PaymentMethodOption ${paymentMethod === 'bank_transfer' ? 'PaymentMethodOption--selected' : ''}`}
              bindtap={() => handlePaymentMethodChange('bank_transfer')}
            >
              <text className="PaymentMethodLabel">Bank Transfer</text>
              <text className="PaymentMethodDescription">3-5 business days</text>
            </view>

            <view
              className={`PaymentMethodOption ${paymentMethod === 'gift_card' ? 'PaymentMethodOption--selected' : ''}`}
              bindtap={() => handlePaymentMethodChange('gift_card')}
            >
              <text className="PaymentMethodLabel">Gift Card</text>
              <text className="PaymentMethodDescription">Instant delivery</text>
            </view>
          </view>

          {paymentMethod === 'paypal' && (
            <view className="PaymentDetails">
              <text className="InputLabel">PayPal Email</text>
              {/* @ts-ignore */}
              <input
                className="TopUpInput"
                type="email"
                placeholder="your-email@example.com"
                value={paymentDetails.paypalEmail}
                bindinput={(e: any) => handlePaymentDetailChange('paypalEmail', e?.detail?.value ?? e?.target?.value ?? '')}
              />
            </view>
          )}

          {paymentMethod === 'bank_transfer' && (
            <view className="PaymentDetails">
              <text className="InputLabel">Account Name</text>
              {/* @ts-ignore */}
              <input
                className="TopUpInput"
                placeholder="John Doe"
                value={paymentDetails.accountName}
                bindinput={(e: any) => handlePaymentDetailChange('accountName', e?.detail?.value ?? e?.target?.value ?? '')}
              />
              <text className="InputLabel">Account Number</text>
              {/* @ts-ignore */}
              <input
                className="TopUpInput"
                placeholder="1234567890"
                value={paymentDetails.accountNumber}
                bindinput={(e: any) => handlePaymentDetailChange('accountNumber', e?.detail?.value ?? e?.target?.value ?? '')}
              />
            </view>
          )}

          {paymentMethod === 'gift_card' && (
            <view className="PaymentDetails">
              <text className="InputLabel">Gift Card Type</text>
              <view className="GiftCardOptions">
                <view
                  className={`GiftCardOption ${paymentDetails.giftCardType === 'amazon' ? 'GiftCardOption--selected' : ''}`}
                  bindtap={() => handlePaymentDetailChange('giftCardType', 'amazon')}
                >
                  <text className="GiftCardLabel">Amazon</text>
                </view>
                <view
                  className={`GiftCardOption ${paymentDetails.giftCardType === 'walmart' ? 'GiftCardOption--selected' : ''}`}
                  bindtap={() => handlePaymentDetailChange('giftCardType', 'walmart')}
                >
                  <text className="GiftCardLabel">Walmart</text>
                </view>
                <view
                  className={`GiftCardOption ${paymentDetails.giftCardType === 'target' ? 'GiftCardOption--selected' : ''}`}
                  bindtap={() => handlePaymentDetailChange('giftCardType', 'target')}
                >
                  <text className="GiftCardLabel">Target</text>
                </view>
              </view>
            </view>
          )}
        </view>

        {showKYCForm && (
          <view className="CashOutCard">
            <text className="SectionTitle">KYC Verification Required</text>
            <text className="KYCDescription">
              For amounts over $50, we need to verify your identity to comply with regulations.
            </text>

            <view className="KYCDocuments">
              <text className="InputLabel">Upload Documents</text>
              <view className="DocumentOptions">
                <view
                  className={`DocumentOption ${kycDocuments.includes('id') ? 'DocumentOption--selected' : ''}`}
                  bindtap={() => {
                    if (kycDocuments.includes('id')) {
                      setKycDocuments(prev => prev.filter(d => d !== 'id'));
                    } else {
                      setKycDocuments(prev => [...prev, 'id']);
                    }
                  }}
                >
                  <text className="DocumentLabel">Government ID</text>
                </view>
                <view
                  className={`DocumentOption ${kycDocuments.includes('utility') ? 'DocumentOption--selected' : ''}`}
                  bindtap={() => {
                    if (kycDocuments.includes('utility')) {
                      setKycDocuments(prev => prev.filter(d => d !== 'utility'));
                    } else {
                      setKycDocuments(prev => [...prev, 'utility']);
                    }
                  }}
                >
                  <text className="DocumentLabel">Utility Bill</text>
                </view>
              </view>
            </view>

            <view className="KYCActions">
              <view className="SecondaryButton" bindtap={() => setShowKYCForm(false)}>
                <text className="SecondaryButtonText">Cancel</text>
              </view>
              <view className="PrimaryButton" bindtap={handleKYCDocumentSubmit}>
                <text className="PrimaryButtonText">
                  {status === 'submitting' ? 'Submitting...' : 'Submit KYC'}
                </text>
              </view>
            </view>
          </view>
        )}

        <view className="SummaryCard">
          <text className="SummaryTitle">Summary</text>
          <view className="SummaryRow">
            <text className="SummaryLabel">Cash-out amount</text>
            <text className="SummaryValue">{formatNanas(amount)}</text>
          </view>
          {amount > 0 && (
            <view className="SummaryRow">
              <text className="SummaryLabel">USD value</text>
              <text className="SummaryValue">{formatUSD(convertNanasToUSD(amount))}</text>
            </view>
          )}
          <view className="SummaryRow">
            <text className="SummaryLabel">Payment method</text>
            <text className="SummaryValue">
              {paymentMethod === 'paypal' ? 'PayPal' :
               paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Gift Card'}
            </text>
          </view>
          <view className="SummaryRow">
            <text className="SummaryLabel">Processing time</text>
            <text className="SummaryValue">
              {paymentMethod === 'paypal' ? '1-2 business days' :
               paymentMethod === 'bank_transfer' ? '3-5 business days' : 'Instant'}
            </text>
          </view>
          <text className="SummaryNote">
            All transactions are recorded on the ledger for audit and compliance.
          </text>
        </view>
      </scroll-view>

      <view className="CashOutActions">
        <view
          className={`PrimaryButton ${!canSubmit ? 'PrimaryButton--disabled' : ''}`}
          bindtap={handleSubmit}
        >
          <text className="PrimaryButtonText">
            {status === 'submitting' ? 'Processing…' : 'Request Cash-out'}
          </text>
        </view>
        <view className="SecondaryButton" bindtap={props.onCancel}>
          <text className="SecondaryButtonText">Cancel</text>
        </view>
      </view>
    </view>
  );
}
