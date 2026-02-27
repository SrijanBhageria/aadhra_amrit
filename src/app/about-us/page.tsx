'use client';

import { motion } from 'framer-motion';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import ParallaxHero from '@/components/ParallaxHero/ParallaxHero';
import Reveal from '@/components/Reveal/Reveal';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import styles from './page.module.css';

const pillars = [
  {
    title: 'Honesty',
    description: 'Transparency in every transaction. We believe in building relationships based on trust and integrity, ensuring our partners know exactly what they\'re getting.',
    icon: '✓',
  },
  {
    title: 'Quality',
    description: 'Uncompromising standards from paddy to plate. Every grain is carefully selected and processed to meet the highest quality benchmarks in the industry.',
    icon: '★',
  },
  {
    title: 'Sustainability',
    description: 'Responsible sourcing and ethical practices. We work closely with farmers and ensure sustainable agricultural practices that benefit communities and the environment.',
    icon: '🌾',
  },
];

export default function AboutUs() {
  return (
    <>
      <ParallaxHero
        imageUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&q=80"
        mobileImageUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
        title="Our Story"
        subtitle="Building trust through quality, one grain at a time"
      />

      {/* Story Section */}
      <SectionWrapper>
        <div className={styles.storySection}>
          <Reveal>
            <div className={styles.storyContent}>
              <h2 className={styles.sectionTitle}>Our Story</h2>
              <p className={styles.storyText}>
                Adhra Amrit Agro Products LLP brings the finest basmati rice to markets across India 
                and beyond. Based in Haryana, we have quickly established ourselves as a 
                trusted name in the rice milling sector.
              </p>
              <p className={styles.storyText}>
                Our journey began with a simple yet powerful commitment: to provide 
                premium quality rice that meets the highest standards of purity and 
                authenticity. From our facility in Sonipat, Haryana, we have 
                built strong relationships with farmers, processors, and distributors, 
                ensuring a seamless supply chain from paddy to plate.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className={styles.storyImageWrapper}>
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
                srcSet={`https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80 400w, https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80 800w`}
                sizes="(max-width: 768px) 400px, 800px"
                alt="Rice processing"
                className={styles.storyImage}
              />
            </div>
          </Reveal>
        </div>
      </SectionWrapper>

      {/* Vision and Mission */}
      <SectionWrapper variant="light">
        <div className={styles.visionMissionGrid}>
          <motion.div
            className={styles.visionCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0 }}
          >
            <h2 className={styles.cardTitle}>Our Vision</h2>
            <p className={styles.cardText}>
              To be recognized as India's most trusted basmati rice miller, 
              known for uncompromising quality, ethical business practices, and 
              sustainable agricultural partnerships. We aim to bridge the gap between 
              premium agricultural produce and quality-conscious consumers worldwide.
            </p>
          </motion.div>
          <motion.div
            className={styles.missionCard}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h2 className={styles.cardTitle}>Our Mission</h2>
            <p className={styles.cardText}>
              We are committed to sourcing, processing, and delivering the finest 
              basmati rice while maintaining the highest standards of quality, 
              transparency, and customer satisfaction. Through our brands Hariom and 
              Tamaal, we serve diverse market segments with products that reflect our 
              core values of honesty, quality, and sustainability.
            </p>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Three Pillars */}
      <SectionWrapper>
        <Reveal>
          <div className={styles.pillarsSection}>
            <h2 className={styles.pillarsTitle}>Our Foundation</h2>
            <p className={styles.pillarsSubtitle}>
              Three pillars that guide everything we do
            </p>
            <div className={styles.pillarsGrid}>
              {pillars.map((pillar, index) => (
                <motion.div
                  key={index}
                  className={styles.pillarCard}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
                >
                  <div className={styles.pillarIcon}>{pillar.icon}</div>
                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                  <p className={styles.pillarDescription}>{pillar.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Leadership Teaser */}
      <SectionWrapper variant="light">
        <Reveal>
          <div className={styles.leadershipTeaser}>
            <div className={styles.leadershipContent}>
              <h2 className={styles.leadershipTitle}>Meet Our Leadership</h2>
              <p className={styles.leadershipText}>
                Leading Adhra Amrit with deep expertise in agricultural products and a 
                commitment to excellence, our designated partner ensures every aspect of 
                operations reflects our core values of quality and integrity.
              </p>
              <div className={styles.leaderInfo}>
                <h3 className={styles.leaderName}>Anupam Garg</h3>
                <p className={styles.leaderRole}>Designated Partner</p>
              </div>
              <PrimaryButton href="/leadership">Learn More</PrimaryButton>
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Company Details */}
      <SectionWrapper>
        <Reveal>
          <div className={styles.detailsSection}>
            <h2 className={styles.detailsTitle}>Our Location</h2>
            <div className={styles.detailsGrid}>
              <motion.div
                className={styles.detailCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0 }}
              >
                <strong className={styles.detailLabel}>Address</strong>
                <p className={styles.detailValue}>
                  Plot No. 9, Mega Food Park<br />
                  Sector-23, Sonipat<br />
                  Haryana
                </p>
              </motion.div>
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Philosophy Quote Banner */}
      <SectionWrapper variant="dark">
        <Reveal>
          <div className={styles.philosophyBanner}>
            <motion.h2
              className={styles.philosophyTitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              "Great rice comes from great relationships"
            </motion.h2>
            <motion.p
              className={styles.philosophyText}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              At Adhra Amrit, we believe that our philosophy is built on three pillars: 
              <strong> Honesty</strong> in every transaction, <strong>Quality</strong> in 
              every grain, and <strong>Sustainability</strong> in every practice. These 
              principles guide our decisions and shape our relationships with partners, 
              customers, and the communities we serve.
            </motion.p>
          </div>
        </Reveal>
      </SectionWrapper>
    </>
  );
}
