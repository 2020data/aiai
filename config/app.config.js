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
  ],

  // 8. NotebookLM 單一互動連結
  NOTEBOOKLM_URL: 'https://notebook.google.com/notebook/95895d7e-3847-4bb0-88da-4daf332eed31'
};
