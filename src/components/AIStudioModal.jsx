import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  XCircle,
  Sparkles,
  RefreshCw,
  Server,
  Check,
  AlertCircle,
  BookOpen,
  Send,
  Loader2,
  Terminal,
  Cpu
} from 'lucide-react';
import { aiService } from '../services/aiService';

export default function AIStudioModal({
  show,
  onClose,
  onCreateDeckFromAI,
  activeVocabPool
}) {
  const [activeTab, setActiveTab] = useState('generate'); // 'generate', 'tutor', 'settings'
  const [ollamaUrl, setOllamaUrl] = useState(aiService.ollamaBaseUrl);
  const [selectedModel, setSelectedModel] = useState(aiService.ollamaModel);
  const [availableModels, setAvailableModels] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('untested'); // 'untested', 'checking', 'connected', 'failed'
  const [connectionError, setConnectionError] = useState('');

  // Generate Deck Form
  const [topic, setTopic] = useState('');
  const [wordCount, setWordCount] = useState(10);
  const [deckName, setDeckName] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');
  const [generatedPreview, setGeneratedPreview] = useState(null);

  // AI Tutor Form
  const [selectedWordForTutor, setSelectedWordForTutor] = useState('');
  const [tutorResponse, setTutorResponse] = useState('');
  const [isTutorLoading, setIsTutorLoading] = useState(false);

  // Check Ollama connection on open
  useEffect(() => {
    if (show) {
      checkOllamaConnection();
    }
  }, [show]);

  const checkOllamaConnection = async () => {
    setConnectionStatus('checking');
    setConnectionError('');
    const res = await aiService.fetchOllamaModels();
    if (res.success) {
      setConnectionStatus('connected');
      setAvailableModels(res.models);
      if (res.models.length > 0) {
        if (!res.models.includes(selectedModel)) {
          // Prefer qwen or gemma if available
          const preferred = res.models.find(m => m.includes('qwen') || m.includes('gemma') || m.includes('llama')) || res.models[0];
          setSelectedModel(preferred);
          aiService.saveConfig({ ollamaModel: preferred });
        }
      }
    } else {
      setConnectionStatus('failed');
      setConnectionError(res.error);
    }
  };

  const handleModelChange = (model) => {
    setSelectedModel(model);
    aiService.saveConfig({ ollamaModel: model });
  };

  const handleSaveSettings = () => {
    aiService.saveConfig({
      ollamaBaseUrl: ollamaUrl,
      ollamaModel: selectedModel
    });
    checkOllamaConnection();
  };

  // Generate Action
  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsGenerating(true);
    setGenerateError('');
    setGeneratedPreview(null);

    const name = deckName.trim() || `AI: ${topic.trim()}`;

    const res = await aiService.generateCollocations({
      topic: topic.trim(),
      count: wordCount,
      targetModel: selectedModel
    });

    setIsGenerating(false);

    if (res.success && res.items.length > 0) {
      setGeneratedPreview({ name, items: res.items });
    } else {
      setGenerateError(res.error || 'Không thể tạo từ vựng. Vui lòng kiểm tra lại kết nối Ollama.');
    }
  };

  const handleConfirmAddDeck = () => {
    if (!generatedPreview) return;
    onCreateDeckFromAI(generatedPreview.name, `Học phần do Ollama (${selectedModel}) sinh ra`, generatedPreview.items);
    setGeneratedPreview(null);
    setTopic('');
    setDeckName('');
    onClose();
  };

  // Tutor Ask Action
  const handleAskTutor = async (wordObj) => {
    const target = wordObj || activeVocabPool[0];
    if (!target) return;

    setIsTutorLoading(true);
    setTutorResponse('');
    setSelectedWordForTutor(target.en);

    const res = await aiService.explainCollocation({
      vi: target.vi,
      en: target.en,
      wrong: target.wrong,
      targetModel: selectedModel
    });

    setIsTutorLoading(false);
    if (res.success) {
      setTutorResponse(res.explanation);
    } else {
      setTutorResponse(`Lỗi: ${res.error}`);
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
            className="bg-slate-900 border border-fuchsia-500/40 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-cyan-500/20 text-fuchsia-400 border border-fuchsia-500/40 shadow-lg">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-lg sm:text-xl font-cyber flex items-center gap-2">
                    <span>OLLAMA LOCAL AI STUDIO</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-[10px] uppercase font-bold">
                      Online & Sẵn Sàng
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sinh học phần từ vựng và giải thích ngữ pháp bằng mô hình AI trên máy bạn
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Connection Status & Model Quick Picker */}
            <div className="px-6 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-cyber">MÔ HÌNH ĐANG DÙNG:</span>
                {availableModels.length > 0 ? (
                  <select
                    value={selectedModel}
                    onChange={e => handleModelChange(e.target.value)}
                    className="bg-slate-900 border border-fuchsia-500/50 text-fuchsia-300 font-bold rounded-lg px-2.5 py-1 text-xs outline-none cursor-pointer hover:border-fuchsia-400"
                  >
                    {availableModels.map(m => (
                      <option key={m} value={m}>🦙 {m}</option>
                    ))}
                  </select>
                ) : (
                  <span className="text-cyan-300 font-mono font-bold">{selectedModel}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {connectionStatus === 'connected' && (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Ollama Đang Chạy
                  </span>
                )}
                {connectionStatus === 'checking' && (
                  <span className="text-amber-400 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Đang quét...
                  </span>
                )}
                <button
                  onClick={checkOllamaConnection}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium underline"
                >
                  <RefreshCw className="w-3 h-3" /> Làm mới
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="px-6 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 text-xs">
              <button
                onClick={() => setActiveTab('generate')}
                className={`px-3.5 py-1.5 rounded-xl font-bold font-cyber transition flex items-center gap-1.5 ${
                  activeTab === 'generate'
                    ? 'bg-fuchsia-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Sinh Học Phần Tự Động</span>
              </button>

              <button
                onClick={() => setActiveTab('tutor')}
                className={`px-3.5 py-1.5 rounded-xl font-bold font-cyber transition flex items-center gap-1.5 ${
                  activeTab === 'tutor'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>Gia Sư AI Giải Thích</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3.5 py-1.5 rounded-xl font-bold font-cyber transition flex items-center gap-1.5 ${
                  activeTab === 'settings'
                    ? 'bg-slate-800 text-slate-200 border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Server className="w-4 h-4" />
                <span>Cấu Hình & Models</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              {/* TAB 1: GENERATE DECK */}
              {activeTab === 'generate' && (
                <div className="space-y-5 max-w-xl mx-auto">
                  {!generatedPreview ? (
                    <form onSubmit={handleGenerate} className="space-y-4">
                      {/* Model Selector Card */}
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2">
                          <Cpu className="w-4 h-4 text-fuchsia-400" />
                          <span className="text-slate-300 font-semibold">Mô hình thực thi:</span>
                        </div>
                        {availableModels.length > 0 ? (
                          <select
                            value={selectedModel}
                            onChange={e => handleModelChange(e.target.value)}
                            className="bg-slate-900 border border-fuchsia-500/40 text-fuchsia-200 font-bold rounded-xl px-3 py-1.5 text-xs outline-none"
                          >
                            {availableModels.map(m => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="font-mono text-fuchsia-400 font-bold">{selectedModel}</span>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Nhập Chủ Đề Bạn Muốn Học: <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={topic}
                          onChange={e => setTopic(e.target.value)}
                          placeholder="Ví dụ: Du lịch khách sạn, Môi trường, IELTS Speaking Part 2, Kinh doanh đàm phán..."
                          className="w-full bg-slate-950 border border-slate-700 focus:border-fuchsia-400 rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none"
                          required
                          autoFocus
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Tên Học Phần (Tùy chọn):
                          </label>
                          <input
                            type="text"
                            value={deckName}
                            onChange={e => setDeckName(e.target.value)}
                            placeholder="Để trống sẽ tự động lấy theo chủ đề"
                            className="w-full bg-slate-950 border border-slate-700 focus:border-fuchsia-400 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            Số lượng cụm từ:
                          </label>
                          <div className="flex gap-2">
                            {[5, 10, 15, 20].map(c => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => setWordCount(c)}
                                className={`flex-1 py-2 rounded-xl text-xs font-cyber font-bold transition border ${
                                  wordCount === c
                                    ? 'bg-fuchsia-600 text-white border-fuchsia-400'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {c} từ
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {generateError && (
                        <div className="p-3 bg-rose-950/60 border border-rose-500/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          <span>{generateError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isGenerating}
                        className={`w-full py-3.5 rounded-2xl font-bold font-cyber text-sm text-white shadow-xl transition flex items-center justify-center gap-2 ${
                          isGenerating
                            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-fuchsia-600 via-pink-600 to-amber-500 hover:opacity-90 shadow-fuchsia-500/25'
                        }`}
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Ollama ({selectedModel}) đang suy nghĩ và sinh {wordCount} cụm từ...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 text-amber-300" />
                            <span>🪄 Bấm Để Ollama Tự Động Sinh Học Phần</span>
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* Preview Generated Result */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-bold text-slate-100 font-cyber text-base">
                            ĐÃ SINH THÀNH CÔNG: "{generatedPreview.name}"
                          </h4>
                          <p className="text-xs text-emerald-400">
                            {generatedPreview.items.length} collocations chất lượng cao
                          </p>
                        </div>

                        <button
                          onClick={() => setGeneratedPreview(null)}
                          className="text-xs text-slate-400 hover:text-white underline"
                        >
                          Tạo lại
                        </button>
                      </div>

                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {generatedPreview.items.map((item, i) => (
                          <div
                            key={i}
                            className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1"
                          >
                            <div className="flex justify-between font-bold">
                              <span className="text-slate-200">{i + 1}. {item.vi}</span>
                              <span className="text-emerald-400 font-cyber">{item.en}</span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              Đáp án bẫy: <span className="text-rose-300">{item.wrong?.join(', ')}</span>
                            </div>
                            {item.note && (
                              <div className="text-[10px] text-cyan-300 italic">
                                💡 {item.note}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={handleConfirmAddDeck}
                        className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 font-bold font-cyber text-sm text-slate-950 shadow-xl shadow-emerald-500/25 transition flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Kích Hoạt Học Phần Này Để Chơi Ngay!</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: AI TUTOR EXPLAINER */}
              {activeTab === 'tutor' && (
                <div className="space-y-4 max-w-xl mx-auto">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-300">
                      Chọn cụm từ trong học phần hiện tại để nhờ Ollama ({selectedModel}) giải thích:
                    </label>
                    <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto p-2 bg-slate-950 rounded-xl border border-slate-800">
                      {activeVocabPool.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleAskTutor(item)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-cyber transition border ${
                            selectedWordForTutor === item.en
                              ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          {item.vi} → {item.en}
                        </button>
                      ))}
                    </div>
                  </div>

                  {isTutorLoading && (
                    <div className="py-8 text-center text-xs text-cyan-400 space-y-2">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-cyan-400" />
                      <p>Ollama ({selectedModel}) đang phân tích ngữ cảnh và soạn câu ví dụ...</p>
                    </div>
                  )}

                  {tutorResponse && !isTutorLoading && (
                    <div className="p-4 bg-slate-950 rounded-2xl border border-cyan-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line shadow-inner">
                      <div className="font-bold text-cyan-300 mb-2 font-cyber flex items-center gap-1.5">
                        <Bot className="w-4 h-4" />
                        PHÂN TÍCH TỪ OLLAMA AI ({selectedModel}):
                      </div>
                      {tutorResponse}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: OLLAMA SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-4 max-w-md mx-auto py-2 text-xs sm:text-sm">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Địa chỉ máy chủ Ollama (Base URL):
                    </label>
                    <input
                      type="text"
                      value={ollamaUrl}
                      onChange={e => setOllamaUrl(e.target.value)}
                      placeholder="http://127.0.0.1:11434"
                      className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 font-mono text-slate-200 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Mô hình AI đang dùng:
                    </label>
                    {availableModels.length > 0 ? (
                      <select
                        value={selectedModel}
                        onChange={e => setSelectedModel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-slate-200 outline-none"
                      >
                        {availableModels.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={selectedModel}
                        onChange={e => setSelectedModel(e.target.value)}
                        placeholder="qwen2.5:1.5b-instruct, gemma4:latest, gemma2:2b..."
                        className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-3.5 py-2 text-slate-200 outline-none"
                      />
                    )}
                  </div>

                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
                    <p className="font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Máy bạn đang có sẵn {availableModels.length} models:
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {availableModels.map(m => (
                        <span key={m} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-cyan-300 font-mono">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSaveSettings}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 font-bold text-slate-950 font-cyber transition shadow-md"
                  >
                    Lưu Cài Đặt
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
              <span>Model: <strong className="text-fuchsia-300">{selectedModel}</strong></span>
              <button
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
