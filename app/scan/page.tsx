
'use client';
import { useEffect, useState } from 'react';
import type { IdentityPayload } from '@/lib/identity';

function joinUrl(base: string, path: string) {
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

export default function ScanPage() {
  const [payload, setPayload] = useState<IdentityPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const urlParams = new URLSearchParams(window.location.search);
      const scanId = urlParams.get('id') || undefined;
      if (!scanId) {
        setError('Missing scan id');
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
        })
        .catch(err => {
          setError(err.message || 'Failed to load projection');
        });
    }

    void load();
  }, []);

  function renderDetails() {
    if (!payload || !payload.data) return null;
    const entries = Object.entries(payload.data).filter(([, v]) => v != null && v !== '');
    if (entries.length === 0) return <p>No details shared.</p>;
    return (
      <ul className="space-y-2">
        {entries.map(([k, v]) => (
          <li key={k} className="flex gap-2 items-center">
            <span className="font-semibold capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>:
            <span className="break-all">{String(v)}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (error) {
    return <p className="p-6">{error}</p>;
  }
  if (!payload) {
    return <p className="p-6">Loading…</p>;
  }
  return (
    <div className="p-6 max-w-md mx-auto bg-white/10 rounded-xl shadow-lg mt-10">
      <h2 className="text-lg font-bold mb-4 text-center">{payload.type.charAt(0).toUpperCase() + payload.type.slice(1)} Info</h2>
      {renderDetails()}
    </div>
  );
}