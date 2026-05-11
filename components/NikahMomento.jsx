import { useState, useRef } from 'react';

export default function NikahMomento() {
    const [groom, setGroom] = useState('');
    const [bride, setBride] = useState('');
    const [date, setDate] = useState('');

    const canvasRef = useRef(null);

    const generate = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.src = '/nikah-template.jpg';

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            ctx.textAlign = 'center';

            // Groom & Bride
            ctx.font = 'bold 60px serif';
            ctx.fillStyle = '#B68D40';

            ctx.fillText(
                `${groom} & ${bride}`,
                canvas.width / 2,
                canvas.height - 260
            );

            // Date
            ctx.font = '36px serif';
            ctx.fillStyle = '#555';

            ctx.fillText(
                date,
                canvas.width / 2,
                canvas.height - 180
            );
        };
    };

    const download = () => {
        const link = document.createElement('a');
        link.download = 'nikah-momento.png';
        link.href = canvasRef.current.toDataURL();
        link.click();
    };

    return (
        <div style={{ padding: 30 }}>
            <h1 style={{ color: '#F5C800', marginBottom: 20 }}>
                💍 Nikah Momento Generator
            </h1>

            <div style={{ display: 'grid', gap: 14, maxWidth: 500 }}>
                <input
                    placeholder="Groom Name"
                    value={groom}
                    onChange={e => setGroom(e.target.value)}
                />

                <input
                    placeholder="Bride Name"
                    value={bride}
                    onChange={e => setBride(e.target.value)}
                />

                <input
                    placeholder="Nikah Date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                />

                <button onClick={generate}>
                    Generate
                </button>

                <button onClick={download}>
                    Download
                </button>
            </div>

            <canvas
                ref={canvasRef}
                style={{
                    marginTop: 30,
                    width: '100%',
                    maxWidth: 900,
                    border: '2px solid #F5C800',
                    borderRadius: 10
                }}
            />
        </div>
    );
}