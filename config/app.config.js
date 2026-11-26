// config/app.config.js
// 全站集中設定檔：上線前請填入你自己的 Supabase URL 與 Anon Key（嚴禁放入 service_role key）

export const APP_CONFIG = {
  SITE_NAME: '人工智慧與演講紀錄典藏館',
  SITE_SUBTITLE: 'AI & Speech Curated Archive',

  // 1. Supabase 公開連線設定（Project Settings -> API）
  SUPABASE_URL: 'https://euvhpeygpgruyjojdsbf.supabase.co',
  SUPABASE_ANON_KEY: 'sb_publishable_1lTYfKRQf9HvjlT1ak5cVQ_6K_7JTn-',

  // 2. 全站預設語系（可一鍵修改：zh-TW / en / ms / ja / ko / zh-CN）
  DEFAULT_UI_LANG: 'zh-TW',
  DEFAULT_POST_LANG: 'zh-TW',

  // 3. 選填：免費外部圖床 ImgBB API Key（留空則自動無縫退回 Supabase Storage）
  IMGBB_API_KEY: '',

  // 4. Google 站內搜尋設定
  SITE_DOMAIN: 'your-username.github.io/your-repo',
  GOOGLE_CSE_CX: '', // 選填：若填寫 Google Programmable Search CX ID 則導向自訂搜尋，留空則使用 site: 搜尋

  // 5. 全頁翻譯後端設定：'free'（免後端免費 API）| 'edge'（Supabase Edge Function）| 'local'（地端 Ollama/LibreTranslate）
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

  // 7. 歷年演講專區國家設定（對應 speech 資料表的 country 欄位）
  COUNTRIES: [
    { code: 'TW', label: '台灣（東海大學）', short: '台灣 TW' },
    { code: 'MY', label: '馬來西亞（UTAR）', short: '馬來西亞 MY' }
  ]
};
