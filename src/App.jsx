import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import {
  Gamepad2,
  Volume2,
  VolumeX,
  FolderKanban,
  ArrowLeft,
  Sparkles,
  Plus
} from 'lucide-react';

// Data & Audio
import { DEFAULT_COLLOCATIONS, INITIAL_DECKS } from './data/defaultCollocations';
import { sounds } from './audio/soundEngine';

// Components
import HubView from './components/HubView';
import DeckManagerModal from './components/DeckManagerModal';

// Games Level 1 (Taboo & Phản Xạ Nhanh)
import AssociativeRiddleGame from './games/AssociativeRiddleGame';
import SpeedQuizGame from './games/SpeedQuizGame';
import WhackAMoleGame from './games/WhackAMoleGame';
import FallingTyperGame from './games/FallingTyperGame';
import WireConnectGame from './games/WireConnectGame';

// Games Level 2 (Advanced Arcade)
import TypeRacerGame from './games/TypeRacerGame';
import BubbleShooterGame from './games/BubbleShooterGame';
import CollocationChefGame from './games/CollocationChefGame';

export default function App() {
  const [activeTab, setActiveTab] = useState('hub');
  const [hubLevel, setHubLevel] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [deckModalTab, setDeckModalTab] = useState('list');

  // Decks state persisted in LocalStorage (merge with newest Unit 6 Make & Do & Tra Da intents)
  const [decks, setDecks] = useState(() => {
    try {
      const saved = localStorage.getItem('arcade_collocations_decks_v8_makedo');
      if (saved) {
        const parsed = JSON.parse(saved);
        const updatedParsed = parsed.map(deck => {
          if (deck.id === 'deck-all') {
            return {
              ...deck,
              name: 'Tất cả 108 Collocations (Đầy đủ mọi Unit)',
              items: DEFAULT_COLLOCATIONS,
              selectedIds: DEFAULT_COLLOCATIONS.map(i => i.id)
            };
          }
          return {
            ...deck,
            items: (deck.items || []).map(item => {
              const master = DEFAULT_COLLOCATIONS.find(d => d.en.toLowerCase() === item.en.toLowerCase());
              return master ? { ...item, vi: master.vi, intent: master.intent, note: master.note } : item;
            })
          };
        });

        INITIAL_DECKS.forEach(initDeck => {
          const existing = updatedParsed.find(d => d.id === initDeck.id);
          if (!existing) {
            updatedParsed.push(initDeck);
          } else if (initDeck.id !== 'deck-all') {
            existing.items = initDeck.items;
          }
        });

        return updatedParsed;
      }
      return INITIAL_DECKS;
    } catch (e) {
      return INITIAL_DECKS;
    }
  });

  const [activeDeckId, setActiveDeckId] = useState(() => {
    try {
      const savedId = localStorage.getItem('arcade_collocations_active_deck_id_v8');
      return savedId || 'deck-make-and-do';
    } catch (e) {
      return 'deck-make-and-do';
    }
  });

  // Save decks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('arcade_collocations_decks_v8_makedo', JSON.stringify(decks));
    } catch (e) {}
  }, [decks]);

  // Save active deck ID
  useEffect(() => {
    try {
      localStorage.setItem('arcade_collocations_active_deck_id', activeDeckId);
    } catch (e) {}
  }, [activeDeckId]);

  // High Scores in LocalStorage
  const [highScores, setHighScores] = useState(() => {
    try {
      const saved = localStorage.getItem('arcade_collocations_highscores');
      return saved
        ? JSON.parse(saved)
        : { riddle: 0, quiz: 0, mole: 0, falling: 0, wire: 0, racer: 0, bubble: 0, chef: 0 };
    } catch (e) {
      return { riddle: 0, quiz: 0, mole: 0, falling: 0, wire: 0, racer: 0, bubble: 0, chef: 0 };
    }
  });

  const updateHighScore = useCallback((gameKey, score) => {
    setHighScores(prev => {
      const current = prev[gameKey] || 0;
      if (score > current) {
        const next = { ...prev, [gameKey]: score };
        try {
          localStorage.setItem('arcade_collocations_highscores', JSON.stringify(next));
        } catch (e) {}
        return next;
      }
      return prev;
    });
  }, []);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.muted = next;
    if (!next) sounds.init();
  };

  // Find active deck and compute selected items
  const activeDeck = useMemo(() => {
    return decks.find(d => d.id === activeDeckId) || decks[0] || INITIAL_DECKS[0];
  }, [decks, activeDeckId]);

  const activeVocabPool = useMemo(() => {
    if (!activeDeck || !activeDeck.items) return DEFAULT_COLLOCATIONS;
    const selectedSet = new Set(activeDeck.selectedIds || []);
    const filtered = activeDeck.items.filter(item => selectedSet.has(item.id));
    return filtered.length > 0 ? filtered : activeDeck.items;
  }, [activeDeck]);

  // Deck operations
  const handleSelectDeck = (deckId) => {
    setActiveDeckId(deckId);
  };

  const handleCreateDeck = (name, desc, initialItems = []) => {
    const items = initialItems.length > 0 ? initialItems : [];
    const newDeck = {
      id: `deck-${Date.now()}`,
      name,
      desc: desc || '',
      items: items,
      selectedIds: items.map(i => i.id)
    };
    setDecks(prev => [...prev, newDeck]);
    setActiveDeckId(newDeck.id);
  };

  const handleDeleteDeck = (deckId) => {
    if (decks.length <= 1) return;
    setDecks(prev => prev.filter(d => d.id !== deckId));
    if (activeDeckId === deckId) {
      const remaining = decks.filter(d => d.id !== deckId);
      setActiveDeckId(remaining[0]?.id || 'deck-all');
    }
  };

  const handleToggleWordSelection = (deckId, wordId) => {
    setDecks(prev =>
      prev.map(d => {
        if (d.id !== deckId) return d;
        const currentSelected = d.selectedIds || [];
        const isSelected = currentSelected.includes(wordId);
        const nextSelected = isSelected
          ? currentSelected.filter(id => id !== wordId)
          : [...currentSelected, wordId];
        return { ...d, selectedIds: nextSelected };
      })
    );
  };

  const handleSelectAllWords = (deckId) => {
    setDecks(prev =>
      prev.map(d => {
        if (d.id !== deckId) return d;
        return { ...d, selectedIds: (d.items || []).map(i => i.id) };
      })
    );
  };

  const handleDeselectAllWords = (deckId) => {
    setDecks(prev =>
      prev.map(d => {
        if (d.id !== deckId) return d;
        return { ...d, selectedIds: [] };
      })
    );
  };

  const handleAddWordToDeck = (deckId, wordObj) => {
    setDecks(prev =>
      prev.map(d => {
        if (d.id !== deckId) return d;
        const updatedItems = [wordObj, ...(d.items || [])];
        const updatedSelected = [wordObj.id, ...(d.selectedIds || [])];
        return { ...d, items: updatedItems, selectedIds: updatedSelected };
      })
    );
  };

  const handleImportWordsToDeck = (deckId, wordList) => {
    setDecks(prev =>
      prev.map(d => {
        if (d.id !== deckId) return d;
        const updatedItems = [...wordList, ...(d.items || [])];
        const updatedSelected = [...wordList.map(w => w.id), ...(d.selectedIds || [])];
        return { ...d, items: updatedItems, selectedIds: updatedSelected };
      })
    );
  };

  const openDeckModalTab = (tab = 'list') => {
    setDeckModalTab(tab);
    setShowDeckModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden select-none font-sans">
      {/* Background Neon Grid & Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-1/3 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 scanlines opacity-40" />
      </div>

      {/* TOP NAVIGATION BAR */}
      <header className="relative z-20 border-b border-slate-800/80 glass-panel sticky top-0 px-4 sm:px-8 py-3.5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div
            onClick={() => setActiveTab('hub')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-pink-500 to-cyan-500 p-0.5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cyber font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-400 to-cyan-400 text-lg sm:text-xl">
                  ARCADE ÔN COLLOCATION
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold font-cyber bg-amber-950/80 text-amber-300 border border-amber-500/30 rounded-full uppercase">
                  8 Mini-Games
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Học phần: <span className="text-cyan-300 font-semibold">{activeDeck?.name}</span> ({activeVocabPool.length} từ)
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {activeTab !== 'hub' && (
              <button
                onClick={() => setActiveTab('hub')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-medium border border-slate-700 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Về Hub</span>
              </button>
            )}

            <button
              onClick={() => openDeckModalTab('create')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs sm:text-sm font-bold font-cyber transition shadow-sm"
              title="Tạo học phần từ vựng mới"
            >
              <Plus className="w-4 h-4 text-amber-400 stroke-[3]" />
              <span className="hidden sm:inline">Tạo Học Phần</span>
            </button>

            <button
              onClick={() => openDeckModalTab('list')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-900/60 to-blue-900/60 hover:from-cyan-800 hover:to-blue-800 text-cyan-300 border border-cyan-500/40 text-xs sm:text-sm font-medium transition shadow-sm"
              title="Quản lý học phần và chọn từ cần ôn"
            >
              <FolderKanban className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Chọn Từ</span>
            </button>

            <button
              onClick={toggleMute}
              className={`p-2 rounded-xl border transition ${
                isMuted
                  ? 'bg-rose-950/50 border-rose-800/60 text-rose-400'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEW CONTENT */}
      <main className="relative z-10 flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'hub' && (
            <HubView
              key="hub"
              highScores={highScores}
              poolCount={activeVocabPool.length}
              hubLevel={hubLevel}
              onSetHubLevel={setHubLevel}
              onSelectGame={game => {
                sounds.init();
                setActiveTab(game);
              }}
              onOpenDeckManager={() => openDeckModalTab('list')}
              onCreateNewDeckPrompt={() => openDeckModalTab('create')}
              decks={decks}
              activeDeckId={activeDeckId}
              onSelectDeck={handleSelectDeck}
            />
          )}

          {activeTab === 'riddle' && (
            <AssociativeRiddleGame
              key="riddle"
              pool={activeVocabPool}
              highScore={highScores.riddle || 0}
              onUpdateHighScore={score => updateHighScore('riddle', score)}
              onBackToHub={() => setActiveTab('hub')}
            />
          )}

          {activeTab === 'quiz' && (
            <SpeedQuizGame
              key="quiz"
              pool={activeVocabPool}
              highScore={highScores.quiz || 0}
              onUpdateHighScore={score => updateHighScore('quiz', score)}
              onBackToHub={() => setActiveTab('hub')}
            />
          )}

          {activeTab === 'mole' && (
            <WhackAMoleGame
              key="mole"
              pool={activeVocabPool}
              highScore={highScores.mole || 0}
              onUpdateHighScore={score => updateHighScore('mole', score)}
              onBackToHub={() => setActiveTab('hub')}
            />
          )}

          {activeTab === 'falling' && (
            <FallingTyperGame
              key="falling"
              pool={activeVocabPool}
              highScore={highScores.falling || 0}
              onUpdateHighScore={score => updateHighScore('falling', score)}
              onBackToHub={() => setActiveTab('hub')}
            />
          )}

          {activeTab === 'wire' && (
            <WireConnectGame
              key="wire"
              pool={activeVocabPool}
              highScore={highScores.wire || 0}
              onUpdateHighScore={score => updateHighScore('wire', score)}
              onBackToHub={() => setActiveTab('hub')}
            />
          )}

          {activeTab === 'racer' && (
            <TypeRacerGame
              key="racer"
              pool={activeVocabPool}
              highScore={highScores.racer || 0}
              onUpdateHighScore={score => updateHighScore('racer', score)}
              onBackToHub={() => setActiveTab('hub')}
            />
          )}

          {activeTab === 'bubble' && (
            <BubbleShooterGame
              key="bubble"
              pool={activeVocabPool}
              highScore={highScores.bubble || 0}
              onUpdateHighScore={score => updateHighScore('bubble', score)}
              onBackToHub={() => setActiveTab('hub')}
            />
          )}

          {activeTab === 'chef' && (
            <CollocationChefGame
              key="chef"
              pool={activeVocabPool}
              highScore={highScores.chef || 0}
              onUpdateHighScore={score => updateHighScore('chef', score)}
              onBackToHub={() => setActiveTab('hub')}
            />
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-800/60 py-4 text-center text-xs text-slate-400 bg-slate-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🕹️ <strong>ARCADE ÔN COLLOCATION</strong> — 8 Mini-Games Luyện Từ Vựng Nhanh & Trực Quan</span>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Luyện 2 Chiều: Thuận 🇻🇳➔🇬🇧 & Đảo Ngược 🇬🇧➔🇻🇳</span>
            <span>•</span>
            <span>Tự động lưu LocalStorage</span>
          </div>
        </div>
      </footer>

      {/* DECK MANAGER MODAL */}
      <DeckManagerModal
        show={showDeckModal}
        onClose={() => setShowDeckModal(false)}
        decks={decks}
        activeDeckId={activeDeckId}
        onSelectDeck={handleSelectDeck}
        onCreateDeck={handleCreateDeck}
        onDeleteDeck={handleDeleteDeck}
        onToggleWordSelection={handleToggleWordSelection}
        onSelectAllWords={handleSelectAllWords}
        onDeselectAllWords={handleDeselectAllWords}
        onAddWordToDeck={handleAddWordToDeck}
        onImportWordsToDeck={handleImportWordsToDeck}
        initialTab={deckModalTab}
      />
    </div>
  );
}
