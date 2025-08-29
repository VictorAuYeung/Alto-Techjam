/* eslint-disable react/no-unknown-property */
import { useMemo } from 'react';
import '@lynx-js/react';
import type { BalanceHistoryPoint } from '../services/wallet.js';

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
}: BalanceChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    const values = data.map(point => point.nanas);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;

    const minTime = Math.min(...data.map(p => p.timestamp));
    const maxTime = Math.max(...data.map(p => p.timestamp));
    const timeRange = maxTime - minTime || 1;

    // Create points for the chart
    const points = data.map((point) => {
      const x = ((point.timestamp - minTime) / timeRange) * 100; // Percentage
      const y = 100 - ((point.nanas - minValue) / valueRange) * 100; // Percentage from top
      return { x, y, value: point.nanas, timestamp: point.timestamp };
    });

    return {
      points,
      minValue,
      maxValue,
      minTime,
      maxTime
    };
  }, [data]);

  if (!chartData || data.length < 2) {
    return (
      <view className={`BalanceChart BalanceChart--empty ${className}`}>
        <text className="BalanceChartEmptyText">Not enough data to display chart</text>
      </view>
    );
  }

  const { points, minValue, maxValue } = chartData;

  // Create bar chart representation using views
  const bars = points.map((point, index) => {
    const barHeight = point.y;
    const barWidth = 100 / points.length;

    return (
      <view
        key={`bar-${point.timestamp}`}
        className="BalanceChartBar"
        style={{
          left: `${index * barWidth}%`,
          width: `${barWidth}%`,
          height: `${barHeight}%`,
          bottom: '0%'
        }}
      />
    );
  });

  // Create line connecting points
  const linePoints = points.map(point => `${point.x}% ${point.y}%`).join(', ');

  return (
    <view className={`BalanceChart ${className}`}>
      <view className="BalanceChartContainer">
        {/* Grid lines */}
        <view className="BalanceChartGrid">
          {[0, 20, 40, 60, 80, 100].map(level => (
            <view
              key={`grid-${level}`}
              className="BalanceChartGridLine"
              style={{ bottom: `${level}%` }}
            />
          ))}
        </view>

        {/* Y-axis labels */}
        <view className="BalanceChartYLabels">
          {[0, 1, 2, 3, 4, 5].map(i => {
            const value = minValue + (i * (maxValue - minValue)) / 5;
            return (
              <text
                key={`ylabel-${i}`}
                className="BalanceChartYLabel"
                style={{ bottom: `${i * 20}%` }}
              >
                {value.toFixed(2)}
              </text>
            );
          })}
        </view>

        {/* Bars */}
        {bars}

        {/* Trend line using CSS clip-path approximation */}
        <view
          className="BalanceChartTrendLine"
          style={{
            clipPath: `polygon(${points.map((point, index) =>
              `${point.x}% ${point.y}%${index < points.length - 1 ? ',' : ''}`
            ).join('')})`
          }}
        />
      </view>

      <view className="BalanceChartInfo">
        <text className="BalanceChartLabel">Wallet Balance History</text>
        <view className="BalanceChartStats">
          <view className="BalanceChartStat">
            <text className="BalanceChartStatLabel">Current</text>
            <text className="BalanceChartStatValue">{data[data.length - 1]?.nanas.toFixed(3)} N</text>
          </view>
          <view className="BalanceChartStat">
            <text className="BalanceChartStatLabel">Change</text>
            <text className={`BalanceChartStatValue ${(() => {
              const change = data.length > 1 ? data[data.length - 1].nanas - data[0].nanas : 0;
              return change >= 0 ? 'BalanceChartStatValue--positive' : 'BalanceChartStatValue--negative';
            })()}`}>
              {(() => {
                const change = data.length > 1 ? data[data.length - 1].nanas - data[0].nanas : 0;
                return `${change >= 0 ? '+' : ''}${change.toFixed(3)} N`;
              })()}
            </text>
          </view>
        </view>
      </view>
    </view>
  );
}
