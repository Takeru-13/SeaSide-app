// frontend/src/features/records/pages/RecordDetailSection.tsx
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import EditForm from '../components/EditForm';
import { useRecordDetail } from '../hooks/useRecordDetail';
import LoadingOverlay from '../../../shared/ui/LoadingOverlay'; // ← 追加
import type { RecordView, UpsertPayload, DateKey } from '../types';

export default function RecordDetailSection() {
  const { date: dateParam } = useParams(); // ルートが /records/:date を想定
  const dateKey = (dateParam ?? '') as DateKey;

  const [search] = useSearchParams();
  const navigate = useNavigate();

  const view = search.get('view'); // 'pair' のとき閲覧専用
  const targetUserId = search.get('userId') ? Number(search.get('userId')) : undefined;
  const readOnly = view === 'pair' || targetUserId != null;

  const { data, loading, error, save } = useRecordDetail(dateKey, { userId: targetUserId });

  const onCancel = () => navigate(-1);
  const onSave = async (patch: UpsertPayload) => {
    if (readOnly) throw new Error('ペアの記録は閲覧のみです');
    await save(patch);
  };

  // エラーハンドリング
  if (!dateKey) return <p>日付が不正です。</p>;
  if (error) return <p className="banner banner--error">{error}</p>;

  return (
    <section className="detail-wrap">
      {/* ★ ローディングオーバーレイ（全画面） */}
      <LoadingOverlay 
        isLoading={loading} 
        message="詳細を読み込んでいます..."
      />

      {/* データがない場合 */}
      {!loading && !data && <p>記録が見つかりません。</p>}

      {/* データがある場合 */}
      {!loading && data && (
        <>
          {readOnly && (
            <div className="banner banner--info">
              ペアの記録を表示中（編集不可）
            </div>
          )}
          {/* EditForm は RecordView 初期値＋差分パッチ保存 */}
          <EditForm initial={data as RecordView} onCancel={onCancel} onSave={onSave} />
        </>
      )}
    </section>
  );
}