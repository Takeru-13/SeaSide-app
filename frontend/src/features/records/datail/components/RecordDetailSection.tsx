// src/features/records/detail/components/RecordDetailSection.tsx
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import EditForm from "./EditForm";
import { useRecordDetail } from "../hooks/useRecordDetail";
import type { EditFormValue } from '../types';

export default function RecordDetailSection() {
  const { dateKey = "" } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();

  // ホーム側から ?view=pair&userId=... で遷移する想定
  const view = search.get("view"); // "pair" | null
  const targetUserId = search.get("userId") ? Number(search.get("userId")) : undefined;
  const readOnly = view === "pair";

  const { data, loading, error, save } = useRecordDetail(dateKey, { userId: targetUserId });

  const onCancel = () => navigate(-1);
  const onSave = async (v: EditFormValue) => {
    if (readOnly) throw new Error("ペアの記録は閲覧のみです");
    await save(v);
  };

  if (!dateKey) return <p>日付が不正です。</p>;
  if (loading) return <p>読み込み中...</p>;
  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!data) return <p>記録が見つかりません。</p>;

  // レコードが存在しない場合（ハリボテデータ）の表示
  const isEmptyRecord = data.date === dateKey && 
    !data.meal.breakfast && !data.meal.lunch && !data.meal.dinner &&
    !data.sleep.time && data.medicine.items.length === 0 &&
    data.period === 'none' && data.emotion === 5 &&
    data.exercise.items.length === 0 && !data.memo.content;

  return (
    <section style={{ padding: 16 }}>
      {isEmptyRecord && (
        <div
          style={{
            marginBottom: 8,
            padding: "8px 12px",
            borderRadius: 8,
            background: "#fff3cd",
            color: "#856404",
            fontSize: 13,
            border: "1px solid #ffeaa7"
          }}
        >
          📝 この日付の記録はまだありません。下記のフォームで記録を作成できます。
        </div>
      )}
      {readOnly && (
        <div
          style={{
            marginBottom: 8,
            padding: "8px 12px",
            borderRadius: 8,
            background: "#f4f6ff",
            color: "#3949ab",
            fontSize: 13,
          }}
        >
          ペアの記録は閲覧のみです
        </div>
      )}
      <EditForm initial={data} onCancel={onCancel} onSave={onSave} readOnly={readOnly} />
    </section>
  );
}
