import React from 'react';
import { Card } from '../../ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useNFTStore } from '../../../store/useNFTStore';

export const TrendingCollectionsWidget: React.FC = () => {
  const collections = useNFTStore((state) => state.collections);

  // Sort collections by 24h volume and take top 5
  const trendingCollections = Object.values(collections)
    .sort((a, b) => b.volume24h - a.volume24h)
    .slice(0, 5)
    .map(collection => ({
      ...collection,
      priceChange: ((collection.priceHistory[0]?.price / collection.priceHistory[1]?.price - 1) * 100) || 0
    }));

  return (
    <Card className="p-4 h-full">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Trending Collections</h3>
          <p className="text-sm text-slate-400">Top performers by volume</p>
        </div>

        <div className="space-y-3">
          {trendingCollections.map((collection, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-slate-700 rounded-lg text-sm font-medium">
                  #{index + 1}
                </div>
                <div>
                  <h4 className="font-medium">{collection.name}</h4>
                  <p className="text-sm text-slate-400">
                    Floor: {collection.floorPrice.toFixed(2)} Ξ
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-1 ${
                collection.priceChange >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {collection.priceChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="text-sm">
                  {Math.abs(collection.priceChange).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
