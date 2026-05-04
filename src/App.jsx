import { useState, useEffect } from "react";
import { initAudio } from "./utils/audio";
import Header from "./components/Header";
import GameGrid from "./components/GameGrid";
import Overlays from "./components/Overlays";
import MissionPanel from "./components/MissionPanel";
import CheatSheet from "./components/CheatSheet";
import TutorialModal from "./components/TutorialModal";
import StartScreen from "./components/StartScreen";
import SettingsModal from "./components/SettingsModal";
import PauseModal from "./components/PauseModal";
import useGameLogic from "./hooks/useGameLogic";

import { AlertOctagon, RefreshCw, RotateCcw, Zap, BookOpen, X, Terminal, Settings, Redo, EyeOff, Calculator } from "lucide-react";

export default function App() {
  const game = useGameLogic();
  const [isManualTutorialOpen, setManualTutorialOpen] = useState(false);
  const [hasClosedFirstTutorial, setHasClosedFirstTutorial] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [isCheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [previewRule, setPreviewRule] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    initAudio();
  }, []);

  const getRuleDescription = (ruleId = game.levelData.rule) => {
    const baseRule = ruleId.startsWith('math') ? 'math' : ruleId;
    const mathMod = ruleId.startsWith('math_') ? parseInt(ruleId.split('_')[1]) : game.levelData.mathModifier;

    switch (baseRule) {
      case 'distractor':
        return {
          title: 'IF-THEN Skip',
          desc: 'Array contains an anomaly (RED). IF tile === RED, skip execution. Do not click it.',
          icon: <AlertOctagon className="w-5 h-5 text-theme-accent" />
        };
      case 'mirror':
        return {
          title: 'Spatial Matrix',
          desc: 'X-Axis Reflection active. Calculate horizontal opposite index before clicking.',
          icon: <RefreshCw className="w-5 h-5 text-theme-mid" />
        };
      case 'reverse':
        return {
          title: 'LIFO Stack',
          desc: 'Operator inversion. Output sequence in Last-In-First-Out (Reverse) order.',
          icon: <RotateCcw className="w-5 h-5 text-theme-dark" />
        };
      case 'rotate90':
        return {
          title: 'Rotated Matrix',
          desc: 'Grid orientation shifted 90° clockwise. Translate spatial coordinates before input.',
          icon: <Redo className="w-5 h-5 text-theme-accent" />
        };
      case 'blind':
        return {
          title: 'Blind Mode',
          desc: 'Visual interface offline during input phase. Rely on spatial memory.',
          icon: <EyeOff className="w-5 h-5 text-theme-mid" />
        };
      case 'math':
        return {
          title: `Math Modifier (${mathMod > 0 ? '+1' : '-1'})`,
          desc: `Index transformation active. Shift every target index by ${mathMod > 0 ? '+1' : '-1'} (wrap around).`,
          icon: <Calculator className="w-5 h-5 text-theme-dark" />
        };
      default:
        return {
          title: 'Standard Array',
          desc: 'Observe the sequence. Reproduce exact index execution order.',
          icon: <Zap className="w-5 h-5 text-theme-sand" />
        };
    }
  };

  const ruleInfo = getRuleDescription();

  return (
    <div className="h-[100dvh] w-full overflow-hidden bg-theme-light text-theme-dark font-sans flex flex-col items-center p-2 sm:p-4 md:p-6 relative">

      {!hasEntered && (
        <StartScreen
          onStart={(difficulty) => {
            initAudio();
            game.startGame(difficulty);
            setHasEntered(true);
          }}
          openSettings={() => setIsSettingsOpen(true)}
          openManual={() => setCheatSheetOpen(true)}
        />
      )}

      {/* RED FLASH OVERLAY */}
      {game.isErrorState && (
        <div className="fixed inset-0 bg-red-600/20 pointer-events-none z-[100] animate-pulse"></div>
      )}

      {(game.gameState === 'tutorial' || isManualTutorialOpen || previewRule) && (
        <TutorialModal
          rule={previewRule || game.levelData.rule}
          ruleInfo={getRuleDescription(previewRule || game.levelData.rule)}
          onClose={() => {
            if (previewRule) {
              setPreviewRule(null);
              setCheatSheetOpen(true);
              return;
            }
            if (game.gameState === 'tutorial') {
              game.startFromTutorial();
            }
            if (!hasClosedFirstTutorial) {
              setHasClosedFirstTutorial(true);
              setShowHelpTooltip(true);
              setTimeout(() => {
                setShowHelpTooltip(false);
              }, 5000);
            }
            setManualTutorialOpen(false);
          }}
        />
      )}

      {/* CHEAT SHEET MODAL */}
      <CheatSheet
        isOpen={isCheatSheetOpen}
        onClose={() => setCheatSheetOpen(false)}
        onSelectRule={(rule) => {
          setCheatSheetOpen(false);
          setPreviewRule(rule);
        }}
      />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      <PauseModal 
        isOpen={isPauseOpen} 
        onResume={() => setIsPauseOpen(false)} 
        onOpenSettings={() => setIsSettingsOpen(true)} 
        onRestart={() => { setIsPauseOpen(false); game.startGame(game.difficulty); }} 
        onQuit={() => { setIsPauseOpen(false); setHasEntered(false); }} 
      />

      {/* HEADER */}
      <Header
        lives={game.lives}
        score={game.score}
        highScore={game.highScore}
        onPause={() => setIsPauseOpen(true)}
      />

      {/* MAIN */}
      <main className={`flex-1 min-h-0 w-full max-w-5xl flex flex-col md:flex-row gap-4 md:gap-8 transition-transform pb-4 ${game.isErrorState ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>

        {/* LEFT - GAME */}
        <div className="w-full md:w-7/12 flex flex-col items-center bg-theme-surface p-4 sm:p-6 rounded-2xl border border-theme shadow-theme relative h-full min-h-0 overflow-hidden">

          {/* LEVEL INFO */}
          <div className="flex w-full justify-between items-center mb-4 px-2 shrink-0">
            <h2 className="text-lg font-mono text-theme-dark">
              LEVEL <span className="text-theme-accent">{game.level}</span>
              <span className="ml-2 text-xs text-theme-mid">
                [{game.levelData.size}x{game.levelData.size} GRID]
              </span>
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
            startGame={game.startGame}
            nextLevel={game.nextLevel}
            score={game.score}
          />
        </div>

        {/* RIGHT - INTEL & MANUAL */}
        <div className="md:col-span-5 flex flex-col gap-4 overflow-y-auto h-full pb-4 pr-1">
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