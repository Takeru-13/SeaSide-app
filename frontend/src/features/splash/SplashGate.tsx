import { useEffect, useMemo, useState } from "react";
import "./splash.css";
type Props = { children: React.ReactNode; minMs?: number; oncePerSession?: boolean };

/**
 * アプリ起動時にロゴを全画面表示→フェードアウトするGate。
 * - minMs: 最低表示時間（ms）
 * - oncePerSession: セッション内で1回だけ表示（true推奨）
 */
export default function SplashGate({ children, minMs = 900, oncePerSession = true }: Props) {
  const [visible, setVisible] = useState(() => {
    if (!oncePerSession) return true;
    return !sessionStorage.getItem("seaside_splash_seen");
  });

  const reduced = useMemo(
    () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    []
  );

  useEffect(() => {
    if (!visible) return;

    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const whenDocReady = new Promise<void>((r) => {
      if (document.readyState === "complete") r();
      else window.addEventListener("load", () => r(), { once: true });
    });

    const run = async () => {
      // 低速端末や低速回線でも最低時間は見せつつ、load完了も待つ
      await Promise.all([wait(reduced ? 300 : minMs), whenDocReady]);
      if (oncePerSession) sessionStorage.setItem("seaside_splash_seen", "1");
      // フェードアウト用に class を切替 → CSS transition 後に非表示
      const el = document.querySelector(".ss-splash");
      el?.classList.add("hide");
      // transition終了後にvisible=false
      const onEnd = () => {
        setVisible(false);
        el?.removeEventListener("transitionend", onEnd);
      };
      el?.addEventListener("transitionend", onEnd);
      // 念のため保険
      setTimeout(() => setVisible(false), 1200);
    };

    run();
  }, [visible, oncePerSession, reduced, minMs]);

  return (
    <>
      {visible && (
        <div className="ss-splash" aria-hidden>
          <div className="ss-splash__inner">

          <img
            src="/SeaSide-app-logo.svg"
            alt="SeaSide"
            className="ss-splash__logo"
            decoding="async"
          />
          <p className="ss-splash__brand" aria-label="SeaSide">SeaSide</p>
          </div>
        </div>
      )}
      {children}
    </>
  );
}
