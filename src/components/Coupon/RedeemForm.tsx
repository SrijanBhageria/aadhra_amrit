'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Gift,
  Info,
  Loader2,
  ShieldCheck,
  Ticket,
} from 'lucide-react';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import VerifyCelebration from '@/components/Coupon/VerifyCelebration';
import {
  clearIdempotencyKey,
  getOrCreateIdempotencyKey,
  redeemCoupon,
  verifyBankAccount,
} from '@/lib/coupon/api';
import type {
  KycVerificationDetails,
  PayoutDetails,
  PayoutMethod,
  RedeemCouponData,
  VerifyBankAccountData,
} from '@/lib/coupon/types';
import {
  isValidAccountNumber,
  isValidIfsc,
  isValidName,
  isValidUpi,
} from '@/lib/coupon/validation';
import { useCouponAuth } from '@/context/CouponAuthContext';
import styles from './Coupon.module.css';

interface RedeemFormProps {
  code: string;
  faceValueRupees: number;
  onSuccess: (result: RedeemCouponData, payout: PayoutDetails) => void;
  onBack: () => void;
}

type BankVerifyStep = 'enter' | 'review';

function normalizeAccount(value: string): string {
  return value.replace(/\s/g, '');
}

function normalizeIfsc(value: string): string {
  return value.trim().toUpperCase();
}

export default function RedeemForm({
  code,
  faceValueRupees,
  onSuccess,
  onBack,
}: RedeemFormProps) {
  const { phone, profile, profileLoading, refreshProfile } = useCouponAuth();
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod>('bank');
  const [name, setName] = useState('');
  const [upiVpa, setUpiVpa] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankVerifyStep, setBankVerifyStep] = useState<BankVerifyStep>('enter');
  const [bankVerifyResult, setBankVerifyResult] = useState<VerifyBankAccountData | null>(null);
  const [bankConfirmed, setBankConfirmed] = useState(false);
  /** True when using previously verified bank from myProfile (omit KYC on redeem). */
  const [reusedVerifiedBank, setReusedVerifiedBank] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  const [verifyingBank, setVerifyingBank] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (prefilled || profileLoading) return;

    if (profile) {
      if (profile.name) setName(profile.name);
      if (profile.upiVpa) setUpiVpa(profile.upiVpa);

      const bank = profile.bankDetails;
      if (bank) {
        setPayoutMethod('bank');
        setAccountNumber(bank.accountNumber);
        setIfsc(bank.ifsc);
        setBankName(bank.bankName ?? '');
        setAccountHolderName(bank.accountHolderName);
        if (bank.accountHolderName) {
          setName(bank.accountHolderName);
        }
        if (bank.verified) {
          setBankVerifyStep('review');
          setBankConfirmed(true);
          setReusedVerifiedBank(true);
        }
      }
    }

    setPrefilled(true);
  }, [profile, profileLoading, prefilled]);

  const clearBankVerification = () => {
    setBankVerifyStep('enter');
    setBankVerifyResult(null);
    setBankConfirmed(false);
    setReusedVerifiedBank(false);
    setError('');
  };

  const handlePayoutMethodChange = (method: PayoutMethod) => {
    setPayoutMethod(method);
    setError('');
    if (method === 'upi') {
      clearBankVerification();
    } else if (
      profile?.bankDetails?.verified &&
      normalizeAccount(accountNumber) === normalizeAccount(profile.bankDetails.accountNumber) &&
      normalizeIfsc(ifsc) === normalizeIfsc(profile.bankDetails.ifsc)
    ) {
      setAccountHolderName(profile.bankDetails.accountHolderName);
      if (profile.bankDetails.accountHolderName) {
        setName(profile.bankDetails.accountHolderName);
      }
      setBankVerifyStep('review');
      setBankConfirmed(true);
      setReusedVerifiedBank(true);
      setBankVerifyResult(null);
    }
  };

  const handleBankDetailsChange = (
    field: 'accountNumber' | 'ifsc' | 'bankName',
    value: string,
  ) => {
    if (field === 'accountNumber') {
      setAccountNumber(value.replace(/[^\d\s]/g, ''));
      if (bankVerifyResult || bankConfirmed || reusedVerifiedBank) {
        clearBankVerification();
      }
      return;
    }

    if (field === 'ifsc') {
      setIfsc(value.toUpperCase());
      if (bankVerifyResult || bankConfirmed || reusedVerifiedBank) {
        clearBankVerification();
      }
      return;
    }

    setBankName(value);
  };

  const handleVerifyBank = async () => {
    setError('');

    if (!isValidAccountNumber(accountNumber)) {
      setError('Please enter a valid bank account number (9–18 digits)');
      return;
    }
    if (!isValidIfsc(ifsc)) {
      setError('Please enter a valid IFSC code (e.g. HDFC0001234)');
      return;
    }

    setVerifyingBank(true);
    try {
      const result = await verifyBankAccount(accountNumber, ifsc);
      if (!result.accountHolderName || !result.kycVerificationDetails?.bank) {
        throw new Error('Bank verification did not return complete details');
      }
      setBankVerifyResult(result);
      setAccountHolderName(result.accountHolderName);
      setName(result.accountHolderName);
      setReusedVerifiedBank(false);
      setBankVerifyStep('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify bank account');
    } finally {
      setVerifyingBank(false);
    }
  };

  const handleConfirmBank = () => {
    if (!bankVerifyResult) return;
    setBankConfirmed(true);
    setError('');
  };

  const isReusingVerifiedBank =
    reusedVerifiedBank &&
    bankConfirmed &&
    Boolean(accountHolderName) &&
    Boolean(profile?.bankDetails?.verified) &&
    normalizeAccount(accountNumber) ===
      normalizeAccount(profile?.bankDetails?.accountNumber ?? '') &&
    normalizeIfsc(ifsc) === normalizeIfsc(profile?.bankDetails?.ifsc ?? '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidName(name)) {
      setError('Please enter your full name (at least 2 characters)');
      return;
    }

    if (payoutMethod === 'upi') {
      if (!isValidUpi(upiVpa)) {
        setError('Please enter a valid UPI ID (e.g. name@paytm)');
        return;
      }
    } else if (isReusingVerifiedBank) {
      // Skip verifyBankAccount — redeem with bank fields only.
    } else if (!bankConfirmed || !bankVerifyResult) {
      setError('Please verify and confirm your bank account before claiming');
      return;
    }

    setLoading(true);
    const idempotencyKey = getOrCreateIdempotencyKey();
    const normalizedAccountNumber = normalizeAccount(accountNumber);
    const normalizedIfsc = normalizeIfsc(ifsc);

    const payload =
      payoutMethod === 'upi'
        ? {
            code,
            name: name.trim(),
            upi_vpa: upiVpa.trim(),
            idempotency_key: idempotencyKey,
          }
        : isReusingVerifiedBank
          ? {
              code,
              name: name.trim(),
              account_holder_name: accountHolderName,
              account_number: normalizedAccountNumber,
              ifsc: normalizedIfsc,
              bank_name: bankName.trim() || undefined,
              idempotency_key: idempotencyKey,
            }
          : {
              code,
              name: name.trim(),
              account_holder_name: bankVerifyResult!.accountHolderName,
              account_number: normalizedAccountNumber,
              ifsc: normalizedIfsc,
              bank_name: bankName.trim() || undefined,
              kyc_verification_details: bankVerifyResult!
                .kycVerificationDetails as KycVerificationDetails,
              idempotency_key: idempotencyKey,
            };

    const payout: PayoutDetails =
      payoutMethod === 'upi'
        ? { method: 'upi', upiVpa: upiVpa.trim() }
        : {
            method: 'bank',
            accountNumber: normalizedAccountNumber,
            ifsc: normalizedIfsc,
            bankName: bankName.trim() || undefined,
          };

    try {
      const result = await redeemCoupon(payload);
      clearIdempotencyKey();
      void refreshProfile();
      onSuccess(result, payout);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to redeem coupon');
    } finally {
      setLoading(false);
    }
  };

  const canSubmitBank =
    payoutMethod === 'bank'
      ? isReusingVerifiedBank || (bankConfirmed && Boolean(bankVerifyResult))
      : true;

  const showBankReview =
    bankVerifyStep === 'review' && (Boolean(bankVerifyResult) || reusedVerifiedBank);

  const displayHolderName =
    bankVerifyResult?.accountHolderName || accountHolderName || '—';

  return (
    <div className={styles.redeemFlow}>
      <motion.aside
        className={styles.rewardPreview}
        initial={{ opacity: 0, scale: 0.92, x: -16 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <motion.div
          className={styles.rewardPreviewInner}
          initial={{ scale: 0.95 }}
          animate={{ scale: [0.95, 1.03, 1] }}
          transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
        >
          <VerifyCelebration />
          <Gift className={styles.rewardPreviewIcon} size={32} strokeWidth={1.5} aria-hidden="true" />
          <p className={styles.rewardPreviewLabel}>You won</p>
          <motion.p
            className={styles.rewardPreviewAmount}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.25 }}
          >
            ₹{faceValueRupees}
          </motion.p>
          <div className={styles.rewardPreviewCode}>
            <Ticket size={14} strokeWidth={2} aria-hidden="true" />
            <span>{code}</span>
          </div>
          <p className={styles.rewardPreviewNote}>
            Final payout may include bonus rewards at claim time.
          </p>
        </motion.div>
        <button type="button" className={styles.rewardBackBtn} onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
          Change code
        </button>
      </motion.aside>

      <motion.div
        className={styles.redeemFormPanel}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12, ease: 'easeOut' }}
      >
        <h3 className={styles.redeemFormHeading}>Claim your reward</h3>
        <div className={styles.claimNotice} role="status">
          <Info className={styles.claimNoticeIcon} size={18} strokeWidth={2} aria-hidden="true" />
          <div>
            <p className={styles.claimNoticeTitle}>Coupon verified successfully</p>
            <p className={styles.claimNoticeText}>
              {payoutMethod === 'bank'
                ? isReusingVerifiedBank
                  ? 'Using your saved verified bank account. You can claim without verifying again.'
                  : 'Bank account is recommended for automatic payout. Enter and verify your account before claiming.'
                : 'UPI payouts are processed manually and may take longer. For automatic settlement, switch to bank account.'}
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className={styles.compactForm}>
          <div className={styles.formRow2}>
            <div className={styles.formGroup}>
              <label htmlFor="redeem-name">Full name *</label>
              <input
                id="redeem-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                placeholder="Rajesh Kumar"
                maxLength={255}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="redeem-phone">Phone</label>
              <input
                id="redeem-phone"
                type="tel"
                value={phone ?? ''}
                className={`${styles.input} ${styles.readOnly}`}
                readOnly
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <span className={styles.fieldLabel}>Payout method *</span>
            <div className={styles.payoutToggle} role="group" aria-label="Payout method">
              <button
                type="button"
                className={`${styles.payoutOption} ${payoutMethod === 'bank' ? styles.payoutOptionActive : ''}`}
                onClick={() => handlePayoutMethodChange('bank')}
              >
                Bank account
              </button>
              <button
                type="button"
                className={`${styles.payoutOption} ${payoutMethod === 'upi' ? styles.payoutOptionActive : ''}`}
                onClick={() => handlePayoutMethodChange('upi')}
              >
                UPI
              </button>
            </div>
          </div>

          {payoutMethod === 'upi' ? (
            <div className={styles.formGroup}>
              <label htmlFor="redeem-edit-upi">UPI ID *</label>
              <input
                id="redeem-edit-upi"
                type="text"
                value={upiVpa}
                onChange={(e) => setUpiVpa(e.target.value)}
                className={styles.input}
                placeholder="name@paytm"
                required
              />
            </div>
          ) : (
            <div className={styles.bankFields}>
              {bankVerifyStep === 'enter' && (
                <>
                  <div className={styles.formRow2}>
                    <div className={styles.formGroup}>
                      <label htmlFor="redeem-account-number">Account number *</label>
                      <input
                        id="redeem-account-number"
                        type="text"
                        inputMode="numeric"
                        value={accountNumber}
                        onChange={(e) => handleBankDetailsChange('accountNumber', e.target.value)}
                        className={styles.input}
                        placeholder="123456789012"
                        required
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="redeem-ifsc">IFSC *</label>
                      <input
                        id="redeem-ifsc"
                        type="text"
                        value={ifsc}
                        onChange={(e) => handleBankDetailsChange('ifsc', e.target.value)}
                        className={styles.input}
                        placeholder="HDFC0001234"
                        maxLength={11}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.bankVerifyRow}>
                    <button
                      type="button"
                      className={styles.bankVerifyBtn}
                      onClick={handleVerifyBank}
                      disabled={verifyingBank}
                    >
                      {verifyingBank ? (
                        <>
                          <Loader2
                            className={styles.bankVerifyBtnSpin}
                            size={16}
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                          Verifying…
                        </>
                      ) : (
                        <>
                          <ShieldCheck size={16} strokeWidth={2} aria-hidden="true" />
                          Verify account
                        </>
                      )}
                    </button>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="redeem-bank-name">Bank name</label>
                    <input
                      id="redeem-bank-name"
                      type="text"
                      value={bankName}
                      onChange={(e) => handleBankDetailsChange('bankName', e.target.value)}
                      className={styles.input}
                      placeholder="HDFC Bank"
                      maxLength={255}
                    />
                  </div>
                </>
              )}

              {showBankReview && (
                <div className={styles.bankVerifyCard}>
                  <div className={styles.bankVerifyHeader}>
                    <Building2 size={20} strokeWidth={2} aria-hidden="true" />
                    <span>Bank account verified</span>
                    {(reusedVerifiedBank || bankConfirmed) && (
                      <span className={styles.verifiedBadge}>
                        <ShieldCheck size={12} strokeWidth={2.5} aria-hidden="true" />
                        Verified
                      </span>
                    )}
                  </div>
                  <dl className={styles.bankVerifyDetails}>
                    <div>
                      <dt>Account holder</dt>
                      <dd>{displayHolderName}</dd>
                    </div>
                    <div>
                      <dt>Account number</dt>
                      <dd>{normalizeAccount(accountNumber)}</dd>
                    </div>
                    <div>
                      <dt>IFSC</dt>
                      <dd>{normalizeIfsc(ifsc)}</dd>
                    </div>
                    {bankName.trim() && (
                      <div>
                        <dt>Bank</dt>
                        <dd>{bankName.trim()}</dd>
                      </div>
                    )}
                  </dl>
                  {!bankConfirmed && bankVerifyResult ? (
                    <div className={styles.bankVerifyActions}>
                      <button
                        type="button"
                        className={styles.textButton}
                        onClick={clearBankVerification}
                      >
                        Change account
                      </button>
                      <PrimaryButton type="button" onClick={handleConfirmBank}>
                        Confirm account
                      </PrimaryButton>
                    </div>
                  ) : (
                    <div className={styles.bankVerifyActions}>
                      <div className={styles.bankConfirmedBanner} role="status">
                        <CheckCircle2 size={18} strokeWidth={2} aria-hidden="true" />
                        <span>
                          {reusedVerifiedBank
                            ? 'Saved verified bank — ready to claim.'
                            : 'Bank account confirmed — you can claim your reward below.'}
                        </span>
                      </div>
                      <button
                        type="button"
                        className={styles.textButton}
                        onClick={clearBankVerification}
                      >
                        Change account
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <PrimaryButton
            type="submit"
            className={styles.fullWidth}
            disabled={loading || !canSubmitBank || (!prefilled && profileLoading)}
          >
            {loading ? 'Submitting…' : 'Claim Reward'}
          </PrimaryButton>
        </form>
      </motion.div>
    </div>
  );
}
