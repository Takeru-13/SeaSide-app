import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <img
        src="/SeaSide-app-logo.png"
        alt="SeaSide"
        className={styles.logo}
      />
    </header>
  );
}
