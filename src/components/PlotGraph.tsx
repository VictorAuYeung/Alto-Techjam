/* eslint-disable react/no-unknown-property */
import { useMemo } from 'react';
import '@lynx-js/react';
import type { BalanceHistoryPoint } from '../services/wallet.js';

interface PlotGraphProps {
  data: BalanceHistoryPoint[];
  width?: number;
  height?: number;
  className?: string;
  lineColor?: string;
  showPoints?: boolean;
  showArea?: boolean;
  areaColor?: string;
}

export function PlotGraph({
  data,
  width = 300,
  height = 150,
  className = '',
  lineColor = '#4CAF50',
  showPoints = true,
  showArea = true,
  areaColor = 'rgba(76, 175, 80, 0.1)'
}: Readonly<PlotGraphProps>) {
  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    const values = data.map(point => point.nanas);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;

    const minTime = Math.min(...data.map(p => p.timestamp));
    const maxTime = Math.max(...data.map(p => p.timestamp));
    const timeRange = maxTime - minTime || 1;

    // Chart area dimensions (accounting for padding)
    const chartAreaWidth = width - 70; // width - (left padding 50px + right padding 20px)
    const chartAreaHeight = height - 70; // height - (top padding 20px + bottom padding 50px)
    const chartLeftOffset = 50; // left padding
    const chartTopOffset = 20; // top padding

    // Create points for the plot
    const points = data.map((point, index) => {
      // X coordinate: map timestamp to chart area width, then add left offset
      const normalizedX = (point.timestamp - minTime) / timeRange;
      const x = chartLeftOffset + (normalizedX * chartAreaWidth);

      // Y coordinate: map value to chart area height, then add top offset
      // Y=0 is at the top, so we need to invert the value mapping
      const normalizedY = (point.nanas - minValue) / valueRange;
      const y = chartTopOffset + ((1 - normalizedY) * chartAreaHeight);

      // Debug logging for first few points
      if (index < 3) {
        console.log(`Point ${index}: value=${point.nanas}, x=${x}, y=${y}, normalizedX=${normalizedX}, normalizedY=${normalizedY}`);
      }

      return {
        x,
        y,
        value: point.nanas,
        timestamp: point.timestamp,
        date: new Date(point.timestamp)
      };
    });

    return {
      points,
      minValue,
      maxValue,
      minTime,
      maxTime
    };
  }, [data, width, height]);

  if (!chartData || data.length < 2) {
    return (
      <view className={`PlotGraph PlotGraph--empty ${className}`}>
        <text className="PlotGraphEmptyText">Not enough data to display plot</text>
      </view>
    );
  }

  const { points, minValue, maxValue } = chartData;

  return (
    <view className={`PlotGraph ${className}`}>
      <view className="PlotGraphContainer" style={{ width: `${width}px`, height: `${height}px` }}>

        {/* Grid lines */}
        <view className="PlotGraphGrid">
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
            <view
              key={`grid-${ratio}`}
              className="PlotGraphGridLine"
              style={{ bottom: `${ratio * 100}%` }}
            />
          ))}
        </view>

        {/* Y-axis labels */}
        <view className="PlotGraphYLabels">
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const value = minValue + (ratio * (maxValue - minValue));
            return (
              <text
                key={`ylabel-${ratio}`}
                className="PlotGraphYLabel"
                style={{ bottom: `${ratio * 100}%` }}
              >
                {value.toFixed(2)}
              </text>
            );
          })}
        </view>

        {/* X-axis labels (dates) */}
        <view className="PlotGraphXLabels">
          {points.filter((_, index) => index % Math.max(1, Math.floor(points.length / 3)) === 0).map((point) => (
            <text
              key={`xlabel-${point.timestamp}`}
              className="PlotGraphXLabel"
              style={{ left: `${point.x}px` }}
            >
              {point.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </text>
          ))}
        </view>

        {/* Area fill using simple approach */}
        {showArea && points.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = points[index - 1];

          // Simple area fill - fill from the line to the bottom of chart area
          const left = prevPoint.x;
          const width = point.x - prevPoint.x;
          const top = Math.min(prevPoint.y, point.y);
          const bottom = height - 50; // Bottom of chart area (height - bottom padding)
          const areaHeight = bottom - top;

          return (
            <view
              key={`area-${point.timestamp}`}
              className="PlotGraphArea"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${areaHeight}px`,
                backgroundColor: areaColor,
                opacity: 0.3
              }}
            />
          );
        })}

        {/* Line segments */}
        {points.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = points[index - 1];
          const dx = point.x - prevPoint.x;
          const dy = point.y - prevPoint.y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          return (
            <view
              key={`line-${point.timestamp}`}
              className="PlotGraphLine"
              style={{
                left: `${prevPoint.x}px`,
                top: `${prevPoint.y}px`,
                width: `${length}px`,
                height: '2px',
                backgroundColor: lineColor,
                transform: `rotate(${angle}deg)`,
                transformOrigin: '0 0'
              }}
            />
          );
        })}

        {/* Data points */}
        {showPoints && points.map((point) => (
          <view
            key={`point-${point.timestamp}`}
            className="PlotGraphPoint"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              backgroundColor: lineColor
            }}
          />
        ))}
      </view>

      <view className="PlotGraphInfo">
        <text className="PlotGraphLabel">Wallet Balance Trend</text>
        <view className="PlotGraphStats">
          <view className="PlotGraphStat">
            <text className="PlotGraphStatLabel">Current</text>
            <text className="PlotGraphStatValue">{data[data.length - 1]?.nanas.toFixed(3)} N</text>
          </view>
          <view className="PlotGraphStat">
            <text className="PlotGraphStatLabel">Change</text>
            <text className={`PlotGraphStatValue ${(() => {
              const change = data.length > 1 ? data[data.length - 1].nanas - data[0].nanas : 0;
              return change >= 0 ? 'PlotGraphStatValue--positive' : 'PlotGraphStatValue--negative';
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
