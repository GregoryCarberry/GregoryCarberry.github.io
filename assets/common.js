// Global theme, nav, brand and shared helpers
(function () {
  const root = document.documentElement;
  const headerInner = document.querySelector("header .max-w-6xl");
  const currentPath = window.location.pathname || "/";

  // --- Header fade-in (smooth once JS has hydrated nav/brand)
  if (headerInner) {
    headerInner.style.opacity = "0";
    headerInner.style.transform = "translateY(-4px)";
    headerInner.style.transition =
      "opacity 220ms ease-out, transform 220ms ease-out";
  }

  // --- Theme handling (default dark unless user picked light)
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    root.classList.remove("dark");
  } else {
    root.classList.add("dark");
  }

  const themeBtn = document.getElementById("themeToggle");

  function applyThemeIcon() {
    if (!themeBtn) return;
    const isDark = root.classList.contains("dark");
    themeBtn.textContent = isDark ? "🌙" : "☀️";
  }

  function setTheme(mode) {
    if (mode === "light") {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    applyThemeIcon();
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const isDark = root.classList.contains("dark");
      setTheme(isDark ? "light" : "dark");
    });
  }

  applyThemeIcon();

  // ---------------------------------------------------------------------------
  // Brand + nav (data/links.json)
  // ---------------------------------------------------------------------------
  const brandEl = document.getElementById("brandLink");
  const navEl = document.getElementById("navLinks");

  function createNavLink(label, href, isActive) {
    const a = document.createElement("a");
    a.href = href;
    a.className =
      "nav-link group inline-flex items-center text-sm text-slate-300 hover:text-white transition-colors";

    if (isActive) {
      a.classList.add("nav-link--active", "text-white");
    }

    const textSpan = document.createElement("span");
    textSpan.className = "relative z-10";
    textSpan.textContent = label;

    const underline = document.createElement("span");
    underline.className = "nav-underline";

    a.appendChild(textSpan);
    a.appendChild(underline);

    return a;
  }

  function applyBrand(brand) {
    if (!brandEl) return;

    const label =
      brand && brand.label ? brand.label : "GJC • Technical Portfolio";
    const href = brand && brand.href ? brand.href : "/";

    brandEl.innerHTML = "";
    brandEl.href = href;

    // Brand behaves like a nav link visually
    brandEl.className =
      "nav-link brand-link group inline-flex items-center font-semibold tracking-tight text-slate-100";

    // NEW: treat brand as active on homepage ("/" or "/index.html")
    if (currentPath === "/" || currentPath === "/index.html") {
      brandEl.classList.add("nav-link--active");
    }

    const textSpan = document.createElement("span");
    textSpan.className = "relative z-10";
    textSpan.textContent = label;

    const underline = document.createElement("span");
    underline.className = "nav-underline";

    brandEl.appendChild(textSpan);
    brandEl.appendChild(underline);
  }

  function isActivePath(path) {
    if (!path) return false;

    // Normal exact match
    if (currentPath === path) return true;

    // "/" <-> "/index.html"
    if (currentPath === "/" && path === "/") return true;
    if (currentPath === "/index.html" && path === "/") return true;

    // Treat project detail page as part of "All Projects"
    if (currentPath === "/project.html" && path === "/projects.html") {
      return true;
    }

    return false;
  }

  function buildNav(navLinks) {
    if (!navEl || !Array.isArray(navLinks)) return;

    navEl.innerHTML = "";
    navEl.classList.add("sm:flex", "gap-6", "text-sm");

    navLinks.forEach((link) => {
      if (!link || !link.href || !link.label) return;
      const el = createNavLink(link.label, link.href, isActivePath(link.href));
      navEl.appendChild(el);
    });
  }

  function loadLinksJson() {
    return fetch("data/links.json", { cache: "no-store" }).then((res) => {
      if (!res.ok) throw new Error("links.json fetch failed");
      return res.json();
    });
  }

  function hydrateNav() {
    return loadLinksJson()
      .then((items) => {
        const arr = Array.isArray(items) ? items : [];

        const brand = arr.find((x) => x && x.slot === "brand");
        const navLinks = arr.filter((x) => x && x.slot === "nav");

        applyBrand(brand || null);
        buildNav(navLinks);
      })
      .catch(() => {
        // Fallback: hard-coded brand + nav
        applyBrand(null);
        buildNav([
          { label: "All Projects", href: "/projects.html" },
          { label: "Certs & Skills", href: "/certifications.html" },
          { label: "Contact", href: "/contact.html" },
          { label: "About Me", href: "/about.html" }
        ]);
      })
      .finally(() => {
        if (headerInner) {
          requestAnimationFrame(() => {
            headerInner.style.opacity = "1";
            headerInner.style.transform = "translateY(0)";
          });
        }
      });
  }

  hydrateNav();

  // ---------------------------------------------------------------------------
  // Footer year + last updated helpers
  // ---------------------------------------------------------------------------
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  let lastUpdatedValue = null;

  // pages can call this to record a value
  window.__recordLastUpdated = function (value) {
    if (value instanceof Date) {
      lastUpdatedValue = value;
    } else if (typeof value === "number") {
      lastUpdatedValue = new Date(value);
    } else if (typeof value === "string") {
      lastUpdatedValue = value.trim();
    }
  };

  // pages call this (usually once data has loaded) to paint the footer
  window.__setLastUpdated = function () {
    const el = document.getElementById("lastUpdated");
    if (!el) return;

    if (lastUpdatedValue instanceof Date) {
      el.textContent = lastUpdatedValue.toISOString().slice(0, 10);
    } else if (typeof lastUpdatedValue === "string" && lastUpdatedValue) {
      el.textContent = lastUpdatedValue;
    } else if (document.lastModified) {
      el.textContent = document.lastModified.split(" ")[0];
    }
  };

  // ---------------------------------------------------------------------------
  // Service worker (if present)
  // ---------------------------------------------------------------------------
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        // best-effort; ignore errors
      });
    });
  }

  // ---------------------------------------------------------------------------
  // Respect reduced motion
  // ---------------------------------------------------------------------------
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.documentElement.style.scrollBehavior = "auto";
  }
})();
