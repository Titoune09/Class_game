/**
 * Service de gestion du localStorage avec gestion d'erreurs robuste
 * Compatible SSR Next.js (détecte si window existe)
 */

export interface StorageService {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  clearAll(): void;
  has(key: string): boolean;
}

class LocalStorageService implements StorageService {
  private isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  get<T>(key: string): T | null {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (item === null) {
        return null;
      }
      
      const parsed = JSON.parse(item);
      
      // Conversion des dates
      return this.parseDates(parsed);
    } catch (error) {
      console.error(`Error reading from localStorage (key: ${key}):`, error);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (!this.isAvailable()) {
      return;
    }

    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
        // TODO: Implémenter nettoyage des anciennes données
      } else {
        console.error(`Error writing to localStorage (key: ${key}):`, error);
      }
    }
  }

  remove(key: string): void {
    if (!this.isAvailable()) {
      return;
    }

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (key: ${key}):`, error);
    }
  }

  clearAll(): void {
    if (!this.isAvailable()) {
      return;
    }

    try {
      // Ne supprimer que les clés de l'app
      const keys = Object.keys(window.localStorage);
      keys.forEach(key => {
        if (key.startsWith('app_')) {
          window.localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  has(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    return window.localStorage.getItem(key) !== null;
  }

  private parseDates(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj === 'string') {
      // Détection de date ISO
      const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      if (isoDateRegex.test(obj)) {
        return new Date(obj);
      }
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.parseDates(item));
    }

    if (typeof obj === 'object') {
      const result: any = {};
      for (const key in obj) {
        result[key] = this.parseDates(obj[key]);
      }
      return result;
    }

    return obj;
  }
}

// Export singleton
export const storageService = new LocalStorageService();

// Clés utilisées dans l'app
export const STORAGE_KEYS = {
  SUBJECTS: 'app_subjects',
  PLANNING_SESSIONS: 'app_planning_sessions',
  POMODORO_STATS: 'app_pomodoro_stats',
  USER_PROGRESS: 'app_user_progress',
  CLASS_SESSIONS: 'app_class_sessions',
  CLASS_STATS: 'app_class_stats',
  BADGES: 'app_badges',
  CURRENT_POMODORO: 'app_current_pomodoro',
  ACTIVE_CLASS_SESSION: 'app_active_class_session',
} as const;
