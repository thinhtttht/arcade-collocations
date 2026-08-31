import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cable,
  Trophy,
  Flame,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  Pause,
  Play,
  Home,
  Repeat
} from 'lucide-react';
import { sounds } from '../audio/soundEngine';
import { shuffle, triggerConfetti, triggerWrongEffect } from '../utils/gameUtils';

export default function WireConnectGame({
  pool,
  highScore,
  onUpdateHighScore,
  onBackToHub
}) {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'victory'
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState('vi-to-en'); // 'vi-to-en' or 'en-to-vi'
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [round, setRound] = useState(1);
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [connections, setConnections] = useState([]);
  const [completedPairs, setCompletedPairs] = useState(new Set());

  const containerRef = useRef(null);

  const neonColors = [
    '#06b6d4',
    '#ec4899',
    '#eab308',
    '#10b981',
    '#a855f7'
  ];

  const initializeGame = (gameDirection = direction) => {
    setDirection(gameDirection);
    setIsPaused(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setRound(1);
    setConnections([]);
    setCompletedPairs(new Set());
    setGameState('playing');
    setupRound(1, gameDirection);
  };

  const setupRound = (r = round, gameDirection = direction) => {
    const selected = shuffle([...pool]).slice(0, 5);

    if (gameDirection === 'en-to-vi') {
      // Left = English, Right = Vietnamese
      const lefts = selected.map((item, idx) => ({
        id: item.id,
        item,
        text: item.en,
        tag: 'English',
        color: neonColors[idx % neonColors.length]
      }));

      const rights = shuffle(
        selected.map(item => ({
          id: item.id,
          item,
          text: item.vi,
          tag: 'Tiếng Việt'
        }))
      );

      setLeftItems(lefts);
      setRightItems(rights);
    } else {
      // Left = Vietnamese, Right = English
      const lefts = selected.map((item, idx) => ({
        id: item.id,
        item,
        text: item.vi,
        tag: 'Tiếng Việt',
        color: neonColors[idx % neonColors.length]
      }));

      const rights = shuffle(
        selected.map(item => ({
          id: item.id,
          item,
          text: item.en
        }))
      );

      setLeftItems(lefts);
      setRightItems(rights);
    }

    setSelectedLeft(null);
    setConnections([]);
    setCompletedPairs(new Set());
  };

  const handleTogglePause = () => {
    sounds.pop();
    setIsPaused(p => !p);
  };

  const handleLeftClick = (item) => {
    if (completedPairs.has(item.id) || gameState !== 'playing' || isPaused) return;
    sounds.tick();
    setSelectedLeft(item);
  };

  const handleRightClick = (item) => {
    if (!selectedLeft || completedPairs.has(item.id) || gameState !== 'playing' || isPaused) return;

    if (selectedLeft.id === item.id) {
      sounds.connect();
      sounds.correct();

      const newConnections = [
        ...connections,
        {
          leftId: selectedLeft.id,
          rightId: item.id,
          color: selectedLeft.color
        }
      ];
      setConnections(newConnections);

      const nextCompleted = new Set(completedPairs);
      nextCompleted.add(item.id);
      setCompletedPairs(nextCompleted);

      const points = 120 + combo * 30;
      setScore(s => s + points);
      setCombo(c => {
        const next = c + 1;
        if (next > maxCombo) setMaxCombo(next);
        return next;
      });

      setSelectedLeft(null);

      if (nextCompleted.size >= 5) {
        setTimeout(() => {
          if (round >= 3) {
            triggerConfetti();
            sounds.victory();
            onUpdateHighScore(score + points);
            setGameState('victory');
          } else {
            const nextRound = round + 1;
            setRound(nextRound);
            setupRound(nextRound, direction);
          }
        }, 800);
      }
    } else {
      sounds.wrong();
      triggerWrongEffect();
      setCombo(0);
      setSelectedLeft(null);
    }
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
              <span>NỐI MẠCH ĐIỆN</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-emerald-300 border border-slate-700">
                {direction === 'en-to-vi' ? '🔄 🇬🇧 ➔ 🇻🇳 Đảo Ngược' : '🇻🇳 ➔ 🇬🇧 Thuận'}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="text-emerald-400 font-cyber">Vòng {round}/3</span>
              {combo > 1 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-cyber font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-emerald-400 fill-emerald-400 animate-pulse" />
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
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-cyber font-bold flex items-center gap-1.5 transition shadow"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Tạm dừng</span>
            </button>
          )}

          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-cyber">ĐIỂM SỐ</div>
            <div className="text-base font-extrabold text-emerald-300 font-cyber">{score}</div>
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
              className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Pause className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-cyber text-slate-100">
                  TẠM DỪNG TRÒ CHƠI
                </h3>
                <p className="text-xs text-slate-400">
                  Mạch điện đã dừng lại. Sẵn sàng tiếp tục nối dây chưa?
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleTogglePause}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 text-slate-950 font-black font-cyber text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Tiếp Tục Chơi</span>
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
          className="my-auto text-center p-6 sm:p-8 bg-slate-900/90 border border-emerald-500/30 rounded-3xl space-y-6 shadow-2xl max-w-xl mx-auto"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 p-1 shadow-xl shadow-emerald-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Cable className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400">
              NỐI DÂY ĐIỆN COLLOCATION
            </h2>
            <p className="text-xs text-slate-300">
              Nối từng cặp từ tiếng Việt sang tiếng Anh chuẩn xác (3 vòng):
            </p>
          </div>

          {/* 1. DIRECTION SWITCHER */}
          <div className="space-y-2 text-left">
            <div className="text-xs font-cyber font-bold text-slate-400 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-emerald-400" />
              <span>1. CHỌN CHIỀU LUYỆN TẬP:</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => { sounds.tick(); setDirection('vi-to-en'); }}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-1 ${
                  direction === 'vi-to-en'
                    ? 'bg-emerald-950 border-emerald-400 text-slate-100 shadow-md shadow-emerald-500/20 ring-1 ring-emerald-400/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold font-cyber text-emerald-300">
                  🇻🇳 ➔ 🇬🇧 Chiều Thuận
                </div>
                <div className="text-[11px] text-slate-400">
                  Cột Trái (Tiếng Việt) ➔ Cột Phải (Tiếng Anh)
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
                  Cột Trái (Tiếng Anh) ➔ Cột Phải (Tiếng Việt)
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={() => initializeGame(direction)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 hover:from-emerald-300 hover:to-teal-400 font-black font-cyber text-base text-slate-950 shadow-xl shadow-emerald-500/25 transition"
          >
            BẮT ĐẦU NỐI MẠCH (3 VÒNG) ➔
          </button>
        </motion.div>
      )}

      {/* PLAYING STATE */}
      {gameState === 'playing' && (
        <div
          ref={containerRef}
          className="grid grid-cols-2 gap-6 sm:gap-12 my-auto p-4 sm:p-6 bg-slate-900/80 border border-slate-800 rounded-3xl shadow-inner relative"
        >
          {/* LEFT COLUMN */}
          <div className="space-y-3">
            <div className="text-xs text-center font-cyber font-bold text-slate-400 mb-2 uppercase">
              {direction === 'en-to-vi' ? '🇬🇧 Cụm Tiếng Anh' : '🇻🇳 Nghĩa Tiếng Việt'}
            </div>
            {leftItems.map((item) => {
              const isCompleted = completedPairs.has(item.id);
              const isSelected = selectedLeft?.id === item.id;

              return (
                <button
                  key={item.id}
                  disabled={isCompleted || isPaused}
                  onClick={() => handleLeftClick(item)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative flex items-center justify-between shadow-md ${
                    isCompleted
                      ? 'bg-emerald-950/40 border-emerald-500/60 opacity-60'
                      : isSelected
                      ? 'bg-slate-800 border-cyan-400 shadow-lg shadow-cyan-500/30 scale-[1.02]'
                      : 'bg-slate-950/90 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-100">
                    "{item.text}"
                  </span>
                </button>
              );
            })}
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-3">
            <div className="text-xs text-center font-cyber font-bold text-slate-400 mb-2 uppercase">
              {direction === 'en-to-vi' ? '🇻🇳 Nghĩa Tiếng Việt' : '🇬🇧 Cụm Tiếng Anh'}
            </div>
            {rightItems.map((item) => {
              const isCompleted = completedPairs.has(item.id);

              return (
                <button
                  key={item.id}
                  disabled={isCompleted || isPaused}
                  onClick={() => handleRightClick(item)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all relative flex items-center justify-between shadow-md ${
                    isCompleted
                      ? 'bg-emerald-950/40 border-emerald-500/60 opacity-60'
                      : 'bg-slate-950/90 border-slate-800 hover:border-emerald-500/60 text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-xs sm:text-sm font-extrabold font-cyber text-slate-100">
                    {item.text}
                  </span>
                  {isCompleted && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* VICTORY MODAL */}
      {gameState === 'victory' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-auto text-center p-8 bg-slate-900/95 border border-emerald-500/40 rounded-3xl space-y-6 shadow-2xl max-w-lg mx-auto"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-cyber text-slate-100">
              KẾT NỐI TOÀN BỘ MẠCH ĐIỆN! ⚡
            </h3>
            <p className="text-xs text-slate-400">
              Bạn đã hoàn thành xuất sắc 3 vòng nối dây điện từ vựng!
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">TỔNG ĐIỂM</div>
              <div className="text-2xl font-bold text-emerald-300 font-cyber">{score}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">MAX COMBO</div>
              <div className="text-2xl font-bold text-cyan-300 font-cyber">{maxCombo}x</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => initializeGame(direction)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-300 hover:to-teal-400 font-bold font-cyber text-xs sm:text-sm text-slate-950 shadow-lg transition"
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
