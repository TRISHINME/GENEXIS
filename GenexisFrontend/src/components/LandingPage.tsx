import { Dna, Brain, TrendingUp, Shield, Search } from 'lucide-react';
import { useState } from 'react';

interface LandingPageProps {
  onAnalyze: (sequence: string) => void;
}

export function LandingPage({ onAnalyze }: LandingPageProps) {
  const [sequence, setSequence] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sequence.trim()) {
      onAnalyze(sequence.trim());
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6">
            <div className="relative">
              <Dna className="w-20 h-20 text-cyan-500 dark:text-cyan-400 animate-pulse-slow" />
              <div className="absolute inset-0 blur-xl bg-cyan-500/30 dark:bg-cyan-400/30 animate-pulse" />
            </div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600 dark:from-cyan-400 dark:via-blue-400 dark:to-teal-400 bg-clip-text text-transparent animate-gradient">
            GENEXIS
          </h1>

          <p className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-cyan-300 mb-4">
            Predicting Gene Function from Sequence using Transformers.
          </p>

          <p className="text-lg text-gray-600 dark:text-cyan-200/80 max-w-3xl mx-auto leading-relaxed">
            GENEXIS leverages advanced transformer architecture to decode the language of life.
            By analyzing protein sequences and DNA patterns, it predicts Gene Ontology (GO) labels
            with remarkable accuracy, revealing cellular functions, molecular activities, and biological processes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="Deep Learning"
            description="Powered by state-of-the-art transformer neural networks trained on vast genomic databases"
          />
          <FeatureCard
            icon={<Dna className="w-8 h-8" />}
            title="GO Prediction"
            description="Accurately predicts Gene Ontology labels for molecular function, biological process, and cellular component"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="High Accuracy"
            description="Advanced attention mechanisms ensure precise predictions with confidence scoring"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Risk Assessment"
            description="Confidence levels help researchers evaluate prediction reliability and plan validation experiments"
          />
        </div>

        <div className="glass-card p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-cyan-400 mb-6 text-center">
            Analyze Your Sequence
          </h2>
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={sequence}
                onChange={(e) => setSequence(e.target.value)}
                placeholder="Enter DNA or Protein sequence (e.g., A2RU14)"
                className="w-full px-6 py-4 pr-14 rounded-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-cyan-500/30 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none text-gray-800 dark:text-cyan-300 placeholder-gray-400 dark:placeholder-cyan-600 transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600 text-white rounded-full hover:shadow-lg hover:shadow-cyan-500/50 dark:hover:shadow-cyan-400/50 transition-all duration-300 transform hover:scale-105"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-cyan-500/70 mt-3 text-center">
              Or try a sample:
              <button
                type="button"
                onClick={() => onAnalyze('A2RU14')}
                className="ml-2 text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
              >
                A2RU14
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="glass-card p-6 hover:scale-105 transition-transform duration-300 group">
      <div className="text-cyan-500 dark:text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-cyan-300 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-cyan-200/70">
        {description}
      </p>
    </div>
  );
}
