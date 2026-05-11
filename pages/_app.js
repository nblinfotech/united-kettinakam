import '../styles/globals.css';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>United Kettinakam – United By Soul</title>
        <meta name="description" content="United Kettinakam Sports Club – United By Soul. Community sports club serving Kettinakam with events, blood donation drives, and more." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: '#1A1A1A', color: '#FAFAFA', border: '1px solid rgba(245,200,0,0.3)', fontFamily: 'Poppins, sans-serif', fontSize: '0.88rem' },
          success: { iconTheme: { primary: '#F5C800', secondary: '#111' } },
          error: { iconTheme: { primary: '#CC2200', secondary: '#fff' } },
        }}
      />
      <Component {...pageProps} />
    </>
  );
}
