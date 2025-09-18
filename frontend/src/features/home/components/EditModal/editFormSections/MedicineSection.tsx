import type { MedicineRecord, SectionProps } from "../types";

export default function MedicineSection({ value, onChange }: SectionProps<MedicineRecord>) {
  // まずは1行だけの簡易入力（後で複数行/タグ化に拡張）
  return (
    <section>
      <h4>服薬</h4>
      <input
        type="text"
        placeholder="飲んだ薬を入力（カンマ区切り）"
        value={value.items.join(',')}
        onChange={(e) => onChange({ items: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
      />
    </section>
  );
}