(function () {
	const storageKey = "accesshub-theme";
	const root = document.documentElement;
	const toggle = document.getElementById("theme-toggle");
	const pageKey = document.body.dataset.page;

	function getSystemTheme() {
		return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
	}

	function applyTheme(theme) {
		root.setAttribute("data-theme", theme);
		if (toggle) {
			toggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
			toggle.setAttribute("aria-label", "Switch to " + (theme === "dark" ? "light" : "dark") + " mode");
		}
	}

	const initialTheme = localStorage.getItem(storageKey) || getSystemTheme();
	applyTheme(initialTheme);

	if (toggle) {
		toggle.addEventListener("click", function () {
			const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
			localStorage.setItem(storageKey, nextTheme);
			applyTheme(nextTheme);
		});
	}

	if (pageKey) {
		const activeLink = document.querySelector('[data-page-link="' + pageKey + '"]');
		if (activeLink) {
			activeLink.classList.add("active");
		}
	}
})();
