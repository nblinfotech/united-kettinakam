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

      <div className={styles.left}>

        <div className={styles.top}>

          <div className={styles.badge}>
            {donor.bloodGroup}
          </div>

          <div className={styles.name}>
            {donor.name}
          </div>

        </div>

        <div className={styles.meta}>
          {donor.age} Years • {donor.gender} • {donor.location}
        </div>

        <div className={styles.bottom}>

          {eligible ? (
            <div className={styles.eligible}>
              Eligible to Donate
            </div>
          ) : (
            <div className={styles.waiting}>
              <Clock3 size={13} />
              {remainingDays} days remaining
            </div>
          )}

        </div>

      </div>

      <a
        href={`tel:${donor.phone}`}
        className={styles.callBtn}
        onClick={(e) => e.stopPropagation()}
      >
        <Phone size={18} />
      </a>

    </div>
  );
}