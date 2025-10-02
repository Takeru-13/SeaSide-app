// frontend/src/features/records/pages/HomeSection.tsx
import { useEffect, useMemo, useState } from 'react';

import useCalendar from '../hooks/useCalendar';
import usePairCalendar from '../hooks/usePairCalendar';

import CalendarView from '../components/sections/Calendar';
import ScopeToggle from '../components/ScopeToggle';
import EmptyPairCard from '../../pair/components/EmptyPairCard';

import EditModalQuick from '../components/EditModalQuick';

import MonthlyGraph from '../components/MonthlyGraph';
import PairRecordModal from '../components/PairRecordModal';

import { get } from '../../../shared/api/http';
import type { Scope } from '../types';
import styles from './HomeSection.module.css';

type MeResponse = { id: number; userName: string; email: string; iconUrl?: string };
type PairStatus = { connected: boolean; partner?: { id: number } };

export default function HomeSection() {
  // スコープ（自分 / ペア）をトップで保持
  const [scope, setScope] = useState<Scope>('me');

  // 自分スコープ：{ state, act } 形
  const self = useCalendar();
  const { state: selfState, act: selfAct } = self;

  // ペアスコープ：フラット形
  const pair = usePairCalendar();

  // 表示用の値を scope で切替
  const ym = scope === 'me' ? selfState.ym : pair.ym;
  const days = scope === 'me' ? selfState.month.days : pair.days;
  const loading = scope === 'me' ? selfState.loading : pair.loading;
  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const prevMonth = () => {
    if (scope === 'me') selfAct.setYm(shiftYm(selfState.ym, -1));
    else pair.prev();
  };
  const nextMonth = () => {
    if (scope === 'me') selfAct.setYm(shiftYm(selfState.ym, +1));
    else pair.next();
  };

  // ペア詳細モーダルの日付
  const [pairDate, setPairDate] = useState<string | null>(null);

  // /auth/me の取得（任意表示）
  const [me, setMe] = useState<MeResponse | null>(null);
  useEffect(() => {
    get<MeResponse>('/auth/me')
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  // ペア名（ヘッダー表示用）
  const [pairName, setPairName] = useState<string | null>(null);
  useEffect(() => {
    if (scope !== 'pair') return; // ペアタブの時だけ取得
    (async () => {
      try {
        const status = await get<PairStatus>('/pair/status');
        if (!status.connected || !status.partner?.id) {
          setPairName('ペア');
          return;
        }
        // パートナーの表示名を取得（存在しない場合は 'ペア' フォールバック）
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
      selfAct.onSelectDate(date); // 自分スコープはクイック編集モーダルを開く
    }
  };

  return (
    <section className={styles.wrapper}>
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

      {/* 自分：クイック編集モーダル */}
      {selfState.editing && scope === 'me' && (
        <EditModalQuick
          value={selfState.editing}
          onClose={() => selfAct.setEditing(null)}
          onSave={selfAct.onSaveQuick}
        />
      )}

      {/* ペア：閲覧専用モーダル */}
      {scope === 'pair' && pairDate && (
        <PairRecordModal date={pairDate} onClose={() => setPairDate(null)} />
      )}

      <MonthlyGraph ym={ym} days={days} />

      {loading && <div className={styles.loading}>読み込み中…</div>}
    </section>
  );
}

/** 'YYYY-MM' に月シフトを適用 */
function shiftYm(ym: string, delta: number): string {
  const y = Number(ym.slice(0, 4));
  const m = Number(ym.slice(5, 7));
  const d = new Date(y, m - 1 + delta, 1);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${d.getFullYear()}-${mm}`;
}
