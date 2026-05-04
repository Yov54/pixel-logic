import { Pause, Play, Settings, RotateCcw, Home } from "lucide-react";

export default function PauseModal({ isOpen, onResume, onOpenSettings, onRestart, onQuit }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-theme-dark-solid/80 backdrop-blur-sm"
        onClick={onResume}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-theme-light border-4 border-theme-dark rounded-xl shadow-[0_0_50px_rgba(44,24,20,0.8)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-theme-dark text-[#F3E9DC] p-4 flex justify-between items-center border-b-4 border-theme-accent">
          <div className="flex items-center gap-2">
            <Pause className="w-5 h-5 text-theme-accent" />
            <h2 className="font-mono font-bold tracking-widest text-lg">SYSTEM PAUSED</h2>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 flex flex-col gap-4 font-mono font-bold tracking-widest">
          <button onClick={onResume} className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-theme-accent text-theme-dark border-2 border-theme-accent rounded hover:bg-transparent hover:text-theme-accent transition-all group active:scale-95">
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            RESUME
          </button>
          
          <button onClick={onOpenSettings} className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-theme-dark text-theme-light border-2 border-theme-mid rounded hover:bg-theme-mid transition-all group active:scale-95">
            <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            SETTINGS
          </button>
          
          <button onClick={onRestart} className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-theme-dark text-theme-light border-2 border-theme-mid rounded hover:bg-theme-mid transition-all group active:scale-95">
            <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-300" />
            RESTART LEVEL
          </button>
          
          <button onClick={onQuit} className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-red-950/80 text-red-400 border-2 border-red-900 rounded hover:bg-red-900 hover:text-white transition-all mt-4 active:scale-95">
            <Home className="w-5 h-5" />
            QUIT TO MENU
          </button>
        </div>
      </div>
    </div>
  );
}
