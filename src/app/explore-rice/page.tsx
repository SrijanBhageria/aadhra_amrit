'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import ParallaxHero from '@/components/ParallaxHero/ParallaxHero';
import Reveal from '@/components/Reveal/Reveal';
import AnimatedCounter from '@/components/AnimatedCounter/AnimatedCounter';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import styles from './page.module.css';

const values = [
  {
    number: 1,
    title: 'KRBL Promises To Preserve And Drive This Legacy',
    description: 'We practice taking forward the legacy of basmati rice, honoring traditional cultivation methods while embracing modern quality standards.',
  },
  {
    number: 2,
    title: 'Adoption Of Smart And Scientific Agricultural Practices',
    description: 'We encourage farmers to adopt modern farming techniques that enhance yield, quality, and sustainability while preserving the heritage of basmati cultivation.',
  },
  {
    number: 3,
    title: 'Prioritize And Maintain Quality',
    description: 'We keep up with product quality to deliver our best to our consumers, ensuring every grain meets our exacting standards from paddy to plate.',
  },
  {
    number: 4,
    title: 'Aiming To Expand Our Reach',
    description: 'As a growing basmati rice miller, we aim to reach every corner of India and beyond, making premium quality rice accessible to all.',
  },
  {
    number: 5,
    title: 'To Provide And Nurture A Professional Working Environment',
    description: 'We prefer providing a healthy and motivating environment to foster employee excellence and build lasting relationships with our partners.',
  },
];

const riceStats = [
  {
    label: 'Average Length',
    value: 6.61,
    suffix: ' mm',
    decimals: 2,
    description: 'Premium basmati grains',
    color: 'maroon',
  },
  {
    label: 'Average Cooked Length',
    value: 12,
    suffix: ' mm',
    decimals: 0,
    description: 'After cooking expansion',
    color: 'maroon',
  },
  {
    label: 'Moisture Percent by Mass',
    value: 14,
    suffix: '%',
    decimals: 0,
    description: 'Optimal moisture content',
    color: 'maroon',
  },
  {
    label: 'Other Varieties',
    value: 15,
    suffix: '%',
    decimals: 0,
    description: 'Non-basmati rice varieties',
    color: 'cream',
  },
  {
    label: 'Chalky Grains',
    value: 7,
    suffix: '%',
    decimals: 0,
    description: 'Quality standard maintained',
    color: 'teal',
  },
];

const riceVarieties = [
  {
    name: 'Premium Basmati',
    description: 'Exceptional grain length, delicate aroma, and superior cooking quality. Perfect for special occasions and discerning customers.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
  },
  {
    name: 'Sella Basmati',
    description: 'Parboiled basmati rice with enhanced nutritional value and longer shelf life. Ideal for export markets and bulk buyers.',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80',
  },
  {
    name: 'Brown Basmati',
    description: 'Whole grain basmati rice with the bran layer intact. Rich in fiber and nutrients, maintaining the distinctive basmati aroma.',
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&q=80',
  },
  {
    name: 'Pusa Basmati',
    description: 'High-yield basmati variety with excellent cooking properties. Combines traditional aroma with modern agricultural efficiency.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
  },
];

export default function ExploreRice() {
  const stickyRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: stickyRef,
    offset: ['start end', 'end start'],
  });

  const imageOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.3]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.95]);

  return (
    <>
      <ParallaxHero
        imageUrl="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80"
        mobileImageUrl="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
        title="Explore Rice"
        subtitle="Largest Basmati Rice Wholesalers And Rice Millers Across The Globe"
      />

      {/* Values Section with Sticky Image */}
      <SectionWrapper>
        <div ref={stickyRef} className={styles.valuesSection}>
          <div className={styles.valuesContent}>
            <Reveal>
              <div className={styles.valuesHeader}>
                <h2 className={styles.valuesTitle}>Explore Our Values</h2>
              </div>
            </Reveal>
            <div className={styles.valuesList}>
              {values.map((value, index) => (
                <Reveal key={index} delay={index * 0.1}>
                  <motion.div
                    className={styles.valueItem}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <motion.div
                      className={styles.valueNumber}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: 'spring' }}
                    >
                      {value.number}
                    </motion.div>
                    <div className={styles.valueContent}>
                      <h3 className={styles.valueTitle}>{value.title}</h3>
                      <p className={styles.valueDescription}>{value.description}</p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
          <motion.div
            className={styles.stickyImage}
            style={{
              opacity: shouldReduceMotion ? 1 : imageOpacity,
              scale: shouldReduceMotion ? 1 : imageScale,
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80"
              srcSet={`https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80 400w, https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&q=80 600w`}
              sizes="(max-width: 768px) 400px, 600px"
              alt="Rice field"
              className={styles.image}
            />
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Rice Education Section */}
      <SectionWrapper variant="light">
        <Reveal>
          <div className={styles.educationSection}>
            <div className={styles.educationContent}>
              <h2 className={styles.educationTitle}>
                Largest Basmati Rice Exporters And Rice Millers Across The Globe
              </h2>
            </div>
            <div className={styles.educationText}>
              <p>
                Adhra Amrit Agro Products LLP is recognized as a leading basmati rice
                producer and miller, specializing in premium quality rice that meets
                international standards. We have integrated advanced technologies into
                our processing facilities while maintaining the traditional quality and
                authenticity that basmati rice is known for.
              </p>
              <p>
                Our comprehensive process covers everything from seed development to
                marketing, ensuring quality at every stage. We work closely with farmers
                who share our commitment to excellence, sourcing the finest paddy and
                processing it through state-of-the-art facilities. Our focus on quality
                extends to various rice varieties including Premium Basmati, Sella
                Basmati, Brown Basmati, and Pusa Basmati.
              </p>
              <p>
                With our experienced team and commitment to quality, we have established
                ourselves as a trusted partner for wholesalers, retailers, and
                international buyers. Our dedication to maintaining the highest standards
                ensures that every grain we deliver represents the heritage and excellence
                of Indian basmati rice.
              </p>
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Rice Stats Grid */}
      <SectionWrapper>
        <Reveal>
          <div className={styles.statsSection}>
            <h2 className={styles.statsTitle}>Rice Quality Metrics</h2>
            <div className={styles.statsGrid}>
              {riceStats.map((stat, index) => (
                <motion.div
                  key={index}
                  className={`${styles.statCard} ${styles[`statCard${stat.color.charAt(0).toUpperCase() + stat.color.slice(1)}`]}`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals}
                    className={styles.statNumber}
                  />
                  <p className={styles.statLabel}>{stat.label}</p>
                  <p className={styles.statDescription}>{stat.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Rice Varieties Showcase */}
      <SectionWrapper variant="light">
        <Reveal>
          <div className={styles.varietiesSection}>
            <h2 className={styles.varietiesTitle}>Our Rice Varieties</h2>
            <p className={styles.varietiesSubtitle}>
              Premium quality basmati rice for every need and occasion
            </p>
            <div className={styles.varietiesGrid}>
              {riceVarieties.map((variety, index) => (
                <motion.div
                  key={index}
                  className={styles.varietyCard}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
                >
                  <div className={styles.varietyImageWrapper}>
                    <img
                      src={variety.image}
                      srcSet={`${variety.image.replace('w=800', 'w=400')} 400w, ${variety.image} 800w`}
                      sizes="(max-width: 768px) 400px, 800px"
                      alt={variety.name}
                      className={styles.varietyImage}
                    />
                    <div className={styles.varietyOverlay} />
                  </div>
                  <div className={styles.varietyContent}>
                    <h3 className={styles.varietyName}>{variety.name}</h3>
                    <p className={styles.varietyDescription}>{variety.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Quality Promise CTA */}
      <SectionWrapper variant="dark">
        <Reveal>
          <div className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>Our Quality Promise</h2>
            <p className={styles.ctaText}>
              Every grain we deliver undergoes rigorous quality checks to ensure it meets
              our exacting standards. From sourcing to packaging, we maintain strict
              quality control at every stage of the process, ensuring that you receive
              nothing but the finest basmati rice.
            </p>
            <PrimaryButton href="/contact-us">Explore Our Products</PrimaryButton>
          </div>
        </Reveal>
      </SectionWrapper>
    </>
  );
}
