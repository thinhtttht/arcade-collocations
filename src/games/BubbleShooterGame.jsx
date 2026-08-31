import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CircleDot,
  Trophy,
  Flame,
  ArrowLeft,
  RotateCcw,
  Crosshair,
  Pause,
  Play,
  Home,
  Repeat
} from 'lucide-react';
import { sounds } from '../audio/soundEngine';
import { shuffle, triggerConfetti, triggerWrongEffect } from '../utils/gameUtils';

export default function BubbleShooterGame({
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
  const [timeLeft, setTimeLeft] = useState(35);
  const [targetItem, setTargetItem] = useState(null);
  const [bubbles, setBubbles] = useState([]);

  const timerRef = useRef(null);

  const bubbleColors = [
    'from-pink-500 to-rose-600 border-pink-400',
    'from-cyan-500 to-blue-600 border-cyan-400',
    'from-amber-400 to-orange-500 border-amber-300',
    'from-emerald-400 to-teal-600 border-emerald-300',
    'from-purple-500 to-indigo-600 border-purple-400'
  ];

  const initializeGame = (gameDirection = direction) => {
    setDirection(gameDirection);
    setIsPaused(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(35);
    setGameState('playing');

    spawnNewWave(gameDirection);
  };

  const spawnNewWave = (gameDirection = direction) => {
    const target = pool[Math.floor(Math.random() * pool.length)];
    setTargetItem(target);

    const otherWords = shuffle(pool.filter(w => w.id !== target.id)).slice(0, 4);
    const waveItems = shuffle([target, ...otherWords]);

    const newBubbles = waveItems.map((item, idx) => ({
      id: `${item.id}-${Date.now()}-${idx}`,
      item,
      text: gameDirection === 'en-to-vi' ? item.vi : item.en,
      isTarget: item.id === target.id,
      x: 10 + (idx % 3) * 30 + Math.random() * 8,
      y: 15 + Math.floor(idx / 3) * 35 + Math.random() * 10,
      color: bubbleColors[idx % bubbleColors.length],
      scale: 1 + Math.random() * 0.15
    }));

    setBubbles(newBubbles);
  };

  const handleTogglePause = () => {
    sounds.pop();
    setIsPaused(p => !p);
  };

  useEffect(() => {
    if (gameState !== 'playing' || isPaused) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleGameOver();
          return 0;
        }
        if (prev <= 5) sounds.urgentTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState, isPaused]);

  const handleShootBubble = (bubble) => {
    if (gameState !== 'playing' || isPaused) return;

    if (bubble.isTarget) {
      sounds.bubblePop();
      sounds.correct();

      const points = 100 + combo * 25;
      setScore(s => s + points);
      setCombo(c => {
        const next = c + 1;
        if (next > maxCombo) setMaxCombo(next);
        return next;
      });

      setTimeout(() => {
        spawnNewWave(direction);
      }, 250);
    } else {
      sounds.wrong();
      triggerWrongEffect();
      setCombo(0);
      setScore(s => Math.max(0, s - 30));
    }
  };

  const handleGameOver = () => {
    clearInterval(timerRef.current);
    triggerConfetti();
    sounds.victory();
    onUpdateHighScore(score);
    setGameState('gameover');
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col justify-between flex-1 py-2 select-none relative">
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
              <span>BẮN BONG BÓNG</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-pink-300 border border-slate-700">
                {direction === 'en-to-vi' ? '🔄 🇬🇧 ➔ 🇻🇳 Đảo Ngược' : '🇻🇳 ➔ 🇬🇧 Thuận'}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className={`font-cyber ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-pink-400'}`}>
                ⏱️ {timeLeft}s
              </span>
              {combo > 1 && (
                <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-[10px] font-cyber font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-pink-400 fill-pink-400 animate-pulse" />
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
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-pink-400 border border-pink-500/30 text-xs font-cyber font-bold flex items-center gap-1.5 transition shadow"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Tạm dừng</span>
            </button>
          )}

          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-cyber">ĐIỂM SỐ</div>
            <div className="text-base font-extrabold text-pink-300 font-cyber">{score}</div>
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
              className="bg-slate-900 border-2 border-pink-500/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-pink-400">
                <Pause className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-cyber text-slate-100">
                  TẠM DỪNG BẮN BÓNG
                </h3>
                <p className="text-xs text-slate-400">
                  Bong bóng và đồng hồ đã dừng lại. Sẵn sàng nhắm bắn tiếp chưa?
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleTogglePause}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-slate-950 font-black font-cyber text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Tiếp Tục Bắn</span>
                </button>

                <button
                  onClick={() => initializeGame(direction)}
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
          className="my-auto text-center p-6 sm:p-8 bg-slate-900/90 border border-pink-500/30 rounded-3xl space-y-6 shadow-2xl max-w-xl mx-auto"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-pink-500 to-rose-600 p-1 shadow-xl shadow-pink-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <CircleDot className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400 animate-bounce" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-400 to-amber-300">
              BẮN BONG BÓNG COLLOCATION
            </h2>
            <p className="text-xs text-slate-300">
              Xem mục tiêu ở pháo laser ➔ Nhắm bắn đúng bong bóng:
            </p>
          </div>

          {/* 1. DIRECTION SWITCHER */}
          <div className="space-y-2 text-left">
            <div className="text-xs font-cyber font-bold text-slate-400 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-pink-400" />
              <span>1. CHỌN CHIỀU LUYỆN TẬP:</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => { sounds.tick(); setDirection('vi-to-en'); }}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-1 ${
                  direction === 'vi-to-en'
                    ? 'bg-pink-950 border-pink-400 text-slate-100 shadow-md shadow-pink-500/20 ring-1 ring-pink-400/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold font-cyber text-pink-300">
                  🇻🇳 ➔ 🇬🇧 Chiều Thuận
                </div>
                <div className="text-[11px] text-slate-400">
                  Pháo Laser Tiếng Việt ➔ Bắn Bóng Tiếng Anh
                </div>
              </button>

              <button
                type="button"
                onClick={() => { sounds.tick(); setDirection('en-to-vi'); }}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-1 ${
                  direction === 'en-to-vi'
                    ? 'bg-purple-950 border-purple-400 text-slate-100 shadow-md shadow-purple-500/20 ring-1 ring-purple-400/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold font-cyber text-purple-300">
                  🔄 🇬🇧 ➔ 🇻🇳 Đảo Ngược
                </div>
                <div className="text-[11px] text-slate-400">
                  Pháo Laser Tiếng Anh ➔ Bắn Bóng Tiếng Việt
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={() => initializeGame(direction)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 font-black font-cyber text-base text-slate-950 shadow-xl shadow-pink-500/25 transition"
          >
            BẮT ĐẦU BẮN BÓNG (35 GIÂY) ➔
          </button>
        </motion.div>
      )}

      {/* PLAYING ARENA */}
      {gameState === 'playing' && targetItem && (
        <div className="space-y-3 my-auto flex-1 flex flex-col justify-between">
          <div className="relative w-full h-72 sm:h-80 bg-slate-900/80 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
            <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />

            <AnimatePresence>
              {bubbles.map((bubble) => (
                <motion.div
                  key={bubble.id}
                  style={{ left: `${bubble.x}%`, top: `${bubble.y}%` }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: bubble.scale, opacity: 1, y: [0, -6, 0] }}
                  exit={{ scale: 1.4, opacity: 0 }}
                  transition={{
                    y: { repeat: Infinity, duration: 2.5 + Math.random(), ease: 'easeInOut' }
                  }}
                  onClick={() => handleShootBubble(bubble)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group`}
                >
                  <div
                    className={`w-28 sm:w-32 h-28 sm:h-32 rounded-full bg-gradient-to-br ${bubble.color} p-0.5 shadow-xl border-2 group-hover:scale-110 transition-all flex items-center justify-center`}
                  >
                    <div className="w-full h-full rounded-full bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 text-center">
                      <span className="text-xs sm:text-sm font-extrabold font-cyber text-slate-100 leading-tight">
                        {bubble.text}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-4 sm:p-5 bg-gradient-to-r from-pink-950/90 via-slate-900/95 to-amber-950/90 border-2 border-pink-500/50 rounded-2xl text-center space-y-1 shadow-2xl backdrop-blur-md">
            {direction === 'en-to-vi' ? (
              <>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-cyber font-bold text-xs flex items-center gap-1">
                    <Crosshair className="w-3.5 h-3.5" />
                    🇬🇧 MỤC TIÊU TIẾNG ANH
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-black text-slate-100 font-cyber">
                  "{targetItem.en}"
                </div>

                <div className="text-xs text-slate-400">
                  Bắn bong bóng mang nghĩa: <strong className="text-amber-300">{targetItem.vi}</strong>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-pink-500 text-slate-950 font-cyber font-black text-xs uppercase flex items-center gap-1">
                    <Crosshair className="w-3.5 h-3.5" />
                    🇻🇳 MỤC TIÊU TIẾNG VIỆT
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-black text-slate-100">
                  "{targetItem.vi}"
                </div>

                <div className="text-xs text-slate-400">
                  Bắn bong bóng mang cụm: <strong className="text-pink-300">{targetItem.en}</strong>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* GAMEOVER MODAL */}
      {gameState === 'gameover' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-auto text-center p-8 bg-slate-900/95 border border-pink-500/40 rounded-3xl space-y-6 shadow-2xl max-w-lg mx-auto"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-cyber text-slate-100">
              HẾT GIỜ BẮN BÓNG! 🎯
            </h3>
            <p className="text-xs text-slate-400">
              Khả năng nhắm bắn và phản xạ từ vựng của bạn rất cừ khôi!
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">TỔNG ĐIỂM</div>
              <div className="text-2xl font-bold text-pink-400 font-cyber">{score}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">MAX COMBO</div>
              <div className="text-2xl font-bold text-cyan-300 font-cyber">{maxCombo}x</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => initializeGame(direction)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 font-bold font-cyber text-xs sm:text-sm text-slate-950 shadow-lg transition"
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
