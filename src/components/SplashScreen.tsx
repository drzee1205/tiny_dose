import { useEffect, useState } from 'react';
import { Droplets } from 'lucide-react';

export default function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2; // Progress increases by 2% every 100ms for 5 seconds
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-blue-950 dark:via-gray-900 dark:to-blue-900 flex items-center justify-center z-50">
      <div className="text-center space-y-8 p-8">
        {/* Animated Logo */}
        <div className="relative">
          <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl mx-auto shadow-2xl transform transition-all duration-1000 animate-pulse">
            <Droplets className="h-12 w-12 text-white drop-shadow-lg" />
          </div>
          {/* Ripple effect */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-3xl border-4 border-blue-300 dark:border-blue-400 animate-ping opacity-30"></div>
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-3xl border-2 border-blue-200 dark:border-blue-500 animate-ping opacity-20 animation-delay-200"></div>
        </div>
        
        {/* App Name and Tagline */}
        <div className="space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-200 bg-clip-text text-transparent">
            TinyDose
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 font-medium tracking-wide">
            Precision care in every drop
          </p>
          
          {/* Loading Progress */}
          <div className="w-64 mx-auto space-y-3">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-100 ease-out shadow-sm"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
              Loading pediatric drug database... {Math.round(progress)}%
            </p>
          </div>
        </div>

        {/* Medical Badge */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">444 medications • 23 specialties • PWA ready</span>
        </div>
      </div>
    </div>
  );
}