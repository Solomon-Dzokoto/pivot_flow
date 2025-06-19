import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { AlertCircle, ArrowDownCircle, ArrowUpCircle, Clock } from 'lucide-react';

interface Activity {
  id: string;
  type: 'alert' | 'transaction' | 'system';
  title: string;
  description: string;
  timestamp: Date;
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    // Mock data - replace with actual data from your backend
    setActivities([
      {
        id: '1',
        type: 'alert',
        title: 'NFT Price Alert',
        description: 'CryptoKitties floor price dropped below 2 ICP',
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
      },
      {
        id: '2',
        type: 'transaction',
        title: 'Cycles Top-up',
        description: 'Added 10B cycles to canister',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
      },
      {
        id: '3',
        type: 'system',
        title: 'System Update',
        description: 'Monitoring system updated to v2.1.0',
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
      },
    ]);
  }, []);

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'transaction':
        return <ArrowUpCircle className="h-4 w-4 text-green-400" />;
      case 'system':
        return <Clock className="h-4 w-4 text-blue-400" />;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <Card className="col-span-3 bg-black/40 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 rounded-lg bg-white/5 p-3"
              >
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.description}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatTimestamp(activity.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
