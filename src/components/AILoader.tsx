import React from 'react';
import { Bot } from 'lucide-react'; // Clean AI Bot icon (Gemini style se alag)

interface AILoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  isSpinning?: boolean; // Control karne ke liye ki kab ghoomna hai
}

export const AILoader: React.FC<AILoaderProps> = ({
  message = 'Onyxia.ai is generating a response',
  size = 'sm',
  showText = true,
  isSpinning = false, // Default static rahega
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const radiusClasses = {
    sm: 'rounded-[7px]',
    md: 'rounded-[11px]',
    lg: 'rounded-[14px]',
  };

  return (
    <div className="flex items-center gap-3 justify-start">
      {/* ---------------- BRAND LOGO / LOADER ---------------- */}
      <div className="relative flex items-center justify-center shrink-0">
        {/* Glow halo sirf tabhi jab spinning ho */}
        {isSpinning && (
          <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 blur-sm opacity-50 animate-pulse" />
        )}

        {/* Gradient Border Container (Ghoomega tabhi jab isSpinning true ho) */}
        <div
          className={`relative ${sizeClasses[size]} bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20 ${
            isSpinning ? 'animate-spin' : ''
          }`}
          style={isSpinning ? { animationDuration: '3s' } : undefined}
        >
          <div
            className={`w-full h-full bg-[#0b0f19] ${radiusClasses[size]} flex items-center justify-center`}
          >
            <Bot
              className={`${iconSizes[size]} text-cyan-400 ${
                isSpinning ? 'animate-spin' : ''
              }`}
              style={isSpinning ? { animationDirection: 'reverse', animationDuration: '3s' } : undefined}
            />
          </div>
        </div>
      </div>

      {/* ---------------- TEXT & BOUNCING DOTS ---------------- */}
      {showText && (
        <div className="bg-[#161e2e] text-gray-300 px-4 py-2 rounded-2xl text-xs border border-gray-800 flex items-center gap-2 shadow-sm">
          <span className="flex items-center gap-1.5">
            <strong className="text-cyan-400 font-medium">Onyxia.ai</strong>{' '}
            {message.replace('Onyxia.ai', '')}
            <span className="flex gap-1 ml-1">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
            </span>
          </span>
        </div>
      )}
    </div>
  );
};

export default AILoader;