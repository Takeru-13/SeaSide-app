// features/home/components/Calendar/Calendar.tsx
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

export default function CalendarView({ ym, days, onPick, onPrev, onNext }: Props) {
  const value = useMemo(() => new Date(`${ym}-01`), [ym]);
  const map = useMemo(() => {
    const m = new Map<string, DaySummary>();
    days.forEach(d => m.set(d.date, d));
    return m;
  }, [days]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button onClick={onPrev}>&lt;</button>
        <span className={styles.title}>{ym}</span>
        <button onClick={onNext}>&gt;</button>
      </div>

      <ReactCalendar
        value={value}
        onClickDay={(d) => onPick(d.toISOString().slice(0,10))}
        tileContent={({ date }) => {
          const iso = date.toISOString().slice(0,10);
          const hit = map.get(iso);
          return hit?.score != null ? <div className={styles.dot}>{hit.score}</div> : null;
        }}
      />
    </div>
  );
}
