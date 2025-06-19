import React from 'react';
import { Card } from '../../ui/card';
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNFTStore } from '../../../store/useNFTStore';

interface NFTCollection {
  name: string;
  volume24h: number;
  floorPrice: number;
  priceHistory: { price: number }[];
}

export const NFTPriceWidget: React.FC = () => {
  const collections = useNFTStore((state) => state.collections as Record<string, NFTCollection>);
  const topCollections = Object.values(collections)
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, 5);
    

  const generateMockPriceData = (basePrice: number) => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: new Date(Date.now() - (23 - i) * 3600000).getTime(),
      price: basePrice + Math.sin(i / 3) * (basePrice * 0.1)
    }));
  };

  const mockData = generateMockPriceData(10);

  return (
    <Card className="p-4 h-full">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">NFT Price Trends</h3>
          <p className="text-sm text-slate-400">24h price movement</p>
        </div>

        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
              <XAxis 
                dataKey="time"
                tickFormatter={(time) => new Date(time).getHours() + 'h'}
                stroke="#475569"
              />
              <YAxis 
                stroke="#475569"
                tickFormatter={(value) => `${value.toFixed(2)} Ξ`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '0.5rem',
                }}
                labelFormatter={(time) => new Date(time).toLocaleTimeString()}
                formatter={(value: number) => [`${value.toFixed(2)} ETH`, 'Price']}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-2">
          {topCollections.map((collection, index) => (
            <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-slate-800/50">
              <span className="text-sm">{collection.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{collection.floorPrice.toFixed(2)} Ξ</span>
                <span className={`text-xs ${
                  collection.priceHistory[0]?.price > collection.priceHistory[1]?.price
                    ? 'text-green-400'
                    : 'text-red-400'
                }`}>
                  {((collection.priceHistory[0]?.price / collection.priceHistory[1]?.price - 1) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
