import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Timer,
  Trophy,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MessageSquare,
  Target
} from 'lucide-react';
import { sounds } from '../audio/soundEngine';
import { shuffle, triggerConfetti } from '../utils/gameUtils';
import { BUILTIN_SCENARIOS, generateDynamicScenario } from '../data/situationalScenarios';

export default function SituationalReflexGame({
  pool,
  highScore,
  onUpdateHighScore,
  onBackToHub
}) {
  const [gameState, setGameState] = useState('ready'); // 'ready', 'playing', 'feedback', 'gameover', 'victory'
  const [scenarios, setScenarios] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [history, setHistory] = useState([]);

  const timerRef = useRef(null);

  // Initialize Scenarios from pool or built-in bank
  const initializeGame = () => {
    let list = [];

    const poolEnSet = new Set(pool.map(p => p.en.toLowerCase()));
    const matchingBuiltin = BUILTIN_SCENARIOS.filter(s =>
      poolEnSet.has(s.collocation.toLowerCase())
    );

    if (matchingBuiltin.length >= 5) {
      list = [...matchingBuiltin];
    } else {
      list = [...BUILTIN_SCENARIOS];
      pool.forEach(item => {
        if (!list.some(s => s.collocation.toLowerCase() === item.en.toLowerCase())) {
          list.push(generateDynamicScenario(item));
        }
      });
    }

    const shuffled = shuffle(list).slice(0, 15);
    setScenarios(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setLives(3);
    setTimeLeft(10);
    setSelectedOption(null);
    setFeedbackData(null);
    setHistory([]);
    setGameState('playing');
  };

  const currentScenario = scenarios[currentIndex] || BUILTIN_SCENARIOS[0];

  // Shuffled options for current scenario
  const currentOptions = useMemo(() => {
    if (!currentScenario || !currentScenario.options) return [];
    return shuffle(currentScenario.options);
  }, [currentIndex, currentScenario]);

  // 10s Timer & Heartbeat Sound
  useEffect(() => {
    if (gameState !== 'playing') {
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

        // Heartbeat Web Audio API sound effect
        if (prev <= 4) {
          sounds.urgentTick();
          sounds.heartbeat();
        } else {
          sounds.heartbeat();
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [gameState, currentIndex]);

  const handleTimeOut = () => {
    sounds.wrong();
    const nextLives = lives - 1;
    setLives(nextLives);
    setCombo(0);

    const timeoutFeedback = {
      type: 'timeout',
      title: 'Hết thời gian phản xạ! ⏰',
      npcMood: 'disappointed',
      feedback: 'Bạn đã ngập ngừng quá lâu khiến cuộc hội thoại bị gián đoạn và bỏ lỡ thời điểm vàng để đạt mục tiêu.',
      explanation: currentScenario.explanation
    };

    setFeedbackData(timeoutFeedback);
    setSelectedOption({ id: 'timeout', type: 'timeout' });
    setGameState('feedback');

    setHistory(prev => [
      ...prev,
      {
        scenario: currentScenario,
        userOption: null,
        result: 'timeout'
      }
    ]);

    if (nextLives <= 0) {
      setTimeout(() => setGameState('gameover'), 2200);
    }
  };

  const handleSelectOption = (option) => {
    if (gameState !== 'playing') return;
    clearInterval(timerRef.current);
    setSelectedOption(option);

    const isCorrect = option.type === 'correct';
    const isConfused = option.type === 'wrong_collocation_right_intent';
    const isUpset = option.type === 'right_collocation_wrong_intent';

    let feedbackInfo = {
      type: option.type,
      userText: option.text,
      feedback: option.feedback,
      explanation: currentScenario.explanation
    };

    if (isCorrect) {
      sounds.correct();
      const addedScore = 100 + combo * 25 + Math.round(timeLeft * 10);
      setScore(s => s + addedScore);
      setCombo(c => c + 1);
      feedbackInfo.title = 'CHÍNH XÁC XUẤT SẮC! 🌟';
      feedbackInfo.npcMood = 'happy';
      feedbackInfo.icon = CheckCircle2;
      feedbackInfo.color = 'text-emerald-400 border-emerald-500/50 bg-emerald-950/80';
    } else if (isConfused) {
      sounds.confused();
      const nextLives = lives - 1;
      setLives(nextLives);
      setCombo(0);
      feedbackInfo.title = 'ĐÚNG Ý ĐỊNH NHƯNG SAI COLLOCATION 😅';
      feedbackInfo.npcMood = 'confused';
      feedbackInfo.icon = AlertTriangle;
      feedbackInfo.color = 'text-amber-400 border-amber-500/50 bg-amber-950/80';
      if (nextLives <= 0) setTimeout(() => setGameState('gameover'), 2400);
    } else if (isUpset) {
      sounds.upset();
      const nextLives = lives - 1;
      setLives(nextLives);
      setCombo(0);
      feedbackInfo.title = 'ĐÚNG COLLOCATION NHƯNG SAI Ý ĐỊNH / GÂY GIẬN 😠';
      feedbackInfo.npcMood = 'upset';
      feedbackInfo.icon = XCircle;
      feedbackInfo.color = 'text-rose-400 border-rose-500/50 bg-rose-950/80';
      if (nextLives <= 0) setTimeout(() => setGameState('gameover'), 2400);
    } else {
      sounds.wrong();
      const nextLives = lives - 1;
      setLives(nextLives);
      setCombo(0);
      feedbackInfo.title = 'LỰA CHỌN LẠC ĐỀ HOÀN TOÀN ❌';
      feedbackInfo.npcMood = 'angry';
      feedbackInfo.icon = XCircle;
      feedbackInfo.color = 'text-rose-400 border-rose-500/50 bg-rose-950/80';
      if (nextLives <= 0) setTimeout(() => setGameState('gameover'), 2400);
    }

    setFeedbackData(feedbackInfo);
    setGameState('feedback');

    setHistory(prev => [
      ...prev,
      {
        scenario: currentScenario,
        userOption: option,
        result: option.type
      }
    ]);
  };

  const handleNextScenario = () => {
    if (lives <= 0) {
      setGameState('gameover');
      return;
    }

    if (currentIndex + 1 >= scenarios.length) {
      triggerConfetti();
      sounds.victory();
      onUpdateHighScore(score);
      setGameState('victory');
    } else {
      setCurrentIndex(i => i + 1);
      setTimeLeft(10);
      setSelectedOption(null);
      setFeedbackData(null);
      setGameState('playing');
    }
  };

  const getNPCVisual = () => {
    const npc = currentScenario.npc;
    let moodEmoji = '💬';
    if (feedbackData) {
      if (feedbackData.npcMood === 'happy') moodEmoji = '🥰';
      if (feedbackData.npcMood === 'confused') moodEmoji = '🤨';
      if (feedbackData.npcMood === 'upset' || feedbackData.npcMood === 'angry') moodEmoji = '😤';
      if (feedbackData.npcMood === 'disappointed') moodEmoji = '🤦';
    }

    return (
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 border-2 border-indigo-500/40 flex items-center justify-center text-3xl sm:text-4xl shadow-xl">
          {npc.avatar}
        </div>
        <div className="absolute -bottom-2 -right-2 text-xl bg-slate-900 border border-slate-700 rounded-full p-1 shadow-md">
          {moodEmoji}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col justify-between flex-1 py-2 select-none">
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
            <div className="text-[10px] text-slate-400 font-cyber font-bold uppercase">
              PHẢN XẠ TÌNH HUỐNG THEO Ý ĐỊNH
            </div>
            <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="text-cyan-400 font-cyber">Tình huống {currentIndex + 1}/{scenarios.length || 15}</span>
              {combo > 1 && (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-cyber font-bold animate-bounce">
                  Combo x{combo} 🔥
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Lives & Score */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3].map(i => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-all ${
                  i <= lives
                    ? 'text-rose-500 fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                    : 'text-slate-700 fill-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-cyber">ĐIỂM SỐ</div>
            <div className="text-base font-extrabold text-amber-300 font-cyber">
              {score}
            </div>
          </div>
        </div>
      </div>

      {/* READY / START SCREEN */}
      {gameState === 'ready' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-auto text-center p-8 bg-slate-900/90 border border-indigo-500/30 rounded-3xl space-y-6 shadow-2xl"
        >
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 p-1 shadow-xl shadow-indigo-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Target className="w-10 h-10 text-cyan-400 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-cyber text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-fuchsia-400">
              INTENT-BASED SITUATIONAL REFLEX
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Bạn không chỉ dịch từ thuần túy, mà sẽ <strong>đóng vai đối thoại xã hội</strong> để đạt được một <strong>Ý ĐỊNH (Intent)</strong> cụ thể khi NPC giao tiếp.
            </p>
          </div>

          {/* 3 Feedback Rules Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-2xl mx-auto text-xs">
            <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl space-y-1">
              <div className="font-bold text-emerald-300 font-cyber flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> 1. CHÍNH XÁC
              </div>
              <p className="text-[11px] text-slate-400">Đúng cả Collocation chuẩn lẫn đạt mục tiêu ý định.</p>
            </div>

            <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-2xl space-y-1">
              <div className="font-bold text-amber-300 font-cyber flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> 2. CONFUSED 😅
              </div>
              <p className="text-[11px] text-slate-400">Đúng ý tốt muốn nói nhưng dùng sai Collocation.</p>
            </div>

            <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-2xl space-y-1">
              <div className="font-bold text-rose-300 font-cyber flex items-center gap-1.5">
                <XCircle className="w-4 h-4" /> 3. UPSET 😠
              </div>
              <p className="text-[11px] text-slate-400">Dùng đúng từ nhưng sai mục tiêu, gây mất lòng NPC.</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={initializeGame}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 font-extrabold font-cyber text-sm text-slate-950 shadow-xl shadow-cyan-500/25 transition"
            >
              BẮT ĐẦU CHƠI NGAY (15 KỊCH BẢN)
            </button>
          </div>
        </motion.div>
      )}

      {/* PLAYING & FEEDBACK STATES */}
      {(gameState === 'playing' || gameState === 'feedback') && (
        <div className="space-y-4 my-auto">
          {/* 1. INTENT BANNER ON TOP */}
          <motion.div
            key={currentScenario.id + '-intent'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 sm:p-4 bg-gradient-to-r from-cyan-950/80 via-indigo-950/80 to-purple-950/80 border-2 border-cyan-500/40 rounded-2xl shadow-xl flex items-center justify-between gap-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-xl shrink-0 shadow-md">
                {currentScenario.intent?.icon || '🎯'}
              </div>
              <div>
                <div className="text-[10px] text-cyan-300 font-cyber font-bold uppercase tracking-wider">
                  {currentScenario.intent?.label || 'MỤC TIÊU CỦA BẠN (INTENT):'}
                </div>
                <div className="text-sm sm:text-base font-extrabold text-slate-100">
                  {currentScenario.intent?.text}
                </div>
              </div>
            </div>

            {/* Countdown timer badge */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-cyber font-bold text-xs sm:text-sm shrink-0 transition-all ${
                timeLeft <= 3
                  ? 'bg-rose-950 text-rose-300 border-rose-500 animate-pulse shadow-lg shadow-rose-500/40'
                  : 'bg-slate-900 text-cyan-300 border-cyan-500/30'
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>{timeLeft}s</span>
            </div>
          </motion.div>

          {/* Time Progress Bar */}
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: `${(timeLeft / 10) * 100}%` }}
              transition={{ duration: 1, ease: 'linear' }}
              className={`h-full ${
                timeLeft <= 3
                  ? 'bg-gradient-to-r from-rose-500 to-red-600'
                  : 'bg-gradient-to-r from-cyan-400 to-indigo-500'
              }`}
            />
          </div>

          {/* 2. NPC CARD IN MIDDLE */}
          <motion.div
            key={currentScenario.id + '-npc'}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-5 sm:p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative overflow-hidden"
          >
            {getNPCVisual()}

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-slate-200 text-sm font-cyber flex items-center justify-center sm:justify-start gap-2">
                  <span>{currentScenario.npc.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-sans">
                    {currentScenario.npc.mood}
                  </span>
                </span>
                <span className="text-xs text-slate-400 italic">
                  "{currentScenario.npc.action}"
                </span>
              </div>

              {/* English Stimulus Speech Bubble */}
              <div className="relative p-4 sm:p-5 bg-slate-950/90 border border-indigo-500/40 rounded-2xl text-slate-100 text-sm sm:text-base font-medium leading-relaxed shadow-inner">
                <div className="text-cyan-300 text-xs font-cyber mb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" /> LỜI THOẠI NPC:
                </div>
                "{currentScenario.npc.line}"
              </div>
            </div>
          </motion.div>

          {/* 3. 4 ENGLISH RESPONSE BUTTONS AT BOTTOM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {currentOptions.map((opt, idx) => {
              const isSelected = selectedOption?.id === opt.id;
              let btnStyle = 'bg-slate-900/90 border-slate-800 text-slate-200 hover:border-cyan-500/60 hover:bg-slate-850';

              if (gameState === 'feedback') {
                if (opt.type === 'correct') {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/20';
                } else if (isSelected && opt.type === 'wrong_collocation_right_intent') {
                  btnStyle = 'bg-amber-950/80 border-amber-500 text-amber-200 shadow-lg shadow-amber-500/20';
                } else if (isSelected && opt.type === 'right_collocation_wrong_intent') {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-lg shadow-rose-500/20';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                } else {
                  btnStyle = 'bg-slate-950/50 border-slate-900 text-slate-600 opacity-40';
                }
              }

              return (
                <button
                  key={opt.id || idx}
                  disabled={gameState === 'feedback'}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 shadow-md ${btnStyle}`}
                >
                  <span className="w-6 h-6 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 flex items-center justify-center text-xs font-cyber font-bold shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-xs sm:text-sm font-medium leading-snug">
                    {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {/* FEEDBACK BOTTOM DRAWER */}
          {gameState === 'feedback' && feedbackData && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 sm:p-5 rounded-2xl border-2 shadow-2xl backdrop-blur-md space-y-2 ${feedbackData.color || 'bg-slate-900 border-slate-700'}`}
            >
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm sm:text-base font-cyber flex items-center gap-2">
                  <span>{feedbackData.title}</span>
                </div>
                <button
                  onClick={handleNextScenario}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-extrabold text-xs sm:text-sm font-cyber shadow-lg transition"
                >
                  {currentIndex + 1 >= scenarios.length ? 'Xem Kết Quả' : 'Tình Huống Tiếp Theo ➔'}
                </button>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed opacity-95">
                {feedbackData.feedback}
              </p>

              {feedbackData.explanation && (
                <div className="text-[11px] text-slate-300 bg-black/40 p-2.5 rounded-xl border border-white/10 italic">
                  💡 <strong>Ghi chú ngữ pháp:</strong> {feedbackData.explanation}
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* GAMEOVER / VICTORY MODAL */}
      {(gameState === 'gameover' || gameState === 'victory') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="my-auto text-center p-6 sm:p-8 bg-slate-900/95 border border-cyan-500/40 rounded-3xl space-y-6 shadow-2xl max-w-xl mx-auto"
        >
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-cyber text-slate-100">
              {gameState === 'victory' ? 'CHIẾN THẮNG XUẤT SẮC! 🎉' : 'HẾT MẠNG RỒI! 💀'}
            </h3>
            <p className="text-xs text-slate-400">
              {gameState === 'victory'
                ? 'Bạn đã hoàn thành xuất sắc 15 tình huống phản xạ theo ý định!'
                : 'Bạn đã mất hết 3 mạng. Hãy luyện tập thêm để phản xạ tự nhiên hơn.'}
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 flex justify-around">
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">TỔNG ĐIỂM</div>
              <div className="text-xl font-bold text-amber-300 font-cyber">{score}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-cyber">TÌNH HUỐNG QUA</div>
              <div className="text-xl font-bold text-cyan-300 font-cyber">{history.filter(h => h.result === 'correct').length}/{scenarios.length}</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={initializeGame}
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
