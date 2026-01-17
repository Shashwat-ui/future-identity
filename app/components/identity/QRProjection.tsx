'use client';
import QRCode from 'react-qr-code';
import { useEffect, useState } from 'react';
import type { IdentityPayload } from '@/lib/identity';

interface QRProjectionProps {
  payload: IdentityPayload;
}

function joinUrl(base: string, path: string) {
  // Remove trailing slash from base, leading slash from path, then join
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

export default function QRProjection({ payload }: QRProjectionProps) {
  const [qrId, setQrId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function createQr() {
      try {
        setError(null);
        setQrId(null);

        const res = await fetch('/api/qr/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload }),
        });

        if (!res.ok) {
          throw new Error('Failed to create projection');
        }

        const data = await res.json();
        if (!cancelled) {
          setQrId(data.id);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Unable to generate QR. Please try again.' + err);
        }
      }
    }

    createQr();

    return () => {
      cancelled = true;
    };
  }, [payload]);

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  if (!qrId) {
    return <p className="text-sm opacity-70">Generating projection…</p>;
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || origin || '').replace(/\/+$/, '');
  const qrUrl = joinUrl(baseUrl, `scan?id=${qrId}`);

  return (
    <div className="relative p-6 rounded-2xl bg-black/40 backdrop-blur-xl shadow-xl shadow-black/40">
      <QRCode value={qrUrl} size={220} />
      <p className="mt-4 text-xs opacity-60 text-white text-center">Valid for 10 minutes</p>
      {/* <div className="mt-2 text-xs text-center break-all text-cyan-300 bg-black/30 rounded p-2 select-all">
        <span>QR Link:</span><br />
        {qrUrl}
      </div> */}
    </div>
  );
}