// useHomeフックを使ってカレンダー日記アプリの全パーツを組み立てる最上位コンポーネント
import useHome from './hooks/useHome';
import CalendarView from './components/Calendar/Calendar';
import ScopeToggle from './components/ScopeToggle';
import EmptyPairCard from './components/EmptyPairCard';
import EditModal from './components/EditModal/EditModal';

export default function HomeSection() {
  const { state, actions } = useHome();
  const { scope, ym, data, loading, editTarget } = state;
  const { setScope, nextMonth, prevMonth, startEdit, save, setEditTarget } = actions;

  return (
    <section style={{ padding: 16 }}>
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2>Home</h2>
        <ScopeToggle scope={scope} onChange={setScope} />
      </header>

      {scope === 'pair' ? <EmptyPairCard /> : null}

      {loading && <p>読み込み中...</p>}
      {data && (
        <CalendarView
          ym={ym}
          days={data.days}
          onPick={startEdit}
          onPrev={prevMonth}
          onNext={nextMonth}
        />
      )}

      {editTarget && (
  <EditModal
    date={editTarget.date}
    open={!!editTarget}
    initial={undefined}        // 後で既存値があるならここに詰める
    onClose={() => setEditTarget(null)}
    onSave={(form) => {
      // ひとまず score だけ保存していた既存の save(payload) を拡張していく
      // まずは通すために emotion をスコアとして流用してOK
      save({ date: form.date, score: form.emotion, note: '' })
        .catch(console.error);
    }}
  />
)}
    </section>
  );
}
