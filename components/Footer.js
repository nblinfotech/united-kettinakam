import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  const scrollTo = (id) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <Image src="/logo.png" alt="UK Logo" width={70} height={70} className={styles.logo} />
          <p>United Kettinakam — a community built on love, sport, and soul. Together we rise, together we serve.</p>
        </div>
        <div>
          <div className={styles.title}>Quick Links</div>
          <ul className={styles.links}>
            {[['#home', 'Home'], ['#about', 'About Us'], ['#events', 'Events'], ['#blood', 'Blood Donation']].map(([href, label]) => (
              <li key={href}><button onClick={() => scrollTo(href)}>{label}</button></li>
            ))}
          </ul>
        </div>
        <div>
          <div className={styles.title}>Contact</div>
          <ul className={styles.links}>
            <li><span>📍 Kettinakam, India</span></li>
            <li><a href="mailto:info@unitedkettinakam.com">📧 info@unitedkettinakam.com</a></li>
            <li><a href="https://www.instagram.com/united_kettinakam?igsh=MXJxYTk1OXdiNG93OQ==">📱 Instagram</a></li>
            <li><a href="https://www.facebook.com/share/1AzWWtgjEY/">📘 Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} United Kettinakam. All rights reserved.</p>
        <div className={styles.soul}>United By Soul</div>
      </div>
    </footer>
  );
}
