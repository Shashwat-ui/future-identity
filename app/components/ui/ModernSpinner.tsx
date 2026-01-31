'use client';

export default function ModernSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 p-8 w-full" style={{ minHeight: '300px' }}>
      <div className="relative flex items-center justify-center" style={{ width: '160px', height: '160px' }}>
        {/* Glassmorphism background */}
        <div 
          className="absolute rounded-full border"
          style={{
            inset: 0,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(24px)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
            borderColor: 'rgba(255,255,255,0.2)'
          }}
        ></div>

        {/* Outer glowing ring */}
        <div 
          className="absolute rounded-full"
          style={{
            inset: 0,
            border: '4px solid transparent',
            borderTopColor: '#22d3ee',
            borderRightColor: '#a855f7',
            animation: 'spin 2s linear infinite',
            boxShadow: '0 0 40px 10px rgba(0,255,255,0.2)'
          }}
        ></div>

        {/* Middle neon ring */}
        <div 
          className="absolute rounded-full"
          style={{
            inset: '16px',
            border: '4px solid transparent',
            borderTopColor: '#f472b6',
            borderLeftColor: '#67e8f9',
            animation: 'spin-reverse 1.5s linear infinite',
            boxShadow: '0 0 30px 5px rgba(255,0,255,0.15)'
          }}
        ></div>

        {/* Inner pulsing circle with glow */}
        <div 
          className="absolute rounded-full"
          style={{
            inset: '32px',
            background: 'linear-gradient(to bottom right, #22d3ee, #a855f7, #ec4899)',
            animation: 'pulse-glow 2s ease-in-out infinite',
            boxShadow: '0 0 40px 10px rgba(255,0,255,0.2)'
          }}
        ></div>

        {/* Center dot with glow */}
        <div className="absolute flex items-center justify-center" style={{ inset: 0 }}>
          <div 
            className="rounded-full border-2"
            style={{
              width: '40px',
              height: '40px',
              background: 'white',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              borderColor: 'rgba(34,211,238,0.6)',
              animation: 'bounce-smooth 1s ease-in-out infinite'
            }}
          ></div>
        </div>

        {/* Orbiting particles with glow */}
        <div 
          className="absolute rounded-full"
          style={{
            top: 0,
            left: '50%',
            width: '16px',
            height: '16px',
            background: '#22d3ee',
            animation: 'orbit 3s linear infinite',
            boxShadow: '0 0 16px 4px rgba(0,255,255,0.4)'
          }}
        ></div>
        <div 
          className="absolute rounded-full"
          style={{
            top: '50%',
            right: 0,
            width: '16px',
            height: '16px',
            background: '#a855f7',
            animation: 'orbit 3s linear infinite',
            animationDelay: '0.75s',
            boxShadow: '0 0 16px 4px rgba(128,0,255,0.4)'
          }}
        ></div>
        <div 
          className="absolute rounded-full"
          style={{
            bottom: 0,
            left: '50%',
            width: '16px',
            height: '16px',
            background: '#f472b6',
            animation: 'orbit 3s linear infinite',
            animationDelay: '1.5s',
            boxShadow: '0 0 16px 4px rgba(255,0,128,0.4)'
          }}
        ></div>
        <div 
          className="absolute rounded-full"
          style={{
            top: '50%',
            left: 0,
            width: '16px',
            height: '16px',
            background: '#67e8f9',
            animation: 'orbit 3s linear infinite',
            animationDelay: '2.25s',
            boxShadow: '0 0 16px 4px rgba(0,255,255,0.3)'
          }}
        ></div>
      </div>

      {/* Visible spinner animation indicator - removed text to show only spinner */}
      <div className="flex gap-2 justify-center mt-3">
        <span 
          className="rounded-full"
          style={{
            width: '12px',
            height: '12px',
            background: '#22d3ee',
            animation: 'bounce-dot 1.4s ease-in-out infinite',
            boxShadow: '0 0 8px 2px rgba(0,255,255,0.5)'
          }}
        ></span>
        <span 
          className="rounded-full"
          style={{
            width: '12px',
            height: '12px',
            background: '#a855f7',
            animation: 'bounce-dot 1.4s ease-in-out infinite',
            animationDelay: '0.2s',
            boxShadow: '0 0 8px 2px rgba(128,0,255,0.5)'
          }}
        ></span>
        <span 
          className="rounded-full"
          style={{
            width: '12px',
            height: '12px',
            background: '#f472b6',
            animation: 'bounce-dot 1.4s ease-in-out infinite',
            animationDelay: '0.4s',
            boxShadow: '0 0 8px 2px rgba(255,0,128,0.5)'
          }}
        ></span>
      </div>
    </div>
  );
}
