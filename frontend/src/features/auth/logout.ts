import { tokenStorage } from '../../shared/api/http';

export function logout() {
  // localStorageからトークンを削除
  tokenStorage.clear();

  // ログインページにリダイレクト
  window.location.href = '/login';
}
