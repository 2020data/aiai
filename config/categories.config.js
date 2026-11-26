// config/categories.config.js
// 【可擴充按鈕分類設定檔】
// 只要在此陣列複製貼上一個新物件，全站導覽按鈕、側邊欄、上傳表單、自動分類與卡片色票都會自動新增！

export const CATEGORIES = [
  {
    id: 'cat_a',
    code: 'A',
    label: '類別 A · 演講紀錄',
    shortLabel: '類別 A',
    description: '歷年專題演講、論壇紀實、活動場次與公開講稿典藏。',
    color: '#2E4F3E',        // 深森林綠
    subcategories: ['專題演講', '開幕紀實', '論壇對談', '歷年特輯', '未分類'],
    keywords: [
      '演講', '講稿', '論壇', '研討會', '開幕', '座談', '主講', '東海', 'utar', '競賽',
      'speech', 'keynote', 'lecture', 'talk', 'symposium', 'seminar', '講演'
    ]
  },
  {
    id: 'cat_b',
    code: 'B',
    label: '類別 B · 數學與方法',
    shortLabel: '類別 B',
    description: '數學推導、演算法理論、統計分析與學術研究筆記。',
    color: '#1E3A5F',        // 普魯士藍
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
    color: '#7C3A2D',        // 赤陶紅
    subcategories: ['大型語言模型', '機器學習', '電腦視覺', 'AI 倫理與應用', '未分類'],
    keywords: [
      '人工智慧', '機器學習', '深度學習', '神經網路', '語言模型', '提示詞', '生成式',
      'ai', 'llm', 'gpt', 'transformer', 'neural', 'deep learning', 'rag', 'agent', '人工知能'
    ]
  }

  /* ===== 擴充範例：取消註解即可一鍵新增「類別 D」按鈕 =====
  ,{
    id: 'cat_d',
    code: 'D',
    label: '類別 D · 延伸資源',
    shortLabel: '類別 D',
    description: '推薦書單、工具集與開源專案筆記。',
    color: '#6B5B3E',
    subcategories: ['工具教學', '參考文獻', '未分類'],
    keywords: ['工具', '資源', '書單', 'resource', 'guide']
  }
  */
];

export function getAllCategories() {
  return CATEGORIES;
}

export function getCategoryById(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
}
