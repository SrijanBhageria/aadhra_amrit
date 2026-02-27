'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import ParallaxHero from '@/components/ParallaxHero/ParallaxHero';
import Reveal from '@/components/Reveal/Reveal';
import Accordion from '@/components/Accordion/Accordion';
import PrimaryButton from '@/components/PrimaryButton/PrimaryButton';
import styles from './page.module.css';

const cultureItems = [
  {
    type: 'text',
    content: 'Equal Opportunities for all',
    bg: 'cream',
  },
  {
    type: 'image',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80',
    bg: 'image',
  },
  {
    type: 'text',
    content: 'Diverse & Multi-generational peer group',
    bg: 'brown',
  },
  {
    type: 'text',
    content: 'Innovative culture with Ownership',
    bg: 'cream',
  },
  {
    type: 'image',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    bg: 'image',
  },
  {
    type: 'image',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
    bg: 'image',
  },
  {
    type: 'text',
    content: 'Strong Values that touch lives',
    bg: 'brown',
  },
  {
    type: 'text',
    content: 'Global Exposure',
    bg: 'cream',
  },
  {
    type: 'image',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80',
    bg: 'image',
  },
  {
    type: 'image',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&q=80',
    bg: 'image',
  },
  {
    type: 'image',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
    bg: 'image',
  },
  {
    type: 'text',
    content: 'Career Development & Mobility',
    bg: 'brown',
  },
];

const cultureValues = [
  'Integrity',
  'Innovation',
  'Collaboration',
  'Excellence',
  'Sustainability',
  'Growth',
  'Quality',
  'Trust',
];

const positions = [
  {
    title: 'Sales & Business Development Executive',
    type: 'Full-time',
    location: 'Delhi',
    experience: '2-5 years in FMCG/Agri products',
    description: `We're looking for an experienced sales professional to help expand our market reach and build relationships with wholesalers, retailers, and distributors.

Key Responsibilities:
• Develop and maintain relationships with key clients
• Identify new business opportunities
• Achieve sales targets and objectives
• Market research and competitor analysis
• Prepare sales reports and forecasts

Requirements:
• Bachelor's degree in Business, Marketing, or related field
• Proven track record in sales, preferably in FMCG or agricultural products
• Excellent communication and negotiation skills
• Willingness to travel`,
  },
  {
    title: 'Quality Control Specialist',
    type: 'Full-time',
    location: 'Delhi',
    experience: '1-3 years in quality control',
    description: `Join our quality assurance team to ensure that every product meets our high standards. Experience in agricultural product quality control preferred.

Key Responsibilities:
• Conduct quality inspections at various stages of processing
• Maintain quality control documentation
• Coordinate with processing teams
• Identify and resolve quality issues
• Ensure compliance with industry standards

Requirements:
• Degree in Food Science, Agriculture, or related field
• Experience in quality control, preferably in food/agricultural products
• Attention to detail and analytical skills
• Knowledge of quality standards and regulations`,
  },
  {
    title: 'Logistics & Operations Coordinator',
    type: 'Full-time',
    location: 'Delhi',
    experience: '2-4 years in logistics/operations',
    description: `Manage our supply chain operations, coordinate with logistics partners, and ensure smooth operations from warehouse to customer.

Key Responsibilities:
• Coordinate logistics and transportation
• Manage inventory and warehouse operations
• Liaise with suppliers and distributors
• Optimize supply chain processes
• Track shipments and deliveries

Requirements:
• Bachelor's degree in Supply Chain, Operations, or related field
• Experience in logistics and operations management
• Strong organizational and problem-solving skills
• Proficiency in inventory management systems`,
  },
];

const testimonials = [
  {
    name: 'Priyanshi Singh',
    role: 'Quality Assurance Team',
    quote: 'Working at Adhra Amrit has been a rewarding experience. The company truly values quality and integrity, and I feel proud to be part of a team that maintains such high standards.',
  },
  {
    name: 'Kailash Sharma',
    role: 'Supply Chain Team',
    quote: 'The collaborative environment and focus on growth make Adhra Amrit a great place to work. I\'ve learned so much and feel supported in my professional development.',
  },
  {
    name: 'Ankit Agarwal',
    role: 'Sales Team',
    quote: 'The company\'s commitment to honesty and quality is reflected in everything we do. It\'s inspiring to work with a team that truly believes in what they\'re doing.',
  },
  {
    name: 'Swati Jain',
    role: 'Operations Team',
    quote: 'Adhra Amrit provides equal opportunities for growth and learning. The work culture is positive, and I feel valued as a team member.',
  },
];

export default function Careers() {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <ParallaxHero
        imageUrl="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&q=80"
        mobileImageUrl="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
        title="Build Your Career With Adhra Amrit"
        subtitle="Join a team that values integrity, quality, and growth. Be part of a company making a difference in the agricultural products sector."
        badge="EMPOWERING GROWTH"
      />

      {/* Why Choose Section */}
      <SectionWrapper>
        <Reveal>
          <div className={styles.whyChooseSection}>
            <div className={styles.whyChooseHeader}>
              <h2 className={styles.whyChooseTitle}>Why Choose A Career With Adhra Amrit?</h2>
              <p className={styles.whyChooseText}>
                At Adhra Amrit, we have a growing, highly skilled team across India. We always
                believe in a long-term association with our valuable employees, fostering an
                environment where everyone can grow, innovate, and contribute to our mission of
                delivering premium quality products while maintaining ethical business practices.
              </p>
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Culture Bento Grid */}
      <SectionWrapper variant="light">
        <Reveal>
          <div className={styles.cultureGrid}>
            {cultureItems.map((item, index) => (
              <motion.div
                key={index}
                className={`${styles.cultureItem} ${styles[`cultureItem${item.bg.charAt(0).toUpperCase() + item.bg.slice(1)}`]}`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
              >
                {item.type === 'text' ? (
                  <div className={styles.cultureText}>
                    <h3>{item.content}</h3>
                  </div>
                ) : item.image ? (
                  <div className={styles.cultureImageWrapper}>
                    <img
                      src={item.image}
                      srcSet={`${item.image.replace('w=600', 'w=300')} 300w, ${item.image} 600w`}
                      sizes="(max-width: 768px) 300px, 600px"
                      alt="Culture"
                      className={styles.cultureImage}
                    />
                  </div>
                ) : null}
              </motion.div>
            ))}
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Culture Values Strip */}
      <SectionWrapper>
        <div className={styles.valuesStrip}>
          <motion.div
            className={styles.valuesStripInner}
            animate={{
              x: [0, -50 * cultureValues.length],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...cultureValues, ...cultureValues].map((value, index) => (
              <span key={index} className={styles.valuePill}>
                {value}
              </span>
            ))}
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Open Positions */}
      <SectionWrapper variant="light">
        <Reveal>
          <div className={styles.positionsSection}>
            <h2 className={styles.positionsTitle}>Open Positions</h2>
            <p className={styles.positionsSubtitle}>
              We're always looking for talented individuals to join our team. Explore our
              current openings below.
            </p>
            <div className={styles.positionsList}>
              {positions.map((position, index) => (
                <Accordion
                  key={index}
                  title={
                    <div className={styles.positionHeader}>
                      <div>
                        <h3 className={styles.positionTitle}>{position.title}</h3>
                        <div className={styles.positionMeta}>
                          <span className={styles.positionType}>{position.type}</span>
                          <span className={styles.positionLocation}>{position.location}</span>
                          <span className={styles.positionExperience}>{position.experience}</span>
                        </div>
                      </div>
                    </div>
                  }
                  className={styles.positionAccordion}
                >
                  <div className={styles.positionDescription}>
                    {position.description.split('\n\n').map((para, i) => (
                      <p key={i} className={styles.positionParagraph}>
                        {para}
                      </p>
                    ))}
                  </div>
                </Accordion>
              ))}
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Testimonials */}
      <SectionWrapper>
        <Reveal>
          <div className={styles.testimonialsSection}>
            <div className={styles.testimonialsHeader}>
              <span className={styles.testimonialsBadge}>TESTIMONIALS</span>
              <h2 className={styles.testimonialsTitle}>Hear From Employees</h2>
            </div>
            <div className={styles.testimonialsGrid}>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  className={styles.testimonialCard}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  whileHover={{ y: -6, boxShadow: 'var(--shadow-lg)' }}
                >
                  <div className={styles.testimonialQuote}>
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                      <path
                        d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20C30 25.5228 25.5228 30 20 30C18.8954 30 17.8355 29.7751 16.8667 29.3667"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d="M15 18C15 16.3431 16.3431 15 18 15C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21C17.2987 21 16.6644 20.7013 16.2 20.2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <p className={styles.testimonialText}>"{testimonial.quote}"</p>
                  <div className={styles.testimonialAuthor}>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </SectionWrapper>

      {/* Join Us CTA */}
      <SectionWrapper variant="dark">
        <Reveal>
          <div className={styles.joinSection}>
            <h2 className={styles.joinTitle}>Interested in Joining Us?</h2>
            <p className={styles.joinText}>
              If you don't see a position that matches your skills, or if you're passionate
              about what we do, we'd still love to hear from you. Send us your resume and a
              cover letter explaining why you'd like to work with Adhra Amrit.
            </p>
            <PrimaryButton href="/contact-us">Get in Touch</PrimaryButton>
          </div>
        </Reveal>
      </SectionWrapper>
    </>
  );
}
