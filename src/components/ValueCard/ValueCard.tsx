import { ReactNode } from 'react';
import styles from './ValueCard.module.css';

interface ValueCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
}

export default function ValueCard({ title, description, icon }: ValueCardProps) {
  return (
    <div className={styles.card}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </div>
  );
}
