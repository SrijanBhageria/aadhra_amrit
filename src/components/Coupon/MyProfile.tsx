'use client';

import { useEffect, useState } from 'react';
import { Building2, ShieldCheck } from 'lucide-react';
import type { MyProfileData } from '@/lib/coupon/types';
import { formatPhoneDisplay, paiseToRupees } from '@/lib/coupon/validation';
import { useCouponAuth } from '@/context/CouponAuthContext';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import styles from './Coupon.module.css';

function formatMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

interface MyProfileProps {
  onLogout: () => void;
}

export default function MyProfile({ onLogout }: MyProfileProps) {
  const { phone, profile, profileLoading, refreshProfile } = useCouponAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setRefreshing(true);
    void refreshProfile().finally(() => setRefreshing(false));
  }, [refreshProfile]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setLoggingOut(false);
    }
  };

  if ((profileLoading || refreshing) && !profile) {
    return <p className={styles.loading}>Loading profile…</p>;
  }

  const data: MyProfileData | null = profile;
  const displayName = data?.name || 'Customer';
  const displayPhone = data?.phone ?? phone ?? '';
  const bank = data?.bankDetails;

  return (
    <div className={styles.panel}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>{displayName.charAt(0).toUpperCase()}</div>
        <div>
          <h2 className={styles.profileName}>{displayName}</h2>
          <p className={styles.profilePhone}>{formatPhoneDisplay(displayPhone)}</p>
        </div>
      </div>

      {data ? (
        <>
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total redeemed</span>
              <span className={styles.statValue}>{data.totalRedemptions}</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statLabel}>Total earned</span>
              <span className={styles.statValue}>₹{paiseToRupees(data.lifetimeEarnedPaise)}</span>
            </div>
          </div>

          {data.upiVpa && (
            <p className={styles.profileMeta}>UPI: {data.upiVpa}</p>
          )}

          {bank && (
            <div className={styles.profileBankCard}>
              <div className={styles.profileBankHeader}>
                <Building2 size={18} strokeWidth={2} aria-hidden="true" />
                <span>Bank account</span>
                {bank.verified && (
                  <span className={styles.verifiedBadge}>
                    <ShieldCheck size={12} strokeWidth={2.5} aria-hidden="true" />
                    Verified
                  </span>
                )}
              </div>
              <dl className={styles.bankVerifyDetails}>
                <div>
                  <dt>Account holder</dt>
                  <dd>{bank.accountHolderName}</dd>
                </div>
                <div>
                  <dt>Account number</dt>
                  <dd>{bank.accountNumber}</dd>
                </div>
                <div>
                  <dt>IFSC</dt>
                  <dd>{bank.ifsc}</dd>
                </div>
                {bank.bankName && (
                  <div>
                    <dt>Bank</dt>
                    <dd>{bank.bankName}</dd>
                  </div>
                )}
              </dl>
              {bank.verified && bank.verifiedAt && (
                <p className={styles.profileMeta}>
                  Verified on {formatDate(bank.verifiedAt)}
                </p>
              )}
            </div>
          )}

          {data.firstRedeemedAt && (
            <p className={styles.profileMeta}>
              Member since {formatMonthYear(data.firstRedeemedAt)}
            </p>
          )}
        </>
      ) : (
        <p className={styles.profileMeta}>
          No redemptions yet. Redeem a coupon to save your payout details here.
        </p>
      )}

      <PrimaryButton
        onClick={handleLogout}
        className={`${styles.fullWidth} ${styles.logoutButton}`}
      >
        {loggingOut ? 'Logging out…' : 'Logout'}
      </PrimaryButton>
    </div>
  );
}
