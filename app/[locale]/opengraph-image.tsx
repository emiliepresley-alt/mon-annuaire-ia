import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'AI Free Directory';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0b0c10',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Effet de dégradé en arrière-plan */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(45deg, rgba(168,85,247,0.15) 0%, rgba(6,182,212,0.15) 100%)' }} />
        
        {/* Logo + Titre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, #9333ea, #22d3ee)', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
              <path d="M8.5 8.5 7 10l1.5 1.5"></path>
              <path d="M15.5 8.5 17 10l-1.5 1.5"></path>
              <path d="M8.5 15.5 7 14l1.5-1.5"></path>
              <path d="M15.5 15.5 17 14l-1.5-1.5"></path>
            </svg>
          </div>
          <h1 style={{ fontSize: '72px', fontWeight: 'bold', color: 'white', letterSpacing: '-2px' }}>
            AI Free Directory
          </h1>
        </div>
        
        {/* Sous-titre */}
        <p style={{ fontSize: '32px', color: '#94a3b8', marginTop: '10px' }}>
          Discover the best AI tools and resources.
        </p>
      </div>
    ),
    { ...size }
  );
}