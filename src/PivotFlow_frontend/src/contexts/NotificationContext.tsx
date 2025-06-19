import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface NotificationCategory {
  main: 'nft' | 'gas' | 'portfolio' | 'system';
  sub?: string;
}

export interface Notification {
  id: string;
  type: NotificationCategory;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
  action?: {
    label: string;
    url: string;
  };
  groupId?: string;
  expiresAt?: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  addNotifications: (notifications: Omit<Notification, 'id' | 'timestamp' | 'read'>[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
  clearNotifications: (type?: NotificationCategory['main']) => void;
  getUnreadCount: (type?: NotificationCategory['main']) => number;
  getFilteredNotifications: (type: NotificationCategory['main'], sub?: string) => Notification[];
  setNotificationSound: (enabled: boolean) => void;
}

const MAX_NOTIFICATIONS = 100;
const NOTIFICATION_THROTTLE = 1000; // 1 second between notifications

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('notificationSound') !== 'false';
  });

  const sound = useRef(new Audio('/notification.mp3'));
  const notificationQueue = useRef<Omit<Notification, 'id' | 'timestamp' | 'read'>[]>([]);
  const lastNotificationTime = useRef<number>(0);

  // Process notification queue
  const processQueue = useCallback(() => {
    const now = Date.now();
    if (notificationQueue.current.length > 0 && now - lastNotificationTime.current >= NOTIFICATION_THROTTLE) {
      const notification = notificationQueue.current.shift();
      if (notification) {
        const newNotification = {
          ...notification,
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          read: false,
        };

        setNotifications(prev => {
          // Remove expired notifications
          const validNotifications = prev.filter(n => 
            !n.expiresAt || new Date(n.expiresAt) > new Date()
          );

          // Enforce maximum notifications limit
          const notifications = [newNotification, ...validNotifications]
            .slice(0, MAX_NOTIFICATIONS);

          return notifications;
        });

        lastNotificationTime.current = now;

        if (soundEnabled && (notification.priority === 'high' || !notification.priority)) {
          sound.current.currentTime = 0;
          sound.current.play().catch(() => {
            // Ignore errors - browser might block autoplay
          });
        }

        // Show browser notification if permitted
        if (Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/logo2.svg',
            tag: notification.groupId
          });
        }
      }
    }
  }, [soundEnabled]);

  // Process queue periodically
  useEffect(() => {
    const interval = setInterval(processQueue, NOTIFICATION_THROTTLE);
    return () => clearInterval(interval);
  }, [processQueue]);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Save sound preference
  useEffect(() => {
    localStorage.setItem('notificationSound', String(soundEnabled));
  }, [soundEnabled]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    notificationQueue.current.push(notification);
    processQueue();
  }, [processQueue]);

  const addNotifications = useCallback((newNotifications: Omit<Notification, 'id' | 'timestamp' | 'read'>[]) => {
    notificationQueue.current.push(...newNotifications);
    processQueue();
  }, [processQueue]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  const clearNotifications = (type?: NotificationCategory['main']) => {
    if (type) {
      setNotifications(prev => prev.filter(notif => notif.type.main !== type));
    } else {
      setNotifications([]);
    }
  };

  const getUnreadCount = (type?: NotificationCategory['main']) => {
    return notifications.filter(
      notif => !notif.read && (type ? notif.type.main === type : true)
    ).length;
  };

  const getFilteredNotifications = useCallback((type: NotificationCategory['main'], sub?: string) => {
    return notifications.filter(notif => 
      notif.type.main === type && (!sub || notif.type.sub === sub)
    );
  }, [notifications]);

  const setNotificationSound = useCallback((enabled: boolean) => {
    setSoundEnabled(enabled);
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        addNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        clearNotifications,
        getUnreadCount,
        getFilteredNotifications,
        setNotificationSound,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
