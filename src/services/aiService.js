// Service kết nối Ollama Local AI (Mặc định: gemma2:2b)
class AIService {
  constructor() {
    this.provider = 'ollama';
    this.ollamaBaseUrl = 'http://127.0.0.1:11434';
    this.ollamaModel = 'gemma2:2b'; // Mặc định là gemma2:2b
    this.loadConfig();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem('arcade_ai_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.provider = parsed.provider || 'ollama';
        this.ollamaBaseUrl = parsed.ollamaBaseUrl || 'http://127.0.0.1:11434';
        this.ollamaModel = parsed.ollamaModel || 'gemma2:2b';
      }
    } catch (e) {}
  }

  saveConfig(config) {
    this.provider = config.provider || this.provider;
    this.ollamaBaseUrl = config.ollamaBaseUrl || this.ollamaBaseUrl;
    this.ollamaModel = config.ollamaModel || this.ollamaModel;

    try {
      localStorage.setItem('arcade_ai_config', JSON.stringify({
        provider: this.provider,
        ollamaBaseUrl: this.ollamaBaseUrl,
        ollamaModel: this.ollamaModel
      }));
    } catch (e) {}
  }

  async fetchOllamaModels() {
    try {
      const res = await fetch(`${this.ollamaBaseUrl}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      return { success: true, models: (data.models || []).map(m => m.name) };
    } catch (err) {
      return {
        success: false,
        error: `Không thể kết nối với Ollama tại ${this.ollamaBaseUrl}. Vui lòng đảm bảo Ollama đang chạy ('ollama serve').`
      };
    }
  }

  // Tự động sinh Manh mối / Cách nói liên tưởng tiếng Việt phong phú bằng Gemma 2B
  async generateCluesForVocab({ vi, en, targetModel = null }) {
    const model = targetModel || this.ollamaModel || 'gemma2:2b';

    const systemPrompt = `You are a creative Vietnamese word riddle master.
Given an English collocation and Vietnamese meaning, output 3 everyday, vivid, indirect Vietnamese clues.
Example for "ancient teapot" / "Ấm trà cổ":
- "Thứ dùng để đựng nước màu vàng tiếp khách đến chơi nhà"
- "Vật dụng đặt trên bàn gỗ, chạm vào coi chừng nóng quá"
- "Bảo vật bằng gốm sứ thời xưa"

Respond ONLY in JSON format: {"clues": ["clue 1", "clue 2", "clue 3"]}`;

    const userPrompt = `Collocation: "${en}" (Nghĩa: "${vi}"). Generate 3 Vietnamese clues.`;

    try {
      const response = await fetch(`${this.ollamaBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          stream: false,
          format: 'json',
          options: { temperature: 0.7 }
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      const rawContent = result.message?.content || '';

      let parsed = null;
      try {
        parsed = JSON.parse(rawContent);
      } catch (e) {
        const jsonMatch = rawContent.match(/\[[\s\S]*\]/) || rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      }

      let list = [];
      if (Array.isArray(parsed)) {
        list = parsed;
      } else if (parsed && typeof parsed === 'object') {
        const arr = Object.values(parsed).find(v => Array.isArray(v));
        if (arr) list = arr;
      }

      if (list.length > 0) {
        const stringClues = list.map(item => {
          if (typeof item === 'string') return item;
          if (typeof item === 'object' && item) {
            return item.clue || item.text || item.description || JSON.stringify(item);
          }
          return String(item);
        });
        return { success: true, clues: stringClues };
      }

      return {
        success: true,
        clues: [
          `Tình huống đời sống liên quan đến "${vi}"`,
          `Cụm từ tiếng Anh chuẩn xác bắt đầu bằng "${en.split(' ')[0]}"`,
          `Hành động hoặc khái niệm quen thuộc: ${vi}`
        ]
      };
    } catch (err) {
      console.error("Generate clues error:", err);
      return {
        success: false,
        clues: [
          `Khái niệm đời sống: ${vi}`,
          `Cách diễn đạt tự nhiên chuẩn bản xứ`,
          `Thường gặp trong các tình huống: ${vi}`
        ]
      };
    }
  }

  async generateCollocations({ topic, count = 10, targetModel = null }) {
    const model = targetModel || this.ollamaModel || 'gemma2:2b';

    const systemPrompt = `You are an expert English language teacher for Vietnamese students.
Generate exactly ${count} English collocations for the topic.
For each collocation, include:
- vi: Vietnamese meaning
- en: English collocation
- wrong: Array of 3 distractors
- note: Short Vietnamese note
- clues: Array of 3 creative, indirect Vietnamese association clues (cách nói liên tưởng, manh mối đố chữ).

Output MUST be a JSON array of objects.`;

    const userPrompt = `Topic: "${topic}". Provide ${count} collocations with clues in valid JSON array.`;

    try {
      const response = await fetch(`${this.ollamaBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          stream: false,
          format: 'json',
          options: {
            temperature: 0.6
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama trả về mã lỗi HTTP ${response.status}`);
      }

      const result = await response.json();
      const rawContent = result.message?.content || '';

      let parsed = null;
      try {
        parsed = JSON.parse(rawContent);
      } catch (e) {
        const jsonMatch = rawContent.match(/\[[\s\S]*\]/) || rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        }
      }

      let itemsList = [];
      if (Array.isArray(parsed)) {
        itemsList = parsed;
      } else if (parsed && typeof parsed === 'object') {
        const arrayProp = Object.values(parsed).find(v => Array.isArray(v));
        if (arrayProp) {
          itemsList = arrayProp;
        } else {
          itemsList = [parsed];
        }
      }

      if (itemsList.length === 0) {
        throw new Error('Dữ liệu trả về từ AI không chứa mảng từ vựng hợp lệ.');
      }

      const validated = itemsList.map((item, idx) => {
        const vi = item.vi || item.vietnamese || 'Từ chưa có nghĩa';
        const en = item.en || item.english || item.word || 'collocation';
        let wrongs = Array.isArray(item.wrong) ? item.wrong : [];
        if (wrongs.length === 0 || typeof wrongs[0] !== 'string') {
          wrongs = [`make ${en}`, `do ${en}`, `take ${en}`];
        }
        while (wrongs.length < 3) {
          wrongs.push(`wrong option ${wrongs.length + 1}`);
        }
        const note = item.note || item.explanation || '';
        let clues = [];
        if (Array.isArray(item.clues) && item.clues.length >= 2) {
          clues = item.clues.map(c => typeof c === 'string' ? c : (c.clue || c.text || String(c)));
        } else {
          clues = [
            `Tình huống đời sống gắn liền với: ${vi}`,
            `Thường gặp khi giao tiếp bằng tiếng Anh tự nhiên`,
            `Gợi ý cụm từ có chứa chữ: "${en.split(' ')[0]}"`
          ];
        }

        return {
          id: `ai-${Date.now()}-${idx}`,
          vi,
          en,
          wrong: wrongs.slice(0, 3),
          note,
          clues
        };
      });

      return { success: true, items: validated };
    } catch (err) {
      console.error("Ollama generate error:", err);
      return {
        success: false,
        error: `Lỗi khi gọi Ollama: ${err.message}.`
      };
    }
  }

  async generateAIScenarios({ vocabList, count = 5, targetModel = null }) {
    const model = targetModel || this.ollamaModel || 'gemma2:2b';
    const sampledWords = vocabList.slice(0, count);

    const systemPrompt = `You are a social scenario game writer for an English Situational Reflex game.
Given a list of vocabulary items, create ${sampledWords.length} realistic social dialogue scenarios.
Respond with a JSON array of scenario objects in this EXACT format:
[
  {
    "collocation": "target collocation",
    "npc": {
      "name": "NPC Name",
      "avatar": "emoji",
      "mood": "worried|angry|happy|confused|hurting",
      "line": "English stimulus spoken by NPC",
      "action": "Vietnamese description of what NPC is doing"
    },
    "intent": {
      "icon": "emoji",
      "label": "Mục tiêu của bạn",
      "text": "Vietnamese goal the player wants to achieve"
    },
    "options": [
      {
        "id": "opt1",
        "text": "Full English sentence with BOTH correct collocation and correct intent",
        "type": "correct",
        "feedback": "Vietnamese praise explaining why it achieves the goal"
      },
      {
        "id": "opt2",
        "text": "Full English sentence with RIGHT INTENT but WRONG COLLOCATION (common mistake)",
        "type": "wrong_collocation_right_intent",
        "feedback": "Vietnamese explanation: Right goal, but incorrect collocation"
      },
      {
        "id": "opt3",
        "text": "Full English sentence with CORRECT COLLOCATION but WRONG/RUDE INTENT",
        "type": "right_collocation_wrong_intent",
        "feedback": "Vietnamese explanation: Used correct words but failed the social goal"
      },
      {
        "id": "opt4",
        "text": "Completely irrelevant English sentence",
        "type": "distractor",
        "feedback": "Vietnamese explanation: Irrelevant option"
      }
    ],
    "explanation": "Vietnamese note on collocation usage"
  }
]`;

    const userPrompt = `Vocabularies: ${JSON.stringify(sampledWords.map(w => ({ vi: w.vi, en: w.en })))}. Create ${sampledWords.length} scenarios. Output ONLY valid JSON array.`;

    try {
      const response = await fetch(`${this.ollamaBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          stream: false,
          format: 'json',
          options: {
            temperature: 0.7
          }
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      const rawContent = result.message?.content || '';

      let parsed = null;
      try {
        parsed = JSON.parse(rawContent);
      } catch (e) {
        const jsonMatch = rawContent.match(/\[[\s\S]*\]/) || rawContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
      }

      let scenarios = Array.isArray(parsed) ? parsed : (parsed && typeof parsed === 'object' ? Object.values(parsed).find(v => Array.isArray(v)) : null);

      if (!scenarios || scenarios.length === 0) {
        throw new Error('AI không trả về danh sách kịch bản hợp lệ.');
      }

      const formatted = scenarios.map((s, idx) => ({
        id: `ai-sc-${Date.now()}-${idx}`,
        collocation: s.collocation || 'collocation',
        npc: s.npc || { name: 'Alex', avatar: '🧑', mood: 'curious', line: 'Hello there!', action: 'Alex đang chờ câu trả lời' },
        intent: s.intent || { icon: '🎯', label: 'Mục tiêu của bạn', text: 'Đạt được mục tiêu giao tiếp' },
        options: Array.isArray(s.options) && s.options.length === 4 ? s.options : [
          { id: 'opt1', text: `Let us use ${s.collocation} appropriately.`, type: 'correct', feedback: 'Chính xác!' },
          { id: 'opt2', text: `Let us do ${s.collocation} immediately.`, type: 'wrong_collocation_right_intent', feedback: 'Sai collocation!' },
          { id: 'opt3', text: `I do not care about this at all.`, type: 'right_collocation_wrong_intent', feedback: 'Sai ý định!' },
          { id: 'opt4', text: `It is completely unrelated.`, type: 'distractor', feedback: 'Lạc đề!' }
        ],
        explanation: s.explanation || ''
      }));

      return { success: true, scenarios: formatted };
    } catch (err) {
      console.error("Generate AI Scenarios error:", err);
      return { success: false, error: err.message };
    }
  }

  async explainCollocation({ vi, en, wrong, targetModel = null }) {
    const model = targetModel || this.ollamaModel || 'gemma2:2b';

    const prompt = `Giải thích ngắn gọn, dễ hiểu và chuyên sâu bằng tiếng Việt về cụm từ Collocation tiếng Anh sau:
- Nghĩa tiếng Việt: "${vi}"
- Collocation đúng: "${en}"
${wrong ? `- Các cách dùng sai phổ biến: ${Array.isArray(wrong) ? wrong.join(', ') : wrong}` : ''}

Nội dung giải thích gồm:
1. Tại sao lại dùng từ "${en}" mà không dùng các từ khác?
2. 2-3 câu ví dụ thực tế có dịch nghĩa tiếng Việt.
3. Mẹo nhớ nhanh.`;

    try {
      const response = await fetch(`${this.ollamaBaseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'user', content: prompt }
          ],
          stream: false,
          options: {
            temperature: 0.6
          }
        })
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      return { success: true, explanation: result.message?.content || '' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const aiService = new AIService();
