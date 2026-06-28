import { useState, type ComponentProps } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { DNABackground } from './components/DNABackground';
import { LandingPage } from './components/LandingPage';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultsPage } from './components/ResultsPage';
import { GenexisQuery } from './components/QueryLive';
import ResultChatbot from './components/ResultChatbot'; 
import { PredictionData } from './types/GOResult';

type ResultChatbotData = ComponentProps<typeof ResultChatbot>['data'];

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'loading' | 'results'>('landing');
  const [currentSequence, setCurrentSequence] = useState('');
  const [results, setResults] = useState<PredictionData | null>(null);

  const handleAnalyze = async (sequence: string) => {
    setCurrentSequence(sequence);
    setCurrentView('loading');

    try {
      const res = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: sequence }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await res.json();
      setResults(data);
      setCurrentView('results');
    } catch (err) {
      console.error('❌ Error fetching prediction:', err);
      alert('An error occurred while analyzing the sequence.');
      setCurrentView('landing');
    }
  };

  const handleBack = () => {
    setResults(null);
    setCurrentView('landing');
  };

  return (
    <ThemeProvider>
      <div className="relative min-h-screen">
        <DNABackground />
        <ThemeToggle />

        {currentView === 'landing' && <LandingPage onAnalyze={handleAnalyze} />}
        {currentView === 'loading' && <LoadingScreen />}
        
        {currentView === 'results' && results && (
          <div className="container mx-auto px-4 pb-12">
            {/* --- WRAPPER ADDED HERE FOR PDF CAPTURE --- */}
            <div id="genexis-charts">
               <ResultsPage data={results} onBack={handleBack} />
            </div>
            {/* ------------------------------------------ */}
            
            {/* --- UPDATED: Grid Layout for Live Query & Chatbot --- */}
            <div className="mt-8 max-w-7xl mx-auto animate-fade-in-up">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left side: The Live Query Data */}
                <GenexisQuery data={results} />
                
                {/* Right side: The AI Chatbot */}
                {/* Cast results to any to avoid cross-file type incompatibility between
                    types/GOResult.PredictionData and the local ResultChatbot prop types. */}
                <ResultChatbot data={results as any} />
              </div>
            </div>
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;