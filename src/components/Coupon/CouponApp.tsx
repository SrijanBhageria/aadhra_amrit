'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Ticket,
  ClipboardList,
  CreditCard,
  User,
  Wheat,
  Check,
  Shield,
  Zap,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import OtpLogin from '@/components/Coupon/OtpLogin';
import VerifyCouponForm from '@/components/Coupon/VerifyCouponForm';
import RedeemForm from '@/components/Coupon/RedeemForm';
import RedeemSuccess from '@/components/Coupon/RedeemSuccess';
import MyRedemptions from '@/components/Coupon/MyRedemptions';
import MyProfile from '@/components/Coupon/MyProfile';
import PayoutStatusChecker from '@/components/Coupon/PayoutStatusChecker';
import { useCouponAuth } from '@/context/CouponAuthContext';
import type { PayoutDetails, RedeemCouponData, RedeemTab, VerifyCouponData } from '@/lib/coupon/types';
import { normalizeCode } from '@/lib/coupon/validation';
import styles from './Coupon.module.css';

type FlowStep = 'verify' | 'redeem' | 'success';

const TAB_META: Record<RedeemTab, { title: string; subtitle: string }> = {
  redeem: {
    title: 'Redeem Coupon',
    subtitle: 'Enter your 8-character code to verify and claim your reward.',
  },
  history: {
    title: 'My Redemptions',
    subtitle: 'All your coupon rewards and payout history in one place.',
  },
  payout: {
    title: 'Payout Status',
    subtitle: 'Look up payment progress using your reference number.',
  },
  profile: {
    title: 'My Profile',
    subtitle: 'Your account summary and redemption statistics.',
  },
};

const TABS: { id: RedeemTab; label: string; Icon: LucideIcon }[] = [
  { id: 'redeem', label: 'Redeem', Icon: Ticket },
  { id: 'history', label: 'My Redemptions', Icon: ClipboardList },
  { id: 'payout', label: 'Payout Status', Icon: CreditCard },
  { id: 'profile', label: 'Profile', Icon: User },
];

const HERO_FEATURES = [
  { Icon: Shield, text: 'OTP-secured login' },
  { Icon: Zap, text: 'Instant coupon verification' },
  { Icon: Wallet, text: 'UPI or bank payout' },
] as const;

export default function CouponApp() {
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, logout, phone } = useCouponAuth();

  const [activeTab, setActiveTab] = useState<RedeemTab>('redeem');
  const [flowStep, setFlowStep] = useState<FlowStep>('verify');
  const [couponCode, setCouponCode] = useState('');
  const [verifyResult, setVerifyResult] = useState<VerifyCouponData | null>(null);
  const [redeemResult, setRedeemResult] = useState<RedeemCouponData | null>(null);
  const [payoutDetails, setPayoutDetails] = useState<PayoutDetails | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  const urlCode = searchParams.get('code') ?? '';
  const normalizedUrlCode = urlCode ? normalizeCode(urlCode) : '';
  const isSuccess = activeTab === 'redeem' && flowStep === 'success';
  const isClaimFlow = activeTab === 'redeem' && (flowStep === 'redeem' || flowStep === 'success');

  useEffect(() => {
    if (normalizedUrlCode) {
      setCouponCode(normalizedUrlCode);
      setActiveTab('redeem');
    }
  }, [normalizedUrlCode]);

  useEffect(() => {
    if (flowStep === 'redeem' || flowStep === 'success') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [flowStep]);

  const handleVerified = useCallback((code: string, result: VerifyCouponData) => {
    setCouponCode(code);
    setVerifyResult(result);
    setFlowStep('redeem');
  }, []);

  const handleRedeemSuccess = useCallback(
    (result: RedeemCouponData, payout: PayoutDetails) => {
      setRedeemResult(result);
      setPayoutDetails(payout);
      setFlowStep('success');
    },
    [],
  );

  const resetFlow = useCallback(() => {
    setFlowStep('verify');
    setCouponCode('');
    setVerifyResult(null);
    setRedeemResult(null);
    setPayoutDetails(null);
  }, []);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await logout();
      resetFlow();
      setActiveTab('redeem');
    } finally {
      setLoggingOut(false);
    }
  }, [logout, resetFlow]);

  const handleTabChange = (tab: RedeemTab) => {
    setActiveTab(tab);
    if (tab !== 'redeem') {
      resetFlow();
    }
  };

  if (isLoading) {
    return (
      <div className={`${styles.shell} ${styles.shellLogin}`}>
        <p className={styles.loading}>Loading your session…</p>
      </div>
    );
  }

  return (
    <div
      className={`${styles.shell} ${isSuccess ? styles.shellSuccess : ''} ${isClaimFlow ? styles.shellClaim : ''} ${!isAuthenticated ? styles.shellLogin : ''}`}
    >
      {isClaimFlow && isAuthenticated && phone && (
        <div className={styles.claimTopBar}>
          <div className={styles.headerActions}>
            <div className={styles.phoneBadge}>
              <span className={styles.phoneDot} />
              +91 {phone.slice(-10)}
            </div>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? 'Logging out…' : 'Logout'}
            </button>
          </div>
        </div>
      )}

      {!isAuthenticated ? (
        <div className={styles.loginLayout}>
          <div className={styles.loginHero}>
            <div className={styles.heroCard}>
              <Wheat className={styles.heroIcon} size={40} strokeWidth={1.5} aria-hidden="true" />
              <h2>Purity in every reward</h2>
              <p>
                Enter your phone number to securely redeem coupon codes, view your
                redemption history, and check payout status.
              </p>
              <ul className={styles.heroList}>
                {HERO_FEATURES.map(({ Icon, text }) => (
                  <li key={text}>
                    <Check className={styles.heroCheck} size={16} strokeWidth={2.5} aria-hidden="true" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className={styles.loginForm}>
            <OtpLogin onSuccess={() => setActiveTab('redeem')} />
          </div>
        </div>
      ) : (
        <div className={`${styles.body} ${isSuccess ? styles.bodySuccess : ''} ${isClaimFlow ? styles.bodyClaim : ''}`}>
          {!isClaimFlow && (
            <nav className={styles.sidebar} aria-label="Coupon sections">
              <p className={styles.sidebarBrand}>Rewards</p>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.navItem} ${activeTab === tab.id ? styles.navItemActive : ''}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  <tab.Icon className={styles.navIcon} size={18} strokeWidth={2} aria-hidden="true" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          )}

          <div className={styles.contentColumn}>
            {!isClaimFlow && (
              <div className={styles.contentHeader}>
                <div>
                  <h2 className={styles.panelTitle}>{TAB_META[activeTab].title}</h2>
                  <p className={styles.panelSubtitle}>{TAB_META[activeTab].subtitle}</p>
                </div>
                {phone && (
                  <div className={styles.headerActions}>
                    <div className={styles.phoneBadge}>
                      <span className={styles.phoneDot} />
                      +91 {phone.slice(-10)}
                    </div>
                    <button
                      type="button"
                      className={styles.logoutBtn}
                      onClick={handleLogout}
                      disabled={loggingOut}
                    >
                      {loggingOut ? 'Logging out…' : 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            )}

            <main className={`${styles.main} ${isSuccess ? styles.mainSuccess : ''}`}>
            {activeTab === 'redeem' && (
              <>
                {flowStep === 'verify' && (
                  <VerifyCouponForm
                    initialCode={couponCode || normalizedUrlCode}
                    onVerified={handleVerified}
                  />
                )}
                {flowStep === 'redeem' && verifyResult?.faceValueRupees != null && (
                  <RedeemForm
                    code={couponCode}
                    faceValueRupees={verifyResult.faceValueRupees}
                    onSuccess={handleRedeemSuccess}
                    onBack={resetFlow}
                  />
                )}
                {flowStep === 'success' && redeemResult && payoutDetails && (
                  <RedeemSuccess
                    result={redeemResult}
                    payout={payoutDetails}
                    onViewHistory={() => {
                      setActiveTab('history');
                      resetFlow();
                    }}
                    onRedeemAnother={resetFlow}
                  />
                )}
              </>
            )}

            {activeTab === 'history' && <MyRedemptions />}
            {activeTab === 'payout' && <PayoutStatusChecker />}
            {activeTab === 'profile' && <MyProfile onLogout={handleLogout} />}
            </main>
          </div>
        </div>
      )}
    </div>
  );
}
