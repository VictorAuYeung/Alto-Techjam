/* eslint-disable react/no-unknown-property */
import { useMemo } from 'react';
import '@lynx-js/react';

interface HorizontalBarData {
  label: string;
  value: number;
  color?: string;
}

interface HorizontalBarChartProps {
  data: HorizontalBarData[];
  width?: number;
  height?: number;
  className?: string;
  showPercentages?: boolean;
  showValues?: boolean;
  animated?: boolean;
}

export function HorizontalBarChart({
  data,
  width = 320,
  height = 240,
  className = '',
  showPercentages = true,
  showValues = true,
  animated = true
}: HorizontalBarChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return null;

    const processedData = data.map((item, index) => {
      const percentage = (item.value / total) * 100;
      return {
        ...item,
        percentage,
        color: item.color || `hsl(${(index * 137.5) % 360}, 70%, 60%)`
      };
    });

    // Sort by percentage descending for better visual hierarchy
    return processedData.sort((a, b) => b.percentage - a.percentage);
  }, [data]);

  if (!chartData || data.length === 0) {
    return (
      <view className={`HorizontalBarChart HorizontalBarChart--empty ${className}`}>
        <text className="HorizontalBarChartEmptyText">No data to display</text>
      </view>
    );
  }

  const barHeight = Math.max(40, Math.min(60, height * 0.3));
  const barWidth = width - 40; // Account for padding

  return (
    <view className={`HorizontalBarChart ${className}`}>
      <view className="HorizontalBarChartContainer" style={{ width: `${width}px`, minHeight: `${barHeight + 40}px` }}>
        {/* Single segmented bar */}
        <view
          className="HorizontalBarSegmentedContainer"
          style={{
            width: `${barWidth}px`,
            height: `${barHeight}px`
          }}
        >
          {/* Background track */}
          <view
            className="HorizontalBarTrack"
            style={{
              width: `${barWidth}px`,
              height: `${barHeight}px`
            }}
          />

          {/* Segments container - positioned relative to track */}
          <view className="HorizontalBarSegments">
            {chartData.map((item, index) => {
              // Calculate cumulative position for segments
              let cumulativePercentage = 0;
              for (let i = 0; i < index; i++) {
                cumulativePercentage += chartData[i].percentage;
              }

              const segmentWidth = Math.max(2, (item.percentage / 100) * barWidth); // Minimum 2px width
              const segmentLeft = (cumulativePercentage / 100) * barWidth;

              return (
                <view
                  key={`segment-${item.label}-${item.value}-${index}`}
                  className="HorizontalBarSegment"
                  style={{
                    position: 'absolute',
                    top: '0px',
                    left: `${segmentLeft}px`,
                    width: `${segmentWidth}px`,
                    height: `${barHeight}px`,
                    backgroundColor: item.color,
                    opacity: 1,
                    zIndex: chartData.length - index
                  }}
                />
              );
            })}
          </view>
        </view>

        {/* Legend */}
        <view className="HorizontalBarLegend">
          {chartData.map((item, index) => (
            <view key={`legend-${item.label}-${item.value}-${index}`} className="HorizontalBarLegendItem">
              <view
                className="HorizontalBarLegendColor"
                style={{ backgroundColor: item.color }}
              />
              <view className="HorizontalBarLegendText">
                <text className="HorizontalBarLegendLabel">
                  {item.label}
                </text>
                <text className="HorizontalBarLegendValue">
                  {item.percentage.toFixed(1)}%
                </text>
              </view>
            </view>
          ))}
        </view>
      </view>
    </view>
  );
}
