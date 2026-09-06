import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Timer,
  Trophy,
  Flame,
  RotateCcw,
  ArrowLeft,
  Pause,
  Play,
  Home,
  Repeat
} from 'lucide-react';
import { sounds } from '../audio/soundEngine';
import { triggerConfetti, triggerWrongEffect } from '../utils/gameUtils';
import {
  expandPoolWithSimpleItems,
  generateForwardOptions,
  generateReverseOptions
} from '../utils/tabooUtils';

export default function SpeedQuizGame({
  pool,
  highScore,
  onUpdateHighScore,
  onBackToHub
}) {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'feedback', 'gameover'
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState('vi-to-en'); // 'vi-to-en' (Thuận) or 'en-to-vi' (Đảo ngược)
  const [questionList, setQuestionList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(7);
  const [timerDuration, setTimerDuration] = useState(7); // 5s, 7s, 10s
  const [history, setHistory] = useState([]);

  const timerRef = useRef(null);

  const initializeGame = (
    duration = timerDuration,
    gameDirection = direction
  ) => {
    setTimerDuration(duration);
    setDirection(gameDirection);
    setIsPaused(false);

    const questions = expandPoolWithSimpleItems(pool);
    setQuestionList(questions);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHistory([]);
    setSelectedOption(null);
    setGameState('playing');
    setupQuestion(0, questions, duration, gameDirection);
  };

  const setupQuestion = (
    index,
    list = questionList,
    duration = timerDuration,
    gameDirection = direction
  ) => {
    const currentItem = list[index];
    if (!currentItem) return;

    let opts = [];
    if (gameDirection === 'en-to-vi') {
      opts = generateReverseOptions(pool, currentItem, 4);
    } else {
      opts = generateForwardOptions(pool, currentItem, 4);
    }

    setOptions(opts);
    setSelectedOption(null);
    setTimeLeft(duration);
    setIsPaused(false);
    setGameState('playing');
  };

  // Timer countdown (stops if isPaused)
  useEffect(() => {
    if (gameState !== 'playing' || isPaused) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeOut();
          return 0;
        }
        if (prev <= 3) {
          sounds.urgentTick();
        } else {
          sounds.tick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState, currentIndex, isPaused]);

  const handleTogglePause = () => {
    sounds.pop();
    setIsPaused(p => !p);
  };

  const handleTimeOut = () => {
    sounds.wrong();
    triggerWrongEffect();
    setCombo(0);

    const currentItem = questionList[currentIndex];
    setHistory(prev => [
      ...prev,
      {
        item: currentItem,
        userChoice: 'Hết giờ (Time Out)',
        isCorrect: false,
        timeTaken: timerDuration
      }
    ]);

    setSelectedOption({ text: '__timeout__', isCorrect: false });
    setGameState('feedback');

    setTimeout(() => {
      moveToNext();
    }, 1500);
  };

  const handleSelectOption = (opt) => {
    if (gameState !== 'playing' || isPaused) return;
    clearInterval(timerRef.current);
    setSelectedOption(opt);

    const timeSpent = timerDuration - timeLeft;
    const isCorrect = opt.isCorrect;
    const currentItem = questionList[currentIndex];

    if (isCorrect) {
      sounds.correct();
      const speedBonus = Math.max(10, Math.round((timeLeft / timerDuration) * 50));
      const comboBonus = combo * 20;
      const pointsGained = 100 + comboBonus + speedBonus;

      setScore(s => s + pointsGained);
      setCombo(c => {
        const next = c + 1;
        if (next > maxCombo) setMaxCombo(next);
        return next;
      });
    } else {
      sounds.wrong();
      triggerWrongEffect();
      setCombo(0);
    }

    setHistory(prev => [
      ...prev,
      {
        item: currentItem,
        userChoice: opt.text,
        isCorrect,
        timeTaken: timeSpent
      }
    ]);

    setGameState('feedback');

    setTimeout(() => {
      moveToNext();
    }, 1300);
  };

  const moveToNext = () => {
    if (currentIndex + 1 >= questionList.length) {
      triggerConfetti();
      sounds.victory();
      onUpdateHighScore(score);
      setGameState('gameover');
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setupQuestion(nextIndex, questionList, timerDuration, direction);
    }
  };

  const currentItem = questionList[currentIndex];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col justify-between flex-1 py-2 select-none relative">
      {/* Header Bar */}
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
              <span>TRẮC NGHIỆM ĐẾM GIỜ</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                {direction === 'en-to-vi' ? '🔄 🇬🇧 ➔ 🇻🇳 Đảo Ngược' : '🇻🇳 ➔ 🇬🇧 Thuận'}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="text-cyan-400 font-cyber">
                Câu {currentIndex + 1}/{questionList.length || pool.length}
              </span>
              {combo > 1 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-cyber font-bold flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
                  Combo x{combo}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Digital Timer, Score & Pause Button */}
        <div className="flex items-center gap-2.5">
          {gameState === 'playing' && (
            <div
              className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 font-cyber font-extrabold text-xs sm:text-sm shadow-md transition-all ${
                timeLeft <= 2
                  ? 'bg-rose-950/90 border-rose-500 text-rose-300 ring-2 ring-rose-500/50 animate-pulse'
                  : timeLeft <= 4
                  ? 'bg-amber-950/80 border-amber-500/60 text-amber-300'
                  : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
              }`}
            >
              <Timer className={`w-4 h-4 shrink-0 ${timeLeft <= 2 ? 'text-rose-400 animate-spin' : 'text-cyan-400'}`} />
              <span className="tracking-wider">0{timeLeft}s</span>
            </div>
          )}

          {gameState === 'playing' && (
            <button
              onClick={handleTogglePause}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-cyber font-bold flex items-center gap-1.5 transition shadow"
            >
              <Pause className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tạm dừng</span>
            </button>
          )}

          <div className="text-right pl-1">
            <div className="text-[10px] text-slate-400 font-cyber">ĐIỂM</div>
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
                  Đồng hồ đã dừng lại. Bạn có thể tiếp tục hoặc chọn lại tùy ý!
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
                  onClick={() => initializeGame(timerDuration, direction)}
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
          className="my-auto text-center p-6 sm:p-8 bg-slate-900/90 border border-cyan-500/30 rounded-3xl space-y-6 shadow-2xl max-w-xl mx-auto"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 p-1 shadow-xl shadow-cyan-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Timer className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-400">
              TRẮC NGHIỆM ĐẾM GIỜ ({pool.length} TỪ)
            </h2>
            <p className="text-xs text-slate-300">
              Nhìn 1 nghĩa tiếng Việt ➔ Chọn cụm tiếng Anh tương ứng (hoặc ngược lại):
            </p>
          </div>

          {/* 1. DIRECTION SELECTOR (THUẬN 🇻🇳->🇬🇧 VS ĐẢO NGƯỢC 🇬🇧->🇻🇳) */}
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
                  Xem Tiếng Việt ➔ Chọn Tiếng Anh
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
                  Xem Tiếng Anh ➔ Chọn Tiếng Việt
                </div>
              </button>
            </div>
          </div>

          {/* 2. Duration Selector */}
          <div className="space-y-2 text-left">
            <div className="text-xs font-cyber font-bold text-slate-400">
              2. THỜI GIAN PHẢN XẠ MỖI CÂU:
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { sec: 5, label: '5 Giây (Cực nhanh)' },
                { sec: 7, label: '7 Giây (Vừa phải)' },
                { sec: 10, label: '10 Giây (Thong thả)' }
              ].map(item => (
                <button
                  key={item.sec}
                  type="button"
                  onClick={() => setTimerDuration(item.sec)}
                  className={`p-2.5 rounded-2xl font-cyber border text-center transition flex flex-col items-center justify-center ${
                    timerDuration === item.sec
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-bold">{item.sec}s</span>
                  <span className="text-[10px] opacity-80">{item.label.split('(')[1]?.replace(')', '')}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => initializeGame(timerDuration, direction)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 font-black font-cyber text-base text-slate-950 shadow-xl shadow-cyan-500/25 transition"
          >
            BẮT ĐẦU CHƠI ({pool.length} TỪ VỰNG) ➔
          </button>
        </motion.div>
      )}

      {/* PLAYING & FEEDBACK STATES */}
      {(gameState === 'playing' || gameState === 'feedback') && currentItem && (
        <div className="space-y-4 my-auto">
          {/* QUESTION CARD */}
          <motion.div
            key={currentItem.uniqueQuestionId || currentIndex}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 sm:p-8 bg-slate-900/95 border-2 border-cyan-500/40 rounded-3xl shadow-2xl space-y-4 relative overflow-hidden backdrop-blur-md text-center"
          >
            <div className="text-xs font-cyber font-bold text-slate-400 uppercase flex items-center justify-center gap-2">
              <span>CÂU HỎI {currentIndex + 1}/{questionList.length}:</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 text-[10px]">
                {direction === 'en-to-vi' ? '🇬🇧 Hãy chọn nghĩa Tiếng Việt' : '🇻🇳 Hãy chọn cụm Tiếng Anh'}
              </span>
            </div>

            {/* In Reverse Mode: Show English Prompt prominently */}
            {direction === 'en-to-vi' ? (
              <div className="py-2 space-y-2">
                <div className="inline-block px-3 py-1 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-cyber font-bold text-xs">
                  🇬🇧 ENGLISH COLLOCATION
                </div>
                <div className="text-2xl sm:text-3xl font-black font-cyber text-slate-100 tracking-wide">
                  "{currentItem.en}"
                </div>
                {currentItem.intent && (
                  <div className="text-xs text-cyan-300/90 font-medium bg-cyan-950/50 border border-cyan-500/30 rounded-xl px-3 py-1.5 inline-block">
                    🎯 Ý đồ người Việt: <em>{currentItem.intent}</em>
                  </div>
                )}
                {currentItem.category && (
                  <div className="text-xs text-slate-400 italic">
                    Chủ đề: {currentItem.category}
                  </div>
                )}
              </div>
            ) : (
              /* In Forward Mode: Show Vietnamese Meaning directly */
              <div className="py-2 space-y-2">
                <div className="inline-block px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 font-cyber font-bold text-xs">
                  🇻🇳 CÁCH NÓI TRÀ ĐÁ / DÂN DÃ
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-100">
                  "{currentItem.vi}"
                </div>
                {currentItem.intent && (
                  <div className="text-xs text-amber-300/90 font-medium bg-amber-950/50 border border-amber-500/30 rounded-xl px-3 py-1.5 inline-block">
                    🎯 Ý đồ nói: <em>{currentItem.intent}</em>
                  </div>
                )}
                {currentItem.category && (
                  <div className="text-xs text-slate-400 italic">
                    Chủ đề: {currentItem.category}
                  </div>
                )}
              </div>
            )}

            {/* Timer countdown progress bar with live seconds display */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-[11px] font-cyber font-bold">
                <span className="text-slate-400 flex items-center gap-1">
                  <Timer className={`w-3.5 h-3.5 ${timeLeft <= 2 ? 'text-rose-400 animate-spin' : 'text-cyan-400'}`} />
                  ĐỒNG HỒ ĐẾM NGƯỢC
                </span>
                <span className={`tracking-widest px-2 py-0.5 rounded-lg font-extrabold ${
                  timeLeft <= 2
                    ? 'bg-rose-950 text-rose-300 border border-rose-500/50 animate-pulse'
                    : timeLeft <= 4
                    ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                    : 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                }`}>
                  ⏳ {timeLeft}s / {timerDuration}s
                </span>
              </div>

              <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5 shadow-inner">
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / timerDuration) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                  className={`h-full rounded-full transition-all ${
                    timeLeft <= 2
                      ? 'bg-gradient-to-r from-rose-500 via-red-500 to-amber-500 shadow-lg shadow-rose-500/50'
                      : timeLeft <= 4
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                      : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500'
                  }`}
                />
              </div>
            </div>
          </motion.div>

          {/* 4 CHOICE BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {options.map((opt, idx) => {
              let btnStyle = 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-cyan-500/60 hover:bg-slate-850';

              if (gameState === 'feedback') {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/20';
                } else if (selectedOption?.text === opt.text) {
                  btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-lg shadow-rose-500/20';
                } else {
                  btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-40';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={gameState === 'feedback' || isPaused}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 shadow-md ${btnStyle}`}
                >
                  <span className="w-7 h-7 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center justify-center text-xs font-cyber font-bold shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm font-bold font-cyber">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Feedback note banner */}
          {gameState === 'feedback' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 bg-slate-900/90 border border-cyan-500/30 rounded-2xl text-center text-xs text-slate-300 space-y-1"
            >
              <div>
                Đáp án: <strong className="text-amber-300 font-cyber">{currentItem.en}</strong> = <span className="text-emerald-300 font-bold">{currentItem.vi}</span>
              </div>
              {currentItem.note && (
                <div className="text-[11px] opacity-80 italic">💡 {currentItem.note}</div>
              )}
            </motion.div>
          )}
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
              HOÀN THÀNH TOÀN BỘ BÀI THI! 🎉
            </h3>
            <p className="text-xs text-slate-400">
              {direction === 'en-to-vi' ? 'Bạn đã làm chủ chiều Đảo Ngược 🇬🇧 ➔ 🇻🇳' : 'Bạn đã hoàn thành chiều Thuận 🇻🇳 ➔ 🇬🇧'} cho tất cả {questionList.length} từ vựng!
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 grid grid-cols-3 gap-2">
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">TỔNG ĐIỂM</div>
              <div className="text-xl font-bold text-amber-300 font-cyber">{score}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">ĐÚNG</div>
              <div className="text-xl font-bold text-emerald-400 font-cyber">
                {history.filter(h => h.isCorrect).length}/{questionList.length}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">MAX COMBO</div>
              <div className="text-xl font-bold text-cyan-300 font-cyber">{maxCombo}x</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => initializeGame(timerDuration, direction)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-bold font-cyber text-xs sm:text-sm text-slate-950 shadow-lg transition"
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
