import { useState } from 'react';
import Head from 'next/head';

export default function AdminPage() {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const login = async () => {
    setLoading(true);
    const res = await fetch('/api/donors/pending', {
      headers: { 'x-admin-key': key },
    });
    const data = await res.json();
    setLoading(false);
    if (data.success) {
      setAuthed(true);
      setDonors(data.donors);
    } else {
      setMsg('Invalid admin key.');
    }
  };

  const verify = async (id) => {
    const res = await fetch(`/api/donors/${id}`, {
      method: 'PATCH',
      headers: { 'x-admin-key': key },
    });
    const data = await res.json();
    if (data.success) {
      setDonors(prev => prev.filter(d => d._id !== id));
      setMsg('Donor verified and published!');
    }
  };

  const remove = async (id) => {
    if (!confirm('Remove this donor registration?')) return;
    const res = await fetch(`/api/donors/${id}`, {
      method: 'DELETE',
      headers: { 'x-admin-key': key },
    });
    const data = await res.json();
    if (data.success) setDonors(prev => prev.filter(d => d._id !== id));
  };

  const s = {
    page: { minHeight: '100vh', background: '#0D0D0D', color: '#FAFAFA', fontFamily: 'Poppins, sans-serif', padding: '60px 5%' },
    title: { fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.5rem', letterSpacing: 3, color: '#F5C800', marginBottom: 8 },
    sub: { color: '#888', marginBottom: 40, fontSize: '0.9rem' },
    input: { background: '#1A1A1A', border: '1px solid rgba(245,200,0,0.3)', color: '#FAFAFA', padding: '13px 16px', borderRadius: 2, fontFamily: 'Poppins', fontSize: '0.9rem', outline: 'none', width: 300, marginRight: 12 },
    btn: { background: '#F5C800', color: '#111', border: 'none', padding: '13px 28px', borderRadius: 2, fontFamily: 'Bebas Neue, sans-serif', fontSize: '1rem', letterSpacing: 2, cursor: 'pointer' },
    card: { background: '#1A1A1A', border: '1px solid rgba(245,200,0,0.15)', borderRadius: 4, padding: '20px 24px', marginBottom: 16 },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' },
    name: { fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.4rem', letterSpacing: 2, color: '#FAFAFA' },
    meta: { color: '#888', fontSize: '0.8rem', marginTop: 4 },
    blood: { fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.1rem', color: '#FF4444' },
    actions: { display: 'flex', gap: 10, marginTop: 12 },
    vBtn: { background: '#1A8C3A', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 2, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 1 },
    dBtn: { background: '#CC2200', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: 2, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, letterSpacing: 1 },
    msg: { background: 'rgba(26,140,58,0.15)', border: '1px solid rgba(26,140,58,0.3)', color: '#44CC66', padding: '12px 20px', borderRadius: 2, marginBottom: 20, fontSize: '0.9rem' },
    empty: { color: '#555', textAlign: 'center', padding: 60, fontSize: '0.95rem' },
  };

  return (
    <>
      <Head>
        <title>Admin – United Kettinakam</title>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@700&family=Poppins&display=swap" rel="stylesheet" />
      </Head>
      <div style={s.page}>
        <div style={s.title}>UK Admin Panel</div>
        <div style={s.sub}>Verify blood donor registrations before they go public.</div>

        {!authed ? (
          <div>
            <input
              style={s.input}
              type="password"
              placeholder="Enter admin secret key"
              value={key}
              onChange={e => setKey(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
            />
            <button style={s.btn} onClick={login} disabled={loading}>
              {loading ? 'Loading…' : 'LOGIN'}
            </button>
            {msg && <p style={{ color: '#FF4444', marginTop: 12 }}>{msg}</p>}
          </div>
        ) : (
          <div>
            {msg && <div style={s.msg}>{msg}</div>}
            <div style={{ fontFamily: 'Rajdhani, sans-serif', color: '#F5C800', letterSpacing: 2, marginBottom: 24, textTransform: 'uppercase', fontSize: '0.85rem' }}>
              {donors.length} pending verification{donors.length !== 1 ? 's' : ''}
            </div>
            {donors.length === 0 ? (
              <div style={s.empty}>No pending registrations. All caught up!</div>
            ) : (
              donors.map(d => (
                <div key={d._id} style={s.card}>
                  <div style={s.row}>
                    <div>
                      <div style={s.name}>{d.name} <span style={s.blood}>{d.bloodGroup}</span></div>
                      <div style={s.meta}>
                        Age {d.age} · {d.gender} · {d.location}<br />
                        📧 {d.email} · 📱 {d.phone}<br />
                        Last donation: {d.lastDonation || 'First time'}<br />
                        {d.medicalNotes && <span>Notes: {d.medicalNotes}</span>}
                      </div>
                      <div style={{ color: '#555', fontSize: '0.72rem', marginTop: 6 }}>
                        Registered: {new Date(d.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div style={s.actions}>
                    <button style={s.vBtn} onClick={() => verify(d._id)}>✓ Verify & Publish</button>
                    <button style={s.dBtn} onClick={() => remove(d._id)}>✕ Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
