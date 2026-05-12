import { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import { Users, Play, Square, Trophy, ChevronLeft, ShieldAlert } from "lucide-react";

export default function AdminPanel({ settings, onExit }) {
  const [peer, setPeer] = useState(null);
  const [roomCode, setRoomCode] = useState("GENERATING...");
  const [students, setStudents] = useState([]);
  const [status, setStatus] = useState('lobby'); // lobby, playing, finished
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit * 60);
  
  const timerRef = useRef(null);
  const studentsRef = useRef([]);

  // Generate a random 5-character alphanumeric string for the room code
  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
  };

  useEffect(() => {
    const code = generateRoomCode();
    // Prefix the code to avoid collisions on public peerjs server
    const fullId = `pxl-logic-${code}`;
    
    const newPeer = new Peer(fullId, {
      debug: 2
    });

    newPeer.on('open', (id) => {
      setRoomCode(code);
    });

    newPeer.on('connection', (conn) => {
      conn.on('data', (data) => {
        if (data.type === 'join') {
          const newStudent = { id: conn.peer, conn, username: data.username, score: 0 };
          setStudents(prev => {
            const updated = [...prev, newStudent];
            studentsRef.current = updated;
            return updated;
          });
          
          // Send welcome acknowledgment
          conn.send({ type: 'welcome', message: 'Connected to Admin.' });
        } else if (data.type === 'score_update') {
          setStudents(prev => {
            const updated = prev.map(s => s.id === conn.peer ? { ...s, score: data.score } : s);
            // Sort by score
            updated.sort((a, b) => b.score - a.score);
            studentsRef.current = updated;
            return updated;
          });
        }
      });

      conn.on('close', () => {
        setStudents(prev => prev.filter(s => s.id !== conn.peer));
      });
    });

    newPeer.on('error', (err) => {
      console.error(err);
      if (err.type === 'unavailable-id') {
         setRoomCode("ERROR: ID TAKEN. RESTART.");
      }
    });

    setPeer(newPeer);

    return () => {
      newPeer.destroy();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleStart = () => {
    if (students.length === 0) return;
    
    const randomSeed = Math.floor(Math.random() * 1000000);
    
    students.forEach(student => {
      student.conn.send({ 
        type: 'start_game', 
        seed: randomSeed, 
        difficulty: settings.difficulty,
        timeLimit: settings.timeLimit
      });
    });

    setStatus('playing');

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTerminate();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTerminate = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    const finalRankings = studentsRef.current.map((s, idx) => ({
      rank: idx + 1,
      username: s.username,
      score: s.score
    }));

    studentsRef.current.forEach(student => {
      student.conn.send({ type: 'terminate', rankings: finalRankings });
    });

    setStatus('finished');
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-theme-dark border-4 border-theme-accent shadow-[0_0_50px_rgba(44,24,20,0.8)] rounded-3xl p-6 md:p-10 flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full flex justify-between items-center border-b-2 border-[rgba(218,180,157,0.3)] pb-4 mb-6">
          <div className="flex items-center gap-4">
             <button 
                onClick={onExit}
                className="text-theme-sand hover:text-white transition-colors"
                title="EXIT ADMIN PANEL"
             >
               <ChevronLeft className="w-8 h-8" />
             </button>
             <div>
               <h1 className="text-2xl font-mono font-bold text-theme-accent tracking-widest">ADMIN PANEL</h1>
               <p className="text-xs font-mono text-theme-mid opacity-70">ROOM OVERSIGHT</p>
             </div>
          </div>
          
          <div className="flex flex-col items-end">
            <p className="text-[10px] font-bold text-theme-sand tracking-widest">ROOM CODE</p>
             <div className="bg-[rgba(0,0,0,0.3)] border border-[rgba(218,180,157,0.3)] px-4 py-2 rounded text-3xl font-mono font-bold text-white tracking-[0.2em] shadow-inner">
              {roomCode}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="w-full flex flex-col md:flex-row gap-8">
          
          {/* Left Panel: Info & Controls */}
          <div className="flex-1 flex flex-col gap-6">
             
             <div className="bg-[rgba(0,0,0,0.25)] p-4 rounded-xl border border-[rgba(218,180,157,0.25)]">
               <h3 className="text-[#DAB49D] font-mono text-xs font-bold tracking-widest mb-4 border-b border-[rgba(218,180,157,0.2)] pb-2">SESSION INTEL</h3>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <p className="text-[10px] text-[#DAB49D] opacity-70 mb-1">DIFFICULTY</p>
                   <p className="font-mono text-theme-accent uppercase font-bold">{settings.difficulty}</p>
                 </div>
                 <div>
                   <p className="text-[10px] text-[#DAB49D] opacity-70 mb-1">TIME LIMIT</p>
                   <p className="font-mono text-white font-bold">{settings.timeLimit} MINUTES</p>
                 </div>
                 <div>
                   <p className="text-[10px] text-[#DAB49D] opacity-70 mb-1">CONNECTED</p>
                   <p className="font-mono text-white font-bold flex items-center gap-2">
                     <Users className="w-4 h-4 text-theme-accent" /> {students.length}
                   </p>
                 </div>
                 <div>
                   <p className="text-[10px] text-[#DAB49D] opacity-70 mb-1">STATUS</p>
                   <p className={`font-mono font-bold uppercase ${status === 'playing' ? 'text-green-500 animate-pulse' : 'text-theme-sand'}`}>
                     {status}
                   </p>
                 </div>
               </div>
             </div>

             {status === 'lobby' && (
               <button 
                 onClick={handleStart}
                 disabled={students.length === 0}
                 className="w-full py-4 bg-theme-accent text-theme-dark font-bold font-mono tracking-widest rounded-xl hover:bg-theme-mid hover:text-white transition-all shadow-[0_0_15px_rgba(192,133,82,0.4)] hover:shadow-[0_0_25px_rgba(192,133,82,0.8)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                 <Play className="w-5 h-5 fill-current" /> INITIATE BATTLE
               </button>
             )}

             {status === 'playing' && (
               <div className="flex flex-col gap-4">
                 <div className="bg-[#1A0C06] border border-red-500/30 p-6 rounded-xl flex flex-col items-center shadow-[inset_0_0_20px_rgba(255,0,0,0.1)]">
                   <p className="text-red-500 font-mono text-xs font-bold tracking-widest mb-2">TIME REMAINING</p>
                   <p className="text-5xl font-mono font-bold text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">{formatTime(timeLeft)}</p>
                 </div>

                 <button 
                   onClick={handleTerminate}
                   className="w-full py-4 bg-red-600 text-white font-bold font-mono tracking-widest rounded-xl hover:bg-red-700 transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)] flex items-center justify-center gap-2"
                 >
                   <ShieldAlert className="w-5 h-5" /> TERMINATE ALL
                 </button>
               </div>
             )}

             {status === 'finished' && (
               <div className="bg-theme-dark-soft border border-theme p-6 rounded-xl flex flex-col items-center">
                 <Trophy className="w-12 h-12 text-yellow-500 mb-2 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                 <p className="font-mono text-white tracking-widest text-lg font-bold">SESSION COMPLETE</p>
               </div>
             )}

          </div>

          {/* Right Panel: Leaderboard */}
          <div className="flex-1 bg-[rgba(0,0,0,0.25)] border border-[rgba(218,180,157,0.25)] rounded-xl overflow-hidden flex flex-col">
            <div className="bg-[rgba(0,0,0,0.3)] border-b border-[rgba(218,180,157,0.2)] p-3 flex justify-between items-center shrink-0">
               <span className="font-mono text-xs font-bold text-[#DAB49D] tracking-widest">LIVE LEADERBOARD</span>
               {status === 'playing' && <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>}
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2 min-h-[300px] max-h-[400px]">
               {students.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-[#DAB49D] opacity-60 font-mono text-sm text-center p-4">
                    AWAITING CONNECTIONS...<br/>STUDENTS MUST ENTER ROOM CODE
                 </div>
               ) : (
                 students.map((student, idx) => (
                    <div key={student.id} className="bg-[rgba(0,0,0,0.2)] border border-[rgba(218,180,157,0.2)] p-3 rounded flex justify-between items-center transition-all">
                     <div className="flex items-center gap-3">
                        <span className="font-mono text-[#DAB49D] font-bold w-4">{idx + 1}.</span>
                       <span className="font-mono font-bold text-white uppercase">{student.username}</span>
                     </div>
                     <span className="font-mono font-bold text-theme-accent">{student.score} PTS</span>
                   </div>
                 ))
               )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
