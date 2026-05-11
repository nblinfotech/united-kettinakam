import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function CertificatePage() {
    const router = useRouter();
    const { id } = router.query;

    const [donor, setDonor] = useState(null);

    useEffect(() => {
        if (id) {
            fetch(`/api/donors/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) setDonor(data.donor);
                });
        }
    }, [id]);

    if (!donor) return <div>Loading...</div>;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#111',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20
        }}>

            <div
                id="certificate"
                style={{
                    width: '1000px',
                    background: '#fff',
                    padding: '70px',
                    border: '12px solid #F5C800',
                    textAlign: 'center',
                    position: 'relative',
                    color: '#111'
                }}
            >

                <img
                    src="/logo.png"
                    width="90"
                    style={{ marginBottom: 20 }}
                />

                <h1 style={{
                    fontSize: '4rem',
                    marginBottom: 10,
                    color: '#CC2200',
                    fontFamily: 'serif'
                }}>
                    Certificate of Participation
                </h1>

                <p style={{
                    fontSize: '1.2rem',
                    marginBottom: 40
                }}>
                    Presented By
                </p>

                <h2 style={{
                    fontSize: '3rem',
                    color: '#F5C800',
                    marginBottom: 30
                }}>
                    United Kettinakam
                </h2>

                <p style={{
                    fontSize: '1.4rem',
                    lineHeight: 2
                }}>
                    This certificate is proudly awarded to
                </p>

                <h2 style={{
                    fontSize: '3.2rem',
                    color: '#111',
                    margin: '30px 0'
                }}>
                    {donor.name}
                </h2>

                <p style={{
                    fontSize: '1.3rem',
                    lineHeight: 2
                }}>
                    for the valuable contribution and support
                    in the Blood Donation Initiative.
                </p>

                <div style={{
                    marginTop: 50,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}>
                    <div>
                        <div style={{
                            borderTop: '2px solid #111',
                            width: 200,
                            marginBottom: 10
                        }} />
                        Coordinator
                    </div>

                    <div>
                        <div style={{
                            borderTop: '2px solid #111',
                            width: 200,
                            marginBottom: 10
                        }} />
                        President
                    </div>
                </div>

                <button
                    onClick={() => window.print()}
                    style={{
                        marginTop: 50,
                        background: '#CC2200',
                        color: '#fff',
                        border: 'none',
                        padding: '14px 30px',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    Print / Save PDF
                </button>

            </div>
        </div>
    );
}