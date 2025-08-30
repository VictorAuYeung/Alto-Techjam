/* eslint-disable react/no-unknown-property */
import { useMemo } from 'react';
import '@lynx-js/react';

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  width?: number;
  height?: number;
  className?: string;
  showValues?: boolean;
  maxValue?: number;
}

export function BarChart({
  data,
  width = 300,
  height = 200,
  className = '',
  showValues = true,
  maxValue
}: Readonly<BarChartProps>) {
  const chartData = useMemo(() => {
    if (data.length === 0) return null;

    const values = data.map(item => item.value);
    const calculatedMaxValue = maxValue || Math.max(...values);
    const minValue = Math.min(...values);

    // Ensure we have at least 5 bars for proper spacing, but handle fewer bars
    const barCount = Math.max(data.length, 1);
    const availableWidth = 100; // percentage
    const totalSpacing = barCount > 1 ? (barCount - 1) * 2 : 0; // 2% spacing between bars
    const barWidth = Math.min((availableWidth - totalSpacing) / barCount, 20); // Max 20% per bar

    const bars = data.map((item, index) => {
      const percentage = calculatedMaxValue > 0 ? Math.min((item.value / calculatedMaxValue) * 100, 100) : 0;
      const x = index * (barWidth + (barCount > 1 ? 2 : 0)); // 2% spacing between bars

      return {
        ...item,
        percentage,
        barWidth,
        x,
        color: item.color || `hsl(${(index * 60) + 200}, 75%, 55%)` // Blue to purple gradient
      };
    });

    return {
      bars,
      maxValue: calculatedMaxValue,
      minValue
    };
  }, [data, maxValue]);

  if (!chartData || data.length === 0) {
    return (
      <view className={`BarChart BarChart--empty ${className}`}>
        <text className="BarChartEmptyText">No data to display</text>
      </view>
    );
  }

  const { bars, maxValue: chartMaxValue } = chartData;

  return (
    <view className={`BarChart ${className}`}>
      <view className="BarChartContainer" style={{ width: `${width}px`, height: `${height}px` }}>
        {/* Grid lines */}
        <view className="BarChartGrid">
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
            <view
              key={`grid-${ratio}`}
              className="BarChartGridLine"
              style={{ bottom: `${ratio * 100}%` }}
            />
          ))}
        </view>

        {/* Y-axis labels */}
        <view className="BarChartYLabels">
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const value = chartMaxValue * ratio;
            return (
              <text
                key={`ylabel-${ratio}`}
                className="BarChartYLabel"
                style={{ bottom: `${ratio * 100}%` }}
              >
                {value.toFixed(2)}
              </text>
            );
          })}
        </view>

        {/* Bars */}
        {bars.map((bar, index) => (
          <view
            key={`bar-${bar.label}-${bar.value}-${index}`}
            className="BarChartBar"
            style={{
              left: `calc(55px + ${bar.x}%)`,
              width: `${bar.barWidth}%`,
              height: `calc((100% - 80px) * ${bar.percentage} / 100)`,
              backgroundColor: bar.color
            }}
          >
            {showValues && bar.value > 0 && (
              <view className="BarChartValueContainer">
                <text className="BarChartValue">{bar.value.toFixed(2)}</text>
              </view>
            )}
          </view>
        ))}

        {/* X-axis labels */}
        <view className="BarChartXLabels">
          {bars.map((bar, index) => (
            <text
              key={`xlabel-${bar.label}-${index}`}
              className="BarChartXLabel"
              style={{
                left: `calc(55px + ${bar.x + bar.barWidth * 0.5}%)`, // Align with bar center
                bottom: '0px'
              }}
            >
              {bar.label.length > 12 ? `${bar.label.substring(0, 12)}...` : bar.label}
            </text>
          ))}
        </view>
      </view>

      {/* Legend */}
      <view className="BarChartLegend">
        {bars.slice(0, 5).map((bar, index) => (
          <view key={`legend-${bar.label}-${bar.value}-${index}`} className="BarChartLegendItem">
            <view
              className="BarChartLegendColor"
              style={{ backgroundColor: bar.color }}
            />
            <text className="BarChartLegendLabel">
              {bar.label.length > 15 ? `${bar.label.substring(0, 15)}...` : bar.label}
            </text>
          </view>
        ))}
      </view>
    </view>
  );
}
