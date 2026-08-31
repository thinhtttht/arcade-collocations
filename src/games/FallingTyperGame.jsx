import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Trophy,
  Flame,
  ArrowLeft,
  RotateCcw,
  Heart,
  Keyboard,
  MousePointer,
  Pause,
  Play,
  Home,
  Repeat
} from 'lucide-react';
import { sounds } from '../audio/soundEngine';
import { triggerConfetti, triggerWrongEffect } from '../utils/gameUtils';
import {
  generateForwardOptions,
  generateReverseOptions
} from '../utils/tabooUtils';

export default function FallingTyperGame({
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
  const [lives, setLives] = useState(3);
  const [currentWord, setCurrentWord] = useState(null);
  const [fallingProgress, setFallingProgress] = useState(0);
  const [playMode, setPlayMode] = useState('choice'); // 'choice' or 'typing'
  const [choiceOptions, setChoiceOptions] = useState([]);
  const [typedInput, setTypedInput] = useState('');

  const fallIntervalRef = useRef(null);
  const fallSpeedMs = 120;
  const fallStep = 1.5;

  const initializeGame = (
    mode = playMode,
    gameDirection = direction
  ) => {
    setPlayMode(mode);
    setDirection(gameDirection);
    setIsPaused(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setLives(3);
    setTypedInput('');
    setGameState('playing');

    spawnNextWord(gameDirection);
  };

  const spawnNextWord = (gameDirection = direction) => {
    const randomWord = pool[Math.floor(Math.random() * pool.length)];

    setCurrentWord(randomWord);
    setFallingProgress(0);
    setTypedInput('');

    let opts = [];
    if (gameDirection === 'en-to-vi') {
      opts = generateReverseOptions(pool, randomWord, 4);
    } else {
      opts = generateForwardOptions(pool, randomWord, 4);
    }
    setChoiceOptions(opts);
  };

  const handleTogglePause = () => {
    sounds.pop();
    setIsPaused(p => !p);
  };

  useEffect(() => {
    if (gameState !== 'playing' || !currentWord || isPaused) {
      clearInterval(fallIntervalRef.current);
      return;
    }

    fallIntervalRef.current = setInterval(() => {
      setFallingProgress(prev => {
        if (prev >= 98) {
          clearInterval(fallIntervalRef.current);
          handleWordHitLaser();
          return 100;
        }
        return prev + fallStep;
      });
    }, fallSpeedMs);

    return () => clearInterval(fallIntervalRef.current);
  }, [gameState, currentWord, isPaused]);

  const handleWordHitLaser = () => {
    sounds.laser();
    sounds.wrong();
    triggerWrongEffect();

    const nextLives = lives - 1;
    setLives(nextLives);
    setCombo(0);

    if (nextLives <= 0) {
      handleGameOver();
    } else {
      setTimeout(() => {
        spawnNextWord();
      }, 400);
    }
  };

  const handleChoiceSelect = (opt) => {
    if (gameState !== 'playing' || isPaused) return;

    if (opt.isCorrect) {
      handleSuccess();
    } else {
      sounds.wrong();
      triggerWrongEffect();
      setCombo(0);
      setScore(s => Math.max(0, s - 30));
    }
  };

  const handleTypingSubmit = (e) => {
    e.preventDefault();
    if (gameState !== 'playing' || !typedInput.trim() || isPaused) return;

    const targetToMatch = direction === 'en-to-vi' ? currentWord.vi : currentWord.en;
    const isMatch =
      typedInput.trim().toLowerCase() === targetToMatch.toLowerCase() ||
      typedInput.trim().toLowerCase() === currentWord.en.toLowerCase() ||
      typedInput.trim().toLowerCase() === currentWord.vi.toLowerCase();

    if (isMatch) {
      handleSuccess();
    } else {
      sounds.wrong();
      triggerWrongEffect();
      setCombo(0);
    }
  };

  const handleSuccess = () => {
    sounds.correct();
    clearInterval(fallIntervalRef.current);

    const heightBonus = Math.round((100 - fallingProgress) * 1.5);
    const comboBonus = combo * 25;
    const gained = 100 + heightBonus + comboBonus;

    setScore(s => s + gained);
    setCombo(c => {
      const next = c + 1;
      if (next > maxCombo) setMaxCombo(next);
      return next;
    });

    setTimeout(() => {
      spawnNextWord();
    }, 300);
  };

  const handleGameOver = () => {
    clearInterval(fallIntervalRef.current);
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
              <span>RƠI TỰ DO</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-fuchsia-300 border border-slate-700">
                {direction === 'en-to-vi' ? '🔄 🇬🇧 ➔ 🇻🇳 Đảo Ngược' : '🇻🇳 ➔ 🇬🇧 Thuận'}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3].map(i => (
                  <Heart
                    key={i}
                    className={`w-4 h-4 transition ${
                      i <= lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>
              {combo > 1 && (
                <span className="px-2 py-0.5 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/40 text-[10px] font-cyber font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-fuchsia-400 fill-fuchsia-400 animate-pulse" />
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
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-fuchsia-400 border border-fuchsia-500/30 text-xs font-cyber font-bold flex items-center gap-1.5 transition shadow"
            >
              <Pause className="w-3.5 h-3.5" />
              <span>Tạm dừng</span>
            </button>
          )}

          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-cyber">ĐIỂM SỐ</div>
            <div className="text-base font-extrabold text-fuchsia-400 font-cyber">{score}</div>
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
              className="bg-slate-900 border-2 border-fuchsia-500/50 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 shadow-2xl"
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/40 flex items-center justify-center text-fuchsia-400">
                <Pause className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold font-cyber text-slate-100">
                  TẠM DỪNG TRÒ CHƠI
                </h3>
                <p className="text-xs text-slate-400">
                  Khối rơi đã dừng lại. Hãy chuẩn bị kỹ để bắn hạ nhé!
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleTogglePause}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-white font-black font-cyber text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Tiếp Tục Chơi</span>
                </button>

                <button
                  onClick={() => initializeGame(playMode, direction)}
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
          className="my-auto text-center p-6 sm:p-8 bg-slate-900/90 border border-fuchsia-500/30 rounded-3xl space-y-6 shadow-2xl max-w-xl mx-auto"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-fuchsia-500 to-purple-600 p-1 shadow-xl shadow-fuchsia-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-fuchsia-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 via-pink-400 to-purple-400">
              RƠI TỰ DO COLLOCATION
            </h2>
            <p className="text-xs text-slate-300">
              Bắn hạ khối rơi trước khi chạm tia laser tử thần:
            </p>
          </div>

          {/* 1. DIRECTION SWITCHER */}
          <div className="space-y-2 text-left">
            <div className="text-xs font-cyber font-bold text-slate-400 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>1. CHỌN CHIỀU LUYỆN TẬP:</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => { sounds.tick(); setDirection('vi-to-en'); }}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-1 ${
                  direction === 'vi-to-en'
                    ? 'bg-fuchsia-950 border-fuchsia-400 text-slate-100 shadow-md shadow-fuchsia-500/20 ring-1 ring-fuchsia-400/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold font-cyber text-fuchsia-300">
                  🇻🇳 ➔ 🇬🇧 Chiều Thuận
                </div>
                <div className="text-[11px] text-slate-400">
                  Khối Tiếng Việt Rơi ➔ Bắn Tiếng Anh
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
                  Khối Tiếng Anh Rơi ➔ Bắn Nghĩa Tiếng Việt
                </div>
              </button>
            </div>
          </div>

          {/* 2. Mode Selector */}
          <div className="flex justify-center gap-3 pt-1">
            <button
              onClick={() => setPlayMode('choice')}
              className={`px-4 py-2.5 rounded-xl font-cyber font-bold text-xs border transition flex items-center gap-2 ${
                playMode === 'choice'
                  ? 'bg-fuchsia-500 text-slate-950 border-fuchsia-400 shadow-md shadow-fuchsia-500/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <MousePointer className="w-4 h-4" />
              <span>Chế độ Bấm Chọn</span>
            </button>
            <button
              onClick={() => setPlayMode('typing')}
              className={`px-4 py-2.5 rounded-xl font-cyber font-bold text-xs border transition flex items-center gap-2 ${
                playMode === 'typing'
                  ? 'bg-fuchsia-500 text-slate-950 border-fuchsia-400 shadow-md shadow-fuchsia-500/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800'
              }`}
            >
              <Keyboard className="w-4 h-4" />
              <span>Chế độ Gõ Phím</span>
            </button>
          </div>

          <button
            onClick={() => initializeGame(playMode, direction)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 font-black font-cyber text-base text-slate-950 shadow-xl shadow-fuchsia-500/25 transition"
          >
            BẮT ĐẦU CHƠI NGAY ➔
          </button>
        </motion.div>
      )}

      {/* PLAYING STATE */}
      {gameState === 'playing' && currentWord && (
        <div className="space-y-3 my-auto flex-1 flex flex-col justify-between">
          <div className="relative w-full h-72 sm:h-80 bg-slate-900/80 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-inner flex flex-col justify-between">
            <div className="w-full h-1 bg-slate-800" />

            <motion.div
              style={{ top: `${fallingProgress}%` }}
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md p-4 bg-slate-950/95 border-2 border-fuchsia-500/60 rounded-2xl shadow-2xl text-center space-y-1.5 backdrop-blur-md"
            >
              {direction === 'en-to-vi' ? (
                <>
                  <div className="inline-block px-2.5 py-0.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-cyber font-bold text-[10px]">
                    🇬🇧 ENGLISH COLLOCATION
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-100 font-cyber">
                    "{currentWord.en}"
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Bắn hạ bằng nghĩa tiếng Việt!
                  </div>
                </>
              ) : (
                <>
                  <div className="inline-block px-2.5 py-0.5 rounded-lg bg-amber-950 border border-amber-500/40 text-amber-300 font-cyber font-bold text-[10px]">
                    🇻🇳 NGHĨA TIẾNG VIỆT
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-100">
                    "{currentWord.vi}"
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Bắn hạ bằng cụm từ tiếng Anh!
                  </div>
                </>
              )}
            </motion.div>

            <div className="absolute inset-x-0 bottom-0 h-3 bg-gradient-to-t from-rose-600 to-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.9)] animate-pulse" />
          </div>

          {playMode === 'choice' ? (
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {choiceOptions.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={isPaused}
                  onClick={() => handleChoiceSelect(opt)}
                  className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border-2 border-slate-800 hover:border-fuchsia-500/60 text-slate-200 text-xs sm:text-sm font-bold font-cyber transition-all shadow-md text-left flex items-center gap-2.5"
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-800 text-slate-400 flex items-center justify-center text-xs shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="truncate">{opt.text}</span>
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleTypingSubmit} className="flex gap-2 pt-1">
              <input
                type="text"
                disabled={isPaused}
                value={typedInput}
                onChange={e => setTypedInput(e.target.value)}
                placeholder={direction === 'en-to-vi' ? "Gõ nghĩa tiếng Việt..." : "Gõ cụm từ tiếng Anh..."}
                className="flex-1 bg-slate-950 border-2 border-slate-800 focus:border-fuchsia-400 rounded-2xl px-4 py-3 text-sm text-slate-100 font-cyber outline-none"
                autoFocus
              />
              <button
                type="submit"
                disabled={isPaused}
                className="px-6 py-3 rounded-2xl bg-fuchsia-500 hover:bg-fuchsia-400 text-slate-950 font-bold font-cyber text-sm transition shadow-lg"
              >
                Bắn!
              </button>
            </form>
          )}
        </div>
      )}

      {/* GAMEOVER MODAL */}
      {gameState === 'gameover' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-auto text-center p-8 bg-slate-900/95 border border-fuchsia-500/40 rounded-3xl space-y-6 shadow-2xl max-w-lg mx-auto"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-cyber text-slate-100">
              CHẠM TIA LASER RỒI! 💀
            </h3>
            <p className="text-xs text-slate-400">
              Bạn đã nỗ lực rất tốt! Cố gắng tăng tốc độ để đạt điểm cao hơn nhé.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">TỔNG ĐIỂM</div>
              <div className="text-2xl font-bold text-fuchsia-400 font-cyber">{score}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">MAX COMBO</div>
              <div className="text-2xl font-bold text-cyan-300 font-cyber">{maxCombo}x</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => initializeGame(playMode, direction)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 font-bold font-cyber text-xs sm:text-sm text-slate-950 shadow-lg transition"
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
