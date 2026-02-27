'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';
import styles from './FadeInOnScroll.module.css';

interface FadeInOnScrollProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export default function FadeInOnScroll({ 
  children, 
  delay = 0,
  className = '' 
}: FadeInOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${styles.fadeIn} ${isVisible ? styles.visible : ''} ${className}`}
    >
      {children}
    </div>
  );
}
