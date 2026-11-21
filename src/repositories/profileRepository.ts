import type { UserProfile, AppSettings } from '../types/database';
import { dbService } from '../services/database';

export class ProfileRepository {
  public async getProfile(): Promise<UserProfile | null> {
    await dbService.initialize();

    if (dbService.isNative()) {
      const db = dbService.getDbConnection();
      if (!db) return null;
      const res = await db.query('SELECT * FROM profiles ORDER BY created_at DESC LIMIT 1;');
      if (res.values && res.values.length > 0) {
        const row = res.values[0];
        return {
          id: row.id,
          name: row.name,
          nativeLanguage: row.native_language,
          targetLanguage: row.target_language,
          cefrLevel: row.cefr_level,
          dailyGoalMinutes: row.daily_goal_minutes,
          learningReason: row.learning_reason,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          syncStatus: row.sync_status,
        };
      }
      return null;
    } else {
      // Local web fallback
      const profilesJson = localStorage.getItem('profiles');
      if (profilesJson) {
        const profiles: UserProfile[] = JSON.parse(profilesJson);
        return profiles.length > 0 ? profiles[0] : null;
      }
      return null;
    }
  }

  public async saveProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt' | 'syncStatus'>): Promise<UserProfile> {
    await dbService.initialize();

    const id = 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const now = new Date().toISOString();

    const newProfile: UserProfile = {
      ...profile,
      id,
      createdAt: now,
      updatedAt: now,
      syncStatus: 'local',
    };

    if (dbService.isNative()) {
      const db = dbService.getDbConnection();
      if (db) {
        await db.run(
          `INSERT INTO profiles (id, name, native_language, target_language, cefr_level, daily_goal_minutes, learning_reason, created_at, updated_at, sync_status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            newProfile.id,
            newProfile.name,
            newProfile.nativeLanguage,
            newProfile.targetLanguage,
            newProfile.cefrLevel,
            newProfile.dailyGoalMinutes,
            newProfile.learningReason,
            newProfile.createdAt,
            newProfile.updatedAt,
            newProfile.syncStatus,
          ]
        );
      }
    } else {
      const profilesJson = localStorage.getItem('profiles');
      const profiles: UserProfile[] = profilesJson ? JSON.parse(profilesJson) : [];
      profiles.unshift(newProfile);
      localStorage.setItem('profiles', JSON.stringify(profiles));
    }

    return newProfile;
  }
}

export class SettingsRepository {
  public async getSettings(userId: string): Promise<AppSettings | null> {
    await dbService.initialize();

    if (dbService.isNative()) {
      const db = dbService.getDbConnection();
      if (!db) return null;
      const res = await db.query('SELECT * FROM settings WHERE user_id = ? LIMIT 1;', [userId]);
      if (res.values && res.values.length > 0) {
        const row = res.values[0];
        return {
          id: row.id,
          userId: row.user_id,
          audioPlaybackSpeed: row.audio_playback_speed,
          autoPlayAudio: Boolean(row.auto_play_audio),
          offlineModeOnly: Boolean(row.offline_mode_only),
          theme: row.theme,
          aiProvider: row.ai_provider,
          apiKey: row.api_key,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        };
      }
      return null;
    } else {
      const settingsJson = localStorage.getItem('settings');
      if (settingsJson) {
        const settingsList: AppSettings[] = JSON.parse(settingsJson);
        return settingsList.find(s => s.userId === userId) || null;
      }
      return null;
    }
  }

  public async saveSettings(settings: Omit<AppSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppSettings> {
    await dbService.initialize();

    const id = 'set_' + Date.now().toString(36);
    const now = new Date().toISOString();

    const newSettings: AppSettings = {
      ...settings,
      id,
      createdAt: now,
      updatedAt: now,
    };

    if (dbService.isNative()) {
      const db = dbService.getDbConnection();
      if (db) {
        await db.run(
          `INSERT OR REPLACE INTO settings (id, user_id, audio_playback_speed, auto_play_audio, offline_mode_only, theme, ai_provider, api_key, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
          [
            newSettings.id,
            newSettings.userId,
            newSettings.audioPlaybackSpeed,
            newSettings.autoPlayAudio ? 1 : 0,
            newSettings.offlineModeOnly ? 1 : 0,
            newSettings.theme,
            newSettings.aiProvider,
            newSettings.apiKey || null,
            newSettings.createdAt,
            newSettings.updatedAt,
          ]
        );
      }
    } else {
      const settingsJson = localStorage.getItem('settings');
      let settingsList: AppSettings[] = settingsJson ? JSON.parse(settingsJson) : [];
      settingsList = settingsList.filter(s => s.userId !== settings.userId);
      settingsList.push(newSettings);
      localStorage.setItem('settings', JSON.stringify(settingsList));
    }

    return newSettings;
  }
}

export const profileRepo = new ProfileRepository();
export const settingsRepo = new SettingsRepository();
