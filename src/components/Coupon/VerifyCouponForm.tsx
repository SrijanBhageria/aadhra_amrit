'use client';

import { useCallback, useState } from 'react';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import { verifyCoupon } from '@/lib/coupon/api';
import type { VerifyCouponData } from '@/lib/coupon/types';
import {
  getVerifyErrorMessage,
  isValidCodeFormat,
  normalizeCode,
} from '@/lib/coupon/validation';
import styles from './Coupon.module.css';

interface VerifyCouponFormProps {
  initialCode?: string;
  onVerified: (code: string, result: VerifyCouponData) => void;
}

export default function VerifyCouponForm({
  initialCode = '',
  onVerified,
}: VerifyCouponFormProps) {
  const [code, setCode] = useState(normalizeCode(initialCode));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = useCallback(async (codeToVerify: string) => {
    const normalized = normalizeCode(codeToVerify);
    if (!isValidCodeFormat(normalized)) {
      setError('Enter a valid 8-character coupon code');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await verifyCoupon(normalized);
      if (!result.valid) {
        setError(getVerifyErrorMessage(result.reason, result.message));
        return;
      }
      onVerified(normalized, result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify coupon');
    } finally {
      setLoading(false);
    }
  }, [onVerified]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(code);
  };

  const handleCodeChange = (value: string) => {
    const normalized = normalizeCode(value).slice(0, 8);
    setCode(normalized);
    setError('');
  };

  return (
    <div className={styles.panel}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="coupon-code">Coupon code</label>
          <input
            id="coupon-code"
            type="text"
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className={`${styles.input} ${styles.codeInput}`}
            placeholder="AB12CD34"
            maxLength={8}
            autoComplete="off"
            spellCheck={false}
          />
          <span className={styles.hint}>{code.length}/8 characters</span>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <PrimaryButton
          type="submit"
          className={styles.fullWidth}
        >
          {loading ? 'Verifying…' : 'Verify Coupon'}
        </PrimaryButton>
      </form>
    </div>
  );
}
