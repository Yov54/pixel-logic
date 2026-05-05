let audioCtx = null;
let masterGain = null;
let bgmAudio = null;

// Default settings
export const audioSettings = {
  bgm: true,
  tile: true,
  sfx: true
};

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.connect(audioCtx.destination);
    masterGain.gain.value = 0.3; // Default 30% volume

    bgmAudio = new Audio(`${import.meta.env.BASE_URL}sound/happy-relaxing-loop.mp3`);
    bgmAudio.loop = true;
    bgmAudio.volume = 0.3; // Lower volume for BGM so it's not too loud

    // Load settings from localStorage
    const saved = localStorage.getItem('pixelLogicAudioSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(audioSettings, parsed);
      } catch (e) {
        console.error("Failed to parse audio settings");
      }
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  if (audioSettings.bgm && bgmAudio && bgmAudio.paused) {
    bgmAudio.play().catch(e => console.log("Audio play failed:", e));
  }
};

export const updateAudioSettings = (newSettings) => {
  Object.assign(audioSettings, newSettings);
  localStorage.setItem('pixelLogicAudioSettings', JSON.stringify(audioSettings));
  
  if (bgmAudio) {
    if (audioSettings.bgm) {
      if (bgmAudio.paused) bgmAudio.play().catch(e => console.log("Audio play failed:", e));
    } else {
      bgmAudio.pause();
    }
  }
};

export const getAudioSettings = () => ({ ...audioSettings });

export const toggleMute = () => {
  const isMuted = !audioSettings.bgm && !audioSettings.tile && !audioSettings.sfx;
  const targetState = isMuted ? true : false;
  updateAudioSettings({ bgm: targetState, tile: targetState, sfx: targetState });
  return targetState;
};

export const getIsMuted = () => {
  return !audioSettings.bgm && !audioSettings.tile && !audioSettings.sfx;
};

const playTone = (freq, type, duration, vol = 1, channel = 'sfx') => {
  if (!audioCtx || !audioSettings[channel]) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(vol, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);

  osc.connect(gain);
  gain.connect(masterGain);

  osc.start();
  osc.stop(audioCtx.currentTime + duration);
};

export const playFlash = (isDistractor = false) => {
  if (isDistractor) {
    playTone(150, 'sawtooth', 0.2, 0.8, 'tile');
  } else {
    playTone(600, 'square', 0.15, 0.5, 'tile');
  }
};

export const playClick = () => {
  playTone(800, 'sine', 0.05, 0.3, 'tile');
};

export const playCorrect = () => {
  playTone(1200, 'sine', 0.1, 0.8, 'sfx');
  setTimeout(() => playTone(1600, 'sine', 0.2, 0.8, 'sfx'), 100);
};

export const playWrong = () => {
  playTone(200, 'sawtooth', 0.4, 1, 'sfx');
  setTimeout(() => playTone(150, 'sawtooth', 0.4, 1, 'sfx'), 100);
};

export const playLevelUp = () => {
  const notes = [440, 554, 659, 880];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 'square', 0.2, 0.5, 'sfx'), i * 150);
  });
};

export const playGameOver = () => {
  const notes = [300, 250, 200, 150];
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(freq, 'sawtooth', 0.4, 0.8, 'sfx'), i * 300);
  });
};
