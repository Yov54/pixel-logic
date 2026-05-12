import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ShieldAlert, Play, RefreshCw, AlertTriangle } from "lucide-react";

export default function Overlays({
  gameState,
  startGame,
  nextLevel,
  score,
  difficulty = 'medium',
  highScore = 0,
  freezeTimeLeft = 0
}) {
  const [gameOverPhase, setGameOverPhase] = useState(0);
  const [restartCountdown, setRestartCountdown] = useState(3);

  useEffect(() => {
    if (gameState === "gameOver") {
      setGameOverPhase(1); // Phase 1: Crash
      const timer1 = setTimeout(() => setGameOverPhase(2), 1500); // Phase 2: Typing (starts at 1.5s)
      const timer2 = setTimeout(() => setGameOverPhase(3), 4000); // Phase 3: Results (starts at 4.0s, giving Phase 2 full 2.5s)
      return () => { clearTimeout(timer1); clearTimeout(timer2); };
    } else {
      setGameOverPhase(0);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameOverPhase === 3) {
      setRestartCountdown(3);
      const t1 = setTimeout(() => setRestartCountdown(2), 1000);
      const t2 = setTimeout(() => setRestartCountdown(1), 2000);
      const t3 = setTimeout(() => setRestartCountdown(0), 3000);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }
  }, [gameOverPhase]);

  const handleRestart = () => {
    if (restartCountdown === 0) {
      startGame(difficulty);
    }
  };

  return (
    <>
      {gameState === "idle" && (
        <div className="absolute inset-0 bg-theme-dark-solid backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20">
          <ShieldAlert className="w-16 h-16 text-theme-sand mb-4" />
          <button
            onClick={() => startGame(difficulty)}
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

      {gameState === "frozen" && (
        <div className="absolute inset-0 bg-red-900/40 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center z-20 animate-pulse border-4 border-red-500/50">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
          <h2 className="text-3xl font-black text-red-500 tracking-widest mb-2 text-center drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
            SYSTEM FROZEN
          </h2>
          <div className="bg-red-950/80 border border-red-500/50 p-4 rounded-xl text-center mb-6">
            <p className="text-red-200 font-mono text-sm tracking-widest mb-1 uppercase">Penalty Applied</p>
            <p className="text-red-400 font-bold font-mono text-xl">-500 PTS</p>
          </div>
          <div className="text-center">
             <p className="text-red-300 font-mono text-xs tracking-widest mb-2 uppercase opacity-80">Rebooting In</p>
             <div className="text-6xl font-black text-red-500 font-mono drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
               {freezeTimeLeft}s
             </div>
          </div>
        </div>
      )}

      {/* GAME OVER FULLSCREEN OVERLAYS via Portal */}
      {gameState === "gameOver" && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[150] pointer-events-auto flex items-center justify-center bg-black overflow-hidden font-mono">
          
          {/* Phase 1: Crash */}
          {gameOverPhase === 1 && (
            <div className="absolute inset-0 flex items-center justify-center bg-red-900/30 animate-[shake_0.1s_ease-in-out_infinite]">
              <div className="game-over-glitch text-red-500 text-6xl sm:text-8xl md:text-9xl font-black tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] flex items-center gap-4">
                <AlertTriangle className="w-20 h-20 sm:w-32 sm:h-32" />
                CRASH
              </div>
              <div className="absolute inset-0 bg-red-600/20 mix-blend-overlay"></div>
            </div>
          )}

          {/* Phase 2 & 3 Background & Effects */}
          {gameOverPhase >= 2 && (
            <>
              <div className="absolute inset-0 bg-[#0a0a0a]"></div>
              <div className="absolute inset-0 game-over-scanlines opacity-50"></div>
              
              {/* Typewriter text - System Failure */}
              {gameOverPhase === 2 && (
                <div className="w-full flex justify-center items-center z-10 relative">
                  <div className="inline-block overflow-hidden whitespace-nowrap border-r-4 border-red-500 animate-typewriter text-red-500 text-sm sm:text-xl md:text-3xl lg:text-4xl font-bold drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
                    SYSTEM FAILURE... CONNECTION LOST.
                  </div>
                </div>
              )}

              {/* Phase 3: Results Panel */}
              {gameOverPhase === 3 && (
                <div className="relative z-20 flex flex-col items-center justify-center bg-theme-dark border-4 border-theme-accent p-8 sm:p-12 shadow-[0_0_50px_rgba(192,133,82,0.4)] max-w-lg w-[90%] animate-fadeSlideUp rounded-xl">
                  <h3 className="text-3xl sm:text-5xl font-black text-theme-accent mb-2 tracking-widest uppercase drop-shadow-[0_0_10px_rgba(192,133,82,0.5)]">
                    GAME OVER
                  </h3>
                  
                  <div className="text-theme-sand text-sm sm:text-base mb-8 opacity-80 uppercase tracking-widest">
                    DIFFICULTY: {difficulty}
                  </div>

                  <div className="w-full bg-theme-dark-soft border border-theme-mid p-6 rounded-lg mb-8 flex flex-col items-center gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-theme-sand text-xs tracking-widest uppercase">FINAL SCORE</span>
                      <span className="text-4xl sm:text-5xl font-bold text-theme-light drop-shadow-[0_0_10px_rgba(243,233,220,0.5)]">{score}</span>
                    </div>
                    
                    <div className="h-px w-full bg-theme-mid opacity-30 my-2"></div>
                    
                    <div className="flex flex-col items-center">
                      <span className="text-theme-sand text-xs tracking-widest uppercase">HIGH SCORE</span>
                      <span className="text-2xl sm:text-3xl font-bold text-theme-accent">{highScore}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleRestart}
                    disabled={restartCountdown > 0}
                    className={`group w-full flex items-center justify-center gap-3 px-6 py-4 rounded font-bold tracking-widest transition-all border-2 ${
                      restartCountdown > 0
                        ? 'bg-theme-surface text-theme-muted border-theme cursor-not-allowed'
                        : 'bg-theme-accent hover:bg-theme-mid text-theme-dark hover:text-theme-light border-theme-accent hover:border-theme-light shadow-[0_0_15px_rgba(192,133,82,0.6)] cursor-pointer'
                    }`}
                  >
                    <RefreshCw className={`w-5 h-5 ${restartCountdown === 0 ? 'group-hover:rotate-180 transition-transform duration-500' : ''}`} />
                    {restartCountdown > 0 ? `REBOOTING IN ${restartCountdown}...` : 'REBOOT SYSTEM'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>,
        document.body
      )}
    </>
  );
}