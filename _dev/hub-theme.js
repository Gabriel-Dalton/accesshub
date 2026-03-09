(function () {
	var themeKey = "accesshub-theme";
	var modeKey = "accesshub-mode";
	var keyboardKey = "accesshub-keyboard";
	var sidebarKey = "accesshub-sidebar";
	var root = document.documentElement;
	var body = document.body;
	var isMobile = window.matchMedia("(max-width: 860px)");

	/* ---- Theme ---- */

	function getSystemTheme() {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}

	function applyTheme(theme) {
		root.setAttribute("data-theme", theme);
	}

	var initialTheme = localStorage.getItem(themeKey) || getSystemTheme();
	applyTheme(initialTheme);

	var themeBtn = document.getElementById("theme-toggle");
	if (themeBtn) themeBtn.setAttribute("title", "Toggle light or dark mode");
	if (themeBtn) {
		themeBtn.addEventListener("click", function () {
			var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
			localStorage.setItem(themeKey, next);
			applyTheme(next);
		});
	}

	/* ---- Mode (Simple / Developer) ---- */

	function applyMode(mode) {
		root.setAttribute("data-mode", mode);
		var simpleBtn = document.getElementById("mode-simple");
		var developerBtn = document.getElementById("mode-developer");
		if (simpleBtn) simpleBtn.setAttribute("aria-pressed", mode === "simple" ? "true" : "false");
		if (developerBtn) developerBtn.setAttribute("aria-pressed", mode === "developer" ? "true" : "false");
	}

	var initialMode = localStorage.getItem(modeKey) || "simple";
	applyMode(initialMode);

	var modeSimpleBtn = document.getElementById("mode-simple");
	var modeDeveloperBtn = document.getElementById("mode-developer");
	if (modeSimpleBtn) {
		modeSimpleBtn.addEventListener("click", function () {
			localStorage.setItem(modeKey, "simple");
			applyMode("simple");
		});
	}
	if (modeDeveloperBtn) {
		modeDeveloperBtn.addEventListener("click", function () {
			localStorage.setItem(modeKey, "developer");
			applyMode("developer");
		});
	}

	function detectKeyboard() {
		var ua = navigator.userAgent || navigator.platform || "";
		return /Mac|iPhone|iPad|iPod/.test(ua) ? "mac" : "windows";
	}

	function applyKeyboard(kbd) {
		root.setAttribute("data-keyboard", kbd);
		var macBtn = document.getElementById("keyboard-mac");
		var winBtn = document.getElementById("keyboard-windows");
		if (macBtn) macBtn.setAttribute("aria-pressed", kbd === "mac" ? "true" : "false");
		if (winBtn) winBtn.setAttribute("aria-pressed", kbd === "windows" ? "true" : "false");
	}

	var initialKeyboard = localStorage.getItem(keyboardKey) || detectKeyboard();
	applyKeyboard(initialKeyboard);

	var keyboardMacBtn = document.getElementById("keyboard-mac");
	var keyboardWinBtn = document.getElementById("keyboard-windows");
	if (keyboardMacBtn) {
		keyboardMacBtn.addEventListener("click", function () {
			localStorage.setItem(keyboardKey, "mac");
			applyKeyboard("mac");
		});
	}
	if (keyboardWinBtn) {
		keyboardWinBtn.addEventListener("click", function () {
			localStorage.setItem(keyboardKey, "windows");
			applyKeyboard("windows");
		});
	}

	var keyboardToggle = document.querySelector(".keyboard-toggle");
	if (keyboardToggle) keyboardToggle.setAttribute("title", "Show keyboard shortcuts for Mac or Windows");

	var modeToggle = document.querySelector(".mode-toggle");
	if (modeToggle) modeToggle.setAttribute("title", "Plain English: simple explanations. Technical: specs and implementation details.");

	var onboardingKey = "accesshub-onboarding-done";

	function openOnboarding() {
		var overlay = document.getElementById("onboarding-overlay");
		if (overlay) {
			overlay.classList.add("visible");
			body.classList.add("onboarding-open");
			updateOnboardingSelection();
			var btn = document.getElementById("onboarding-done");
			if (btn) btn.focus();
		}
	}

	function closeOnboarding() {
		var overlay = document.getElementById("onboarding-overlay");
		if (overlay) {
			overlay.classList.remove("visible");
			body.classList.remove("onboarding-open");
		}
		localStorage.setItem(onboardingKey, "1");

		if (!isMobile.matches) {
			var topbarRight = document.querySelector(".topbar-right");
			if (topbarRight) {
				topbarRight.classList.add("onboarding-highlight");
				setTimeout(function () {
					topbarRight.classList.remove("onboarding-highlight");
				}, 2500);
			}
		}
	}

	function updateOnboardingSelection() {
		var kbd = root.getAttribute("data-keyboard") || "windows";
		var mode = root.getAttribute("data-mode") || "simple";
		var macBtn = document.getElementById("onboarding-mac");
		var winBtn = document.getElementById("onboarding-windows");
		var simpleBtn = document.getElementById("onboarding-simple");
		var technicalBtn = document.getElementById("onboarding-technical");
		if (macBtn) macBtn.setAttribute("aria-pressed", kbd === "mac" ? "true" : "false");
		if (winBtn) winBtn.setAttribute("aria-pressed", kbd === "windows" ? "true" : "false");
		if (simpleBtn) simpleBtn.setAttribute("aria-pressed", mode === "simple" ? "true" : "false");
		if (technicalBtn) technicalBtn.setAttribute("aria-pressed", mode === "developer" ? "true" : "false");
	}

	function initOnboarding() {
		var existing = document.getElementById("onboarding-overlay");
		if (existing) return;

		var overlay = document.createElement("div");
		overlay.id = "onboarding-overlay";
		overlay.className = "tips-overlay onboarding-overlay";
		overlay.setAttribute("role", "dialog");
		overlay.setAttribute("aria-labelledby", "onboarding-title");
		overlay.setAttribute("aria-modal", "true");
		overlay.innerHTML =
			'<div class="tips-dialog onboarding-dialog">' +
			'<h2 id="onboarding-title">Welcome</h2>' +
			'<p class="onboarding-intro">Choose your setup so we can show the right keyboard shortcuts and content style for you. Your choices are saved and will apply across all pages.</p>' +
			'<div class="onboarding-option">' +
			'<span class="onboarding-label">Device</span>' +
			'<div class="onboarding-toggle" role="group">' +
			'<button class="onboarding-option-btn" id="onboarding-mac" type="button" aria-pressed="false">Mac</button>' +
			'<button class="onboarding-option-btn" id="onboarding-windows" type="button" aria-pressed="true">Windows</button>' +
			'</div>' +
			'</div>' +
			'<div class="onboarding-option">' +
			'<span class="onboarding-label">Content style</span>' +
			'<div class="onboarding-toggle" role="group">' +
			'<button class="onboarding-option-btn" id="onboarding-simple" type="button" aria-pressed="true">Plain English</button>' +
			'<button class="onboarding-option-btn" id="onboarding-technical" type="button" aria-pressed="false">Technical</button>' +
			'</div>' +
			'</div>' +
			'<p class="onboarding-edit-note">The Mac/Win and Plain English/Technical toggles in the top right are where you can change these anytime. We&rsquo;ll point them out when you close this.</p>' +
			'<div class="onboarding-actions">' +
			'<button class="tips-close" id="onboarding-done" type="button">Get started</button>' +
			'</div>' +
			'</div>';

		overlay.addEventListener("click", function (e) {
			if (e.target === overlay) closeOnboarding();
		});

		body.appendChild(overlay);

		document.getElementById("onboarding-mac").addEventListener("click", function () {
			localStorage.setItem(keyboardKey, "mac");
			applyKeyboard("mac");
			updateOnboardingSelection();
		});
		document.getElementById("onboarding-windows").addEventListener("click", function () {
			localStorage.setItem(keyboardKey, "windows");
			applyKeyboard("windows");
			updateOnboardingSelection();
		});
		document.getElementById("onboarding-simple").addEventListener("click", function () {
			localStorage.setItem(modeKey, "simple");
			applyMode("simple");
			updateOnboardingSelection();
		});
		document.getElementById("onboarding-technical").addEventListener("click", function () {
			localStorage.setItem(modeKey, "developer");
			applyMode("developer");
			updateOnboardingSelection();
		});
		document.getElementById("onboarding-done").addEventListener("click", closeOnboarding);

		var topbarRight = document.querySelector(".topbar-right");
		if (topbarRight) {
			var tipsBtn = document.createElement("button");
			tipsBtn.className = "icon-btn tips-btn";
			tipsBtn.id = "tips-btn";
			tipsBtn.type = "button";
			tipsBtn.setAttribute("aria-label", "Customize device and content style");
			tipsBtn.setAttribute("title", "Customize device and content style");
			tipsBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>';
			topbarRight.insertBefore(tipsBtn, topbarRight.firstChild);
			tipsBtn.addEventListener("click", openOnboarding);
		}

		var isGettingStarted = body.getAttribute("data-page") === "getting-started";
		if (isGettingStarted && !localStorage.getItem(onboardingKey)) {
			setTimeout(openOnboarding, 400);
		}

		var tipsTriggerGs = document.getElementById("tips-trigger-getting-started");
		if (tipsTriggerGs) tipsTriggerGs.addEventListener("click", openOnboarding);
	}

	initOnboarding();

	/* ---- Sidebar ---- */

	var backdrop = document.getElementById("backdrop");

	function closeSidebar() {
		if (isMobile.matches) {
			body.classList.remove("sidebar-open");
			if (backdrop) backdrop.classList.remove("visible");
		} else {
			body.classList.add("sidebar-collapsed");
			localStorage.setItem(sidebarKey, "collapsed");
		}
	}

	function openSidebar() {
		if (isMobile.matches) {
			body.classList.add("sidebar-open");
			if (backdrop) backdrop.classList.add("visible");
		} else {
			body.classList.remove("sidebar-collapsed");
			localStorage.setItem(sidebarKey, "open");
		}
	}

	function toggleSidebar() {
		if (isMobile.matches) {
			body.classList.contains("sidebar-open") ? closeSidebar() : openSidebar();
		} else {
			body.classList.contains("sidebar-collapsed") ? openSidebar() : closeSidebar();
		}
	}

	if (!isMobile.matches && localStorage.getItem(sidebarKey) === "collapsed") {
		body.classList.add("sidebar-collapsed");
	}

	var openBtn = document.getElementById("sidebar-open");
	var closeBtn = document.getElementById("sidebar-close");

	if (openBtn) openBtn.addEventListener("click", toggleSidebar);
	if (closeBtn) closeBtn.addEventListener("click", closeSidebar);
	if (backdrop) backdrop.addEventListener("click", closeSidebar);

	/* ---- Active nav link ---- */

	var pageKey = body.dataset.page;
	if (pageKey) {
		var link = document.querySelector('[data-page-link="' + pageKey + '"]');
		if (link) link.classList.add("active");
	}

	/* ---- Sub-menu generation (on-page TOC) ---- */

	var prose = document.querySelector(".prose");
	if (prose && pageKey) {
		var headings = prose.querySelectorAll("h2");
		var activeLink = document.querySelector('.nav-group a[data-page-link="' + pageKey + '"]');

		if (headings.length > 0 && activeLink) {
			var subNav = document.createElement("div");
			subNav.className = "nav-sub";

		headings.forEach(function (h, i) {
			if (h.closest(".footnotes") || h.closest(".completion-section") || h.closest(".card")) return;
			var id = h.id || "section-" + i;
			h.id = id;

			var a = document.createElement("a");
			a.href = "#" + id;
			a.textContent = h.textContent;
			a.dataset.section = id;
			subNav.appendChild(a);
		});

			activeLink.parentNode.insertBefore(subNav, activeLink.nextSibling);

			/* Clicking the track link again toggles the sub-menu open/closed */
			activeLink.addEventListener("click", function (e) {
				var next = activeLink.nextElementSibling;
				if (next && next.classList.contains("nav-sub")) {
					e.preventDefault();
					next.classList.toggle("nav-sub-collapsed");
				}
			});

			var subLinks = subNav.querySelectorAll("a");
			var sectionIds = [];
			subLinks.forEach(function (a) { sectionIds.push(a.dataset.section); });

		function updateActiveSection() {
			var scrollY = window.scrollY + 100;
			var current = null;

			var atBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 30);
			if (atBottom && sectionIds.length > 0) {
				current = sectionIds[sectionIds.length - 1];
			} else {
				sectionIds.forEach(function (id) {
					var el = document.getElementById(id);
					if (el && el.offsetTop <= scrollY) current = id;
				});
			}

			subLinks.forEach(function (a) {
				a.classList.toggle("active", a.dataset.section === current);
			});
		}

			var scrollTimer;
			window.addEventListener("scroll", function () {
				if (scrollTimer) cancelAnimationFrame(scrollTimer);
				scrollTimer = requestAnimationFrame(updateActiveSection);
			});
			updateActiveSection();
		}
	}

	/* ---- Quick Search Modal ---- */

	var searchIndex = [
		{ title: "Overview", page: "Hub", url: "hub.html" },
		{ title: "Getting Started", page: "Hub", url: "getting-started.html" },
		{ title: "Disclaimers", page: "Hub", url: "disclaimers.html" },
		{ title: "Acknowledgments", page: "Hub", url: "acknowledgments.html" },
		{ title: "About the WRA Hub", page: "Getting Started", url: "getting-started.html" },
		{ title: "Recommended order", page: "Getting Started", url: "getting-started.html" },

		{ title: "What does digital sustainability mean?", page: "Sustainability", url: "sustainability.html#section-0" },
		{ title: "Why is being sustainable online important?", page: "Sustainability", url: "sustainability.html#section-1" },
		{ title: "Benefits of being sustainable online", page: "Sustainability", url: "sustainability.html#section-2" },
		{ title: "Easy techniques to be sustainable online", page: "Sustainability", url: "sustainability.html#section-3" },
		{ title: "Tools to measure carbon footprint", page: "Sustainability", url: "sustainability.html#section-4" },
		{ title: "Website Carbon Calculator", page: "Sustainability", url: "sustainability.html#section-4" },
		{ title: "Ecograder", page: "Sustainability", url: "sustainability.html#section-4" },
		{ title: "Green hosting", page: "Sustainability", url: "sustainability.html#section-3" },
		{ title: "Image optimization", page: "Sustainability", url: "sustainability.html#section-3" },
		{ title: "Lazy loading", page: "Sustainability", url: "sustainability.html#section-3" },

		{ title: "What is web accessibility?", page: "Accessibility", url: "accessibility.html#section-0" },
		{ title: "Why is being accessible online important?", page: "Accessibility", url: "accessibility.html#section-1" },
		{ title: "Laws and standards", page: "Accessibility", url: "accessibility.html#section-2" },
		{ title: "WCAG guidelines", page: "Accessibility", url: "accessibility.html#section-2" },
		{ title: "ADA compliance", page: "Accessibility", url: "accessibility.html#section-2" },
		{ title: "Accessibility audit", page: "Accessibility", url: "accessibility.html#section-3" },
		{ title: "Alt text", page: "Accessibility", url: "accessibility.html#section-5" },
		{ title: "Color contrast", page: "Accessibility", url: "accessibility.html#section-5" },
		{ title: "Keyboard navigation", page: "Accessibility", url: "accessibility.html#section-5" },
		{ title: "Screen readers", page: "Accessibility", url: "accessibility.html#section-6" },
		{ title: "ARIA attributes", page: "Accessibility", url: "accessibility.html#section-6" },
		{ title: "Free accessibility testing tools", page: "Accessibility", url: "accessibility.html#section-7" },
		{ title: "WAVE tool", page: "Accessibility", url: "accessibility.html#section-7" },
		{ title: "Google Lighthouse", page: "Accessibility", url: "accessibility.html#section-7" },
		{ title: "PageSpeed Insights", page: "Accessibility", url: "accessibility.html#section-7" },
		{ title: "Accessibility statement", page: "Accessibility", url: "accessibility.html#section-8" },
		{ title: "Overlay tools warning", page: "Accessibility", url: "accessibility.html#section-4" },

		{ title: "What are in-kind technology grants?", page: "Tech Grants", url: "tech-grants.html#section-0" },
		{ title: "Goodstack verification", page: "Tech Grants", url: "tech-grants.html#section-1" },
		{ title: "Google for Nonprofits", page: "Tech Grants", url: "tech-grants.html#section-2" },
		{ title: "Google Ad Grants", page: "Tech Grants", url: "tech-grants.html#section-2" },
		{ title: "Google Workspace", page: "Tech Grants", url: "tech-grants.html#section-2" },
		{ title: "Microsoft for Nonprofits", page: "Tech Grants", url: "tech-grants.html#section-3" },
		{ title: "Microsoft 365", page: "Tech Grants", url: "tech-grants.html#section-3" },
		{ title: "Canva for Nonprofits", page: "Tech Grants", url: "tech-grants.html#section-4" },
		{ title: "Atlassian for Nonprofits", page: "Tech Grants", url: "tech-grants.html#section-5" },
		{ title: "Jira Confluence Loom", page: "Tech Grants", url: "tech-grants.html#section-5" },
		{ title: "TechSoup", page: "Tech Grants", url: "tech-grants.html#section-6" },
		{ title: "Salesforce for Nonprofits", page: "Tech Grants", url: "tech-grants.html#section-7" },
		{ title: "Slack Zoom HubSpot", page: "Tech Grants", url: "tech-grants.html#section-7" },
		{ title: "Grant value summary table", page: "Tech Grants", url: "tech-grants.html#section-8" },
		{ title: "Quick-start checklist", page: "Tech Grants", url: "tech-grants.html#section-9" },
		{ title: "Tips from experience", page: "Tech Grants", url: "tech-grants.html#section-10" },
		{ title: "Do you qualify?", page: "Eligibility", url: "eligibility.html" },
		{ title: "Eligibility checker", page: "Eligibility", url: "eligibility.html" }
	];

	var defaultMenu = [
		{ label: "Start here", items: [
			{ title: "Overview", url: "hub.html" },
			{ title: "Getting Started", url: "getting-started.html" },
			{ title: "Do you qualify?", url: "eligibility.html" },
			{ title: "Disclaimers", url: "disclaimers.html" },
			{ title: "Acknowledgments", url: "acknowledgments.html" }
		]},
		{ label: "Tracks", items: [
			{ title: "Sustainability", url: "sustainability.html" },
			{ title: "Accessibility", url: "accessibility.html" },
			{ title: "Tech Grants", url: "tech-grants.html" }
		]},
		{ label: "Popular topics", items: [
			{ title: "Google Ad Grants", url: "tech-grants.html#section-2" },
			{ title: "Goodstack verification", url: "tech-grants.html#section-1" },
			{ title: "WCAG guidelines", url: "accessibility.html#section-2" },
			{ title: "Tools to measure carbon footprint", url: "sustainability.html#section-4" },
			{ title: "Free accessibility testing tools", url: "accessibility.html#section-7" },
			{ title: "Quick-start checklist", url: "tech-grants.html#section-9" }
		]}
	];

	var arrowSvg = '<svg class="search-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>';

	var overlay = document.getElementById("search-overlay");
	var searchInput = document.getElementById("search-input");
	var searchResults = document.getElementById("search-results");
	var searchTrigger = document.getElementById("search-trigger");
	var activeIdx = -1;

	function renderDefaultMenu() {
		if (!searchResults) return;
		var html = "";
		var idx = 0;
		defaultMenu.forEach(function (group) {
			html += '<div class="search-group-label">' + group.label + '</div>';
			group.items.forEach(function (item) {
				html += '<a href="' + item.url + '" data-idx="' + idx + '"><span class="search-title">' + item.title + '</span>' + arrowSvg + '</a>';
				idx++;
			});
		});
		searchResults.innerHTML = html;
	}

	function openSearch() {
		if (!overlay) return;
		if (searchTrigger) searchTrigger.blur();
		overlay.classList.add("open");
		body.classList.add("search-open");
		activeIdx = -1;
		renderDefaultMenu();
		requestAnimationFrame(function () {
			if (searchInput) {
				searchInput.value = "";
				searchInput.focus();
			}
		});
	}

	function closeSearch() {
		if (!overlay) return;
		overlay.classList.remove("open");
		body.classList.remove("search-open");
		activeIdx = -1;
		if (searchInput) searchInput.blur();
	}

	function renderGrouped(matches) {
		var groups = {};
		var order = [];
		matches.forEach(function (m) {
			if (!groups[m.page]) {
				groups[m.page] = [];
				order.push(m.page);
			}
			groups[m.page].push(m);
		});
		var html = "";
		var idx = 0;
		order.forEach(function (page) {
			html += '<div class="search-group-label">' + page + '</div>';
			groups[page].forEach(function (m) {
				html += '<a href="' + m.url + '" data-idx="' + idx + '"><span class="search-title">' + m.title + '</span>' + arrowSvg + '</a>';
				idx++;
			});
		});
		return html;
	}

	function renderResults(q) {
		if (!searchResults) return;
		if (q.length < 2) {
			renderDefaultMenu();
			activeIdx = -1;
			return;
		}

		var matches = searchIndex.filter(function (item) {
			return item.title.toLowerCase().indexOf(q) !== -1 || item.page.toLowerCase().indexOf(q) !== -1;
		}).slice(0, 12);

		activeIdx = -1;

		if (matches.length === 0) {
			searchResults.innerHTML = '<div class="search-empty">No results found</div>';
		} else {
			searchResults.innerHTML = renderGrouped(matches);
		}
	}

	function setActiveResult(idx) {
		if (!searchResults) return;
		var links = searchResults.querySelectorAll("a");
		if (links.length === 0) return;

		links.forEach(function (a) { a.classList.remove("active"); });

		if (idx < 0) idx = links.length - 1;
		if (idx >= links.length) idx = 0;
		activeIdx = idx;

		links[activeIdx].classList.add("active");
		links[activeIdx].scrollIntoView({ block: "nearest" });
	}

	if (searchTrigger) {
		searchTrigger.addEventListener("click", openSearch);
	}

	if (overlay) {
		overlay.addEventListener("mousedown", function (e) {
			if (e.target === overlay) closeSearch();
		});
	}

	if (searchInput) {
		searchInput.addEventListener("input", function () {
			renderResults(this.value.trim().toLowerCase());
		});
	}

	function isSearchOpen() {
		return overlay && overlay.classList.contains("open");
	}

	function navigateToActive() {
		var links = searchResults ? searchResults.querySelectorAll("a") : [];
		if (activeIdx >= 0 && links[activeIdx]) {
			window.location.href = links[activeIdx].href;
		} else if (links.length > 0) {
			window.location.href = links[0].href;
		}
	}

	/* ---- External links open in new tab (keep hub open) ---- */

	document.querySelectorAll('a[href^="http://"], a[href^="https://"]').forEach(function (a) {
		a.setAttribute("target", "_blank");
	});

	/* ---- Footnote highlight ---- */

	document.querySelectorAll('.prose sup a[href^="#fn-"]').forEach(function (link) {
		link.addEventListener("click", function (e) {
			var id = this.getAttribute("href").slice(1);
			var target = document.getElementById(id);
			if (!target) return;

			e.preventDefault();

			document.querySelectorAll(".footnotes p.fn-highlight").forEach(function (el) {
				el.classList.remove("fn-highlight");
			});

			target.scrollIntoView({ behavior: "smooth", block: "center" });

			void target.offsetWidth;
			target.classList.add("fn-highlight");

			history.replaceState(null, "", "#" + id);
		});
	});

	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape") {
			var onboardingOverlay = document.getElementById("onboarding-overlay");
			if (onboardingOverlay && onboardingOverlay.classList.contains("visible")) {
				e.preventDefault();
				closeOnboarding();
				return;
			}
		}

		if ((e.metaKey || e.ctrlKey) && e.key === "k") {
			e.preventDefault();
			isSearchOpen() ? closeSearch() : openSearch();
			return;
		}

		if (!isSearchOpen()) return;

		var links = searchResults ? searchResults.querySelectorAll("a") : [];

		if (e.key === "Escape") {
			e.preventDefault();
			closeSearch();
		} else if (e.key === "ArrowDown") {
			e.preventDefault();
			if (links.length > 0) setActiveResult(activeIdx + 1);
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			if (links.length > 0) setActiveResult(activeIdx - 1);
		} else if (e.key === "Enter") {
			e.preventDefault();
			navigateToActive();
		}
	});

	/* ---- Lightbox (sustainability page) ---- */

	var carbonTrigger = document.getElementById("carbon-lightbox-trigger");
	var lightbox = document.getElementById("lightbox-carbon");
	if (carbonTrigger && lightbox) {
		var lightboxClose = lightbox.querySelector(".lightbox-close");
		var lightboxBackdrop = lightbox.querySelector(".lightbox-backdrop");

		function openLightbox() {
			lightbox.classList.add("open");
			lightbox.setAttribute("aria-hidden", "false");
			document.body.style.overflow = "hidden";
			if (lightboxClose) lightboxClose.focus();
		}

		function closeLightbox() {
			lightbox.classList.remove("open");
			lightbox.setAttribute("aria-hidden", "true");
			document.body.style.overflow = "";
			carbonTrigger.focus();
		}

		carbonTrigger.addEventListener("click", openLightbox);
		if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
		if (lightboxBackdrop) lightboxBackdrop.addEventListener("click", closeLightbox);

		document.addEventListener("keydown", function (e) {
			if (e.key === "Escape" && lightbox.classList.contains("open")) {
				e.preventDefault();
				closeLightbox();
			}
		});
	}
})();
