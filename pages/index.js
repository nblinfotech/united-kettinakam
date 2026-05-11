import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Events from '../components/Events';
import BloodDonation from '../components/BloodDonation';
import Footer from '../components/Footer';

export default function Home() {
  const [donorCount, setDonorCount] = useState(0);
  const [scrollTop, setScrollTop] = useState(false);

  useEffect(() => {
    fetch('/api/donors/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setDonorCount(d.stats.total); })
      .catch(() => {});

    const onScroll = () => setScrollTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero donorCount={donorCount} />
        <About />
        <Events />
        <BloodDonation />
      </main>
      <Footer />
      {scrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', bottom: 30, right: 30, zIndex: 500,
            width: 44, height: 44, background: 'var(--gold)', color: 'var(--black)',
            border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: '1.2rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 'bold', transition: 'all 0.3s',
          }}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </>
  );
}
