import { X, BookOpen, AlertOctagon, RefreshCw, RotateCcw, Zap, Terminal, Redo, EyeOff, Calculator } from "lucide-react";

export default function CheatSheet({ isOpen, onClose, onSelectRule }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-theme-dark-solid/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-theme-light border-4 border-theme-dark rounded-xl shadow-[0_0_50px_rgba(44,24,20,0.8)] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-theme-dark text-[#F3E9DC] p-4 flex justify-between items-center border-b-4 border-theme-accent shrink-0 z-10">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-theme-accent" />
            <h2 className="font-mono font-bold tracking-widest text-lg">MANUAL</h2>
          </div>
          <button onClick={onClose} className="hover:text-theme-accent transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="p-6 md:p-8 overflow-y-auto flex-1 font-sans text-theme-dark bg-theme-light relative">
          
          <div className="mb-8 relative z-10">
            <h3 className="font-mono text-theme-mid font-bold tracking-widest border-b-2 border-theme-sand pb-2 mb-4">
              SYSTEM OVERVIEW
            </h3>
            <p className="text-sm sm:text-base leading-relaxed mb-4 text-justify">
              Welcome to the PIXEL LOGIC simulation. Your objective is to observe the light sequences generated on the matrix and reproduce them according to the active execution rules.
            </p>
            <div className="bg-theme-dark-soft p-4 rounded-lg border-l-4 border-theme-accent shadow-md">
              <p className="font-mono text-xs sm:text-sm text-theme-light flex items-center gap-3">
                <Terminal className="w-4 h-4 text-theme-accent shrink-0" /> 
                System Integrity: You have 3 lives (❤️). Every incorrect input will decrement your life counter. Game Over occurs when integrity reaches zero.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <h3 className="font-mono text-theme-mid font-bold tracking-widest border-b-2 border-theme-sand pb-2 mb-6">
              EXECUTION MODIFIERS
            </h3>
            
            <div className="space-y-4">
              {/* Standard */}
              <button 
                onClick={() => onSelectRule('normal')}
                className="w-full text-left flex gap-4 sm:gap-6 items-start bg-white/50 p-4 rounded-xl border border-theme-sand/30 shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-theme-accent transition-all cursor-pointer group"
              >
                <div className="mt-1 bg-theme-dark-soft p-2 rounded-lg shrink-0 group-hover:bg-theme-accent transition-colors">
                  <Zap className="w-6 h-6 text-theme-sand group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-theme-dark font-mono text-base sm:text-lg uppercase group-hover:text-theme-accent transition-colors">Standard Array</h4>
                  <p className="text-sm mt-1 leading-relaxed opacity-90 text-justify">
                    The baseline rule. Observe the sequence and reproduce the exact index execution order from start to finish.
                  </p>
                </div>
              </button>

              {/* Reverse */}
              <button 
                onClick={() => onSelectRule('reverse')}
                className="w-full text-left flex gap-4 sm:gap-6 items-start bg-white/50 p-4 rounded-xl border border-theme-sand/30 shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-theme-accent transition-all cursor-pointer group"
              >
                <div className="mt-1 bg-theme-dark-soft p-2 rounded-lg shrink-0 group-hover:bg-theme-accent transition-colors">
                  <RotateCcw className="w-6 h-6 text-theme-sand group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-theme-dark font-mono text-base sm:text-lg uppercase group-hover:text-theme-accent transition-colors">LIFO Stack</h4>
                  <p className="text-sm mt-1 leading-relaxed opacity-90 text-justify">
                    Operator inversion active. You must output the observed sequence in Last-In-First-Out (Reverse) order. Start from the last tile shown and work backwards to the first.
                  </p>
                </div>
              </button>

              {/* Mirror */}
              <button 
                onClick={() => onSelectRule('mirror')}
                className="w-full text-left flex gap-4 sm:gap-6 items-start bg-white/50 p-4 rounded-xl border border-theme-sand/30 shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-theme-accent transition-all cursor-pointer group"
              >
                <div className="mt-1 bg-theme-dark-soft p-2 rounded-lg shrink-0 group-hover:bg-theme-accent transition-colors">
                  <RefreshCw className="w-6 h-6 text-theme-sand group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-theme-dark font-mono text-base sm:text-lg uppercase group-hover:text-theme-accent transition-colors">Spatial Matrix</h4>
                  <p className="text-sm mt-1 leading-relaxed opacity-90 text-justify">
                    X-Axis Reflection is active. You must calculate the horizontal opposite index before clicking. If a tile on the far left lights up, you must click the corresponding tile on the far right.
                  </p>
                </div>
              </button>

              {/* Distractor */}
              <button 
                onClick={() => onSelectRule('distractor')}
                className="w-full text-left flex gap-4 sm:gap-6 items-start bg-white/50 p-4 rounded-xl border border-theme-sand/30 shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-theme-accent transition-all cursor-pointer group"
              >
                <div className="mt-1 bg-theme-dark-soft p-2 rounded-lg shrink-0 group-hover:bg-theme-accent transition-colors">
                  <AlertOctagon className="w-6 h-6 text-theme-sand group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-theme-dark font-mono text-base sm:text-lg uppercase group-hover:text-theme-accent transition-colors">IF-THEN Skip</h4>
                  <p className="text-sm mt-1 leading-relaxed opacity-90 text-justify">
                    The array contains anomalies. If a tile flashes RED and produces a low-pitch error tone, skip its execution. You must only memorize and click the standard yellow flashes in order.
                  </p>
                </div>
              </button>

              {/* Rotated Matrix */}
              <button 
                onClick={() => onSelectRule('rotate90')}
                className="w-full text-left flex gap-4 sm:gap-6 items-start bg-white/50 p-4 rounded-xl border border-theme-sand/30 shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-theme-accent transition-all cursor-pointer group"
              >
                <div className="mt-1 bg-theme-dark-soft p-2 rounded-lg shrink-0 group-hover:bg-theme-accent transition-colors">
                  <Redo className="w-6 h-6 text-theme-sand group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-theme-dark font-mono text-base sm:text-lg uppercase group-hover:text-theme-accent transition-colors">Rotated Matrix</h4>
                  <p className="text-sm mt-1 leading-relaxed opacity-90 text-justify">
                    Grid orientation is shifted 90° clockwise. You must translate spatial coordinates before input. A tile flashing at the top-left must be clicked at the top-right.
                  </p>
                </div>
              </button>

              {/* Math Modifier */}
              <button 
                onClick={() => onSelectRule('math_1')}
                className="w-full text-left flex gap-4 sm:gap-6 items-start bg-white/50 p-4 rounded-xl border border-theme-sand/30 shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-theme-accent transition-all cursor-pointer group"
              >
                <div className="mt-1 bg-theme-dark-soft p-2 rounded-lg shrink-0 group-hover:bg-theme-accent transition-colors">
                  <Calculator className="w-6 h-6 text-theme-sand group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-theme-dark font-mono text-base sm:text-lg uppercase group-hover:text-theme-accent transition-colors">Math Modifier (+1 / -1)</h4>
                  <p className="text-sm mt-1 leading-relaxed opacity-90 text-justify">
                    Index transformation active. Shift every target index by +1 or -1 based on the mission intel. The grid wraps around, so shifting past the end returns to the beginning.
                  </p>
                </div>
              </button>

              {/* Blind Mode */}
              <button 
                onClick={() => onSelectRule('blind')}
                className="w-full text-left flex gap-4 sm:gap-6 items-start bg-white/50 p-4 rounded-xl border border-theme-sand/30 shadow-sm hover:bg-white hover:shadow-md hover:-translate-y-1 hover:border-theme-accent transition-all cursor-pointer group"
              >
                <div className="mt-1 bg-theme-dark-soft p-2 rounded-lg shrink-0 group-hover:bg-theme-accent transition-colors">
                  <EyeOff className="w-6 h-6 text-theme-sand group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-theme-dark font-mono text-base sm:text-lg uppercase group-hover:text-theme-accent transition-colors">Blind Mode</h4>
                  <p className="text-sm mt-1 leading-relaxed opacity-90 text-justify">
                    Visual interface goes offline during the input phase. The grid borders and hover effects disappear. Rely purely on your spatial memory to click the correct empty void.
                  </p>
                </div>
              </button>

            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
}