'use client';

import { useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import ValueCard from '@/components/ValueCard/ValueCard';
import Reveal from '@/components/Reveal/Reveal';
import AnimatedCounter from '@/components/AnimatedCounter/AnimatedCounter';
import { useResponsiveImage } from '@/hooks/useResponsiveImage';
import styles from './page.module.css';

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  // Responsive images
  const heroImage = useResponsiveImage(
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80'
  );
  const aboutImage = useResponsiveImage(
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80'
  );
  const hariomImage = useResponsiveImage(
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80'
  );
  const tamaalImage = useResponsiveImage(
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80',
    'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80'
  );
  const ctaImage = useResponsiveImage(
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&q=80',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80'
  );

  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 12,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0.3 : 0.9,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <>
      {/* Hero Section */}
      <section ref={heroRef} className={styles.hero}>
        <motion.div
          className={styles.heroBackground}
          style={{
            '--desktop-image': `url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80)`,
            '--mobile-image': `url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80)`,
            y: shouldReduceMotion ? 0 : backgroundY,
          } as React.CSSProperties}
        />
        <div className={styles.heroOverlay} />
        <motion.div
          className={styles.heroContent}
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          style={{
            opacity: shouldReduceMotion ? 1 : contentOpacity,
          }}
        >
          <motion.div className={styles.legacyBadge} variants={itemVariants}>
            SINCE 2020
          </motion.div>
          <motion.h1 className={styles.heroTitle} variants={itemVariants}>
            Purity in Every Grain
          </motion.h1>
          <motion.p className={styles.heroSubtext} variants={itemVariants}>
            Adhra Amrit Agro Products LLP brings you the finest basmati rice, 
            cultivated with care and delivered with honesty. Rooted in Delhi, 
            serving the world with premium quality and unwavering commitment.
          </motion.p>
          <motion.div variants={itemVariants}>
            <PrimaryButton href="/about-us">Know Us Better</PrimaryButton>
          </motion.div>
        </motion.div>
      </section>

      {/* About Preview */}
      <SectionWrapper>
        <Reveal>
          <div className={styles.aboutPreview}>
            <div className={styles.aboutContent}>
              <h2 className={styles.sectionTitle}>About Adhra Amrit</h2>
              <p className={styles.aboutText}>
                Adhra Amrit Agro Products LLP is a rice miller based in Haryana specializing in 
                premium agricultural products, with a primary focus on 
                basmati rice. We have quickly established ourselves 
                as a trusted partner for quality-conscious buyers.
              </p>
              <p className={styles.aboutText}>
                Our commitment extends beyond just selling rice—we ensure every grain 
                meets our exacting standards of quality, purity, and authenticity. 
                Through our brands <strong>Hariom</strong> and <strong>Tamaal</strong>, 
                we cater to both premium and daily consumption needs, maintaining the 
                highest standards across all our offerings.
              </p>
              <PrimaryButton href="/about-us">Learn More</PrimaryButton>
            </div>
            <Reveal delay={0.2}>
              <div className={styles.aboutImageWrapper}>
                <img
                  src={aboutImage}
                  srcSet={`https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80 400w, https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80 800w`}
                  sizes="(max-width: 768px) 400px, 800px"
                  alt="Premium basmati rice"
                  className={styles.aboutImage}
                />
              </div>
            </Reveal>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* By The Numbers Section */}
      <SectionWrapper variant="dark">
        <Reveal>
          <div className={styles.statsSection}>
            <h2 className={styles.statsTitle}>By The Numbers</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <AnimatedCounter
                  value={4}
                  suffix="+"
                  className={styles.statNumber}
                />
                <p className={styles.statLabel}>Years of Excellence</p>
              </div>
              <div className={styles.statCard}>
                <AnimatedCounter
                  value={2}
                  className={styles.statNumber}
                />
                <p className={styles.statLabel}>Premium Brands</p>
              </div>
              <div className={styles.statCard}>
                <AnimatedCounter
                  value={100}
                  suffix="%"
                  className={styles.statNumber}
                />
                <p className={styles.statLabel}>Quality Commitment</p>
              </div>
            </div>
        </div>
        </Reveal>
      </SectionWrapper>

      {/* Values Section */}
      <SectionWrapper variant="light">
        <Reveal>
          <div className={styles.valuesSection}>
            <h2 className={styles.sectionTitle}>Our Core Values</h2>
            <p className={styles.sectionSubtitle}>
              The principles that guide everything we do
            </p>
            <div className={styles.valuesGrid}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0 }}
              >
                <ValueCard
                  title="Honesty"
                  description="Transparency in every transaction. We believe in building 
                  relationships based on trust and integrity, ensuring our partners know 
                  exactly what they're getting."
                  icon="✓"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <ValueCard
                  title="Quality"
                  description="Uncompromising standards from paddy to plate. Every grain 
                  is carefully selected and processed to meet the highest quality benchmarks 
                  in the industry."
                  icon="★"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <ValueCard
                  title="Sustainability"
                  description="Responsible sourcing and ethical practices. We work closely 
                  with farmers and ensure sustainable agricultural practices that benefit 
                  communities and the environment."
                  icon="🌾"
                />
              </motion.div>
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Our Promise Strip */}
      <SectionWrapper>
        <div className={styles.promiseStrip}>
          <motion.div
            className={styles.promiseStripInner}
            animate={{
              x: [0, -50 * 6],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {['Purity', 'Authenticity', 'Heritage', 'Trust', 'Quality', 'Sustainability'].map((word, index) => (
              <span key={index} className={styles.promiseWord}>
                {word}
              </span>
            ))}
            {['Purity', 'Authenticity', 'Heritage', 'Trust', 'Quality', 'Sustainability'].map((word, index) => (
              <span key={`dup-${index}`} className={styles.promiseWord}>
                {word}
              </span>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Brands Section */}
      <SectionWrapper>
        <Reveal>
          <div className={styles.brandsSection}>
            <h2 className={styles.sectionTitle}>Our Brands</h2>
            <p className={styles.sectionSubtitle}>
              Premium quality rice for every need
            </p>
            <div className={styles.brandsGrid}>
              <motion.div
                className={styles.brandCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className={styles.brandImageWrapper}>
                  <img
                    src={hariomImage}
                    srcSet={`https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80 400w, https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80 600w`}
                    sizes="(max-width: 768px) 400px, 600px"
                    alt="Hariom basmati rice"
                    className={styles.brandImage}
                  />
                  <div className={styles.brandImageOverlay} />
                </div>
                <div className={styles.brandContent}>
                  <h3 className={styles.brandName}>Hariom</h3>
                  <p className={styles.brandDescription}>
                    Our premium basmati rice brand, known for its exceptional length, 
                    delicate aroma, and superior quality. Perfect for discerning customers 
                    who demand the finest.
                  </p>
                </div>
              </motion.div>
              <motion.div
                className={styles.brandCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: 0.15 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className={styles.brandImageWrapper}>
                  <img
                    src={tamaalImage}
                    srcSet={`https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&q=80 400w, https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80 600w`}
                    sizes="(max-width: 768px) 400px, 600px"
                    alt="Tamaal basmati rice"
                    className={styles.brandImage}
                  />
                  <div className={styles.brandImageOverlay} />
                </div>
                <div className={styles.brandContent}>
                  <h3 className={styles.brandName}>Tamaal</h3>
                  <p className={styles.brandDescription}>
                    Quality basmati rice that brings premium taste to everyday meals. 
                    Tamaal represents our commitment to making excellent rice accessible 
                    to families across India and beyond.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper variant="dark">
        <div className={styles.ctaSection}>
          <div className={styles.ctaBackground} />
          <Reveal>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>
                Connect with our experts for business enquiries
              </h2>
              <p className={styles.ctaSubtext}>
                Whether you're a wholesaler, distributor, or looking to establish a 
                long-term partnership, we're here to help.
              </p>
              <PrimaryButton href="/contact-us">Enquire Now</PrimaryButton>
            </div>
          </Reveal>
    </div>
      </SectionWrapper>
    </>
  );
}
