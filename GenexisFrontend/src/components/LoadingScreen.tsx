export function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-gray-900 dark:via-blue-950 dark:to-cyan-950">
      <div className="text-center">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-cyan-200 dark:border-cyan-900 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 dark:border-t-cyan-400 rounded-full animate-spin" />
          <div className="absolute inset-2 border-4 border-transparent border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-16 h-16 text-cyan-600 dark:text-cyan-400" viewBox="0 0 24 24" fill="none">
              <path
                d="M 4 4 Q 6 12 4 20 M 8 4 Q 6 12 8 20"
                stroke="currentColor"
                strokeWidth="2"
                className="animate-pulse"
              />
              <circle cx="4" cy="6" r="1.5" fill="currentColor" />
              <circle cx="8" cy="6" r="1.5" fill="currentColor" />
              <circle cx="4" cy="12" r="1.5" fill="currentColor" />
              <circle cx="8" cy="12" r="1.5" fill="currentColor" />
              <circle cx="4" cy="18" r="1.5" fill="currentColor" />
              <circle cx="8" cy="18" r="1.5" fill="currentColor" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-cyan-400 mb-2">
          Analyzing Sequence
        </h2>
        <p className="text-gray-600 dark:text-cyan-300/70">
          Processing genomic data...
        </p>
      </div>
    </div>
  );
}
