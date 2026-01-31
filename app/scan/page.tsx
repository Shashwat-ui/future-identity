
'use client';
import { useEffect, useState } from 'react';
import type { IdentityPayload } from '@/lib/identity';
import ModernSpinner from '@/components/ui/ModernSpinner';
import { FaDownload, FaApple, FaGooglePlay } from 'react-icons/fa';

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

export default function ScanPage() {
  const [payload, setPayload] = useState<IdentityPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const urlParams = new URLSearchParams(window.location.search);
      const scanId = urlParams.get('id') || undefined;
      if (!scanId) {
        setError('Missing scan id');
        setLoading(false);
        return;
      }

      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || origin || '').replace(/\/+$/, '');
      const validateUrl = joinUrl(baseUrl, '/api/qr/validate');

      fetch(validateUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: scanId }),
        cache: 'no-store',
      })
        .then(async res => {
          if (!res.ok) {
            let message = 'Projection expired';
            try {
              const data = await res.json();
              if (data && typeof data.error === 'string') {
                message = data.error;
              }
            } catch {
              // ignore JSON parse errors and use default message
            }
            throw new Error(message);
          }
          return res.json();
        })
        .then((data: { payload?: IdentityPayload }) => {
          if (data && data.payload) {
            setPayload(data.payload);
          } else {
            setError('Invalid payload');
          }
          setLoading(false);
        })
        .catch(err => {
          setError(err.message || 'Failed to load projection');
          setLoading(false);
        });
    }

    void load();
  }, []);

  function renderDetails() {
    if (!payload || !payload.data) return null;
    const entries = Object.entries(payload.data).filter(([, v]) => v != null && v !== '');
    if (entries.length === 0) return <p className="text-gray-800">No details shared.</p>;
    return (
      <ul className="space-y-3">
        {entries.map(([k, v]) => (
          <li key={k} className="flex gap-3 items-start bg-white/60 p-3 rounded-lg hover:bg-white/80 transition-colors">
            <span className="font-semibold capitalize text-gray-700 min-w-30">
              {k.replace(/([A-Z])/g, ' $1')}:
            </span>
            <span className="break-all text-gray-900">{String(v)}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-linear-to-br from-gray-900 via-purple-900/40 to-black">
        <ModernSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-red-500/10 border-2 border-red-400 rounded-2xl p-8 max-w-md text-center">
          <span className="text-6xl mb-4 block">⚠️</span>
          <p className="text-xl text-red-300 font-semibold">{error}</p>
        </div>
        <DownloadAppSection />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-linear-to-br from-slate-900 via-slate-950 to-black">
      <div className="w-full max-w-2xl mx-auto relative animate-slidein">
        {/* Glow / gradient border wrapper */}
        <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-400 via-indigo-500 to-fuchsia-500 opacity-60 blur-2xl" aria-hidden="true" />

        {/* Main content card */}
        <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100/80 p-8 sm:p-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-gray-400 mb-2">
                Shared Identity
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                {payload?.type.charAt(0).toUpperCase() + (payload?.type.slice(1) || '')} Details
              </h2>
            </div>
            <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-100 via-sky-100 to-indigo-100 border border-cyan-200 shadow-md">
              <span className="text-2xl">🔗</span>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-linear-to-r from-cyan-50 via-white to-indigo-50 border border-cyan-100 px-4 py-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-200">
              <span className="text-lg">📡</span>
            </div>
            <p className="text-sm sm:text-base text-gray-700">
              You are viewing information that someone chose to share with you in real time.
            </p>
          </div>

          <div className="space-y-4 max-h-105 overflow-y-auto pr-1">
            {renderDetails()}
          </div>

          <p className="mt-6 text-xs text-gray-400 text-center">
            This information is temporarily projected for this session only. Save what you need securely.
          </p>
        </div>
      </div>
      <DownloadAppSection />
      <style jsx global>{`
        @keyframes slidein {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slidein {
          animation: slidein 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}

function DownloadAppSection() {
  return (
    <div className="mt-12 text-center space-y-4 animate-fadein-delay">
      <div className="flex items-center gap-3 justify-center mb-4">
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400 to-transparent"></div>
        <button className="group flex items-center gap-3 px-6 py-3 bg-linear-to-r from-gray-800 to-black rounded-xl border-2 border-white/20 hover:border-cyan-400 transition-all hover:scale-105 shadow-xl">
          <FaDownload className="text-cyan-400 text-2xl" />
        </button>
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-cyan-400 to-transparent"></div>
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-2">Get Future Identity</h3>
      <p className="text-white/70 mb-6">Share your identity effortlessly with QR codes</p>
      
      <div className="flex gap-4 justify-center flex-wrap">
        <button className="group flex items-center gap-3 px-6 py-3 bg-linear-to-r from-gray-800 to-black rounded-xl border-2 border-white/20 hover:border-cyan-400 transition-all hover:scale-105 shadow-lg">
          <FaApple className="text-3xl text-white group-hover:text-cyan-300 transition-colors" />
          <div className="text-left">
            <div className="text-xs text-white/60">Download on the</div>
            <div className="text-sm font-bold text-white">App Store</div>
          </div>
        </button>
        <button className="group flex items-center gap-3 px-6 py-3 bg-linear-to-r from-gray-800 to-black rounded-xl border-2 border-white/20 hover:border-cyan-400 transition-all hover:scale-105 shadow-lg">
          <FaGooglePlay className="text-3xl text-white group-hover:text-cyan-300 transition-colors" />
          <div className="text-left">
            <div className="text-xs text-white/60">Get it on</div>
            <div className="text-sm font-bold text-white">Google Play</div>
          </div>
        </button>
      </div>
      
      <style jsx>{`
        @keyframes fadein-delay {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadein-delay {
          animation: fadein-delay 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
        }
      `}</style>
    </div>
  );
}