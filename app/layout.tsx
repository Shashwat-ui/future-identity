"use client";
import "./styles/globals.css";
import { useState, useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import ProfileAvatar from "./components/profile/ProfileAvatar";
import ProfileModal from "./components/profile/ProfileModal";
import ModernSpinner from "./components/ui/ModernSpinner";
import type { UserProfile } from "./lib/profile";

function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const loading = status === "loading";

  useEffect(() => {
    // Load user profile if authenticated
    if (session?.user) {
      const userId = (session.user as unknown as { id?: string }).id;
      if (!userId) return;
      fetch("/api/profile/get", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.profile) {
            setProfile(data.profile);
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
        })
        .catch((err) => {
          console.error("Error loading profile:", err);
        });
    }
  }, [session?.user]);

  const handleSaveProfile = async (data: Partial<UserProfile>): Promise<void> => {
    const userId = session?.user ? (session.user as unknown as { id?: string }).id : undefined;
    if (!userId) {
      console.error("No user session");
      throw new Error("No user session");
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
      {loading ? (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-linear-to-br from-gray-900 via-purple-900/40 to-black">
          <ModernSpinner />
        </div>
      ) : (
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
        </>
      )}

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