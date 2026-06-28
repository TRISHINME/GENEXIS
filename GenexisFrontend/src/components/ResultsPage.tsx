import { ArrowLeft, Activity, Target } from 'lucide-react';
import { PredictionData } from '../types/GOResult';
import { LineGraph } from './LineGraph';
import { PieChart } from './PieChart';

interface ResultsPageProps {
  data: PredictionData;
  onBack: () => void;
}

export function ResultsPage({ data, onBack }: ResultsPageProps) {
  const averageConfidence =
    (data.genexis_go_predictions.reduce((sum, r) => sum + r.confidence, 0) /
      data.genexis_go_predictions.length) *
    100;

  const modelAccuracy = 97.1; // static fallback (backend doesn't send accuracy)

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="group flex items-center gap-2 mb-8 px-4 py-2 rounded-lg bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-cyan-500/30 hover:bg-white/20 dark:hover:bg-black/30 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-cyan-400 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-gray-700 dark:text-cyan-400">
            Back to Home
          </span>
        </button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 dark:from-cyan-400 dark:via-blue-400 dark:to-teal-400 bg-clip-text text-transparent">
            Prediction Results
          </h1>
          <div className="glass-card inline-block px-6 py-2">
            <p className="text-sm text-gray-600 dark:text-cyan-300">
              Sequence:{' '}
              <span className="font-mono font-bold text-gray-800 dark:text-cyan-400">
                {data.input}
              </span>
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <StatCard
            icon={<Activity className="w-6 h-6" />}
            label="Average Confidence"
            value={`${averageConfidence.toFixed(2)}%`}
            color="cyan"
          />
          <StatCard
            icon={<Target className="w-6 h-6" />}
            label="Model Accuracy"
            value={`${modelAccuracy.toFixed(2)}%`}
            color="green"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <LineGraph data={data.genexis_go_predictions} />
          <PieChart data={data.genexis_go_predictions} />
        </div>

        <div className="glass-card p-6">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-cyan-400 mb-6">
            Top Predicted GO Labels
          </h3>
          <div className="space-y-4">
            {data.genexis_go_predictions.map((result, index) => {
              const confidence = result.confidence * 100;

              return (
                <div
                  // FIX: Use fallback index to ensure uniqueness
                  key={result.id || index}
                  className="p-5 rounded-xl bg-gradient-to-r from-white/50 to-white/30 dark:from-black/30 dark:to-black/20 border border-gray-200/50 dark:border-cyan-500/20 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-lg font-bold text-gray-800 dark:text-cyan-300">
                          {result.id}
                        </h4>
                        <div className="text-right">
                          <div
                            className={`text-xl font-bold ${
                              confidence >= 70
                                ? 'text-green-600 dark:text-green-400'
                                : confidence >= 50
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {confidence.toFixed(2)}%
                          </div>
                          <div className="text-xs text-gray-500 dark:text-cyan-400/60">
                            Confidence
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-cyan-200/80 leading-relaxed">
                        {result.description}
                      </p>
                      <div className="mt-3">
                        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${
                              confidence >= 70
                                ? 'bg-gradient-to-r from-green-500 to-green-400'
                                : confidence >= 50
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                                : 'bg-gradient-to-r from-red-500 to-red-400'
                            }`}
                            style={{ width: `${confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  subtitle
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  subtitle?: string;
}) {
  const colorClasses = {
    cyan: 'text-cyan-500 dark:text-cyan-400',
    green: 'text-green-500 dark:text-green-400',
    yellow: 'text-yellow-500 dark:text-yellow-400',
    red: 'text-red-500 dark:text-red-400'
  };

  return (
    <div className="glass-card p-5 hover:scale-105 transition-transform group">
      <div
        className={`${colorClasses[color as keyof typeof colorClasses]} mb-3 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-800 dark:text-cyan-400 mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-cyan-300">
        {label}
      </div>
      {subtitle && (
        <div className="text-xs text-gray-500 dark:text-cyan-400/60 mt-1">
          {subtitle}
        </div>
      )}
    </div>
  );
}