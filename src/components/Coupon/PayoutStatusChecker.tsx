'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { CircleCheck, Clock } from 'lucide-react';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import { getPayoutStatus } from '@/lib/coupon/api';
import { formatPaidVia } from '@/lib/coupon/formatPaidVia';
import type { PayoutStatusData } from '@/lib/coupon/types';
import { paiseToRupees } from '@/lib/coupon/validation';
import styles from './Coupon.module.css';

const POLL_INTERVAL_MS = 5000;

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
  const [polling, setPolling] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    setPolling(false);
  }, []);

  const fetchStatus = useCallback(async (ref: string, { silent }: { silent?: boolean } = {}) => {
    if (!silent) {
      setLoading(true);
      setError('');
    }

    try {
      const result = await getPayoutStatus(ref);
      setStatus(result);
      return result;
    } catch (err) {
      if (!silent) {
        setStatus(null);
        setError(err instanceof Error ? err.message : 'Failed to check status');
      }
      return null;
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!status || status.payoutStatus !== 'pending') {
      stopPolling();
      return;
    }

    const ref = status.publicRef;
    setPolling(true);
    pollRef.current = setInterval(() => {
      void fetchStatus(ref, { silent: true }).then((result) => {
        if (result?.payoutStatus === 'paid') {
          stopPolling();
        }
      });
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [status?.publicRef, status?.payoutStatus, fetchStatus, stopPolling]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    stopPolling();
    setStatus(null);

    const ref = publicRef.trim();
    if (!ref) {
      setError('Please enter your reference number');
      return;
    }

    await fetchStatus(ref);
  };

  const paidViaLabel = status ? formatPaidVia(status.paidVia) : null;
  const showDelayedNotice =
    status?.payoutStatus === 'pending' && Boolean(status.lastPayoutError);

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
                  {polling ? 'Payment in progress…' : 'Payment in progress'}
                </>
              )}
            </span>
          </div>
          {paidViaLabel && (
            <div className={styles.detailRow}>
              <span>Payment</span>
              <span>{paidViaLabel}</span>
            </div>
          )}
          <div className={styles.detailRow}>
            <span>Reference</span>
            <span>{status.publicRef}</span>
          </div>
          {showDelayedNotice && (
            <p className={styles.statusSoftNotice} role="status">
              Processing is taking longer than usual. Your redemption is still valid — if it
              doesn&apos;t arrive soon, contact support with your reference number.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
