import { ShieldAlert, Play, RefreshCw, TerminalSquare } from "lucide-react";

export default function Overlays({
  gameState,
  startGame,
  nextLevel,
  score
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
          <div className="text-theme-accent mb-6 text-center">
            <h3 className="text-4xl font-black tracking-tight mb-2">
              CRITICAL ERROR
            </h3>
            <p className="font-mono text-sm opacity-80">
              OUT OF MEMORY (LIVES)
            </p>
          </div>
          <p className="mb-8 font-mono text-theme-sand">
            Final Output:{" "}
            <span className="text-theme-light font-bold">{score}</span>
          </p>
          <button
            onClick={startGame}
            className="flex items-center gap-2 bg-theme-surface hover:bg-theme-sand text-theme-dark px-6 py-3 rounded-full font-mono text-sm tracking-wide transition-all border border-theme hover:border-theme-accent"
          >
            <RefreshCw className="w-4 h-4" />
            REBOOT SYSTEM
          </button>
        </div>
      )}
    </>
  );
}