'use client';

import { motion } from 'framer-motion';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import ParallaxHero from '@/components/ParallaxHero/ParallaxHero';
import Reveal from '@/components/Reveal/Reveal';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import styles from './page.module.css';

const brands = [
  {
    name: 'Hariom',
    badge: 'Premium',
    description: 'Hariom represents the pinnacle of basmati rice excellence. Known for its exceptional grain length, delicate aroma, and superior cooking quality, Hariom is our flagship premium brand.',
    features: [
      { label: 'Grain Length', value: 'Extra Long' },
      { label: 'Aroma', value: 'Distinctive Basmati Fragrance' },
      { label: 'Quality Grade', value: 'Premium' },
      { label: 'Best For', value: 'Special occasions, fine dining, exports' },
    ],
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
  },
  {
    name: 'Tamaal',
    badge: 'Value',
    description: 'Tamaal brings premium basmati quality to everyday meals. Carefully selected and processed, Tamaal offers excellent value without compromising on taste or quality.',
    features: [
      { label: 'Grain Length', value: 'Long' },
      { label: 'Aroma', value: 'Pleasant Basmati Aroma' },
      { label: 'Quality Grade', value: 'High' },
      { label: 'Best For', value: 'Daily consumption, families, retail' },
    ],
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&q=80',
  },
];

const categories = [
  {
    name: 'Premium Basmati',
    description: 'Our premium range features the finest basmati rice with exceptional grain length, perfect aroma, and superior cooking characteristics. Ideal for discerning customers and export markets.',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=80',
  },
  {
    name: 'Daily Basmati',
    description: 'High-quality basmati rice that brings premium taste to everyday meals. Carefully processed to maintain quality while ensuring affordability for regular consumption.',
    image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80',
  },
  {
    name: 'Specialty Variants',
    description: 'We offer various specialty basmati rice variants to meet specific market needs and customer preferences, each maintaining our commitment to quality and authenticity.',
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=600&q=80',
  },
];

const qualitySteps = [
  {
    number: 1,
    title: 'Sourcing',
    description: 'We work closely with trusted farmers who share our commitment to quality and sustainable practices. Every paddy is carefully selected at the source.',
  },
  {
    number: 2,
    title: 'Testing',
    description: 'Every batch undergoes rigorous quality testing for purity, authenticity, grain length, moisture content, and cooking characteristics.',
  },
  {
    number: 3,
    title: 'Storage',
    description: 'State-of-the-art storage facilities maintain optimal conditions to preserve quality, aroma, and nutritional value throughout the supply chain.',
  },
  {
    number: 4,
    title: 'Packaging',
    description: 'Final packaging ensures product integrity and traceability, meeting all relevant quality and safety standards before reaching customers.',
  },
];

export default function Portfolio() {
  return (
    <>
      <ParallaxHero
        imageUrl="https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=1920&q=80"
        mobileImageUrl="https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&q=80"
        title="Our Portfolio"
        subtitle="Premium quality rice products for every need"
      />

      {/* Brands Section */}
      <SectionWrapper>
        <Reveal>
          <div className={styles.brandsSection}>
            <h2 className={styles.sectionTitle}>Our Brands</h2>
            <div className={styles.brandsGrid}>
              {brands.map((brand, index) => (
                <motion.div
                  key={index}
                  className={styles.brandCard}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <div className={styles.brandImageWrapper}>
                    <img
                      src={brand.image}
                      srcSet={`${brand.image.replace('w=800', 'w=400')} 400w, ${brand.image} 800w`}
                      sizes="(max-width: 768px) 400px, 800px"
                      alt={`${brand.name} basmati rice`}
                      className={styles.brandImage}
                    />
                    <div className={styles.brandImageOverlay} />
                    <div className={styles.brandHeader}>
                      <h3 className={styles.brandName}>{brand.name}</h3>
                      <span className={styles.brandBadge}>{brand.badge}</span>
                    </div>
                  </div>
                  <div className={styles.brandContent}>
                    <p className={styles.brandDescription}>{brand.description}</p>
                    <div className={styles.brandFeatures}>
                      {brand.features.map((feature, idx) => (
                        <div key={idx} className={styles.feature}>
                          <strong>{feature.label}:</strong> {feature.value}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Product Categories */}
      <SectionWrapper variant="light">
        <Reveal>
          <div className={styles.categoriesSection}>
            <h2 className={styles.sectionTitle}>Product Categories</h2>
            <div className={styles.categoriesGrid}>
              {categories.map((category, index) => (
                <motion.div
                  key={index}
                  className={styles.categoryCard}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -8, boxShadow: 'var(--shadow-lg)' }}
                >
                  <div className={styles.categoryImageWrapper}>
                    <img
                      src={category.image}
                      srcSet={`${category.image.replace('w=600', 'w=300')} 300w, ${category.image} 600w`}
                      sizes="(max-width: 768px) 300px, 600px"
                      alt={category.name}
                      className={styles.categoryImage}
                    />
                    <div className={styles.categoryOverlay} />
                    <h3 className={styles.categoryName}>{category.name}</h3>
                  </div>
                  <div className={styles.categoryContent}>
                    <p className={styles.categoryDescription}>{category.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Quality Assurance Timeline */}
      <SectionWrapper>
        <Reveal>
          <div className={styles.qualitySection}>
            <h2 className={styles.sectionTitle}>Quality Assurance</h2>
            <p className={styles.qualityIntro}>
              Every product in our portfolio undergoes rigorous quality checks 
              to ensure it meets our exacting standards. From sourcing to packaging, 
              we maintain strict quality control at every stage of the process.
            </p>
            <div className={styles.timeline}>
              {qualitySteps.map((step, index) => (
                <motion.div
                  key={index}
                  className={styles.timelineItem}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                >
                  <motion.div
                    className={styles.timelineNumber}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 + 0.2, type: 'spring' }}
                  >
                    {step.number}
                  </motion.div>
                  <div className={styles.timelineContent}>
                    <h3 className={styles.timelineTitle}>{step.title}</h3>
                    <p className={styles.timelineDescription}>{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper variant="dark">
        <Reveal>
          <div className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>Interested in Our Products?</h2>
            <p className={styles.ctaText}>
              Whether you're a wholesaler, distributor, or retailer, we're here to 
              help you find the perfect rice products for your needs. Get in touch 
              with our team today.
            </p>
            <PrimaryButton href="/contact-us">Contact Us</PrimaryButton>
          </div>
        </Reveal>
      </SectionWrapper>
    </>
  );
}
