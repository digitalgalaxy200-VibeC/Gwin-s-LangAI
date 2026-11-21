import { useEffect, useState } from 'react';
import type { UserProfile } from './types/database';
import { profileRepo } from './repositories/profileRepository';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';

export function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInitialProfile() {
      try {
        const existingProfile = await profileRepo.getProfile();
        setProfile(existingProfile);
      } catch (err) {
        console.error('Failed to load profile from database:', err);
      } finally {
        setLoading(false);
      }
    }

    loadInitialProfile();
  }, []);

  const handleOnboardingComplete = async (newProfileData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>) => {
    try {
      const savedProfile = await profileRepo.saveProfile(newProfileData);
      setProfile(savedProfile);
    } catch (err) {
      console.error('Failed to save profile:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {!profile ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <Dashboard profile={profile} />
      )}
    </div>
  );
}

export default App;
