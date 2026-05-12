import { useState, useEffect, useCallback } from "react";
import { sleep, getMirroredIndex } from "../utils/helpers";
import { playFlash, playCorrect, playWrong, playLevelUp, playGameOver, initAudio } from "../utils/audio";
import { saveScoreLocal, syncScoreCloud } from "../utils/leaderboard";

function mulberry32(a) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

let seedRng = Math.random;

export default function useGameLogic() {
  const [gameState, setGameState] = useState('idle');
  const [difficulty, setDifficulty] = useState('easy');
  const [playerName, setPlayerName] = useState('GUEST');
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('pixelLogicHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [hintCost, setHintCost] = useState(20);
  const [freezeTimeLeft, setFreezeTimeLeft] = useState(0);

  const [levelData, setLevelData] = useState({
    size: 3,
    rule: 'normal',
    flashes: [],
    expected: [],
    distractorIdx: -1,
    mathModifier: null, // +1 or -1
    keypadLabels: null
  });

  const [playerSeq, setPlayerSeq] = useState([]);
  const [activeFlash, setActiveFlash] = useState(null);
  const [clickedTile, setClickedTile] = useState(null);
  const [systemMessage, setSystemMessage] = useState("SYSTEM STANDBY");
  const [seenRules, setSeenRules] = useState(new Set());
  const [isErrorState, setIsErrorState] = useState(false);
  const [isMultiplayer, setIsMultiplayer] = useState(false);

  const getRotatedIndex = (idx, size) => {
    const r = Math.floor(idx / size);
    const c = idx % size;
    const new_r = c;
    const new_c = size - 1 - r;
    return new_r * size + new_c;
  };

  const getMathIndex = (idx, size, modifier) => {
    const total = size * size;
    return (idx + modifier + total) % total;
  };

  const generateLevel = useCallback((currentLevel, diff) => {
    let newSize = 3;
    let seqLength = 3;
    let availableRules = ['normal'];
    
    // Scale properties based on difficulty
    if (diff === 'easy') {
      if (currentLevel >= 5) newSize = 4;
      if (currentLevel >= 10) newSize = 5;
      seqLength = Math.min(currentLevel + 2, 8);
      
      if (currentLevel >= 3) availableRules.push('keypad');
      if (currentLevel >= 4) availableRules.push('keypad_random');
      if (currentLevel >= 5) availableRules.push('distractor');
      if (currentLevel >= 7) availableRules.push('mirror');
      if (currentLevel >= 9) availableRules.push('reverse');
      if (currentLevel >= 11) availableRules.push('rotate90');
      if (currentLevel >= 13) availableRules.push('math');
      if (currentLevel >= 15) availableRules.push('blind');
    } else if (diff === 'medium') {
      if (currentLevel >= 4) newSize = 4;
      if (currentLevel >= 8) newSize = 5;
      seqLength = Math.min(currentLevel + 2, 10);
      
      if (currentLevel >= 2) availableRules.push('distractor');
      if (currentLevel >= 3) availableRules.push('keypad');
      if (currentLevel >= 4) availableRules.push('keypad_random');
      if (currentLevel >= 5) availableRules.push('mirror');
      if (currentLevel >= 6) availableRules.push('reverse');
      if (currentLevel >= 7) availableRules.push('rotate90');
      if (currentLevel >= 8) availableRules.push('math');
      if (currentLevel >= 9) availableRules.push('blind');
    } else if (diff === 'hard') {
      if (currentLevel >= 3) newSize = 4;
      if (currentLevel >= 6) newSize = 5;
      seqLength = Math.min(currentLevel + 3, 12);
      
      availableRules = ['normal', 'distractor', 'mirror', 'reverse', 'rotate90', 'math', 'blind', 'keypad', 'keypad_random'];
    }

    let rule = 'normal';
    // For first level, always normal to ease them in, except on hard maybe? Even hard should give 1 level normal.
    if (currentLevel > 1) {
       // Pick a random unlocked rule, strongly biased towards newer rules
       rule = availableRules[Math.floor(seedRng() * availableRules.length)];
    }

    let mathModifier = null;
    if (rule === 'math') {
       mathModifier = seedRng() > 0.5 ? 1 : -1;
    }

    const newFlashes = [];
    for (let i = 0; i < seqLength; i++) {
      newFlashes.push(Math.floor(seedRng() * (newSize * newSize)));
    }

    let distractorIdx = -1;
    let expectedSeq = [];

    if (rule === 'distractor') {
      distractorIdx = Math.floor(seedRng() * seqLength);
      expectedSeq = newFlashes.filter((_, idx) => idx !== distractorIdx);
    } else if (rule === 'mirror') {
      expectedSeq = newFlashes.map(idx => getMirroredIndex(idx, newSize));
    } else if (rule === 'reverse') {
      expectedSeq = [...newFlashes].reverse();
    } else if (rule === 'rotate90') {
      expectedSeq = newFlashes.map(idx => getRotatedIndex(idx, newSize));
    } else if (rule === 'math') {
      expectedSeq = newFlashes.map(idx => getMathIndex(idx, newSize, mathModifier));
    } else {
      // Normal, Blind, or Keypad
      expectedSeq = [...newFlashes];
    }

    let keypadLabels = null;
    if (rule === 'keypad' || rule === 'keypad_random') {
      let baseMap = [];
      if (newSize === 3) baseMap = ['1','2','3','4','5','6','7','8','9'];
      else if (newSize === 4) baseMap = ['1','2','3','4','5','6','7','8','9','Q','W','E','R','T','Y','U'];
      else if (newSize === 5) baseMap = ['1','2','3','4','5','6','7','8','9','Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H'];
      
      if (rule === 'keypad_random') {
        const shuffled = [...baseMap];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(seedRng() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        keypadLabels = shuffled;
      } else {
        keypadLabels = [...baseMap];
      }
    }

    return { size: newSize, rule, flashes: newFlashes, expected: expectedSeq, distractorIdx, mathModifier, keypadLabels };
  }, []);

  const startGame = (selectedDifficulty = 'medium', isMp = false, customSeed = null, username = "GUEST") => {
    initAudio();
    
    if (customSeed) {
      seedRng = mulberry32(customSeed);
    } else {
      seedRng = Math.random;
    }
    
    setIsMultiplayer(isMp);
    setPlayerName(username);
    setDifficulty(selectedDifficulty);
    setScore(0);
    setLives(3);
    setLevel(1);
    setHintCost(20);
    setSeenRules(new Set());
    
    let saved = localStorage.getItem(`pixelLogicHighScore_${selectedDifficulty}`);
    if (!saved && selectedDifficulty === 'medium') {
      saved = localStorage.getItem('pixelLogicHighScore');
    }
    setHighScore(saved ? parseInt(saved, 10) : 0);

    const newLevelData = generateLevel(1, selectedDifficulty);
    setLevelData(newLevelData);
    setGameState('previewing'); // Level 1 is always normal, no need tutorial
    setSeenRules(new Set(['normal']));
  };

  const useHint = () => {
    if (gameState !== 'playing' || score < hintCost) return;
    setScore(s => s - hintCost);
    setHintCost(c => c + 10);
    const expectedTarget = levelData.expected[playerSeq.length];
    
    // Briefly flash the expected target
    setActiveFlash({ index: expectedTarget, type: 'hint' });
    setTimeout(() => {
      setActiveFlash(null);
    }, 500);
  };

  useEffect(() => {
    let isCancelled = false;

    const playSequence = async () => {
      setSystemMessage("UPLOADING SEQUENCE...");
      setPlayerSeq([]);
      await sleep(1000);
      
      for (let i = 0; i < levelData.flashes.length; i++) {
        if (isCancelled) return;
        
        const flashIndex = levelData.flashes[i];
        const isDistractor = levelData.rule === 'distractor' && i === levelData.distractorIdx;
        
        setActiveFlash({ index: flashIndex, type: isDistractor ? 'distractor' : 'normal' });
        playFlash(isDistractor);
        
        // Speed scaling based on difficulty
        let baseSpeed = 600;
        let speedDecrease = 20;
        if (difficulty === 'easy') { baseSpeed = 700; speedDecrease = 15; }
        if (difficulty === 'hard') { baseSpeed = 500; speedDecrease = 30; }

        const flashDuration = Math.max(150, baseSpeed - (level * speedDecrease)); 
        await sleep(flashDuration);
        
        if (isCancelled) return;
        setActiveFlash(null);
        await sleep(flashDuration * 0.4); // Pause between flashes scales with speed
      }
      
      if (!isCancelled) {
        setGameState('playing');
        setSystemMessage("AWAITING USER INPUT...");
      }
    };

    if (gameState === 'previewing') {
      playSequence();
    }

    return () => { isCancelled = true; };
  }, [gameState, levelData, level, difficulty]);

  useEffect(() => {
    let interval = null;
    if (gameState === 'frozen') {
      interval = setInterval(() => {
        setFreezeTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setGameState('previewing');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState]);

  const handleTileClick = async (index) => {
    if (gameState !== 'playing') return;

    const currentIndex = playerSeq.length;
    const expectedTarget = levelData.expected[currentIndex];

    setClickedTile({ index, status: index === expectedTarget ? 'correct' : 'wrong' });
    
    setTimeout(() => setClickedTile(null), 300);

    if (index === expectedTarget) {
      playCorrect();
      const newPlayerSeq = [...playerSeq, index];
      setPlayerSeq(newPlayerSeq);
      
      if (newPlayerSeq.length === levelData.expected.length) {
        setGameState('levelComplete');
        // Score bonus scales with difficulty
        const multiplier = difficulty === 'hard' ? 1.5 : (difficulty === 'medium' ? 1 : 0.8);
        setScore(s => s + Math.floor(100 * level * multiplier));
        setSystemMessage("SEQUENCE VERIFIED. ACCESS GRANTED.");
        playLevelUp();
      }
    } else {
      playWrong();
      setIsErrorState(true);
      setTimeout(() => setIsErrorState(false), 400);
      
      const newLives = lives - 1;
      setLives(newLives);
      setSystemMessage(`ERROR: EXPECTED INDEX [${expectedTarget}], RECEIVED [${index}]`);
      
      if (newLives <= 0) {
        if (isMultiplayer) {
          setScore(s => Math.max(0, s - 500));
          setLives(3);
          setGameState('frozen'); // freeze
          setSystemMessage("SYSTEM REBOOT INITIATED. PENALTY: 10 SECONDS.");
          setFreezeTimeLeft(10);
        } else {
          setGameState('gameOver');
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem(`pixelLogicHighScore_${difficulty}`, score.toString());
          }
          // Save to local history and attempt cloud sync
          if (score > 0) {
            const entry = saveScoreLocal(playerName, score, difficulty);
            if (entry) syncScoreCloud(entry);
          }
          setSystemMessage("SYSTEM FAILURE. CONNECTION LOST.");
          playGameOver();
        }
      } else {
        setGameState('error');
        setTimeout(() => {
            setGameState('previewing');
        }, 1500);
      }
    }
  };

  const nextLevel = () => {
    const nextLvl = level + 1;
    setLevel(nextLvl);
    const newLevelData = generateLevel(nextLvl, difficulty);
    setLevelData(newLevelData);
    
    const ruleKey = newLevelData.rule === 'math' ? `math_${newLevelData.mathModifier}` : newLevelData.rule;
    
    if (!seenRules.has(ruleKey)) {
      setGameState('tutorial');
      setSeenRules(prev => new Set(prev).add(ruleKey));
    } else {
      setGameState('previewing');
    }
  };

  const startFromTutorial = () => {
    setGameState('previewing');
  };

  return {
    gameState, level, lives, score, highScore, difficulty, playerName,
    levelData, playerSeq, activeFlash, clickedTile,
    systemMessage, isErrorState, hintCost, freezeTimeLeft,
    startGame, handleTileClick, nextLevel, startFromTutorial, useHint
  };
}