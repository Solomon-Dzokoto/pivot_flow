export interface Notification {
  id: string;
  type: 'nft' | 'gas' | 'portfolio' | 'system';
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
}

export interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
  clearNotifications: (type?: 'nft' | 'gas' | 'portfolio' | 'system') => void;
  getUnreadCount: (type?: 'nft' | 'gas' | 'portfolio' | 'system') => number;
  getFilteredNotifications: (type: 'nft' | 'gas' | 'portfolio' | 'system') => Notification[];
}
