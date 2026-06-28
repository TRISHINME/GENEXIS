import { useEffect, useState } from 'react';
import { GOResult } from '../types/GOResult';

interface BarChartProps {
  data: GOResult[];
}

export function BarChart({ data }: BarChartProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const maxConfidence = Math.max(...data.map(d => d.confidence));

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold text-gray-800 dark:text-cyan-400 mb-6">
        Confidence Distribution
      </h3>
      <div className="space-y-4">
        {data.map((result) => {
          const width = (result.confidence / maxConfidence) * 100;
          const isHighRisk = result.confidence < 50;
          const isMediumRisk = result.confidence >= 50 && result.confidence < 70;

          return (
            <div key={result.id} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-cyan-300">
                  {result.id}
                </span>
                <span className={`text-sm font-bold ${
                  isHighRisk
                    ? 'text-red-500 dark:text-red-400'
                    : isMediumRisk
                    ? 'text-yellow-500 dark:text-yellow-400'
                    : 'text-green-500 dark:text-green-400'
                }`}>
                  {result.confidence.toFixed(2)}%
                </span>
              </div>
              <div className="relative h-8 bg-gray-200 dark:bg-gray-700/50 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out ${
                    isHighRisk
                      ? 'bg-gradient-to-r from-red-500 to-red-400 dark:from-red-600 dark:to-red-500'
                      : isMediumRisk
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-400 dark:from-yellow-600 dark:to-yellow-500'
                      : 'bg-gradient-to-r from-green-500 to-green-400 dark:from-green-600 dark:to-green-500'
                  } group-hover:shadow-lg`}
                  style={{
                    width: animated ? `${width}%` : '0%',
                    boxShadow: animated ? `0 0 20px ${
                      isHighRisk ? 'rgba(239, 68, 68, 0.5)' :
                      isMediumRisk ? 'rgba(234, 179, 8, 0.5)' :
                      'rgba(34, 197, 94, 0.5)'
                    }` : 'none'
                  }}
                />
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="text-xs font-bold text-white drop-shadow-lg z-10">
                    {animated && `${result.confidence.toFixed(1)}%`}
                  </span>
                </div>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  isHighRisk
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    : isMediumRisk
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                }`}>
                  {isHighRisk ? 'High Risk' : isMediumRisk ? 'Medium Risk' : 'Low Risk'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
