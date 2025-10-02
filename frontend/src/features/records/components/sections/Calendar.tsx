// react-calendarベース：月固定 + 中央にPNGを重ね表示（少し大きめ）
import { useMemo } from 'react';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './calendar.module.css';

import type { CalendarScoreDay, DateKey } from '../../types';

type Props = {
  ym: string;
  days: CalendarScoreDay[]; // { date: 'YYYY-MM-DD', score?: number } を想定
  onPick: (dateISO: DateKey) => void;
  onPrev: () => void;
  onNext: () => void;
};

// ローカル日付を YYYY-MM-DD に変換
function formatDateLocal(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// 1..10 に丸め
const clampLevel = (n: number) => Math.min(10, Math.max(1, Math.floor(n)));

export default function CalendarView({ ym, days, onPick, onPrev, onNext }: Props) {
  const value = useMemo(() => new Date(`${ym}-01`), [ym]);
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  return (
    <div className={styles.calWrapper}>
      <div className={styles.header}>
        <button onClick={onPrev} aria-label="前の月へ">&lt;</button>
        <span className={styles.title}>{ym}</span>
        <button onClick={onNext} aria-label="次の月へ">&gt;</button>
      </div>

      <ReactCalendar
        /* 表示は月ビュー固定＋内蔵ナビ無効（上のヘッダで制御） */
        view="month"
        minDetail="month"
        maxDetail="month"
        showNavigation={false}

        /* ロケール（曜日ヘッダなど） */
        locale="ja-JP"

        /* 表示する月を固定 */
        activeStartDate={value}
        /* 選択状態は不要（クリック時は onPick を使う） */
        value={undefined}

        /* 「◯日」の“日”を出さず数字だけ表示 */
        formatDay={(_, date) => String(date.getDate())}

        /* スクリーンリーダー用の長い表記（例: 2025年9月29日(月)） */
        formatLongDate={(_, date) =>
          date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short',
          })
        }

        /* クリックで日付ISOを返す */
        onClickDay={(d) => onPick(formatDateLocal(d) as DateKey)}

        /* 未来日は無効（それ以外は常にクリック可） */
        tileDisabled={({ date }) => formatDateLocal(date) > todayStr}

        /* 全タイルを重ね合わせの基準に */
        tileClassName={({ date }) => {
          const iso = formatDateLocal(date);
          const hasIcon = days.some(d => d.date === iso && d.score != null);
          return hasIcon ? `${styles.tile} ${styles.hasIcon ?? ''}` : styles.tile;
        }}

        /* 各日セルにPNGを中央重ね（未記録は出さない） */
        tileContent={({ date }) => {
          const iso = formatDateLocal(date);
          const hit = days.find((d) => d.date === iso);
          if (hit?.score != null) {
            const level = clampLevel(hit.score);
            const src = `/emotions/Lv${level}.png`;
            return (
              <div className={styles.iconCenter}>
                <img
                  src={src}
                  alt={`Emotion Lv.${level}`}
                  decoding="async"
                  loading="eager"
                  className={styles.iconCenterImg}
                  /* 高DPI用がある場合は有効化
                  srcSet={`/emotions/Lv${level}.png 1x, /emotions/Lv${level}@2x.png 2x, /emotions/Lv${level}@3x.png 3x`}
                  */
                />
              </div>
            );
          }
          return null;
        }}
      />
    </div>
  );
}
