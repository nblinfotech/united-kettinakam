import { useEffect } from 'react';
import styles from './DonorModal.module.css';

export default function DonorModal({ donor, onClose }) {
  useEffect(() => {
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', esc);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const rows = [
    ['Blood Group', donor.bloodGroup, true],
    ['Location', donor.location],
    ['Contact', donor.phone],
    ['Last Donation', donor.lastDonation || 'First Time'],
    ['Status', donor.available ? '✓ Available to Donate' : '⏸ Currently Unavailable', false, donor.available],
  ];

  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <button className={styles.close} onClick={onClose}>×</button>
        <div className={styles.bigBadge}>{donor.bloodGroup}</div>
        <div className={styles.name}>{donor.name}</div>
        <div className={styles.sub}>{donor.gender} · {donor.age} years old · {donor.location}</div>
        <div className={styles.rows}>
          {rows.map(([label, value, isBlood, avail]) => (
            <div key={label} className={styles.row}>
              <span className={styles.rowLabel}>{label}</span>
              <span className={styles.rowValue} style={{
                color: isBlood ? '#FF4444' : avail !== undefined ? (avail ? '#44CC66' : '#888') : 'var(--white)',
                fontWeight: isBlood ? 700 : 500,
              }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
