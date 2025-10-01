import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import styles from './monthlyGraph.module.css';


type DayScore = { date: string; score?: number };

export default function MonthlyGraph({
  ym,
  days,
  height = 240,
}: {
  ym: string;
  days: DayScore[];
  height?: number;
}) {
  const data = useMemo(() => {
    return days.map((d) => {
      const dayNum = Number(d.date.slice(8, 10));
      return { day: dayNum, score: d.score ?? null };
    });
  }, [days]);

  const hasAny = useMemo(() => data.some((d) => d.score != null), [data]);
  if (!hasAny) {
    return (
      <div className={styles.empty}>
        {ym} の記録グラフ（データなし）
      </div>
    );
  }

  const maxDay = data.length;
  const ticks = Array.from({ length: Math.ceil(maxDay / 5) + 1 }, (_, i) => {
    const t = i * 5 + 1;
    return t > maxDay ? maxDay : t;
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{ym} の気分推移</div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d0eaf2" />
          <XAxis
            dataKey="day"
            ticks={ticks}
            tickMargin={4}
            stroke="#7a94a3"
          />
          <YAxis
            domain={[1, 10]}
            ticks={[1,2,3,4,5,6,7,8,9,10]}
            width={28}
            stroke="#7a94a3"
          />
          <Tooltip
            contentStyle={{
              background: '#ffffffee',
              borderRadius: '8px',
              border: '1px solid #c6f3ff',
              fontSize: '0.8rem',
            }}
            formatter={(value) => (value == null ? '-' : String(value))}
            labelFormatter={(label) => `${ym}-${String(label).padStart(2, '0')}`}
          />
          <Line
            type="monotone"
            dataKey="score"
            connectNulls={false}
            stroke="#00a4d6"
            strokeWidth={3}
            dot={{ r: 5, fill: '#6cd4ff', stroke: '#00a4d6', strokeWidth: 1 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
