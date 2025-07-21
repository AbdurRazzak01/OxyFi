import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  level: number;
  carbonOffset: number;
  treesPlanted: number;
  projectsSupported: number;
  totalInvestment: number;
  verified: boolean;
  badges: string[];
  joinDate: string;
  bio?: string;
  location?: string;
  socialStats: {
    followers: number;
    following: number;
    posts: number;
  };
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'social' | 'investment';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  icon?: string;
}

export interface MessageItem {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  read: boolean;
  type: 'direct' | 'group' | 'system';
  conversationId: string;
}

interface UserStore {
  // User Profile
  user: UserProfile | null;
  isAuthenticated: boolean;
  
  // Notifications
  notifications: NotificationItem[];
  unreadNotifications: number;
  
  // Messages
  messages: MessageItem[];
  unreadMessages: number;
  
  // UI State
  showAiAgent: boolean;
  
  // Actions
  setUser: (user: UserProfile | null) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addMessage: (message: Omit<MessageItem, 'id' | 'timestamp'>) => void;
  markMessageRead: (id: string) => void;
  markAllMessagesRead: () => void;
  toggleAiAgent: () => void;
  updateUserLevel: (newLevel: number) => void;
  updateCarbonOffset: (offset: number) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      notifications: [],
      unreadNotifications: 0,
      messages: [],
      unreadMessages: 0,
      showAiAgent: false,

      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),

      addNotification: (notification) => {
        const newNotification: NotificationItem = {
          ...notification,
          id: Date.now().toString(),
          timestamp: new Date(),
        };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50), // Keep last 50
          unreadNotifications: state.unreadNotifications + 1,
        }));
      },

      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => 
          n.id === id ? { ...n, read: true } : n
        ),
        unreadNotifications: Math.max(0, state.unreadNotifications - 1),
      })),

      markAllNotificationsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true })),
        unreadNotifications: 0,
      })),

      addMessage: (message) => {
        const newMessage: MessageItem = {
          ...message,
          id: Date.now().toString(),
          timestamp: new Date(),
        };
        
        set((state) => ({
          messages: [newMessage, ...state.messages].slice(0, 100), // Keep last 100
          unreadMessages: state.unreadMessages + 1,
        }));
      },

      markMessageRead: (id) => set((state) => ({
        messages: state.messages.map(m => 
          m.id === id ? { ...m, read: true } : m
        ),
        unreadMessages: Math.max(0, state.unreadMessages - 1),
      })),

      markAllMessagesRead: () => set((state) => ({
        messages: state.messages.map(m => ({ ...m, read: true })),
        unreadMessages: 0,
      })),

      toggleAiAgent: () => set((state) => ({
        showAiAgent: !state.showAiAgent,
      })),

      updateUserLevel: (newLevel) => set((state) => ({
        user: state.user ? { ...state.user, level: newLevel } : null,
      })),

      updateCarbonOffset: (offset) => set((state) => ({
        user: state.user ? { ...state.user, carbonOffset: offset } : null,
      })),
    }),
    {
      name: 'greenchain-user-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        notifications: state.notifications,
        messages: state.messages,
      }),
    }
  )
);

// Mock user data for development
export const mockUser: UserProfile = {
  id: '1',
  username: 'EcoWarrior2024',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  level: 7,
  carbonOffset: 2547.8,
  treesPlanted: 1234,
  projectsSupported: 15,
  totalInvestment: 25000,
  verified: true,
  badges: ['Early Adopter', 'Forest Guardian', 'Carbon Neutral'],
  joinDate: '2024-01-15',
  bio: 'Passionate about reforestation and climate action. Building a greener future one tree at a time! 🌱',
  location: 'San Francisco, CA',
  socialStats: {
    followers: 1247,
    following: 892,
    posts: 156,
  },
};