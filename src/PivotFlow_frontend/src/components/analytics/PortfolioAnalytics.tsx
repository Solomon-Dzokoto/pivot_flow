import React from 'react';
import { Card } from '../ui/card';
import { Pie } from '@nivo/pie';
// import { format } from 'date-fns';

interface PortfolioStats {
  totalValue: number;
  dailyChange: number;
  weeklyChange: number;
  holdings: Array<{
    asset: string;
    value: number;
    color: string;
  }>;
}

export const PortfolioAnalytics: React.FC<{ stats: PortfolioStats }> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Portfolio Overview</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400">Total Value</p>
            <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">24h Change</p>
              <p className={`text-lg font-semibold ${stats.dailyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.dailyChange > 0 ? '+' : ''}{stats.dailyChange}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">7d Change</p>
              <p className={`text-lg font-semibold ${stats.weeklyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats.weeklyChange > 0 ? '+' : ''}{stats.weeklyChange}%
              </p>
            </div>
          </div>
        </div>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Asset Distribution</h3>
        <div style={{ height: 300 }}>
          <Pie
            data={stats.holdings}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: 'nivo' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            enableArcLinkLabels={true}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#ffffff"
          />
        </div>
      </Card>
    </div>
  );
};
