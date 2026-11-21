import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { SyncEvent, UserProfile } from '../types/database';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

class SupabaseSyncService {
  private client: SupabaseClient | null = null;
  private isConfigured: boolean = false;

  constructor() {
    this.loadStoredConfig();
  }

  private loadStoredConfig() {
    const raw = localStorage.getItem('supabase_config');
    if (raw) {
      try {
        const config: SupabaseConfig = JSON.parse(raw);
        if (config.url && config.anonKey) {
          this.client = createClient(config.url, config.anonKey);
          this.isConfigured = true;
        }
      } catch (e) {
        console.warn('Failed to parse Supabase config');
      }
    }
  }

  public configure(url: string, anonKey: string): boolean {
    if (!url || !anonKey) return false;
    try {
      this.client = createClient(url, anonKey);
      this.isConfigured = true;
      localStorage.setItem('supabase_config', JSON.stringify({ url, anonKey }));
      return true;
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      return false;
    }
  }

  public isReady(): boolean {
    return this.isConfigured && this.client !== null;
  }

  public getPendingQueue(): SyncEvent[] {
    const raw = localStorage.getItem('sync_events');
    return raw ? JSON.parse(raw) : [];
  }

  public enqueueChange(table: string, recordId: string, action: 'insert' | 'update' | 'delete', data: any): void {
    const queue = this.getPendingQueue();
    const event: SyncEvent = {
      id: 'sync_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      table,
      recordId,
      action,
      payload: JSON.stringify(data),
      status: 'pending',
      attempts: 0,
      createdAt: new Date().toISOString(),
    };
    queue.push(event);
    localStorage.setItem('sync_events', JSON.stringify(queue));
  }

  /**
   * Additive Sync:
   * Pushes local pending events to Supabase without destroying or resetting local data.
   */
  public async syncPendingQueue(profile: UserProfile): Promise<{ syncedCount: number; errors: number }> {
    if (!this.isReady() || !this.client) {
      return { syncedCount: 0, errors: 0 };
    }

    const queue = this.getPendingQueue();
    if (queue.length === 0) return { syncedCount: 0, errors: 0 };

    let synced = 0;
    let errors = 0;
    const remainingQueue: SyncEvent[] = [];

    for (const event of queue) {
      try {
        const payload = JSON.parse(event.payload);
        
        // Example additive upsert into user_profiles or user_learning_data
        const { error } = await this.client
          .from('user_sync_logs')
          .insert({
            user_id: profile.id,
            table_name: event.table,
            record_id: event.recordId,
            action: event.action,
            data: payload,
            created_at: event.createdAt,
          });

        if (error) {
          event.attempts += 1;
          if (event.attempts < 3) {
            remainingQueue.push(event);
          }
          errors++;
        } else {
          synced++;
        }
      } catch (e) {
        errors++;
        remainingQueue.push(event);
      }
    }

    localStorage.setItem('sync_events', JSON.stringify(remainingQueue));
    return { syncedCount: synced, errors };
  }
}

export const syncService = new SupabaseSyncService();
