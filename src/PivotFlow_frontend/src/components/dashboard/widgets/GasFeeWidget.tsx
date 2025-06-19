import React from 'react';
import { Card } from '../../ui/card';
import { useGasStore } from '../../../store/useGasStore';
import { Area, AreaChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Flame } from 'lucide-react';

export const GasFeeWidget: React.FC = () => {
  const networkFees = useGasStore((state) => state.networkFees);

  // Generate mock data for the chart
  const generateMockGasData = () => {
    return Array.from({ length: 24 }, (_, i) => ({
      time: new Date(Date.now() - (23 - i) * 3600000).getTime(),
      fast: Math.round(100 + Math.sin(i / 2) * 50),
      standard: Math.round(70 + Math.sin(i / 2) * 30),
      slow: Math.round(40 + Math.sin(i / 2) * 20),
    }));
  };

  const gasData = generateMockGasData();

  return (
    <Card className="p-4 h-full">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">Gas Fees</h3>
            <p className="text-sm text-slate-400">Real-time network fees</p>
          </div>
          <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1 rounded-full">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-400">
              {Object.values(networkFees)[0]?.fast.gwei || '80'} Gwei
            </span>
          </div>
        </div>

        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gasData}>
              <XAxis
                dataKey="time"
                tickFormatter={(time) => new Date(time).getHours() + 'h'}
                stroke="#475569"
              />
              <YAxis
                stroke="#475569"
                tickFormatter={(value) => `${value} Gwei`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: 'none',
                  borderRadius: '0.5rem',
                }}
                labelFormatter={(time) => new Date(time).toLocaleTimeString()}
              />
              <Area
                type="monotone"
                dataKey="fast"
                stroke="#f43f5e"
                fill="#f43f5e"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="standard"
                stroke="#a855f7"
                fill="#a855f7"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="slow"
                stroke="#38bdf8"
                fill="#38bdf8"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="text-sm text-slate-400">Fast</div>
            <div className="text-lg font-semibold text-red-400">
              {gasData[gasData.length - 1].fast} Gwei
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-slate-400">Standard</div>
            <div className="text-lg font-semibold text-purple-400">
              {gasData[gasData.length - 1].standard} Gwei
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-slate-400">Slow</div>
            <div className="text-lg font-semibold text-cyan-400">
              {gasData[gasData.length - 1].slow} Gwei
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
