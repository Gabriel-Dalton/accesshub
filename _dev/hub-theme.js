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
})();
