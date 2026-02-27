(function () {
	var themeKey = "accesshub-theme";
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
	if (themeBtn) {
		themeBtn.addEventListener("click", function () {
			var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
			localStorage.setItem(themeKey, next);
			applyTheme(next);
		});
	}

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

	if (openBtn) openBtn.addEventListener("click", toggleSidebar);
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

	/* ---- Search ---- */

	var searchIndex = [
		{ title: "Overview", page: "Hub", url: "hub.html" },
		{ title: "Getting Started", page: "Hub", url: "getting-started.html" },
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
		{ title: "axe DevTools", page: "Accessibility", url: "accessibility.html#section-7" },
		{ title: "Accessibility statement", page: "Accessibility", url: "accessibility.html#section-8" },
		{ title: "Overlay tools warning", page: "Accessibility", url: "accessibility.html#section-4" },

		{ title: "What are in-kind technology grants?", page: "Tech Grants", url: "tech-grants.html#section-0" },
		{ title: "Percent and Goodstack verification", page: "Tech Grants", url: "tech-grants.html#section-1" },
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
		{ title: "Tips from experience", page: "Tech Grants", url: "tech-grants.html#section-10" }
	];

	var searchInput = document.getElementById("sidebar-search");
	var searchResults = document.getElementById("search-results");

	if (searchInput && searchResults) {
		searchInput.addEventListener("input", function () {
			var q = this.value.trim().toLowerCase();
			if (q.length < 2) {
				searchResults.classList.remove("visible");
				searchResults.innerHTML = "";
				return;
			}

			var matches = searchIndex.filter(function (item) {
				return item.title.toLowerCase().indexOf(q) !== -1 || item.page.toLowerCase().indexOf(q) !== -1;
			}).slice(0, 8);

			if (matches.length === 0) {
				searchResults.innerHTML = '<div class="search-empty">No results found</div>';
			} else {
				searchResults.innerHTML = matches.map(function (m) {
					return '<a href="' + m.url + '"><span>' + m.title + '</span><span class="search-page">' + m.page + '</span></a>';
				}).join("");
			}
			searchResults.classList.add("visible");
		});

		searchInput.addEventListener("blur", function () {
			setTimeout(function () { searchResults.classList.remove("visible"); }, 200);
		});

		searchInput.addEventListener("keydown", function (e) {
			if (e.key === "Escape") {
				searchResults.classList.remove("visible");
				searchInput.blur();
			}
		});
	}

	/* ---- Keyboard shortcut for search ---- */

	document.addEventListener("keydown", function (e) {
		if ((e.metaKey || e.ctrlKey) && e.key === "k") {
			e.preventDefault();
			if (searchInput) searchInput.focus();
		}
	});
})();
