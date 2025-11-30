// Global theme + nav + misc shared bits

(function () {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");

  // --- Theme: default to dark unless user explicitly chose light
  const saved = localStorage.getItem("theme");

  if (saved === "light") {
    root.classList.remove("dark");
  } else {
    // covers "dark" and "null" (first visit) -> dark by default
    root.classList.add("dark");
  }

  if (btn) {
    btn.addEventListener("click", () => {
      const isDark = root.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
    });
  } else {
    console.warn("[common.js] #themeToggle button not found");
  }

  // --- Footer year
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // --- Last-updated tracker
  window.__lastDates = [];
  window.__recordLastUpdated = function (res) {
    try {
      const h = res.headers?.get("last-modified");
      if (h) window.__lastDates.push(new Date(h));
    } catch {}
  };
  window.__setLastUpdated = function () {
    const el = document.getElementById("lastUpdated");
    if (!el || !window.__lastDates.length) return;
    const latest = new Date(
      Math.max(...window.__lastDates.map((d) => d.getTime()))
    );
    el.textContent = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(latest);
  };

  // --- Load top nav from data/links.json (slot === 'nav') with active state + animated underline
  (async function loadNav() {
    try {
      const res = await fetch("data/links.json", { cache: "no-store" });
      window.__recordLastUpdated(res);
      const links = await res.json();
      const nav = document.getElementById("navLinks");
      if (nav) {
        nav.innerHTML = "";

        const path = window.location.pathname;
        const currentPath = path.split("/").pop() || "index.html";
        const currentHash = window.location.hash || "";

        links
          .filter((l) => l.slot === "nav")
          .forEach((l) => {
            const a = document.createElement("a");

            const url = new URL(l.href || "#", window.location.origin);
            const linkPath = url.pathname.split("/").pop() || "index.html";
            const linkHash = url.hash || "";

            const isActive = linkHash
              ? currentPath === linkPath && currentHash === linkHash
              : currentPath === linkPath;

            a.href = l.href || "#";
            a.className = "relative group text-sm";

            const underlineClasses = [
              "pointer-events-none",
              "absolute",
              "left-0",
              "-bottom-0",
              "h-0.5",
              "w-full",
              "bg-indigo-500",
              "origin-left",
              "transition-transform",
              isActive ? "scale-x-100" : "scale-x-0",
              isActive ? "" : "group-hover:scale-x-100",
            ]
              .filter(Boolean)
              .join(" ");

            a.innerHTML = `
              <span class="relative z-10">${l.label}</span>
              <span class="${underlineClasses}"></span>
            `;

            nav.appendChild(a);
          });
      }
      setTimeout(window.__setLastUpdated, 300);
    } catch (e) {
      console.warn("[common.js] failed to load nav links", e);
    }
  })();

  // Only register the service worker on the real GitHub Pages site,
  // NOT during local development with Live Server.
  if (
    "serviceWorker" in navigator &&
    location.hostname === "gregorycarberry.github.io"
  ) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }

  // --- Respect reduced motion globally
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.documentElement.style.scrollBehavior = "auto";
  }
})();
