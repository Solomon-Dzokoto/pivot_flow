import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
// import { Principal } from '@dfinity/principal';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Coins, Cpu } from 'lucide-react';

interface ICPMetrics {
  icpBalance: bigint;
  cyclesBalance: bigint;
  dailyUsage: bigint;
}

export function ICPMetrics() {
  const { principal } = useAuth();
  const [metrics, setMetrics] = useState<ICPMetrics>({
    icpBalance: BigInt(0),
    cyclesBalance: BigInt(0),
    dailyUsage: BigInt(0)
  });

  useEffect(() => {
    async function fetchMetrics() {
      if (!principal) return;

      setMetrics({
        icpBalance: BigInt(5000000000), // 50 ICP
        cyclesBalance: BigInt(100000000000), // 100B cycles
        dailyUsage: BigInt(1000000000) // 1B cycles
      });
    }

    fetchMetrics();
  }, [principal]);

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
      <Card className="bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border-purple-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ICP Balance</CardTitle>
          <Coins className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {Number(metrics.icpBalance) / 100_000_000} ICP
          </div>
          <p className="text-xs text-muted-foreground">
            ≈ ${((Number(metrics.icpBalance) / 100_000_000) * 30).toFixed(2)} USD
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-900/50 to-cyan-900/50 backdrop-blur-sm border-blue-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cycles Balance</CardTitle>
          <Cpu className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {Number(metrics?.cyclesBalance) / 1_000_000_000}B
          </div>
          <p className="text-xs text-muted-foreground">
            Available Compute Cycles
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-emerald-900/50 to-teal-900/50 backdrop-blur-sm border-emerald-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily Usage</CardTitle>
          <BarChart3 className="h-4 w-4 text-emerald-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {Number(metrics.dailyUsage) / 1_000_000_000}B
          </div>
          <p className="text-xs text-muted-foreground">
            Cycles Used Today
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
