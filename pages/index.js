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
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    fetch('/api/donors/stats')
      .then(r => r.json())
      .then(d => {
        if (d.success) setDonorCount(d.stats.total);
      })
      .catch(() => { });

    const onScroll = () => setScrollTop(window.scrollY > 400);

    window.addEventListener('scroll', onScroll);

    // PWA Install Prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => console.log('Service Worker Registered'))
        .catch((err) => console.log('SW registration failed:', err));
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted install');
    }

    setDeferredPrompt(null);
    setShowInstall(false);
  };

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

      {/* Scroll To Top */}
      {scrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            zIndex: 500,
            width: 44,
            height: 44,
            background: 'var(--gold)',
            color: 'var(--black)',
            border: 'none',
            borderRadius: 2,
            cursor: 'pointer',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            transition: 'all 0.3s',
          }}
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}

      {/* Install App Button */}
      {showInstall && (
        <button
          onClick={handleInstallClick}
          style={{
            position: 'fixed',
            bottom: 90,
            right: 30,
            zIndex: 500,
            padding: '12px 18px',
            background: '#d27a07',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          }}
        >
          Install App
        </button>
      )}
    </>
  );
}