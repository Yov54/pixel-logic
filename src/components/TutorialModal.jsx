import { useState, useEffect } from "react";
import { PlaySquare, MousePointer2, X } from "lucide-react";

export default function TutorialModal({ rule, ruleInfo, onClose }) {
  const [activeFlash, setActiveFlash] = useState(null);
  const [cursorPos, setCursorPos] = useState(null);
  const [clickedTile, setClickedTile] = useState(null);
  const [isInputPhase, setIsInputPhase] = useState(false);

  const isKeyboardMode = rule === 'keypad' || rule === 'keypad_random';
  const keypadLabels = isKeyboardMode 
    ? (rule === 'keypad_random' ? ['5', '2', '9', '1', '7', '4', '8', '3', '6'] : ['1', '2', '3', '4', '5', '6', '7', '8', '9']) 
    : null;

  useEffect(() => {
    let isCancelled = false;

    // Define sequences for each rule based on a 3x3 grid (indices 0-8)
    const getSequence = () => {
      switch (rule) {
        case 'distractor':
          return {
            flashes: [
              { index: 0, type: 'normal' },
              { index: 4, type: 'distractor' },
              { index: 8, type: 'normal' }
            ],
            clicks: [0, 8] // skip the distractor (4)
          };
        case 'mirror':
          return {
            flashes: [
              { index: 0, type: 'normal' },
              { index: 5, type: 'normal' }
            ],
            clicks: [2, 3] // mirror of 0 is 2, mirror of 5 is 3 in 3x3
          };
        case 'reverse':
          return {
            flashes: [
              { index: 0, type: 'normal' },
              { index: 4, type: 'normal' },
              { index: 8, type: 'normal' }
            ],
            clicks: [8, 4, 0] // reverse order
          };
        case 'rotate90':
          return {
            flashes: [
              { index: 0, type: 'normal' },
              { index: 3, type: 'normal' },
              { index: 7, type: 'normal' }
            ],
            clicks: [2, 1, 3] // 0->2, 3->1, 7->3
          };
        case 'math_1':
          return {
            flashes: [
              { index: 0, type: 'normal' },
              { index: 4, type: 'normal' },
              { index: 8, type: 'normal' }
            ],
            clicks: [1, 5, 0] // 0+1=1, 4+1=5, 8+1=9->0
          };
        case 'math_-1':
          return {
            flashes: [
              { index: 0, type: 'normal' },
              { index: 4, type: 'normal' },
              { index: 8, type: 'normal' }
            ],
            clicks: [8, 3, 7] // 0-1=-1->8, 4-1=3, 8-1=7
          };
        case 'blind':
          return {
            flashes: [
              { index: 0, type: 'normal' },
              { index: 4, type: 'normal' },
              { index: 8, type: 'normal' }
            ],
            clicks: [0, 4, 8]
          };
        case 'keypad':
        case 'keypad_random':
          return {
            flashes: [
              { index: 0, type: 'normal' },
              { index: 4, type: 'normal' },
              { index: 8, type: 'normal' }
            ],
            clicks: [0, 4, 8]
          };
        case 'normal':
        default:
          return {
            flashes: [
              { index: 0, type: 'normal' },
              { index: 4, type: 'normal' },
              { index: 8, type: 'normal' }
            ],
            clicks: [0, 4, 8]
          };
      }
    };

    const runAnimation = async () => {
      const seq = getSequence();

      while (!isCancelled) {
        // Reset states
        setActiveFlash(null);
        setCursorPos(null);
        setClickedTile(null);
        setIsInputPhase(false);

        await new Promise(r => setTimeout(r, 800));
        if (isCancelled) break;

        // 1. Play flashes
        for (let flash of seq.flashes) {
          setActiveFlash(flash);
          await new Promise(r => setTimeout(r, 500));
          if (isCancelled) break;
          setActiveFlash(null);
          await new Promise(r => setTimeout(r, 200));
          if (isCancelled) break;
        }

        await new Promise(r => setTimeout(r, 600));
        if (isCancelled) break;

        // 2. Play clicks
        setIsInputPhase(true);
        for (let clickIndex of seq.clicks) {
          setCursorPos(clickIndex);
          await new Promise(r => setTimeout(r, 400)); // move cursor
          if (isCancelled) break;

          setClickedTile(clickIndex);
          await new Promise(r => setTimeout(r, 200)); // click down
          if (isCancelled) break;
          
          setClickedTile(null);
          await new Promise(r => setTimeout(r, 300)); // wait a bit
          if (isCancelled) break;
        }

        setCursorPos(null);
        setIsInputPhase(false);
        await new Promise(r => setTimeout(r, 1500)); // pause before repeating
      }
    };

    runAnimation();

    return () => { isCancelled = true; };
  }, [rule]);

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-theme-dark-solid-50 backdrop-blur-sm">
      <div className="bg-theme-surface w-full max-w-md rounded-2xl border border-theme-accent shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="bg-theme-accent p-4 flex items-center justify-between text-theme-light">
          <div className="flex items-center gap-2">
            <PlaySquare className="w-5 h-5" />
            <h2 className="font-mono font-bold tracking-widest text-sm">SYSTEM TUTORIAL</h2>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 bg-theme-surface border border-theme text-theme-dark rounded hover:bg-theme-accent hover:text-white transition-all duration-200 hover:scale-105 shadow-sm active:scale-95"
          >
            <X className="w-3.5 h-3.5" />
            SKIP / CLOSE
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center">
          
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-theme-dark mb-2 flex items-center justify-center gap-2">
              {ruleInfo?.icon} {ruleInfo?.title}
            </h3>
            <p className="text-sm text-theme-mid">{ruleInfo?.desc}</p>
          </div>

          {/* Mini Grid Simulator */}
          <div className="relative w-48 h-48 bg-theme-dark-soft p-2 rounded-xl border border-theme">
            <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-2 relative">
              {Array.from({ length: 9 }).map((_, index) => {
                const isFlashing = activeFlash?.index === index;
                const isDistractor = isFlashing && activeFlash?.type === 'distractor';
                const isClicked = clickedTile === index;
                
                const isBlindMode = rule === 'blind' && isInputPhase;

                let tileStyle = "bg-theme-light opacity-50 border border-theme";
                
                if (isBlindMode && !isFlashing && !isClicked) {
                   tileStyle = "opacity-0"; // Hide tiles in blind mode input phase
                } else if (isDistractor) {
                  tileStyle = "tile-flash-distractor opacity-100 z-10 scale-110";
                } else if (isFlashing) {
                  tileStyle = "tile-flash-main opacity-100 z-10 scale-110";
                } else if (isClicked) {
                  tileStyle = "tile-correct scale-95 opacity-100";
                }

                return (
                  <div 
                    key={index}
                    className={`rounded-lg transition-all duration-200 flex items-center justify-center text-xs font-mono text-theme-mid-soft ${tileStyle}`}
                  >
                    {!isBlindMode && (keypadLabels ? (
                      <span className="text-lg font-bold text-theme-sand opacity-80">{keypadLabels[index]}</span>
                    ) : index)}
                  </div>
                );
              })}

              {/* Fake Cursor or Keyboard Key */}
              {cursorPos !== null && (
                <div 
                  className={`absolute pointer-events-none transition-all ease-out z-20 ${isKeyboardMode ? 'inset-0 flex items-center justify-center duration-150' : 'duration-300'}`}
                  style={isKeyboardMode ? {} : {
                    left: `${(cursorPos % 3) * 33.33 + 16}%`,
                    top: `${Math.floor(cursorPos / 3) * 33.33 + 16}%`,
                  }}
                >
                  {isKeyboardMode ? (
                    <div className={`bg-theme-surface text-theme-dark font-mono font-bold text-3xl w-16 h-16 rounded-xl border-4 border-b-8 border-theme-mid shadow-[0_10px_20px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center transition-all ${clickedTile !== null ? 'translate-y-2 border-b-4 scale-95 shadow-[0_2px_5px_rgba(0,0,0,0.5)]' : 'scale-100'}`}>
                       <span className="text-[8px] text-theme-sand mb-0.5 font-sans font-black tracking-widest opacity-80 uppercase leading-none">PRESS</span>
                       {keypadLabels[cursorPos]}
                    </div>
                  ) : (
                    <MousePointer2 
                      className={`w-6 h-6 text-theme-dark drop-shadow-md transition-transform ${clickedTile !== null ? 'scale-75' : 'scale-100'}`} 
                      fill="white"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center text-xs font-mono text-theme-mid opacity-70 animate-pulse">
            {"// OBSERVING SIMULATION..."}
          </div>

        </div>
      </div>
    </div>
  );
}
