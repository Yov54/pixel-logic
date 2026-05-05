import { ShieldAlert, Play, RefreshCw, TerminalSquare, Trophy } from "lucide-react";

export default function Overlays({
  gameState,
  startGame,
  nextLevel,
  score,
  isNewPersonalBest,
  isSubmitting,
  onOpenLeaderboard
}) {

  return (
    <>
      {gameState === "idle" && (
        <div className="absolute inset-0 bg-theme-dark-solid backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20">
          <ShieldAlert className="w-16 h-16 text-theme-sand mb-4" />
          <button
            onClick={startGame}
            className="group flex items-center gap-2 bg-theme-accent hover:bg-theme-mid text-theme-light px-8 py-3 rounded-full font-bold tracking-wide transition-all hover:shadow-[0_0_20px_rgba(192,133,82,0.5)]"
          >
            <Play className="w-5 h-5 fill-current" />
            INITIATE SIMULATION
          </button>
        </div>
      )}

      {gameState === "levelComplete" && (
        <div className="absolute inset-0 bg-theme-sand-soft backdrop-blur-md rounded-2xl flex flex-col items-center justify-center z-20 animate-in fade-in duration-300">
          <div className="text-theme-dark mb-6 text-center">
            <h3 className="text-3xl font-black tracking-tight mb-2">
              LEVEL CLEARED
            </h3>
            <p className="font-mono text-sm opacity-80">+100 EXP</p>
          </div>
          <button
            onClick={nextLevel}
            className="bg-theme-mid hover:bg-theme-dark text-theme-light px-8 py-3 rounded-full font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(94,48,35,0.4)]"
          >
            COMPILE NEXT STAGE
          </button>
        </div>
      )}

      {gameState === "gameOver" && (
        <div className="absolute inset-0 bg-theme-dark-solid backdrop-blur-md rounded-2xl flex flex-col items-center justify-center z-20 animate-in fade-in zoom-in duration-300">
          <div className="text-theme-accent mb-4 text-center">
            <h3 className="text-4xl font-black tracking-tight mb-2">
              CRITICAL ERROR
            </h3>
            <p className="font-mono text-sm opacity-80">
              OUT OF MEMORY (LIVES)
            </p>
          </div>

          {/* Personal Best Badge */}
          {isNewPersonalBest && (
            <div className="mb-3 px-4 py-1.5 bg-yellow-500/20 border border-yellow-500/40 rounded-full font-mono text-sm text-yellow-400 font-bold tracking-widest animate-pulse">
              🏆 NEW PERSONAL BEST!
            </div>
          )}

          <p className="mb-6 font-mono text-theme-sand">
            Final Output:{" "}
            <span className="text-theme-light font-bold text-lg">{score}</span>
          </p>

          {/* Submission status */}
          {isSubmitting && (
            <p className="mb-4 font-mono text-xs text-theme-sand/60 tracking-widest animate-pulse">
              UPLOADING TO GLOBAL LEADERBOARD...
            </p>
          )}
          {!isSubmitting && score > 0 && (
            <p className="mb-4 font-mono text-xs text-theme-sand/40 tracking-widest">
              ✓ SCORE SUBMITTED
            </p>
          )}

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={startGame}
              className="flex items-center gap-2 bg-theme-surface hover:bg-theme-sand text-theme-dark px-6 py-3 rounded-full font-mono text-sm tracking-wide transition-all border border-theme hover:border-theme-accent"
            >
              <RefreshCw className="w-4 h-4" />
              REBOOT SYSTEM
            </button>

            <button
              onClick={onOpenLeaderboard}
              className="flex items-center gap-2 text-theme-sand/70 hover:text-theme-accent font-mono text-xs tracking-widest transition-colors"
            >
              <Trophy className="w-3.5 h-3.5" />
              VIEW LEADERBOARD
            </button>
          </div>
        </div>
      )}
    </>
  );
}