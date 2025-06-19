import React from 'react';
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card } from '../ui/card';
import { useNFTStore } from '../../store/useNFTStore';

interface NFTPriceChartProps {
  collectionSlug: string;
  height?: number;
}

export const NFTPriceChart: React.FC<NFTPriceChartProps> = ({ collectionSlug, height = 300 }) => {
  const collection = useNFTStore((state) => state.collections[collectionSlug]);

  if (!collection) {
    return (
      <Card className="p-4">
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-slate-400">No price data available</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{collection.name}</h3>
        <div className="flex items-center gap-4">
          <p className="text-2xl font-bold">{collection.floorPrice.toFixed(2)} ETH</p>
          <div className={`text-sm ${
            collection.priceHistory[0]?.price > collection.priceHistory[1]?.price 
              ? 'text-green-400' 
              : 'text-red-400'
          }`}>
            {((collection.priceHistory[0]?.price / collection.priceHistory[1]?.price - 1) * 100).toFixed(2)}%
            <span className="text-slate-400 ml-1">24h</span>
          </div>
        </div>
      </div>

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={collection.priceHistory}>
            <XAxis 
              dataKey="timestamp"
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
              stroke="#475569"
            />
            <YAxis 
              stroke="#475569"
              tickFormatter={(value) => `${value.toFixed(2)} ETH`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              }}
              labelFormatter={(timestamp) => new Date(timestamp).toLocaleString()}
              formatter={(value: number) => [`${value.toFixed(2)} ETH`, 'Floor Price']}
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
    </Card>
  );
};
