import { useState, useEffect } from "react";
import { Trophy, X } from "lucide-react";
import { getLeaderboard, getPlayerPercentile } from "../utils/firebase";

export default function LeaderboardModal({ isOpen, onClose, playerName, currentDifficulty }) {
  const [difficulty, setDifficulty] = useState(currentDifficulty || 'medium');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [percentileData, setPercentileData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setDifficulty(currentDifficulty || 'medium');
    }
  }, [isOpen, currentDifficulty]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [leaderboard, percentile] = await Promise.all([
          getLeaderboard(difficulty, 10),
          playerName ? getPlayerPercentile(playerName, difficulty) : null
        ]);
        setEntries(leaderboard);
        setPercentileData(percentile);
      } catch (error) {
        console.error("Failed to load leaderboard:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [isOpen, difficulty, playerName]);

  if (!isOpen) return null;

  const isPlayerEntry = (entry) => {
    return playerName && entry.playerName === playerName.toUpperCase();
  };

  const playerInTop10 = entries.some(e => isPlayerEntry(e));

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-theme-dark-solid/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-theme-light border-4 border-theme-dark rounded-xl shadow-[0_0_50px_rgba(44,24,20,0.8)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-theme-dark text-[#F3E9DC] p-4 flex justify-between items-center border-b-4 border-theme-accent shrink-0">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-theme-accent" />
            <h2 className="font-mono font-bold tracking-widest text-lg">LEADERBOARD</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-theme-mid rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Difficulty Tabs */}
        <div className="flex border-b-2 border-theme shrink-0">
          {['easy', 'medium', 'hard'].map(diff => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`flex-1 py-3 font-mono font-bold text-sm tracking-widest transition-all ${
                difficulty === diff
                  ? 'bg-theme-accent text-theme-dark border-b-2 border-theme-accent'
                  : 'bg-theme-surface text-theme-mid hover:bg-theme-sand-soft hover:text-theme-dark'
              }`}
            >
              {diff.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-8 h-8 border-3 border-theme-accent border-t-transparent rounded-full animate-spin" />
              <p className="font-mono text-sm text-theme-mid tracking-widest">LOADING DATA...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Trophy className="w-12 h-12 text-theme-sand opacity-40" />
              <p className="font-mono text-sm text-theme-mid tracking-widest">NO DATA YET</p>
              <p className="font-mono text-xs text-theme-mid opacity-60">Be the first to set a score!</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="grid grid-cols-[2.5rem_1fr_4rem_3rem] gap-2 px-2 py-2 font-mono text-[10px] text-theme-mid tracking-widest border-b border-theme">
                <span>#</span>
                <span>PLAYER</span>
                <span className="text-right">SCORE</span>
                <span className="text-right">LVL</span>
              </div>

              {/* Entries */}
              {entries.map((entry) => (
                <div
                  key={entry.rank}
                  className={`grid grid-cols-[2.5rem_1fr_4rem_3rem] gap-2 px-2 py-2.5 font-mono text-sm border-b border-theme/50 transition-colors ${
                    isPlayerEntry(entry)
                      ? 'bg-theme-accent/15 text-theme-dark font-bold border-theme-accent/30'
                      : 'text-theme-mid'
                  }`}
                >
                  <span className={`font-bold ${
                    entry.rank === 1 ? 'text-yellow-600' :
                    entry.rank === 2 ? 'text-gray-500' :
                    entry.rank === 3 ? 'text-amber-700' :
                    'text-theme-mid'
                  }`}>
                    {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                  </span>
                  <span className="truncate">
                    {entry.playerName}
                    {isPlayerEntry(entry) && <span className="ml-1 text-[10px] text-theme-accent">(YOU)</span>}
                  </span>
                  <span className="text-right font-bold text-theme-dark">{entry.score.toLocaleString()}</span>
                  <span className="text-right">{entry.level}</span>
                </div>
              ))}
            </>
          )}

          {/* Player Percentile (if not in top 10) */}
          {!loading && percentileData && !playerInTop10 && (
            <div className="mt-4 p-3 bg-theme-accent/10 border border-theme-accent/30 rounded-lg font-mono text-center">
              <p className="text-xs text-theme-mid tracking-widest mb-1">YOUR RANKING</p>
              <p className="text-lg font-bold text-theme-dark">
                Top {percentileData.percentile}%
              </p>
              <p className="text-xs text-theme-mid mt-1">
                Rank #{percentileData.rank} of {percentileData.total} players · Score: {percentileData.score.toLocaleString()}
              </p>
            </div>
          )}

          {/* Player percentile even if in top 10 */}
          {!loading && percentileData && playerInTop10 && (
            <div className="mt-4 p-3 bg-theme-accent/10 border border-theme-accent/30 rounded-lg font-mono text-center">
              <p className="text-xs text-theme-mid tracking-widest mb-1">YOUR RANKING</p>
              <p className="text-lg font-bold text-theme-accent">
                🏆 Top {percentileData.percentile}%
              </p>
              <p className="text-xs text-theme-mid mt-1">
                #{percentileData.rank} of {percentileData.total} players
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
