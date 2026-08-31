import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UtensilsCrossed,
  Trophy,
  Flame,
  ArrowLeft,
  RotateCcw,
  Soup,
  Pause,
  Play,
  Home,
  Repeat
} from 'lucide-react';
import { sounds } from '../audio/soundEngine';
import { shuffle, triggerConfetti, triggerWrongEffect } from '../utils/gameUtils';

export default function CollocationChefGame({
  pool,
  highScore,
  onUpdateHighScore,
  onBackToHub
}) {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'cooking', 'gameover'
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState('vi-to-en'); // 'vi-to-en' or 'en-to-vi'
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [dishesCooked, setDishesCooked] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [targetTokens, setTargetTokens] = useState([]);
  const [selectedTokensInPot, setSelectedTokensInPot] = useState([]);
  const [ingredientPantry, setIngredientPantry] = useState([]);

  const timerRef = useRef(null);

  const initializeKitchen = (gameDirection = direction) => {
    setDirection(gameDirection);
    setIsPaused(false);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setDishesCooked(0);
    setTimeLeft(40);
    setSelectedTokensInPot([]);
    setGameState('cooking');

    serveNextOrder(gameDirection);
  };

  const serveNextOrder = (gameDirection = direction) => {
    const target = pool[Math.floor(Math.random() * pool.length)];

    const tokens = gameDirection === 'en-to-vi'
      ? target.vi.trim().split(/\s+/)
      : target.en.trim().split(/\s+/);

    setCurrentOrder(target);
    setTargetTokens(tokens);
    setSelectedTokensInPot([]);

    const otherWords = shuffle(pool.filter(w => w.id !== target.id)).slice(0, 3);
    const otherTokens = otherWords.flatMap(w =>
      gameDirection === 'en-to-vi' ? w.vi.trim().split(/\s+/) : w.en.trim().split(/\s+/)
    );

    const pantry = shuffle([...tokens, ...otherTokens.slice(0, 5)]);
    setIngredientPantry(pantry.map((tok, idx) => ({ id: `${tok}-${idx}`, text: tok })));
  };

  const handleTogglePause = () => {
    sounds.pop();
    setIsPaused(p => !p);
  };

  useEffect(() => {
    if (gameState !== 'cooking' || isPaused) {
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

  const handleAddIngredient = (ingredient) => {
    if (gameState !== 'cooking' || isPaused) return;

    sounds.pop();
    const nextPot = [...selectedTokensInPot, ingredient];
    setSelectedTokensInPot(nextPot);
    setIngredientPantry(prev => prev.filter(ing => ing.id !== ingredient.id));

    if (nextPot.length === targetTokens.length) {
      checkRecipeMatch(nextPot);
    }
  };

  const handleRemoveFromPot = (ingredient) => {
    if (isPaused) return;
    sounds.pop();
    setSelectedTokensInPot(prev => prev.filter(ing => ing.id !== ingredient.id));
    setIngredientPantry(prev => [...prev, ingredient]);
  };

  const checkRecipeMatch = (pot) => {
    const cookedPhrase = pot.map(p => p.text).join(' ').toLowerCase();
    const targetPhrase = targetTokens.join(' ').toLowerCase();

    if (cookedPhrase === targetPhrase) {
      sounds.kitchenBoil();
      sounds.correct();

      const points = 120 + combo * 30;
      setScore(s => s + points);
      setDishesCooked(d => d + 1);
      setCombo(c => {
        const next = c + 1;
        if (next > maxCombo) setMaxCombo(next);
        return next;
      });

      setTimeout(() => {
        serveNextOrder(direction);
      }, 350);
    } else {
      sounds.wrong();
      triggerWrongEffect();
      setCombo(0);

      setTimeout(() => {
        setIngredientPantry(prev => [...prev, ...pot]);
        setSelectedTokensInPot([]);
      }, 400);
    }
  };

  const handleGameOver = () => {
    clearInterval(timerRef.current);
    triggerConfetti();
    sounds.victory();
    onUpdateHighScore(dishesCooked);
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
              <span>ĐẦU BẾP NẤU ĂN</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-slate-700">
                {direction === 'en-to-vi' ? '🔄 🇬🇧 ➔ 🇻🇳 Đảo Ngược' : '🇻🇳 ➔ 🇬🇧 Thuận'}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className={`font-cyber ${timeLeft <= 5 ? 'text-rose-400 animate-pulse' : 'text-amber-400'}`}>
                ⏱️ {timeLeft}s
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 font-cyber">
                🍲 {dishesCooked} món
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
          {gameState === 'cooking' && (
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
                  TẠM DỪNG GIAN BẾP
                </h3>
                <p className="text-xs text-slate-400">
                  Nồi lẩu và order đã dừng lại. Sẵn sàng tiếp tục nấu nướng chưa?
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleTogglePause}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black font-cyber text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Tiếp Tục Nấu</span>
                </button>

                <button
                  onClick={() => initializeKitchen(direction)}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-cyber text-xs flex items-center justify-center gap-2 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Nấu Lại Từ Đầu</span>
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
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 p-1 shadow-xl shadow-amber-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <UtensilsCrossed className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 animate-bounce" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-400">
              ĐẦU BẾP NẤU ĂN COLLOCATION
            </h2>
            <p className="text-xs text-slate-300">
              Ghép các mảnh từ thành cụm Collocation hoàn chỉnh:
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
                  Order Tiếng Việt ➔ Ghép Mảnh Tiếng Anh
                </div>
              </button>

              <button
                type="button"
                onClick={() => { sounds.tick(); setDirection('en-to-vi'); }}
                className={`p-3.5 rounded-2xl border text-left transition flex flex-col gap-1 ${
                  direction === 'en-to-vi'
                    ? 'bg-orange-950 border-orange-400 text-slate-100 shadow-md shadow-orange-500/20 ring-1 ring-orange-400/50'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold font-cyber text-orange-300">
                  🔄 🇬🇧 ➔ 🇻🇳 Đảo Ngược
                </div>
                <div className="text-[11px] text-slate-400">
                  Order Tiếng Anh ➔ Ghép Mảnh Tiếng Việt
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={() => initializeKitchen(direction)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-300 hover:to-orange-400 font-black font-cyber text-base text-slate-950 shadow-xl shadow-amber-500/25 transition"
          >
            BẮT ĐẦU NẤU ĂN (40 GIÂY) 🍳
          </button>
        </motion.div>
      )}

      {/* COOKING ARENA */}
      {gameState === 'cooking' && currentOrder && (
        <div className="space-y-4 my-auto">
          <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950/90 via-slate-900/95 to-orange-950/90 border-2 border-amber-500/50 rounded-3xl text-center space-y-1.5 shadow-2xl backdrop-blur-md">
            {direction === 'en-to-vi' ? (
              <>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-cyber font-bold text-xs flex items-center gap-1">
                    <Soup className="w-3.5 h-3.5" />
                    🇬🇧 ORDER TIẾNG ANH
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-100 font-cyber">
                  "{currentOrder.en}"
                </div>
                <div className="text-xs text-slate-400">
                  Cần ghép đủ <strong>{targetTokens.length} mảnh từ</strong> cho nghĩa: <strong className="text-amber-300">{currentOrder.vi}</strong>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-amber-500 text-slate-950 font-cyber font-black text-xs uppercase flex items-center gap-1">
                    <Soup className="w-3.5 h-3.5" />
                    🇻🇳 ORDER TIẾNG VIỆT
                  </span>
                </div>

                <div className="text-2xl sm:text-3xl font-black text-slate-100">
                  "{currentOrder.vi}"
                </div>

                <div className="text-xs text-slate-400">
                  Cần ghép đủ <strong>{targetTokens.length} mảnh từ tiếng Anh</strong>
                </div>
              </>
            )}
          </div>

          <div className="p-6 bg-slate-900/80 border-2 border-slate-800 rounded-3xl flex flex-col items-center justify-center min-h-[140px] shadow-inner relative overflow-hidden">
            <div className="text-xs font-cyber font-bold text-slate-400 mb-2 flex items-center gap-1.5">
              <span>🍲 NỒI LẨU ĐANG SÔI (Bấm vào từ để lấy lại ra thớt):</span>
            </div>

            {selectedTokensInPot.length === 0 ? (
              <div className="text-xs text-slate-500 italic py-4">
                Chưa có nguyên liệu nào trong nồi... Bấm các từ bên dưới để thêm vào!
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {selectedTokensInPot.map((tok) => (
                  <motion.button
                    key={tok.id}
                    initial={{ scale: 0.5, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    onClick={() => handleRemoveFromPot(tok)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black font-cyber text-sm shadow-lg hover:opacity-80 transition flex items-center gap-1.5"
                  >
                    <span>{tok.text}</span>
                    <span className="text-xs">✕</span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 sm:p-5 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-2">
            <div className="text-xs font-cyber font-bold text-slate-400 uppercase text-center">
              🔪 BÀN NGUYÊN LIỆU (CHỌN MẢNH TỪ ĐÚNG):
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {ingredientPantry.map((ing) => (
                <button
                  key={ing.id}
                  disabled={isPaused}
                  onClick={() => handleAddIngredient(ing)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border-2 border-slate-800 hover:border-amber-400 text-slate-200 hover:text-white font-extrabold font-cyber text-xs sm:text-sm transition-all shadow-md active:scale-95"
                >
                  {ing.text}
                </button>
              ))}
            </div>
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
              HẾT GIỜ BẾP TRƯỞNG! 🍳
            </h3>
            <p className="text-xs text-slate-400">
              Tuyệt vời! Bạn đã hoàn thành {dishesCooked} món ăn thơm ngon chuẩn vị.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">MÓN HOÀN THÀNH</div>
              <div className="text-2xl font-bold text-amber-300 font-cyber">{dishesCooked} món</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">TỔNG ĐIỂM</div>
              <div className="text-2xl font-bold text-cyan-300 font-cyber">{score}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => initializeKitchen(direction)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-300 hover:to-orange-400 font-bold font-cyber text-xs sm:text-sm text-slate-950 shadow-lg transition"
            >
              Nấu Lại
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
