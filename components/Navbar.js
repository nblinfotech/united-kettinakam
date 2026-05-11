import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About Us' },
    { href: '#events', label: 'Events' },
    { href: '#blood', label: '🩸 Blood Donation', blood: true },
  ];

  const handleNav = (href) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}>
        <Image src="/logo.png" alt="UK Logo" width={48} height={48} className={styles.logoImg} />
        <div>
          <span className={styles.logoName}>United Kettinakam</span>
          <small className={styles.logoTagline}>United By Soul</small>
        </div>
      </div>

      <ul className={`${styles.links} ${open ? styles.open : ''}`}>
        {links.map(l => (
          <li key={l.href}>
            <button
              className={`${styles.link} ${l.blood ? styles.blood : ''}`}
              onClick={() => handleNav(l.href)}
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>

      <button className={styles.toggle} onClick={() => setOpen(o => !o)} aria-label="Menu">
        <span className={open ? styles.bar1open : styles.bar1} />
        <span className={open ? styles.bar2open : styles.bar2} />
        <span className={open ? styles.bar3open : styles.bar3} />
      </button>
    </nav>
  );
}
