// Helper tiện ích sinh câu hỏi và đáp án cho Mini-Games (1 Nghĩa Tiếng Việt <-> 1 Cụm Tiếng Anh)
import { shuffle } from './gameUtils';

// Sinh danh sách câu hỏi chơi qua toàn bộ từ trong pool
export function expandPoolWithSimpleItems(pool) {
  const questions = pool.map((item, itemIdx) => ({
    ...item,
    uniqueQuestionId: `${item.id}-${itemIdx}`
  }));

  return shuffle(questions);
}

// Sinh 4 phương án Tiếng Việt cho Chế Độ Đảo Ngược (Reverse Mode: 🇬🇧 -> 🇻🇳)
export function generateReverseOptions(pool, currentItem, count = 4) {
  const otherItems = pool.filter(w => w.id !== currentItem.id);
  const wrongCandidates = shuffle(otherItems).slice(0, count - 1);

  const options = [
    { text: currentItem.vi, isCorrect: true, item: currentItem },
    ...wrongCandidates.map(w => ({
      text: w.vi,
      isCorrect: false,
      item: w
    }))
  ];

  return shuffle(options);
}

// Sinh 4 phương án Tiếng Anh cho Chế Độ Thuận (Forward Mode: 🇻🇳 -> 🇬🇧)
export function generateForwardOptions(pool, currentItem, count = 4) {
  const wrongOptions = currentItem.wrong && currentItem.wrong.length >= 3
    ? currentItem.wrong.slice(0, count - 1)
    : shuffle(pool.filter(w => w.id !== currentItem.id)).slice(0, count - 1).map(w => w.en);

  const options = [
    { text: currentItem.en, isCorrect: true, item: currentItem },
    ...wrongOptions.map(w => ({
      text: w,
      isCorrect: false
    }))
  ];

  return shuffle(options);
}
