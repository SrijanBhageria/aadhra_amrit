import fs from 'fs';
import path from 'path';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import DocsViewer from '@/components/DocsViewer/DocsViewer';
import styles from './page.module.css';

export const metadata = {
  title: 'Documentation | Adhra Amrit',
  description: 'Integration guides and API documentation for Adhra Amrit services.',
};

function loadCouponPublicDoc(): string {
  const filePath = path.join(process.cwd(), 'docs/COUPON_PUBLIC_UI_INTEGRATION.md');
  return fs.readFileSync(filePath, 'utf-8');
}

export default function DocsPage() {
  const couponPublicDoc = loadCouponPublicDoc();

  const docs = [
    {
      id: 'coupon-public',
      title: 'Coupon Public UI',
      content: couponPublicDoc,
    },
  ];

  return (
    <>
      <SectionWrapper>
        <div className={styles.header}>
          <h1 className={styles.title}>Documentation</h1>
          <p className={styles.subtitle}>
            Integration guides for customer-facing features and APIs
          </p>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="light">
        <DocsViewer docs={docs} defaultTab="coupon-public" />
      </SectionWrapper>
    </>
  );
}
