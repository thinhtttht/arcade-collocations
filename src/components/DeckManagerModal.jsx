import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban,
  XCircle,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Search,
  BookOpen,
  Check,
  AlertCircle,
  Sparkles,
  Upload,
  Copy,
  FileText,
  HelpCircle,
  Layers
} from 'lucide-react';
import { DEFAULT_COLLOCATIONS } from '../data/defaultCollocations';

export default function DeckManagerModal({
  show,
  onClose,
  decks,
  activeDeckId,
  onSelectDeck,
  onCreateDeck,
  onDeleteDeck,
  onToggleWordSelection,
  onSelectAllWords,
  onDeselectAllWords,
  onAddWordToDeck,
  onImportWordsToDeck,
  initialTab = 'list'
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'list', 'create', 'add_word', 'import_bulk'
  const [newDeckName, setNewDeckName] = useState('');
  const [newDeckDesc, setNewDeckDesc] = useState('');
  const [newDeckSource, setNewDeckSource] = useState('empty'); // 'empty', 'default_38', 'paste_now'
  const [newDeckPasteText, setNewDeckPasteText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Single word addition
  const [wordVi, setWordVi] = useState('');
  const [wordEn, setWordEn] = useState('');
  const [wordWrongs, setWordWrongs] = useState('');
  const [wordNote, setWordNote] = useState('');
  const [wordFunc, setWordFunc] = useState('');
  const [wordVisual, setWordVisual] = useState('');
  const [wordSit, setWordSit] = useState('');
  const [wordFeel, setWordFeel] = useState('');
  const [wordSound, setWordSound] = useState('');
  const [wordIntent, setWordIntent] = useState('');

  // Bulk import
  const [bulkText, setBulkText] = useState('');
  const [importStatus, setImportStatus] = useState(null);
  const [sampleFormatType, setSampleFormatType] = useState('simple'); // 'simple', 'taboo_text', 'json'

  const activeDeck = decks.find(d => d.id === activeDeckId) || decks[0];

  // Filtered words in active deck
  const filteredWords = (activeDeck?.items || []).filter(item => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.vi.toLowerCase().includes(q) ||
      item.en.toLowerCase().includes(q) ||
      (item.note && item.note.toLowerCase().includes(q))
    );
  });

  const selectedCount = (activeDeck?.selectedIds || []).length;
  const totalCount = (activeDeck?.items || []).length;

  // Smart Parser for Bulk Text / JSON
  const parseRawInput = (rawText) => {
    const text = rawText.trim();
    if (!text) return [];

    // 1. JSON Array format
    if (text.startsWith('[') && text.endsWith(']')) {
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => {
            const vi = item.vi || item.vietnamese || 'Từ chưa đặt tên';
            const en = item.en || item.english || 'N/A';
            let wrong = Array.isArray(item.wrong) && item.wrong.length >= 1 ? item.wrong : [`make ${en}`, `do ${en}`, `take ${en}`];
            while (wrong.length < 3) wrong.push(`wrong option ${wrong.length + 1}`);

            let tabooClues = [];
            if (Array.isArray(item.tabooClues) && item.tabooClues.length > 0) {
              tabooClues = item.tabooClues;
            } else {
              tabooClues = [
                { tag: 'Chức năng', text: `Hành động liên quan đến "${vi}"`, en: `perform ${en}` },
                { tag: 'Tình huống', text: `Tình huống: ${vi}`, en: `daily situation` },
                { tag: 'Cảm giác', text: `Tự nhiên chuẩn bản xứ`, en: `native phrasing` },
                { tag: 'Intent', text: `Mục đích: ${vi}`, en: `express properly` }
              ];
            }

            return {
              id: `word-${Date.now()}-${idx}`,
              vi,
              en,
              wrong: wrong.slice(0, 3),
              note: item.note || '',
              tabooClues
            };
          });
        }
      } catch (e) {}
    }

    // 2. Block format (vi: ... \n en: ... \n Chức năng: ... etc)
    if (text.includes('vi:') || text.includes('en:') || text.includes('Chức năng:')) {
      const blocks = text.split(/\n\s*\n/).filter(b => b.trim().length > 0);
      const parsedBlocks = [];

      blocks.forEach((block, bIdx) => {
        const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
        let vi = '';
        let en = '';
        let note = '';
        let wrong = [];
        let tabooClues = [];

        lines.forEach(line => {
          if (line.toLowerCase().startsWith('vi:')) {
            vi = line.substring(3).trim();
          } else if (line.toLowerCase().startsWith('en:')) {
            en = line.substring(3).trim();
          } else if (line.toLowerCase().startsWith('note:')) {
            note = line.substring(5).trim();
          } else if (line.toLowerCase().startsWith('wrong:')) {
            wrong = line.substring(6).split(',').map(w => w.trim()).filter(Boolean);
          } else {
            // Check for Taboo tag lines: "Chức năng: text (en)"
            const colonIdx = line.indexOf(':');
            if (colonIdx > 0) {
              const tag = line.substring(0, colonIdx).trim();
              const rest = line.substring(colonIdx + 1).trim();

              // Check for English inside parentheses: "Cái để rót nước (pour water)"
              const matchEn = rest.match(/\(([^)]+)\)$/);
              let clueText = rest;
              let clueEn = '';
              if (matchEn) {
                clueEn = matchEn[1].trim();
                clueText = rest.replace(/\(([^)]+)\)$/, '').trim();
              }

              if (['chức năng', 'hình ảnh', 'màu sắc', 'tình huống', 'cảm giác', 'âm thanh', 'intent', 'mục tiêu'].includes(tag.toLowerCase())) {
                tabooClues.push({
                  tag: tag.charAt(0).toUpperCase() + tag.slice(1),
                  text: clueText,
                  en: clueEn
                });
              }
            }
          }
        });

        if (vi && en) {
          if (wrong.length === 0) wrong = [`make ${en}`, `do ${en}`, `take ${en}`];
          while (wrong.length < 3) wrong.push(`wrong ${wrong.length + 1}`);

          if (tabooClues.length === 0) {
            tabooClues = [
              { tag: 'Chức năng', text: `Khái niệm liên quan đến "${vi}"`, en: `perform ${en}` },
              { tag: 'Tình huống', text: `Tình huống: ${vi}`, en: `daily situation` },
              { tag: 'Cảm giác', text: `Tự nhiên chuẩn bản xứ`, en: `native phrasing` },
              { tag: 'Intent', text: `Mục đích: ${vi}`, en: `express properly` }
            ];
          }

          parsedBlocks.push({
            id: `word-${Date.now()}-${bIdx}`,
            vi,
            en,
            wrong: wrong.slice(0, 3),
            note,
            tabooClues
          });
        }
      });

      if (parsedBlocks.length > 0) return parsedBlocks;
    }

    // 3. Line by line format: "Tiếng Việt | Tiếng Anh" or "Tiếng Việt - Tiếng Anh" or "Tiếng Việt : Tiếng Anh"
    const lines = text.split('\n').filter(l => l.trim().length > 0);
    const parsedLines = [];

    lines.forEach((line, index) => {
      let parts = [];
      if (line.includes('|')) {
        parts = line.split('|').map(p => p.trim());
      } else if (line.includes(' - ')) {
        parts = line.split(' - ').map(p => p.trim());
      } else if (line.includes(':')) {
        parts = line.split(':').map(p => p.trim());
      }

      if (parts.length >= 2) {
        const vi = parts[0];
        const en = parts[1];
        let wrong = [];
        if (parts[2]) {
          wrong = parts[2].split(',').map(w => w.trim()).filter(Boolean);
        }
        if (wrong.length === 0) {
          wrong = [`make ${en}`, `do ${en}`, `take ${en}`];
        }
        while (wrong.length < 3) {
          wrong.push(`extra wrong ${wrong.length + 1}`);
        }
        const note = parts[3] || '';

        parsedLines.push({
          id: `word-${Date.now()}-${index}`,
          vi,
          en,
          wrong: wrong.slice(0, 3),
          note,
          tabooClues: [
            { tag: 'Chức năng', text: `Hành động liên quan đến "${vi}"`, en: `perform ${en}` },
            { tag: 'Tình huống', text: `Tình huống: ${vi}`, en: `daily situation` },
            { tag: 'Cảm giác', text: `Tự nhiên chuẩn bản xứ`, en: `native phrasing` },
            { tag: 'Intent', text: `Mục đích: ${vi}`, en: `express properly` }
          ]
        });
      }
    });

    return parsedLines;
  };

  // Handle Create Deck
  const handleCreateDeckSubmit = (e) => {
    e.preventDefault();
    if (!newDeckName.trim()) return;

    let initialItems = [];

    if (newDeckSource === 'default_38') {
      initialItems = [...DEFAULT_COLLOCATIONS];
    } else if (newDeckSource === 'paste_now' && newDeckPasteText.trim()) {
      initialItems = parseRawInput(newDeckPasteText);
    }

    onCreateDeck(newDeckName.trim(), newDeckDesc.trim(), initialItems);
    setNewDeckName('');
    setNewDeckDesc('');
    setNewDeckPasteText('');
    setNewDeckSource('empty');
    setActiveTab('list');
  };

  const handleAddSingleWord = (e) => {
    e.preventDefault();
    if (!wordVi.trim() || !wordEn.trim()) return;

    let wrongs = wordWrongs.split(',').map(w => w.trim()).filter(Boolean);
    if (wrongs.length === 0) {
      wrongs = [`make ${wordEn.trim()}`, `do ${wordEn.trim()}`, `take ${wordEn.trim()}`];
    }
    while (wrongs.length < 3) {
      wrongs.push(`wrong option ${wrongs.length + 1}`);
    }

    // Build Taboo clues from optional inputs
    const tabooClues = [];
    if (wordFunc.trim()) tabooClues.push({ tag: 'Chức năng', text: wordFunc.trim(), en: '' });
    if (wordVisual.trim()) tabooClues.push({ tag: 'Hình ảnh', text: wordVisual.trim(), en: '' });
    if (wordSit.trim()) tabooClues.push({ tag: 'Tình huống', text: wordSit.trim(), en: '' });
    if (wordFeel.trim()) tabooClues.push({ tag: 'Cảm giác', text: wordFeel.trim(), en: '' });
    if (wordSound.trim()) tabooClues.push({ tag: 'Âm thanh', text: wordSound.trim(), en: '' });
    if (wordIntent.trim()) tabooClues.push({ tag: 'Intent', text: wordIntent.trim(), en: '' });

    if (tabooClues.length === 0) {
      tabooClues.push(
        { tag: 'Chức năng', text: `Hành động liên quan đến "${wordVi.trim()}"`, en: `perform ${wordEn.trim()}` },
        { tag: 'Tình huống', text: `Tình huống đời sống: ${wordVi.trim()}`, en: `daily situation` },
        { tag: 'Cảm giác', text: `Tự nhiên chuẩn bản xứ`, en: `native phrasing` },
        { tag: 'Intent', text: `Mục đích: ${wordVi.trim()}`, en: `express accurately` }
      );
    }

    const newItem = {
      id: `word-${Date.now()}`,
      vi: wordVi.trim(),
      en: wordEn.trim(),
      wrong: wrongs.slice(0, 3),
      note: wordNote.trim(),
      tabooClues
    };

    onAddWordToDeck(activeDeck.id, newItem);
    setWordVi('');
    setWordEn('');
    setWordWrongs('');
    setWordNote('');
    setWordFunc('');
    setWordVisual('');
    setWordSit('');
    setWordFeel('');
    setWordSound('');
    setWordIntent('');
    setActiveTab('list');
  };

  const handleBulkImportSubmit = () => {
    if (!bulkText.trim()) {
      setImportStatus({ type: 'error', msg: 'Vui lòng dán dữ liệu từ vựng!' });
      return;
    }

    const parsedItems = parseRawInput(bulkText);

    if (parsedItems.length === 0) {
      setImportStatus({
        type: 'error',
        msg: 'Không nhận diện được từ vựng. Vui lòng xem ví dụ mẫu bên dưới!'
      });
      return;
    }

    onImportWordsToDeck(activeDeck.id, parsedItems);
    setBulkText('');
    setImportStatus({ type: 'success', msg: `Thành công! Đã thêm ${parsedItems.length} từ vào học phần.` });
    setTimeout(() => {
      setActiveTab('list');
      setImportStatus(null);
    }, 800);
  };

  const pasteSample = (type) => {
    if (type === 'simple') {
      setBulkText(`Ấm trà cổ | ancient teapot | antique teapot, old teapot, ancient kettle | Dùng ancient teapot
Xả bồn tắm | run a bath | make a bath, open a bath, pour a bath | Dùng run a bath
Cho đi nhờ xe | give someone a lift | make someone a lift, take someone a lift | Cho đi nhờ xe`);
    } else if (type === 'taboo_text') {
      setBulkText(`vi: Ấm trà cổ
en: ancient teapot
Chức năng: Cái để rót nước (pour water into cups)
Hình ảnh: Nước màu vàng hổ phách (amber liquid)
Tình huống: Khách đến chơi nhà mới dùng (entertain guests)
Cảm giác: Nóng quá, dễ phỏng tay (burning hot)
Âm thanh: Kêu lách tách khi sôi (boiling sound)
Intent: Muốn giải khát, hàn huyên (quench thirst & chat)

vi: Xả bồn tắm
en: run a bath
Chức năng: Vặn nước đầy bồn ngâm (fill bathtub with water)
Hình ảnh: Bọt xà phòng trắng xóa (fluffy fragrant bubbles)
Tình huống: Mới đi làm về (end of stressful workday)
Cảm giác: Thư giãn toàn thân (deep muscle relaxation)
Âm thanh: Nước chảy ào ào (rushing tap water)
Intent: Xua tan mệt mỏi (indulge in self-care)`);
    } else if (type === 'json') {
      setBulkText(JSON.stringify([
        {
          vi: "Ấm trà cổ",
          en: "ancient teapot",
          wrong: ["antique teapot", "old teapot", "ancient kettle"],
          note: "Đồ gốm cổ",
          tabooClues: [
            { tag: "Chức năng", text: "Cái để rót nước", en: "pour water into cups" },
            { tag: "Hình ảnh", text: "Nước màu vàng", en: "amber liquid" },
            { tag: "Tình huống", text: "Khách đến chơi nhà", en: "entertain guests" },
            { tag: "Cảm giác", text: "Nóng quá", en: "burning hot" },
            { tag: "Âm thanh", text: "Kêu lách tách khi sôi", en: "boiling sound" },
            { tag: "Intent", text: "Muốn giải khát", en: "quench thirst" }
          ]
        }
      ], null, 2));
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-slate-900 border border-cyan-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <FolderKanban className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-lg sm:text-xl font-cyber flex items-center gap-2">
                    QUẢN LÝ & TẠO HỌC PHẦN ÔN TẬP
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tạo các bộ từ vựng riêng biệt, dán danh sách từ theo định dạng tinh gọn hoặc Taboo 6 chiều
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('list')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-cyber transition flex items-center gap-2 border ${
                  activeTab === 'list'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                <span>Danh Sách Học Phần ({decks.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('create')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-cyber transition flex items-center gap-2 border ${
                  activeTab === 'create'
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Tạo Học Phần Mới</span>
              </button>

              <button
                onClick={() => setActiveTab('import_bulk')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-cyber transition flex items-center gap-2 border ${
                  activeTab === 'import_bulk'
                    ? 'bg-fuchsia-500 text-slate-950 border-fuchsia-400 shadow-md shadow-fuchsia-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>Dán / Nhập Nhiều Từ</span>
              </button>

              <button
                onClick={() => setActiveTab('add_word')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-cyber transition flex items-center gap-2 border ${
                  activeTab === 'add_word'
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>+ Thêm 1 Từ Lẻ</span>
              </button>
            </div>

            {/* TAB CONTENT CONTAINER */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              {/* TAB 1: LIST DECKS & WORD SELECTION */}
              {activeTab === 'list' && (
                <div className="space-y-6">
                  {/* Active Deck Selector Grid */}
                  <div>
                    <label className="text-xs font-cyber font-bold text-slate-400 uppercase mb-2.5 block">
                      Chọn Học Phần Muốn Dùng Cho Game:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {decks.map(d => {
                        const isActive = d.id === activeDeckId;
                        const count = (d.items || []).length;
                        const selCount = (d.selectedIds || []).length;

                        return (
                          <div
                            key={d.id}
                            onClick={() => onSelectDeck(d.id)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-md ${
                              isActive
                                ? 'bg-cyan-950/70 border-cyan-400 shadow-cyan-500/20 ring-1 ring-cyan-400'
                                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="font-bold text-slate-100 text-sm font-cyber flex items-center gap-2">
                                <span className={isActive ? 'text-cyan-300' : 'text-slate-300'}>
                                  {d.name}
                                </span>
                              </div>
                              {isActive && (
                                <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-cyber font-black">
                                  ĐANG CHỌN
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {d.desc || 'Học phần tùy chỉnh'}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                              <span className="text-cyan-400 font-cyber font-semibold">
                                {selCount}/{count} từ kích hoạt
                              </span>

                              {decks.length > 1 && d.id !== 'deck-all' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Xác nhận xóa học phần "${d.name}"?`)) {
                                      onDeleteDeck(d.id);
                                    }
                                  }}
                                  className="p-1 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 transition"
                                  title="Xóa học phần này"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* WORDS SELECTION CHECKBOXES FOR ACTIVE DECK */}
                  <div className="bg-slate-950/90 border border-slate-800 rounded-3xl p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                      <div>
                        <h4 className="font-bold text-slate-100 text-base font-cyber flex items-center gap-2">
                          <span>Từ Vựng Trong: {activeDeck?.name}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                            {selectedCount}/{totalCount} từ được chọn
                          </span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Tích chọn các từ bạn muốn xuất hiện khi chơi các Mini-Game
                        </p>
                      </div>

                      {/* Select All / Deselect All */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectAllWords(activeDeck.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold font-cyber border border-slate-700 transition"
                        >
                          Chọn Tất Cả
                        </button>
                        <button
                          onClick={() => onDeselectAllWords(activeDeck.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold font-cyber border border-slate-700 transition"
                        >
                          Bỏ Chọn Hết
                        </button>
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm kiếm từ tiếng Việt hoặc tiếng Anh..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 focus:border-cyan-400 text-xs text-slate-200 outline-none"
                      />
                    </div>

                    {/* Words Checklist Grid */}
                    <div className="max-h-72 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {filteredWords.map((item) => {
                        const isSelected = (activeDeck.selectedIds || []).includes(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => onToggleWordSelection(activeDeck.id, item.id)}
                            className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'bg-cyan-950/40 border-cyan-500/50 text-slate-100 shadow-sm'
                                : 'bg-slate-900/50 border-slate-800/80 text-slate-500 opacity-60'
                            }`}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className={isSelected ? 'text-cyan-400' : 'text-slate-600'}>
                                {isSelected ? (
                                  <CheckSquare className="w-5 h-5 shrink-0" />
                                ) : (
                                  <Square className="w-5 h-5 shrink-0" />
                                )}
                              </div>
                              <div className="truncate">
                                <div className="text-xs font-bold text-slate-200 font-cyber truncate">
                                  {item.en}
                                </div>
                                <div className="text-[11px] text-slate-400 truncate">
                                  {item.vi}
                                </div>
                              </div>
                            </div>

                            {item.tabooClues && item.tabooClues.length > 0 && (
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-amber-300 shrink-0 font-cyber">
                                6 clues
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CREATE NEW DECK */}
              {activeTab === 'create' && (
                <form onSubmit={handleCreateDeckSubmit} className="space-y-4 max-w-xl mx-auto">
                  <div className="space-y-1 text-center">
                    <h4 className="font-bold text-slate-100 text-lg font-cyber text-amber-300">
                      TẠO HỌC PHẦN MỚI
                    </h4>
                    <p className="text-xs text-slate-400">
                      Đặt tên cho học phần và chọn nguồn từ vựng ban đầu
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-bold font-cyber text-slate-300 block mb-1.5">
                      Tên Học Phần: *
                    </label>
                    <input
                      type="text"
                      required
                      value={newDeckName}
                      onChange={e => setNewDeckName(e.target.value)}
                      placeholder="Ví dụ: 30 Collocation Du Lịch, Bài Thi THPTQG..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-2xl px-4 py-3 text-sm text-slate-100 font-cyber outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold font-cyber text-slate-300 block mb-1.5">
                      Mô Tả Học Phần (Tùy chọn):
                    </label>
                    <input
                      type="text"
                      value={newDeckDesc}
                      onChange={e => setNewDeckDesc(e.target.value)}
                      placeholder="Ví dụ: Ôn tập các cụm từ ăn điểm trong tuần này..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-2xl px-4 py-3 text-sm text-slate-100 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold font-cyber text-slate-300 block mb-1.5">
                      Nguồn Từ Vựng Khởi Tạo:
                    </label>
                    <div className="grid grid-cols-3 gap-2.5 text-xs">
                      <button
                        type="button"
                        onClick={() => setNewDeckSource('empty')}
                        className={`p-3 rounded-2xl border text-center transition font-cyber font-bold ${
                          newDeckSource === 'empty'
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        Danh sách trống
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewDeckSource('default_38')}
                        className={`p-3 rounded-2xl border text-center transition font-cyber font-bold ${
                          newDeckSource === 'default_38'
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        Sao chép 38 từ gốc
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewDeckSource('paste_now')}
                        className={`p-3 rounded-2xl border text-center transition font-cyber font-bold ${
                          newDeckSource === 'paste_now'
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        Dán từ ngay
                      </button>
                    </div>
                  </div>

                  {newDeckSource === 'paste_now' && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold font-cyber text-slate-300 block">
                        Dán danh sách từ:
                      </label>
                      <textarea
                        rows={5}
                        value={newDeckPasteText}
                        onChange={e => setNewDeckPasteText(e.target.value)}
                        placeholder="Tiếng Việt | Tiếng Anh (hoặc dán định dạng Taboo 6 chiều)"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-2xl p-3 text-xs text-slate-200 font-mono outline-none"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black font-cyber text-sm shadow-xl transition"
                  >
                    Tạo Học Phần Ngay ➔
                  </button>
                </form>
              )}

              {/* TAB 3: BULK IMPORT WITH CLEAR FORMAT GUIDE */}
              {activeTab === 'import_bulk' && (
                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="space-y-1 text-center">
                    <h4 className="font-bold text-slate-100 text-lg font-cyber text-fuchsia-400 flex items-center justify-center gap-2">
                      <Upload className="w-5 h-5" />
                      <span>DÁN / NHẬP TỪ VỰNG HÀNG LOẠT</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Đang nạp vào học phần: <strong className="text-cyan-300">{activeDeck?.name}</strong>
                    </p>
                  </div>

                  {/* Sample Format Tabs */}
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold font-cyber text-slate-300 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                        Các định dạng được hỗ trợ:
                      </span>
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => { setSampleFormatType('simple'); pasteSample('simple'); }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-cyber font-bold transition ${
                            sampleFormatType === 'simple' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          1. Dạng Đơn Giản (| hoặc -)
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSampleFormatType('taboo_text'); pasteSample('taboo_text'); }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-cyber font-bold transition ${
                            sampleFormatType === 'taboo_text' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          2. Dạng Taboo 6 Chiều
                        </button>
                        <button
                          type="button"
                          onClick={() => { setSampleFormatType('json'); pasteSample('json'); }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-cyber font-bold transition ${
                            sampleFormatType === 'json' ? 'bg-fuchsia-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          3. Dạng JSON
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bulk Textarea */}
                  <div>
                    <textarea
                      rows={8}
                      value={bulkText}
                      onChange={e => setBulkText(e.target.value)}
                      placeholder="Dán nội dung từ vựng theo một trong các định dạng ở trên..."
                      className="w-full bg-slate-950 border-2 border-slate-800 focus:border-fuchsia-400 rounded-3xl p-4 text-xs text-slate-200 font-mono outline-none leading-relaxed shadow-inner"
                    />
                  </div>

                  {/* Status Banner */}
                  {importStatus && (
                    <div className={`p-3 rounded-2xl text-xs font-cyber font-bold ${
                      importStatus.type === 'success' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                    }`}>
                      {importStatus.msg}
                    </div>
                  )}

                  <button
                    onClick={handleBulkImportSubmit}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white font-black font-cyber text-sm shadow-xl transition"
                  >
                    Nạp Từ Vựng Vào Học Phần ➔
                  </button>
                </div>
              )}

              {/* TAB 4: ADD SINGLE WORD */}
              {activeTab === 'add_word' && (
                <form onSubmit={handleAddSingleWord} className="space-y-4 max-w-xl mx-auto">
                  <div className="space-y-1 text-center">
                    <h4 className="font-bold text-slate-100 text-lg font-cyber text-emerald-400">
                      THÊM 1 TỪ VỰNG LẺ
                    </h4>
                    <p className="text-xs text-slate-400">
                      Thêm vào học phần: <strong className="text-cyan-300">{activeDeck?.name}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold font-cyber text-slate-300 block mb-1">
                        Nghĩa Tiếng Việt: *
                      </label>
                      <input
                        type="text"
                        required
                        value={wordVi}
                        onChange={e => setWordVi(e.target.value)}
                        placeholder="Ví dụ: Ấm trà cổ"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold font-cyber text-slate-300 block mb-1">
                        Collocation Tiếng Anh: *
                      </label>
                      <input
                        type="text"
                        required
                        value={wordEn}
                        onChange={e => setWordEn(e.target.value)}
                        placeholder="Ví dụ: ancient teapot"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 font-cyber outline-none"
                      />
                    </div>
                  </div>

                  {/* 6 Taboo Clues (Optional) */}
                  <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                    <div className="text-xs font-bold font-cyber text-amber-300">
                      💡 6 Manh Mối Taboo (Tùy chọn - Giúp từ xuất hiện sinh động trong game):
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <input
                        type="text"
                        value={wordFunc}
                        onChange={e => setWordFunc(e.target.value)}
                        placeholder="🛠️ Chức năng (ví dụ: Cái để rót nước)"
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-200 outline-none"
                      />
                      <input
                        type="text"
                        value={wordVisual}
                        onChange={e => setWordVisual(e.target.value)}
                        placeholder="🎨 Hình ảnh (ví dụ: Nước màu vàng)"
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-200 outline-none"
                      />
                      <input
                        type="text"
                        value={wordSit}
                        onChange={e => setWordSit(e.target.value)}
                        placeholder="📍 Tình huống (ví dụ: Khách đến chơi nhà)"
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-200 outline-none"
                      />
                      <input
                        type="text"
                        value={wordFeel}
                        onChange={e => setWordFeel(e.target.value)}
                        placeholder="✋ Cảm giác (ví dụ: Nóng quá)"
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-200 outline-none"
                      />
                      <input
                        type="text"
                        value={wordSound}
                        onChange={e => setWordSound(e.target.value)}
                        placeholder="🔊 Âm thanh (ví dụ: Kêu lách tách khi sôi)"
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-200 outline-none"
                      />
                      <input
                        type="text"
                        value={wordIntent}
                        onChange={e => setWordIntent(e.target.value)}
                        placeholder="🎯 Intent (ví dụ: Muốn giải khát)"
                        className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-[11px] text-slate-200 outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black font-cyber text-sm shadow-xl transition"
                  >
                    + Lưu Từ Vựng
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
