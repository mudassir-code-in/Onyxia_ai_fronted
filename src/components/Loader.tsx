import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950">
      <div className="flex flex-col items-center space-y-6">
        
        {/* Clean Professional Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-indigo-950"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 dark:border-t-indigo-400 animate-spin"></div>
        </div>

        {/* Stable Text with Smooth Bouncing Dots (...) */}
        <div className="flex items-center space-x-1">
          <span className="text-base font-semibold tracking-wider text-slate-700 dark:text-slate-200">
            Loading
          </span>
          <div className="flex space-x-1 ml-0.5">
            <span className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce"></span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Loader;