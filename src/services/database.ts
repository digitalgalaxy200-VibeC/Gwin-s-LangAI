import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const DB_NAME = 'french_tutor_db';

class DatabaseService {
  private sqliteConnection: SQLiteConnection | null = null;
  private db: SQLiteDBConnection | null = null;
  private isInitialized = false;

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    const platform = Capacitor.getPlatform();

    if (platform === 'web') {
      console.log('[DB] Running in Web environment with local storage fallback.');
      this.initWebStorage();
      this.isInitialized = true;
      return;
    }

    try {
      this.sqliteConnection = new SQLiteConnection(CapacitorSQLite);
      const isConn = await this.sqliteConnection.isConnection(DB_NAME, false);
      
      if (isConn.result) {
        this.db = await this.sqliteConnection.retrieveConnection(DB_NAME, false);
      } else {
        this.db = await this.sqliteConnection.createConnection(
          DB_NAME,
          false,
          'no-encryption',
          1,
          false
        );
      }

      await this.db.open();
      await this.runMigrations();
      this.isInitialized = true;
      console.log('[DB] Native SQLite initialized and migrations applied.');
    } catch (err) {
      console.error('[DB] Native SQLite initialization failed, falling back to local storage:', err);
      this.initWebStorage();
      this.isInitialized = true;
    }
  }

  private initWebStorage() {
    // Ensure initial storage structures exist for Web/Browser dev
    if (!localStorage.getItem('profiles')) {
      localStorage.setItem('profiles', JSON.stringify([]));
    }
    if (!localStorage.getItem('settings')) {
      localStorage.setItem('settings', JSON.stringify([]));
    }
    if (!localStorage.getItem('sync_events')) {
      localStorage.setItem('sync_events', JSON.stringify([]));
    }
  }

  private async runMigrations(): Promise<void> {
    if (!this.db) return;

    const migrationSQL = `
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        native_language TEXT NOT NULL,
        target_language TEXT NOT NULL DEFAULT 'fr',
        cefr_level TEXT NOT NULL DEFAULT 'A1',
        daily_goal_minutes INTEGER NOT NULL DEFAULT 15,
        learning_reason TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        sync_status TEXT NOT NULL DEFAULT 'local'
      );

      CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        audio_playback_speed REAL NOT NULL DEFAULT 1.0,
        auto_play_audio INTEGER NOT NULL DEFAULT 1,
        offline_mode_only INTEGER NOT NULL DEFAULT 0,
        theme TEXT NOT NULL DEFAULT 'system',
        ai_provider TEXT NOT NULL DEFAULT 'mock',
        api_key TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES profiles (id)
      );

      CREATE TABLE IF NOT EXISTS sync_events (
        id TEXT PRIMARY KEY,
        table_name TEXT NOT NULL,
        record_id TEXT NOT NULL,
        action TEXT NOT NULL,
        payload TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        attempts INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      );
    `;

    await this.db.execute(migrationSQL);
  }

  public getDbConnection(): SQLiteDBConnection | null {
    return this.db;
  }

  public isNative(): boolean {
    return Capacitor.getPlatform() !== 'web' && this.db !== null;
  }
}

export const dbService = new DatabaseService();
