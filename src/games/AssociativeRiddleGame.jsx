import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ChevronRight,
  Flame,
  Pause,
  Play,
  RotateCcw,
  Home,
  Repeat
} from 'lucide-react';
import { sounds } from '../audio/soundEngine';
import { shuffle, triggerConfetti } from '../utils/gameUtils';
import { generateForwardOptions, generateReverseOptions } from '../utils/tabooUtils';

export default function AssociativeRiddleGame({
  pool,
  highScore,
  onUpdateHighScore,
  onBackToHub
}) {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'feedback', 'victory'
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState('vi-to-en'); // 'vi-to-en' or 'en-to-vi'
  const [questionList, setQuestionList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [inputMode, setInputMode] = useState('choice'); // 'choice' or 'typing'
  const [typedAnswer, setTypedAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  const initializeGame = (gameDirection = direction) => {
    const list = shuffle([...pool]);
    setQuestionList(list);
    setDirection(gameDirection);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setTypedAnswer('');
    setSelectedOption(null);
    setIsPaused(false);
    setGameState('playing');
  };

  const handleTogglePause = () => {
    sounds.pop();
    setIsPaused(p => !p);
  };

  const currentItem = questionList[currentIndex] || pool[0];

  const choiceOptions = useMemo(() => {
    if (!currentItem) return [];
    if (direction === 'en-to-vi') {
      return generateReverseOptions(pool, currentItem, 4);
    }
    return generateForwardOptions(pool, currentItem, 4);
  }, [currentIndex, currentItem, direction, pool]);

  const handleSubmitAnswer = (answerText) => {
    if (gameState !== 'playing' || !currentItem || isPaused) return;
    const cleanAnswer = (answerText || typedAnswer).trim().toLowerCase();

    let isCorrect = false;
    if (direction === 'en-to-vi') {
      isCorrect = cleanAnswer === currentItem.vi.toLowerCase() ||
        cleanAnswer.includes(currentItem.vi.toLowerCase()) ||
        currentItem.vi.toLowerCase().includes(cleanAnswer);
    } else {
      isCorrect = cleanAnswer === currentItem.en.toLowerCase();
    }

    if (isCorrect) {
      sounds.correct();
      const baseGain = 250;
      const totalGain = baseGain + combo * 30;
      setScore(s => s + totalGain);
      setCombo(c => c + 1);
      setSelectedOption({ text: answerText || typedAnswer, isCorrect: true, gain: totalGain });
    } else {
      sounds.wrong();
      setCombo(0);
      setSelectedOption({ text: answerText || typedAnswer, isCorrect: false });
    }

    setGameState('feedback');
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 >= questionList.length) {
      triggerConfetti();
      sounds.victory();
      onUpdateHighScore(score);
      setGameState('victory');
    } else {
      setCurrentIndex(i => i + 1);
      setTypedAnswer('');
      setSelectedOption(null);
      setIsPaused(false);
      setGameState('playing');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col justify-between flex-1 py-2 select-none relative">
      {/* HEADER HUD */}
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
              <span>ĐỐ TỪ FLASHCARD</span>
              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 border border-slate-700">
                {direction === 'en-to-vi' ? '🔄 🇬🇧 ➔ 🇻🇳 Đảo Ngược' : '🇻🇳 ➔ 🇬🇧 Thuận'}
              </span>
            </div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="text-amber-400 font-cyber">
                Câu {currentIndex + 1}/{questionList.length || pool.length}
              </span>
              {combo > 1 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-cyber font-bold">
                  Combo x{combo} 🔥
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Score & Mode switcher & Pause */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setInputMode('choice')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                inputMode === 'choice' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Trắc nghiệm
            </button>
            <button
              onClick={() => setInputMode('typing')}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                inputMode === 'typing' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Gõ từ
            </button>
          </div>

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
                  Thời gian và câu đố đã tạm dừng. Bạn muốn tiếp tục không?
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleTogglePause}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black font-cyber text-sm flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Tiếp Tục Đoán</span>
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
          className="my-auto text-center p-6 sm:p-8 bg-slate-900/90 border border-amber-500/30 rounded-3xl space-y-6 shadow-2xl max-w-xl mx-auto"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-orange-600 p-1 shadow-xl shadow-amber-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Lightbulb className="w-10 h-10 text-amber-400 animate-bounce" />
            </div>
          </div>

          <div className="space-y-1 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-pink-400">
              ĐỐ TỪ FLASHCARD ({pool.length} TỪ)
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Thử thách phản xạ từ vựng qua nghĩa gốc và các câu đố trắc nghiệm hoặc gõ từ!
            </p>
          </div>

          {/* 1. DIRECTION SWITCHER */}
          <div className="space-y-2 text-left">
            <div className="text-xs font-cyber font-bold text-slate-400 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5 text-amber-400" />
              <span>CHỌN CHIỀU LUYỆN TẬP:</span>
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
                  Xem Tiếng Việt ➔ Đoán Tiếng Anh
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
                  Xem Tiếng Anh ➔ Đoán Nghĩa Gốc
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={() => initializeGame(direction)}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 hover:from-amber-300 hover:to-orange-400 font-black font-cyber text-base text-slate-950 shadow-xl shadow-amber-500/25 transition"
          >
            BẮT ĐẦU ĐOÁN TỪ ({pool.length} TỪ) ➔
          </button>
        </motion.div>
      )}

      {/* PLAYING & FEEDBACK */}
      {(gameState === 'playing' || gameState === 'feedback') && (
        <div className="space-y-4 my-auto">
          {/* QUESTION CARD */}
          <div className="p-6 sm:p-8 bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl shadow-2xl space-y-3 text-center">
            <div className="inline-block px-3 py-1 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 font-cyber font-bold text-xs">
              {direction === 'en-to-vi' ? '🇬🇧 ENGLISH COLLOCATION' : '🇻🇳 CÁCH NÓI TRÀ ĐÁ / DÂN DÃ'}
            </div>

            <div className="text-2xl sm:text-4xl font-black text-slate-100 py-1">
              "{direction === 'en-to-vi' ? currentItem.en : currentItem.vi}"
            </div>

            {currentItem.intent && (
              <div className="text-xs text-amber-300/90 font-medium bg-amber-950/50 border border-amber-500/30 rounded-xl px-3.5 py-1.5 inline-block">
                🎯 Ý đồ người Việt: <em>{currentItem.intent}</em>
              </div>
            )}

            {currentItem.category && (
              <div className="text-xs text-slate-400 italic">
                Chủ đề: {currentItem.category}
              </div>
            )}
          </div>

          {/* INPUT AREA: CHOICE OR TYPING */}
          {inputMode === 'choice' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {choiceOptions.map((opt, idx) => {
                let btnStyle = 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-amber-500/60 hover:bg-slate-850';

                if (gameState === 'feedback') {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/20';
                  } else if (selectedOption?.text === opt.text) {
                    btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
                  } else {
                    btnStyle = 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-40';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={gameState === 'feedback' || isPaused}
                    onClick={() => handleSubmitAnswer(opt.text)}
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
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (typedAnswer.trim() && !isPaused) handleSubmitAnswer(typedAnswer);
              }}
              className="space-y-3"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  disabled={gameState === 'feedback' || isPaused}
                  value={typedAnswer}
                  onChange={e => setTypedAnswer(e.target.value)}
                  placeholder={direction === 'en-to-vi' ? "Gõ nghĩa tiếng Việt..." : "Gõ cụm từ tiếng Anh..."}
                  className="flex-1 bg-slate-950 border-2 border-slate-800 focus:border-amber-400 rounded-2xl px-4 py-3.5 text-base text-slate-100 font-cyber outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!typedAnswer.trim() || gameState === 'feedback' || isPaused}
                  className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-cyber text-sm transition shadow-lg"
                >
                  Đoán!
                </button>
              </div>
            </form>
          )}

          {/* FEEDBACK DRAWER */}
          {gameState === 'feedback' && selectedOption && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 sm:p-5 rounded-2xl border-2 shadow-2xl backdrop-blur-md space-y-2 ${
                selectedOption.isCorrect
                  ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'
                  : 'bg-rose-950/90 border-rose-500/50 text-rose-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm sm:text-base font-cyber flex items-center gap-2">
                  {selectedOption.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>ĐOÁN CHÍNH XÁC! (+{selectedOption.gain} điểm)</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>CHƯA CHÍNH XÁC RỒI!</span>
                    </>
                  )}
                </div>

                <button
                  onClick={handleNextQuestion}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-extrabold text-xs sm:text-sm font-cyber shadow-lg transition flex items-center gap-1.5"
                >
                  <span>{currentIndex + 1 >= questionList.length ? 'Xem Kết Quả' : 'Câu Tiếp Theo'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs sm:text-sm pt-1 space-y-1">
                <div>
                  Đáp án chuẩn: <strong className="text-amber-300 font-cyber text-sm">{currentItem.en}</strong> = <span className="text-emerald-300 font-bold">{currentItem.vi}</span>
                </div>
                {currentItem.note && (
                  <div className="text-[11px] opacity-85 italic">
                    💡 {currentItem.note}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* VICTORY MODAL */}
      {gameState === 'victory' && (
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
              HOÀN THÀNH XUẤT SẮC! 🎉
            </h3>
            <p className="text-xs text-slate-400">
              Bạn đã hoàn thành toàn bộ {questionList.length} câu hỏi từ vựng!
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-around">
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">TỔNG ĐIỂM</div>
              <div className="text-2xl font-bold text-amber-300 font-cyber">{score}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">KỶ LỤC CŨ</div>
              <div className="text-2xl font-bold text-cyan-300 font-cyber">{highScore}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => initializeGame(direction)}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 font-bold font-cyber text-xs sm:text-sm text-slate-950 shadow-lg transition"
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
