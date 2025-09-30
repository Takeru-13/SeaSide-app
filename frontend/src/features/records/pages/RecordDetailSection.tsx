import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import EditForm from "./EditForm";
import { useRecordDetail } from "../hooks/useRecordDetail";
import type { EditFormValue } from '../../types';

export default function RecordDetailSection() {
  const { dateKey = "" } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const view = search.get("view");
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
  if (error) return <p className="banner banner--error">{error}</p>;
  if (!data) return <p>記録が見つかりません。</p>;

  return (
    <section className="detail-wrap">
      {readOnly && <div className="banner banner--info">ペアの記録を表示中（編集不可）</div>}
      <EditForm initial={data} onCancel={onCancel} onSave={onSave} readOnly={readOnly} />
    </section>
  );
}
