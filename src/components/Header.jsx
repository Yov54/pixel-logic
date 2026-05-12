import { Heart, Cpu, Pause, Settings } from "lucide-react";

export default function Header({ lives, score, highScore, onPause, isMultiplayer, openSettings }) {
  return (
    <header className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-2 md:mb-4 border-b border-theme pb-2 sm:pb-4 gap-2 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="p-1.5 sm:p-2 bg-theme-sand-soft rounded-lg">
          <Cpu className="w-6 h-6 sm:w-8 sm:h-8 text-theme-mid" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-theme-dark">PIXEL LOGIC</h1>
          <p className="text-[10px] sm:text-xs text-theme-mid tracking-widest uppercase">
            Syntax Training Simulator
          </p>
        </div>
        {isMultiplayer ? (
          <button 
            onClick={openSettings}
            className="ml-2 sm:ml-4 p-1.5 sm:p-2 rounded-full bg-theme-surface border border-theme shadow-sm hover:bg-theme-sand-soft transition-colors text-theme-mid hover:text-theme-accent"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        ) : (
          <button 
            onClick={onPause}
            className="ml-2 sm:ml-4 p-1.5 sm:p-2 rounded-full bg-theme-surface border border-theme shadow-sm hover:bg-theme-sand-soft transition-colors text-theme-mid hover:text-theme-accent"
            title="Pause Game"
          >
            <Pause className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs sm:text-sm font-mono bg-theme-surface px-4 py-2 sm:px-6 sm:py-3 rounded-xl border border-theme shadow-inner">
        <div className="flex flex-col items-center">
          <span className="text-theme-mid text-[9px] sm:text-[10px]">LIVES</span>
          <div className="flex gap-1.5 mt-1">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-5 h-5 transition-all duration-300 ${
                  heartIndex <= lives
                    ? "fill-theme-accent text-theme-accent drop-shadow-[0_0_8px_rgba(192,133,82,0.8)] scale-100"
                    : "text-theme-dark opacity-15 scale-75"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="w-px h-8 bg-theme-dark-soft"></div>

        <div className="flex flex-col">
          <span className="text-theme-mid text-[10px]">SCORE</span>
          <span className="text-lg text-theme-mid font-bold">
            {score.toString().padStart(4, "0")}
          </span>
        </div>

        <div className="w-px h-8 bg-theme-dark-soft"></div>

        <div className="flex flex-col">
          <span className="text-theme-mid text-[10px]">HIGH SCORE</span>
          <span className="text-lg text-theme-accent font-bold">
            {highScore.toString().padStart(4, "0")}
          </span>
        </div>
      </div>
    </header>
  );
}