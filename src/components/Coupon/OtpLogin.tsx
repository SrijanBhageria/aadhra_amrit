'use client';

import { useEffect, useRef, useState } from 'react';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import { sendOtp } from '@/lib/coupon/api';
import { formatPhoneDisplay, isValidIndianPhone } from '@/lib/coupon/validation';
import { useCouponAuth } from '@/context/CouponAuthContext';
import styles from './Coupon.module.css';

interface OtpLoginProps {
  onSuccess?: () => void;
}

export default function OtpLogin({ onSuccess }: OtpLoginProps) {
  const { login } = useCouponAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSentAt, setOtpSentAt] = useState<number | null>(null);
  const [resendSeconds, setResendSeconds] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!otpSentAt) return;

    const updateCountdown = () => {
      const elapsed = Date.now() - otpSentAt;
      setResendSeconds(Math.max(0, 60 - Math.floor(elapsed / 1000)));
    };

    updateCountdown();
    const intervalId = window.setInterval(updateCountdown, 1000);
    return () => window.clearInterval(intervalId);
  }, [otpSentAt]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidIndianPhone(phone)) {
      setError('Please enter a valid 10-digit Indian phone number');
      return;
    }

    setLoading(true);
    try {
      await sendOtp(phone.replace(/\D/g, '').slice(-10));
      setStep('otp');
      setOtpSentAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const normalizedPhone = phone.replace(/\D/g, '').slice(-10);
      await login(normalizedPhone, otp);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const canResend = resendSeconds === 0;

  const otpDigits = Array.from({ length: 6 }, (_, index) => otp[index] ?? '');

  const focusOtpInput = (index: number) => {
    otpRefs.current[index]?.focus();
  };

  const handleOtpDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const nextDigits = [...otpDigits];
    nextDigits[index] = digit;
    setOtp(nextDigits.join('').replace(/\s/g, ''));
    if (digit && index < 5) {
      focusOtpInput(index + 1);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      focusOtpInput(index - 1);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    setOtp(pasted);
    focusOtpInput(Math.min(pasted.length, 5));
  };

  const handleResend = async () => {
    if (!canResend) return;
    setError('');
    setLoading(true);
    try {
      await sendOtp(phone.replace(/\D/g, '').slice(-10));
      setOtpSentAt(Date.now());
      setOtp('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'phone') {
    return (
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Login with OTP</h2>
        <p className={styles.cardSubtitle}>
          Enter your phone number to receive a one-time password. Login is required to redeem coupons.
        </p>
        <form onSubmit={handleSendOtp} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="login-phone">Phone number</label>
            <input
              id="login-phone"
              type="tel"
              inputMode="numeric"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={styles.input}
              autoComplete="tel"
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <PrimaryButton type="submit" className={styles.fullWidth}>
            {loading ? 'Sending…' : 'Send OTP'}
          </PrimaryButton>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>Enter OTP</h2>
      <p className={styles.cardSubtitle}>
        OTP sent to {formatPhoneDisplay(phone)}
      </p>
      <form onSubmit={handleVerifyOtp} className={styles.form}>
        <div className={styles.formGroup}>
          <span className={styles.otpLabel} id="login-otp-label">
            6-digit OTP
          </span>
          <div
            className={styles.otpBoxes}
            role="group"
            aria-labelledby="login-otp-label"
          >
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  otpRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={handleOtpPaste}
                className={styles.otpBox}
                autoComplete={index === 0 ? 'one-time-code' : 'off'}
                autoFocus={index === 0}
                aria-label={`Digit ${index + 1} of 6`}
                required={index === 0}
              />
            ))}
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <PrimaryButton type="submit" className={styles.fullWidth}>
          {loading ? 'Verifying…' : 'Verify & Continue'}
        </PrimaryButton>
        <div className={styles.linkRow}>
          <button
            type="button"
            className={styles.textButton}
            onClick={() => {
              setStep('phone');
              setOtp('');
              setError('');
            }}
          >
            Change number
          </button>
          <button
            type="button"
            className={styles.textButton}
            onClick={handleResend}
            disabled={!canResend || loading}
          >
            {canResend ? 'Resend OTP' : `Resend in ${resendSeconds}s`}
          </button>
        </div>
      </form>
    </div>
  );
}
