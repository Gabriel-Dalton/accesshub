
(function () {
  'use strict';

  
  const SK = 'aw_prefs_v1';

  
  const DEFAULTS = {
    textSize: 0,
    letterSpacing: 0,
    wordSpacing: 0,
    lineHeight: 0,
    readableFont: false,
    dyslexiaFont: false,
    highlightLinks: false,
    highlightHeadings: false,
    pauseAnimations: false,
    highContrast: false,
    bwMode: false,
    invertColors: false,
    colorBlind: 'none',
    readingMask: false,
    readingGuide: false,
    largeCursor: false,
    hideImages: false,
  };

  
  function load() {
    try {
      const raw = localStorage.getItem(SK);
      return raw ? Object.assign({}, DEFAULTS, JSON.parse(raw)) : Object.assign({}, DEFAULTS);
    } catch { return Object.assign({}, DEFAULTS); }
  }

  function save(state) {
    try { localStorage.setItem(SK, JSON.stringify(state)); } catch {}
  }

  
  let S = load();
  let panelOpen = false;
  let ttsUtterance = null;
  let ttsSpeaking = false;
  let maskOverlay = null;
  let guideLine = null;

  
  const ICONS = {
    person: `<svg viewBox="0 0 24 24"><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    textUp: `<svg viewBox="0 0 24 24"><path d="M5 17h3.5l1-2.5h5l1 2.5H19L13 3h-2L5 17zm5.5-5L12 7.3l1.5 4.7h-3z"/><path d="M20 19h-2v-2h-2v2h-2v2h2v2h2v-2h2v-2z"/></svg>`,
    textDown: `<svg viewBox="0 0 24 24"><path d="M5 17h3.5l1-2.5h5l1 2.5H19L13 3h-2L5 17zm5.5-5L12 7.3l1.5 4.7h-3z"/><path d="M14 19h6v2h-6z"/></svg>`,
    textReset: `<svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z"/></svg>`,
    letters: `<svg viewBox="0 0 24 24"><path d="M2 17h2v-5h5v5h2V7H9v3H4V7H2v10zm12-2.5h4l.7 2.5H21L17 7h-2l-4 9.5h2.3l.7-2zm2-5.3l1.3 3.7h-2.6L16 9.2z"/></svg>`,
    wordSpace: `<svg viewBox="0 0 24 24"><path d="M9 11H3v2h6v2l3-3-3-3v2zm6 2h6v-2h-6V9l-3 3 3 3v-2z"/></svg>`,
    lineHeight: `<svg viewBox="0 0 24 24"><path d="M6 7h2.5L5 3 1.5 7H4v10H1.5L5 21l3.5-4H6V7zm4 1v2h8V8h-8zm0 4v2h8v-2h-8zm0 4v2h8v-2h-8z"/></svg>`,
    fontSwap: `<svg viewBox="0 0 24 24"><path d="M3 9v10h2V9H3zm4-4v14h2V5H7zm4 7v7h2v-7h-2zm4-3v10h2V9h-2zm4 2v8h2v-8h-2z"/></svg>`,
    dyslexia: `<svg viewBox="0 0 24 24"><path d="M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm0 16a7 7 0 1 1 0-14A7 7 0 0 1 12 19zm1-11h-2v6h2V8zm0 8h-2v2h2v-2z"/></svg>`,
    link: `<svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.7 1.3-3 3-3H9V7H6.9C4.2 7 2 9.2 2 12s2.2 5 4.9 5H9v-2H6.9C5.2 15 3.9 13.7 3.9 12zM8 13h8v-2H8v2zm9-6h-2v2h2.1c1.7 0 3 1.3 3 3s-1.3 3-3 3H15v2h2.1C19.8 17 22 14.8 22 12s-2.2-5-5-5z"/></svg>`,
    heading: `<svg viewBox="0 0 24 24"><path d="M5 4v3h5.5v12h3V7H19V4z"/></svg>`,
    pause: `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`,
    contrast: `<svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18V4c4.4 0 8 3.6 8 8s-3.6 8-8 8z"/></svg>`,
    bw: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/></svg>`,
    invert: `<svg viewBox="0 0 24 24"><path d="M12 1L3 12l9 11 9-11L12 1zm0 3.5L18.3 12H12V4.5z"/></svg>`,
    eye: `<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/></svg>`,
    mask: `<svg viewBox="0 0 24 24"><path d="M2 4v16h20V4H2zm18 2v3H4V6h16zM4 18v-3h16v3H4zm0-5v-2h16v2H4z"/></svg>`,
    guide: `<svg viewBox="0 0 24 24"><path d="M3 11h18v2H3z"/></svg>`,
    cursor: `<svg viewBox="0 0 24 24"><path d="M4 0l16 10-7 1.5L9 20 4 0z"/></svg>`,
    image: `<svg viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-1 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>`,
    speaker: `<svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4zM14 3.2v2.1c2.9.9 5 3.6 5 6.7s-2.1 5.8-5 6.7v2.1c4-.9 7-4.5 7-8.8s-3-7.9-7-8.8z"/></svg>`,
    stop: `<svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>`,
    reset: `<svg viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6s-2.7 6-6 6-6-2.7-6-6H4c0 4.4 3.6 8 8 8s8-3.6 8-8-3.6-8-8-8z"/></svg>`,
  };

  
  const effectStyle = document.createElement('style');
  effectStyle.id = 'aw-effect-styles';
  document.head.appendChild(effectStyle);

  function updateEffectStyles() {
    const rules = [];

    
    if (S.textSize !== 0) {
      const pct = 100 + S.textSize * 10;
      rules.push(`html.aw-text-size { font-size: ${pct}% !important; }`);
    }

    
    if (S.letterSpacing !== 0) {
      const val = (S.letterSpacing * 0.05).toFixed(2);
      rules.push(`html.aw-letter-spacing * { letter-spacing: ${val}em !important; }`);
    }

    
    if (S.wordSpacing !== 0) {
      const val = (S.wordSpacing * 0.15).toFixed(2);
      rules.push(`html.aw-word-spacing * { word-spacing: ${val}em !important; }`);
    }

    
    if (S.lineHeight !== 0) {
      const val = (1.6 + S.lineHeight * 0.2).toFixed(2);
      rules.push(`html.aw-line-height * { line-height: ${val} !important; }`);
    }

    
    if (S.readableFont) {
      rules.push(`html.aw-readable-font, html.aw-readable-font * {
        font-family: Georgia, 'Times New Roman', serif !important;
      }`);
    }

    
    if (S.dyslexiaFont) {
      rules.push(`@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap');`);
      rules.push(`html.aw-dyslexia-font, html.aw-dyslexia-font * {
        font-family: 'Lexend', 'OpenDyslexic', Arial, sans-serif !important;
        letter-spacing: .04em !important;
        word-spacing: .1em !important;
      }`);
    }

    
    if (S.highlightLinks) {
      rules.push(`html.aw-highlight-links a {
        background: #fef08a !important;
        color: #1a1a1a !important;
        text-decoration: underline !important;
        outline: 2px solid #ca8a04 !important;
        border-radius: 2px;
        padding: 0 2px;
      }`);
    }

    
    if (S.highlightHeadings) {
      rules.push(`html.aw-highlight-headings h1,
      html.aw-highlight-headings h2,
      html.aw-highlight-headings h3,
      html.aw-highlight-headings h4,
      html.aw-highlight-headings h5,
      html.aw-highlight-headings h6 {
        background: linear-gradient(135deg, #dbeafe, #ede9fe) !important;
        border-left: 4px solid #4f46e5 !important;
        padding-left: 10px !important;
        border-radius: 0 6px 6px 0;
      }`);
    }

    
    if (S.pauseAnimations) {
      rules.push(`html.aw-pause-animations *,
      html.aw-pause-animations *::before,
      html.aw-pause-animations *::after {
        animation-play-state: paused !important;
        transition-duration: 0ms !important;
      }`);
    }

    
    if (S.highContrast) {
      rules.push(`html.aw-high-contrast {
        filter: contrast(1.8) !important;
      }`);
    }

    
    if (S.bwMode) {
      rules.push(`html.aw-bw { filter: grayscale(1) !important; }`);
    }

    
    if (S.invertColors) {
      rules.push(`html.aw-invert { filter: invert(1) hue-rotate(180deg) !important; }`);
    }

    
    const cbFilters = {
      protanopia:   'url(#aw-protanopia)',
      deuteranopia: 'url(#aw-deuteranopia)',
      tritanopia:   'url(#aw-tritanopia)',
      achromatopsia:'grayscale(1)',
    };
    if (S.colorBlind !== 'none' && cbFilters[S.colorBlind]) {
      rules.push(`html.aw-colorblind { filter: ${cbFilters[S.colorBlind]} !important; }`);
    }

    
    if (S.largeCursor) {
      rules.push(`html.aw-cursor-large, html.aw-cursor-large * {
        cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 32 32'%3E%3Cpath d='M4 2l20 12-8 2-5 9z' fill='%23111' stroke='%23fff' stroke-width='1.5'/%3E%3C/svg%3E") 4 2, auto !important;
      }`);
    }

    
    if (S.hideImages) {
      rules.push(`html.aw-hide-images img,
      html.aw-hide-images picture,
      html.aw-hide-images video,
      html.aw-hide-images canvas {
        display: none !important;
      }`);
    }

    effectStyle.textContent = rules.join('\n');
  }

  
  function applyClasses() {
    const h = document.documentElement;
    const map = {
      'aw-text-size':          S.textSize !== 0,
      'aw-letter-spacing':     S.letterSpacing !== 0,
      'aw-word-spacing':       S.wordSpacing !== 0,
      'aw-line-height':        S.lineHeight !== 0,
      'aw-readable-font':      S.readableFont,
      'aw-dyslexia-font':      S.dyslexiaFont,
      'aw-highlight-links':    S.highlightLinks,
      'aw-highlight-headings': S.highlightHeadings,
      'aw-pause-animations':   S.pauseAnimations,
      'aw-high-contrast':      S.highContrast,
      'aw-bw':                 S.bwMode,
      'aw-invert':             S.invertColors,
      'aw-colorblind':         S.colorBlind !== 'none',
      'aw-cursor-large':       S.largeCursor,
      'aw-hide-images':        S.hideImages,
    };
    Object.entries(map).forEach(([cls, on]) => h.classList.toggle(cls, on));
    updateEffectStyles();
  }

  
  function injectSVGFilters() {
    if (document.getElementById('aw-cb-filters')) return;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.id = 'aw-cb-filters';
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none;';
    svg.innerHTML = `<defs>
      <filter id="aw-protanopia">
        <feColorMatrix type="matrix" values="
          0.567 0.433 0 0 0
          0.558 0.442 0 0 0
          0 0.242 0.758 0 0
          0 0 0 1 0"/>
      </filter>
      <filter id="aw-deuteranopia">
        <feColorMatrix type="matrix" values="
          0.625 0.375 0 0 0
          0.7 0.3 0 0 0
          0 0.3 0.7 0 0
          0 0 0 1 0"/>
      </filter>
      <filter id="aw-tritanopia">
        <feColorMatrix type="matrix" values="
          0.95 0.05 0 0 0
          0 0.433 0.567 0 0
          0 0.475 0.525 0 0
          0 0 0 1 0"/>
      </filter>
    </defs>`;
    document.body.appendChild(svg);
  }

  
  function updateMask() {
    if (!S.readingMask) {
      if (maskOverlay) { maskOverlay.remove(); maskOverlay = null; }
      document.removeEventListener('mousemove', moveMask);
      return;
    }
    if (!maskOverlay) {
      maskOverlay = document.createElement('div');
      maskOverlay.className = 'aw-reading-mask-overlay';
      maskOverlay.setAttribute('aria-hidden', 'true');
      const top = document.createElement('div');
      top.className = 'aw-mask-top';
      const bot = document.createElement('div');
      bot.className = 'aw-mask-bottom';
      maskOverlay.appendChild(top);
      maskOverlay.appendChild(bot);
      document.body.appendChild(maskOverlay);
      document.addEventListener('mousemove', moveMask, { passive: true });
    }
  }

  function moveMask(e) {
    if (!maskOverlay) return;
    const wh = window.innerHeight;
    const gap = 60;
    const y = e.clientY;
    const top = maskOverlay.querySelector('.aw-mask-top');
    const bot = maskOverlay.querySelector('.aw-mask-bottom');
    top.style.height = Math.max(0, y - gap) + 'px';
    bot.style.height = Math.max(0, wh - y - gap) + 'px';
    bot.style.bottom = '0px';
  }

  
  function updateGuide() {
    if (!S.readingGuide) {
      if (guideLine) { guideLine.remove(); guideLine = null; }
      document.removeEventListener('mousemove', moveGuide);
      return;
    }
    if (!guideLine) {
      guideLine = document.createElement('div');
      guideLine.className = 'aw-guide-line';
      guideLine.setAttribute('aria-hidden', 'true');
      document.body.appendChild(guideLine);
      document.addEventListener('mousemove', moveGuide, { passive: true });
    }
  }

  function moveGuide(e) {
    if (guideLine) guideLine.style.top = e.clientY + 'px';
  }

  
  
  function applyImageHiding() {
    document.querySelectorAll('.aw-img-placeholder').forEach(el => el.remove());
    if (!S.hideImages) return;

    const targets = document.querySelectorAll(
      'img:not(picture img), picture, video, canvas'
    );

    targets.forEach(el => {
      if (el.closest('#aw-panel') || el.closest('#aw-trigger') || el.closest('#ls-root')) return;

      const ph = document.createElement('div');
      ph.className = 'aw-img-placeholder';
      ph.setAttribute('role', 'img');
      ph.setAttribute('aria-label', 'Image hidden by accessibility settings');
      ph.innerHTML =
        `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>` +
        `<span>Image hidden &mdash; <button type="button" class="aw-img-placeholder-btn">re-enable in accessibility widget</button></span>`;

      ph.querySelector('.aw-img-placeholder-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        if (!panelOpen) openPanel();
        setTimeout(() => {
          const btn = document.getElementById('aw-hide-images');
          if (!btn) return;
          const body = document.getElementById('aw-body');
          if (body) body.scrollTo({ top: btn.offsetTop - 60, behavior: 'smooth' });
          btn.focus();
          btn.classList.add('aw-highlight-target');
          setTimeout(() => btn.classList.remove('aw-highlight-target'), 2400);
        }, 320);
      });

      el.parentNode.insertBefore(ph, el.nextSibling);
    });
  }

  function applyAll() {
    applyClasses();
    updateMask();
    updateGuide();
    applyImageHiding();
    injectSVGFilters();
    save(S);
  }

  
  function buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'aw-panel';
    panel.className = 'aw-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Accessibility Settings');

    panel.innerHTML = `
      <!-- Header -->
      <div class="aw-header">
        <div class="aw-header-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4.5" r="2.25"/><path d="M3.5 9.5h17v1.75l-5.75.9V16l2.25 6H14.5l-2.5-6-2.5 6H7l2.25-6v-3.85L3.5 11.25V9.5z"/></svg></div>
        <div class="aw-header-text">
          <div class="aw-header-title">Accessibility</div>
          <div class="aw-header-subtitle">Customize your experience</div>
        </div>
        <button class="aw-close-btn" id="aw-close" aria-label="Close accessibility panel">
          ${ICONS.close}
        </button>
      </div>

      <!-- Body -->
      <div class="aw-body" id="aw-body">

        <!-- TEXT SIZE -->
        <div class="aw-section">
          <div class="aw-section-label">Text Size</div>
          <div class="aw-slider-row" id="aw-textsize-row">
            <div class="aw-slider-header">
              <div class="aw-slider-info">
                <div class="aw-slider-icon">${ICONS.textUp}</div>
                <span class="aw-slider-name">Font Size</span>
              </div>
              <span class="aw-slider-val" id="aw-textsize-val">100%</span>
            </div>
            <div class="aw-slider-controls">
              <button class="aw-slider-btn" id="aw-text-dec" aria-label="Decrease text size">−</button>
              <input class="aw-range" id="aw-text-range" type="range" min="-3" max="5" step="1" value="0" aria-label="Text size" />
              <button class="aw-slider-btn" id="aw-text-inc" aria-label="Increase text size">+</button>
            </div>
          </div>
        </div>

        <!-- SPACING -->
        <div class="aw-section">
          <div class="aw-section-label">Spacing</div>
          <div style="display:flex;flex-direction:column;gap:6px;">

            <div class="aw-slider-row">
              <div class="aw-slider-header">
                <div class="aw-slider-info">
                  <div class="aw-slider-icon">${ICONS.letters}</div>
                  <span class="aw-slider-name">Letter Spacing</span>
                </div>
                <span class="aw-slider-val" id="aw-ls-val">Normal</span>
              </div>
              <div class="aw-slider-controls">
                <button class="aw-slider-btn" id="aw-ls-dec" aria-label="Decrease letter spacing">−</button>
                <input class="aw-range" id="aw-ls-range" type="range" min="-2" max="8" step="1" value="0" aria-label="Letter spacing"/>
                <button class="aw-slider-btn" id="aw-ls-inc" aria-label="Increase letter spacing">+</button>
              </div>
            </div>

            <div class="aw-slider-row">
              <div class="aw-slider-header">
                <div class="aw-slider-info">
                  <div class="aw-slider-icon">${ICONS.wordSpace}</div>
                  <span class="aw-slider-name">Word Spacing</span>
                </div>
                <span class="aw-slider-val" id="aw-ws-val">Normal</span>
              </div>
              <div class="aw-slider-controls">
                <button class="aw-slider-btn" id="aw-ws-dec" aria-label="Decrease word spacing">−</button>
                <input class="aw-range" id="aw-ws-range" type="range" min="0" max="8" step="1" value="0" aria-label="Word spacing"/>
                <button class="aw-slider-btn" id="aw-ws-inc" aria-label="Increase word spacing">+</button>
              </div>
            </div>

            <div class="aw-slider-row">
              <div class="aw-slider-header">
                <div class="aw-slider-info">
                  <div class="aw-slider-icon">${ICONS.lineHeight}</div>
                  <span class="aw-slider-name">Line Height</span>
                </div>
                <span class="aw-slider-val" id="aw-lh-val">Normal</span>
              </div>
              <div class="aw-slider-controls">
                <button class="aw-slider-btn" id="aw-lh-dec" aria-label="Decrease line height">−</button>
                <input class="aw-range" id="aw-lh-range" type="range" min="0" max="6" step="1" value="0" aria-label="Line height"/>
                <button class="aw-slider-btn" id="aw-lh-inc" aria-label="Increase line height">+</button>
              </div>
            </div>

          </div>
        </div>

        <!-- FONTS -->
        <div class="aw-section">
          <div class="aw-section-label">Typography</div>
          <div class="aw-grid">
            <button class="aw-btn" id="aw-readable-font" aria-pressed="false">
              <div class="aw-btn-icon">${ICONS.fontSwap}</div>
              <span class="aw-btn-label">Readable Font</span>
            </button>
            <button class="aw-btn" id="aw-dyslexia-font" aria-pressed="false">
              <div class="aw-btn-icon">${ICONS.dyslexia}</div>
              <span class="aw-btn-label">Dyslexia Font</span>
            </button>
          </div>
        </div>

        <!-- HIGHLIGHTS -->
        <div class="aw-section">
          <div class="aw-section-label">Highlights</div>
          <div class="aw-grid">
            <button class="aw-btn" id="aw-highlight-links" aria-pressed="false">
              <div class="aw-btn-icon">${ICONS.link}</div>
              <span class="aw-btn-label">Highlight Links</span>
            </button>
            <button class="aw-btn" id="aw-highlight-headings" aria-pressed="false">
              <div class="aw-btn-icon">${ICONS.heading}</div>
              <span class="aw-btn-label">Highlight Headings</span>
            </button>
          </div>
        </div>

        <!-- COLOR & CONTRAST -->
        <div class="aw-section">
          <div class="aw-section-label">Color & Contrast</div>
          <div class="aw-grid" style="margin-bottom:6px;">
            <button class="aw-btn" id="aw-high-contrast" aria-pressed="false">
              <div class="aw-btn-icon">${ICONS.contrast}</div>
              <span class="aw-btn-label">High Contrast</span>
            </button>
            <button class="aw-btn" id="aw-bw" aria-pressed="false">
              <div class="aw-btn-icon">${ICONS.bw}</div>
              <span class="aw-btn-label">Black & White</span>
            </button>
            <button class="aw-btn" id="aw-invert" aria-pressed="false">
              <div class="aw-btn-icon">${ICONS.invert}</div>
              <span class="aw-btn-label">Invert Colors</span>
            </button>
            <button class="aw-btn" id="aw-pause-anims" aria-pressed="false">
              <div class="aw-btn-icon">${ICONS.pause}</div>
              <span class="aw-btn-label">Pause Motion</span>
            </button>
          </div>
          <!-- Color-blind modes -->
          <div class="aw-cb-section">
            <div class="aw-cb-section-label">Color-blind simulation</div>
            <div class="aw-color-chips" role="group" aria-label="Color-blind simulation mode">
              <button class="aw-chip aw-active" data-cb="none" aria-pressed="true">Normal</button>
              <button class="aw-chip" data-cb="protanopia" aria-pressed="false">Protanopia</button>
              <button class="aw-chip" data-cb="deuteranopia" aria-pressed="false">Deuteranopia</button>
              <button class="aw-chip" data-cb="tritanopia" aria-pressed="false">Tritanopia</button>
              <button class="aw-chip" data-cb="achromatopsia" aria-pressed="false">Achromatopsia</button>
            </div>
          </div>
        </div>

        <!-- READING AIDS -->
        <div class="aw-section">
          <div class="aw-section-label">Reading Aids</div>
          <div class="aw-grid">
            <button class="aw-btn" id="aw-reading-mask" aria-pressed="false">
              <div class="aw-btn-icon">${ICONS.mask}</div>
              <span class="aw-btn-label">Reading Mask</span>
            </button>
            <button class="aw-btn" id="aw-reading-guide" aria-pressed="false">
              <div class="aw-btn-icon">${ICONS.guide}</div>
              <span class="aw-btn-label">Reading Guide</span>
            </button>
            <button class="aw-btn" id="aw-large-cursor" aria-pressed="false">
              <div class="aw-btn-icon">${ICONS.cursor}</div>
              <span class="aw-btn-label">Large Cursor</span>
            </button>
            <button class="aw-btn" id="aw-hide-images" aria-pressed="false">
              <div class="aw-btn-icon">${ICONS.image}</div>
              <span class="aw-btn-label">Hide Images</span>
            </button>
          </div>
        </div>

        <!-- TEXT TO SPEECH -->
        <div class="aw-section">
          <div class="aw-section-label">Text to Speech</div>
          <div class="aw-tts-row">
            <div class="aw-tts-header">
              <div class="aw-slider-icon">${ICONS.speaker}</div>
              <span class="aw-tts-label">Read Aloud</span>
              <span class="aw-tts-status" id="aw-tts-status">Idle</span>
            </div>
            <div class="aw-tts-buttons">
              <button class="aw-tts-btn" id="aw-tts-page" aria-label="Read entire page aloud">
                ${ICONS.speaker}
                Read Page
              </button>
              <button class="aw-tts-btn" id="aw-tts-selection" aria-label="Read selected text aloud">
                ${ICONS.eye}
                Read Selection
              </button>
              <button class="aw-tts-btn" id="aw-tts-stop" aria-label="Stop reading">
                ${ICONS.stop}
                Stop
              </button>
            </div>
          </div>
        </div>

      </div><!-- /.aw-body -->

      <!-- Footer -->
      <div class="aw-footer">
        <button class="aw-reset-btn" id="aw-reset" aria-label="Reset all accessibility settings">
          ${ICONS.reset}
          Reset All Settings
        </button>
      </div>
    `;

    return panel;
  }

  
  function syncUI() {
    
    const tr = document.getElementById('aw-text-range');
    const tv = document.getElementById('aw-textsize-val');
    if (tr) tr.value = S.textSize;
    if (tv) tv.textContent = (100 + S.textSize * 10) + '%';

    
    const lr = document.getElementById('aw-ls-range');
    const lv = document.getElementById('aw-ls-val');
    if (lr) lr.value = S.letterSpacing;
    if (lv) lv.textContent = S.letterSpacing === 0 ? 'Normal' : (S.letterSpacing > 0 ? '+' : '') + (S.letterSpacing * 0.05).toFixed(2) + 'em';

    
    const wr = document.getElementById('aw-ws-range');
    const wv = document.getElementById('aw-ws-val');
    if (wr) wr.value = S.wordSpacing;
    if (wv) wv.textContent = S.wordSpacing === 0 ? 'Normal' : '+' + (S.wordSpacing * 0.15).toFixed(2) + 'em';

    
    const lhr = document.getElementById('aw-lh-range');
    const lhv = document.getElementById('aw-lh-val');
    if (lhr) lhr.value = S.lineHeight;
    if (lhv) lhv.textContent = S.lineHeight === 0 ? 'Normal' : (1.6 + S.lineHeight * 0.2).toFixed(2) + 'x';

    
    const toggleMap = {
      'aw-readable-font':      S.readableFont,
      'aw-dyslexia-font':      S.dyslexiaFont,
      'aw-highlight-links':    S.highlightLinks,
      'aw-highlight-headings': S.highlightHeadings,
      'aw-high-contrast':      S.highContrast,
      'aw-bw':                 S.bwMode,
      'aw-invert':             S.invertColors,
      'aw-pause-anims':        S.pauseAnimations,
      'aw-reading-mask':       S.readingMask,
      'aw-reading-guide':      S.readingGuide,
      'aw-large-cursor':       S.largeCursor,
      'aw-hide-images':        S.hideImages,
    };
    Object.entries(toggleMap).forEach(([id, on]) => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.toggle('aw-active', on);
        el.setAttribute('aria-pressed', String(on));
      }
    });

    
    document.querySelectorAll('.aw-chip[data-cb]').forEach(c => {
      const active = c.dataset.cb === S.colorBlind;
      c.classList.toggle('aw-active', active);
      c.setAttribute('aria-pressed', String(active));
    });
  }

  
  function openPanel() {
    const panel = document.getElementById('aw-panel');
    const trigger = document.getElementById('aw-trigger');
    if (!panel) return;
    panelOpen = true;
    panel.classList.add('aw-open');
    trigger.setAttribute('aria-expanded', 'true');
    const firstFocusable = panel.querySelector('button, [tabindex="0"]');
    if (firstFocusable) firstFocusable.focus();
    syncUI();
  }

  function closePanel() {
    const panel = document.getElementById('aw-panel');
    const trigger = document.getElementById('aw-trigger');
    if (!panel) return;
    panelOpen = false;
    panel.classList.remove('aw-open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
  }

  
  function trapFocus(e) {
    if (!panelOpen) return;
    const panel = document.getElementById('aw-panel');
    if (!panel) return;
    const focusable = Array.from(panel.querySelectorAll(
      'button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    }
    if (e.key === 'Escape') closePanel();
  }

  
  function ttsSpeak(text) {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1;
    ttsUtterance = utter;
    ttsSpeaking = true;
    const status = document.getElementById('aw-tts-status');
    if (status) status.textContent = 'Speaking…';
    utter.onend = () => {
      ttsSpeaking = false;
      if (status) status.textContent = 'Idle';
    };
    utter.onerror = () => {
      ttsSpeaking = false;
      if (status) status.textContent = 'Idle';
    };
    window.speechSynthesis.speak(utter);
  }

  function ttsStop() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    ttsSpeaking = false;
    const status = document.getElementById('aw-tts-status');
    if (status) status.textContent = 'Idle';
  }

  
  function wireEvents() {
    
    document.getElementById('aw-trigger').addEventListener('click', () => {
      panelOpen ? closePanel() : openPanel();
    });

    
    document.getElementById('aw-close').addEventListener('click', closePanel);

    
    document.addEventListener('click', e => {
      if (!panelOpen) return;
      const panel = document.getElementById('aw-panel');
      const trigger = document.getElementById('aw-trigger');
      if (panel && !panel.contains(e.target) && !trigger.contains(e.target)) {
        closePanel();
      }
    });

    
    document.addEventListener('keydown', trapFocus);

    
    document.getElementById('aw-text-range').addEventListener('input', e => {
      S.textSize = +e.target.value;
      syncUI();
      applyAll();
    });
    document.getElementById('aw-text-dec').addEventListener('click', () => {
      S.textSize = Math.max(-3, S.textSize - 1);
      syncUI();
      applyAll();
    });
    document.getElementById('aw-text-inc').addEventListener('click', () => {
      S.textSize = Math.min(5, S.textSize + 1);
      syncUI();
      applyAll();
    });

    
    document.getElementById('aw-ls-range').addEventListener('input', e => {
      S.letterSpacing = +e.target.value;
      syncUI();
      applyAll();
    });
    document.getElementById('aw-ls-dec').addEventListener('click', () => {
      S.letterSpacing = Math.max(-2, S.letterSpacing - 1);
      syncUI();
      applyAll();
    });
    document.getElementById('aw-ls-inc').addEventListener('click', () => {
      S.letterSpacing = Math.min(8, S.letterSpacing + 1);
      syncUI();
      applyAll();
    });

    
    document.getElementById('aw-ws-range').addEventListener('input', e => {
      S.wordSpacing = +e.target.value;
      syncUI();
      applyAll();
    });
    document.getElementById('aw-ws-dec').addEventListener('click', () => {
      S.wordSpacing = Math.max(0, S.wordSpacing - 1);
      syncUI();
      applyAll();
    });
    document.getElementById('aw-ws-inc').addEventListener('click', () => {
      S.wordSpacing = Math.min(8, S.wordSpacing + 1);
      syncUI();
      applyAll();
    });

    
    document.getElementById('aw-lh-range').addEventListener('input', e => {
      S.lineHeight = +e.target.value;
      syncUI();
      applyAll();
    });
    document.getElementById('aw-lh-dec').addEventListener('click', () => {
      S.lineHeight = Math.max(0, S.lineHeight - 1);
      syncUI();
      applyAll();
    });
    document.getElementById('aw-lh-inc').addEventListener('click', () => {
      S.lineHeight = Math.min(6, S.lineHeight + 1);
      syncUI();
      applyAll();
    });

    
    const toggles = {
      'aw-readable-font':      () => { S.readableFont = !S.readableFont; if (S.readableFont) S.dyslexiaFont = false; },
      'aw-dyslexia-font':      () => { S.dyslexiaFont = !S.dyslexiaFont; if (S.dyslexiaFont) S.readableFont = false; },
      'aw-highlight-links':    () => { S.highlightLinks    = !S.highlightLinks; },
      'aw-highlight-headings': () => { S.highlightHeadings = !S.highlightHeadings; },
      'aw-high-contrast':      () => { S.highContrast      = !S.highContrast; },
      'aw-bw':                 () => { S.bwMode            = !S.bwMode; },
      'aw-invert':             () => { S.invertColors      = !S.invertColors; },
      'aw-pause-anims':        () => { S.pauseAnimations   = !S.pauseAnimations; },
      'aw-reading-mask':       () => { S.readingMask       = !S.readingMask; },
      'aw-reading-guide':      () => { S.readingGuide      = !S.readingGuide; },
      'aw-large-cursor':       () => { S.largeCursor       = !S.largeCursor; },
      'aw-hide-images':        () => { S.hideImages        = !S.hideImages; },
    };
    Object.entries(toggles).forEach(([id, fn]) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => { fn(); syncUI(); applyAll(); });
    });

    
    document.querySelectorAll('.aw-chip[data-cb]').forEach(chip => {
      chip.addEventListener('click', () => {
        S.colorBlind = chip.dataset.cb;
        syncUI();
        applyAll();
      });
    });

    
    document.getElementById('aw-tts-page').addEventListener('click', () => {
      const body = document.body.innerText || document.body.textContent || '';
      ttsSpeak(body.trim().slice(0, 8000));
    });
    document.getElementById('aw-tts-selection').addEventListener('click', () => {
      const sel = window.getSelection ? window.getSelection().toString().trim() : '';
      if (sel) {
        ttsSpeak(sel);
      } else {
        const status = document.getElementById('aw-tts-status');
        if (status) { status.textContent = 'No text selected'; setTimeout(() => { status.textContent = 'Idle'; }, 2000); }
      }
    });
    document.getElementById('aw-tts-stop').addEventListener('click', ttsStop);

    
    document.getElementById('aw-reset').addEventListener('click', () => {
      ttsStop();
      S = Object.assign({}, DEFAULTS);
      syncUI();
      applyAll();
      save(S);
    });
  }

  
  function init() {
    
    const trigger = document.createElement('button');
    trigger.id = 'aw-trigger';
    trigger.className = 'aw-trigger';
    trigger.setAttribute('aria-label', 'Open accessibility settings');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('aria-controls', 'aw-panel');
    trigger.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true" fill="white"><circle cx="12" cy="4.5" r="2.25"/><path d="M3.5 9.5h17v1.75l-5.75.9V16l2.25 6H14.5l-2.5-6-2.5 6H7l2.25-6v-3.85L3.5 11.25V9.5z"/></svg>`;

    
    const panel = buildPanel();

    document.body.appendChild(trigger);
    document.body.appendChild(panel);

    injectSVGFilters();
    applyAll();
    syncUI();
    wireEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
