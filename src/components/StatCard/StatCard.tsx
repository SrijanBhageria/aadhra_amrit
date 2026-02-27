import styles from './StatCard.module.css';

interface StatCardProps {
  number: string;
  label: string;
  description?: string;
}

export default function StatCard({ number, label, description }: StatCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.number}>{number}</div>
      <h3 className={styles.label}>{label}</h3>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
}
