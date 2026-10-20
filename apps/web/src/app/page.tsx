import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <h1>Welcome to Playground</h1>
          <p>
            Your personal project monorepo with a Next.js frontend and a NestJS
            backend. Start building in{" "}
            <code className={styles.code}>apps/web</code> and{" "}
            <code className={styles.code}>apps/api</code>.
          </p>
        </div>
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="/api"
          >
            Open NestJS API
          </a>
          <a
            className={styles.secondary}
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js docs
          </a>
        </div>
      </main>
    </div>
  );
}
