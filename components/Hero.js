import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './Hero.module.css';

function useCountUp(target, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setCount(start);
      if (start >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export default function Hero({ donorCount = 0 }) {
  const members = useCountUp(200);
  const donors = useCountUp(donorCount || 8);
  const events = useCountUp(12);

  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className={styles.hero}>
      <div className={styles.bgText}>UK</div>
      <div className={styles.content}>
        <div className={styles.logoWrap}>
          <Image
            src="/logo.png"
            alt="United Kettinakam"
            width={200}
            height={200}
            className={styles.logo}
            priority
          />
        </div>
        <h1 className={styles.title}>
          United <span className={styles.highlight}>Kettinakam</span>
        </h1>
        <p className={styles.tagline}>United By Soul</p>
        <div className={styles.ctas}>
          <button onClick={() => scrollTo('#about')} className={`${styles.btn} ${styles.btnGold}`}>
            Discover Our Club
          </button>
          <button onClick={() => scrollTo('#blood')} className={`${styles.btn} ${styles.btnRed}`}>
            🩸 Donate Blood
          </button>
          <button onClick={() => scrollTo('#events')} className={`${styles.btn} ${styles.btnOutline}`}>
            View Events
          </button>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.statNum}>{members}+</div>
            <div className={styles.statLabel}>Members</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>{donors}</div>
            <div className={styles.statLabel}>Blood Donors</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>{events}</div>
            <div className={styles.statLabel}>Events Hosted</div>
          </div>
        </div>
      </div>
    </section>
  );
}
