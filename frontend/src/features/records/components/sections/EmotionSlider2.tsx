// frontend/src/features/records/components/sections/EmotionSlider2.tsx
import type { RecordView} from '../../types';

type Props = {
  value: RecordView['emotion'];                    // number
  onChange: (v: number) => void;
  disabled?: boolean;
  className?: string;
};

/**
 * 感情スライダー（横スライダー版）
 * - 1〜10 の横スライダー。グラデ＋進捗は .h-slider のCSSを流用
 */
export default function EmotionSlider({ value, onChange, disabled, className }: Props) {
  const level = value ?? 5;

  // スライダー変更
  const handleChange = (n: number) => {
    onChange(n);
  };

  // 1〜10 → 0〜100%（グラデ進捗に使う CSS変数 --val）
  const valPercent = Math.round(((level ?? 5) - 1) * 100 / 9);

  return (
    <div className="emotionSliderWrap" style={{ display: 'grid', gap: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="lbl" style={{ fontSize: 12, opacity: .85, color: 'white' }}>感情値</span>
        <span className="val" style={{
          fontSize: 12,
          color: 'white',
          padding: '2px 8px',
          borderRadius: 999,
          border: '1px solid rgba(148,163,184,.25)',
          background: 'rgba(148,163,184,.12)'
        }}>
          {level}
        </span>
      </div>

      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={level}
        onChange={(e) => handleChange(Number(e.target.value))}
        disabled={disabled}
        className={className ?? "h-slider"}
        style={{ ['--val' as any]: `${valPercent}%` }}
        aria-label="感情量（1〜10）"
        
      />

      <div className="ticks" style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 11,
        opacity: .7
      }}>
      </div>
    </div>
  );
}