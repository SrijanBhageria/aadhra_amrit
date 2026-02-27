import { ReactNode } from 'react';
import styles from './SectionWrapper.module.css';

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'light' | 'dark';
}

export default function SectionWrapper({ 
  children, 
  className = '', 
  variant = 'default' 
}: SectionWrapperProps) {
  return (
    <section className={`${styles.section} ${styles[variant]} ${className}`}>
      <div className={styles.container}>
        {children}
      </div>
    </section>
  );
}
