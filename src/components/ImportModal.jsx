import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, XCircle, Info, RotateCcw, Check, AlertCircle } from 'lucide-react';

export default function ImportModal({
  show,
  onClose,
  inputText,
  setInputText,
  customOnly,
  setCustomOnly,
  onResetToDefault,
  onParseImport,
  importStatus
}) {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl shadow-cyan-500/10 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-lg">Tùy Chỉnh & Nhập Kho Từ Vựng</h3>
                  <p className="text-xs text-slate-400">Thêm hoặc thay thế bộ collocation cho tất cả các game</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="p-3.5 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs space-y-1.5 text-cyan-200">
                <p className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-cyan-400" />
                  Định dạng hỗ trợ (Mỗi từ 1 dòng hoặc định dạng JSON):
                </p>
                <code className="block bg-slate-950/80 p-2 rounded border border-cyan-900/60 font-mono text-cyan-300 text-[11px] overflow-x-auto">
                  Tiếng Việt | Tiếng Anh đúng | sai 1, sai 2, sai 3 | Ghi chú giải thích
                </code>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Dán danh sách từ vựng vào đây:
                </label>
                <textarea
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder={`Chụp ảnh | take a photo | make a photo, do a photo, get a photo | NOT make a photo\nNỗ lực | make an effort | do an effort, take an effort, have an effort | NOT do an effort\nXem TV | watch TV | look at TV, see TV, look TV | NOT look at TV`}
                  className="w-full h-44 bg-slate-950/90 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 rounded-xl p-3 text-xs sm:text-sm font-mono text-slate-200 placeholder:text-slate-600 resize-none outline-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-300">
                  <input
                    type="checkbox"
                    checked={customOnly}
                    onChange={e => setCustomOnly(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>Chỉ chơi các từ mới nhập (không dùng 38 từ gốc)</span>
                </label>

                <button
                  onClick={onResetToDefault}
                  className="text-xs text-rose-400 hover:text-rose-300 underline underline-offset-2 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Khôi phục 38 từ mặc định
                </button>
              </div>

              {importStatus && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    importStatus.type === 'success'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                      : importStatus.type === 'error'
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                      : 'bg-blue-950/60 text-blue-300 border border-blue-500/30'
                  }`}
                >
                  {importStatus.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <span>{importStatus.msg}</span>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium transition"
              >
                Đóng
              </button>
              <button
                onClick={onParseImport}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Nạp Dữ Liệu Vào Game
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
