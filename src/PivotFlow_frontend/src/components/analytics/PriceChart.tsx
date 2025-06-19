import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Card } from '../ui/card';

interface PriceData {
  timestamp: number;
  price: number;
}

interface PriceChartProps {
  data: PriceData[];
  title: string;
  height?: number;
}

export const PriceChart: React.FC<PriceChartProps> = ({ data, title, height = 300 }) => {
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div style={{ height: height }}>
        <LineChart
          width={600}
          height={height}
          data={data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis dataKey="price" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
          />
        </LineChart>
      </div>
    </Card>
  );
};
