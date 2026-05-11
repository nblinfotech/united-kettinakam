import Image from 'next/image';
import styles from './About.module.css';

const values = ['Unity', 'Integrity', 'Community', 'Passion', 'Service', 'Soul'];

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.grid}>
        <div className={styles.imgSide}>
          <div className={styles.imgFrame}>
            <Image src="/logo.png" alt="United Kettinakam" width={360} height={360} className={styles.img} />
            <div className={styles.badge}>EST. 2013<br />Kettinakam</div>
          </div>
        </div>
        <div className={styles.text}>
          <div className={styles.label}>Who We Are</div>
          <h2 className={styles.title}>About <span>United Kettinakam</span></h2>
          <div className={styles.divider} />
          <p>United Kettinakam is a vibrant sports and community club born from the heart of Kettinakam. Built on the belief that sport transcends boundaries, we bring people together through shared passion, teamwork, and an undying community spirit.</p>
          <p>From local tournaments to village-wide celebrations, we strive to uplift every soul in our community. Our motto, <strong>"United By Soul"</strong>, isn't just a tagline — it's the reason we exist. Every event, every game, every initiative carries that spirit forward.</p>
          <p>Beyond sports, we actively serve our community — organizing blood donation camps, health awareness drives, and youth development programs that make Kettinakam a stronger, healthier place to live.</p>
          <div className={styles.values}>
            {values.map(v => (
              <span key={v} className={styles.tag}>{v}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
