import { useState, useEffect } from "react";
import { initAudio } from "./utils/audio";
import TutorialModal from "./components/TutorialModal";
import StartScreen from "./components/StartScreen";
import SettingsModal from "./components/SettingsModal";
import PauseModal from "./components/PauseModal";
import CheatSheet from "./components/CheatSheet";
import GameBoard from "./components/GameBoard";
import AdminPanel from "./components/AdminPanel";
import StudentLobby from "./components/StudentLobby";
import LeaderboardModal from "./components/LeaderboardModal";
import useGameLogic from "./hooks/useGameLogic";

import { AlertOctagon, RefreshCw, RotateCcw, Zap, EyeOff, Calculator, Keyboard, Redo } from "lucide-react";

export default function App() {
  const game = useGameLogic();
  const [appMode, setAppMode] = useState('menu'); // 'menu', 'solo', 'host', 'join'
  const [multiplayerSettings, setMultiplayerSettings] = useState(null);

  const [isManualTutorialOpen, setManualTutorialOpen] = useState(false);
  const [hasClosedFirstTutorial, setHasClosedFirstTutorial] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [isCheatSheetOpen, setCheatSheetOpen] = useState(false);
  const [previewRule, setPreviewRule] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPauseOpen, setIsPauseOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);

  useEffect(() => {
    initAudio();

    const handleFirstInteraction = () => {
      initAudio();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (game.gameState !== 'playing') return;
      if (game.levelData.rule !== 'keypad' && game.levelData.rule !== 'keypad_random') return;
      
      const key = e.key.toUpperCase();
      const labels = game.levelData.keypadLabels;
      if (labels) {
        const index = labels.indexOf(key);
        if (index !== -1) {
          game.handleTileClick(index);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [game.gameState, game.levelData, game.handleTileClick]);

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
      case 'keypad':
        return {
          title: 'Keypad Protocol',
          desc: 'Mouse clicks disabled. Press the corresponding keyboard key shown on the tile.',
          icon: <Keyboard className="w-5 h-5 text-theme-dark" />
        };
      case 'keypad_random':
        return {
          title: 'Scrambled Keypad',
          desc: 'Keyboard only. The key mapping is randomly shuffled on the grid. Find the right key.',
          icon: <Keyboard className="w-5 h-5 text-theme-accent" />
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

      {/* OVERLAYS & MODALS */}
      {game.isErrorState && (
        <div className="fixed inset-0 bg-red-600/20 pointer-events-none z-[100] animate-pulse"></div>
      )}

      {(game.gameState === 'tutorial' || isManualTutorialOpen || previewRule) && (
        <TutorialModal
          rule={previewRule || (game.levelData.rule === 'math' ? `math_${game.levelData.mathModifier}` : game.levelData.rule)}
          ruleInfo={getRuleDescription(previewRule || (game.levelData.rule === 'math' ? `math_${game.levelData.mathModifier}` : game.levelData.rule))}
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

      <CheatSheet
        isOpen={isCheatSheetOpen}
        onClose={() => setCheatSheetOpen(false)}
        onSelectRule={(rule) => {
          setCheatSheetOpen(false);
          setPreviewRule(rule);
        }}
      />

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      <LeaderboardModal isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />

      <PauseModal
        isOpen={isPauseOpen}
        onResume={() => setIsPauseOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRestart={() => { setIsPauseOpen(false); game.startGame(game.difficulty); }}
        onQuit={() => { setIsPauseOpen(false); setAppMode('menu'); }}
      />


      {/* ROUTING / VIEWS */}
      
      {appMode === 'menu' && (
        <StartScreen
          onStartSolo={(difficulty, username) => {
            initAudio();
            game.startGame(difficulty, false, null, username);
            setAppMode('solo');
          }}
          onHost={(settings) => {
            initAudio();
            setMultiplayerSettings(settings);
            setAppMode('host');
          }}
          onJoin={(username, roomCode) => {
            initAudio();
            setMultiplayerSettings({ username, roomCode });
            setAppMode('join');
          }}
          openSettings={() => setIsSettingsOpen(true)}
          openManual={() => setCheatSheetOpen(true)}
          openLeaderboard={() => setIsLeaderboardOpen(true)}
        />
      )}

      {appMode === 'solo' && (
        <GameBoard 
          game={game}
          ruleInfo={ruleInfo}
          showHelpTooltip={showHelpTooltip}
          setShowHelpTooltip={setShowHelpTooltip}
          setManualTutorialOpen={setManualTutorialOpen}
          setCheatSheetOpen={setCheatSheetOpen}
          setIsPauseOpen={setIsPauseOpen}
        />
      )}

      {appMode === 'host' && (
        <AdminPanel 
          settings={multiplayerSettings}
          onExit={() => setAppMode('menu')}
        />
      )}

      {appMode === 'join' && (
        <StudentLobby 
          username={multiplayerSettings.username}
          roomCode={multiplayerSettings.roomCode}
          onExit={() => setAppMode('menu')}
          game={game}
          ruleInfo={ruleInfo}
          showHelpTooltip={showHelpTooltip}
          setShowHelpTooltip={setShowHelpTooltip}
          setManualTutorialOpen={setManualTutorialOpen}
          setCheatSheetOpen={setCheatSheetOpen}
          openSettings={() => setIsSettingsOpen(true)}
        />
      )}

    </div>
  );
}