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
      setError('開発中だよ。もうちょっとまってね');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.card}>
      <LoadingOverlay isLoading={loading} message="AI要約を生成中..." fullScreen={false} />
      
      <h3 className={styles.title}>✨ 今月のAI要約</h3>
      
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