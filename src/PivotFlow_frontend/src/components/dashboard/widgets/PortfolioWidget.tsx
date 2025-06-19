import React from 'react';
import { Card } from '../../ui/card';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { ArrowUp, ArrowDown } from 'lucide-react';

const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#fb7185', '#34d399'];

export const PortfolioWidget: React.FC = () => {
  // Mock portfolio data
  const portfolioData = [
    { name: 'Ethereum', value: 45, amount: 15.5, change: 2.3 },
    { name: 'NFTs', value: 30, amount: 10.2, change: -1.5 },
    { name: 'USDT', value: 15, amount: 5.1, change: 0.1 },
    { name: 'Other', value: 10, amount: 3.4, change: -0.5 },
  ];

  const totalValue = portfolioData.reduce((acc, item) => acc + item.amount, 0);
  const totalChange = portfolioData.reduce((acc, item) => acc + item.change, 0);

  return (
    <Card className="p-4 h-full">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Portfolio Overview</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{totalValue.toFixed(2)} ETH</span>
            <span className={`flex items-center text-sm ${
              totalChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {totalChange >= 0 ? (
                <ArrowUp className="w-4 h-4 mr-1" />
              ) : (
                <ArrowDown className="w-4 h-4 mr-1" />
              )}
              {Math.abs(totalChange).toFixed(1)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={2}
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: 'none',
                    borderRadius: '0.5rem',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Allocation']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            {portfolioData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {item.amount.toFixed(1)} ETH
                  </div>
                  <div className={`text-xs ${
                    item.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item.change >= 0 ? '+' : ''}{item.change}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="w-full px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors">
            Buy / Sell
          </button>
          <button className="w-full px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700/70 transition-colors">
            History
          </button>
        </div>
      </div>
    </Card>
  );
};
