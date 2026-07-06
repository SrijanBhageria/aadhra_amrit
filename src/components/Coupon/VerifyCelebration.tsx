'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import styles from './VerifyCelebration.module.css';

const SPARKLE_POSITIONS = [
  { top: '8%', left: '12%', delay: 0 },
  { top: '18%', right: '10%', delay: 0.15 },
  { top: '55%', left: '6%', delay: 0.3 },
  { top: '70%', right: '14%', delay: 0.2 },
  { top: '40%', right: '6%', delay: 0.35 },
];

export default function VerifyCelebration() {
  return (
    <div className={styles.wrapper} aria-hidden="true">
      {SPARKLE_POSITIONS.map((pos, i) => (
        <span
          key={i}
          className={styles.sparkle}
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            animationDelay: `${pos.delay}s`,
          }}
        />
      ))}

      <motion.span
        className={styles.pulseRing}
        initial={{ scale: 0.6, opacity: 0.6 }}
        animate={{ scale: 1.8, opacity: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <motion.span
        className={styles.pulseRing}
        initial={{ scale: 0.6, opacity: 0.4 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 1.4, delay: 0.2, ease: 'easeOut' }}
      />

      <motion.div
        className={styles.verifiedBadge}
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.1 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.25 }}
        >
          <Check size={18} strokeWidth={3} />
        </motion.div>
        <span>Verified</span>
      </motion.div>
    </div>
  );
}
