import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Image from 'next/image';
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

// ─── Responsive helpers ──────────────────────────────────────────────────────
// We inject a <style> block with media queries instead of JS breakpoint checks,
// so every element reacts fluidly to viewport changes without re-renders.

const GLOBAL_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0D0D0D; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: #111; }
  ::-webkit-scrollbar-thumb { background: #F5C800; border-radius: 3px; }
  input::placeholder { color: #444 !important; }

  /* ── Sidebar ── */
  .uk-sidebar {
    width: 240px;
    background: #111;
    border-right: 1px solid rgba(245,200,0,0.15);
    min-height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    z-index: 200;
    transition: transform 0.28s cubic-bezier(0.4,0,0.2,1);
  }
  .uk-sidebar.closed { transform: translateX(-100%); }

  /* Overlay behind sidebar on mobile */
  .uk-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 199;
  }
  .uk-overlay.visible { display: block; }

  /* ── Main ── */
  .uk-main {
    margin-left: 240px;
    padding-bottom: 60px;
    transition: margin-left 0.28s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── Topbar ── */
  .uk-topbar {
    background: #111;
    border-bottom: 2px solid #F5C800;
    padding: 0 32px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  /* Hamburger — hidden on desktop */
  .uk-hamburger {
    display: none;
    background: none;
    border: none;
    color: #F5C800;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 4px 8px;
    margin-right: 12px;
    line-height: 1;
  }

  /* ── Content ── */
  .uk-content { padding: 32px; }

  /* ── Two-column form grid ── */
  .uk-row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 0; }
  .uk-row3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 0; }

  /* ── Chart grid ── */
  .uk-chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }

  /* ── Stat cards grid ── */
  .uk-stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 18px; margin-bottom: 28px; }

  /* ── Table wrapper ── */
  .uk-table-wrap { overflow-x: auto; border-radius: 4px; border: 1px solid rgba(245,200,0,0.08); -webkit-overflow-scrolling: touch; }

  /* ── Donor card actions ── */
  .uk-donor-actions { display: flex; gap: 5px; flex-wrap: wrap; }

  /* ── Filter row ── */
  .uk-filter-row { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 20px; }

  /* ── Modal ── */
  .uk-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 5000; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .uk-modal-box { background: #1A1A1A; border: 1px solid rgba(245,200,0,0.2); border-radius: 4px; width: 100%; max-width: 600px; max-height: 90vh; overflow-y: auto; padding: 32px; position: relative; }

  /* ── Cert modal ── */
  .uk-cert-cols { display: flex; gap: 24px; align-items: flex-start; margin-bottom: 28px; }

  /* ── Pending donor card row ── */
  .uk-pending-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
  .uk-pending-actions { display: flex; gap: 10px; flex-shrink: 0; padding-top: 4px; }

  /* ══════════════════════════════════
     TABLET  (≤ 900px)
  ══════════════════════════════════ */
  @media (max-width: 900px) {
    .uk-chart-grid { grid-template-columns: 1fr; }
    .uk-row3 { grid-template-columns: 1fr 1fr; }
    .uk-topbar { padding: 0 20px; }
    .uk-content { padding: 24px 20px; }
  }

  /* ══════════════════════════════════
     MOBILE  (≤ 640px)
  ══════════════════════════════════ */
  @media (max-width: 640px) {
    /* Sidebar becomes a drawer */
    .uk-sidebar { width: 260px; }
    .uk-main { margin-left: 0; }
    .uk-hamburger { display: block; }
    .uk-topbar { padding: 0 16px; height: 56px; }
    .uk-content { padding: 16px; }

    /* Form grids collapse to single column */
    .uk-row2 { grid-template-columns: 1fr; }
    .uk-row3 { grid-template-columns: 1fr; }

    /* Chart grid single column */
    .uk-chart-grid { grid-template-columns: 1fr; }

    /* Stat grid two columns on mobile */
    .uk-stat-grid { grid-template-columns: 1fr 1fr; gap: 12px; }

    /* Filter row stacks */
    .uk-filter-row input,
    .uk-filter-row select { width: 100% !important; }

    /* Modal full screen */
    .uk-modal { padding: 0; align-items: flex-end; }
    .uk-modal-box { max-width: 100%; max-height: 95vh; border-radius: 12px 12px 0 0; padding: 24px 20px; }

    /* Cert modal cols stack */
    .uk-cert-cols { flex-direction: column; }

    /* Pending donor actions below content */
    .uk-pending-row { flex-direction: column; }
    .uk-pending-actions { padding-top: 0; width: 100%; justify-content: flex-end; }

    /* Donor action buttons bigger tap target on mobile */
    .uk-donor-actions button { padding: 8px 14px !important; font-size: 0.82rem !important; }

    /* Table minimum widths for key columns */
    .uk-table-wrap table { min-width: 700px; }

    /* Page title smaller */
    .uk-page-title { font-size: 1.4rem !important; }

    /* Section topbar label truncate */
    .uk-topbar-label { font-size: 0.78rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 160px; }
  }
`;

// ─── Style constants (layout-agnostic) ────────────────────────────────────────
const c = {
  page: { minHeight: '100vh', background: '#0D0D0D', color: '#FAFAFA', fontFamily: "'Poppins', sans-serif" },
  sideHeader: { padding: '24px 20px 16px', borderBottom: '1px solid rgba(245,200,0,0.1)' },
  sideLogoText: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: 2, color: '#F5C800', display: 'block' },
  sideTagline: { fontSize: '0.55rem', letterSpacing: 4, color: '#666', textTransform: 'uppercase', display: 'block', marginTop: 2 },
  sideNav: { flex: 1, padding: '16px 0', overflowY: 'auto' },
  sideSection: { padding: '8px 20px 4px', fontSize: '0.62rem', letterSpacing: 4, color: '#444', textTransform: 'uppercase' },
  sideFooter: { padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.72rem', color: '#444' },
  pageTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: 3, color: '#F5C800' },
  label: { display: 'block', fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '0.75rem', letterSpacing: 2, textTransform: 'uppercase', color: '#888', marginBottom: 6 },
  card: { background: '#1A1A1A', border: '1px solid rgba(245,200,0,0.12)', borderRadius: 4, padding: 24, marginBottom: 16 },
  input: { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FAFAFA', padding: '11px 14px', borderRadius: 2, fontFamily: "'Poppins', sans-serif", fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' },
  select: { width: '100%', background: '#222', border: '1px solid rgba(255,255,255,0.1)', color: '#FAFAFA', padding: '11px 14px', borderRadius: 2, fontFamily: "'Poppins', sans-serif", fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', appearance: 'none' },
  textarea: { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#FAFAFA', padding: '11px 14px', borderRadius: 2, fontFamily: "'Poppins', sans-serif", fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', resize: 'vertical', minHeight: 80 },
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
  modalTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.6rem', letterSpacing: 2, marginBottom: 24, color: '#F5C800' },
  modalClose: { position: 'absolute', top: 14, right: 18, background: 'none', border: 'none', color: '#888', fontSize: '1.6rem', cursor: 'pointer', lineHeight: 1 },
};

function navBtnStyle(active) {
  return {
    width: '100%', textAlign: 'left',
    background: active ? 'rgba(245,200,0,0.08)' : 'transparent',
    border: 'none', borderLeft: active ? '3px solid #F5C800' : '3px solid transparent',
    color: active ? '#F5C800' : '#888', padding: '12px 20px',
    fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: '0.95rem',
    letterSpacing: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
    minHeight: 44, // accessible tap target
  };
}

function toastStyle(type) {
  return {
    position: 'fixed', bottom: 28, right: 16, zIndex: 9999,
    background: type === 'success' ? '#1A8C3A' : type === 'error' ? '#CC2200' : '#F5C800',
    color: type === 'gold' ? '#111' : '#fff',
    padding: '13px 20px', borderRadius: 4, fontSize: '0.9rem',
    fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, letterSpacing: 1,
    boxShadow: '0 8px 30px rgba(0,0,0,0.4)',
    maxWidth: 'calc(100vw - 32px)',
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
    <div style={{ minHeight: '100vh', background: '#0D0D0D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Poppins', sans-serif", padding: 20 }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: 380 }}>
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
  const [stats, setStats] = useState({ total: 0, available: 0, groups: 0, pending: 0, events: 0 });
  const [bloodData, setBloodData] = useState([]);
  const [recentDonors, setRecentDonors] = useState([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/donors/stats').then(r => r.json()),
      fetch('/api/donors/pending', { headers: { 'x-admin-key': adminKey } }).then(r => r.json()),
      fetch('/api/events').then(r => r.json()),
      fetch('/api/admin/donors', { headers: { 'x-admin-key': adminKey } }).then(r => r.json()),
    ]).then(([s, p, e, d]) => {
      const donors = d.donors || [];
      setStats({ total: s.stats?.total || 0, available: s.stats?.available || 0, groups: s.stats?.groups || 0, pending: p.donors?.length || 0, events: e.events?.length || 0 });
      setBloodData(BLOOD_GROUPS.map(group => ({ name: group, value: donors.filter(x => x.bloodGroup === group).length })));
      setRecentDonors(donors.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
    });
  }, [adminKey]);

  const COLORS = ['#F5C800', '#FF4444', '#44CC66', '#4488FF', '#AA66FF', '#FF8844', '#00C2FF', '#FF66AA'];
  const availabilityData = [{ name: 'Available', value: stats.available }, { name: 'Unavailable', value: stats.total - stats.available }];
  const cards = [
    { num: stats.total, label: 'Total Donors', color: '#FF4444' },
    { num: stats.available, label: 'Available', color: '#44CC66' },
    { num: stats.pending, label: 'Pending', color: '#F5C800' },
    { num: stats.events, label: 'Events', color: '#4488FF' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div className="uk-page-title" style={c.pageTitle}>Dashboard Analytics</div>
      </div>

      <div className="uk-stat-grid">
        {cards.map(card => (
          <div key={card.label} style={{ background: 'linear-gradient(145deg,#1A1A1A,#111)', border: '1px solid rgba(245,200,0,0.12)', borderRadius: 10, padding: 24, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -20, top: -20, width: 80, height: 80, borderRadius: '50%', background: `${card.color}22` }} />
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: '3rem', color: card.color, lineHeight: 1 }}>{card.num}</div>
            <div style={{ color: '#777', letterSpacing: 2, marginTop: 8, textTransform: 'uppercase', fontSize: '0.8rem' }}>{card.label}</div>
          </div>
        ))}
      </div>

      <div className="uk-chart-grid">
        <div style={c.card}>
          <div style={{ marginBottom: 20, color: '#F5C800', fontWeight: 700, letterSpacing: 2 }}>Blood Group Distribution</div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={bloodData} dataKey="value" nameKey="name" outerRadius={100} label>
                  {bloodData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={c.card}>
          <div style={{ marginBottom: 20, color: '#F5C800', fontWeight: 700, letterSpacing: 2 }}>Donor Availability</div>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={availabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#777" />
                <YAxis stroke="#777" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={c.card}>
        <div style={{ marginBottom: 20, color: '#F5C800', fontWeight: 700, letterSpacing: 2 }}>Recent Registrations</div>
        <div style={{ display: 'grid', gap: 12 }}>
          {recentDonors.map(donor => (
            <div key={donor._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#111', borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ color: '#FAFAFA', fontWeight: 500 }}>{donor.name}</div>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>{donor.location}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <span style={c.bloodBadge}>{donor.bloodGroup}</span>
                <span style={donor.available ? c.badgeGreen : c.badgeGray}>{donor.available ? 'Available' : 'Unavailable'}</span>
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
    const res = await fetch(`/api/donors/${id}`, { method: 'PATCH', headers: { 'x-admin-key': adminKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ verified: true }) });
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
        <div className="uk-page-title" style={c.pageTitle}>Pending Approvals <span style={{ fontSize: '1rem', color: '#666' }}>({donors.length})</span></div>
        <button style={c.btnGhost} onClick={load}>↻ Refresh</button>
      </div>
      {loading
        ? <div style={{ color: '#555', padding: 40, textAlign: 'center' }}>Loading…</div>
        : donors.length === 0
          ? <div style={{ ...c.card, textAlign: 'center', color: '#555', padding: 60 }}>🎉 No pending registrations. All caught up!</div>
          : donors.map(d => (
            <div key={d._id} style={c.card}>
              <div className="uk-pending-row">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span style={c.bloodBadge}>{d.bloodGroup}</span>
                    <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#FAFAFA' }}>{d.name}</span>
                    <span style={c.badgeGray}>{d.gender}</span>
                  </div>
                  <div style={{ color: '#888', fontSize: '0.82rem', lineHeight: 1.9 }}>
                    📍 {d.location}&nbsp;·&nbsp;📱 {d.phone}
                    {d.email && <>&nbsp;·&nbsp;📧 {d.email}</>}
                    {d.age && <>&nbsp;·&nbsp;Age {d.age}</>}<br />
                    Last donation: {d.lastDonation || 'First time'}
                    {d.medicalNotes && <><br />Notes: {d.medicalNotes}</>}<br />
                    <span style={{ color: '#444', fontSize: '0.75rem' }}>Registered: {new Date(d.createdAt).toLocaleString()}</span>
                  </div>
                </div>
                <div className="uk-pending-actions">
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
    const res = await fetch(`/api/donors/${donor._id}`, { method: 'PUT', headers: { 'x-admin-key': adminKey, 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setLoading(false);
    const data = await res.json();
    if (data.success) onSaved();
  };
  return (
    <div className="uk-modal" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="uk-modal-box">
        <button style={c.modalClose} onClick={onClose}>×</button>
        <div style={c.modalTitle}>✎ Edit Donor</div>
        <div className="uk-row2" style={{ marginBottom: 14 }}>
          <div style={c.formGroup}><label style={c.label}>Full Name</label><input style={c.input} value={form.name || ''} onChange={set('name')} /></div>
          <div style={c.formGroup}><label style={c.label}>Age</label><input style={c.input} type="number" value={form.age || ''} onChange={set('age')} /></div>
        </div>
        <div className="uk-row2" style={{ marginBottom: 14 }}>
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
        <div className="uk-row2" style={{ marginBottom: 14 }}>
          <div style={c.formGroup}><label style={c.label}>Phone</label><input style={c.input} value={form.phone || ''} onChange={set('phone')} /></div>
          <div style={c.formGroup}><label style={c.label}>Email</label><input style={c.input} type="email" value={form.email || ''} onChange={set('email')} /></div>
        </div>
        <div className="uk-row2" style={{ marginBottom: 14 }}>
          <div style={c.formGroup}><label style={c.label}>Location</label><input style={c.input} value={form.location || ''} onChange={set('location')} /></div>
          <div style={c.formGroup}><label style={c.label}>Last Donation Date</label><input style={c.input} type="date" value={form.lastDonation || ''} onChange={set('lastDonation')} /></div>
        </div>
        <div style={c.formGroup}><label style={c.label}>Medical Notes</label><textarea style={c.textarea} value={form.medicalNotes || ''} onChange={set('medicalNotes')} /></div>
        <div style={{ display: 'flex', gap: 28, marginBottom: 24, flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!form.available} onChange={setCheck('available')} style={{ accentColor: '#44CC66', width: 16, height: 16 }} />
            <span style={{ color: '#ccc' }}>Available to donate</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={!!form.verified} onChange={setCheck('verified')} style={{ accentColor: '#F5C800', width: 16, height: 16 }} />
            <span style={{ color: '#ccc' }}>Verified / Published</span>
          </label>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button style={c.btnGold} onClick={save} disabled={loading}>{loading ? 'Saving…' : 'Save Changes'}</button>
          <button style={c.btnGhost} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const getEligibility = (lastDonation) => {
  if (!lastDonation) return { eligible: true, text: 'Eligible Now' };
  const nextEligible = new Date(lastDonation);
  nextEligible.setDate(nextEligible.getDate() + 90);
  const remainingDays = Math.ceil((nextEligible - new Date()) / (1000 * 60 * 60 * 24));
  if (remainingDays <= 0) return { eligible: true, text: 'Eligible Now' };
  return { eligible: false, text: `${remainingDays} days left` };
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
    const res = await fetch(`/api/donors/${d._id}`, { method: 'PATCH', headers: { 'x-admin-key': adminKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ [field]: !d[field] }) });
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
        <div className="uk-page-title" style={c.pageTitle}>All Donors <span style={{ fontSize: '1rem', color: '#666' }}>({filtered.length} of {donors.length})</span></div>
        <button style={c.btnGhost} onClick={load}>↻ Refresh</button>
      </div>
      <div className="uk-filter-row">
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
        <div className="uk-table-wrap">
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
                  <td style={c.td}>{(() => { const e = getEligibility(d.lastDonation); return <span style={e.eligible ? c.badgeGreen : c.badgeGold}>{e.text}</span>; })()}</td>
                  <td style={c.td}><span style={d.verified ? c.badgeGreen : c.badgeGold}>{d.verified ? 'Yes' : 'Pending'}</span></td>
                  <td style={c.td}><span style={d.available ? c.badgeGreen : c.badgeGray}>{d.available ? 'Yes' : 'No'}</span></td>
                  <td style={c.td}>
                    <div className="uk-donor-actions">
                      {/* Update / Edit */}
                      <button
                        style={{
                          ...c.btnSmGold,
                          padding: '6px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                        onClick={() => setEditDonor(d)}
                        title="Update Donor"
                      >
                        ✎ Update
                      </button>

                      {/* Availability Toggle */}
                      <button
                        style={d.available ? c.btnSmGray : c.btnSmGreen}
                        onClick={() => toggleField(d, 'available')}
                        title="Toggle availability"
                      >
                        {d.available ? '⏸ Pause' : '▶ Active'}
                      </button>

                      {/* Verification Toggle */}
                      <button
                        style={d.verified ? c.btnSmGray : c.btnSmGreen}
                        onClick={() => toggleField(d, 'verified')}
                        title={d.verified ? 'Unpublish' : 'Publish'}
                      >
                        {d.verified ? '👁 Published' : '✓ Publish'}
                      </button>

                      {/* Delete */}
                      <button
                        style={c.btnSmRed}
                        onClick={() => remove(d)}
                        title="Delete"
                      >
                        ✕ Delete
                      </button>
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
    if (!form.name || !form.bloodGroup || !form.phone || !form.location) { showToast('Name, blood group, phone and location are required.', 'error'); return; }
    setLoading(true);
    const res = await fetch('/api/donors', { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey }, body: JSON.stringify({ ...form, age: form.age ? parseInt(form.age) : null }) });
    const data = await res.json();
    setLoading(false);
    if (data.success) { showToast(`${form.name} added and published!`, 'success'); setForm(BLANK); }
    else showToast(data.message || 'Error adding donor', 'error');
  };
  return (
    <div>
      <div style={{ marginBottom: 24 }}><div className="uk-page-title" style={c.pageTitle}>Add New Donor</div></div>
      <div style={c.card}>
        <div className="uk-row2" style={{ marginBottom: 14 }}>
          <div style={c.formGroup}><label style={c.label}>Full Name *</label><input style={c.input} value={form.name} onChange={set('name')} placeholder="Full name" /></div>
          <div style={c.formGroup}><label style={c.label}>Age</label><input style={c.input} type="number" value={form.age} onChange={set('age')} placeholder="18 – 65" /></div>
        </div>
        <div className="uk-row3" style={{ marginBottom: 14 }}>
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
        <div className="uk-row2" style={{ marginBottom: 14 }}>
          <div style={c.formGroup}><label style={c.label}>Phone *</label><input style={c.input} value={form.phone} onChange={set('phone')} placeholder="+91 XXXXX XXXXX" /></div>
          <div style={c.formGroup}><label style={c.label}>Email</label><input style={c.input} type="email" value={form.email} onChange={set('email')} placeholder="Optional" /></div>
        </div>
        <div className="uk-row2" style={{ marginBottom: 14 }}>
          <div style={c.formGroup}><label style={c.label}>Last Donation Date</label><input style={c.input} type="date" value={form.lastDonation} onChange={set('lastDonation')} /></div>
          <div style={c.formGroup}><label style={c.label}>Medical Notes</label><input style={c.input} value={form.medicalNotes} onChange={set('medicalNotes')} placeholder="Optional" /></div>
        </div>
        <div style={{ background: 'rgba(245,200,0,0.06)', border: '1px solid rgba(245,200,0,0.2)', borderRadius: 4, padding: '12px 16px', marginBottom: 20, fontSize: '0.82rem', color: '#F5C800' }}>
          ⚡ Admin-added donors are instantly published without needing verification.
        </div>
        <button style={{ ...c.btnGreen, padding: '13px 36px', fontSize: '1rem', letterSpacing: 2, width: '100%' }} onClick={submit} disabled={loading}>
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
        <div className="uk-page-title" style={c.pageTitle}>Manage Events <span style={{ fontSize: '1rem', color: '#666' }}>({events.length})</span></div>
        <button style={c.btnGold} onClick={openCreate}>+ New Event</button>
      </div>

      {showForm && (
        <div style={{ ...c.card, border: '1px solid rgba(245,200,0,0.3)', marginBottom: 28 }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.2rem', letterSpacing: 2, color: '#F5C800', marginBottom: 20 }}>
            {editEvent ? '✎ Edit Event' : '+ Create New Event'}
          </div>
          <div className="uk-row2" style={{ marginBottom: 14 }}>
            <div style={c.formGroup}><label style={c.label}>Date Label *</label><input style={c.input} value={form.date} onChange={set('date')} placeholder="e.g. JAN 26, 2025" /></div>
            <div style={c.formGroup}><label style={c.label}>Event Name *</label><input style={c.input} value={form.name} onChange={set('name')} placeholder="Event name" /></div>
          </div>
          <div style={c.formGroup}><label style={c.label}>Description *</label><textarea style={c.textarea} value={form.description} onChange={set('description')} placeholder="Brief description of the event…" /></div>
          <div className="uk-row3" style={{ marginBottom: 14 }}>
            <div style={c.formGroup}><label style={c.label}>Type</label>
              <select style={c.select} value={form.type} onChange={set('type')}>{EVENT_TYPES.map(t => <option key={t}>{t}</option>)}</select>
            </div>
            <div style={c.formGroup}><label style={c.label}>Color Theme</label>
              <select style={c.select} value={form.color} onChange={set('color')}>{EVENT_COLORS.map(t => <option key={t}>{t}</option>)}</select>
            </div>
            <div style={c.formGroup}><label style={c.label}>Tag / Badge</label><input style={c.input} value={form.tag} onChange={set('tag')} placeholder="e.g. Open Registration" /></div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <button style={c.btnGold} onClick={save} disabled={saving}>{saving ? 'Saving…' : editEvent ? 'Update Event' : 'Create Event'}</button>
            <button style={c.btnGhost} onClick={cancelForm}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <div style={{ color: '#555', padding: 40, textAlign: 'center' }}>Loading…</div> : (
        <div className="uk-table-wrap">
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

function CertificateSubmissions({ adminKey, showToast }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/certificates/submissions', { headers: { 'x-admin-key': adminKey } });
    const data = await res.json();
    if (data.success) setSubmissions(data.submissions || []);
    setLoading(false);
  }, [adminKey]);
  useEffect(() => { load(); }, [load]);

  const generateCertificate = submission => {
    window.open(
      `/api/certificates/${submission.donorId}?key=${adminKey}`,
      '_blank'
    );
  };

  const approveSubmission = async submission => {
    const res = await fetch(`/api/certificates/submissions/${submission._id}/approve`, { method: 'POST', headers: { 'x-admin-key': adminKey, 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (data.success) { showToast('Certificate approved & generated!', 'success'); window.open(`/api/certificates/${submission.donorId}?key=${adminKey}`, '_blank'); load(); }
    else showToast(data.message || 'Approval failed', 'error');
  };

  const rejectSubmission = async submission => {
    if (!confirm(`Reject certificate request from ${submission.name}?`)) return;
    const res = await fetch(`/api/certificates/submissions/${submission._id}`, { method: 'DELETE', headers: { 'x-admin-key': adminKey } });
    const data = await res.json();
    if (data.success) { showToast('Submission rejected.', 'error'); load(); }
  };

  return (
    <>
      <div>
        <div style={{ ...c.flexBetween, marginBottom: 24 }}>
          <div className="uk-page-title" style={c.pageTitle}>Certificate Requests <span style={{ fontSize: '1rem', color: '#666' }}>({submissions.length})</span></div>
          <button style={c.btnGhost} onClick={load}>↻ Refresh</button>
        </div>

        {loading
          ? <div style={{ color: '#555', padding: 40, textAlign: 'center' }}>Loading…</div>
          : submissions.length === 0
            ? <div style={{ ...c.card, textAlign: 'center', color: '#555', padding: 60 }}>No pending certificate requests.</div>
            : submissions.map(submission => (
              <div key={submission._id} style={c.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
                      <span style={c.bloodBadge}>{submission.bloodGroup || 'N/A'}</span>
                      <span style={{ fontWeight: 600, color: '#FAFAFA', fontSize: '1.05rem' }}>{submission.donorName || 'Unknown Donor'}</span>
                      <span style={submission.status === 'approved' ? c.badgeGreen : c.badgeGold}>
                        {submission.status === 'approved' ? 'Approved' : 'Pending Request'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', color: '#777', fontSize: '0.82rem' }}>
                      <span>📍 {submission.location || 'N/A'}</span>
                      <span>📞 {submission.phone || 'N/A'}</span>
                      <span>🗓 {submission.donationDate || 'N/A'}</span>
                    </div>
                  </div>
                  <button style={c.btnSmGold} onClick={() => setSelectedSubmission(submission)}>View Details</button>
                </div>
              </div>
            ))
        }
      </div>

      {selectedSubmission && (
        <div className="uk-modal" onClick={e => { if (e.target === e.currentTarget) setSelectedSubmission(null); }}>
          <div className="uk-modal-box" style={{ maxWidth: 850 }}>
            <button style={c.modalClose} onClick={() => setSelectedSubmission(null)}>×</button>
            <div style={c.modalTitle}>Certificate Request Details</div>
            <div className="uk-cert-cols">
              <div style={{ flex: 1, display: 'grid', gap: 14, color: '#ccc' }}>
                <div><strong>Name:</strong> {selectedSubmission.donorName}</div>
                <div><strong>Blood Group:</strong> {selectedSubmission.bloodGroup}</div>
                <div><strong>Phone:</strong> {selectedSubmission.phone}</div>
                <div><strong>Location:</strong> {selectedSubmission.location}</div>
                <div><strong>Donation Date:</strong> {new Date(selectedSubmission.donationDate).toLocaleDateString()}</div>
                <div><strong>Units Donated:</strong> {selectedSubmission.units || 1}</div>
                <div><strong>Submitted On:</strong> {new Date(selectedSubmission.createdAt).toLocaleDateString()}</div>
              </div>
              {selectedSubmission.photo && (
                <div style={{ width: 180, textAlign: 'center', flexShrink: 0 }}>
                  <a href={selectedSubmission.photo} download target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                    <img src={selectedSubmission.photo} alt="Uploaded Proof" style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 14, border: '1px solid #333', cursor: 'pointer' }} />
                    <div style={{ marginTop: 8, fontSize: 13, color: '#4ade80' }}>Download Image</div>
                  </a>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {selectedSubmission.status === 'approved' ? (
                <button
                  style={c.btnGreen}
                  onClick={() => {
                    generateCertificate(selectedSubmission);
                    setSelectedSubmission(null);
                  }}
                >
                  🏅 Generate Again
                </button>
              ) : (
                <>
                  <button
                    style={c.btnGreen}
                    onClick={() => {
                      approveSubmission(selectedSubmission);
                      setSelectedSubmission(null);
                    }}
                  >
                    ✓ Approve & Generate
                  </button>

                  <button
                    style={c.btnRed}
                    onClick={() => {
                      rejectSubmission(selectedSubmission);
                      setSelectedSubmission(null);
                    }}
                  >
                    ✕ Reject
                  </button>
                </>
              )}

              <button style={c.btnGhost} onClick={() => setSelectedSubmission(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const NAV = [
  { group: 'Overview', items: [{ id: 'dashboard', label: 'Dashboard', icon: '⊞' }] },
  { group: 'Donors', items: [{ id: 'pending', label: 'Pending Approval', icon: '🕐' }, { id: 'all-donors', label: 'All Donors', icon: '🩸' }, { id: 'add-donor', label: 'Add Donor', icon: '＋' }] },
  { group: 'Events', items: [{ id: 'events', label: 'Manage Events', icon: '📅' }] },
  { group: 'Certificates', items: [{ id: 'certificate-submissions', label: 'Certificate Requests', icon: '🏅' }] },
  { group: 'Designs', items: [{ id: 'nikah', label: 'Nikah Momento (coming soon)', icon: '💍' }] },
];

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [tab, setTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const showToast = (msg, type = 'success') => setToast({ msg, type });

  // Close sidebar on tab change (mobile UX)
  const handleTabChange = (id) => {
    setTab(id);
    setSidebarOpen(false);
  };

  if (!adminKey) return <LoginScreen onLogin={setAdminKey} />;

  const renderTab = () => {
    const props = { adminKey, showToast };
    switch (tab) {
      case 'dashboard': return <Overview {...props} />;
      case 'pending': return <PendingDonors {...props} />;
      case 'all-donors': return <AllDonors {...props} />;
      case 'add-donor': return <AddDonor {...props} />;
      case 'events': return <ManageEvents {...props} />;
      case 'certificate-submissions': return <CertificateSubmissions {...props} />;
      case 'nikah': return <div style={{ color: '#888', padding: 40, lineHeight: 1.8 }}>Coming Soon! We're working on a special feature to create personalized Nikah momentos for donors and their loved ones. Stay tuned for updates!</div>;
      default: return <Overview {...props} />;
    }
  };

  const currentLabel = NAV.flatMap(g => g.items).find(i => i.id === tab)?.label || 'Dashboard';

  return (
    <>
      <Head>
        <title>Admin – United Kettinakam</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@600;700&family=Poppins:wght@300;400;500&display=swap" rel="stylesheet" />
        <style>{GLOBAL_STYLES}</style>
      </Head>
      <div style={c.page}>

        {/* Mobile overlay */}
        <div className={`uk-overlay${sidebarOpen ? ' visible' : ''}`} onClick={() => setSidebarOpen(false)} />

        {/* Sidebar */}
        <aside className={`uk-sidebar${sidebarOpen ? '' : ' closed'}`}
          // On desktop (> 640px) the sidebar is always visible — achieved via CSS:
          // .uk-sidebar.closed only applies at ≤ 640px via the media query above.
          // We need to override the "closed" class on desktop, so we use a small trick:
          style={{ transform: undefined /* let CSS handle it */ }}
        >
          <style>{`
            @media (min-width: 641px) {
              .uk-sidebar { transform: none !important; }
            }
          `}</style>
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
                  <button key={item.id} style={navBtnStyle(tab === item.id)} onClick={() => handleTabChange(item.id)}>
                    <span style={{ fontSize: '1rem' }}>{item.icon}</span> {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
          <div style={c.sideFooter}>
            <div style={{ marginBottom: 10, color: '#555', fontSize: '0.72rem' }}>Logged in as Admin</div>
            <button style={{ background: 'none', border: '1px solid #333', color: '#555', padding: '7px 14px', borderRadius: 2, cursor: 'pointer', fontSize: '0.78rem', fontFamily: "'Rajdhani', sans-serif", letterSpacing: 1, minHeight: 36 }}
              onClick={() => { if (confirm('Log out?')) setAdminKey(''); }}>LOG OUT</button>
          </div>
        </aside>

        {/* Main */}
        <div className="uk-main">
          <div className="uk-topbar">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Hamburger */}
              <button className="uk-hamburger" onClick={() => setSidebarOpen(s => !s)} aria-label="Toggle menu">
                {sidebarOpen ? '✕' : '☰'}
              </button>
              <div className="uk-topbar-label" style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 700, fontSize: '0.9rem', letterSpacing: 2, color: '#888', textTransform: 'uppercase' }}>{currentLabel}</div>
            </div>
            <a href="/" target="_blank" rel="noreferrer" style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: '0.8rem', letterSpacing: 2, color: '#555', textDecoration: 'none', textTransform: 'uppercase', flexShrink: 0 }}>↗ View Site</a>
          </div>
          <div className="uk-content">{renderTab()}</div>
        </div>

        {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      </div>
    </>
  );
}
