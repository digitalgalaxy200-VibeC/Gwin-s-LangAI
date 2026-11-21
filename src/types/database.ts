export interface UserProfile {
  id: string;
  name: string;
  nativeLanguage: string;
  targetLanguage: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  dailyGoalMinutes: number;
  learningReason: string;
  createdAt: string;
  updatedAt: string;
  syncStatus: 'local' | 'synced' | 'pending';
}

export interface AppSettings {
  id: string;
  userId: string;
  audioPlaybackSpeed: number;
  autoPlayAudio: boolean;
  offlineModeOnly: boolean;
  theme: 'light' | 'dark' | 'system';
  aiProvider: 'deepseek' | 'openai' | 'mock';
  apiKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SyncEvent {
  id: string;
  table: string;
  recordId: string;
  action: 'insert' | 'update' | 'delete';
  payload: string;
  status: 'pending' | 'synced' | 'failed';
  attempts: number;
  createdAt: string;
}
