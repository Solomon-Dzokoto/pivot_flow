import React from 'react';
import { PriceChart } from '../analytics/PriceChart';
import { PortfolioAnalytics } from '../analytics/PortfolioAnalytics';
import { SocialFeed } from '../social/SocialFeed';
import { Card } from '../ui/card';

export const NFTPriceWidget: React.FC = () => {
  // Example data - in real app, this would come from your backend
  const mockData = Array.from({ length: 30 }, (_, i) => ({
    timestamp: Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
    price: Math.random() * 10 + 20
  }));

  return <PriceChart data={mockData} title="NFT Price History" />;
};

export const GasFeeWidget: React.FC = () => {
  const mockData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: Date.now() - (23 - i) * 60 * 60 * 1000,
    price: Math.random() * 50 + 30
  }));

  return <PriceChart data={mockData} title="Gas Fee Trends" />;
};

export const PortfolioWidget: React.FC = () => {
  const mockStats = {
    totalValue: 156789.42,
    dailyChange: 2.5,
    weeklyChange: -1.2,
    holdings: [
      { asset: 'ETH', value: 45, color: '#627EEA' },
      { asset: 'NFTs', value: 30, color: '#F6851B' },
      { asset: 'USDT', value: 25, color: '#26A17B' }
    ]
  };

  return <PortfolioAnalytics stats={mockStats} />;
};

export const TrendingCollectionsWidget: React.FC = () => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Trending Collections</h3>
      <div className="space-y-4">
        {[
          { name: 'Bored Apes', change: '+12.5%', floor: '12.5 ETH' },
          { name: 'CryptoPunks', change: '-2.3%', floor: '65.2 ETH' },
          { name: 'Doodles', change: '+5.7%', floor: '8.1 ETH' }
        ].map((collection) => (
          <div key={collection.name} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
            <span>{collection.name}</span>
            <div className="flex gap-4">
              <span className={collection.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                {collection.change}
              </span>
              <span>{collection.floor}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const CommunityFeedWidget: React.FC = () => {
  const mockComments = [
    {
      id: '1',
      userId: 'user1',
      userName: 'CryptoWhale',
      userAvatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=1',
      content: 'Floor price looking strong! 🚀',
      timestamp: new Date(),
      likes: 12
    }
  ];

  return (
    <SocialFeed
      collectionId="example"
      comments={mockComments}
      onAddComment={(content) => console.log('New comment:', content)}
      onLike={(id) => console.log('Liked:', id)}
      onShare={(id) => console.log('Shared:', id)}
    />
  );
};
