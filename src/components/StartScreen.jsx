import { useState, useEffect } from "react";
import { Heart, Settings, BookOpen } from "lucide-react";

export default function StartScreen({ onStart, openSettings, openManual }) {
  const [highScore, setHighScore] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

  useEffect(() => {
    let savedScore = localStorage.getItem(`pixelLogicHighScore_${selectedDifficulty}`);
    
    // Backward compatibility for old score mapping to medium
    if (!savedScore && selectedDifficulty === 'medium') {
      savedScore = localStorage.getItem('pixelLogicHighScore');
      if (savedScore) {
        localStorage.setItem('pixelLogicHighScore_medium', savedScore);
      }
    }
    
    setHighScore(savedScore ? parseInt(savedScore, 10) : 0);
  }, [selectedDifficulty]);

  const handleStartClick = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onStart(selectedDifficulty);
    }, 700);
  };

  return (
    <div className={`fixed inset-0 z-[200] bg-theme-light flex flex-col justify-center items-center font-sans overflow-hidden transition-all duration-700 ease-in-out ${isTransitioning ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>

      {/* Outer CRT Casing */}
      <div className={`w-[96vw] h-[96vh] sm:w-[98vw] sm:h-[98vh] max-w-[2000px] bg-theme-dark rounded-[2rem] sm:rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_-10px_20px_rgba(0,0,0,0.5),inset_0_5px_15px_rgba(255,255,255,0.05)] border-4 sm:border-8 border-theme-mid p-3 sm:p-6 md:p-8 relative flex flex-col justify-center items-center transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] origin-center ${isTransitioning ? 'scale-[2] sm:scale-[3] blur-md' : 'scale-100 blur-0'}`}>

        {/* CRT Bezel / Inner Casing Details */}
        <div className="absolute top-2 right-6 sm:top-4 sm:right-12 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse"></div>

        {/* Inner Screen Mask (Thick Black Border) */}
        <div className="w-full h-full bg-[#1A0C06] rounded-[1rem] sm:rounded-[2rem] border-[8px] sm:border-[16px] border-[#2A150D] shadow-[inset_0_0_40px_rgba(0,0,0,1)] relative overflow-hidden flex flex-col">

          {/* CRT Screen Tint & Vignette */}
          <div className="absolute inset-0 bg-[#351A10] mix-blend-screen opacity-50 z-0"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)] z-0 pointer-events-none"></div>

          {/* Background Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(192,133,82,0.15)_2px,transparent_2px),linear-gradient(90deg,rgba(192,133,82,0.15)_2px,transparent_2px)] bg-[length:40px_40px] sm:bg-[length:60px_60px] pointer-events-none z-0"></div>

          {/* Glass Reflection / Glare (The iconic curved white reflection) */}
          <div className="absolute top-[-30%] left-[-20%] w-[130%] h-[70%] bg-gradient-to-br from-[#F3E9DC]/10 to-transparent rounded-[100%] pointer-events-none transform -rotate-12 blur-[1px] z-10"></div>
          <div className="absolute top-0 right-0 w-[40%] h-[30%] bg-gradient-to-bl from-[#F3E9DC]/5 to-transparent rounded-bl-full pointer-events-none z-10"></div>

          {/* Retro Scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>

          {/* --- CONTENT LAYER --- */}
          <div className="relative z-20 flex-1 flex flex-col p-4 sm:p-8 md:p-12 justify-between">

            {/* Top Bar: Hi-score & Hearts */}
            <div className="flex justify-between items-start font-mono text-theme-sand shrink-0">
              <div>
                <p className="font-bold text-sm sm:text-lg tracking-widest uppercase flex items-center gap-2">
                  HI-SCORE <span className="text-[0.6em] text-theme-accent opacity-80">[{selectedDifficulty}]</span>
                </p>
                <p className="text-theme-accent text-base sm:text-xl md:text-2xl font-bold tracking-widest">{highScore}</p>
              </div>
              <div className="flex gap-1 sm:gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart key={i} className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-theme-accent fill-theme-accent" />
                ))}
              </div>
            </div>

            {/* Center Area: Title & Menu */}
            <div className="flex-1 flex flex-col items-center justify-center gap-4 sm:gap-6 pb-12 sm:pb-24 -translate-y-8 sm:-translate-y-12 md:-translate-y-16">
              
              {/* Center Title */}
              <div className="flex flex-col items-center justify-center mt-4 sm:mt-0">
                <h1 className="text-6xl sm:text-8xl md:text-9xl font-mono font-bold text-theme-accent text-center uppercase leading-none drop-shadow-[0_0_15px_rgba(192,133,82,0.8)]">
                  PIXEL<br />LOGIC
                </h1>
              </div>

              {/* Bottom Menu */}
              <div className="flex flex-col items-center gap-2 sm:gap-4 font-mono text-theme-sand">
                <p className="text-[#F3E9DC] text-xs sm:text-sm md:text-base font-bold tracking-[0.2em] drop-shadow-[0_0_8px_rgba(243,233,220,0.5)]">
                  SELECT DIFFICULTY
                </p>

                <div className={`flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 md:gap-12 w-full text-sm sm:text-lg md:text-xl font-bold tracking-widest transition-transform duration-500 delay-100 ${isTransitioning ? 'scale-150 opacity-0' : 'scale-100'}`}>
                  {['easy', 'medium', 'hard'].map(diff => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`group flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
                        selectedDifficulty === diff 
                          ? 'text-theme-accent drop-shadow-[0_0_10px_rgba(192,133,82,0.8)]' 
                          : 'text-theme-sand hover:text-[#F3E9DC]'
                      }`}
                    >
                      <span className={`absolute left-[-1.2rem] transition-opacity ${selectedDifficulty === diff ? 'opacity-100 text-theme-accent' : 'opacity-0 group-hover:opacity-50 text-theme-sand'}`}>▶</span>
                      {diff.toUpperCase()}
                      <span className={`absolute right-[-1.2rem] transition-opacity ${selectedDifficulty === diff ? 'opacity-100 text-theme-accent' : 'opacity-0 group-hover:opacity-50 text-theme-sand'}`}>◀</span>
                    </button>
                  ))}
                </div>
                
                {/* START Button */}
                <div className={`mt-2 sm:mt-4 transition-transform duration-500 delay-200 ${isTransitioning ? 'scale-150 opacity-0' : 'scale-100'}`}>
                  <button
                    onClick={handleStartClick}
                    className="px-8 py-2 sm:px-12 sm:py-3 bg-theme-accent text-theme-dark text-sm sm:text-xl font-bold tracking-widest rounded shadow-[0_0_15px_rgba(192,133,82,0.6)] hover:bg-theme-mid hover:text-white hover:shadow-[0_0_20px_rgba(192,133,82,0.9)] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all uppercase"
                  >
                    START
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* In-Screen Action Icons (Bottom Right) */}
          <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 flex gap-3 sm:gap-4 text-theme-sand z-50">
            {/* MANUAL */}
            <div className="relative group flex items-center justify-center">
              <div className="absolute bottom-full mb-3 px-3 py-1.5 bg-theme-dark-solid text-theme-light text-xs font-mono font-bold tracking-widest rounded border border-theme-accent whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none drop-shadow-[0_0_5px_rgba(192,133,82,0.3)]">
                MANUAL BOOK
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); openManual(); }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-theme-dark rounded-full flex items-center justify-center border-2 border-theme-mid shadow-[0_0_15px_rgba(44,24,20,0.8)] hover:bg-theme-mid hover:text-white transition-all hover:scale-110 active:scale-95 z-30 cursor-pointer relative"
              >
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* SETTINGS */}
            <div className="relative group flex items-center justify-center">
              <div className="absolute bottom-full mb-3 px-3 py-1.5 bg-theme-dark-solid text-theme-light text-xs font-mono font-bold tracking-widest rounded border border-theme-accent whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none drop-shadow-[0_0_5px_rgba(192,133,82,0.3)]">
                SETTINGS
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); openSettings(); }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-theme-dark rounded-full flex items-center justify-center border-2 border-theme-mid shadow-[0_0_15px_rgba(44,24,20,0.8)] hover:bg-theme-mid hover:text-white transition-all hover:scale-110 active:scale-95 z-30 cursor-pointer relative"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
