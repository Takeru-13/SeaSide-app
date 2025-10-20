// frontend/src/shared/ui/Toast.tsx
import { useEffect } from 'react';
import styles from './Toast.module.css';

type ToastType = 'error' | 'success' | 'info';

type Props = {
  message: string | null | unknown;
  type?: ToastType;
  onClose: () => void;
  duration?: number;
};

/**
 * 控えめなトースト通知 + エラーメッセージ自動変換機能
 */
export default function Toast({ message, type = 'error', onClose, duration = 4000 }: Props) {
  // メッセージを日本語に変換
  const formattedMessage = formatErrorMessage(message);

  useEffect(() => {
    if (!formattedMessage) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [formattedMessage, duration, onClose]);

  if (!formattedMessage) return null;

  return (
    <div 
      className={`${styles.toast} ${styles[type]}`}
      role="alert"
      aria-live="assertive"
    >
      <div className={styles.content}>
        <span className={styles.icon}>
          {type === 'error' && '⚠️'}
          {type === 'success' && '✓'}
          {type === 'info' && 'ℹ️'}
        </span>
        <span className={styles.message}>{formattedMessage}</span>
      </div>
      <button 
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="閉じる"
        type="button"
      >
        ×
      </button>
    </div>
  );
}

/**
 * エラーメッセージをユーザーフレンドリーに変換
 * Error オブジェクトの message から statusCode と JSON を抽出
 */
function formatErrorMessage(error: unknown): string | null {
  if (!error) return null;

  // 文字列の場合
  if (typeof error === 'string') {
    return parseErrorString(error);
  }

  // Error オブジェクトの場合
  if (error instanceof Error) {
    return parseErrorString(error.message);
  }

  // オブジェクトの場合（念のため）
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    if (err.message && typeof err.message === 'string') {
      return parseErrorString(err.message);
    }
  }

  return '予期しないエラーが発生しました';
}

/**
 * エラー文字列をパースして適切なメッセージを返す
 * "401 {...}" 形式の文字列を処理
 */
function parseErrorString(errorStr: string): string {
  // "401 {...}" のようなパターンをパース
  const match = errorStr.match(/^(\d{3})\s+(.+)$/);
  
  if (match) {
    const statusCode = parseInt(match[1], 10);
    const jsonPart = match[2];
    
    try {
      // JSON部分をパース
      const errorData = JSON.parse(jsonPart);
      
      // バリデーションエラー（400 + message配列）
      if (statusCode === 400 && Array.isArray(errorData.message)) {
        return formatValidationErrors(errorData.message);
      }
      
      // ステータスコードから判断
      return getStatusCodeMessage(statusCode);
    } catch {
      // JSONパース失敗時はステータスコードから判断
      return getStatusCodeMessage(statusCode);
    }
  }
  
  // パターンマッチしない場合はそのまま返す
  return errorStr;
}

/**
 * バリデーションエラー配列を変換
 */
function formatValidationErrors(messages: string[]): string {
  const formatted = messages.map(msg => formatValidationMessage(msg));
  return formatted[0] || '入力内容に誤りがあります';
}

/**
 * 個別のバリデーションメッセージを変換
 */
function formatValidationMessage(message: string): string {
  const lowerMsg = message.toLowerCase();

  // パスワード関連
  if (lowerMsg.includes('password')) {
    if (lowerMsg.includes('longer than') || lowerMsg.includes('at least')) {
      return 'パスワードは6文字以上で入力してください';
    }
    if (lowerMsg.includes('required') || lowerMsg.includes('should not be empty')) {
      return 'パスワードを入力してください';
    }
  }

  // メールアドレス関連
  if (lowerMsg.includes('email')) {
    if (lowerMsg.includes('valid') || lowerMsg.includes('format')) {
      return '正しいメールアドレスを入力してください';
    }
    if (lowerMsg.includes('required') || lowerMsg.includes('should not be empty')) {
      return 'メールアドレスを入力してください';
    }
    if (lowerMsg.includes('already') || lowerMsg.includes('exists')) {
      return 'このメールアドレスは既に登録されています';
    }
  }

  // ユーザー名関連
  if (lowerMsg.includes('username') || lowerMsg.includes('user name')) {
    if (lowerMsg.includes('required') || lowerMsg.includes('should not be empty')) {
      return 'ユーザー名を入力してください';
    }
    if (lowerMsg.includes('already') || lowerMsg.includes('exists')) {
      return 'このユーザー名は既に使用されています';
    }
  }

  // 性別関連
  if (lowerMsg.includes('gender')) {
    return '性別を選択してください';
  }

  // 必須フィールド
  if (lowerMsg.includes('required') || lowerMsg.includes('should not be empty')) {
    return '必須項目が入力されていません';
  }

  return '入力内容を確認してください';
}

/**
 * HTTPステータスコードから日本語メッセージを取得
 */
function getStatusCodeMessage(statusCode: number): string {
  switch (statusCode) {
    case 400:
      return '入力内容に誤りがあります';
    case 401:
      return 'メールアドレスまたはパスワードが正しくありません';
    case 403:
      return 'アクセス権限がありません';
    case 404:
      return 'データが見つかりません';
    case 409:
      return 'このメールアドレスは既に登録されています';
    case 500:
      return 'サーバーエラーが発生しました。しばらくしてからお試しください';
    case 503:
      return 'サービスが一時的に利用できません';
    default:
      return 'エラーが発生しました。もう一度お試しください';
  }
}