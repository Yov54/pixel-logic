import { X, Settings, Music, MousePointerClick, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { getAudioSettings, updateAudioSettings } from "../utils/audio";

export default function SettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState({ bgm: true, tile: true, sfx: true });

  useEffect(() => {
    if (isOpen) {
      setSettings(getAudioSettings());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggle = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    updateAudioSettings(newSettings);
  };

  const ToggleRow = ({ label, icon: Icon, stateKey }) => (
    <div className="flex items-center justify-between py-4 border-b border-theme-dark-soft/20 last:border-0">
      <div className="flex items-center gap-3 text-theme-dark">
        <Icon className="w-5 h-5 text-theme-accent" />
        <span className="font-mono font-bold tracking-widest text-sm">{label}</span>
      </div>
      <button 
        onClick={() => handleToggle(stateKey)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
          settings[stateKey] ? 'bg-theme-accent' : 'bg-theme-mid/40'
        }`}
      >
        <div className={`absolute top-1 left-1 w-4 h-4 bg-theme-light rounded-full transition-transform duration-300 ${
          settings[stateKey] ? 'translate-x-6' : 'translate-x-0'
        }`} />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-theme-dark-solid/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-sm bg-theme-light border-4 border-theme-dark rounded-xl shadow-[0_0_50px_rgba(44,24,20,0.8)] overflow-hidden">
        {/* Header */}
        <div className="bg-theme-dark text-[#F3E9DC] p-4 flex justify-between items-center border-b-4 border-theme-accent">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-theme-accent" />
            <h2 className="font-mono font-bold tracking-widest text-lg">SETTINGS</h2>
          </div>
          <button onClick={onClose} className="hover:text-theme-accent transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <p className="font-mono text-xs text-theme-mid font-bold mb-6 tracking-widest uppercase">
            Audio Mixer Configuration
          </p>

          <div className="flex flex-col">
            <ToggleRow label="BACKGROUND MUSIC" icon={Music} stateKey="bgm" />
            <ToggleRow label="TILE SOUNDS" icon={MousePointerClick} stateKey="tile" />
            <ToggleRow label="SYSTEM ALERTS" icon={Zap} stateKey="sfx" />
          </div>
        </div>
        
      </div>
    </div>
  );
}
