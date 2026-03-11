# Web-Ready Access Platform

The **Web-Ready Access (WRA) Platform** is a free resource created by [Oasis of Change](https://oasisofchange.org), a youth-led nonprofit focused on digital sustainability. It helps nonprofits, small organizations, and mission-driven teams build websites that are sustainable, accessible, and supported by in-kind technology grants — all without needing a big budget or a technical background.

Live site: **[w-ra.org](https://w-ra.org)**

Supported by the **GLOCAL Foundation** and a **Government of Canada** grant through Service Canada.

---

## What's inside

The Platform is organized into three learning tracks:

| Track | Topic | Description |
|---|---|---|
| 01 | **Digital Sustainability** | How to reduce your website's carbon footprint and build an energy-efficient online presence |
| 02 | **Web Accessibility** | How to make your website usable for everyone, including people with disabilities, and understand the legal requirements |
| 03 | **In-Kind Technology Grants** | How to unlock free software and tools from companies like Google, Microsoft, Canva, and Atlassian |

---

## Repository structure

```
accesshub/
├── index.html          # Coming-soon landing page
├── 404.html            # Custom 404 error page
├── CNAME               # Custom domain (w-ra.org)
├── assets/             # Images and favicons
└── _dev/               # Platform documentation pages (in development)
    ├── hub.html            # Learning platform overview
    ├── getting-started.html
    ├── sustainability.html
    ├── accessibility.html
    ├── tech-grants.html
    ├── hub-theme.css
    └── hub-theme.js
```

---

## Language checker and accessibility widget

The site ships with two built-in front-end tools that can be added to any page without a build step.

### 1) Language checker (language selector)

File: `assets/js/language-selector.js`

What it does:
- Adds a fixed language trigger and searchable language panel
- Uses Google Translate in the background while hiding default Google UI
- Remembers the selected language between visits (localStorage + cookie)
- Supports reset back to English

Include on root-level pages:

```html
<script src="assets/js/language-selector.js" defer></script>
```

Include on pages inside `_dev/`:

```html
<script src="../assets/js/language-selector.js" defer></script>
```

### 2) Accessibility widget

Files:
- `assets/css/accessibility-widget.css`
- `assets/js/accessibility-widget.js`

What it does:
- Adds a floating accessibility button and control panel
- Stores user preferences locally
- Provides text spacing/size controls, readable font modes, contrast and color filters, reduced motion, cursor, reading guide/mask, and media visibility toggles

Include on root-level pages:

```html
<link rel="stylesheet" href="assets/css/accessibility-widget.css" />
<script src="assets/js/accessibility-widget.js"></script>
```

Include on pages inside `_dev/`:

```html
<link rel="stylesheet" href="../assets/css/accessibility-widget.css" />
<script src="../assets/js/accessibility-widget.js"></script>
```

Load order recommendation:
1. Accessibility widget CSS in `<head>`
2. Accessibility widget script near end of `<body>`
3. Language selector script after it (with `defer`)

---

## Recommended learning path

1. **Accessibility first** — Fix contrast, semantics, focus order, and form labeling. Delivers immediate, tangible improvements.
2. **Sustainability next** — Reduce page weight and hosting impact. Performance work also helps users on low-bandwidth connections.
3. **Grants and growth** — Use progress from the first two tracks as evidence in applications for in-kind credits, software, and support.

---

## About Oasis of Change

Oasis of Change Inc. is a federal not-for-profit corporation based in Vancouver, Canada, founded by Gabriel Dalton. The organization has helped nonprofits secure over **$865,000 in in-kind technology grants** (based on maximum eligible program values) and achieve up to **98% reductions** in website carbon emissions.

Questions or feedback? Visit [oasisofchange.org](https://oasisofchange.org).

---

## Disclaimer

All dollar figures related to in-kind technology grants represent the maximum eligible value of the programs listed, based on commercial pricing equivalents at the time of writing (February 2026). Actual value depends on your organization's size, usage, and which products you activate. Program terms, pricing, and availability may change. Always check official program pages for the most current information. The information in this guide is for educational purposes only and does not constitute legal, financial, or professional advice.
