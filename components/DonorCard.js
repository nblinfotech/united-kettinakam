import styles from './DonorCard.module.css';
import { Phone, Clock3 } from 'lucide-react';

export default function DonorCard({ donor, onClick }) {

  const getRemainingDays = () => {
    if (!donor.lastDonation) return 0;

    const last = new Date(donor.lastDonation);
    const today = new Date();

    const diffDays = Math.floor(
      (today - last) / (1000 * 60 * 60 * 24)
    );

    return Math.max(0, 90 - diffDays);
  };

  const remainingDays = getRemainingDays();
  const eligible = remainingDays === 0;

  return (
    <div className={styles.card} onClick={onClick}>

      <div className={styles.badge}>
        {donor.bloodGroup}
      </div>

      <div className={styles.info}>
        <div className={styles.name}>
          {donor.name}
        </div>

        <div className={styles.meta}>
          Age {donor.age} · {donor.gender} · {donor.location}
        </div>

        {/* Recovery / Eligibility */}
        <div className={styles.recovery}>

          {eligible ? (
            <span className={styles.eligible}>
              Eligible to Donate
            </span>
          ) : (
            <span className={styles.waiting}>
              <Clock3 size={14} />
              {remainingDays} days remaining
            </span>
          )}

        </div>
      </div>

      <div className={styles.actions}>

        {/* Call Button */}
        <a
          href={`tel:${donor.phone}`}
          className={styles.callBtn}
          onClick={(e) => e.stopPropagation()}
        >
          <Phone size={16} />
        </a>

        {/* Availability */}
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