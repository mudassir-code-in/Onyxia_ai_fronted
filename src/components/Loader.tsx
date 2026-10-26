import { Bot } from 'lucide-react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loadin' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0f19] text-gray-200 font-sans">
      <div className="flex flex-col items-center space-y-6">
        
        {/* ---------------- BRAND LOGO / SPINNER ---------------- */}
        <div className="relative flex items-center justify-center shrink-0 scale-125">
          {/* Glowing Halo */}
          <span className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 blur-md opacity-60 animate-pulse" />

          {/* Spinning Gradient Border Container */}
          <div
            className="relative w-14 h-14 bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-600 p-[1.5px] rounded-[16px] shadow-xl shadow-cyan-500/20 animate-spin"
            style={{ animationDuration: '3s' }}
          >
            <div className="w-full h-full bg-[#0b0f19] rounded-[14.5px] flex items-center justify-center">
              <Bot
                className="w-7 h-7 text-cyan-400 animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '3s' }}
              />
            </div>
          </div>
        </div>

        {/* ---------------- TEXT & BOUNCING DOTS ---------------- */}
        <div className="bg-[#161e2e] text-gray-300 px-5 py-2.5 rounded-2xl text-xs border border-gray-800/80 flex items-center gap-2 shadow-lg">
          <span className="flex items-center gap-1.5 font-medium">
            {message}
            <span className="flex gap-1 ml-1.5">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
            </span>
          </span>
        </div>

      </div>
    </div>
  );
};

export default Loader;