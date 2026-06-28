import { PredictionData } from '../types/GOResult';

interface PieChartProps {
  data: PredictionData['genexis_go_predictions'];
}

export function PieChart({ data }: PieChartProps) {
  if (!data || data.length === 0) return null;

  const size = 260;
  const radius = size / 2 - 20;
  const center = size / 2;

  const total = data.reduce(
    (sum, d) => sum + d.confidence * 100,
    0
  );

  let cumulative = 0;

  const colors = [
    '#22d3ee',
    '#60a5fa',
    '#2dd4bf',
    '#34d399',
    '#38bdf8'
  ];

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">
        Confidence Distribution (Pie Chart)
      </h3>

      <div className="flex items-center gap-6">
        <svg width={size} height={size}>
          <g transform={`translate(${center}, ${center})`}>
            {data.map((slice, i) => {
              const value = slice.confidence * 100;
              const startAngle = (cumulative / total) * 2 * Math.PI;
              cumulative += value;
              const endAngle = (cumulative / total) * 2 * Math.PI;

              const x1 = radius * Math.cos(startAngle);
              const y1 = radius * Math.sin(startAngle);
              const x2 = radius * Math.cos(endAngle);
              const y2 = radius * Math.sin(endAngle);

              const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

              const d = `
                M 0 0
                L ${x1} ${y1}
                A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
                Z
              `;

              return (
                <path
                  key={slice.id || i}
                  d={d}
                  fill={colors[i % colors.length]}
                >
                  <title>
                    {slice.description} ({value.toFixed(2)}%)
                  </title>
                </path>
              );
            })}
          </g>

          <text
            x={center}
            y={center}
            textAnchor="middle"
            className="fill-cyan-400 text-xl font-bold"
          >
            {data.length}
          </text>
          <text
            x={center}
            y={center + 18}
            textAnchor="middle"
            className="fill-cyan-400 text-sm"
          >
            GO Terms
          </text>
        </svg>

        {/* Legend */}
        <div className="space-y-3">
          {data.map((slice, i) => (
            <div key={slice.id || i} className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[i % colors.length] }}
              />
              <div>
                <span
                  title={slice.id}
                  className="font-semibold text-cyan-300 text-sm cursor-help"
                >
                  {slice.description || 'Unknown Term'}
                </span>
                <div className="text-xs text-cyan-400/70">
                  {(slice.confidence * 100).toFixed(2)}% conf.
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
