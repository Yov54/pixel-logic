import Header from "./Header";
import GameGrid from "./GameGrid";
import Overlays from "./Overlays";
import MissionPanel from "./MissionPanel";
import { BookOpen } from "lucide-react";

export default function GameBoard({ 
  game, 
  ruleInfo, 
  getRuleDescription,
  showHelpTooltip, 
  setShowHelpTooltip, 
  setManualTutorialOpen, 
  setCheatSheetOpen,
  setIsPauseOpen,
  isMultiplayer = false,
  openSettings = () => {},
  backToMenu = () => {}
}) {
  return (
    <div className="flex-1 min-h-0 w-full flex flex-col items-center relative">
      {/* HEADER */}
      <Header
        lives={game.lives}
        score={game.score}
        highScore={game.highScore}
        onPause={() => setIsPauseOpen(true)}
        isMultiplayer={isMultiplayer}
        openSettings={openSettings}
      />

      {/* MAIN */}
      <main className={`flex-1 min-h-0 w-full max-w-5xl flex flex-col md:flex-row gap-4 md:gap-8 transition-transform pb-4 ${game.isErrorState ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>

        {/* LEFT - GAME */}
        <div className="w-full md:w-7/12 flex flex-col items-center bg-theme-surface p-4 sm:p-6 rounded-2xl border border-theme shadow-theme relative h-full min-h-0 overflow-hidden">

          {/* LEVEL INFO */}
          <div className="flex w-full justify-between items-center mb-4 px-2 shrink-0">
            <h2 className="text-lg font-mono text-theme-dark flex items-center flex-wrap gap-2">
              <span>LEVEL <span className="text-theme-accent">{game.level}</span></span>
              <span className="text-xs text-theme-mid">
                [{game.levelData.size}x{game.levelData.size} GRID]
              </span>
              {!isMultiplayer && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  game.difficulty === 'hard' ? 'border-red-500/50 text-red-600 bg-red-100' :
                  game.difficulty === 'medium' ? 'border-orange-500/50 text-orange-600 bg-orange-100' :
                  'border-green-500/50 text-green-600 bg-green-100'
                }`}>
                  MODE: {game.difficulty.toUpperCase()}
                </span>
              )}
            </h2>

            <div className={`text-xs font-mono px-3 py-1 rounded-full border ${game.gameState === 'playing'
              ? 'bg-theme-accent-soft border-theme-accent text-theme-mid animate-pulse'
              : 'bg-theme-dark-soft border-theme text-theme-mid'
              }`}>
              {game.gameState === 'playing' ? 'INPUT REQUIRED' : 'EXECUTING...'}
            </div>
          </div>

          {/* GRID */}
          <div className="flex-1 w-full min-h-0 flex items-center justify-center pb-2">
            <div className="h-full max-w-full aspect-square relative">
              <GameGrid
                levelData={game.levelData}
                activeFlash={game.activeFlash}
                clickedTile={game.clickedTile}
                playerSeq={game.playerSeq}
                gameState={game.gameState}
                handleTileClick={game.handleTileClick}
              />
            </div>
          </div>

          {/* OVERLAY */}
          <Overlays
            gameState={game.gameState}
            startGame={game.restartGame}
            nextLevel={game.nextLevel}
            score={game.score}
            difficulty={game.difficulty}
            highScore={game.highScore}
            freezeTimeLeft={game.freezeTimeLeft}
            backToMenu={backToMenu}
            modifierOptions={game.modifierOptions}
            selectModifier={game.selectModifier}
            getRuleDescription={getRuleDescription}
          />
        </div>

        {/* RIGHT - INTEL & MANUAL */}
        <div className="md:col-span-5 flex flex-col gap-4 overflow-y-auto h-full pb-4 pr-1 w-full md:w-5/12">
          <MissionPanel
            ruleInfo={ruleInfo}
            systemMessage={game.systemMessage}
            levelData={game.levelData}
            openTutorial={() => setManualTutorialOpen(true)}
            showHelpTooltip={showHelpTooltip}
            closeHelpTooltip={() => setShowHelpTooltip(false)}
            useHint={game.useHint}
            hintCost={game.hintCost}
            score={game.score}
            gameState={game.gameState}
          />

          <button
            onClick={() => setCheatSheetOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-theme-dark-soft hover:bg-theme-surface border border-theme text-theme-mid p-3 rounded-xl transition-colors font-mono font-bold text-sm shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            ACCESS MANUAL
          </button>
        </div>

      </main>
    </div>
  );
}
