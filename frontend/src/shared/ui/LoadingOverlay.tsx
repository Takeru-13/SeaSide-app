// frontend/src/shared/ui/LoadingOverlay.tsx
import styles from './LoadingOverlay.module.css';

type Props = {
  /** 表示するかどうか */
  isLoading: boolean;
  /** カスタムメッセージ（デフォルト: "Now Loading..."） */
  message?: string;
  /** 全画面表示か、親要素内に収めるか */
  fullScreen?: boolean;
};

/**
 * 汎用ローディングオーバーレイ
 * - 半透明背景 + ぐるぐるスピナー + メッセージ
 * - 画面遷移、モーダル、詳細表示など、どこでも使える
 */
export default function LoadingOverlay({ 
  isLoading, 
  message = 'Now Loading...', 
  fullScreen = true 
}: Props) {
  if (!isLoading) return null;

  return (
    <div 
      className={`${styles.overlay} ${fullScreen ? styles.fullScreen : styles.absolute}`}
      role="status"
      aria-live="polite"
      aria-label="読み込み中"
    >
      <div className={styles.content}>
        {/* ぐるぐるスピナー */}
        <div className={styles.spinner} aria-hidden="true">
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>
        
        {/* メッセージ */}
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
}