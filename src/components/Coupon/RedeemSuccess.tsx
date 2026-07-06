'use client';

import { motion } from 'framer-motion';
import { Building2, Check, Copy, Smartphone } from 'lucide-react';
import { useState } from 'react';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import Confetti from '@/components/Coupon/Confetti';
import type { PayoutDetails, RedeemCouponData } from '@/lib/coupon/types';
import { paiseToRupees } from '@/lib/coupon/validation';
import styles from './Coupon.module.css';

interface RedeemSuccessProps {
  result: RedeemCouponData;
  payout: PayoutDetails;
  onViewHistory: () => void;
  onRedeemAnother: () => void;
}

export default function RedeemSuccess({
  result,
  payout,
  onViewHistory,
  onRedeemAnother,
}: RedeemSuccessProps) {
  const [copied, setCopied] = useState(false);
  const hasBonus = result.bonusAmountPaise > 0;

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(result.publicRef);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <>
      <Confetti active />
      <motion.div
        className={styles.successPage}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <div className={styles.successLayout}>
          <div className={styles.successHighlight}>
            <motion.div
              className={styles.successIconLarge}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 16 }}
            >
              <Check size={28} strokeWidth={2.5} aria-hidden="true" />
            </motion.div>
            <h2 className={styles.successTitle}>Redemption successful</h2>
            <p className={styles.successAmount}>
              ₹{paiseToRupees(result.totalAmountPaise)}
            </p>
            {hasBonus && (
              <p className={styles.successBonusNote}>
                ₹{paiseToRupees(result.baseAmountPaise)} coupon + ₹
                {paiseToRupees(result.bonusAmountPaise)} bonus
              </p>
            )}
            <p className={styles.successTagline}>Your reward is on its way</p>
          </div>

          <div className={styles.successBody}>
            <div className={styles.successDetailsCompact}>
              <div className={styles.successDetailItem}>
                <span className={styles.successDetailLabel}>Reference</span>
                <div className={styles.successDetailValueGroup}>
                  <strong className={styles.successRef}>{result.publicRef}</strong>
                  <button type="button" className={styles.copyBtn} onClick={copyRef}>
                    <Copy size={14} strokeWidth={2} aria-hidden="true" />
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className={styles.successDetailItem}>
                <span className={styles.successDetailLabel}>Payout</span>
                <span className={styles.successDetailValue}>
                  {payout.method === 'upi' ? 'UPI transfer' : 'Bank transfer'}
                </span>
              </div>

              {payout.method === 'upi' ? (
                <div className={styles.successDetailItem}>
                  <span className={styles.successDetailLabel}>
                    <Smartphone size={14} strokeWidth={2} aria-hidden="true" />
                    UPI ID
                  </span>
                  <span className={styles.successDetailValue}>{payout.upiVpa}</span>
                </div>
              ) : (
                <>
                  <div className={styles.successDetailItem}>
                    <span className={styles.successDetailLabel}>
                      <Building2 size={14} strokeWidth={2} aria-hidden="true" />
                      Account
                    </span>
                    <span className={styles.successDetailValue}>{payout.accountNumber}</span>
                  </div>
                  <div className={styles.successDetailItem}>
                    <span className={styles.successDetailLabel}>IFSC</span>
                    <span className={styles.successDetailValue}>{payout.ifsc}</span>
                  </div>
                </>
              )}
            </div>

            <p className={styles.successMessage}>
              Transfer expected within <strong>2–3 business days</strong>. Save your reference
              number for support.
            </p>

            <div className={styles.successActions}>
              <button type="button" className={styles.secondaryButton} onClick={onRedeemAnother}>
                Redeem another
              </button>
              <PrimaryButton onClick={onViewHistory} className={styles.flexButton}>
                View redemptions
              </PrimaryButton>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
