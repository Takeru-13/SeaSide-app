// react-calendarライブラリをベースにした、日記データ付きカレンダー表示コンポーネント
// カレンダー表示をするだけのコンポーネント。年表示をブロック
import { useMemo } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './calendar.module.css';
import type { DaySummary } from '../../types';

type Props = {
  ym: string;
  days: DaySummary[];
  onPick: (dateISO: string) => void;
  onPrev: () => void;
  onNext: () => void;
};

// ローカル日付を YYYY-MM-DD に変換する関数
function formatDateLocal(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function CalendarView({ ym, days, onPick, onPrev, onNext }: Props) {
  const value = useMemo(() => new Date(`${ym}-01`), [ym]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button onClick={onPrev}>&lt;</button>
        <span className={styles.title}>{ym}</span>
        <button onClick={onNext}>&gt;</button>
      </div>

      <ReactCalendar
        value={value}
        onClickDay={(d) => onPick(formatDateLocal(d))}
        tileContent={({ date }) => {
          const iso = formatDateLocal(date);
          const hit = days.find(d => d.date === iso);
          return hit?.score != null ? <div className={styles.dot}>{hit.score}</div> : null;
        }}
      />
    </div>
  );
}
