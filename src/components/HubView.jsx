import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Hammer,
  Zap,
  Cable,
  Car,
  CircleDot,
  UtensilsCrossed,
  Trophy,
  ChevronRight,
  Layers,
  Sparkles,
  FolderKanban,
  Plus,
  Settings2,
  Lightbulb
} from 'lucide-react';

export default function HubView({
  highScores,
  poolCount,
  hubLevel,
  onSetHubLevel,
  onSelectGame,
  onOpenDeckManager,
  onCreateNewDeckPrompt,
  decks,
  activeDeckId,
  onSelectDeck
}) {
  const level1Games = [
    {
      id: 'quiz',
      title: 'Trắc Nghiệm Đếm Giờ',
      subtitle: 'Multiple Choice Speedrun',
      desc: 'Đồng hồ đếm ngược kịch tính 5s-10s. Phản xạ chọn nhanh 1 trong 4 đáp án trước khi hết giờ (Hỗ trợ cả 2 chiều Thuận 🇻🇳➔🇬🇧 & Đảo Ngược 🇬🇧➔🇻🇳)!',
      icon: Clock,
      color: 'from-cyan-500 to-blue-600',
      borderGlow: 'hover:border-cyan-400/70 hover:shadow-cyan-500/30 border-cyan-500/30 bg-slate-900/90',
      badge: '⚡ PHẢN XẠ NHANH (FEATURED)',
      accentColor: 'text-cyan-400',
      scoreKey: 'quiz',
      scoreUnit: 'điểm',
      featured: true
    },
    {
      id: 'riddle',
      title: 'Đố Từ Flashcard Trực Diện',
      subtitle: 'Vocabulary Flashcard Quiz',
      desc: 'Thử thách phản xạ từ vựng trực quan qua nghĩa gốc 1-1. Tự do lựa chọn chế độ Bấm Chọn trắc nghiệm hoặc Gõ Phím!',
      icon: Lightbulb,
      color: 'from-amber-400 via-orange-500 to-rose-500',
      borderGlow: 'hover:border-amber-500/60 hover:shadow-amber-500/20',
      badge: '💡 Đố Từ Gọn Nhẹ',
      accentColor: 'text-amber-300',
      scoreKey: 'riddle',
      scoreUnit: 'điểm'
    },
    {
      id: 'mole',
      title: 'Đập Chuột Collocation',
      subtitle: 'Whack-a-Mole Mania',
      desc: 'Búa đập arcade kinh điển! Nhìn từ ở banner và đập ngay chú chuột mang từ tương ứng (Hỗ trợ 2 chiều Thuận / Đảo Ngược).',
      icon: Hammer,
      color: 'from-amber-500 to-rose-500',
      borderGlow: 'hover:border-amber-500/60 hover:shadow-amber-500/20',
      badge: 'Arcade vui nhộn',
      accentColor: 'text-amber-400',
      scoreKey: 'mole',
      scoreUnit: 'điểm'
    },
    {
      id: 'falling',
      title: 'Rơi Tự Do / Gõ Phím',
      subtitle: 'Falling Typer Rush',
      desc: 'Từ vựng rơi từ trên cao! Bấm chọn hoặc gõ chính xác từ trước khi chạm tia laser tử thần.',
      icon: Zap,
      color: 'from-fuchsia-500 to-purple-600',
      borderGlow: 'hover:border-fuchsia-500/60 hover:shadow-fuchsia-500/20',
      badge: 'Luyện gõ từ',
      accentColor: 'text-fuchsia-400',
      scoreKey: 'falling',
      scoreUnit: 'điểm'
    },
    {
      id: 'wire',
      title: 'Nối Dây Điện Collocation',
      subtitle: 'Cyber Wire Connect',
      desc: 'Kéo dây mạch điện từ tiếng Việt sang tiếng Anh tương ứng. Hoàn thành 5 cặp để nhận chuỗi điểm thưởng!',
      icon: Cable,
      color: 'from-emerald-500 to-teal-600',
      borderGlow: 'hover:border-emerald-500/60 hover:shadow-emerald-500/20',
      badge: 'Logic & Kết nối',
      accentColor: 'text-emerald-400',
      scoreKey: 'wire',
      scoreUnit: 'điểm'
    }
  ];

  const level2Games = [
    {
      id: 'racer',
      title: 'Đua Xe Gõ Phím (Type Racer)',
      subtitle: 'Cyber Turbo Nitro Battle',
      desc: 'Đua xe tay đôi với AI Bot! Gõ đúng từ để xe vọt ga phun lửa Nitro về đích số 1.',
      icon: Car,
      color: 'from-cyan-400 via-blue-500 to-indigo-600',
      borderGlow: 'hover:border-cyan-400/70 hover:shadow-cyan-500/30',
      badge: '🔥 LEVEL 2 - SIÊU PHẢN XẠ',
      accentColor: 'text-cyan-300',
      scoreKey: 'racer',
      scoreUnit: 'WPM'
    },
    {
      id: 'bubble',
      title: 'Bắn Bong Bóng (Bubble Shooter)',
      subtitle: 'Collocation Cannon Pop',
      desc: 'Súng laser nạp sẵn từ mục tiêu. Khóa mục tiêu và bắn vỡ đúng bong bóng từ bay lơ lửng!',
      icon: CircleDot,
      color: 'from-pink-500 via-rose-500 to-amber-500',
      borderGlow: 'hover:border-pink-500/70 hover:shadow-pink-500/30',
      badge: '🎯 LEVEL 2 - BẮN TỈA',
      accentColor: 'text-pink-300',
      scoreKey: 'bubble',
      scoreUnit: 'điểm'
    },
    {
      id: 'chef',
      title: 'Đầu Bếp Nấu Ăn (Collocation Chef)',
      subtitle: 'Recipe Master Kitchen',
      desc: 'Khách order từ vựng! Chọn và kéo thả đúng các mảnh từ vào nồi lẩu ma thuật đang sôi sùng sục.',
      icon: UtensilsCrossed,
      color: 'from-amber-400 via-orange-500 to-red-500',
      borderGlow: 'hover:border-amber-400/70 hover:shadow-amber-500/30',
      badge: '🍳 LEVEL 2 - NẤU ĂN',
      accentColor: 'text-amber-300',
      scoreKey: 'chef',
      scoreUnit: 'món'
    }
  ];

  const currentGames = hubLevel === 1 ? level1Games : level2Games;
  const activeDeck = decks.find(d => d.id === activeDeckId) || decks[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="space-y-7 my-auto py-3"
    >
      {/* Hero Title */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          <span className="font-cyber text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-400 to-amber-300">
            ARCADE ÔN COLLOCATION
          </span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
          Luyện phản xạ Collocation chuẩn xác qua 1 nghĩa tiếng Việt gọn nhẹ và các mini-game arcade 2 chiều
        </p>

        {/* DECK SELECTOR BANNER */}
        <div className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-2.5 overflow-x-auto w-full sm:w-auto">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
              <FolderKanban className="w-4 h-4" />
            </div>
            <div className="text-left shrink-0">
              <div className="text-[10px] text-slate-400 font-cyber font-bold uppercase">
                HỌC PHẦN ĐANG ÔN:
              </div>
              <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span className="text-cyan-300">{activeDeck?.name}</span>
                <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/30 text-[10px] font-cyber">
                  {poolCount} từ đang kích hoạt
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onCreateNewDeckPrompt}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-cyber shadow-md transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Tạo Học Phần</span>
            </button>

            <button
              onClick={onOpenDeckManager}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-cyber border border-slate-700 transition flex items-center justify-center gap-1.5"
            >
              <Settings2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Chọn Từ Ôn Tập</span>
            </button>
          </div>
        </div>

        {/* Level Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            onClick={() => onSetHubLevel(1)}
            className={`px-4 sm:px-5 py-2 rounded-xl font-bold font-cyber text-xs sm:text-sm transition-all flex items-center gap-2 border ${
              hubLevel === 1
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/25'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>LEVEL 1: PHẢN XẠ & ARCADE (5 Game)</span>
          </button>
          <button
            onClick={() => onSetHubLevel(2)}
            className={`px-4 sm:px-5 py-2 rounded-xl font-bold font-cyber text-xs sm:text-sm transition-all flex items-center gap-2 border ${
              hubLevel === 2
                ? 'bg-gradient-to-r from-pink-500 to-amber-400 text-slate-950 border-pink-400 shadow-lg shadow-pink-500/25'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>LEVEL 2: ĐUA XE & BẮN BÓNG (3 Game)</span>
          </button>
        </div>
      </div>

      {/* Game Cards Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 ${currentGames.length > 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-5 lg:gap-6`}>
        {currentGames.map((g, index) => {
          const IconComp = g.icon;
          const currentScore = highScores[g.scoreKey] || 0;

          return (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              onClick={() => onSelectGame(g.id)}
              className={`group cursor-pointer relative bg-slate-900/80 border border-slate-800 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-xl ${g.borderGlow} ${g.featured ? 'md:col-span-2 lg:col-span-2' : ''}`}
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${g.color} p-0.5 shadow-lg group-hover:scale-105 transition-transform`}
                    >
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                        <IconComp className={`w-6 h-6 ${g.accentColor}`} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-100 group-hover:text-amber-300 transition-colors">
                        {g.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-cyber">{g.subtitle}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-[10px] font-semibold text-slate-300">
                    {g.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
                  {g.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <span className="text-xs text-slate-400">Kỷ lục:</span>
                  <span className="text-sm font-bold text-amber-300 font-cyber">
                    {currentScore} {g.scoreUnit}
                  </span>
                </div>

                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 group-hover:bg-amber-400 text-slate-200 group-hover:text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md">
                  <span>Chơi ngay</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
