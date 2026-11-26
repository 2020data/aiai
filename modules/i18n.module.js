// modules/i18n.module.js
import { APP_CONFIG } from '../config/app.config.js';

const STORAGE_KEY = 'archive_ui_lang';

const DICTIONARY = {
  'zh-TW': {
    allArchive: '全部典藏',
    speechArchive: '歷年演講專區',
    searchPlaceholder: 'Google 站內搜尋...',
    upload: '新增稿件',
    batchUpload: '批次上傳',
    login: '登入',
    logout: '登出',
    autoClassifyMine: '一鍵自動分類我的文章',
    noPosts: '目前尚無典藏紀錄。'
  },
  en: {
    allArchive: 'All Archives',
    speechArchive: 'Annual Speech Archive',
    searchPlaceholder: 'Search site via Google...',
    upload: 'New Entry',
    batchUpload: 'Batch Import',
    login: 'Sign In',
    logout: 'Sign Out',
    autoClassifyMine: 'Auto-Classify My Entries',
    noPosts: 'No archive entries found yet.'
  },
  ms: {
    allArchive: 'Semua Arkib',
    speechArchive: 'Arkib Ucapan Tahunan',
    searchPlaceholder: 'Carian Google...',
    upload: 'Tambah Rekod',
    batchUpload: 'Muat Naik Kelompok',
    login: 'Log Masuk',
    logout: 'Log Keluar',
    autoClassifyMine: 'Auto-Klasifikasi Artikel Saya',
    noPosts: 'Tiada rekod ditemui.'
  },
  ja: {
    allArchive: 'すべてのアーカイブ',
    speechArchive: '歴代講演アーカイブ',
    searchPlaceholder: 'Google サイト内検索...',
    upload: '新規投稿',
    batchUpload: '一括アップロード',
    login: 'ログイン',
    logout: 'ログアウト',
    autoClassifyMine: '自分の記事を自動分類',
    noPosts: 'アーカイブはまだありません。'
  },
  ko: {
    allArchive: '전체 아카이브',
    speechArchive: '연도별 강연 아카이브',
    searchPlaceholder: 'Google 사이트 검색...',
    upload: '새 기록 작성',
    batchUpload: '일괄 업로드',
    login: '로그인',
    logout: '로그아웃',
    autoClassifyMine: '내 글 자동 분류',
    noPosts: '등록된 아카이브가 없습니다.'
  },
  'zh-CN': {
    allArchive: '全部典藏',
    speechArchive: '历年演讲专区',
    searchPlaceholder: 'Google 站内搜索...',
    upload: '新增稿件',
    batchUpload: '批量上传',
    login: '登录',
    logout: '退出',
    autoClassifyMine: '一键自动分类我的文章',
    noPosts: '目前尚无典藏记录。'
  }
};

export function getSavedLang() {
  return localStorage.getItem(STORAGE_KEY) || APP_CONFIG.DEFAULT_UI_LANG;
}

export function setSavedLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
}

export function t(key, lang = getSavedLang()) {
  const pack = DICTIONARY[lang] || DICTIONARY[APP_CONFIG.DEFAULT_UI_LANG] || DICTIONARY['zh-TW'];
  return pack[key] || DICTIONARY['zh-TW'][key] || key;
}
