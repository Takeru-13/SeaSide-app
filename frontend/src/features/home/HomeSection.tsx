// features/home/HomeSection.tsx
// useHomeフックを使ってカレンダー日記アプリの全パーツを組み立てる最上位コンポーネント
import { useHome } from './hooks/useHome';
import CalendarView from './components/Calendar/Calendar';
import ScopeToggle from './components/ScopeToggle';
import EmptyPairCard from './components/EmptyPairCard';
import EditModal from './components/EditModal/EditModal';

function addMonths(ym: string, delta: number) {
  const y = Number(ym.slice(0, 4));
  const m = Number(ym.slice(5, 7));
  const d = new Date(y, m - 1 + delta, 1);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${mm}`;
}

export default function HomeSection() {
  // ※ useHome はデフォルトエクスポートで、 state/act を返す想定
  const { state, act } = useHome();
  const { scope, ym, month, editing } = state;
  const { setScope, setYm, onSelectDate, setEditing, onSave } = act;

  const prevMonth = () => setYm(addMonths(ym, -1));
  const nextMonth = () => setYm(addMonths(ym, +1));

  return (
    <section style={{ padding: 16 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Home</h2>
        <ScopeToggle scope={scope} onChange={setScope} />
      </header>

      {scope === 'pair' ? <EmptyPairCard /> : null}

      <CalendarView
        ym={ym}
        days={month.days}
        onPick={onSelectDate}   // 日付クリック → 編集開始
        onPrev={prevMonth}
        onNext={nextMonth}
      />

      {editing && (
        <EditModal
          value={editing}                 // { date, meal, sleep, medicine, period, emotion }
          onClose={() => setEditing(null)}
          onSave={onSave}                 // 保存（PUT /records/:date）→ 月次再取得 → モーダル閉じ
        />
      )}
    </section>
  );
}
