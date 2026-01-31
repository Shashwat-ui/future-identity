'use client';
import Image from 'next/image';

interface ProfileAvatarProps {
  photo?: string | null;
  name?: string | null;
  onClick?: () => void;
}

export default function ProfileAvatar({ photo, name, onClick }: ProfileAvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <button
      onClick={onClick}
      className="group relative w-12 h-12 rounded-full overflow-hidden border-3 border-cyan-400 shadow-lg hover:shadow-cyan-400/50 transition-all duration-300 hover:scale-110 animate-pulse-slow"
    >
      {photo ? (
        <Image src={photo} alt={name || 'Profile'} fill className="object-cover" />
      ) : (
        <div className="w-full h-full bg-linear-to-br from-cyan-400 via-cyan-600 to-cyan-900 flex items-center justify-center text-white font-bold text-lg">
          {initials}
        </div>
      )}
      <div className="absolute inset-0 bg-cyan-400/0 group-hover:bg-cyan-400/20 transition-all duration-300" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-ping-slow" />
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 211, 238, 0.6); }
          50% { box-shadow: 0 0 30px rgba(34, 211, 238, 0.9); }
        }
        .animate-pulse-slow { animation: pulse-slow 3s infinite; }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-ping-slow { animation: ping-slow 2s infinite; }
      `}</style>
    </button>
  );
}
