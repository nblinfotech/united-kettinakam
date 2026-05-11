import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import NikahMomento from '../components/NikahMomento';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const EVENT_COLORS = ['gold', 'red', 'green'];
const EVENT_TYPES = ['upcoming', 'past'];

const c = {
  page: { minHeight: '100vh', background: '#0D0D0D', color: '#FAFAFA', fontFamily: "'Poppins', sans-serif" },
  sidebar: { width: 240, background: '#111', borderRight: '1px solid rgba(245,200,0,0.15)', minHeight: '100vh', position: 'fixed', top: 0, left: 0, display: 'flex', flexDirection: 'column', zIndex: 200 },
  main: { marginLeft: 240, padding: '0 0 60px' },
  topbar: { background: '#111', borderBottom: '2px solid #F5C800', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 },
  content: { padding: '32px' },
  sideHeader: { padding: '24px 20px 16px', borderBottom: '1px solid rgba(245,200,0,0.1)' },
  sideLogoText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: 2, color: '#F5C800', display: 'block' },
  sideTagline: { fontSize: '0.55rem', letterSpacing: 4, color: '#666', textTransform: 'uppercase', display: 'block', marginTop: 2 },
  sideNav: { flex: 1, padding: '16px 0' },
  sideSection: { padding: '8px 20px 4px', fontSize: '0.62rem', letterSpacing: 4, color: '#444', textTransform: 'uppercase' },
  sideFooter: { padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.72rem', color: '#444' },
  pageTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: 3, color: '#F5C800' },
  label: { display: 'block', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase', color: '#888', marginBottom: 6 },
  card: { background: '#1A1A1A', border: '1px solid rgba(245,200,0,0.12)', borderRadius: 4, padding: 24, marginBottom: 16 },
  statCard: { background: '#1A1A1A', border: '1px solid rgba(245,200,0,0.12)', borderRadius: 4, padding: 24, textAlign: 'center', flex: 1, minWidth: 140 },
  statNum: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.4rem', color: '#F5C800', lineHeight: 1 },
  statLabel: { fontSize: '0.7rem', letterSpacing: 2, color: '#666', textTransform: 'uppercase', marginTop: 6 },
  input: { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FAFAFA', padding: '11px 14px', borderRadius: 2, fontFamily: "'Poppins', sans-serif", fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', background: '#222', border: '1px solid rgba(255,255,255,0.1)', color: '#FAFAFA', padding: '11px 14px', borderRadius: 2, fontFamily: "'Poppins', sans-serif", fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', appearance: 'none' },
  textarea: { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FAFAFA', padding: '11px 14px', borderRadius: 2, fontFamily: "'Poppins', sans-serif", fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: 80 },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 0 },
  row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 0 },
  formGroup: { marginBottom: 14 },
  btnGold: { background: '#F5C800', color: '#111', border: 'none', padding: '10px 22px', borderRadius: 2, fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.95rem', letterSpacing: 2, cursor: 'pointer' },
  btnRed: { background: '#CC2200', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 2, fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.95rem', letterSpacing: 2, cursor: 'pointer' },
  btnGreen: { background: '#1A8C3A', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 2, fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.95rem', letterSpacing: 2, cursor: 'pointer' },
  btnGhost: { background: 'transparent', color: '#888', border: '1px solid rgba(255,255,255,0.12)', padding: '8px 18px', borderRadius: 2, fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' },
  btnSmRed: { background: '#CC2200', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: 2, fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 },
  btnSmGold: { background: '#F5C800', color: '#111', border: 'none', padding: '5px 12px', borderRadius: 2, fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 },
  btnSmGreen: { background: '#1A8C3A', color: '#fff', border: 'none', padding: '5px 12px', borderRadius: 2, fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 },
  btnSmGray: { background: '#333', color: '#aaa', border: 'none', padding: '5px 12px', borderRadius: 2, fontSize: '0.75rem', cursor: 'pointer', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase', color: '#555', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'left', whiteSpace: 'nowrap' },
  td: { padding: '11px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.85rem', color: '#ccc', verticalAlign: 'middle' },
  badgeGreen: { background: 'rgba(26,140,58,0.25)', color: '#44CC66', padding: '3px 10px', borderRadius: 2, fontSize: '0.7rem', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: 1, display: 'inline-block' },
  badgeRed: { background: 'rgba(204,34,0,0.25)', color: '#FF6644', padding: '3px 10px', borderRadius: 2, fontSize: '0.7rem', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: 1, display: 'inline-block' },
  badgeGold: { background: 'rgba(245,200,0,0.15)', color: '#F5C800', padding: '3px 10px', borderRadius: 2, fontSize: '0.7rem', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: 1, display: 'inline-block' },
  badgeGray: { background: 'rgba(255,255,255,0.06)', color: '#888', padding: '3px 10px', borderRadius: 2, fontSize: '0.7rem', fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, letterSpacing: 1, display: 'inline-block' },
  bloodBadge: { background: 'linear-gradient(135deg,#CC2200,#FF4444)', color: '#fff', padding: '3px 10px', borderRadius: 12, fontSize: '0.75rem', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1, display: 'inline-block', minWidth: 38, textAlign: 'center' },
  flexBetween: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' },
  modal: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modalBox: { background: '#1A1A1A', border: '1px solid rgba(245,200,0,0.2)', borderRadius: 4, width: '100%', maxWidth: 600, maxHeight: '90vh', overflowY: 'auto', padding: 32, position: 'relative' },
  modalTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: 2, marginBottom: 24, color: '#F5C800' },
  modalClose: { position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', color: '#888', fontSize: '1.6rem', cursor: 'pointer', lineHeight: 1 },
};

function navBtnStyle(active) {
  return {
    width: '100%', textAlign: 'left',
    background: active ? 'rgba(245,200,0,0.08)' : 'transparent',
    border: 'none', borderLeft: active ? '3px solid #F5C800' : '3px solid transparent',
    color: active ? '#F5C800' : '#888', padding: '11px 20px',
    fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '0.95rem',
    letterSpacing: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
  };
}

function toastStyle(type) {
  return {
    position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
    background: type === 'success' ? '#1A8C3A' : type === 'error' ? '#CC2200' : '#F5C800',
    color: type === 'gold' ? '#111' : '#fff',
    padding: '13px 24px', borderRadius: 4, fontSize: '0.9rem',
    fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: 1,
    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
  };
}

function Toast({ msg, type, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  return <div style={toastStyle(type)}>{msg}</div>;
}

function LoginScreen({ onLogin }) {
  const [key, setKey] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const attempt = async () => {
    setLoading(true); setErr('');
    const res = await fetch('/api/donors/pending', { headers: { 'x-admin-key': key } });
    const data = await res.json();
    setLoading(false);
    if (data.success) onLogin(key);
    else setErr('Invalid admin key. Please try again.');
  };
  return (
    <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif" }}>
      <div style={{ textAlign: 'center', width: 380, padding: 20 }}>
        <Image src="/logo.png" alt="UK" width={90} height={90} style={{ borderRadius: '50%', marginBottom: 24, boxShadow: '0 0 40px rgba(245,200,0,0.3)' }} />
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: 4, color: '#F5C800', marginBottom: 4 }}>Admin Panel</div>
        <div style={{ color: '#555', fontSize: '0.75rem', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 36 }}>United Kettinakam</div>
        <input style={{ ...c.input, marginBottom: 10, textAlign: 'center', letterSpacing: 4, fontSize: '1rem' }}
          type="password" placeholder="Enter admin key" value={key}
          onChange={e => setKey(e.target.value)} onKeyDown={e => e.key === 'Enter' && attempt()} autoFocus />
        {err && <div style={{ color: '#FF4444', fontSize: '0.8rem', marginBottom: 10 }}>{err}</div>}
        <button style={{ ...c.btnGold, width: '100%', padding: 14, fontSize: '1.05rem' }} onClick={attempt} disabled={loading}>
          {loading ? 'Verifying…' : 'LOGIN'}
        </button>
        <div style={{ marginTop: 20, fontSize: '0.7rem', color: '#333' }}>Access restricted to authorized personnel only.</div>
      </div>
    </div>
  );
}

function Overview({ adminKey }) {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    groups: 0,
    pending: 0,
    events: 0,
  });

  const [bloodData, setBloodData] = useState([]);
  const [recentDonors, setRecentDonors] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/donors/stats').then(r => r.json()),
      fetch('/api/donors/pending', {
        headers: { 'x-admin-key': adminKey },
      }).then(r => r.json()),
      fetch('/api/events').then(r => r.json()),
      fetch('/api/admin/donors', {
        headers: { 'x-admin-key': adminKey },
      }).then(r => r.json()),
    ]).then(([s, p, e, d]) => {
      const donors = d.donors || [];

      setStats({
        total: s.stats?.total || 0,
        available: s.stats?.available || 0,
        groups: s.stats?.groups || 0,
        pending: p.donors?.length || 0,
        events: e.events?.length || 0,
      });

      const grouped = BLOOD_GROUPS.map(group => ({
        name: group,
        value: donors.filter(x => x.bloodGroup === group).length,
      }));

      setBloodData(grouped);

      setRecentDonors(
        donors
          .sort(
            (a, b) =>
              new Date(b.createdAt) - new Date(a.createdAt)
          )
          .slice(0, 5)
      );
    });
  }, [adminKey]);

  const COLORS = [
    '#F5C800',
    '#FF4444',
    '#44CC66',
    '#4488FF',
    '#AA66FF',
    '#FF8844',
    '#00C2FF',
    '#FF66AA',
  ];

  const availabilityData = [
    {
      name: 'Available',
      value: stats.available,
    },
    {
      name: 'Unavailable',
      value: stats.total - stats.available,
    },
  ];

  const cards = [
    {
      num: stats.total,
      label: 'Total Donors',
      color: '#FF4444',
    },
    {
      num: stats.available,
      label: 'Available',
      color: '#44CC66',
    },
    {
      num: stats.pending,
      label: 'Pending',
      color: '#F5C800',
    },
    {
      num: stats.events,
      label: 'Events',
      color: '#4488FF',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={c.pageTitle}>Dashboard Analytics</div>
      </div>

      {/* STAT CARDS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(220px,1fr))',
          gap: 18,
          marginBottom: 28,
        }}
      >
        {cards.map(card => (
          <div
            key={card.label}
            style={{
              background:
                'linear-gradient(145deg,#1A1A1A,#111)',
              border:
                '1px solid rgba(245,200,0,0.12)',
              borderRadius: 10,
              padding: 24,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                right: -20,
                top: -20,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: `${card.color}22`,
              }}
            />

            <div
              style={{
                fontFamily: "'Bebas Neue'",
                fontSize: '3rem',
                color: card.color,
                lineHeight: 1,
              }}
            >
              {card.num}
            </div>

            <div
              style={{
                color: '#777',
                letterSpacing: 2,
                marginTop: 8,
                textTransform: 'uppercase',
                fontSize: '0.8rem',
              }}
            >
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          marginBottom: 28,
        }}
      >
        {/* BLOOD GROUP CHART */}
        <div style={c.card}>
          <div
            style={{
              marginBottom: 20,
              color: '#F5C800',
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            Blood Group Distribution
          </div>

          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={bloodData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {bloodData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[index % COLORS.length]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AVAILABILITY */}
        <div style={c.card}>
          <div
            style={{
              marginBottom: 20,
              color: '#F5C800',
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            Donor Availability
          </div>

          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={availabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#777" />
                <YAxis stroke="#777" />
                <Tooltip />
                <Legend />

                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RECENT DONORS */}
      <div style={c.card}>
        <div
          style={{
            marginBottom: 20,
            color: '#F5C800',
            fontWeight: 700,
            letterSpacing: 2,
          }}
        >
          Recent Registrations
        </div>

        <div
          style={{
            display: 'grid',
            gap: 12,
          }}
        >
          {recentDonors.map(donor => (
            <div
              key={donor._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: '#111',
                borderRadius: 6,
                border:
                  '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div>
                <div
                  style={{
                    color: '#FAFAFA',
                    fontWeight: 500,
                  }}
                >
                  {donor.name}
                </div>

                <div
                  style={{
                    color: '#666',
                    fontSize: '0.8rem',
                  }}
                >
                  {donor.location}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={c.bloodBadge}>
                  {donor.bloodGroup}
                </span>

                <span
                  style={
                    donor.available
                      ? c.badgeGreen
                      : c.badgeGray
                  }
                >
                  {donor.available
                    ? 'Available'
                    : 'Unavailable'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PendingDonors({ adminKey, showToast }) {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/donors/pending', { headers: { 'x-admin-key': adminKey } });
    const data = await res.json();
    if (data.success) setDonors(data.donors);
    setLoading(false);
  }, [adminKey]);
  useEffect(() => { load(); }, [load]);

  const verify = async (id, name) => {
    const res = await fetch(`/api/donors/${id}`, {
      method: 'PATCH',
      headers: { 'x-admin-key': adminKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: true }),
    });
    const data = await res.json();
    if (data.success) { showToast(`${name} verified and published!`, 'success'); load(); }
  };
  const remove = async (id, name) => {
    if (!confirm(`Remove registration for ${name}?`)) return;
    await fetch(`/api/donors/${id}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } });
    showToast(`${name} removed.`, 'error'); load();
  };

  return (
    <div>
      <div style={{ ...c.flexBetween, marginBottom: 24 }}>
        <div style={c.pageTitle}>Pending Approvals <span style={{ fontSize: '1rem', color: '#666' }}>({donors.length})</span></div>
        <button style={c.btnGhost} onClick={load}>↻ Refresh</button>
      </div>
      {loading ? <div style={{ color: '#555', padding: 40, textAlign: 'center' }}>Loading…</div>
        : donors.length === 0
          ? <div style={{ ...c.card, textAlign: 'center', color: '#555', padding: 60 }}>🎉 No pending registrations. All caught up!</div>
          : donors.map(d => (
            <div key={d._id} style={c.card}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <span style={c.bloodBadge}>{d.bloodGroup}</span>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#FAFAFA' }}>{d.name}</span>
                    <span style={c.badgeGray}>{d.gender}</span>
                  </div>
                  <div style={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.9 }}>
                    📍 {d.location}&nbsp;·&nbsp; 📱 {d.phone}
                    {d.email && <>&nbsp;·&nbsp; 📧 {d.email}</>}
                    {d.age && <>&nbsp;·&nbsp; Age {d.age}</>}<br />
                    Last donation: {d.lastDonation || 'First time'}
                    {d.medicalNotes && <><br />Notes: {d.medicalNotes}</>}<br />
                    <span style={{ color: '#444', fontSize: '0.75rem' }}>Registered: {new Date(d.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, flexShrink: 0, paddingTop: 4 }}>
                  <button style={c.btnSmGreen} onClick={() => verify(d._id, d.name)}>✓ Verify</button>
                  <button style={c.btnSmRed} onClick={() => remove(d._id, d.name)}>✕ Remove</button>
                </div>
              </div>
            </div>
          ))
      }
    </div>
  );
}

function EditDonorModal({ donor, adminKey, onClose, onSaved }) {
  const [form, setForm] = useState({ ...donor });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const setCheck = k => e => setForm(f => ({ ...f, [k]: e.target.checked }));
  const save = async () => {
    setLoading(true);
    const res = await fetch(`/api/donors/${donor._id}`, {
      method: 'PUT',
      headers: { 'x-admin-key': adminKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    const data = await res.json();
    if (data.success) onSaved();
  };
  return (
    <div style={c.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={c.modalBox}>
        <button style={c.modalClose} onClick={onClose}>×</button>
        <div style={c.modalTitle}>✎ Edit Donor</div>
        <div style={{ ...c.row2, marginBottom: 14 }}>
          <div style={c.formGroup}><label style={c.label}>Full Name</label><input style={c.input} value={form.name || ''} onChange={set('name')} /></div>
          <div style={c.formGroup}><label style={c.label}>Age</label><input style={c.input} type="number" value={form.age || ''} onChange={set('age')} /></div>
        </div>
        <div style={{ ...c.row2, marginBottom: 14 }}>
          <div style={c.formGroup}><label style={c.label}>Blood Group</label>
            <select style={c.select} value={form.bloodGroup || ''} onChange={set('bloodGroup')}>
              {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div style={c.formGroup}><label style={c.label}>Gender</label>
            <select style={c.select} value={form.gender || ''} onChange={set('gender')}>
              {['Male', 'Female', 'Prefer not to say'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div style={{ ...c.row2, marginBottom: 14 }}>
          <div style={c.formGroup}><label style={c.label}>Phone</label><input style={c.input} value={form.phone || ''} onChange={set('phone')} /></div>
          <div style={c.formGroup}><label style={c.label}>Email</label><input style={c.input} type="email" value={form.email || ''} onChange={set('email')} /></div>
        </div>
        <div style={{ ...c.row2, marginBottom: 14 }}>
          <div style={c.formGroup}><label style={c.label}>Location</label><input style={c.input} value={form.location || ''} onChange={set('location')} /></div>
          <div style={c.formGroup}><label style={c.label}>Last Donation Date</label><input style={c.input} type="date" value={form.lastDonation || ''} onChange={set('lastDonation')} /></div>
        </div>
        <div style={c.formGroup}><label style={c.label}>Medical Notes</label><textarea style={c.textarea} value={form.medicalNotes || ''} onChange={set('medicalNotes')} /></div>
        <div style={{ display: 'flex', gap: 28, marginBottom: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!form.available} onChange={setCheck('available')} style={{ accentColor: '#44CC66', width: 16, height: 16 }} />
            <span style={{ color: '#ccc' }}>Available to donate</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!form.verified} onChange={setCheck('verified')} style={{ accentColor: '#F5C800', width: 16, height: 16 }} />
            <span style={{ color: '#ccc' }}>Verified / Published</span>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={c.btnGold} onClick={save} disabled={loading}>{loading ? 'Saving…' : 'Save Changes'}</button>
          <button style={c.btnGhost} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const getEligibility = (lastDonation) => {
  if (!lastDonation) {
    return {
      eligible: true,
      text: 'Eligible Now',
    };
  }

  const lastDate = new Date(lastDonation);
  const nextEligible = new Date(lastDate);

  // 90 days gap
  nextEligible.setDate(nextEligible.getDate() + 90);

  const today = new Date();

  const diffTime = nextEligible - today;
  const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (remainingDays <= 0) {
    return {
      eligible: true,
      text: 'Eligible Now',
    };
  }

  return {
    eligible: false,
    text: `${remainingDays} days left`,
  };
};

function AllDonors({ adminKey, showToast }) {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editDonor, setEditDonor] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/donors', { headers: { 'x-admin-key': adminKey } });
    const data = await res.json();
    if (data.success) setDonors(data.donors);
    setLoading(false);
  }, [adminKey]);
  useEffect(() => { load(); }, [load]);

  const filtered = donors.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !q || d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q) || (d.phone && d.phone.includes(q));
    const matchGroup = filterGroup === 'All' || d.bloodGroup === filterGroup;
    const matchStatus = filterStatus === 'All'
      || (filterStatus === 'Verified' && d.verified)
      || (filterStatus === 'Pending' && !d.verified)
      || (filterStatus === 'Available' && d.available)
      || (filterStatus === 'Unavailable' && !d.available);
    return matchSearch && matchGroup && matchStatus;
  });

  const toggleField = async (d, field) => {
    const res = await fetch(`/api/donors/${d._id}`, {
      method: 'PATCH',
      headers: { 'x-admin-key': adminKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !d[field] }),
    });
    const data = await res.json();
    if (data.success) { showToast(`${d.name} updated.`, 'success'); load(); }
  };

  const remove = async (d) => {
    if (!confirm(`Permanently delete ${d.name}?`)) return;
    await fetch(`/api/donors/${d._id}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } });
    showToast(`${d.name} deleted.`, 'error'); load();
  };

  return (
    <div>
      <div style={{ ...c.flexBetween, marginBottom: 20 }}>
        <div style={c.pageTitle}>All Donors <span style={{ fontSize: '1rem', color: '#666' }}>({filtered.length} of {donors.length})</span></div>
        <button style={c.btnGhost} onClick={load}>↻ Refresh</button>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <input style={{ ...c.input, width: 260 }} placeholder="Search name, location, phone…" value={search} onChange={e => setSearch(e.target.value)} />
        <select style={{ ...c.select, width: 130 }} value={filterGroup} onChange={e => setFilterGroup(e.target.value)}>
          <option value="All">All Groups</option>
          {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
        </select>
        <select style={{ ...c.select, width: 150 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          {['All', 'Verified', 'Pending', 'Available', 'Unavailable'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      {loading ? <div style={{ color: '#555', padding: 40, textAlign: 'center' }}>Loading…</div> : (
        <div style={{ overflowX: 'auto', borderRadius: 4, border: '1px solid rgba(245,200,0,0.08)' }}>
          <table style={c.table}>
            <thead style={{ background: '#111' }}>
              <tr>{['Name', 'Blood', 'Location', 'Phone', 'Eligibility', 'Verified', 'Available', 'Actions'].map(h => <th key={h} style={c.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d._id} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={c.td}><span style={{ fontWeight: 500, color: '#FAFAFA' }}>{d.name}</span></td>
                  <td style={c.td}><span style={c.bloodBadge}>{d.bloodGroup}</span></td>
                  <td style={c.td}><span style={{ color: '#888', fontSize: '0.82rem' }}>{d.location}</span></td>
                  <td style={c.td}><span style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#666' }}>{d.phone}</span></td>
                  <td style={c.td}>
                    {(() => {
                      const eligibility = getEligibility(d.lastDonation);

                      return (
                        <span
                          style={
                            eligibility.eligible
                              ? c.badgeGreen
                              : c.badgeGold
                          }
                        >
                          {eligibility.text}
                        </span>
                      );
                    })()}
                  </td>
                  <td style={c.td}><span style={d.verified ? c.badgeGreen : c.badgeGold}>{d.verified ? 'Yes' : 'Pending'}</span></td>
                  <td style={c.td}><span style={d.available ? c.badgeGreen : c.badgeGray}>{d.available ? 'Yes' : 'No'}</span></td>
                  <td style={c.td}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <button style={c.btnSmGold} onClick={() => setEditDonor(d)} title="Edit">✎</button>
                      <button style={d.available ? c.btnSmGray : c.btnSmGreen} onClick={() => toggleField(d, 'available')} title="Toggle availability">{d.available ? '⏸' : '▶'}</button>
                      <button style={d.verified ? c.btnSmGray : c.btnSmGreen} onClick={() => toggleField(d, 'verified')} title={d.verified ? 'Unpublish' : 'Publish'}>{d.verified ? '👁' : '✓'}</button>
                      <button
                        style={c.btnSmGold}
                        onClick={() =>
                          window.open(
                            `/api/certificate/${d._id}?key=${adminKey}`,
                            '_blank'
                          )
                        }
                      >
                        🏅
                      </button>
                      <button style={c.btnSmRed} onClick={() => remove(d)} title="Delete">✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>No donors match your filters.</div>}
        </div>
      )}
      {editDonor && (
        <EditDonorModal donor={editDonor} adminKey={adminKey} onClose={() => setEditDonor(null)}
          onSaved={() => { setEditDonor(null); load(); showToast('Donor updated!', 'success'); }} />
      )}
    </div>
  );
}

function AddDonor({ adminKey, showToast }) {
  const BLANK = { name: '', age: '', bloodGroup: '', gender: 'Male', phone: '', email: '', location: '', lastDonation: '', medicalNotes: '' };
  const [form, setForm] = useState(BLANK);
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = async () => {
    if (!form.name || !form.bloodGroup || !form.phone || !form.location) {
      showToast('Name, blood group, phone and location are required.', 'error'); return;
    }
    setLoading(true);
    const res = await fetch('/api/donors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ ...form, age: form.age ? parseInt(form.age) : null }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) { showToast(`${form.name} added and published!`, 'success'); setForm(BLANK); }
    else showToast(data.message || 'Error adding donor', 'error');
  };
  return (
    <div>
      <div style={{ marginBottom: 24 }}><div style={c.pageTitle}>Add New Donor</div></div>
      <div style={c.card}>
        <div style={{ ...c.row2, marginBottom: 14 }}>
          <div style={c.formGroup}><label style={c.label}>Full Name *</label><input style={c.input} value={form.name} onChange={set('name')} placeholder="Full name" /></div>
          <div style={c.formGroup}><label style={c.label}>Age</label><input style={c.input} type="number" value={form.age} onChange={set('age')} placeholder="18 – 65" /></div>
        </div>
        <div style={{ ...c.row3, marginBottom: 14 }}>
          <div style={c.formGroup}><label style={c.label}>Blood Group *</label>
            <select style={c.select} value={form.bloodGroup} onChange={set('bloodGroup')}>
              <option value="">Select</option>
              {BLOOD_GROUPS.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div style={c.formGroup}><label style={c.label}>Gender</label>
            <select style={c.select} value={form.gender} onChange={set('gender')}>
              <option>Male</option><option>Female</option><option>Prefer not to say</option>
            </select>
          </div>
          <div style={c.formGroup}><label style={c.label}>Location *</label><input style={c.input} value={form.location} onChange={set('location')} placeholder="Area / Ward" /></div>
        </div>
        <div style={{ ...c.row2, marginBottom: 14 }}>
          <div style={c.formGroup}><label style={c.label}>Phone *</label><input style={c.input} value={form.phone} onChange={set('phone')} placeholder="+91 XXXXX XXXXX" /></div>
          <div style={c.formGroup}><label style={c.label}>Email</label><input style={c.input} type="email" value={form.email} onChange={set('email')} placeholder="Optional" /></div>
        </div>
        <div style={{ ...c.row2, marginBottom: 14 }}>
          <div style={c.formGroup}><label style={c.label}>Last Donation Date</label><input style={c.input} type="date" value={form.lastDonation} onChange={set('lastDonation')} /></div>
          <div style={c.formGroup}><label style={c.label}>Medical Notes</label><input style={c.input} value={form.medicalNotes} onChange={set('medicalNotes')} placeholder="Optional" /></div>
        </div>
        <div style={{ background: 'rgba(245,200,0,0.06)', border: '1px solid rgba(245,200,0,0.2)', borderRadius: 4, padding: '12px 16px', marginBottom: 20, fontSize: '0.82rem', color: '#F5C800' }}>
          ⚡ Admin-added donors are instantly published without needing verification.
        </div>
        <button style={{ ...c.btnGreen, padding: '13px 36px', fontSize: '1rem', letterSpacing: 2 }} onClick={submit} disabled={loading}>
          {loading ? 'Adding…' : '+ Add & Publish Donor'}
        </button>
      </div>
    </div>
  );
}

function ManageEvents({ adminKey, showToast }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const BLANK = { date: '', name: '', description: '', type: 'upcoming', color: 'gold', tag: 'Open Registration' };
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/events');
    const data = await res.json();
    if (data.success) setEvents(data.events);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const openCreate = () => { setForm(BLANK); setEditEvent(null); setShowForm(true); };
  const openEdit = ev => { setForm({ ...ev }); setEditEvent(ev); setShowForm(true); };
  const cancelForm = () => { setShowForm(false); setEditEvent(null); };

  const save = async () => {
    if (!form.date || !form.name || !form.description) { showToast('Date, name and description are required.', 'error'); return; }
    setSaving(true);
    const url = editEvent ? `/api/events/${editEvent._id}` : '/api/events';
    const method = editEvent ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey }, body: JSON.stringify(form) });
    const data = await res.json();
    setSaving(false);
    if (data.success) { showToast(editEvent ? 'Event updated!' : 'Event created!', 'success'); setShowForm(false); setEditEvent(null); load(); }
    else showToast(data.message || 'Error saving event', 'error');
  };

  const deleteEvent = async ev => {
    if (!confirm(`Delete "${ev.name}"?`)) return;
    const res = await fetch(`/api/events/${ev._id}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } });
    const data = await res.json();
    if (data.success) { showToast('Event deleted.', 'error'); load(); }
  };

  const dotColor = { red: '#CC2200', gold: '#F5C800', green: '#1A8C3A' };

  return (
    <div>
      <div style={{ ...c.flexBetween, marginBottom: 24 }}>
        <div style={c.pageTitle}>Manage Events <span style={{ fontSize: '1rem', color: '#666' }}>({events.length})</span></div>
        <button style={c.btnGold} onClick={openCreate}>+ New Event</button>
      </div>

      {showForm && (
        <div style={{ ...c.card, border: '1px solid rgba(245,200,0,0.3)', marginBottom: 28 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: 2, color: '#F5C800', marginBottom: 20 }}>
            {editEvent ? '✎ Edit Event' : '+ Create New Event'}
          </div>
          <div style={{ ...c.row2, marginBottom: 14 }}>
            <div style={c.formGroup}><label style={c.label}>Date Label *</label><input style={c.input} value={form.date} onChange={set('date')} placeholder="e.g. JAN 26, 2025" /></div>
            <div style={c.formGroup}><label style={c.label}>Event Name *</label><input style={c.input} value={form.name} onChange={set('name')} placeholder="Event name" /></div>
          </div>
          <div style={c.formGroup}><label style={c.label}>Description *</label><textarea style={c.textarea} value={form.description} onChange={set('description')} placeholder="Brief description of the event…" /></div>
          <div style={{ ...c.row3, marginBottom: 14 }}>
            <div style={c.formGroup}><label style={c.label}>Type</label>
              <select style={c.select} value={form.type} onChange={set('type')}>
                {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={c.formGroup}><label style={c.label}>Color Theme</label>
              <select style={c.select} value={form.color} onChange={set('color')}>
                {EVENT_COLORS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div style={c.formGroup}><label style={c.label}>Tag / Badge</label><input style={c.input} value={form.tag} onChange={set('tag')} placeholder="e.g. Open Registration" /></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <button style={c.btnGold} onClick={save} disabled={saving}>{saving ? 'Saving…' : editEvent ? 'Update Event' : 'Create Event'}</button>
            <button style={c.btnGhost} onClick={cancelForm}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={{ color: '#555', padding: 40, textAlign: 'center' }}>Loading…</div> : (
        <div style={{ overflowX: 'auto', borderRadius: 4, border: '1px solid rgba(245,200,0,0.08)' }}>
          <table style={c.table}>
            <thead style={{ background: '#111' }}>
              <tr>{['Date', 'Event Name', 'Type', 'Color', 'Tag', 'Actions'].map(h => <th key={h} style={c.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {events.map(ev => (
                <tr key={ev._id} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ ...c.td, fontFamily: 'monospace', fontSize: '0.78rem', color: '#F5C800', whiteSpace: 'nowrap' }}>{ev.date}</td>
                  <td style={{ ...c.td, maxWidth: 260 }}><span style={{ fontWeight: 500, color: '#FAFAFA' }}>{ev.name}</span></td>
                  <td style={c.td}><span style={ev.type === 'upcoming' ? c.badgeGreen : c.badgeGray}>{ev.type}</span></td>
                  <td style={c.td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor[ev.color] || '#888', display: 'inline-block', flexShrink: 0 }} />
                      <span style={{ color: '#888', fontSize: '0.82rem' }}>{ev.color}</span>
                    </span>
                  </td>
                  <td style={c.td}><span style={c.badgeGold}>{ev.tag}</span></td>
                  <td style={c.td}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button style={c.btnSmGold} onClick={() => openEdit(ev)}>✎ Edit</button>
                      <button style={c.btnSmRed} onClick={() => deleteEvent(ev)}>✕ Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {events.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>No events yet. Create your first one!</div>}
        </div>
      )}
    </div>
  );
}

const NAV = [
  { group: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: '⊞' }] },
  { group: 'Donors', items: [{ id: 'pending', label: 'Pending Approval', icon: '🕐' }, { id: 'all-donors', label: 'All Donors', icon: '🩸' }, { id: 'add-donor', label: 'Add Donor', icon: '＋' }] },
  { group: 'Events', items: [{ id: 'events', label: 'Manage Events', icon: '📅' }] },
  { group: 'Designs', items: [{ id: 'nikah', label: 'Nikah Momento (coming soon)', icon: '💍' }] }
];

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => setToast({ msg, type });

  if (!adminKey) return <LoginScreen onLogin={setAdminKey} />;

  const renderTab = () => {
    const props = { adminKey, showToast };
    switch (tab) {
      case 'dashboard': return <Overview {...props} />;
      case 'pending': return <PendingDonors {...props} />;
      case 'all-donors': return <AllDonors {...props} />;
      case 'add-donor': return <AddDonor {...props} />;
      case 'events': return <ManageEvents {...props} />;
      // case 'nikah':
      //   return <NikahMomento />;
      case 'nikah':
        return "Coming Soon! We're working on a special feature to create personalized Nikah momentos for donors and their loved ones. Stay tuned for updates!";
      default: return <Overview {...props} />;
    }
  };

  const currentLabel = NAV.flatMap(g => g.items).find(i => i.id === tab)?.label || 'Dashboard';

  return (
    <>
      <Head>
        <title>Admin – United Kettinakam</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@600;700&family=Poppins:wght@300;400;500&display=swap" rel="stylesheet" />
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0;}
          body{background:#0D0D0D;}
          ::-webkit-scrollbar{width:5px;height:5px;}
          ::-webkit-scrollbar-track{background:#111;}
          ::-webkit-scrollbar-thumb{background:#F5C800;border-radius:3px;}
          input::placeholder{color:#444!important;}
        `}</style>
      </Head>
      <div style={c.page}>
        <aside style={c.sidebar}>
          <div style={c.sideHeader}>
            <Image src="/logo.png" alt="UK" width={44} height={44} style={{ borderRadius: '50%', marginBottom: 10 }} />
            <span style={c.sideLogoText}>UK Admin</span>
            <span style={c.sideTagline}>United Kettinakam</span>
          </div>
          <nav style={c.sideNav}>
            {NAV.map(group => (
              <div key={group.group}>
                <div style={c.sideSection}>{group.group}</div>
                {group.items.map(item => (
                  <button key={item.id} style={navBtnStyle(tab === item.id)} onClick={() => setTab(item.id)}>
                    <span style={{ fontSize: '1rem' }}>{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div style={c.sideFooter}>
            <div style={{ marginBottom: 10, color: '#555', fontSize: '0.72rem' }}>Logged in as Admin</div>
            <button style={{ background: 'none', border: '1px solid #333', color: '#555', padding: '6px 14px', borderRadius: 2, cursor: 'pointer', fontSize: '0.78rem', fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1 }}
              onClick={() => { if (confirm('Log out?')) setAdminKey(''); }}>LOG OUT</button>
          </div>
        </aside>
        <div style={c.main}>
          <div style={c.topbar}>
            <div style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '0.9rem', letterSpacing: 2, color: '#888', textTransform: 'uppercase' }}>{currentLabel}</div>
            <a href="/" target="_blank" rel="noreferrer" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.8rem', letterSpacing: 2, color: '#555', textDecoration: 'none', textTransform: 'uppercase' }}>↗ View Site</a>
          </div>
          <div style={c.content}>{renderTab()}</div>
        </div>
        {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      </div>
    </>
  );
}