export default function GameGrid({
  levelData, activeFlash, clickedTile,
  playerSeq, gameState, handleTileClick
}) {
  return (
    <div 
      className="absolute inset-0 grid gap-2 sm:gap-3"
      style={{ 
        gridTemplateColumns: `repeat(${levelData.size}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${levelData.size}, minmax(0, 1fr))`
      }}
    >
      {Array.from({ length: levelData.size * levelData.size }).map((_, index) => {
        const isFlashing = activeFlash?.index === index;
        const flashType = activeFlash?.type;
        const isClicked = clickedTile?.index === index;
        const clickStatus = clickedTile?.status;
        const isPlayerSelected = playerSeq.includes(index) && gameState === 'playing';

        const isBlind = levelData.rule === 'blind' && gameState === 'playing';

        let tileStyle = "tile-default";
        
        if (isBlind && !isFlashing && !isClicked && !isPlayerSelected) {
          tileStyle = "opacity-0 cursor-pointer"; // Completely invisible during gameplay
        } else if (isFlashing) {
          if (flashType === 'distractor') {
            tileStyle = "tile-flash-distractor z-10";
          } else if (flashType === 'hint') {
            tileStyle = "bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] z-10 scale-105 border-white text-white";
          } else {
            tileStyle = "tile-flash-main z-10";
          }
        } else if (isClicked) {
          tileStyle = clickStatus === 'correct'
            ? "tile-correct scale-95"
            : "tile-wrong scale-95";
        } else if (isPlayerSelected) {
          tileStyle = "bg-theme-dark-soft border-theme opacity-50";
        }

        return (
          <button
            key={index}
            disabled={gameState !== 'playing'}
            onClick={() => {
              if (!levelData.keypadLabels) handleTileClick(index);
            }}
            className={`
              w-full h-full rounded-xl border transition-all duration-150 
              flex items-center justify-center font-mono text-xs text-theme-mid-soft
              ${gameState === 'playing' && !isClicked && !isFlashing && !isBlind && !levelData.keypadLabels ? 'hover:bg-theme-dark-soft cursor-pointer active:scale-95' : 'cursor-default'}
              ${tileStyle}
            `}
          >
            {!isBlind && (
              <span className={levelData.keypadLabels ? 'text-lg sm:text-2xl font-bold text-theme-sand opacity-80' : ''}>
                {levelData.keypadLabels ? levelData.keypadLabels[index] : index}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}