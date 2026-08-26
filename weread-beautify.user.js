// ==UserScript==
// @name         微信读书阅读页美化
// @namespace    https://github.com/orz-ai
// @version      1.0.0
// @description  阅读页内容宽度调整，目录固定靠边。
// @match        https://weread.qq.com/web/reader/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  const ID = 'wr-width-unlimit';
  if (document.getElementById(ID)) return;

  const style = document.createElement('style');
  style.id = ID;
  style.textContent = `
    /* 阅读区宽度：--wr-format-width 变量控制，默认 none=满宽 */
    .readerContent .app_content,
    .app_content,
    .wr_mp_app_content {
      max-width: var(--wr-format-width, none) !important;
    }
    .readerTopBar {
      max-width: var(--wr-format-width, none) !important;
    }
    /* 下滑自动隐藏 header，上滑恢复 */
    html.wr-header-hide .readerTopBar {
      transform: translateY(-100%) !important;
      transition: transform .25s ease !important;
    }
    html:not(.wr-header-hide) .readerTopBar {
      transform: translateY(0) !important;
      transition: transform .25s ease !important;
    }
    /* 右侧工具条右边缘对齐 header 头像 */
    .readerControls {
      left: auto !important;
      right: 24px !important;
    }
    /* F 键沉浸式阅读：按 F 隐藏顶栏/工具条/底部/进度/栏宽面板，再按恢复 */
    html.wr-focus .readerTopBar,
    html.wr-focus .readerControls,
    html.wr-focus .readerFooter,
    html.wr-focus .wr-pdf-pagemeter,
    html.wr-focus .wr-width-panel,
    html.wr-focus .readerCatalog {
      opacity: 0 !important;
      pointer-events: none !important;
      transition: opacity .2s ease !important;
    }
    /* ===== 目录固定侧栏：钉在内容左缘、和正文同一层（按 c 键开/关） ===== */
    html.wr-cat-on .readerCatalog {
      display: flex !important;
      flex-direction: column;
      position: fixed !important;
      top: 0 !important;
      left: var(--wr-cat-left, 0px) !important;
      bottom: 0 !important;
      width: 300px !important;
      height: auto !important;
      z-index: 500 !important;
      transform: translateX(0) !important;
      overflow: hidden;
      background: var(--wr-cat-bg, #ffffff) !important;
      border-right: none !important;
      box-shadow: none !important;
    }
    html.wr-cat-on .readerContent { padding-left: 300px !important; }
    html.wr-cat-on .app_content { transform: none !important; }
    html:not(.wr-cat-on) .readerCatalog { display: none !important; }
    html:not(.wr-cat-on) .readerContent { padding-left: 0 !important; }
    /* 沉浸时目录一并收起、正文还原居中 */
    html.wr-focus .readerCatalog { display: none !important; }
    html.wr-focus .readerContent { padding-left: 0 !important; }
    /* 目录独立滚动：滚目录时正文不动 */
    html.wr-cat-on .readerCatalog { overscroll-behavior: contain !important; }
    html.wr-cat-on .readerCatalog .ps-container {
      overflow-y: auto !important;
      flex: 1 !important;
      min-height: 0 !important;
      overscroll-behavior: contain !important;
    }
    html.wr-cat-on .readerCatalog .ps-container::-webkit-scrollbar { width: 6px; }
    html.wr-cat-on .readerCatalog .ps-container::-webkit-scrollbar-thumb { background: rgba(17,24,39,.18); border-radius: 3px; }
    /* 隐藏 perfect-scrollbar 自带轨道,只留原生一条滚动条 */
    html.wr-cat-on .readerCatalog .ps__scrollbar-y-rail,
    html.wr-cat-on .readerCatalog .ps__rail-y { display: none !important; }
    /* 去掉目录里的书名信息块和操作块 */
    html.wr-cat-on .readerCatalog .readerCatalog_bookInfo,
    html.wr-cat-on .readerCatalog .readerCatalog_actions { display: none !important; }
    /* ===== 底部章节进度条（细蓝线，横向铺满窗口） ===== */
    .wr-pdf-progressbar {
      position: fixed; left: 0; right: 0; bottom: 0;
      height: 3px; z-index: 2147483646; display: none;
    }
    .wr-pdf-progressbar > span {
      display: block; height: 100%; width: 0;
      background: linear-gradient(90deg,#4a9eff,#6ab3ff);
      box-shadow: 0 0 6px rgba(74,158,255,.6);
      transition: width .08s linear;
    }
    /* ===== 底部中央：当前章节进度胶囊 ===== */
    .wr-pdf-pagemeter {
      position: fixed; left: 50%; bottom: 18px; transform: translateX(-50%);
      background: rgba(255,255,255,.92); color: #374151;
      font: 12px/1 -apple-system,"PingFang SC",sans-serif; padding: 9px 16px; border-radius: 999px;
      box-shadow: 0 4px 16px rgba(17,24,39,.14), inset 0 0 0 1px rgba(17,24,39,.06);
      z-index: 2147483647; pointer-events: none; opacity: 0;
      transition: opacity .2s ease; white-space: nowrap;
    }
    .wr-pdf-pagemeter.wr-pdf-visible { opacity: 1; }
    /* ===== 右侧工具条「栏宽」控件 ===== */
    .wr-width-item { color: #717882 !important; }
    body.wr_blackTheme .wr-width-item,
    body.wr_darkTheme .wr-width-item,
    body[class*="blackTheme"] .wr-width-item { color: #e8eaed !important; }
    .wr-width-item .icon {
      display: inline-flex; align-items: center; justify-content: center;
      width: 100%; height: 100%; color: inherit;
    }
    .wr-width-panel {
      position: fixed; z-index: 2147483647;
      background: rgba(255,255,255,.98);
      border-radius: 12px;
      box-shadow: 0 8px 28px rgba(17,24,39,.18), inset 0 0 0 1px rgba(17,24,39,.06);
      padding: 12px 14px; width: 190px;
      font: 12px/1 -apple-system,"PingFang SC",sans-serif; color: #374151;
      display: none;
    }
    .wr-width-panel.wr-width-open { display: block; }
    .wr-width-panel-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .wr-width-panel-row label { color: #6b7280; }
    .wr-width-panel input[type=range] { flex: 1; min-width: 0; accent-color: #4a9eff; }
    .wr-width-panel .val { min-width: 44px; text-align: right; color: #374151; }
    .wr-width-panel .btn {
      width: 100%; margin-top: 10px; padding: 6px 10px; border: none; border-radius: 8px;
      background: #eef1f5; color: #555; font-size: 12px; cursor: pointer;
    }
    .wr-width-panel .btn:hover { background: #e2e6ec; }
  `;
  (document.head || document.documentElement).appendChild(style);

  // ===== 读取已保存的行宽，应用到本次加载（正文渲染前需生效，刷新后重排版） =====
  function formatWidth() {
    let w = 0;
    try { w = parseInt(localStorage.getItem('wr_reading_width'), 10) || 0; } catch (e) {}
    document.documentElement.style.setProperty('--wr-format-width', w ? w + 'px' : 'none');
    return w;
  }
  const currentWidth = formatWidth();

  // ===== 底部章节进度 =====
  const progressbar = document.createElement('div');
  progressbar.className = 'wr-pdf-progressbar';
  progressbar.innerHTML = '<span></span>';
  const barSpan = progressbar.firstChild;
  const pagemeter = document.createElement('div');
  pagemeter.className = 'wr-pdf-pagemeter';
  pagemeter.textContent = '0%';
  (document.body || document.documentElement).appendChild(progressbar);
  (document.body || document.documentElement).appendChild(pagemeter);
  if (document.body) progressbar.style.display = 'block';

  let meterTimer = null;
  let lastMeterText = '';
  function updateProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    barSpan.style.width = (pct * 100).toFixed(1) + '%';
    const text = Math.round(pct * 100) + '% 已读';
    if (text !== lastMeterText) { lastMeterText = text; pagemeter.textContent = text; }
  }
  function showMeter() {
    pagemeter.classList.add('wr-pdf-visible');
    clearTimeout(meterTimer);
    meterTimer = setTimeout(() => pagemeter.classList.remove('wr-pdf-visible'), 1200);
  }
  document.addEventListener('scroll', () => { updateProgress(); showMeter(); }, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  // ===== 下滑隐藏 header，上滑显示 header =====
  let lastScrollY = window.scrollY;
  let headerHidden = false;
  document.addEventListener('scroll', () => {
    const y = window.scrollY;
    const dy = y - lastScrollY;
    if (Math.abs(dy) > 8) {
      const hide = dy > 0 && y > 80; // 往下滚且离开顶部才隐藏
      if (hide !== headerHidden) {
        headerHidden = hide;
        document.documentElement.classList.toggle('wr-header-hide', hide);
      }
    }
    lastScrollY = y;
  }, { passive: true });

  // ===== 右侧工具条：栏宽滑块（类似字号滑块） =====
  function buildWidthControl() {
    if (document.getElementById('wr-width-item')) return true;
    const rc = document.querySelector('.readerControls');
    if (!rc) return false;
    // 工具条按钮（带图标，和旁边其他按钮一致；悬停显示栏宽提示）
    const item = document.createElement('button');
    item.id = 'wr-width-item';
    item.className = 'readerControls_item wr-width-item';
    item.title = '栏宽';
    item.innerHTML = '<span class="icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 H21"/><path d="M6 9 L3 12 L6 15"/><path d="M18 9 L21 12 L18 15"/></svg></span>';
    rc.appendChild(item);
    // 面板（干净版：就滑块 + 值 + 恢复满宽）
    const panel = document.createElement('div');
    panel.id = 'wr-width-panel';
    panel.className = 'wr-width-panel';
    panel.innerHTML =
      '<div class="wr-width-panel-row"><label>栏宽</label><input type="range" min="600" max="2400" step="20"><span class="val">—</span></div>' +
      '<button class="btn">恢复满宽</button>';
    document.body.appendChild(panel);
    const slider = panel.querySelector('input');
    const val = panel.querySelector('.val');
    const stored = parseInt(localStorage.getItem('wr_reading_width'), 10) || 0;
    if (stored) slider.value = Math.min(Math.max(stored, 600), 2400);
    val.textContent = stored ? stored + 'px' : '满宽';
    slider.addEventListener('input', () => {
      const v = parseInt(slider.value, 10);
      val.textContent = v + 'px';
      try { localStorage.setItem('wr_reading_width', String(v)); } catch (e) {}
    });
    panel.querySelector('.btn').addEventListener('click', () => {
      try { localStorage.removeItem('wr_reading_width'); } catch (e) {}
      val.textContent = '满宽';
    });
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('wr-width-open');
      if (panel.classList.contains('wr-width-open')) {
        const ir = item.getBoundingClientRect();
        const pw = panel.offsetWidth, ph = panel.offsetHeight;
        let top = ir.top + ir.height / 2 - ph / 2;
        if (top < 8) top = 8;
        if (top + ph > innerHeight - 8) top = innerHeight - ph - 8;
        let left = ir.left - pw - 12;
        if (left < 8) left = ir.left + ir.width + 12;
        panel.style.top = Math.round(top) + 'px';
        panel.style.left = Math.round(left) + 'px';
      }
    });
    // 点击面板以外的地方关闭（和其他面板一致）
    document.addEventListener('click', (e) => {
      const p = document.getElementById('wr-width-panel');
      const it = document.getElementById('wr-width-item');
      if (!p || !p.classList.contains('wr-width-open')) return;
      if (e.target !== it && !it.contains(e.target) && !p.contains(e.target)) {
        p.classList.remove('wr-width-open');
      }
    });
    return true;
  }
  buildWidthControl();

  setInterval(() => { updateProgress(); buildWidthControl(); placeCatalog(); }, 1500);

  // ===== 目录固定侧栏：默认开启，c 键切换 =====
  document.documentElement.classList.add('wr-cat-on');

  // 让目录左缘始终紧贴正文左缘（跟随栏宽/缩放变化），并跟随主题配色
  function placeCatalog() {
    const ac = document.querySelector('.app_content');
    if (!ac) return;
    const on = document.documentElement.classList.contains('wr-cat-on');
    const focus = document.documentElement.classList.contains('wr-focus');
    const r = ac.getBoundingClientRect();
    if (on && !focus) {
      // 目录紧贴正文左缘
      document.documentElement.style.setProperty('--wr-cat-left', Math.round(r.left - 300) + 'px');
      // header 与正文同宽同左缘，保持对齐
      const hd = document.querySelector('.readerTopBar');
      if (hd) { hd.style.left = Math.round(r.left) + 'px'; hd.style.width = Math.round(r.width) + 'px'; }
    } else {
      document.documentElement.style.setProperty('--wr-cat-left', '0px');
      const hd = document.querySelector('.readerTopBar');
      if (hd) { hd.style.left = ''; hd.style.width = ''; }
    }
    const dark = /blackTheme|darkTheme/i.test(document.body.className);
    document.documentElement.style.setProperty('--wr-cat-bg', dark ? '#23262b' : '#ffffff');
  }
  placeCatalog();
  window.addEventListener('resize', placeCatalog);

  // ===== F 键沉浸式阅读 / c 键目录开关 =====
  document.addEventListener('keydown', (e) => {
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (e.key === 'f') {
      document.documentElement.classList.toggle('wr-focus');
    } else if (e.key === 'c') {
      document.documentElement.classList.toggle('wr-cat-on');
    }
  });
})();
