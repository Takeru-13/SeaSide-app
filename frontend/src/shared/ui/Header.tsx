import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  const { pathname } = useLocation();
  const disable = pathname === "/login" || pathname === "/register";

  const Img = (
    <img src="/SeaSide-app-logo.svg" alt="SEA SIDE" className={styles.logo} />
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
