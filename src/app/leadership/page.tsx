'use client';

import { motion } from 'framer-motion';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import ParallaxHero from '@/components/ParallaxHero/ParallaxHero';
import Reveal from '@/components/Reveal/Reveal';
import AnimatedCounter from '@/components/AnimatedCounter/AnimatedCounter';
import styles from './page.module.css';

const boardMembers = [
  {
    name: 'Anupam Garg',
    role: 'Designated Partner',
    description: 'Leading Adhra Amrit with deep expertise in agricultural products and a commitment to excellence. Anupam ensures every aspect of operations reflects our core values of quality and integrity.',
  },
  {
    name: 'Leadership Team',
    role: 'Operations & Quality',
    description: 'Our dedicated team of professionals brings decades of combined experience in rice processing, quality control, and supply chain management.',
  },
  {
    name: 'Advisory Board',
    role: 'Strategic Guidance',
    description: 'Experienced advisors from the agricultural and food industry provide strategic direction and ensure we stay at the forefront of quality and innovation.',
  },
];

export default function Leadership() {
  return (
    <>
      <ParallaxHero
        imageUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&q=80"
        mobileImageUrl="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80"
        title="Meet The Visionaries"
        subtitle="Inspirational Minds Shaping Adhra Amrit's Vision And Success"
        badge="LEADERSHIP"
      />

      {/* Keynote Section */}
      <SectionWrapper>
        <Reveal>
          <div className={styles.keynoteSection}>
            <div className={styles.keynoteImage}>
              <div className={styles.imagePlaceholder}>
                <div className={styles.imageOverlay}>
                  <span>Anupam Garg</span>
                  <span>Designated Partner</span>
                </div>
              </div>
            </div>
            <div className={styles.keynoteContent}>
              <div className={styles.keynoteBadge}>KEY NOTE</div>
              <h2 className={styles.keynoteTitle}>From The Desk Of Designated Partner</h2>
              <motion.blockquote
                className={styles.quote}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className={styles.quoteMark}>"</span>
                We are laying a strong foundation by spearheading initiatives to achieve a
                prosperous future, inspired by the wisdom of our forefathers and the trust
                of our partners. At Adhra Amrit, we believe that quality is not just a
                standard—it's a promise we make with every grain we deliver.
                <span className={styles.quoteMark}>"</span>
              </motion.blockquote>
              <Reveal delay={0.3}>
                <p className={styles.keynoteText}>
                  As the Designated Partner of Adhra Amrit Agro Products LLP, I am proud
                  to lead a company that has quickly established itself as a trusted name
                  in the basmati rice milling sector.
                  we have focused on building relationships based on honesty, maintaining
                  uncompromising quality standards, and ensuring sustainable practices
                  throughout our supply chain.
                </p>
                <p className={styles.keynoteText}>
                  Our vision extends beyond just selling rice. We are committed to
                  transforming the agricultural products sector by ensuring that every grain
                  meets our exacting standards of quality, purity, and authenticity.
                  Through our brands Hariom and Tamaal, we serve diverse market segments
                  while maintaining the highest standards across all our offerings.
                </p>
                <p className={styles.keynoteText}>
                  The future of Adhra Amrit is built on three pillars: <strong>Honesty</strong> in
                  every transaction, <strong>Quality</strong> in every grain, and{' '}
                  <strong>Sustainability</strong> in every practice. These principles guide
                  our decisions and shape our relationships with partners, customers, and
                  the communities we serve.
                </p>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Board Grid */}
      <SectionWrapper variant="light">
        <Reveal>
          <div className={styles.boardSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionBadge}>DIRECTORS</span>
              <h2 className={styles.sectionTitle}>Meet The Board</h2>
            </div>
            <div className={styles.boardGrid}>
              {boardMembers.map((member, index) => (
                <motion.div
                  key={index}
                  className={styles.boardCard}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
                >
                  <div className={styles.cardAccent} />
                  <h3 className={styles.cardName}>{member.name}</h3>
                  <p className={styles.cardRole}>{member.role}</p>
                  <p className={styles.cardDescription}>{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Stats Section */}
      <SectionWrapper>
        <Reveal>
          <div className={styles.statsSection}>
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

      {/* Vision Banner */}
      <SectionWrapper variant="dark">
        <Reveal>
          <div className={styles.visionBanner}>
            <motion.h2
              className={styles.visionTitle}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              Building a Legacy of Trust, One Grain at a Time
            </motion.h2>
            <motion.p
              className={styles.visionText}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Our leadership is committed to maintaining the highest standards of quality,
              transparency, and ethical business practices. We believe that great
              leadership is about building relationships, inspiring trust, and creating
              value for all stakeholders—from farmers to customers.
            </motion.p>
          </div>
        </Reveal>
      </SectionWrapper>
    </>
  );
}
