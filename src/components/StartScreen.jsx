import { useState, useEffect } from "react";
import { Heart, Settings, BookOpen, ChevronLeft, Trophy } from "lucide-react";
const DIFFICULTY_INFO = {
  easy: {
    desc: "TRAINING MODE. Rules unlock gradually.",
    lives: 3,
    startGrid: "3x3",
    maxGrid: "5x5 (Lv.10+)",
    maxSeq: 8,
    speed: "SLOW",
    multiplier: "x0.8",
  },
  medium: {
    desc: "STANDARD SIMULATION. Balanced progression.",
    lives: 3,
    startGrid: "3x3",
    maxGrid: "5x5 (Lv.8+)",
    maxSeq: 10,
    speed: "NORMAL",
    multiplier: "x1.0",
  },
  hard: {
    desc: "MAXIMUM OVERDRIVE. All rules unlocked.",
    lives: 3,
    startGrid: "3x3",
    maxGrid: "5x5 (Lv.6+)",
    maxSeq: 12,
    speed: "FAST",
    multiplier: "x1.5",
  }
};

export default function StartScreen({ onStartSolo, onHost, onJoin, openSettings, openManual, openLeaderboard }) {
  const [highScore, setHighScore] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [view, setView] = useState('mode'); // 'mode', 'solo', 'host', 'join'

  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [hostTimeLimit, setHostTimeLimit] = useState(3);
  const [joinUsername, setJoinUsername] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [soloUsername, setSoloUsername] = useState(() => {
    return localStorage.getItem('pixelLogicPlayerName') || '';
  });

  useEffect(() => {
    let savedScore = localStorage.getItem(`pixelLogicHighScore_${selectedDifficulty}`);
    if (!savedScore && selectedDifficulty === 'medium') {
      savedScore = localStorage.getItem('pixelLogicHighScore');
      if (savedScore) {
        localStorage.setItem('pixelLogicHighScore_medium', savedScore);
      }
    }
    setHighScore(savedScore ? parseInt(savedScore, 10) : 0);
  }, [selectedDifficulty]);

  const handleStartSolo = () => {
    if (!soloUsername.trim()) return;
    localStorage.setItem('pixelLogicPlayerName', soloUsername.trim().toUpperCase());
    setIsTransitioning(true);
    setTimeout(() => {
      onStartSolo(selectedDifficulty, soloUsername.trim().toUpperCase());
    }, 700);
  };

  const handleHost = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      onHost({ difficulty: selectedDifficulty, timeLimit: hostTimeLimit });
    }, 700);
  };

  const handleJoin = () => {
    if (!joinUsername.trim() || !joinRoomCode.trim()) return;
    setIsTransitioning(true);
    setTimeout(() => {
      onJoin(joinUsername.trim().toUpperCase(), joinRoomCode.trim().toUpperCase());
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

          {/* Glass Reflection / Glare */}
          <div className="absolute top-[-30%] left-[-20%] w-[130%] h-[70%] bg-gradient-to-br from-[#F3E9DC]/10 to-transparent rounded-[100%] pointer-events-none transform -rotate-12 blur-[1px] z-10"></div>
          <div className="absolute top-0 right-0 w-[40%] h-[30%] bg-gradient-to-bl from-[#F3E9DC]/5 to-transparent rounded-bl-full pointer-events-none z-10"></div>

          {/* Retro Scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>

          {/* --- CONTENT LAYER --- */}
          <div className="relative z-20 flex-1 flex flex-col p-4 sm:p-8 md:p-12 justify-between">

            {/* Top Bar: Hi-score & Hearts (Only show in solo or mode view) */}
            <div className={`flex justify-between items-start font-mono text-theme-sand shrink-0 transition-opacity ${view === 'mode' || view === 'solo' ? 'opacity-100' : 'opacity-0'}`}>
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
            <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 w-full max-w-6xl mx-auto pt-4 pb-16 sm:pb-20">

              {/* Left Side: Title */}
              <div className={`flex-1 flex flex-col items-center lg:items-end justify-center w-full lg:pr-10 ${view !== 'mode' ? 'lg:border-r-4 lg:border-theme-mid/30' : ''} transition-all`}>
                <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[8rem] font-mono font-bold text-theme-accent text-center lg:text-right uppercase leading-none drop-shadow-[0_0_15px_rgba(192,133,82,0.8)]">
                  PIXEL<br />LOGIC
                </h1>
              </div>

              {/* Right Side: Dynamic Menus */}
              <div className="flex-1 flex flex-col items-center lg:items-start gap-3 sm:gap-5 font-mono text-theme-sand w-full lg:pl-6 relative min-h-[300px]">

                {/* BACK BUTTON for non-mode views */}
                {view !== 'mode' && (
                  <button
                    onClick={() => setView('mode')}
                    className="absolute -top-10 lg:-top-12 left-0 flex items-center gap-1 text-theme-sand hover:text-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" /> BACK
                  </button>
                )}

                {/* --- MODE SELECTION --- */}
                {view === 'mode' && (
                  <div className="flex flex-col gap-4 w-full max-w-[20rem] sm:max-w-sm mt-6 lg:mt-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <button
                      onClick={() => setView('solo')}
                      className="w-full px-8 py-4 bg-theme-dark-soft border-2 border-theme-mid text-[#F3E9DC] text-lg sm:text-xl font-bold tracking-widest rounded hover:bg-theme-mid hover:text-white transition-all uppercase hover:scale-105"
                    >
                      PLAY SOLO
                    </button>
                    <button
                      onClick={() => setView('join')}
                      className="w-full px-8 py-4 bg-theme-accent/20 border-2 border-theme-accent text-theme-accent text-lg sm:text-xl font-bold tracking-widest rounded hover:bg-theme-accent hover:text-theme-dark transition-all uppercase hover:scale-105 shadow-[0_0_15px_rgba(192,133,82,0.2)]"
                    >
                      JOIN ROOM
                    </button>
                    <button
                      onClick={() => setView('host')}
                      className="w-full px-8 py-4 bg-theme-dark-solid border-2 border-theme-mid/50 text-theme-sand text-sm sm:text-base font-bold tracking-widest rounded hover:bg-theme-dark-soft hover:border-theme-sand transition-all uppercase opacity-80 hover:opacity-100"
                    >
                      HOST ROOM (ADMIN)
                    </button>
                  </div>
                )}

                {/* --- SOLO / HOST DIFFICULTY SELECTION --- */}
                {(view === 'solo' || view === 'host') && (
                  <div className={`flex flex-col items-center lg:items-start w-full animate-in fade-in slide-in-from-right-8 duration-500 ${view === 'solo' ? 'gap-1.5 sm:gap-2 lg:-mt-6' : 'gap-2 sm:gap-3 lg:-mt-6'}`}>
                    <p className="text-[#F3E9DC] text-xs sm:text-sm font-bold tracking-[0.2em] drop-shadow-[0_0_8px_rgba(243,233,220,0.5)]">
                      {view === 'solo' ? 'SELECT DIFFICULTY' : 'ROOM SETTINGS'}
                    </p>

                    <div className="flex flex-row flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8 w-full text-sm sm:text-base md:text-lg font-bold tracking-widest">
                      {['easy', 'medium', 'hard'].map(diff => (
                        <button
                          key={diff}
                          onClick={() => setSelectedDifficulty(diff)}
                          className={`group flex items-center justify-center gap-2 transition-all cursor-pointer relative ${selectedDifficulty === diff
                            ? 'text-theme-accent drop-shadow-[0_0_10px_rgba(192,133,82,0.8)]'
                            : 'text-theme-sand hover:text-[#F3E9DC]'
                            }`}
                        >
                          <span className={`absolute left-[-1rem] transition-opacity ${selectedDifficulty === diff ? 'opacity-100 text-theme-accent' : 'opacity-0 group-hover:opacity-50 text-theme-sand'}`}>▶</span>
                          {diff.toUpperCase()}
                          <span className={`absolute right-[-1rem] transition-opacity ${selectedDifficulty === diff ? 'opacity-100 text-theme-accent' : 'opacity-0 group-hover:opacity-50 text-theme-sand'}`}>◀</span>
                        </button>
                      ))}
                    </div>

                    {view === 'host' && (
                      <div className="w-full mt-1 mb-1 lg:mt-0 lg:mb-0">
                        <p className="text-[#F3E9DC] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-1.5">TIME LIMIT</p>
                        <div className="flex gap-2 sm:gap-4">
                          {[1, 3, 5].map(time => (
                            <button
                              key={time}
                              onClick={() => setHostTimeLimit(time)}
                              className={`px-3 py-1 sm:px-4 sm:py-1.5 border rounded font-bold text-xs sm:text-sm ${hostTimeLimit === time ? 'bg-theme-accent text-theme-dark border-theme-accent' : 'border-theme text-theme-sand hover:bg-theme-dark-soft'}`}
                            >
                              {time} MIN
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {view === 'solo' && (
                      <div className="w-full mt-1 lg:mt-0">
                        <p className="text-[#F3E9DC] text-[10px] sm:text-xs font-bold tracking-[0.2em] mb-1 uppercase">PLAYER NAME</p>
                        <input
                          type="text"
                          value={soloUsername}
                          onChange={(e) => setSoloUsername(e.target.value.toUpperCase())}
                          maxLength={10}
                          placeholder="ENTER NAME..."
                          className="w-full bg-theme-dark-soft border-2 border-theme-mid p-1.5 sm:p-2 rounded text-[#F3E9DC] font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-theme-accent"
                        />
                      </div>
                    )}

                    {/* INFO PANEL */}
                    <div className={`w-full max-w-[20rem] sm:max-w-sm bg-theme-dark-soft border border-theme rounded flex flex-col text-left animate-in fade-in zoom-in duration-300 ${view === 'solo' ? 'p-2 sm:p-3 gap-1.5' : view === 'host' ? 'p-2 sm:p-3 gap-1.5 sm:gap-2' : 'p-3 sm:p-4 gap-2 sm:gap-3'}`} key={selectedDifficulty}>
                      <p className="text-[#F3E9DC] text-[10px] sm:text-xs font-bold text-center border-b border-theme pb-1 mb-1 tracking-widest uppercase">
                        {DIFFICULTY_INFO[selectedDifficulty].desc}
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:gap-y-1.5 text-[9px] sm:text-[11px] md:text-xs">
                        <div className="flex justify-between">
                          <span className="text-theme-sand opacity-70">LIVES</span>
                          <span className="text-theme-accent font-bold text-xs sm:text-sm -mt-0.5">{view === 'host' ? 'RESPAWN PENALTY' : "❤".repeat(DIFFICULTY_INFO[selectedDifficulty].lives)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-theme-sand opacity-70">SPEED</span>
                          <span className="text-theme-accent font-bold">{DIFFICULTY_INFO[selectedDifficulty].speed}</span>
                        </div>
                        <div className="flex justify-between col-span-2">
                          <span className="text-theme-sand opacity-70">GRID</span>
                          <span className="text-theme-accent font-bold">{DIFFICULTY_INFO[selectedDifficulty].startGrid} ➔ {DIFFICULTY_INFO[selectedDifficulty].maxGrid}</span>
                        </div>
                      </div>
                    </div>

                    {/* START Button */}
                    <div className={`w-full max-w-[20rem] sm:max-w-sm flex justify-center lg:justify-start ${view === 'host' ? 'mt-0 sm:mt-1' : 'mt-0.5 sm:mt-1'}`}>
                      <button
                        onClick={view === 'solo' ? handleStartSolo : handleHost}
                        disabled={view === 'solo' && !soloUsername.trim()}
                        className="w-full lg:w-auto px-10 py-3 sm:px-12 sm:py-3.5 bg-theme-accent text-theme-dark text-base sm:text-xl font-bold tracking-widest rounded shadow-[0_0_15px_rgba(192,133,82,0.6)] hover:bg-theme-mid hover:text-white hover:shadow-[0_0_20px_rgba(192,133,82,0.9)] hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                      >
                        {view === 'solo' ? 'START SOLO' : 'CREATE ROOM'}
                      </button>
                    </div>
                  </div>
                )}

                {/* --- JOIN ROOM --- */}
                {view === 'join' && (
                  <div className="flex flex-col gap-4 w-full max-w-[20rem] sm:max-w-sm mt-4 lg:mt-0 animate-in fade-in slide-in-from-right-8 duration-500">
                    <p className="text-[#F3E9DC] text-xs sm:text-sm font-bold tracking-[0.2em] drop-shadow-[0_0_8px_rgba(243,233,220,0.5)]">
                      JOIN BATTLE
                    </p>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-theme-sand font-bold tracking-widest uppercase">Student Name</label>
                      <input
                        type="text"
                        value={joinUsername}
                        onChange={(e) => setJoinUsername(e.target.value.toUpperCase())}
                        maxLength={12}
                        placeholder="ENTER NAME..."
                        className="bg-theme-dark-soft border-2 border-theme-mid p-3 rounded text-[#F3E9DC] font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-theme-accent"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-theme-sand font-bold tracking-widest uppercase">Room Code</label>
                      <input
                        type="text"
                        value={joinRoomCode}
                        onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
                        maxLength={8}
                        placeholder="ENTER CODE..."
                        className="bg-theme-dark-soft border-2 border-theme-mid p-3 rounded text-[#F3E9DC] font-mono font-bold tracking-wider uppercase focus:outline-none focus:border-theme-accent"
                      />
                    </div>

                    <button
                      onClick={handleJoin}
                      disabled={!joinUsername.trim() || !joinRoomCode.trim()}
                      className="mt-4 w-full px-8 py-3.5 bg-theme-accent text-theme-dark text-lg font-bold tracking-widest rounded shadow-[0_0_15px_rgba(192,133,82,0.6)] hover:bg-theme-mid hover:text-white transition-all uppercase disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      CONNECT
                    </button>
                  </div>
                )}

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

            {/* LEADERBOARD */}
            <div className="relative group flex items-center justify-center">
              <div className="absolute bottom-full mb-3 px-3 py-1.5 bg-theme-dark-solid text-theme-light text-xs font-mono font-bold tracking-widest rounded border border-theme-accent whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none drop-shadow-[0_0_5px_rgba(192,133,82,0.3)]">
                LEADERBOARD
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); openLeaderboard(); }}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-theme-dark rounded-full flex items-center justify-center border-2 border-theme-mid shadow-[0_0_15px_rgba(44,24,20,0.8)] hover:bg-theme-mid hover:text-white transition-all hover:scale-110 active:scale-95 z-30 cursor-pointer relative"
              >
                <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-theme-accent" />
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
