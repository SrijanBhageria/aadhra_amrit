'use client';

import { ReactNode, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import styles from './ParallaxHero.module.css';

interface ParallaxHeroProps {
  imageUrl: string;
  mobileImageUrl?: string;
  title: string;
  subtitle?: string;
  badge?: string;
  overlay?: boolean;
  children?: ReactNode;
}

export default function ParallaxHero({
  imageUrl,
  mobileImageUrl,
  title,
  subtitle,
  badge,
  overlay = true,
  children,
}: ParallaxHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.6], ['0%', '20%']);

  return (
    <section ref={ref} className={styles.hero}>
      <motion.div
        className={styles.background}
        style={{
          '--desktop-image': `url(${imageUrl})`,
          '--mobile-image': mobileImageUrl ? `url(${mobileImageUrl})` : `url(${imageUrl})`,
          y: shouldReduceMotion ? 0 : backgroundY,
        } as React.CSSProperties}
      />
      {overlay && <div className={styles.overlay} />}
      <motion.div
        className={styles.content}
        style={{
          opacity: shouldReduceMotion ? 1 : contentOpacity,
          y: shouldReduceMotion ? 0 : contentY,
        }}
      >
        {badge && (
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {badge}
          </motion.div>
        )}
        <motion.h1
          className={styles.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {subtitle}
          </motion.p>
        )}
        {children}
      </motion.div>
    </section>
  );
}
