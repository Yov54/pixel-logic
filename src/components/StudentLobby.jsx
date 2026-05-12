import { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import { Loader2, AlertTriangle, Trophy, ChevronLeft } from "lucide-react";
import GameBoard from "./GameBoard";

export default function StudentLobby({ 
  username, 
  roomCode, 
  onExit,
  game,
  ruleInfo,
  showHelpTooltip,
  setShowHelpTooltip,
  setManualTutorialOpen,
  setCheatSheetOpen,
  openSettings
}) {
  const [conn, setConn] = useState(null);
  const [status, setStatus] = useState('connecting'); // connecting, lobby, playing, finished, error
  const [errorMsg, setErrorMsg] = useState("");
  const [rankings, setRankings] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  const timerRef = useRef(null);

  useEffect(() => {
    const peer = new Peer({ debug: 2 });

    peer.on('open', (id) => {
      const fullId = `pxl-logic-${roomCode}`;
      const connection = peer.connect(fullId);

      connection.on('open', () => {
        setStatus('lobby');
        setConn(connection);
        connection.send({ type: 'join', username });
      });

      connection.on('data', (data) => {
        if (data.type === 'start_game') {
          // Initialize score attack game
          game.startGame(data.difficulty, true, data.seed);
          setStatus('playing');
          setTimeLeft(data.timeLimit * 60);

          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
          }, 1000);
          
        } else if (data.type === 'terminate') {
          if (timerRef.current) clearInterval(timerRef.current);
          setRankings(data.rankings);
          setStatus('finished');
        }
      });

      connection.on('close', () => {
        if (status !== 'finished') {
           setStatus('error');
           setErrorMsg("CONNECTION LOST TO ADMIN.");
        }
      });

      connection.on('error', (err) => {
        setStatus('error');
        setErrorMsg("CONNECTION FAILED.");
      });
    });

    peer.on('error', (err) => {
      setStatus('error');
      setErrorMsg("PEER CONNECTION ERROR.");
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      peer.destroy();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Send score updates to Admin
  useEffect(() => {
    if (conn && status === 'playing') {
      conn.send({ type: 'score_update', score: game.score });
    }
  }, [game.score]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (status === 'connecting' || status === 'lobby') {
    return (
      <div className="flex-1 w-full flex items-center justify-center p-4">
        <div className="bg-theme-dark border-4 border-theme-accent shadow-[0_0_50px_rgba(44,24,20,0.8)] rounded-3xl p-8 max-w-md w-full flex flex-col items-center text-center relative overflow-hidden">
           {/* Retro Scanlines */}
           <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none z-10"></div>
           
           <div className="relative z-20 w-full">
             <button 
                onClick={onExit}
                className="absolute -top-2 -left-2 text-theme-sand hover:text-white transition-colors"
                title="EXIT ROOM"
             >
               <ChevronLeft className="w-6 h-6" />
             </button>

             <Loader2 className="w-12 h-12 text-theme-accent animate-spin mx-auto mb-6 drop-shadow-[0_0_10px_rgba(192,133,82,0.8)]" />
             <h2 className="text-2xl font-mono font-bold text-white mb-2 tracking-widest uppercase">
               {status === 'connecting' ? 'CONNECTING...' : 'CONNECTED'}
             </h2>
             <p className="text-[#DAB49D] opacity-80 font-mono text-sm mb-6">
               {status === 'connecting' ? `SEARCHING FOR ROOM [${roomCode}]` : 'AWAITING ADMIN INITIALIZATION...'}
             </p>

             <div className="bg-[rgba(0,0,0,0.25)] border border-[rgba(218,180,157,0.25)] rounded p-4 text-left">
               <p className="text-[10px] text-theme-sand font-bold mb-1 tracking-widest">USERNAME</p>
               <p className="font-mono text-white tracking-widest uppercase text-lg mb-3">{username}</p>
               <p className="text-[10px] text-theme-sand font-bold mb-1 tracking-widest">STATUS</p>
               <p className={`font-mono font-bold uppercase text-sm ${status === 'lobby' ? 'text-green-500 animate-pulse' : 'text-theme-accent'}`}>
                 {status === 'lobby' ? 'READY / STANDBY' : 'CONNECTING...'}
               </p>
             </div>
           </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex-1 w-full flex items-center justify-center p-4">
        <div className="bg-theme-dark border-4 border-red-500/50 shadow-[0_0_50px_rgba(220,38,38,0.3)] rounded-3xl p-8 max-w-md w-full flex flex-col items-center text-center">
           <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
           <h2 className="text-2xl font-mono font-bold text-red-500 mb-2 tracking-widest">CONNECTION LOST</h2>
           <p className="text-[#DAB49D] font-mono text-sm mb-8">{errorMsg}</p>
           <button 
             onClick={onExit}
              className="px-8 py-3 bg-[rgba(0,0,0,0.3)] border border-[rgba(218,180,157,0.3)] text-white font-bold font-mono tracking-widest rounded hover:bg-theme-mid transition-colors"
           >
             RETURN TO MAIN MENU
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center relative overflow-hidden">
      
      {/* Top Banner for Score Attack */}
      {status === 'playing' && (
        <div className="w-full max-w-5xl flex justify-center mb-2 px-2 z-50">
           <div className={`px-6 py-2 rounded-b-xl border-x-2 border-b-2 font-mono font-bold flex items-center gap-4 transition-colors ${timeLeft <= 10 ? 'bg-red-600 border-red-800 text-white animate-pulse' : 'bg-theme-dark border-theme text-theme-accent'}`}>
             <span className="text-xs opacity-80 tracking-widest">TIME REMAINING</span>
             <span className="text-2xl drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{formatTime(timeLeft)}</span>
           </div>
        </div>
      )}

      {/* The Game Board */}
      <GameBoard 
         game={game}
         ruleInfo={ruleInfo}
         showHelpTooltip={showHelpTooltip}
         setShowHelpTooltip={setShowHelpTooltip}
         setManualTutorialOpen={setManualTutorialOpen}
         setCheatSheetOpen={setCheatSheetOpen}
         setIsPauseOpen={() => {}} // Disable pause in multiplayer
         isMultiplayer={true}
         openSettings={openSettings}
      />

      {/* Finished State Overlay */}
      {status === 'finished' && (
        <div className="absolute inset-0 z-[500] bg-theme-dark-solid-80 backdrop-blur-md flex items-center justify-center p-4">
           <div className="w-full max-w-lg bg-theme-dark border-4 border-theme-accent shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-3xl p-6 md:p-8 flex flex-col items-center animate-in zoom-in duration-500">
             
             <Trophy className="w-16 h-16 text-yellow-500 mb-4 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
             <h2 className="text-3xl font-mono font-bold text-white mb-1 tracking-widest text-center uppercase">SESSION TERMINATED</h2>
             <p className="text-[#DAB49D] font-bold text-sm tracking-[0.2em] mb-6">FINAL RESULTS</p>

             <div className="w-full bg-[rgba(0,0,0,0.25)] rounded-xl border border-[rgba(218,180,157,0.25)] p-2 mb-6 max-h-[40vh] overflow-y-auto">
               {rankings.map(student => (
                 <div key={student.username} className={`p-3 border-b border-[rgba(218,180,157,0.15)] flex justify-between items-center ${student.username === username ? 'bg-[rgba(192,133,82,0.2)] rounded border-theme-accent' : ''}`}>
                   <div className="flex items-center gap-3">
                     <span className={`font-mono font-black text-lg w-6 ${student.rank === 1 ? 'text-yellow-500' : student.rank === 2 ? 'text-gray-400' : student.rank === 3 ? 'text-amber-600' : 'text-theme-sand'}`}>
                       #{student.rank}
                     </span>
                     <span className={`font-mono font-bold uppercase ${student.username === username ? 'text-white' : 'text-[#DAB49D]'}`}>
                       {student.username} {student.username === username && '(YOU)'}
                     </span>
                   </div>
                   <span className="font-mono font-bold text-theme-accent">{student.score} PTS</span>
                 </div>
               ))}
             </div>

             <button 
               onClick={onExit}
               className="w-full py-4 bg-theme-dark text-white font-bold font-mono tracking-widest rounded-xl hover:bg-theme-mid transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)] hover:-translate-y-1"
             >
               DISCONNECT & RETURN
             </button>

           </div>
        </div>
      )}

    </div>
  );
}
