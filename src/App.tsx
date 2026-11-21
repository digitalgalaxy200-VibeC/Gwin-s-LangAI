import { useEffect, useState } from 'react';
import type { UserProfile } from './types/database';
import { profileRepo } from './repositories/profileRepository';
import { tursoService } from './services/tursoService';
import { PublicLandingPage } from './components/PublicLandingPage';
import { AuthModal } from './components/AuthModal';
import { SuperAdminDashboard } from './components/SuperAdminDashboard';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Public landing vs in-app state
  const [showLanding, setShowLanding] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    async function loadInitialProfile() {
      try {
        const existingProfile = await profileRepo.getProfile();
        const tursoUser = tursoService.getCurrentUser();

        // If no user is logged in or profile doesn't exist, show Public Landing Page first
        if (!tursoUser && !existingProfile) {
          setShowLanding(true);
        } else if (tursoUser) {
          // Sync profile state with Turso authenticated user
          setProfile({
            id: tursoUser.id,
            name: tursoUser.name,
            nativeLanguage: tursoUser.nativeLang,
            targetLanguage: (tursoUser.targetLang as any) || 'fr',
            cefrLevel: tursoUser.cefrLevel as any,
            dailyGoalMinutes: tursoUser.dailyGoal,
            learningReason: 'career',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            syncStatus: 'synced',
          });
          setShowLanding(false);
        } else if (existingProfile) {
          setProfile(existingProfile);
          setShowLanding(false);
        }
      } catch (err) {
        console.error('Failed to load profile from database:', err);
        setShowLanding(true);
      } finally {
        setLoading(false);
      }
    }

    loadInitialProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  // 1. First-time or Guest Visitor: Show High-Impact Landing Page
  if (showLanding || !profile) {
    return (
      <div className="min-h-screen bg-slate-950">
        <PublicLandingPage
          onGetStarted={() => {
            setAuthInitialMode('register');
            setIsAuthOpen(true);
          }}
          onSignIn={() => {
            setAuthInitialMode('login');
            setIsAuthOpen(true);
          }}
        />

        <AuthModal
          isOpen={isAuthOpen}
          initialMode={authInitialMode}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={(u) => {
            setProfile({
              id: u.id,
              name: u.name,
              nativeLanguage: u.nativeLang,
              targetLanguage: (u.targetLang as any) || 'fr',
              cefrLevel: u.cefrLevel as any,
              dailyGoalMinutes: u.dailyGoal,
              learningReason: 'career',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              syncStatus: 'synced',
            });
            setShowLanding(false);

            // If superadmin, automatically open admin dashboard
            if (u.role === 'superadmin') {
              setIsAdminOpen(true);
            }
          }}
        />

        <SuperAdminDashboard
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      </div>
    );
  }

  // 2. Authenticated Learner: Enter Main App Dashboard
  return (
    <div className="min-h-screen bg-slate-100">
      <Dashboard profile={profile} />
    </div>
  );
}
