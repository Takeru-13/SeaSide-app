// Header.tsx
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  const { pathname } = useLocation();
  const disable = pathname === "/login" || pathname === "/register";

  const Img = (
    <img
      src="/bd1372b8-9dd8-4c4e-95d2-0a5f44992c9f.png"
      alt="SeaSide"
      className={styles.logo}
    />
  );

  return (
    <header className={styles.header}>
      {disable ? (
        <span aria-disabled="true" className={styles.logoDisabled}>
          {Img}
        </span>
      ) : (
        <Link to="/home" className={styles.logoLink} aria-label="SeaSide Home">
          {Img}
        </Link>
      )}
    </header>
  );
}