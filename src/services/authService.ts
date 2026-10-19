import type { UserProfile, ChatMessage, UserStats } from '../types';

const ACTIVE_USER_KEY = 'talksphere_active_user';
const USERS_LIST_KEY = 'talksphere_registered_users';

export interface UserPersistedData {
  profile: UserProfile;
  stats: UserStats;
  messages: ChatMessage[];
  practiceMinutes: number;
}

// Pre-configured default demo Google accounts for instant 1-click testing
export const DEMO_GOOGLE_ACCOUNTS: Omit<UserProfile, 'createdAt' | 'lastLogin' | 'totalPracticeMinutes' | 'totalSessions'>[] = [
  {
    id: 'google-user-101',
    name: 'Arman Ahmed',
    email: 'arman.ahmed@gmail.com',
    picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    provider: 'google',
    proficiencyLevel: 'beginner',
  },
  {
    id: 'google-user-102',
    name: 'Sophia Vance',
    email: 'sophia.vance@gmail.com',
    picture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    provider: 'google',
    proficiencyLevel: 'intermediate',
  },
];

class AuthService {
  private activeUser: UserProfile | null = null;
  private listeners: ((user: UserProfile | null) => void)[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ACTIVE_USER_KEY);
      if (saved) {
        try {
          this.activeUser = JSON.parse(saved);
        } catch {
          this.activeUser = null;
        }
      }
    }
  }

  public getActiveUser(): UserProfile | null {
    return this.activeUser;
  }

  public subscribe(callback: (user: UserProfile | null) => void): () => void {
    this.listeners.push(callback);
    callback(this.activeUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.activeUser));
  }

  // Login or Register with Google Account
  public loginWithGoogle(account: {
    name: string;
    email: string;
    picture?: string;
    id?: string;
  }): UserProfile {
    const existingUsers = this.getRegisteredUsers();
    const existing = existingUsers.find((u) => u.email.toLowerCase() === account.email.toLowerCase());

    const now = Date.now();
    let profile: UserProfile;

    if (existing) {
      profile = {
        ...existing,
        name: account.name || existing.name,
        picture: account.picture || existing.picture,
        lastLogin: now,
      };
    } else {
      profile = {
        id: account.id || `google_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: account.name,
        email: account.email,
        picture:
          account.picture ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(account.name)}&backgroundColor=4f46e5`,
        provider: 'google',
        createdAt: now,
        lastLogin: now,
        totalPracticeMinutes: 0,
        totalSessions: 1,
        proficiencyLevel: 'beginner',
      };
      existingUsers.push(profile);
    }

    this.activeUser = profile;
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(profile));
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(existingUsers));
    this.notify();
    return profile;
  }

  public logout(): void {
    this.activeUser = null;
    localStorage.removeItem(ACTIVE_USER_KEY);
    this.notify();
  }

  public getRegisteredUsers(): UserProfile[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(USERS_LIST_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // Get user-specific practicing and diagnostic data
  public getUserData(userId: string): UserPersistedData | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(`talksphere_userdata_${userId}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  // Save practicing data under user account
  public saveUserData(
    userId: string,
    data: {
      stats: UserStats;
      messages: ChatMessage[];
    }
  ): void {
    if (typeof window === 'undefined' || !this.activeUser) return;
    try {
      const persisted: UserPersistedData = {
        profile: this.activeUser,
        stats: data.stats,
        messages: data.messages,
        practiceMinutes: data.stats.sessionMinutes,
      };
      localStorage.setItem(`talksphere_userdata_${userId}`, JSON.stringify(persisted));
    } catch (e) {
      console.warn('Failed to save user data:', e);
    }
  }
}

export const authService = new AuthService();
