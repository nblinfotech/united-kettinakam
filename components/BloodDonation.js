import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import DonorCard from './DonorCard';
import DonorModal from './DonorModal';
import DonorForm from './DonorForm';
import styles from './BloodDonation.module.css';

const BLOOD_GROUPS = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function BloodDonation() {
  const [donors, setDonors] = useState([]);
  const [stats, setStats] = useState({ total: 0, available: 0, groups: 0, universal: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');
  const [selected, setSelected] = useState(null);

  const fetchDonors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeGroup !== 'All') params.set('bloodGroup', activeGroup);
      if (search) params.set('search', search);
      const res = await fetch(`/api/donors?${params}`);
      const data = await res.json();
      if (data.success) setDonors(data.donors);
    } catch {
      toast.error('Failed to load donors');
    } finally {
      setLoading(false);
    }
  }, [activeGroup, search]);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/donors/stats');
      const data = await res.json();
      if (data.success) setStats(data.stats);
    } catch {}
  };

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => {
    const t = setTimeout(fetchDonors, 300);
    return () => clearTimeout(t);
  }, [fetchDonors]);

  const onRegistered = () => {
    fetchStats();
    fetchDonors();
  };

  return (
    <section id="blood" className={styles.blood}>
      <div className={styles.header}>
        <div className={styles.label}>Save Lives</div>
        <h2 className={styles.title}>Blood <span>Donation</span></h2>
        <div className={styles.divider} />
        <p className={styles.subtitle}>
          One donation can save up to three lives. Join our growing network of heroes from
          Kettinakam who have pledged to donate blood and be there when their community needs them most.
        </p>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        {[
          { num: stats.total, label: 'Total Donors' },
          { num: stats.available, label: 'Available Now' },
          { num: stats.groups, label: 'Blood Groups' },
          { num: stats.universal, label: 'Universal Types' },
        ].map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statNum}>{s.num}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.main}>
        {/* Donor List Panel */}
        <div className={styles.listPanel}>
          <div className={styles.panelTitle}>Our Donors</div>

          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by name, location or blood group…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <div className={styles.groupFilter}>
            {BLOOD_GROUPS.map(g => (
              <button
                key={g}
                className={`${styles.groupBtn} ${activeGroup === g ? styles.groupActive : ''}`}
                onClick={() => setActiveGroup(g)}
              >
                {g}
              </button>
            ))}
          </div>

          <div className={styles.donorList}>
            {loading ? (
              <div className={styles.empty}>Loading donors…</div>
            ) : donors.length === 0 ? (
              <div className={styles.empty}>No donors found. Be the first to register!</div>
            ) : (
              donors.map(d => (
                <DonorCard key={d._id} donor={d} onClick={() => setSelected(d)} />
              ))
            )}
          </div>
        </div>

        {/* Registration Form */}
        <DonorForm onSuccess={onRegistered} />
      </div>

      {selected && (
        <DonorModal donor={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
