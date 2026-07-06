'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './DocsViewer.module.css';

export interface DocTab {
  id: string;
  title: string;
  content: string;
}

interface DocsViewerProps {
  docs: DocTab[];
  defaultTab?: string;
}

export default function DocsViewer({ docs, defaultTab }: DocsViewerProps) {
  const [activeId, setActiveId] = useState(defaultTab ?? docs[0]?.id ?? '');

  const activeDoc = docs.find((d) => d.id === activeId) ?? docs[0];

  if (!activeDoc) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {docs.length > 1 && (
        <nav className={styles.tabs} aria-label="Documentation sections">
          {docs.map((doc) => (
            <button
              key={doc.id}
              type="button"
              className={`${styles.tab} ${activeId === doc.id ? styles.active : ''}`}
              onClick={() => setActiveId(doc.id)}
            >
              {doc.title}
            </button>
          ))}
        </nav>
      )}

      <article className={styles.content}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeDoc.content}</ReactMarkdown>
      </article>
    </div>
  );
}
