import React, { useState, useEffect } from 'react';
import { Trophy, X, Globe, User, Loader2 } from 'lucide-react';
import { getGlobalLeaderboard } from '../utils/leaderboard';

export default function LeaderboardModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('global'); // 'global' or 'local'
  const [difficulty, setDifficulty] = useState('medium');
  const [scores, setScores] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cachedGlobalData, setCachedGlobalData] = useState(null);

  // 1. Fetch exactly once when the modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchGlobalData = async () => {
        setIsLoading(true);
        const globalData = await getGlobalLeaderboard();
        setCachedGlobalData(globalData || {});
        setIsLoading(false);
      };
      fetchGlobalData();
    } else {
      // Clear cache when closed so next open fetches fresh data
      setCachedGlobalData(null);
    }
  }, [isOpen]);

  // 2. Display logic: Filter data based on active tab and difficulty
  useEffect(() => {
    if (!isOpen) return;

    if (activeTab === 'global') {
      if (isLoading || !cachedGlobalData) {
        setScores([]);
      } else {
        setScores(cachedGlobalData[difficulty] || []);
      }
    } else {
      const localHistory = JSON.parse(localStorage.getItem('pixelLogicScoreHistory') || '[]');
      const filtered = localHistory
        .filter(entry => entry.difficulty === difficulty)
        .sort((a, b) => b.score - a.score)
        .slice(0, 100);
      setScores(filtered);
    }
  }, [isOpen, activeTab, difficulty, cachedGlobalData, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-xl bg-theme-dark-solid border-4 border-theme-mid rounded-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-theme-mid bg-theme-dark">
          <div className="flex items-center gap-3 text-theme-accent">
            <Trophy className="w-6 h-6" />
            <h2 className="text-xl font-bold font-mono tracking-widest uppercase">LEADERBOARD</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-theme-sand hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 p-4 border-b border-theme/30 bg-black/20">
          <div className="flex bg-theme-dark-soft rounded p-1 flex-1">
            <button 
              onClick={() => setActiveTab('global')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-bold tracking-wider rounded transition-colors ${activeTab === 'global' ? 'bg-theme-accent text-theme-dark' : 'text-theme-sand hover:text-white'}`}
            >
              <Globe className="w-4 h-4" /> GLOBAL
            </button>
            <button 
              onClick={() => setActiveTab('local')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs sm:text-sm font-bold tracking-wider rounded transition-colors ${activeTab === 'local' ? 'bg-theme-accent text-theme-dark' : 'text-theme-sand hover:text-white'}`}
            >
              <User className="w-4 h-4" /> LOCAL
            </button>
          </div>
          
          <div className="flex bg-theme-dark-soft rounded p-1">
            {['easy', 'medium', 'hard'].map(diff => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`flex-1 py-2 px-3 sm:px-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase rounded transition-colors ${difficulty === diff ? 'bg-theme-mid text-white' : 'text-theme-sand hover:text-white'}`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="h-[40vh] sm:h-[50vh] overflow-y-auto p-4 custom-scrollbar bg-[#1A0C06]">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-theme-sand opacity-50 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-theme-accent" />
              <p className="font-mono text-sm tracking-widest">CONNECTING...</p>
            </div>
          ) : scores.length === 0 ? (
            <div className="h-full flex items-center justify-center text-theme-sand opacity-50 font-mono text-sm tracking-widest">
              NO RECORDS FOUND
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {scores.map((entry, index) => (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-3 rounded border font-mono ${
                    index === 0 ? 'bg-theme-accent/20 border-theme-accent text-theme-accent' : 
                    index === 1 ? 'bg-gray-400/10 border-gray-400/30 text-gray-300' :
                    index === 2 ? 'bg-[#cd7f32]/10 border-[#cd7f32]/30 text-[#cd7f32]' :
                    'bg-theme-dark-soft border-transparent text-theme-sand'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="w-6 text-center font-bold text-sm opacity-50">#{index + 1}</span>
                    <span className="font-bold tracking-wider">{entry.name || 'UNKNOWN'}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs opacity-50 hidden sm:block">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    <span className="font-bold text-lg">{entry.score}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
