'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import styles from './PrimaryButton.module.css';

interface PrimaryButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
}

export default function PrimaryButton({ 
  children, 
  href, 
  onClick, 
  type = 'button',
  className = '' 
}: PrimaryButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const baseClassName = `${styles.button} ${className}`;

  const buttonVariants = {
    rest: {
      scale: 1,
      boxShadow: '0 4px 14px rgba(196, 92, 38, 0.35)',
    },
    hover: {
      scale: shouldReduceMotion ? 1 : 1.02,
      boxShadow: '0 6px 20px rgba(196, 92, 38, 0.45)',
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
    tap: {
      scale: shouldReduceMotion ? 1 : 0.98,
      boxShadow: '0 2px 8px rgba(196, 92, 38, 0.3)',
      transition: {
        duration: 0.1,
      },
    },
  };

  const MotionLink = motion(Link);
  const MotionButton = motion.button;

  if (href) {
    return (
      <MotionLink
        href={href}
        className={baseClassName}
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <MotionButton
      type={type}
      onClick={onClick}
      className={baseClassName}
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
    >
      {children}
    </MotionButton>
  );
}
