import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Trophy,
  Flame,
  ArrowLeft,
  RotateCcw,
  Gauge,
  Pause,
  Play,
  Home,
  Repeat
} from 'lucide-react';
import { sounds } from '../audio/soundEngine';
import { shuffle, triggerConfetti } from '../utils/gameUtils';

export default function TypeRacerGame({
  pool,
  highScore,
  onUpdateHighScore,
  onBackToHub
}) {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'racing', 'gameover'
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState('vi-to-en'); // 'vi-to-en' or 'en-to-vi'
  const [raceWords, setRaceWords] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [playerProgress, setPlayerProgress] = useState(0);
  const [botProgress, setBotProgress] = useState(0);
  const [botSpeedWpm, setBotSpeedWpm] = useState(35);
  const [difficulty, setDifficulty] = useState('medium');
  const [wpm, setWpm] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const [raceStartTime, setRaceStartTime] = useState(null);
  const [winner, setWinner] = useState(null);

  const botIntervalRef = useRef(null);
  const wpmIntervalRef = useRef(null);
  const inputRef = useRef(null);

  const initializeRace = (
    selectedDifficulty = difficulty,
    gameDirection = direction
  ) => {
    setDifficulty(selectedDifficulty);
    setDirection(gameDirection);
    setIsPaused(false);
    const botWpmMap = { easy: 28, medium: 42, hard: 58 };
    const botWpm = botWpmMap[selectedDifficulty] || 38;
    setBotSpeedWpm(botWpm);

    const selected = shuffle([...pool]);
    setRaceWords(selected);
    setCurrentWordIndex(0);
    setTypedText('');
    setPlayerProgress(0);
    setBotProgress(0);
    setWpm(0);
    setTotalCharsTyped(0);
    setWinner(null);
    setRaceStartTime(Date.now());
    setGameState('racing');

    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 100);
  };

  const currentTargetItem = raceWords[currentWordIndex];
  const targetToType = direction === 'en-to-vi'
    ? (currentTargetItem?.vi || '')
    : (currentTargetItem?.en || '');

  const handleTogglePause = () => {
    sounds.pop();
    setIsPaused(p => !p);
    if (isPaused) {
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  };

  useEffect(() => {
    if (gameState !== 'racing' || isPaused) {
      clearInterval(botIntervalRef.current);
      return;
    }

    const totalRaceChars = raceWords.reduce((acc, w) => acc + (direction === 'en-to-vi' ? w.vi.length : w.en.length) + 1, 0) || 100;
    const botCps = (botSpeedWpm * 5) / 60;
    const tickMs = 200;

    botIntervalRef.current = setInterval(() => {
      setBotProgress(prev => {
        const addedProgress = (botCps * (tickMs / 1000) / totalRaceChars) * 100;
        const next = prev + addedProgress;

        if (next >= 100) {
          clearInterval(botIntervalRef.current);
          handleRaceFinish('bot');
          return 100;
        }
        return next;
      });
    }, tickMs);

    return () => clearInterval(botIntervalRef.current);
  }, [gameState, raceWords, botSpeedWpm, isPaused, direction]);

  useEffect(() => {
    if (gameState !== 'racing' || !raceStartTime || isPaused) {
      clearInterval(wpmIntervalRef.current);
      return;
    }

    wpmIntervalRef.current = setInterval(() => {
      const elapsedMinutes = (Date.now() - raceStartTime) / 60000;
      if (elapsedMinutes > 0.02) {
        const calculatedWpm = Math.round((totalCharsTyped / 5) / elapsedMinutes);
        setWpm(calculatedWpm);
      }
    }, 500);

    return () => clearInterval(wpmIntervalRef.current);
  }, [gameState, raceStartTime, totalCharsTyped, isPaused]);

  const handleInputChange = (e) => {
    if (gameState !== 'racing' || isPaused) return;

    const val = e.target.value;
    setTypedText(val);
    setTotalCharsTyped(c => c + 1);

    const matchCandidate = targetToType;
    if (matchCandidate.toLowerCase().startsWith(val.toLowerCase())) {
      sounds.type();

      if (val.trim().toLowerCase() === matchCandidate.trim().toLowerCase()) {
        sounds.nitro();
        sounds.correct();

        const nextIndex = currentWordIndex + 1;
        const nextProgress = (nextIndex / raceWords.length) * 100;
        setPlayerProgress(nextProgress);

        if (nextIndex >= raceWords.length) {
          handleRaceFinish('player');
        } else {
          setCurrentWordIndex(nextIndex);
          setTypedText('');
        }
      }
    } else {
      sounds.carBrake();
    }
  };

  const handleRaceFinish = (finishWinner) => {
    clearInterval(botIntervalRef.current);
    clearInterval(wpmIntervalRef.current);
    setWinner(finishWinner);

    if (finishWinner === 'player') {
      triggerConfetti();
      sounds.victory();
      onUpdateHighScore(wpm);
    } else {
      sounds.wrong();
    }

    setGameState('gameover');
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col justify-between flex-1 py-2 select-none relative">
      {/* Header HUD */}
      <div className="flex items-center justify-between gap-3 p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl mb-4 backdrop-blur-md shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHub}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Quay lại Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="text-[10px] text-slate-400 font-cyber font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>ĐUA XE GÕ TỪ</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {direction === 'en-to-vi' ? '🔄 🇬🇧 ➔ 🇻🇳 Đảo Ngược' : '🇻🇳 ➔ 🇬🇧 Thuận'}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="text-cyan-400 font-cyber">Từ {currentWordIndex + 1}/{raceWords.length || pool.length}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-cyber">
                Bot: {botSpeedWpm} WPM
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {gameState === 'racing' && (
            <button
              onClick={handleTogglePause}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-cyber font-bold flex items-center gap-1.5 transition shadow"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Tạm dừng</span>
            </button>
          )}

          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-cyber">TỐC ĐỘ GÕ</div>
            <div className="text-base font-extrabold text-cyan-300 font-cyber flex items-center gap-1">
              <Gauge className="w-4 h-4 text-cyan-400" />
              <span>{wpm} WPM</span>
            </div>
          </div>
        </div>
      </div>

      {/* PAUSE OVERLAY MODAL */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-900 border-2 border-cyan-500/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                <Pause className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-cyber text-slate-100">
                  TẠM DỪNG ĐƯỜNG ĐUA
                </h3>
                <p className="text-xs text-slate-400">
                  Xe và bot AI đã dừng lại. Sẵn sàng tăng tốc lại chưa?
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleTogglePause}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black font-cyber text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Tiếp Tục Đua</span>
                </button>

                <button
                  onClick={() => initializeRace(difficulty, direction)}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-cyber text-xs flex items-center justify-center gap-2 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Đua Lại Từ Đầu</span>
                </button>

                <button
                  onClick={onBackToHub}
                  className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-white border border-slate-800 font-bold font-cyber text-xs flex items-center justify-center gap-2 transition"
                >
                  <Home className="w-4 h-4" />
                  <span>Về Màn Hình Chính (Hub)</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* READY SCREEN */}
      {gameState === 'ready' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-auto text-center p-6 sm:p-8 bg-slate-900/90 border border-cyan-500/30 rounded-3xl space-y-6 shadow-2xl max-w-xl mx-auto"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-1 shadow-xl shadow-cyan-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Car className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400">
              ĐUA XE GÕ PHÍM NITRO ({pool.length} TỪ)
            </h2>
            <p className="text-xs text-slate-300">
              Gõ đúng từ để nạp Nitro cho xe phóng nhanh về đích:
            </p>
          </div>

          {/* 1. DIRECTION SWITCHER */}
          <div className="space-y-2 text-left">
            <div className="text-xs font-cyber font-bold text-slate-400 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-cyan-400" />
              <span>1. CHỌN CHIỀU LUYỆN TẬP:</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => { sounds.tick(); setDirection('vi-to-en'); }}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-1 ${
                  direction === 'vi-to-en'
                    ? 'bg-cyan-950 border-cyan-400 text-slate-100 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold font-cyber text-cyan-300">
                  🇻🇳 ➔ 🇬🇧 Chiều Thuận
                </div>
                <div className="text-[11px] text-slate-400">
                  Xem Tiếng Việt ➔ Gõ Collocation Tiếng Anh
                </div>
              </button>

              <button
                type="button"
                onClick={() => { sounds.tick(); setDirection('en-to-vi'); }}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-1 ${
                  direction === 'en-to-vi'
                    ? 'bg-amber-950 border-amber-400 text-slate-100 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold font-cyber text-amber-300">
                  🔄 🇬🇧 ➔ 🇻🇳 Đảo Ngược
                </div>
                <div className="text-[11px] text-slate-400">
                  Xem Collocation ➔ Gõ Nghĩa Tiếng Việt
                </div>
              </button>
            </div>
          </div>

          {/* 2. Difficulty selector */}
          <div className="flex justify-center gap-3 pt-1">
            {[
              { id: 'easy', label: 'Dễ (28 WPM)' },
              { id: 'medium', label: 'Vừa (42 WPM)' },
              { id: 'hard', label: 'Khó (58 WPM)' }
            ].map(d => (
              <button
                key={d.id}
                onClick={() => setDifficulty(d.id)}
                className={`px-4 py-2.5 rounded-xl font-cyber font-bold text-xs border transition ${
                  difficulty === d.id
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => initializeRace(difficulty, direction)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 font-black font-cyber text-base text-slate-950 shadow-xl shadow-cyan-500/25 transition"
          >
            VÀO ĐƯỜNG ĐUA ({pool.length} TỪ) 🏁
          </button>
        </motion.div>
      )}

      {/* RACING ARENA */}
      {gameState === 'racing' && currentTargetItem && (
        <div className="space-y-4 my-auto">
          <div className="p-4 sm:p-5 bg-slate-900/90 border-2 border-slate-800 rounded-3xl space-y-4 shadow-2xl relative overflow-hidden">
            <div className="relative h-14 bg-slate-950/80 rounded-2xl border border-cyan-500/30 flex items-center px-3 overflow-hidden">
              <div className="absolute left-2 text-[10px] font-cyber font-bold text-cyan-400/50 uppercase">
                YOU (XE BẠN)
              </div>
              <motion.div
                style={{ left: `${Math.min(92, Math.max(2, playerProgress))}%` }}
                className="absolute flex items-center gap-1 z-10 transition-all duration-150"
              >
                <span className="text-3xl drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]">🏎️</span>
                {typedText.length > 0 && <span className="text-xs">🔥</span>}
              </motion.div>
              <div className="absolute right-3 text-xl">🏁</div>
            </div>

            <div className="relative h-14 bg-slate-950/80 rounded-2xl border border-rose-500/30 flex items-center px-3 overflow-hidden">
              <div className="absolute left-2 text-[10px] font-cyber font-bold text-rose-400/50 uppercase">
                AI BOT ({botSpeedWpm} WPM)
              </div>
              <motion.div
                style={{ left: `${Math.min(92, Math.max(2, botProgress))}%` }}
                className="absolute flex items-center gap-1 z-10 transition-all duration-150"
              >
                <span className="text-3xl drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]">🚗</span>
              </motion.div>
              <div className="absolute right-3 text-xl">🏁</div>
            </div>
          </div>

          <div className="p-5 sm:p-6 bg-slate-900/95 border-2 border-cyan-500/50 rounded-2xl text-center space-y-2 shadow-xl backdrop-blur-md">
            {direction === 'en-to-vi' ? (
              <>
                <div className="inline-block px-3 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-cyber font-bold text-xs">
                  🇬🇧 COLLOCATION: "{currentTargetItem.en}"
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-100">
                  Gõ nghĩa: "{currentTargetItem.vi}"
                </div>
              </>
            ) : (
              <>
                <div className="inline-block px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 font-cyber font-bold text-xs">
                  🇻🇳 NGHĨA: "{currentTargetItem.vi}"
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-100 font-cyber">
                  Gõ cụm: "{currentTargetItem.en}"
                </div>
              </>
            )}

            <div className="text-base sm:text-lg font-cyber font-extrabold tracking-wider pt-1">
              <span className="text-emerald-400">{targetToType.slice(0, typedText.length)}</span>
              <span className="text-slate-500">{targetToType.slice(typedText.length)}</span>
            </div>
          </div>

          <div>
            <input
              ref={inputRef}
              type="text"
              disabled={isPaused}
              value={typedText}
              onChange={handleInputChange}
              placeholder={direction === 'en-to-vi' ? "Gõ chính xác nghĩa tiếng Việt..." : "Gõ chính xác cụm từ tiếng Anh..."}
              className="w-full bg-slate-950 border-2 border-cyan-500 focus:border-amber-400 rounded-2xl px-5 py-4 text-base text-slate-100 font-cyber outline-none shadow-lg text-center tracking-wide"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* GAMEOVER MODAL */}
      {gameState === 'gameover' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-auto text-center p-8 bg-slate-900/95 border border-cyan-500/40 rounded-3xl space-y-6 shadow-2xl max-w-lg mx-auto"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-cyber text-slate-100">
              {winner === 'player' ? 'CHIẾN THẮNG VỀ ĐÍCH! 🏆' : 'BOT ĐÃ VỀ ĐÍCH TRƯỚC! 🤖'}
            </h3>
            <p className="text-xs text-slate-400">
              {winner === 'player'
                ? `Xuất sắc! Tốc độ gõ của bạn là ${wpm} WPM.`
                : 'Hãy luyện thêm phản xạ ngón tay để vượt qua Bot ở lần đua tiếp theo nhé!'}
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">TỐC ĐỘ GÕ</div>
              <div className="text-2xl font-bold text-cyan-300 font-cyber">{wpm} WPM</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">KỶ LỤC CŨ</div>
              <div className="text-2xl font-bold text-amber-300 font-cyber">{highScore} WPM</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => initializeRace(difficulty, direction)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 font-bold font-cyber text-xs sm:text-sm text-slate-950 shadow-lg transition"
            >
              Đua Lại
            </button>
            <button
              onClick={onBackToHub}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold font-cyber text-xs sm:text-sm text-slate-300 transition"
            >
              Về Hub
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
