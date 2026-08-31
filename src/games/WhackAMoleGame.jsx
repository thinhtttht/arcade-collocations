import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hammer,
  Trophy,
  Flame,
  ArrowLeft,
  RotateCcw,
  Pause,
  Play,
  Home,
  Repeat
} from 'lucide-react';
import { sounds } from '../audio/soundEngine';
import { shuffle, triggerConfetti, triggerWrongEffect } from '../utils/gameUtils';

export default function WhackAMoleGame({
  pool,
  highScore,
  onUpdateHighScore,
  onBackToHub
}) {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'gameover'
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState('vi-to-en'); // 'vi-to-en' or 'en-to-vi'
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targetItem, setTargetItem] = useState(null);
  const [moles, setMoles] = useState(Array(9).fill(null));
  const [speedLevel, setSpeedLevel] = useState('normal');
  const [hammerActiveIndex, setHammerActiveIndex] = useState(null);

  const gameTimerRef = useRef(null);
  const moleSpawnTimerRef = useRef(null);

  const speedIntervals = {
    slow: 2400,
    normal: 1800,
    fast: 1200
  };

  const moleVisibleDurations = {
    slow: 2100,
    normal: 1500,
    fast: 1000
  };

  const initializeGame = (
    selectedSpeed = speedLevel,
    gameDirection = direction
  ) => {
    setSpeedLevel(selectedSpeed);
    setDirection(gameDirection);
    setIsPaused(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(30);
    setMoles(Array(9).fill(null));
    setHammerActiveIndex(null);
    setGameState('playing');

    pickNewTarget();
  };

  const pickNewTarget = () => {
    const randomTarget = pool[Math.floor(Math.random() * pool.length)];
    setTargetItem(randomTarget);
  };

  const handleTogglePause = () => {
    sounds.pop();
    setIsPaused(p => !p);
  };

  useEffect(() => {
    if (gameState !== 'playing' || isPaused) {
      clearInterval(gameTimerRef.current);
      return;
    }

    gameTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(gameTimerRef.current);
          handleGameOver();
          return 0;
        }
        if (prev <= 5) sounds.urgentTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(gameTimerRef.current);
  }, [gameState, isPaused]);

  useEffect(() => {
    if (gameState !== 'playing' || !targetItem || isPaused) {
      clearInterval(moleSpawnTimerRef.current);
      return;
    }

    const spawnMoles = () => {
      const count = Math.random() > 0.4 ? 3 : 2;
      const holeIndices = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, count);

      const otherWords = pool.filter(w => w.id !== targetItem.id);
      const randomOthers = shuffle(otherWords).slice(0, count - 1);
      const itemsToPlace = shuffle([targetItem, ...randomOthers]);

      setMoles(prev => {
        const next = Array(9).fill(null);
        holeIndices.forEach((holeIdx, i) => {
          if (itemsToPlace[i]) {
            next[holeIdx] = {
              item: itemsToPlace[i],
              isTarget: itemsToPlace[i].id === targetItem.id,
              spawnTime: Date.now()
            };
          }
        });
        return next;
      });

      setTimeout(() => {
        if (!isPaused) setMoles(Array(9).fill(null));
      }, moleVisibleDurations[speedLevel]);
    };

    spawnMoles();
    moleSpawnTimerRef.current = setInterval(spawnMoles, speedIntervals[speedLevel]);

    return () => clearInterval(moleSpawnTimerRef.current);
  }, [gameState, targetItem, speedLevel, isPaused]);

  const handleWhack = (holeIndex) => {
    const mole = moles[holeIndex];
    if (!mole || gameState !== 'playing' || isPaused) return;

    setHammerActiveIndex(holeIndex);
    setTimeout(() => setHammerActiveIndex(null), 200);

    if (mole.isTarget) {
      sounds.hit();
      sounds.correct();
      const points = 100 + combo * 25;
      setScore(s => s + points);
      setCombo(c => {
        const next = c + 1;
        if (next > maxCombo) setMaxCombo(next);
        return next;
      });

      setMoles(prev => {
        const next = [...prev];
        next[holeIndex] = null;
        return next;
      });

      setTimeout(() => {
        pickNewTarget();
      }, 300);
    } else {
      sounds.wrong();
      triggerWrongEffect();
      setCombo(0);
      setScore(s => Math.max(0, s - 30));
    }
  };

  const handleGameOver = () => {
    clearInterval(gameTimerRef.current);
    clearInterval(moleSpawnTimerRef.current);
    triggerConfetti();
    sounds.victory();
    onUpdateHighScore(score);
    setGameState('gameover');
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col justify-between flex-1 py-2 select-none relative">
      {/* Header HUD */}
      <div className="flex items-center justify-between gap-3 p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl mb-3 backdrop-blur-md shadow-lg">
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
              <span>ĐẬP CHUỘT</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-slate-700">
                {direction === 'en-to-vi' ? '🔄 🇬🇧 ➔ 🇻🇳 Đảo Ngược' : '🇻🇳 ➔ 🇬🇧 Thuận'}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className={`font-cyber ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                ⏱️ {timeLeft}s
              </span>
              {combo > 1 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-cyber font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
                  x{combo}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {gameState === 'playing' && (
            <button
              onClick={handleTogglePause}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-cyber font-bold flex items-center gap-1.5 transition shadow"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Tạm dừng</span>
            </button>
          )}

          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-cyber">ĐIỂM SỐ</div>
            <div className="text-base font-extrabold text-amber-300 font-cyber">{score}</div>
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
              className="bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Pause className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-cyber text-slate-100">
                  TẠM DỪNG TRÒ CHƠI
                </h3>
                <p className="text-xs text-slate-400">
                  Chuột và đồng hồ đã dừng lại. Sẵn sàng tiếp tục chưa?
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleTogglePause}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black font-cyber text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Tiếp Tục Chơi</span>
                </button>

                <button
                  onClick={() => initializeGame(speedLevel, direction)}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-cyber text-xs flex items-center justify-center gap-2 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Chơi Lại Từ Đầu</span>
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
          className="my-auto text-center p-6 sm:p-8 bg-slate-900/90 border border-amber-500/30 rounded-3xl space-y-6 shadow-2xl max-w-xl mx-auto"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-rose-500 p-1 shadow-xl shadow-amber-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Hammer className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-bounce" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400">
              ĐẬP CHUỘT COLLOCATION
            </h2>
            <p className="text-xs text-slate-300">
              Nhìn nghĩa ở banner ➔ Đập chú chuột mang từ tương ứng:
            </p>
          </div>

          {/* 1. DIRECTION SWITCHER */}
          <div className="space-y-2 text-left">
            <div className="text-xs font-cyber font-bold text-slate-400 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-amber-400" />
              <span>1. CHỌN CHIỀU LUYỆN TẬP:</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => { sounds.tick(); setDirection('vi-to-en'); }}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-1 ${
                  direction === 'vi-to-en'
                    ? 'bg-amber-950 border-amber-400 text-slate-100 shadow-md shadow-amber-500/20 ring-1 ring-amber-400/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold font-cyber text-amber-300">
                  🇻🇳 ➔ 🇬🇧 Chiều Thuận
                </div>
                <div className="text-[11px] text-slate-400">
                  Xem Tiếng Việt ➔ Đập Chuột Tiếng Anh
                </div>
              </button>

              <button
                type="button"
                onClick={() => { sounds.tick(); setDirection('en-to-vi'); }}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-1 ${
                  direction === 'en-to-vi'
                    ? 'bg-cyan-950 border-cyan-400 text-slate-100 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-400/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold font-cyber text-cyan-300">
                  🔄 🇬🇧 ➔ 🇻🇳 Đảo Ngược
                </div>
                <div className="text-[11px] text-slate-400">
                  Xem Tiếng Anh ➔ Đập Chuột Tiếng Việt
                </div>
              </button>
            </div>
          </div>

          {/* 2. Speed settings */}
          <div className="flex justify-center items-center gap-3 pt-1">
            <span className="text-xs text-slate-400 font-cyber">2. Tốc độ chuột:</span>
            {[
              { id: 'slow', label: 'Thong thả' },
              { id: 'normal', label: 'Bình thường' },
              { id: 'fast', label: 'Siêu tốc' }
            ].map(lvl => (
              <button
                key={lvl.id}
                onClick={() => setSpeedLevel(lvl.id)}
                className={`px-3.5 py-1.5 rounded-xl font-cyber font-bold text-xs border transition ${
                  speedLevel === lvl.id
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => initializeGame(speedLevel, direction)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-orange-400 font-black font-cyber text-base text-slate-950 shadow-xl shadow-amber-500/25 transition"
          >
            BẮT ĐẦU ĐẬP CHUỘT (30 GIÂY) ➔
          </button>
        </motion.div>
      )}

      {/* PLAYING STATE */}
      {gameState === 'playing' && targetItem && (
        <div className="space-y-4 my-auto">
          {/* TARGET BANNER */}
          <motion.div
            key={targetItem.id + '-' + direction}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-rose-950/80 border-2 border-amber-500/50 rounded-2xl shadow-xl text-center space-y-1 backdrop-blur-md"
          >
            {direction === 'en-to-vi' ? (
              <>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-cyber font-bold text-[11px]">
                    🇬🇧 MỤC TIÊU TIẾNG ANH
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-100 font-cyber">
                  "{targetItem.en}"
                </div>
                <div className="text-xs text-slate-400">
                  Đập chú chuột mang nghĩa: <strong className="text-amber-300">"{targetItem.vi}"</strong>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-cyber font-black text-[11px] uppercase">
                    🇻🇳 NGHĨA TIẾNG VIỆT
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-black text-slate-100">
                  "{targetItem.vi}"
                </div>

                <div className="text-xs text-slate-400">
                  Đập chú chuột mang cụm tiếng Anh: <strong className="text-cyan-300">"{targetItem.en}"</strong>
                </div>
              </>
            )}
          </motion.div>

          {/* 3x3 MOLE HOLES GRID */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 p-4 sm:p-6 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-inner">
            {moles.map((mole, idx) => {
              const isHammerActive = hammerActiveIndex === idx;

              return (
                <div
                  key={idx}
                  onClick={() => handleWhack(idx)}
                  className="relative aspect-square rounded-2xl bg-slate-950 border-2 border-slate-800 hover:border-slate-700 cursor-pointer overflow-hidden flex items-center justify-center p-2 shadow-inner group"
                >
                  <div className="absolute inset-x-2 bottom-1.5 h-6 bg-slate-900 rounded-full border border-slate-800/80 pointer-events-none" />

                  <AnimatePresence>
                    {mole && (
                      <motion.div
                        initial={{ y: 50, opacity: 0, scale: 0.8 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 50, opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                        className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2 rounded-xl bg-gradient-to-t from-slate-850 to-slate-800 border border-slate-700 shadow-xl group-hover:scale-105 transition-transform"
                      >
                        <span className="text-2xl sm:text-3xl mb-1 drop-shadow">🐭</span>
                        <span className="text-[11px] sm:text-xs font-bold font-cyber text-slate-100 text-center leading-tight line-clamp-2">
                          {direction === 'en-to-vi' ? mole.item.vi : mole.item.en}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {isHammerActive && (
                    <motion.div
                      initial={{ rotate: -35, scale: 1.3 }}
                      animate={{ rotate: 15, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute z-30 pointer-events-none text-4xl"
                    >
                      🔨
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* GAMEOVER MODAL */}
      {gameState === 'gameover' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-auto text-center p-8 bg-slate-900/95 border border-amber-500/40 rounded-3xl space-y-6 shadow-2xl max-w-lg mx-auto"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-cyber text-slate-100">
              HẾT GIỜ ĐẬP CHUỘT! ⏱️
            </h3>
            <p className="text-xs text-slate-400">
              Phản xạ tuyệt vời! Bạn đã bắt kịp các cụm từ rất nhanh.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">TỔNG ĐIỂM</div>
              <div className="text-2xl font-bold text-amber-300 font-cyber">{score}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">MAX COMBO</div>
              <div className="text-2xl font-bold text-cyan-300 font-cyber">{maxCombo}x</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => initializeGame(speedLevel, direction)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-rose-500 hover:from-amber-300 hover:to-rose-400 font-bold font-cyber text-xs sm:text-sm text-slate-950 shadow-lg transition"
            >
              Chơi Lại
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
