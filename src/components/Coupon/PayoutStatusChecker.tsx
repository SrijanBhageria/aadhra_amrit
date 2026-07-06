'use client';

import { useState } from 'react';
import { CircleCheck, Clock } from 'lucide-react';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import { getPayoutStatus } from '@/lib/coupon/api';
import type { PayoutStatusData } from '@/lib/coupon/types';
import { paiseToRupees } from '@/lib/coupon/validation';
import styles from './Coupon.module.css';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function PayoutStatusChecker() {
  const [publicRef, setPublicRef] = useState('');
  const [status, setStatus] = useState<PayoutStatusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus(null);

    const ref = publicRef.trim();
    if (!ref) {
      setError('Please enter your reference number');
      return;
    }

    setLoading(true);
    try {
      const result = await getPayoutStatus(ref);
      setStatus(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <form onSubmit={handleCheck} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="payout-ref">Reference number</label>
          <input
            id="payout-ref"
            type="text"
            value={publicRef}
            onChange={(e) => setPublicRef(e.target.value.toUpperCase())}
            className={styles.input}
            placeholder="RED-2026-A1B2"
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <PrimaryButton type="submit" className={styles.fullWidth}>
          {loading ? 'Checking…' : 'Check Status'}
        </PrimaryButton>
      </form>

      {status && (
        <div className={styles.statusCard}>
          <div className={styles.detailRow}>
            <span>Amount</span>
            <strong>₹{paiseToRupees(status.totalAmountPaise)}</strong>
          </div>
          <div className={styles.detailRow}>
            <span>Status</span>
            <span
              className={`${styles.badge} ${
                status.payoutStatus === 'paid' ? styles.badgePaid : styles.badgePending
              }`}
            >
              {status.payoutStatus === 'paid' ? (
                <>
                  <CircleCheck size={14} strokeWidth={2.5} aria-hidden="true" />
                  Paid on {formatDate(status.paidAt!)}
                </>
              ) : (
                <>
                  <Clock size={14} strokeWidth={2} aria-hidden="true" />
                  Payment in progress
                </>
              )}
            </span>
          </div>
          <div className={styles.detailRow}>
            <span>Reference</span>
            <span>{status.publicRef}</span>
          </div>
          {status.lastPayoutError && (
            <p className={styles.error}>Issue: {status.lastPayoutError}</p>
          )}
        </div>
      )}
    </div>
  );
}
