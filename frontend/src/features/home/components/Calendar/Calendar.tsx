// frontend/src/features/home/components/Calendar/Calendar.tsx
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
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <button onClick={onPrev}>&lt;</button>
        <span className={styles.title}>{ym}</span>
        <button onClick={onNext}>&gt;</button>
      </div>

      <ReactCalendar
        // 表示は月ビュー固定＋内蔵ナビ無効（上のヘッダで制御）
        view="month"
        minDetail="month"
        maxDetail="month"
        showNavigation={false}

        // 表示する月を固定
        activeStartDate={value}
        // react-calendar は selected "value" を与えると選択状態が付くが
        // 今回は選択状態不要なので undefined にしておく（クリック時は onPick を使う）
        value={undefined}

        // クリックで日付ISOを返す
        onClickDay={(d) => onPick(formatDateLocal(d))}

        // 未来日は無効（それ以外は常にクリック可）
        tileDisabled={({ date }) => formatDateLocal(date) > todayStr}

        // 各日セルにスコアを表示（未記録は何も出さない）
        tileContent={({ date }) => {
          const iso = formatDateLocal(date);
          const hit = days.find((d) => d.date === iso);
          return hit?.score != null ? <div className={styles.dot}>{hit.score}</div> : null;
        }}

        // （任意）未記録日を薄くするなど見た目を変えたい場合は className を付与
        // tileClassName={({ date }) => {
        //   const iso = formatDateLocal(date);
        //   const has = days.some((d) => d.date === iso && d.score != null);
        //   return has ? undefined : styles.noData;
        // }}
      />
    </div>
  );
}
