import { Terminal, X, HelpCircle } from "lucide-react";

export default function MissionPanel({ ruleInfo, systemMessage, levelData, openTutorial, showHelpTooltip, closeHelpTooltip, useHint, hintCost, score, gameState }) {
  return (
    <div className="bg-theme-dark-soft border border-theme rounded-xl shadow-lg relative">
      {/* Scanline effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(94,48,35,0)_50%,rgba(94,48,35,0.2)_50%),linear-gradient(90deg,rgba(192,133,82,0.06),rgba(137,87,55,0.04),rgba(94,48,35,0.06))] bg-[length:100%_4px,3px_100%] z-0 pointer-events-none opacity-20 rounded-xl overflow-hidden"></div>

      <div className="bg-theme-accent-soft border-b border-theme-accent p-3 flex items-center gap-2 relative z-20 rounded-t-xl">
        <Terminal className="w-4 h-4 text-theme-accent" />
        <h3 className="text-theme-accent font-mono text-sm font-bold tracking-wider">
          MISSION INTEL
        </h3>
        
        <div className="relative flex items-center ml-2">
          <button 
            onClick={openTutorial}
            className="w-5 h-5 rounded-full bg-theme-accent text-white flex items-center justify-center text-xs font-bold hover:bg-theme-mid transition-colors shadow-sm"
            title="View Tutorial"
          >
            ?
          </button>
          
          {showHelpTooltip && (
            <div className="absolute top-8 left-0 w-48 sm:w-56 bg-theme-dark-solid border-2 border-theme-accent text-white p-3 rounded-lg shadow-[0_0_20px_rgba(192,133,82,0.5)] z-50 animate-pulse">
              <div className="absolute top-[-7px] left-3 w-3 h-3 bg-theme-dark-solid border-t-2 border-l-2 border-theme-accent rotate-45"></div>
              
              <button 
                onClick={closeHelpTooltip}
                className="absolute top-1 right-1 text-theme-mid hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <p className="text-xs font-mono font-bold text-theme-accent mb-1">{"// SYSTEM ALERT"}</p>
              <p className="text-[11px] font-sans leading-relaxed mb-3 text-theme-light">
                You can replay the tutorial video at any time by clicking this icon!
              </p>
              
              <button 
                onClick={closeHelpTooltip}
                className="w-full bg-theme-accent hover:bg-theme-mid text-white text-[10px] font-bold font-mono py-1.5 rounded transition-colors"
              >
                OK, UNDERSTOOD
              </button>
            </div>
          )}
        </div>
        <div className="ml-auto flex gap-1">
          <div className="w-2 h-2 rounded-full bg-theme-accent-50"></div>
          <div className="w-2 h-2 rounded-full bg-theme-accent-50"></div>
        </div>
      </div>

      <div className="p-5 font-mono text-sm text-theme-dark flex flex-col gap-4 relative z-10">
        <div>
          <p className="text-theme-mid mb-1 opacity-70">// CURRENT DIRECTIVE:</p>
          <div className="flex items-start gap-3 bg-theme-sand-soft p-3 rounded border border-theme">
            <div className="mt-0.5">{ruleInfo.icon}</div>
            <div>
              <strong className="block text-theme-dark mb-1">
                {ruleInfo.title}
              </strong>
              <p className="text-xs leading-relaxed opacity-80">
                {ruleInfo.desc}
              </p>
            </div>
          </div>
        </div>

        <div>
          <p className="text-theme-mid mb-1 opacity-70">// SYSTEM LOG:</p>
          <div className="bg-theme-dark-solid-50 p-3 rounded border border-theme h-20 overflow-hidden flex items-end">
            <p className="text-xs break-all animate-pulse">
              {">"} {systemMessage}
              <span className="inline-block w-2 h-4 bg-theme-accent ml-1 translate-y-1 animate-ping"></span>
            </p>
          </div>
        </div>

        <div className="mt-2 text-[10px] text-theme-mid uppercase tracking-widest border-t border-theme pt-3 flex justify-between items-end">
          <div>
            Target Array Len: {levelData.expected.length} <br />
            Memory Allocated: OK
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <span className="text-[9px] text-theme-mid opacity-70">COST INCREASES PER USE</span>
            <button
              onClick={useHint}
              disabled={gameState !== 'playing' || score < hintCost}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-bold text-xs shadow-sm transition-all border ${
                gameState !== 'playing' || score < hintCost
                  ? 'bg-theme-surface border-theme-dark/20 text-theme-dark/40 cursor-not-allowed'
                  : 'bg-theme-accent text-white border-theme-accent hover:bg-theme-mid hover:scale-105 active:scale-95 cursor-pointer'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              HINT (-{hintCost} Pts)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}