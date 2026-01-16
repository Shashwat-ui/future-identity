'use client';
import { useIdentityStore } from '@/store/identityStore';

const modules = ['contact','social','work','payment','address','enterprise'] as const;

export default function ModuleSelector() {
  const setModule = useIdentityStore((s) => s.setModule);

  return (
    <div className="flex gap-4">
      {modules.map(m => (
        <button
          key={m}
          onClick={() => setModule(m)}
          className="px-4 py-2 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 transition"
        >
          {m.toUpperCase()}
        </button>
      ))}
    </div>
  );
}