import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs,  TabsList, TabsTrigger } from '../ui/tabs';
import {
  Bell,
  X,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Zap,
  // Filter,
  // Trash2,
  Settings,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { ScrollArea } from '../ui/scroll-area';
import { useNotifications } from '../../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../ui/badge';
import { toast } from '../../hooks/use-toast';
import { Switch } from '../ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import type { Notification, NotificationCategory } from '../../contexts/NotificationContext';

type NotificationTab = NotificationCategory['main'] | 'all';

interface NotificationIconProps {
  type: NotificationCategory['main'];
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ type }) => {
  switch (type) {
    case 'nft':
      return <Zap className="h-4 w-4 text-purple-400" />;
    case 'gas':
      return <AlertCircle className="h-4 w-4 text-yellow-400" />;
    case 'portfolio':
      return <Wallet className="h-4 w-4 text-green-400" />;
    case 'system':
      return <CheckCircle2 className="h-4 w-4 text-blue-400" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    clearNotifications,
    getUnreadCount,
    getFilteredNotifications,
    setNotificationSound,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<NotificationTab>('all')
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('notificationSound') !== 'false';
  });

  const currentNotifications = currentTab === 'all' 
    ? notifications 
    : getFilteredNotifications(currentTab);

  const unreadCount = getUnreadCount();

  const handleTabChange = (value: string) => {
    setCurrentTab(value as NotificationTab);
  };

  const handleSoundToggle = (enabled: boolean) => {
    setSoundEnabled(enabled);
    setNotificationSound(enabled);
  };

  const requestNotificationPermission = async () => {
    try {
      const permission = await window.Notification.requestPermission();
      if (permission === 'granted') {
        toast({
          title: 'Notifications enabled!',
          description: "You'll now receive notifications when important events occur.",
        });
      }
    } catch {
      toast({
        title: 'Failed to enable notifications',
        description: "Please check your browser settings and try again.",
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (isOpen && notifications.some(n => !n.read)) {
      markAllAsRead();
    }
  }, [isOpen, notifications, markAllAsRead]);

  const renderNotificationItem = (notification: Notification) => (
    <div
      key={notification.id}
      className={`p-4 rounded-lg transition-colors ${
        notification.read ? 'bg-gray-800/50' : 'bg-gray-800'
      } ${notification.priority === 'high' ? 'border-l-2 border-red-500' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <NotificationIcon type={notification.type.main} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="font-medium truncate">{notification.title}</h4>
            <button
              onClick={() => deleteNotification(notification.id)}
              className="text-gray-400 hover:text-gray-200 flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-300 mt-1">{notification.message}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
            </span>
            {notification.action && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(notification.action?.url, '_blank')}
              >
                {notification.action.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications ({unreadCount} unread)</p>
          </TooltipContent>
        </Tooltip>

        {isOpen && (
          <Card className="absolute right-0 mt-2 w-96 z-50 shadow-lg border border-gray-800">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem className="flex items-center justify-between">
                        <span>Sound</span>
                        <Switch
                          checked={soundEnabled}
                          onCheckedChange={handleSoundToggle}
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={requestNotificationPermission}>
                        Enable Browser Notifications
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={deleteAllNotifications}
                        className="text-red-500"
                      >
                        Clear All
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Tabs value={currentTab} onValueChange={handleTabChange}>
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="all">
                    All
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="nft">NFT</TabsTrigger>
                  <TabsTrigger value="gas">Gas</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="system">System</TabsTrigger>
                </TabsList>

                <ScrollArea className="h-[400px] pr-4">
                  {currentNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <Bell className="h-8 w-8 mb-2" />
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {currentNotifications.map(renderNotificationItem)}
                    </div>
                  )}
                </ScrollArea>
              </Tabs>
            </div>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};
