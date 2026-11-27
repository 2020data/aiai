// components/navbar.js
import { APP_CONFIG } from '../config/app.config.js';
import { getAllCategories } from '../config/categories.config.js';
import { getCurrentUser, signOut } from '../modules/auth.module.js';
import { getSavedLang, t } from '../modules/i18n.module.js';
import { translatePage } from '../modules/translator.module.js';
import { icon } from '../modules/icons.module.js';
import { openNotebookLMOverlay } from './notebooklm-panel.js';
export async function mountNavbar(activeCat = '') {
  const mount = document.getElementById('navbar-root');
  if (!mount) return;

  const user = await getCurrentUser();
  const currentLang = getSavedLang();
  const categories = getAllCategories();

  const langOptions = APP_CONFIG.SUPPORTED_LANGUAGES.map(
    (l) => `<option value="${l.code}" ${l.code === currentLang ? 'selected' : ''}>${l.label}</option>`
  ).join('');

  const catButtons = categories
    .map(
      (cat) => `
      <a href="./index.html?cat=${encodeURIComponent(cat.id)}"
         class="cat-nav-btn ${activeCat === cat.id ? 'is-active' : ''}"
         style="--btn-accent: ${cat.color};">
        <span class="font-mono-index text-xs opacity-75">${cat.code}.</span>
        <span>${cat.label}</span>
      </a>`
    )
    .join('');
  
  mount.innerHTML = `
    <header class="bg-[#FCFBF8] hairline-b sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        <!-- 品牌標誌 -->
        <a href="./index.html" class="flex items-center gap-2.5 text-[#18181B] no-underline group">
          <span class="w-8 h-8 border border-[#18181B] flex items-center justify-center group-hover:bg-[#18181B] group-hover:text-[#F6F4EF] transition">
            ${icon('archive')}
          </span>
          <div>
            <div class="font-serif-editorial text-lg font-semibold leading-tight">${APP_CONFIG.SITE_NAME}</div>
            <div class="font-mono-index text-[10px] tracking-widest uppercase text-zinc-500" data-no-translate>${APP_CONFIG.SITE_SUBTITLE}</div>
          </div>
        </a>

        <!-- 右側工具列：Google 站內搜尋 + 右上角即時翻譯語系 + 登入/新增入口 -->
        <div class="flex flex-wrap items-center gap-2">
          <form id="nav-google-search" class="flex items-center border border-[#D8D3C8] bg-[#F6F4EF] px-2 py-1">
            <input type="text" id="nav-search-input" placeholder="${t('searchPlaceholder')}"
                   class="bg-transparent text-xs outline-none w-36 sm:w-44 text-[#18181B]" />
            <button type="submit" class="text-zinc-600 hover:text-[#18181B]" aria-label="搜尋">${icon('search')}</button>
          </form>

          <div class="flex items-center gap-1 border border-[#D8D3C8] bg-[#FCFBF8] px-2 py-1 text-xs" data-no-translate>
            ${icon('globe', 'text-zinc-600')}
            <select id="nav-lang-select" class="bg-transparent outline-none cursor-pointer text-xs">
              ${langOptions}
            </select>
            <span id="nav-tr-status" class="text-[10px] text-zinc-500 hidden">...</span>
          </div>

          ${
            user
              ? `
                <a href="./upload.html" class="editorial-btn !py-1.5 !px-3 !text-xs">${icon('upload')} ${t('upload')}</a>
                <a href="./batch-upload.html" class="editorial-btn-outline !py-1.5 !px-3 !text-xs">${icon('layers')} ${t('batchUpload')}</a>
                <button id="nav-logout-btn" type="button" class="editorial-btn-outline !py-1.5 !px-2.5 !text-xs" title="${user.email}">
                  ${icon('logout')} ${t('logout')}
                </button>
              `
              : `
                <a href="./login.html" class="editorial-btn !py-1.5 !px-3 !text-xs">${icon('user')} ${t('login')}</a>
              `
          }
        </div>
      </div>

      <!-- 顯眼可擴充類別按鈕列（全部典藏 / 類別 A / B / C / NotebookLM 互動 / 歷年演講專區） -->
      <nav class="hairline-t bg-[#F6F4EF]/85">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-2">
          <a href="./index.html"
             class="cat-nav-btn ${!activeCat ? 'is-active' : ''}"
             style="--btn-accent: #18181B;">
            ${icon('grid')}
            <span>${t('allArchive')}</span>
          </a>
          ${catButtons}
          <a href="https://notebooklm.google.com/notebook/95895d7e-3847-4bb0-88da-4daf332eed31"
   target="_blank"
   rel="noopener noreferrer"
   class="cat-nav-btn"
   style="--btn-accent: #2E4F3E;">
  ${icon('layers')}
  <span>NotebookLM 互動</span>
</a>
          <a href="./competition.html"
             class="cat-nav-btn ml-auto ${activeCat === 'speech_special' ? 'is-active' : ''}"
             style="--btn-accent: #4A443B;">
            ${icon('calendar')}
            <span>${t('speechArchive')}</span>
          </a>
        </div>
      </nav>
    </header>
  `;

  // Google 站內搜尋
  mount.querySelector('#nav-google-search')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = mount.querySelector('#nav-search-input').value.trim();
    if (!q) return;
    if (APP_CONFIG.GOOGLE_CSE_CX) {
      window.open(`https://cse.google.com/cse?cx=${encodeURIComponent(APP_CONFIG.GOOGLE_CSE_CX)}&q=${encodeURIComponent(q)}`, '_blank');
    } else {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(`site:${APP_CONFIG.SITE_DOMAIN} ${q}`)}`, '_blank');
    }
  });

  // 右上角語系選單：直接觸發全頁即時翻譯
  const langSelect = mount.querySelector('#nav-lang-select');
  const trStatus = mount.querySelector('#nav-tr-status');
  langSelect?.addEventListener('change', async (e) => {
    const target = e.target.value;
    await translatePage(target, (state) => {
      if (state === 'translating') {
        trStatus.textContent = '翻譯中';
        trStatus.classList.remove('hidden');
      } else {
        trStatus.classList.add('hidden');
      }
    });
  });

  // 登出
  mount.querySelector('#nav-logout-btn')?.addEventListener('click', async () => {
    await signOut();
    window.location.reload();
  });
  // 點擊 NotebookLM 按鈕：在當前頁面上直接展開大框（若已在獨立頁則不重複開）
  mount.querySelector('#nav-nlm-btn')?.addEventListener('click', () => {
    if (activeCat === 'notebooklm') return;
    openNotebookLMOverlay();
  });

  // 若使用者先前已選擇非預設語系，載入後自動翻譯
  if (currentLang && currentLang !== APP_CONFIG.DEFAULT_UI_LANG) {
    setTimeout(() => translatePage(currentLang), 350);
  }
}
