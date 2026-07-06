'use client';

import { useCallback, useEffect, useState } from 'react';
import { getMyProfile } from '@/lib/coupon/api';
import type { MyProfileData } from '@/lib/coupon/types';
import { formatPhoneDisplay, paiseToRupees } from '@/lib/coupon/validation';
import { useCouponAuth } from '@/context/CouponAuthContext';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import styles from './Coupon.module.css';

function formatMonthYear(iso: string): string {
  return new Date(iso).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
}

interface MyProfileProps {
  onLogout: () => void;
}

export default function MyProfile({ onLogout }: MyProfileProps) {
  const { phone } = useCouponAuth();
  const [data, setData] = useState<MyProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getMyProfile();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setLoggingOut(false);
    }
  };

  if (loading) {
    return <p className={styles.loading}>Loading profile…</p>;
  }

  if (error) {
    return (
      <div className={styles.card}>
        <p className={styles.error}>{error}</p>
        <button type="button" className={styles.textButton} onClick={load}>
          Try again
        </button>
      </div>
    );
  }

  const displayName = data?.name ?? 'Customer';
  const displayPhone = data?.phone ?? phone ?? '';

  return (
    <div className={styles.panel}>
      <div className={styles.profileHeader}>
        <div className={styles.avatar}>{displayName.charAt(0).toUpperCase()}</div>
        <div>
          <h2 className={styles.profileName}>{displayName}</h2>
          <p className={styles.profilePhone}>{formatPhoneDisplay(displayPhone)}</p>
        </div>
      </div>

      {data && (
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

          {data.firstRedeemedAt && (
            <p className={styles.profileMeta}>
              Member since {formatMonthYear(data.firstRedeemedAt)}
            </p>
          )}
        </>
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
