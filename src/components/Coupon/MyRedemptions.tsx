'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CircleCheck,
  Clock,
  Copy,
  Hash,
  IndianRupee,
  Ticket,
} from 'lucide-react';
import { getMyRedemptions } from '@/lib/coupon/api';
import type { MyRedemptionsData, Redemption } from '@/lib/coupon/types';
import { paiseToRupees } from '@/lib/coupon/validation';
import styles from './Coupon.module.css';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function StatusBadge({ status }: { status: Redemption['payoutStatus'] }) {
  const isPaid = status === 'paid';
  return (
    <span className={`${styles.badge} ${isPaid ? styles.badgePaid : styles.badgePending}`}>
      {isPaid ? (
        <>
          <CircleCheck size={14} strokeWidth={2.5} aria-hidden="true" />
          Paid
        </>
      ) : (
        <>
          <Clock size={14} strokeWidth={2} aria-hidden="true" />
          Pending
        </>
      )}
    </span>
  );
}

function RedemptionRow({ item }: { item: Redemption }) {
  const [copied, setCopied] = useState(false);

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(item.publicRef);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <tr className={styles.historyRow}>
      <td className={styles.historyCellDate}>{formatDate(item.redeemedAt)}</td>
      <td className={styles.historyCellRef}>
        <div className={styles.historyRefGroup}>
          <span className={styles.historyRef}>{item.publicRef}</span>
          <button type="button" className={styles.copyBtnSmall} onClick={copyRef}>
            <Copy size={12} strokeWidth={2} aria-hidden="true" />
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </td>
      <td className={styles.historyCellAmount}>
        <strong>₹{paiseToRupees(item.totalAmountPaise)}</strong>
        {item.bonusAmountPaise > 0 && (
          <span className={styles.historyBonus}>
            ₹{paiseToRupees(item.baseAmountPaise)} + ₹{paiseToRupees(item.bonusAmountPaise)} bonus
          </span>
        )}
      </td>
      <td className={styles.historyCellStatus}>
        <StatusBadge status={item.payoutStatus} />
      </td>
      <td className={styles.historyCellPaid}>
        {item.paidAt ? (
          <>
            {formatDate(item.paidAt)}
            {item.paidVia && (
              <span className={styles.historyPaidVia}>via {item.paidVia}</span>
            )}
          </>
        ) : (
          <span className={styles.historyDash}>—</span>
        )}
      </td>
    </tr>
  );
}

function RedemptionCard({ item }: { item: Redemption }) {
  return (
    <article className={styles.redemptionCard}>
      <div className={styles.redemptionCardTop}>
        <StatusBadge status={item.payoutStatus} />
        <span className={styles.redemptionAmount}>₹{paiseToRupees(item.totalAmountPaise)}</span>
      </div>
      <div className={styles.redemptionCardBody}>
        <div className={styles.redemptionCardRow}>
          <span>Redeemed</span>
          <span>{formatDate(item.redeemedAt)}</span>
        </div>
        <div className={styles.redemptionCardRow}>
          <span>Reference</span>
          <span className={styles.historyRef}>{item.publicRef}</span>
        </div>
        {item.bonusAmountPaise > 0 && (
          <div className={styles.redemptionCardRow}>
            <span>Breakdown</span>
            <span className={styles.historyBonus}>
              ₹{paiseToRupees(item.baseAmountPaise)} + ₹{paiseToRupees(item.bonusAmountPaise)} bonus
            </span>
          </div>
        )}
        {item.paidAt && (
          <div className={styles.redemptionCardRow}>
            <span>Paid</span>
            <span>
              {formatDate(item.paidAt)}
              {item.paidVia ? ` via ${item.paidVia}` : ''}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}

export default function MyRedemptions() {
  const [data, setData] = useState<MyRedemptionsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getMyRedemptions();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load redemptions');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className={styles.panelLoading}>
        <div className={styles.loadingSpinner} />
        <p>Loading your redemptions…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.panel}>
        <p className={styles.error}>{error}</p>
        <button type="button" className={styles.textButton} onClick={load}>
          Try again
        </button>
      </div>
    );
  }

  if (!data || data.redemptions.length === 0) {
    return (
      <div className={styles.panel}>
        <div className={styles.emptyStateBox}>
          <Ticket className={styles.emptyStateIcon} size={40} strokeWidth={1.5} aria-hidden="true" />
          <h3 className={styles.emptyStateTitle}>No redemptions yet</h3>
          <p className={styles.emptyStateText}>
            Redeem your first coupon to see your reward history here.
          </p>
        </div>
      </div>
    );
  }

  const pendingCount = data.redemptions.filter((r) => r.payoutStatus === 'pending').length;

  return (
    <div className={styles.historyWrapper}>
      <div className={styles.statsStrip}>
        <div className={styles.statTile}>
          <div className={styles.statTileIcon}>
            <Hash size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <div>
            <span className={styles.statTileLabel}>Total redeemed</span>
            <span className={styles.statTileValue}>{data.totalRedemptions}</span>
          </div>
        </div>
        <div className={styles.statTile}>
          <div className={`${styles.statTileIcon} ${styles.statTileIconAccent}`}>
            <IndianRupee size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <div>
            <span className={styles.statTileLabel}>Lifetime earned</span>
            <span className={styles.statTileValue}>₹{paiseToRupees(data.lifetimeEarnedPaise)}</span>
          </div>
        </div>
        <div className={styles.statTile}>
          <div className={`${styles.statTileIcon} ${styles.statTileIconPending}`}>
            <Clock size={20} strokeWidth={2} aria-hidden="true" />
          </div>
          <div>
            <span className={styles.statTileLabel}>Pending payout</span>
            <span className={styles.statTileValue}>{pendingCount}</span>
          </div>
        </div>
      </div>

      <div className={styles.panel}>
        <div className={styles.historyTableWrap}>
          <table className={styles.historyTable}>
            <thead>
              <tr>
                <th>Redeemed</th>
                <th>Reference</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Paid on</th>
              </tr>
            </thead>
            <tbody>
              {data.redemptions.map((item) => (
                <RedemptionRow key={item.publicRef} item={item} />
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.historyCardsMobile}>
          {data.redemptions.map((item) => (
            <RedemptionCard key={item.publicRef} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
