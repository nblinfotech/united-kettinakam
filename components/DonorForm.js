import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './DonorForm.module.css';

const INITIAL = {
  name: '', age: '', bloodGroup: '', gender: '',
  phone: '', email: '', location: '', lastDonation: '', medicalNotes: '',
};

export default function DonorForm({ onSuccess }) {
  const [form, setForm] = useState(INITIAL);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    if (!form.name || !form.age || !form.bloodGroup || !form.phone || !form.email || !form.location)
      return 'Please fill in all required fields.';
    if (parseInt(form.age) < 18 || parseInt(form.age) > 65)
      return 'Age must be between 18 and 65.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return 'Please enter a valid email address.';
    if (!consent)
      return 'Please accept the consent agreement.';
    return null;
  };

  const submit = async () => {
    const err = validate();
    if (err) { toast.error(err); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/donors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: parseInt(form.age) }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setForm(INITIAL);
        setConsent(false);
        onSuccess?.();
      } else {
        toast.error(data.message || 'Something went wrong.');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelTitle}>Register as Donor</div>
      <div className={styles.form}>
        <div className={styles.row2}>
          <div className={styles.group}>
            <label>Full Name *</label>
            <input value={form.name} onChange={set('name')} placeholder="Your full name" />
          </div>
          <div className={styles.group}>
            <label>Age *</label>
            <input type="number" value={form.age} onChange={set('age')} placeholder="18 – 65" min={18} max={65} />
          </div>
        </div>
        <div className={styles.row2}>
          <div className={styles.group}>
            <label>Blood Group *</label>
            <select value={form.bloodGroup} onChange={set('bloodGroup')}>
              <option value="">Select blood group</option>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div className={styles.group}>
            <label>Gender</label>
            <select value={form.gender} onChange={set('gender')}>
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Prefer not to say</option>
            </select>
          </div>
        </div>
        <div className={styles.row2}>
          <div className={styles.group}>
            <label>Mobile Number *</label>
            <input value={form.phone} onChange={set('phone')} placeholder="+91 XXXXX XXXXX" />
          </div>
          <div className={styles.group}>
            <label>Email Address *</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" />
          </div>
        </div>
        <div className={styles.group}>
          <label>Location / Area in Kettinakam *</label>
          <input value={form.location} onChange={set('location')} placeholder="Your ward, street or area" />
        </div>
        <div className={styles.group}>
          <label>Last Donation Date (if any)</label>
          <input type="date" value={form.lastDonation} onChange={set('lastDonation')} />
        </div>
        <div className={styles.group}>
          <label>Medical Conditions / Notes</label>
          <textarea value={form.medicalNotes} onChange={set('medicalNotes')} placeholder="Optional — any relevant medical info…" />
        </div>
        <div className={styles.consent}>
          <input type="checkbox" id="consent" checked={consent} onChange={e => setConsent(e.target.checked)} />
          <label htmlFor="consent">
            I confirm the information provided is accurate. I understand my details will be{' '}
            <strong>verified by the United Kettinakam team</strong> before being publicly listed.
            My email will be used solely for verification and donor coordination.
          </label>
        </div>
        <button className={styles.submitBtn} onClick={submit} disabled={loading}>
          {loading ? 'Submitting…' : '🩸 Register as Donor'}
        </button>
        <p className={styles.note}>
          ⚠ Your entry will be reviewed by our admin team. Only verified donors appear in the public list.
          We collect your email to verify identity and prevent false registrations.
        </p>
      </div>
    </div>
  );
}
