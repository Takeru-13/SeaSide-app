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
  // recharts 用に { day: 1..N, score?: number } に整形
  const data = useMemo(() => {
    return days.map((d) => {
      const dayNum = Number(d.date.slice(8, 10));
      return { day: dayNum, score: d.score ?? null };
    });
  }, [days]);

  // 軽い空表示
  const hasAny = useMemo(() => data.some((d) => d.score != null), [data]);
  if (!hasAny) {
    return (
      <div style={{ padding: '8px 0 0', opacity: 0.7, fontSize: 14 }}>
        {ym} の記録グラフ（データなし）
      </div>
    );
  }

  // X軸の目盛は 5日刻み（1,6,11,16,21,26,末）
  const maxDay = data.length;
  const ticks = Array.from({ length: Math.ceil(maxDay / 5) + 1 }, (_, i) => {
    const t = i * 5 + 1;
    return t > maxDay ? maxDay : t;
  });

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ marginBottom: 6, fontWeight: 600 }}>{ym} の気分推移</div>
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" ticks={ticks} tickMargin={4} />
          <YAxis domain={[1, 10]} ticks={[1,2,3,4,5,6,7,8,9,10]} width={28} />
          <Tooltip
            formatter={(value) => (value == null ? '-' : String(value))}
            labelFormatter={(label) => `${ym}-${String(label).padStart(2, '0')}`}
          />
          {/* null をスキップして折れ線を途切れさせる */}
          <Line type="monotone" dataKey="score" connectNulls={false} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
