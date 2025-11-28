'use client';

import dynamic from 'next/dynamic';

const MapInner = dynamic(() => import('./MapInner'), {
    ssr: false,
    loading: () => (
        <div className="glass-card" style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--radius)'
        }}>
            <p>Loading Map...</p>
        </div>
    ),
});

export default function Map(props) {
    return <MapInner {...props} />;
}
