// config/categories.config.js
export const CATEGORIES = [
  {
    id: 'cat_a',
    code: 'A',
    label: '類別 A · 演講紀錄',
    shortLabel: '類別 A',
    description: '歷年專題演講、校內外論壇紀實、活動場次與公開講稿典藏。',
    color: '#2E4F3E',
    subcategories: ['校內演講', '校外演講', '論壇對談', '歷年特輯', '未分類'],
    keywords: [
      '演講', '講稿', '論壇', '研討會', '開幕', '座談', '主講', '校內', '校外',
      'speech', 'keynote', 'lecture', 'talk', 'symposium', 'seminar', '講演'
    ]
  },
  {
    id: 'cat_b',
    code: 'B',
    label: '類別 B · 數學與方法',
    shortLabel: '類別 B',
    description: '數學推導、演算法理論、統計分析與學術研究筆記。',
    color: '#1E3A5F',
    subcategories: ['微積分與分析', '線性代數', '機率統計', '離散與演算法', '未分類'],
    keywords: [
      '數學', '定理', '證明', '微積分', '矩陣', '線性代數', '機率', '統計', '幾何', '拓撲',
      'math', 'theorem', 'proof', 'matrix', 'integral', '\\frac', '\\sum', '\\int', '数学'
    ]
  },
  {
    id: 'cat_c',
    code: 'C',
    label: '類別 C · 人工智慧',
    shortLabel: '類別 C',
    description: '生成式 AI、深度學習、大型語言模型與跨領域應用實作。',
    color: '#7C3A2D',
    subcategories: ['大型語言模型', '機器學習', '電腦視覺', 'AI 倫理與應用', '未分類'],
    keywords: [
      '人工智慧', '機器學習', '深度學習', '神經網路', '語言模型', '提示詞', '生成式',
      'ai', 'llm', 'gpt', 'transformer', 'neural', 'deep learning', 'rag', 'agent', '人工知能'
    ]
  }
];

export function getAllCategories() {
  return CATEGORIES;
}

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
}
