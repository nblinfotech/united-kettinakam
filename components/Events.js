import { useEffect, useState } from 'react';
import styles from './Events.module.css';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/events')
      .then(r => r.json())
      .then(d => { if (d.success) setEvents(d.events); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="events" className={styles.events}>
      <div className={styles.header}>
        <div className={styles.label}>What's Happening</div>
        <h2 className={styles.title}>Club <span>Events</span></h2>
        <div className={styles.divider} />
      </div>

      {loading ? (
        <div className={styles.loading}>Loading events…</div>
      ) : (
        <div className={styles.grid}>
          {events.map((ev, i) => (
            <div key={ev._id || i} className={styles.card}>
              <div className={`${styles.cardTop} ${styles[ev.color]}`} />
              <div className={styles.cardBody}>
                <div className={styles.date}>{ev.date}</div>
                <div className={styles.name}>{ev.name}</div>
                <div className={styles.desc}>{ev.description}</div>
                <div className={styles.meta}>
                  <span className={`${styles.badge} ${ev.type === 'upcoming' ? styles.upcoming : styles.past}`}>
                    {ev.type === 'upcoming' ? '⚡ Upcoming' : '✓ Past'}
                  </span>
                  <span className={styles.tagBadge}>{ev.tag}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
