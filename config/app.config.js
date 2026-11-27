// config/app.config.js
// 全站集中設定檔：上線前請填入你自己的 Supabase URL 與 Anon Key（嚴禁放入 service_role key）

export const APP_CONFIG = {
  SITE_NAME: '人工智慧與演講紀錄典藏館',
  SITE_SUBTITLE: 'AI & Speech Curated Archive',

  // 1. Supabase 公開連線設定（Project Settings -> API）
  SUPABASE_URL: 'https://euvhpeygpgruyjojdsbf.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_1lTYfKRQf9HvjlT1ak5cVQ_6K_7JTn-',
// 2. 全站預設語系
  DEFAULT_UI_LANG: 'zh-TW',
  DEFAULT_POST_LANG: 'zh-TW',

  // 3. 選填：免費外部圖床 ImgBB API Key
  IMGBB_API_KEY: '',

  // 4. Google 站內搜尋設定
  SITE_DOMAIN: 'your-username.github.io/your-repo',
  GOOGLE_CSE_CX: '',

  // 5. 全頁翻譯後端設定
  TRANSLATION_PROVIDER: 'free',
  TRANSLATION_EDGE_URL: '',
  TRANSLATION_LOCAL_URL: 'http://localhost:5000/translate',

  // 6. 右上角支援語系清單
  SUPPORTED_LANGUAGES: [
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'en', label: 'English' },
    { code: 'ms', label: 'Bahasa Melayu' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'zh-CN', label: '简体中文' }
  ],

  // 7. 歷年演講專區場域設定：校內 / 校外
  COUNTRIES: [
    { code: 'IN', label: '校內', short: '校內' },
    { code: 'OUT', label: '校外', short: '校外' }
  ]
};
// config/app.config.js（在原本 APP_CONFIG 內新增此區塊）
  // 8. NotebookLM 互動外掛清單
  NOTEBOOKLM_LINKS: [
    {
      id: 'main-archive',
      label: '01 · 典藏總庫助理',
      title: '人工智慧與演講紀錄典藏知識庫',
      description: '收錄歷年校內外演講講稿、AI 研究筆記與數學推導文件，可直接針對典藏內容提問。',
      url: 'https://notebooklm.google.com/notebook/YOUR_NOTEBOOK_ID',
      mode: 'auto', // 'auto'（自動偵測） | 'embed'（強制大框內嵌） | 'launch'（獨立視窗面板）
      prompts: [
        '請整理本館歷年演講的核心主題脈絡',
        '比較不同年份在大型語言模型議題上的觀點變化',
        '列出所有包含數學推導或演算法分析的重點摘要'
      ]
    },
    {
      id: 'custom-embed',
      label: '02 · 互動外掛示範',
      title: '可內嵌互動工具／知識庫',
      description: '可替換為任何允許 iframe 內嵌的 AI 對話頁、公開投影片或互動表單。',
      url: 'https://example.com',
      mode: 'embed',
      prompts: []
    }
  ]
