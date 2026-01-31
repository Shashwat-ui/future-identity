'use client';
import { useState, useRef, useEffect } from 'react';
import { FaTimes, FaShare, FaCamera, FaCheckCircle, FaGoogle, FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import type { UserProfile } from '@/lib/profile';
import { signIn } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';

interface ProfileModalProps {
  profile: UserProfile | null;
  onClose: () => void;
  onSave: (data: Partial<UserProfile>) => Promise<void> | void;
  onQuickShare: () => void;
}

interface Verifications {
  email: boolean;
  instagram: boolean;
  facebook: boolean;
  linkedin: boolean;
}

const allFields = [
  { name: 'name', label: 'Full Name', type: 'text', icon: '👤', category: 'contact', oauthProvider: null },
  { name: 'mobile', label: 'Mobile Number', type: 'tel', icon: '📱', category: 'contact', oauthProvider: null },
  { name: 'email', label: 'Email', type: 'email', icon: '✉️', category: 'contact', oauthProvider: 'google' },
  { name: 'instagram', label: 'Instagram', type: 'text', icon: '📸', category: 'social', oauthProvider: 'instagram' },
  { name: 'facebook', label: 'Facebook', type: 'text', icon: '📘', category: 'social', oauthProvider: 'facebook' },
  { name: 'linkedin', label: 'LinkedIn', type: 'url', icon: '🔗', category: 'social', oauthProvider: 'linkedin' },
  { name: 'tiktok', label: 'TikTok', type: 'text', icon: '🎵', category: 'social', oauthProvider: null },
  { name: 'youtube', label: 'YouTube', type: 'text', icon: '▶️', category: 'social', oauthProvider: null },
  { name: 'company', label: 'Company', type: 'text', icon: '🏢', category: 'work', oauthProvider: null },
  { name: 'designation', label: 'Designation', type: 'text', icon: '🧑‍💼', category: 'work', oauthProvider: null },
  { name: 'officeAddress', label: 'Office Address', type: 'text', icon: '🏢', category: 'work', oauthProvider: null },
  { name: 'upi', label: 'UPI', type: 'text', icon: '💸', category: 'payment', oauthProvider: null },
  { name: 'bankAccount', label: 'Bank Account', type: 'text', icon: '🏦', category: 'payment', oauthProvider: null },
  { name: 'crypto', label: 'Crypto', type: 'text', icon: '🪙', category: 'payment', oauthProvider: null },
  { name: 'home', label: 'Home Address', type: 'text', icon: '🏠', category: 'address', oauthProvider: null },
  { name: 'holidayHome', label: 'Holiday Home', type: 'text', icon: '🏖️', category: 'address', oauthProvider: null },
];

export default function ProfileModal({ profile, onClose, onSave, onQuickShare }: ProfileModalProps) {
  const [formData, setFormData] = useState<Partial<UserProfile>>(profile || {});
  const [activeTab, setActiveTab] = useState<'edit' | 'share'>('edit');
  const [verifications, setVerifications] = useState<Verifications>({
    email: false,
    instagram: false,
    facebook: false,
    linkedin: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch verification status
    fetch('/api/oauth/verify')
      .then(res => res.json())
      .then(data => {
        if (data.verifications) {
          setVerifications(data.verifications);
        }
      })
      .catch(err => console.error('Failed to fetch verifications:', err));
    
    // Listen for LinkedIn vanity name prompt event
    const handleLinkedInPrompt = () => {
      // Show LinkedIn vanity name prompt
      toast(
        (t) => {
          let inputValue = '';
          
          const handleSubmit = async () => {
            const username = inputValue.trim();
            if (username && username.length > 0) {
              const linkedinUrl = `https://linkedin.com/in/${username}`;
              const updatedData = { 
                ...formData, 
                linkedin: linkedinUrl,
                linkedinVerified: true
              };
              
              setFormData(updatedData);
              toast.dismiss(t.id);
              
              // Save to database immediately
              try {
                onSave(updatedData);
                
                toast.success(
                  () => (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                        <FaLinkedin className="text-white text-xl" />
                      </div>
                      <div>
                        <p className="font-bold text-white">LinkedIn verified & saved!</p>
                        <p className="text-sm text-gray-300">linkedin.com/in/{username}</p>
                      </div>
                    </div>
                  ),
                  {
                    duration: 3000,
                    style: {
                      background: 'linear-gradient(135deg, #0077b5 0%, #00a0dc 100%)',
                      padding: '16px',
                      borderRadius: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                    },
                  }
                );
              } catch {
                toast.error('Failed to save LinkedIn. Please try again.', {
                  style: {
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '12px',
                  },
                });
              }
            } else {
              toast.error('Please enter your LinkedIn username', {
                style: {
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: '12px',
                  padding: '12px',
                },
              });
            }
          };

          return (
            <div className="w-80">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-blue-600 to-blue-800 flex items-center justify-center shadow-lg">
                  <FaLinkedin className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Complete LinkedIn Setup</h3>
                  <p className="text-sm text-gray-300">Enter your username</p>
                </div>
              </div>
              
              <div className="mb-3 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
                <p className="text-xs text-blue-300">
                  Copy from your LinkedIn profile URL:<br />
                  <span className="text-white/60">linkedin.com/in/</span><span className="font-bold text-white">your-name-123456789</span>
                </p>
              </div>
              
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">linkedin.com/in/</span>
                <input
                  type="text"
                  autoFocus
                  placeholder="your-name-123456789"
                  onChange={(e) => (inputValue = e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit();
                    if (e.key === 'Escape') toast.dismiss(t.id);
                  }}
                  className="w-full bg-white/10 border-2 border-blue-400/50 focus:border-blue-400 text-white placeholder-gray-400 pl-36 pr-4 py-3 rounded-xl outline-none transition-all duration-300 backdrop-blur-sm text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 border border-white/20"
                >
                  Skip
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-3 bg-linear-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Save
                </button>
              </div>
            </div>
          );
        },
        {
          duration: Infinity,
          style: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            color: '#fff',
            padding: '24px',
            borderRadius: '20px',
            border: '2px solid rgba(0, 119, 181, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 119, 181, 0.4), 0 0 40px rgba(0, 160, 220, 0.2)',
            maxWidth: '400px',
          },
        }
      );
    };
    
    window.addEventListener('promptLinkedInVanityName', handleLinkedInPrompt);
    return () => {
      window.removeEventListener('promptLinkedInVanityName', handleLinkedInPrompt);
    };
  }, [formData, onSave]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    const updatedData = { ...formData, [fieldName]: fieldValue };
    
    // If field is cleared, also clear verification status
    if (!fieldValue || fieldValue.trim() === '') {
      // Clear verification flags when field is emptied
      if (fieldName === 'email') {
        updatedData.emailVerified = false;
        setVerifications({ ...verifications, email: false });
      } else if (fieldName === 'linkedin') {
        updatedData.linkedinVerified = false;
        setVerifications({ ...verifications, linkedin: false });
      } else if (fieldName === 'facebook') {
        updatedData.facebookVerified = false;
        setVerifications({ ...verifications, facebook: false });
      } else if (fieldName === 'instagram') {
        updatedData.instagramVerified = false;
        setVerifications({ ...verifications, instagram: false });
      }
    }
    
    setFormData(updatedData);
  };

  const handleOAuthConnect = async (provider: string) => {
    try {
      // For Google, Facebook, and LinkedIn - use NextAuth sign in (auto-fills profile)
      if (provider === 'google') {
        localStorage.setItem('profileModalOpen', 'true');
        await signIn('google', { callbackUrl: '/' });
      } else if (provider === 'facebook') {
        localStorage.setItem('profileModalOpen', 'true');
        await signIn('facebook', { callbackUrl: '/' });
      } else if (provider === 'linkedin') {
        // LinkedIn OAuth - authenticate first, then prompt for vanity name
        localStorage.setItem('profileModalOpen', 'true');
        localStorage.setItem('linkedinPromptNeeded', 'true');
        await signIn('linkedin', { callbackUrl: '/' });
      } else if (provider === 'instagram') {
        // Show beautiful Instagram username input toast
        toast(
          (t) => {
            let inputValue = '';
            
            const handleSubmit = async () => {
              const username = inputValue.trim().replace('@', '');
              if (username && username.length > 0) {
                const instagramUrl = `https://instagram.com/${username}`;
                const updatedData = { 
                  ...formData, 
                  instagram: instagramUrl 
                };
                
                setFormData(updatedData);
                toast.dismiss(t.id);
                
                // Save to database immediately
                try {
                  onSave(updatedData);
                  
                  toast.success(
                    () => (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                          <FaInstagram className="text-white text-xl" />
                        </div>
                        <div>
                          <p className="font-bold text-white">@{username} saved!</p>
                          <p className="text-sm text-gray-300">Instagram connected to your profile</p>
                        </div>
                      </div>
                    ),
                    {
                      duration: 3000,
                      style: {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '16px',
                        borderRadius: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                      },
                    }
                  );
                } catch {
                  toast.error('Failed to save Instagram. Please try again.', {
                    style: {
                      background: '#ef4444',
                      color: '#fff',
                      borderRadius: '12px',
                      padding: '12px',
                    },
                  });
                }
              } else {
                toast.error('Please enter a valid username', {
                  style: {
                    background: '#ef4444',
                    color: '#fff',
                    borderRadius: '12px',
                    padding: '12px',
                  },
                });
              }
            };

            return (
              <div className="w-80">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <FaInstagram className="text-white text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">Connect Instagram</h3>
                    <p className="text-sm text-gray-300">Enter your username</p>
                  </div>
                </div>
                
                <div className="relative mb-4">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-semibold">@</span>
                  <input
                    type="text"
                    autoFocus
                    placeholder="your_username"
                    onChange={(e) => (inputValue = e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSubmit();
                      if (e.key === 'Escape') toast.dismiss(t.id);
                    }}
                    className="w-full bg-white/10 border-2 border-pink-400/50 focus:border-pink-400 text-white placeholder-gray-400 pl-10 pr-4 py-3 rounded-xl outline-none transition-all duration-300 backdrop-blur-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all duration-300 border border-white/20"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-3 bg-linear-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Connect
                  </button>
                </div>
              </div>
            );
          },
          {
            duration: Infinity,
            style: {
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              color: '#fff',
              padding: '24px',
              borderRadius: '20px',
              border: '2px solid rgba(236, 72, 153, 0.3)',
              boxShadow: '0 20px 60px rgba(236, 72, 153, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)',
              maxWidth: '400px',
            },
          }
        );
      }
    } catch (error) {
      console.error('OAuth connection failed:', error);
      toast.error('Failed to connect. Please try again.', {
        style: {
          background: '#ef4444',
          color: '#fff',
          borderRadius: '12px',
          padding: '16px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        },
      });
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const updatedData = { ...formData, photo: reader.result as string };
        setFormData(updatedData);
        
        // Auto-save photo to database
        try {
          await onSave(updatedData);
          toast.success('Profile photo updated!', {
            duration: 2000,
            style: {
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '2px solid rgba(255, 255, 255, 0.2)',
            },
          });
        } catch {
          toast.error('Failed to update photo. Please try again.', {
            duration: 2000,
            style: {
              background: '#ef4444',
              color: '#fff',
              borderRadius: '12px',
              padding: '12px',
            },
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSave(formData);
      toast.success('Profile saved successfully!', {
        duration: 2000,
        style: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#fff',
          borderRadius: '12px',
          padding: '12px 16px',
          border: '2px solid rgba(255, 255, 255, 0.2)',
        },
      });
      onClose();
    } catch {
      toast.error('Failed to save profile. Please try again.', {
        duration: 2000,
        style: {
          background: '#ef4444',
          color: '#fff',
          borderRadius: '12px',
          padding: '12px',
        },
      });
    }
  };

  const categories = [
    { id: 'contact', label: 'Contact', icon: '📱' },
    { id: 'social', label: 'Socials', icon: '🌐' },
    { id: 'work', label: 'Work', icon: '💼' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'address', label: 'Address', icon: '🏠' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-2 sm:p-4 overflow-y-auto">
      <Toaster
        position="top-center"
        toastOptions={{
          className: '',
          style: {
            background: '#1a1a2e',
            color: '#fff',
          },
        }}
      />
      <div className="relative w-full max-w-5xl bg-linear-to-br from-black/90 via-cyan-950/40 to-purple-950/40 rounded-3xl shadow-[0_0_80px_rgba(34,211,238,0.3)] border border-cyan-400/50 backdrop-blur-xl p-6 sm:p-8 md:p-10 my-4 sm:my-8 animate-slideup max-h-[95vh] overflow-y-auto custom-scrollbar">
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-linear-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl animate-pulse pointer-events-none" />
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/80 hover:text-cyan-400 transition-all z-20 bg-black/40 hover:bg-cyan-400/20 rounded-full p-3 hover:scale-110 group border border-white/20 hover:border-cyan-400/50"
        >
          <FaTimes className="text-xl sm:text-2xl group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Header with Avatar and Camera */}
        <div className="relative flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8 pb-6 border-b border-cyan-400/30">
          <div className="relative group">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-linear-to-br from-cyan-400 via-cyan-600 to-cyan-900 p-1 shrink-0 shadow-[0_0_30px_rgba(34,211,238,0.5)] group-hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] transition-all duration-300">
              {formData.photo ? (
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-black/50">
                  <Image 
                    src={formData.photo} 
                    alt="Profile" 
                    width={112}
                    height={112}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-full rounded-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white font-bold text-3xl sm:text-4xl border-4 border-black/50">
                  {formData.name ? formData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-linear-to-r from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-white rounded-full p-2 sm:p-3 shadow-lg hover:scale-110 transition-all border-2 border-black group-hover:animate-bounce"
              >
                <FaCamera className="text-sm sm:text-lg" />
              </button>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold bg-linear-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent truncate mb-1">
              {formData.name || 'Your Profile'}
            </h2>
            <p className="text-cyan-300/90 text-sm sm:text-lg truncate font-medium">{formData.email || 'Add your details below'}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="relative flex gap-3 mb-6 sm:mb-8 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('edit')}
            className={`relative px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold transition-all text-sm sm:text-base whitespace-nowrap overflow-hidden group ${
              activeTab === 'edit'
                ? 'bg-linear-to-r from-cyan-400 to-cyan-600 text-white shadow-[0_0_25px_rgba(34,211,238,0.6)]'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/20'
            }`}
          >
            {activeTab === 'edit' && (
              <div className="absolute inset-0 bg-linear-to-r from-cyan-400/20 to-purple-400/20 animate-pulse" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              ✏️ Edit Profile
            </span>
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`relative px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold transition-all text-sm sm:text-base whitespace-nowrap overflow-hidden group ${
              activeTab === 'share'
                ? 'bg-linear-to-r from-cyan-400 via-cyan-600 to-cyan-900 text-white shadow-[0_0_25px_rgba(34,211,238,0.6)]'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/20'
            }`}
          >
            {activeTab === 'share' && (
              <div className="absolute inset-0 bg-linear-to-r from-cyan-400/20 to-cyan-600/20 animate-pulse" />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <FaShare /> Quick Share
            </span>
          </button>
        </div>

        {activeTab === 'edit' ? (
          <form onSubmit={handleSubmit} className="relative space-y-6 sm:space-y-8">
            <div className="max-h-[45vh] sm:max-h-[50vh] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
              {categories.map((category) => (
                <div key={category.id} className="space-y-4 sm:space-y-5">
                  <div className="sticky top-0 z-10 bg-linear-to-r from-black/95 via-cyan-950/50 to-purple-950/50 backdrop-blur-xl py-3 -mx-2 px-2 rounded-xl border-l-4 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                    <h3 className="text-xl sm:text-2xl font-extrabold bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-3">
                      <span className="text-2xl sm:text-3xl">{category.icon}</span>
                      {category.label}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    {allFields
                      .filter((f) => f.category === category.id)
                      .map((field) => {
                        const isVerified = verifications[field.name as keyof Verifications];
                        const hasOAuth = field.oauthProvider;
                        
                        return (
                          <div key={field.name} className="relative group">
                            <div className="absolute -inset-0.5 bg-linear-to-r from-cyan-400/20 to-purple-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300" />
                            <div className="relative">
                              <input
                                type={field.type}
                                name={field.name}
                                id={field.name}
                                value={(formData[field.name as keyof UserProfile] as string) || ''}
                                onChange={handleChange}
                                className="peer w-full bg-black/40 border-2 border-cyan-400/30 focus:border-cyan-400 text-white placeholder-transparent px-4 sm:px-5 pt-7 pb-3 sm:pt-8 sm:pb-4 rounded-2xl outline-none transition-all duration-300 focus:bg-black/60 backdrop-blur-md text-sm sm:text-base focus:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:border-cyan-400/50"
                                placeholder={field.label}
                              />
                              <label
                                htmlFor={field.name}
                                className="absolute left-4 sm:left-5 top-2 pointer-events-none transition-all duration-300 text-cyan-300/80 text-xs sm:text-sm font-semibold flex items-center gap-2"
                              >
                                <span className="text-base sm:text-lg">{field.icon}</span>
                                {field.label}
                                {isVerified && (
                                  <FaCheckCircle className="text-green-400 text-xs ml-1" title="Verified" />
                                )}
                              </label>
                              
                              {hasOAuth && (
                                <button
                                  type="button"
                                  onClick={() => handleOAuthConnect(field.oauthProvider!)}
                                  className={`absolute right-2 top-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                    isVerified
                                      ? 'bg-green-500/20 text-green-300 border border-green-400/50'
                                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 hover:bg-cyan-500/30'
                                  }`}
                                  title={isVerified ? 'Verified via OAuth' : 'Connect & Verify'}
                                >
                                  {isVerified ? (
                                    <span className="flex items-center gap-1">
                                      <FaCheckCircle /> Verified
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1">
                                      {field.oauthProvider === 'google' && <FaGoogle />}
                                      {field.oauthProvider === 'facebook' && <FaFacebook />}
                                      {field.oauthProvider === 'linkedin' && <FaLinkedin />}
                                      {field.oauthProvider === 'instagram' && <FaInstagram />}
                                      Connect
                                    </span>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="relative flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-cyan-400/30 mt-6">
              <button
                type="submit"
                className="relative flex-1 group overflow-hidden py-4 sm:py-5 rounded-2xl bg-linear-to-r from-cyan-400 via-cyan-600 to-cyan-900 text-white font-bold text-base sm:text-xl shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_50px_rgba(34,211,238,0.8)] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-linear-to-r from-cyan-300/0 via-white/20 to-cyan-300/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  💾 Save Profile
                </span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-4 sm:py-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/30 hover:border-white/50 transition-all backdrop-blur-md"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <QuickShareTab profile={formData} onQuickShare={onQuickShare} />
        )}
      </div>
    </div>
  );
}

function QuickShareTab({ profile, onQuickShare }: { profile: Partial<UserProfile> | null; onQuickShare: () => void }) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const handleQuickShare = () => {
    // Store selected fields in localStorage for the main page to use
    const selectedData: Record<string, string> = {};
    selectedFields.forEach((field) => {
      if (profile && profile[field as keyof UserProfile]) {
        selectedData[field] = profile[field as keyof UserProfile] as string;
      }
    });
    localStorage.setItem('quickShareData', JSON.stringify(selectedData));
    onQuickShare();
  };

  const categories = [
    { id: 'contact', label: 'Contact', icon: '📱' },
    { id: 'social', label: 'Socials', icon: '🌐' },
    { id: 'work', label: 'Work', icon: '💼' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'address', label: 'Address', icon: '🏠' },
  ];

  return (
    <div className="flex flex-col h-full max-h-[60vh]">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2 sm:pr-3 space-y-4 sm:space-y-6 custom-scrollbar">
        <div className="relative overflow-hidden rounded-2xl border-2 border-cyan-400/50 bg-linear-to-r from-cyan-400/10 via-purple-400/10 to-pink-400/10 backdrop-blur-md p-4 sm:p-5">
          <div className="absolute inset-0 bg-linear-to-r from-cyan-400/5 via-purple-400/5 to-pink-400/5 animate-pulse" />
          <p className="relative text-white/90 text-center text-sm sm:text-base font-semibold flex items-center justify-center gap-2">
            <span className="text-2xl">✨</span>
            Select fields you want to share and generate a QR code instantly!
          </p>
        </div>

        {categories.map((category) => {
          const categoryFields = allFields.filter((f) => f.category === category.id && profile && profile[f.name as keyof UserProfile]);
          if (categoryFields.length === 0) return null;

          return (
            <div key={category.id} className="space-y-3 sm:space-y-4">
            <div className="sticky top-0 z-10 bg-linear-to-r from-black/95 via-cyan-950/50 to-purple-950/50 backdrop-blur-xl py-3 -mx-2 px-2 rounded-xl border-l-4 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <h3 className="text-lg sm:text-xl font-extrabold bg-linear-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center gap-2">
                <span className="text-xl sm:text-2xl">{category.icon}</span>
                {category.label}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {categoryFields.map((field) => (
                <button
                  key={field.name}
                  onClick={() => toggleField(field.name)}
                  className={`relative overflow-hidden p-3 sm:p-4 rounded-2xl border-2 transition-all text-left group ${
                    selectedFields.includes(field.name)
                      ? 'bg-linear-to-br from-cyan-400/20 to-purple-400/20 border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)]'
                      : 'bg-black/30 border-cyan-400/30 hover:bg-black/50 hover:border-cyan-400/50'
                  }`}
                >
                  {selectedFields.includes(field.name) && (
                    <div className="absolute inset-0 bg-linear-to-r from-cyan-400/10 to-purple-400/10 animate-pulse" />
                  )}
                  <div className="relative flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <span className="text-xl sm:text-2xl shrink-0">{field.icon}</span>
                      <div className="min-w-0">
                        <div className="text-white font-bold text-sm sm:text-base">{field.label}</div>
                        <div className="text-cyan-300/80 text-xs sm:text-sm truncate">
                          {profile?.[field.name as keyof UserProfile] as string}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        selectedFields.includes(field.name)
                          ? 'bg-cyan-400 border-cyan-400 scale-110'
                          : 'border-cyan-400/40 group-hover:border-cyan-400/70'
                      }`}
                    >
                      {selectedFields.includes(field.name) && <span className="text-white text-sm font-bold">✓</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
      </div>

      {/* Fixed Button at Bottom */}
      <div className="shrink-0 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-cyan-400/30">
        <button
          onClick={handleQuickShare}
          disabled={selectedFields.length === 0}
          className={`w-full group overflow-hidden py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-xl shadow-lg transition-all ${
            selectedFields.length > 0
              ? 'bg-linear-to-r from-cyan-400 via-cyan-600 to-cyan-900 text-white hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] hover:scale-105 active:scale-95'
              : 'bg-white/10 text-white/30 cursor-not-allowed border-2 border-white/20'
          }`}
        >
          {selectedFields.length > 0 && (
            <div className="absolute inset-0 bg-linear-to-r from-cyan-300/0 via-white/20 to-cyan-300/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          )}
          <span className="relative z-10 flex items-center justify-center gap-2">
            <FaShare />
            <span className="hidden sm:inline">Generate QR with Selected Fields ({selectedFields.length})</span>
            <span className="sm:hidden">Generate QR ({selectedFields.length})</span>
          </span>
        </button>
      </div>
    </div>
  );
}
