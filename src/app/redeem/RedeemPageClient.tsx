'use client';

import { Suspense } from 'react';
import { CouponAuthProvider } from '@/context/CouponAuthContext';
import CouponApp from '@/components/Coupon/CouponApp';
import styles from './page.module.css';

function RedeemContent() {
  return (
    <CouponAuthProvider>
      <div className={styles.redeemRoot}>
        <CouponApp />
      </div>
    </CouponAuthProvider>
  );
}

export default function RedeemPageClient() {
  return (
    <div className={styles.page}>
      <div className={styles.pageGlow} aria-hidden="true" />
      <div className={styles.pageInner}>
        <Suspense fallback={<p className={styles.loading}>Loading…</p>}>
          <RedeemContent />
        </Suspense>
      </div>
    </div>
  );
}
