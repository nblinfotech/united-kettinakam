import '../styles/globals.css';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>
          United Kettinakam – United By Soul
        </title>

        <meta
          name="description"
          content="United Kettinakam Sports Club – United By Soul. Community sports club serving Kettinakam with events, blood donation drives, and more."
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        <link rel="icon" href="/logo.png" />

        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Rajdhani:wght@400;500;600;700&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={12}
        containerStyle={{
          zIndex: 999999999,
          top: 20,
        }}
        toastOptions={{
          duration: 4500,

          style: {
            background: '#1A1A1A',
            color: '#FAFAFA',
            border:
              '1px solid rgba(245,200,0,0.35)',
            fontFamily: 'Poppins, sans-serif',
            fontSize: '0.9rem',
            padding: '14px 18px',
            borderRadius: '12px',
            zIndex: 999999999,
            boxShadow:
              '0 12px 40px rgba(0,0,0,0.45)',
          },

          success: {
            style: {
              background: '#132218',
              color: '#fff',
              border:
                '1px solid rgba(74,222,128,0.4)',
            },

            iconTheme: {
              primary: '#4ade80',
              secondary: '#111',
            },
          },

          error: {
            style: {
              background: '#2A1212',
              color: '#fff',
              border:
                '1px solid rgba(255,107,107,0.45)',
            },

            iconTheme: {
              primary: '#ff6b6b',
              secondary: '#111',
            },
          },
        }}
      />

      <Component {...pageProps} />
    </>
  );
}