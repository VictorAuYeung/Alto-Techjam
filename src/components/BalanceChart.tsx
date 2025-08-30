/* eslint-disable react/no-unknown-property */
import '@lynx-js/react';
import type { BalanceHistoryPoint } from '../services/wallet.js';
import { PlotGraph } from './PlotGraph.js';

interface BalanceChartProps {
  data: BalanceHistoryPoint[];
  width?: number;
  height?: number;
  className?: string;
}

export function BalanceChart({
  data,
  width = 300,
  height = 150,
  className = ''
}: Readonly<BalanceChartProps>) {
  return (
    <PlotGraph
      data={data}
      width={width}
      height={height}
      className={`BalanceChart ${className}`}
      lineColor="#4CAF50"
      showPoints={true}
      showArea={true}
      areaColor="rgba(76, 175, 80, 0.1)"
    />
  );
}
