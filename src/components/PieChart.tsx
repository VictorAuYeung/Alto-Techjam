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

  const maxPercentage = Math.max(...chartData.map(item => item.percentage));
  const barHeight = Math.max(32, Math.min(48, height / chartData.length - 8));

  return (
    <view className={`HorizontalBarChart ${className}`}>
      <view className="HorizontalBarChartContainer" style={{ width: `${width}px` }}>
        {chartData.map((item, index) => {
          const barWidth = (item.percentage / maxPercentage) * (width - 120); // Leave space for labels
          const animationDelay = animated ? `${index * 100}ms` : '0ms';

          return (
            <view key={`bar-${item.label}-${item.value}-${index}`} className="HorizontalBarItem">
              {/* Label */}
              <view className="HorizontalBarLabel">
                <text className="HorizontalBarLabelText">
                  {item.label}
                </text>
              </view>

              {/* Bar container */}
              <view className="HorizontalBarContainer">
                <view
                  className="HorizontalBar"
                  style={{
                    width: animated ? '0px' : `${barWidth}px`,
                    height: `${barHeight}px`,
                    backgroundColor: item.color,
                    transition: animated ? `width 800ms ease-out ${animationDelay}` : 'none'
                  }}
                >
                  {/* Animated fill */}
                  {animated && (
                    <view
                      className="HorizontalBarFill"
                      style={{
                        width: `${barWidth}px`,
                        height: `${barHeight}px`,
                        backgroundColor: item.color,
                        animationDelay
                      }}
                    />
                  )}
                </view>

                {/* Background track */}
                <view
                  className="HorizontalBarTrack"
                  style={{
                    width: `${width - 120}px`,
                    height: `${barHeight}px`
                  }}
                />
              </view>

              {/* Value/Percentage */}
              <view className="HorizontalBarValue">
                {showValues && (
                  <text className="HorizontalBarValueText">
                    {item.value}
                  </text>
                )}
                {showPercentages && (
                  <text className="HorizontalBarPercentageText">
                    {item.percentage.toFixed(1)}%
                  </text>
                )}
              </view>
            </view>
          );
        })}
      </view>
    </view>
  );
}
