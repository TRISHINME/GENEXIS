import { PredictionData } from '../types/GOResult';

interface LineGraphProps {
  data: PredictionData['genexis_go_predictions'];
}

export function LineGraph({ data }: LineGraphProps) {
  // 🔒 Safety guard
  if (!data || data.length === 0) return null;

  const width = 600;
  const height = 300;
  const padding = { top: 40, right: 40, bottom: 90, left: 60 };

  const maxConfidence = 100;
  const minConfidence = 0;

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const xStep = chartWidth / (data.length - 1 || 1);

  const points = data.map((result, index) => {
    const x = padding.left + index * xStep;

    // 🔧 scale confidence (0–1 → 0–100)
    const y =
      padding.top +
      chartHeight -
      (((result.confidence * 100) - minConfidence) /
        (maxConfidence - minConfidence)) *
        chartHeight;

    return { x, y, ...result };
  });

  const pathD = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">
        Confidence Distribution
      </h3>

      <svg width={width} height={height}>
        {/* Y-axis grid */}
        {[0, 25, 50, 75, 100].map((val) => {
          const y =
            padding.top +
            chartHeight -
            ((val - minConfidence) / (maxConfidence - minConfidence)) *
              chartHeight;

          return (
            <g key={val}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#1f2937"
                strokeDasharray="4"
              />
              <text
                x={padding.left - 10}
                y={y + 4}
                textAnchor="end"
                className="text-xs fill-cyan-400"
              >
                {val}%
              </text>
            </g>
          );
        })}

        {/* Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={2}
        />

        {/* Points */}
        {points.map((p, i) => (
          <circle
            key={p.id || i}
            cx={p.x}
            cy={p.y}
            r={5}
            fill={
              p.confidence * 100 >= 70
                ? '#22c55e'
                : p.confidence * 100 >= 50
                ? '#facc15'
                : '#ef4444'
            }
          >
            <title>
              {`${p.id || 'Unknown'}: ${(p.confidence * 100).toFixed(2)}%`}
            </title>
          </circle>
        ))}

        {/* X-axis labels */}
        {data.map((label, index) => {
          const x = padding.left + index * xStep;
          const y = height - padding.bottom + 40;

          // FIX: Added optional chaining and fallback to prevent crash
          const labelText = label.id?.replace('GO:', '') || 'N/A';

          return (
            <text
              key={label.id || index}
              x={x}
              y={y}
              textAnchor="end"
              transform={`rotate(-45, ${x}, ${y})`}
              className="text-xs fill-cyan-400"
            >
              {labelText}
            </text>
          );
        })}
      </svg>
    </div>
  );
}