const LOCAL_KEY = 'pixelLogicScoreHistory';
const CLOUD_BIN_URL = 'https://api.jsonbin.io/v3/b/6a02a0d2250b1311c338c96e'; 
const CLOUD_API_KEY = '$2a$10$ilP7dCAjOF.JCR2lAI4ghOyC63N7e9qk1MzMRAZfQqxKMmjAhL9Ge';

export const saveScoreLocal = (username, score, difficulty) => {
  try {
    const history = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
    const newEntry = {
      name: username,
      score: score,
      difficulty: difficulty,
      date: new Date().toISOString()
    };
    history.push(newEntry);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(history));
    return newEntry;
  } catch (e) {
    console.error("Failed to save local score:", e);
    return null;
  }
};

export const syncScoreCloud = async (newEntry) => {
  if (!CLOUD_BIN_URL || CLOUD_BIN_URL.includes('YOUR_JSONBIN')) return;
  
  try {
    // 1. Fetch current global leaderboard
    const response = await fetch(CLOUD_BIN_URL, {
      headers: {
        'X-Master-Key': CLOUD_API_KEY
      }
    });
    
    if (!response.ok) return;
    const data = await response.json();
    let globalScores = data.record || {};
    
    if (!globalScores[newEntry.difficulty]) {
       globalScores[newEntry.difficulty] = [];
    }
    
    // 2. Add our score
    globalScores[newEntry.difficulty].push(newEntry);
    
    // 3. Sort and slice (keep top 100)
    globalScores[newEntry.difficulty].sort((a, b) => b.score - a.score);
    globalScores[newEntry.difficulty] = globalScores[newEntry.difficulty].slice(0, 100);
    
    // 4. Update the bin
    await fetch(CLOUD_BIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': CLOUD_API_KEY
      },
      body: JSON.stringify(globalScores)
    });
  } catch (error) {
    console.error("Failed to sync score to cloud", error);
  }
};

export const getGlobalLeaderboard = async () => {
  if (!CLOUD_BIN_URL || CLOUD_BIN_URL.includes('YOUR_JSONBIN')) return null;
  try {
    const response = await fetch(CLOUD_BIN_URL, {
      headers: {
        'X-Master-Key': CLOUD_API_KEY
      }
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.record;
  } catch (error) {
    console.error("Failed to fetch global leaderboard", error);
    return null;
  }
};
