import useHome from './hooks/useHome';
import CalendarView from './components/Calendar/Calendar';
import ScopeToggle from './components/ScopeToggle';
import EmptyPairCard from './components/EmptyPairCard';
import EditModal from './components/EditModal/EditModal';
import MonthlyGraph from './components/MonthlyGraph';
import PairDetailModal from './components/PairDetailModal';

import { useEffect, useState } from 'react';
import { get } from '../../shared/api/http';
import styles from './homeSection.module.css'; 

type MeResponse = { id: number; userName: string; email: string; iconUrl?: string };

function addMonths(ym: string, delta: number) {
  const y = Number(ym.slice(0, 4));
  const m = Number(ym.slice(5, 7));
  const d = new Date(y, m - 1 + delta, 1);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${mm}`;
}

export default function HomeSection() {
  const { state, act } = useHome();
  const { scope, ym, month, editing, todayStr } = state;
  const { setScope, setYm, onSelectDate, setEditing, onSave } = act;

  const prevMonth = () => setYm(addMonths(ym, -1));
  const nextMonth = () => setYm(addMonths(ym, +1));

  const [pairDate, setPairDate] = useState<string | null>(null);

  const [me, setMe] = useState<MeResponse | null>(null);
  useEffect(() => {
    get<MeResponse>('/auth/me')
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  const handlePick = (date: string) => {
    if (date > todayStr) return;
    if (scope === 'pair') setPairDate(date);
    else onSelectDate(date);
  };

  return (
    <section className={styles.wrapper}>
      <header className={styles.header}>

        <div className={styles.scopeArea}>
          <ScopeToggle scope={scope} onChange={setScope} />
        </div>

        {me && (
          <div className={styles.userBadge}>
            <span className={styles.userName}>{me.userName}</span>
            <span>の記録</span>
          </div>
        )}
      </header>

      {scope === 'pair' ? <EmptyPairCard /> : null}

      <CalendarView
        ym={ym}
        days={month.days}
        onPick={handlePick}
        onPrev={prevMonth}
        onNext={nextMonth}
      />

      {editing && (
        <EditModal
          value={editing}
          onClose={() => setEditing(null)}
          onSave={onSave}
        />
      )}

      {scope === 'pair' && pairDate && (
        <PairDetailModal
          date={pairDate}
          onClose={() => setPairDate(null)}
        />
      )}

      <MonthlyGraph ym={ym} days={month.days} />
    </section>
  );
}
