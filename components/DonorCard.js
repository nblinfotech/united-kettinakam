import styles from './DonorCard.module.css';
import { Phone } from 'lucide-react';

export default function DonorCard({ donor, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>

      <div className={styles.badge}>
        {donor.bloodGroup}
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{donor.name}</div>

        <div className={styles.meta}>
          Age {donor.age} · {donor.gender} · {donor.location}
        </div>
      </div>

      <div className={styles.actions}>

        {/* Call Button */}
        <a
          href={`tel:${donor.phone}`}
          className={styles.callBtn}
          onClick={(e) => e.stopPropagation()}
        >
          <Phone size={18} />
        </a>

        {/* Availability Status */}
        <div
          className={`${styles.status} ${donor.available ? styles.yes : styles.no
            }`}
        >
          {donor.available ? 'Available' : 'Unavailable'}
        </div>

      </div>
    </div>
  );
}