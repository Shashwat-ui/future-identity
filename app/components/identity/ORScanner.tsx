import { BrowserQRCodeReader } from "@zxing/browser";
import { useCallback, useEffect, useRef, useState } from "react";
import { NotFoundException } from "@zxing/library";

export default function QRScanner({ onScan, onClose }: { onScan: (data: string) => void; onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserQRCodeReader | null>(null);
  const scannedRef = useRef(false);

  const [error, setError] = useState<string | null>(null);

  const handleScan = useCallback(
    (data: string) => {
      onScan(data);
    },
    [onScan]
  );

  // stop camera safely
  const stopCamera = () => {
    const video = videoRef.current;
    if (!video || !video.srcObject) return;

    const stream = video.srcObject as MediaStream;
    stream.getTracks().forEach((track) => track.stop());
    video.srcObject = null;
  };

  useEffect(() => {
    if (!videoRef.current) return;

    const reader = new BrowserQRCodeReader();
    readerRef.current = reader;
    scannedRef.current = false;

    reader.decodeFromVideoDevice(
      undefined,
      videoRef.current,
      (result, err) => {
        if (result && !scannedRef.current) {
          scannedRef.current = true;
          handleScan(result.getText());
          stopCamera();
          return;
        }

        // Only show error for real, persistent issues
        if (err && !(err instanceof NotFoundException)) {
          // Don't stop camera, just show error message
          setError("Camera error or permission denied. Please check your camera and try again.");
        }
      }
    );

    return () => {
      scannedRef.current = true;
      stopCamera();
      readerRef.current = null;
    };
  }, [handleScan]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg">
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-cyan-900 via-cyan-700 to-cyan-400 shadow-2xl border-4 border-cyan-300 animate-futuristic-glow">
        <video ref={videoRef} className="w-[320px] h-80 rounded-2xl border-4 border-cyan-400 shadow-lg" />
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {/* Futuristic animated border */}
          <svg width="340" height="340" className="absolute">
            <rect x="10" y="10" width="320" height="320" rx="32" fill="none" stroke="cyan" strokeWidth="4" strokeDasharray="20 10" className="animate-border" />
          </svg>
        </div>
        <button onClick={() => { stopCamera(); onClose(); }} className="absolute top-4 right-4 bg-cyan-400 text-white rounded-full px-4 py-2 shadow-lg hover:bg-cyan-600 transition">
          Close
        </button>
        {error && <div className="text-red-400 mt-2">{error}</div>}
        <style jsx>{`
          @keyframes futuristic-glow {
            0%, 100% { box-shadow: 0 0 40px 10px cyan; }
            50% { box-shadow: 0 0 80px 20px #00fff7; }
          }
          .animate-futuristic-glow { animation: futuristic-glow 2s infinite; }
          @keyframes border {
            to { stroke-dashoffset: 60; }
          }
          .animate-border { animation: border 2s linear infinite; }
        `}</style>
      </div>
    </div>
  );
}