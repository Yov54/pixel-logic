import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  getCountFromServer,
  serverTimestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGwpbAEBJIKRf0V-o5XtqEhQLXYiOJi5w",
  authDomain: "pixel-logic-372c0.firebaseapp.com",
  projectId: "pixel-logic-372c0",
  storageBucket: "pixel-logic-372c0.firebasestorage.app",
  messagingSenderId: "472342534028",
  appId: "1:472342534028:web:7f553bcadf3d9619a728a9",
  measurementId: "G-8RHT0NT48F"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const COLLECTION = "leaderboard";

/**
 * Submit a score to the global leaderboard.
 * Only updates if the new score is higher than the existing one for this player+difficulty.
 */
export const submitScore = async (playerName, score, level, difficulty) => {
  try {
    const docId = `${playerName.toUpperCase()}_${difficulty}`;
    const docRef = doc(db, COLLECTION, docId);

    // Check existing score
    const existing = await getDoc(docRef);
    if (existing.exists() && existing.data().score >= score) {
      return { updated: false, reason: "Existing score is higher or equal" };
    }

    await setDoc(docRef, {
      playerName: playerName.toUpperCase(),
      score,
      level,
      difficulty,
      createdAt: serverTimestamp()
    });

    return { updated: true };
  } catch (error) {
    console.error("Failed to submit score:", error);
    return { updated: false, reason: error.message };
  }
};

/**
 * Get the top N scores for a given difficulty.
 */
export const getLeaderboard = async (difficulty, topN = 10) => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("difficulty", "==", difficulty),
      orderBy("score", "desc"),
      limit(topN)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc, index) => ({
      rank: index + 1,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return [];
  }
};

/**
 * Get the global high score for a difficulty.
 */
export const getGlobalHighScore = async (difficulty) => {
  try {
    const q = query(
      collection(db, COLLECTION),
      where("difficulty", "==", difficulty),
      orderBy("score", "desc"),
      limit(1)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return 0;
    return snapshot.docs[0].data().score;
  } catch (error) {
    console.error("Failed to fetch global high score:", error);
    return 0;
  }
};

/**
 * Get the player's rank percentile for a given difficulty.
 * Returns an object like { rank: 3, total: 50, percentile: 6 }
 * meaning the player is rank 3 out of 50 players (top 6%).
 */
export const getPlayerPercentile = async (playerName, difficulty) => {
  try {
    const docId = `${playerName.toUpperCase()}_${difficulty}`;
    const docRef = doc(db, COLLECTION, docId);
    const playerDoc = await getDoc(docRef);

    if (!playerDoc.exists()) {
      return null;
    }

    const playerScore = playerDoc.data().score;

    // Count total players for this difficulty
    const totalQuery = query(
      collection(db, COLLECTION),
      where("difficulty", "==", difficulty)
    );
    const totalSnapshot = await getCountFromServer(totalQuery);
    const total = totalSnapshot.data().count;

    // Count players with higher score
    const higherQuery = query(
      collection(db, COLLECTION),
      where("difficulty", "==", difficulty),
      where("score", ">", playerScore)
    );
    const higherSnapshot = await getCountFromServer(higherQuery);
    const higherCount = higherSnapshot.data().count;

    const rank = higherCount + 1;
    const percentile = total > 0 ? Math.ceil((rank / total) * 100) : 100;

    return { rank, total, percentile, score: playerScore };
  } catch (error) {
    console.error("Failed to get player percentile:", error);
    return null;
  }
};
