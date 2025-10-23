import { useState } from 'react';
import { getMonthlySummary } from '../api';
import LoadingOverlay from '../../../shared/ui/LoadingOverlay';
import styles from './MonthlySummary.module.css';

type Props = {
  yearMonth: string; // "2025-01"
};

export default function MonthlySummary({ yearMonth }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMonthlySummary(yearMonth);
      setSummary(result.summary);
    } catch (err) {
      setError('もう一度試してみてください。エラーが続いたら開発者に教えてね');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <LoadingOverlay isLoading={loading} message="AI先生がまとめています...🤔結構時間かかるかも" fullScreen={false} />
      
      <h3 className={styles.title}>🦀今月のAI要約(β版)🐢</h3>
      
      {!summary ? (
        <button onClick={handleGenerate} disabled={loading} className={styles.button}>
          要約を生成
        </button>
      ) : (
        <div className={styles.content}>
          {summary}
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}