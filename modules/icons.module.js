// modules/icons.module.js
// 統一 1.5px 筆觸極簡建築幾何 SVG 圖示系統

const SVG_BASE = 'fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"';

export const ICONS = {
  archive: `<svg width="16" height="16" viewBox="0 0 24 24" ${SVG_BASE}><rect x="3" y="4" width="18" height="4"/><path d="M5 8v12h14V8"/><path d="M10 12h4"/></svg>`,
  search: `<svg width="16" height="16" viewBox="0 0 24 24" ${SVG_BASE}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.8-3.8"/></svg>`,
  globe: `<svg width="16" height="16" viewBox="0 0 24 24" ${SVG_BASE}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13 13 0 0 1 0 18"/><path d="M12 3a13 13 0 0 0 0 18"/></svg>`,
  upload: `<svg width="16" height="16" viewBox="0 0 24 24" ${SVG_BASE}><path d="M12 16V4"/><path d="M7 9l5-5 5 5"/><path d="M4 20h16"/></svg>`,
  layers: `<svg width="16" height="16" viewBox="0 0 24 24" ${SVG_BASE}><polygon points="12 3 21 8 12 13 3 8 12 3"/><path d="M3 13l9 5 9-5"/><path d="M3 18l9 5 9-5"/></svg>`,
  user: `<svg width="16" height="16" viewBox="0 0 24 24" ${SVG_BASE}><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>`,
  logout: `<svg width="16" height="16" viewBox="0 0 24 24" ${SVG_BASE}><path d="M9 4H4v16h5"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>`,
  calendar: `<svg width="15" height="15" viewBox="0 0 24 24" ${SVG_BASE}><rect x="3" y="5" width="18" height="16"/><path d="M3 10h18"/><path d="M8 3v4M16 3v4"/></svg>`,
  folder: `<svg width="15" height="15" viewBox="0 0 24 24" ${SVG_BASE}><path d="M3 6h6l2 2h10v11H3z"/></svg>`,
  file: `<svg width="15" height="15" viewBox="0 0 24 24" ${SVG_BASE}><path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/></svg>`,
  image: `<svg width="16" height="16" viewBox="0 0 24 24" ${SVG_BASE}><rect x="3" y="4" width="18" height="16"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5-6 6-3-3-4 4"/></svg>`,
  edit: `<svg width="15" height="15" viewBox="0 0 24 24" ${SVG_BASE}><path d="M15 4l5 5-11 11H4v-5z"/></svg>`,
  trash: `<svg width="15" height="15" viewBox="0 0 24 24" ${SVG_BASE}><path d="M4 6h16"/><path d="M9 6V4h6v2"/><path d="M6 6l1 14h10l1-14"/></svg>`,
  share: `<svg width="15" height="15" viewBox="0 0 24 24" ${SVG_BASE}><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.3 10.8l7.4-4.6M8.3 13.2l7.4 4.6"/></svg>`,
  link: `<svg width="15" height="15" viewBox="0 0 24 24" ${SVG_BASE}><path d="M10 14a4 4 0 0 1 0-5.6l3-3a4 4 0 0 1 5.6 5.6l-1.5 1.5"/><path d="M14 10a4 4 0 0 1 0 5.6l-3 3a4 4 0 0 1-5.6-5.6l1.5-1.5"/></svg>`,
  plus: `<svg width="15" height="15" viewBox="0 0 24 24" ${SVG_BASE}><path d="M12 5v14M5 12h14"/></svg>`,
  arrowRight: `<svg width="15" height="15" viewBox="0 0 24 24" ${SVG_BASE}><path d="M4 12h16M14 6l6 6-6 6"/></svg>`,
  tag: `<svg width="15" height="15" viewBox="0 0 24 24" ${SVG_BASE}><path d="M4 4h7l9 9-7 7-9-9z"/><circle cx="8.5" cy="8.5" r="1"/></svg>`,
  grid: `<svg width="15" height="15" viewBox="0 0 24 24" ${SVG_BASE}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
  check: `<svg width="15" height="15" viewBox="0 0 24 24" ${SVG_BASE}><path d="M4 12l5 5L20 6"/></svg>`,
  copy: `<svg width="15" height="15" viewBox="0 0 24 24" ${SVG_BASE}><rect x="8" y="8" width="12" height="12"/><path d="M4 16V4h12"/></svg>`
};

export function icon(name, extraClass = '') {
  const svg = ICONS[name] || ICONS.file;
  if (!extraClass) return svg;
  return svg.replace('<svg ', `<svg class="${extraClass}" `);
}
