
"use client";
import { useState, useEffect } from "react";
import QRProjection from '@/components/identity/QRProjection';
import { FaQrcode } from "react-icons/fa6";
import QRScanner from "./components/identity/ORScanner";
// UserProfile types are no longer needed directly in this file

const options = [
  {
    type: "contact",
    label: "Contact",
    icon: "📱",
    fields: [
      { name: "name", label: "Full Name", type: "text", icon: "👤" },
      { name: "mobile", label: "Mobile Number", type: "tel", icon: "📱" },
      { name: "email", label: "Email", type: "email", icon: "✉️" },
    ],
  },
  {
    type: "social",
    label: "Socials",
    icon: "🌐",
    fields: [
      { name: "instagram", label: "Instagram", type: "text", icon: "📸" },
      { name: "facebook", label: "Facebook", type: "text", icon: "📘" },
      { name: "linkedin", label: "LinkedIn", type: "url", icon: "🔗" },
      { name: "tiktok", label: "TikTok", type: "text", icon: "🎵" },
      { name: "youtube", label: "YouTube", type: "text", icon: "▶️" },
    ],
  },
  {
    type: "work",
    label: "Work",
    icon: "💼",
    fields: [
      { name: "company", label: "Company", type: "text", icon: "🏢" },
      { name: "designation", label: "Designation", type: "text", icon: "🧑‍💼" },
      { name: "officeAddress", label: "Office Address", type: "text", icon: "🏢" },
    ],
  },
  {
    type: "payment",
    label: "Payment",
    icon: "💳",
    fields: [
      { name: "upi", label: "UPI", type: "text", icon: "💸" },
      { name: "bankAccount", label: "Bank Account", type: "text", icon: "🏦" },
      { name: "crypto", label: "Crypto", type: "text", icon: "🪙" },
    ],
  },
  {
    type: "address",
    label: "Address",
    icon: "🏠",
    fields: [
      { name: "home", label: "Home Address", type: "text", icon: "🏠" },
      { name: "office", label: "Office Address", type: "text", icon: "🏢" },
      { name: "holidayHome", label: "Holiday Home", type: "text", icon: "🏖️" },
    ],
  },
] as const;

type Option = (typeof options)[number];
type FormState = Record<string, string>;

export default function Home() {
  const [selected, setSelected] = useState<Option | null>(null);
  const [form, setForm] = useState<FormState>({});
  const [showQR, setShowQR] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedData, setScannedData] = useState<string | null>(null);

  useEffect(() => {
    // Listen for quick share from profile
    const handleQuickShare = () => {
      // Get selected fields from localStorage
      const quickShareDataStr = localStorage.getItem('quickShareData');
      if (quickShareDataStr) {
        const quickShareData = JSON.parse(quickShareDataStr);
        setForm(quickShareData);
        
        // Determine which category to select based on the fields
        let categoryType: string | null = null;
        if (quickShareData.name || quickShareData.email || quickShareData.mobile) {
          categoryType = 'contact';
        } else if (quickShareData.instagram || quickShareData.facebook || quickShareData.linkedin) {
          categoryType = 'social';
        } else if (quickShareData.company || quickShareData.designation) {
          categoryType = 'work';
        } else if (quickShareData.upi || quickShareData.bankAccount) {
          categoryType = 'payment';
        } else if (quickShareData.home || quickShareData.holidayHome) {
          categoryType = 'address';
        }
        
        if (categoryType) {
          const selectedOption = options.find(o => o.type === categoryType);
          if (selectedOption) {
            setSelected(selectedOption);
          }
        }
        
        // Auto-generate QR
        setShowQR(true);
        
        // Clear the quick share data
        localStorage.removeItem('quickShareData');
      }
    };
    window.addEventListener('quickShareFromProfile', handleQuickShare);

    return () => {
      window.removeEventListener('quickShareFromProfile', handleQuickShare);
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setShowQR(true);
  }

  function reset() {
    setShowQR(false);
    setForm({});
    setSelected(null);
  }

  return (
    <main className="min-h-screen max-h-screen w-full flex flex-col items-center relative overflow-y-scroll">
      <div className="fixed inset-0 -z-10 bg-[url('/bg.jpg.jpg')] bg-cover bg-center" />
        <div className="flex justify-center mb-8 mt-4">
        <button
          onClick={() => setScanning(true)}
          className="group flex items-center gap-3 px-6 py-3 rounded-full bg-linear-to-r from-cyan-400 via-cyan-600 to-cyan-900 shadow-2xl border-2 border-cyan-300 hover:scale-105 transition-all duration-300 animate-futuristic-glow"
        >
          <FaQrcode className="text-3xl animate-pulse" />
          <span className="font-bold text-lg text-white group-hover:text-cyan-300 transition">Scan QR</span>
        </button>
      </div>
      {scanning && (
        <QRScanner
          onScan={(data) => {
            console.log("Scanned data:", data);
            setScanning(false);
            
            // Check if it's a URL from our app
            try {
              const url = new URL(data);
              // If it's our scan page, navigate to it
              if (url.pathname.includes('/scan')) {
                window.location.href = data;
                return;
              }
            } catch {
              // Not a valid URL, just show the data
            }
            
            setScannedData(data);
          }}
          onClose={() => setScanning(false)}
        />
      )}
        {scannedData && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/80 z-50">
          <div className="bg-white/10 p-8 rounded-2xl shadow-xl border border-cyan-300 text-white max-w-lg">
            <h2 className="text-2xl font-bold mb-4">Scanned Data</h2>
            <pre className="whitespace-pre-wrap wrap-break-words">{scannedData}</pre>
            <button onClick={() => setScannedData(null)} className="mt-4 px-6 py-2 rounded-full bg-cyan-400 text-white font-semibold hover:bg-cyan-600 transition">Close</button>
          </div>
        </div>
      )}
      <div className="w-full max-w-2xl mx-auto px-4 py-10">
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-white drop-shadow-lg tracking-tight mb-2">
            <span className="bg-white/10 px-4 py-2 rounded-2xl shadow-xl backdrop-blur-xl">Share Your Identity</span>
          </h1>
          <p className="text-center text-white/80 mb-4 text-lg md:text-xl">Choose what you want to share and generate a QR code for instant transfer.</p>

          {!selected && !showQR && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 w-full">
              {options.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => setSelected(opt)}
                  className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xl shadow-lg border border-white/20 transition-all duration-300 hover:scale-105 focus:scale-105"
                >
                  <span className="text-4xl mb-2 drop-shadow-lg">{opt.icon}</span>
                  <span className="font-bold text-lg text-white group-hover:text-cyan-300 transition">{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          {selected && !showQR && (
            <form className="w-full max-w-md mx-auto flex flex-col gap-6 bg-white/10 rounded-2xl shadow-xl p-8 border border-white/20 animate-fadein" onSubmit={handleSubmit} autoComplete="off">
              <h2 className="text-2xl font-bold text-center text-white mb-4">{selected.icon} {selected.label}</h2>
              {selected.fields.map((f) => (
                <div key={f.name} className="relative group">
                  <input
                    type={f.type}
                    name={f.name}
                    id={f.name}
                    value={form[f.name] || ""}
                    onChange={handleChange}
                    className="peer w-full bg-white/20 border-b-2 border-white/30 focus:border-cyan-400 text-white placeholder-transparent px-4 py-3 rounded-t-xl outline-none transition-all duration-300 focus:bg-white/30 backdrop-blur-md"
                    placeholder={f.label}
                    autoComplete="off"
                  />
                  <label
                    htmlFor={f.name}
                    className="absolute left-4  pointer-events-none transition-all duration-300 peer-focus:-top-5 peer-focus:text-cyan-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-white/60 peer-placeholder-shown:text-base -top-5 text-cyan-300 text-sm px-1 rounded"
                  >
                    <span className="mr-2 text-lg align-middle">{f.icon}</span>
                    {f.label}
                  </label>
                </div>
              ))}
              <div className="flex gap-4 mt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-cyan-400/80 text-white font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 tracking-wide"
                >
                  Generate QR
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="flex-1 py-3 rounded-xl bg-white/20 text-white font-semibold hover:bg-white/30 transition"
                >
                  Back
                </button>
              </div>
            </form>
          )}

          {showQR && selected && (
            <div className="flex flex-col items-center gap-6 animate-fadein">
              <QRProjection
                payload={{
                  type: selected.type,
                  data: form,
                }}
              />
              <button
                onClick={reset}
                className="px-6 py-2 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition mt-2"
              >
                Share New Info
              </button>
            </div>
          )}
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: none; }
        }
        .animate-fadein { animation: fadein 1s cubic-bezier(.16,1,.3,1); }
      `}</style>
    </main>
  );
}