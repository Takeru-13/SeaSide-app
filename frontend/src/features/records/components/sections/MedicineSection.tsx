// frontend/src/features/records/components/sections/MedicineSection.tsx
import styles from './MedicineSection.module.css';

type Props = {
  // 呼び出し元互換のため型としては受ける（使わないなら optional でOK）
  value?: { items?: string[] };
  onChange?: (patch?: { items?: string[] }) => void;

  disabled?: boolean;
  tookDailyMed?: boolean;
  onToggleDailyMed?: (next: boolean) => void;
};

export default function MedicineSection(props: Props) {
  // 使うものだけ取り出す（value/onChange は取り出さない＝未使用警告を回避）
  const { disabled, tookDailyMed, onToggleDailyMed } = props;

  return (
    <div className={styles.box}>
      {/* 常備薬チェック */}
      <label className={styles.dailyMedRow}>
        <input
          type="checkbox"
          disabled={disabled}
          checked={!!tookDailyMed}
          onChange={(e) => onToggleDailyMed?.(e.target.checked)}
        />
        毎日飲む薬を今日飲んだ（💊）
      </label>
    </div>
  );
}
