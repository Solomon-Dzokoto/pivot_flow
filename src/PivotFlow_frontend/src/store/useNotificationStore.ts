import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { toast } from 'sonner';

export type NotificationType = 'nft' | 'gas' | 'portfolio' | 'system';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  actions: {
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
    markAsRead: (id: string) => void;
    deleteNotification: (id: string) => void;
    clearAll: () => void;
  };
}

export const useNotificationStore = create<NotificationState>()(
  immer((set) => ({
    notifications: [],
    actions: {
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date(),
          read: false,
        };

        set((state) => {
          state.notifications.unshift(newNotification);
        });

        // Show toast notification
        toast(notification.title, {
          description: notification.message,
          duration: 5000,
        });

        // Show browser notification if permitted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
          });
        }
      },
      markAsRead: (id) =>
        set((state) => {
          const notification = state.notifications.find((n:Notification) => n.id === id);
          if (notification) {
            notification.read = true;
          }
        }),
      deleteNotification: (id) =>
        set((state) => {
          state.notifications = state.notifications.filter((n:Notification) => n.id !== id);
        }),
      clearAll: () =>
        set((state) => {
          state.notifications = [];
        }),
    },
  }))
);
