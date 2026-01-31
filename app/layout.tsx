"use client";
import "./styles/globals.css";
import { useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import ProfileAvatar from "./components/profile/ProfileAvatar";
import ProfileModal from "./components/profile/ProfileModal";
import type { UserProfile } from "./lib/profile";

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Generate or retrieve unique user ID
    let uid = localStorage.getItem('anonymousUserId');
    if (!uid) {
      // Generate unique ID for this user
      uid = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('anonymousUserId', uid);
    }
    setUserId(uid);

    // Load user profile from database
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/profile/get", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: uid }),
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfile(data.profile);
          }
        }
        
        // Check if modal should be reopened after OAuth redirect
        if (localStorage.getItem('profileModalOpen') === 'true') {
          setShowProfileModal(true);
          localStorage.removeItem('profileModalOpen');
          
          // Check if LinkedIn prompt is needed
          if (localStorage.getItem('linkedinPromptNeeded') === 'true') {
            localStorage.removeItem('linkedinPromptNeeded');
            // Trigger LinkedIn vanity name prompt after modal opens
            setTimeout(() => {
              window.dispatchEvent(new CustomEvent('promptLinkedInVanityName'));
            }, 500);
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };

    loadProfile();
  }, []);

  const handleSaveProfile = async (data: Partial<UserProfile>): Promise<void> => {
    if (!userId) {
      console.error("No user ID available");
      throw new Error("User ID not initialized");
    }

    try {
      const res = await fetch("/api/profile/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...data }),
      });
      
      if (!res.ok) {
        console.error("Error saving profile: HTTP", res.status);
        throw new Error("Failed to save profile");
      }

      const result = await res.json();
      if (!result.success || !result.profile) {
        console.error("Error saving profile: unexpected response", result);
        throw new Error("Failed to save profile");
      }

      setProfile(result.profile);
      // Dispatch custom event to notify page component
      window.dispatchEvent(new CustomEvent("profileUpdated", { detail: result.profile }));
    } catch (err) {
      console.error("Error saving profile:", err);
      throw err instanceof Error ? err : new Error("Failed to save profile");
    }
  };

  const handleQuickShare = () => {
    setShowProfileModal(false);
    // Dispatch event to trigger quick share from profile
    window.dispatchEvent(new CustomEvent("quickShareFromProfile"));
  };

  return (
    <>
      {/* Header with Profile Avatar (hidden on scan/shared details page) */}
      {pathname !== "/scan" && (
        <header className="fixed top-0 right-0 p-4 z-40">
          <ProfileAvatar
            photo={profile?.photo}
            name={profile?.name}
            onClick={() => setShowProfileModal(true)}
          />
        </header>
      )}

      {children}

      {showProfileModal && (
        <ProfileModal
          profile={profile}
          onClose={() => setShowProfileModal(false)}
          onSave={handleSaveProfile}
          onQuickShare={handleQuickShare}
        />
      )}
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-hidden">
        <SessionProvider>
          <RootLayoutInner>{children}</RootLayoutInner>
        </SessionProvider>
      </body>
    </html>
  );
}