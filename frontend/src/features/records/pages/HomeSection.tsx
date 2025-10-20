// frontend/src/features/records/pages/HomeSection.tsx
import { useEffect, useMemo, useState } from 'react';

import useCalendar from '../hooks/useCalendar';
import usePairCalendar from '../hooks/usePairCalendar';

import CalendarView from '../components/sections/Calendar';
import ScopeToggle from '../components/ScopeToggle';
import EmptyPairCard from '../../pair/components/EmptyPairCard';
import LoadingOverlay from '../../../shared/ui/LoadingOverlay'; // ← 追加

import EditModalQuick from '../components/EditModalQuick';

import MonthlyGraph from '../components/MonthlyGraph';
import PairRecordModal from '../components/PairRecordModal';

import { get } from '../../../shared/api/http';
import type { Scope } from '../types';
import styles from './HomeSection.module.css';

type MeResponse = { id: number; userName: string; email: string; iconUrl?: string };
type PairStatus = { connected: boolean; partner?: { id: number } };

// ローカル日付をYYYY-MM-DDに変換（UTCではなく）
function formatDateLocal(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function HomeSection() {
  const [isZen, setIsZen] = useState(false);
  const [scope, setScope] = useState<Scope>('me');

  const self = useCalendar();
  const { state: selfState, act: selfAct } = self;

  const pair = usePairCalendar();

  const ym = scope === 'me' ? selfState.ym : pair.ym;
  const days = scope === 'me' ? selfState.month.days : pair.days;
  const loading = scope === 'me' ? selfState.loading : pair.loading;
  // ローカル時刻で今日の日付を取得（UTCではなく）
  const todayStr = useMemo(() => formatDateLocal(new Date()), []);

  const prevMonth = () => {
    if (scope === 'me') selfAct.setYm(shiftYm(selfState.ym, -1));
    else pair.prev();
  };
  const nextMonth = () => {
    if (scope === 'me') selfAct.setYm(shiftYm(selfState.ym, +1));
    else pair.next();
  };

  const [pairDate, setPairDate] = useState<string | null>(null);

  const [me, setMe] = useState<MeResponse | null>(null);
  useEffect(() => {
    get<MeResponse>('/auth/me')
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  const [pairName, setPairName] = useState<string | null>(null);
  useEffect(() => {
    if (scope !== 'pair') return;
    (async () => {
      try {
        const status = await get<PairStatus>('/pair/status');
        if (!status.connected || !status.partner?.id) {
          setPairName('ペア');
          return;
        }
        try {
          const u = await get<{ userName?: string }>(`/users/${status.partner.id}`);
          setPairName(u.userName ?? 'ペア');
        } catch {
          setPairName('ペア');
        }
      } catch {
        setPairName('ペア');
      }
    })();
  }, [scope]);

  const handlePick = (date: string) => {
    if (date > todayStr) return;
    if (scope === 'pair') {
      setPairDate(date);
    } else {
      selfAct.onSelectDate(date);
    }
  };

  const isModalOpen =
    (scope === 'me' && !!selfState.editing) ||
    (scope === 'pair' && !!pairDate);

  return (
    <section className={styles.wrapper}>
      {/* ★ ローディングオーバーレイ（全画面） */}
      <LoadingOverlay 
        isLoading={loading} 
        message="読み込み中。。。🐟️ 🐡 🦈"
      />

      {!isZen && (
        <>
          <header className={styles.header}>
            {scope === 'pair' ? (
              <div className={styles.userBadge}>
                <span className={styles.userName}>{pairName ?? 'ペア'}</span>
                <span>の記録</span>
              </div>
            ) : (
              me && (
                <div className={styles.userBadge}>
                  <span className={styles.userName}>{me.userName}</span>
                  <span>の記録</span>
                </div>
              )
            )}
            <div className={styles.scopeArea}>
              <ScopeToggle scope={scope} onChange={setScope} />
            </div>
          </header>

          {scope === 'pair' ? <EmptyPairCard /> : null}

          <CalendarView
            ym={ym}
            days={days}
            onPick={handlePick}
            onPrev={prevMonth}
            onNext={nextMonth}
          />

          {selfState.editing && scope === 'me' && (
            <EditModalQuick
              value={selfState.editing}
              onClose={() => selfAct.setEditing(null)}
              onSave={selfAct.onSaveQuick}
            />
          )}

          {scope === 'pair' && pairDate && (
            <PairRecordModal date={pairDate} onClose={() => setPairDate(null)} />
          )}

          <MonthlyGraph ym={ym} days={days} />
        </>
      )}

      {!isModalOpen && (
        <div className={styles.zenControls} aria-live="polite">
          <button
            type="button"
            className={styles.zenBtn}
            onClick={() => setIsZen(true)}
            disabled={isZen}
            aria-pressed={isZen}
            title="背景だけ表示（全部消す）"
          >
            眺める
          </button>
          <button
            type="button"
            className={styles.zenBtn}
            onClick={() => setIsZen(false)}
            disabled={!isZen}
            aria-pressed={!isZen}
            title="元に戻す"
          >
            戻す
          </button>
        </div>
      )}
    </section>
  );
}

function shiftYm(ym: string, delta: number): string {
  const y = Number(ym.slice(0, 4));
  const m = Number(ym.slice(5, 7));
  const d = new Date(y, m - 1 + delta, 1);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${mm}`;
}