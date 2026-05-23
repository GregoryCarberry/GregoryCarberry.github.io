const recordLastUpdated = window.__recordLastUpdated || function () {};
const setLastUpdated = window.__setLastUpdated || function () {};

function badge(text, extra = "") {
  return `<span class="inline-flex items-center rounded-full border border-slate-300 dark:border-slate-700 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 ${extra}">${text}</span>`;
}

async function loadJson(path) {
  const res = await fetch(path, { cache: "no-store" });
  recordLastUpdated(res);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

(async function loadProfile() {
  const tagline = document.getElementById("heroTagline");
  try {
    const profile = await loadJson("/data/profile.json");
    if (tagline) tagline.textContent = profile.tagline || "";
  } catch {
    if (tagline) tagline.textContent = "IT support, cloud support and infrastructure-focused technologist building practical skills through hands-on projects.";
  }
})();

(async function loadLinks() {
  try {
    const links = await loadJson("/data/links.json");
    const hero = document.getElementById("heroButtons");
    const contact = document.getElementById("contactButtons");

    function renderButton(link) {
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.label;
      if (/^https?:/.test(link.href)) {
        a.target = "_blank";
        a.rel = "noopener";
      }
      a.className = "inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition";
      return a;
    }

    if (hero) {
      hero.innerHTML = "";
      links.filter((l) => l.slot === "hero").forEach((l) => hero.appendChild(renderButton(l)));
    }
    if (contact) {
      contact.innerHTML = "";
      links.filter((l) => l.slot === "contact").forEach((l) => contact.appendChild(renderButton(l)));
    }
  } catch (err) {
    console.error(err);
  }
})();

(async function loadFeaturedProjects() {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;

  grid.innerHTML = Array(3).fill(`
    <article class="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 p-5">
      <div class="h-5 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div class="h-3 w-full mt-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div class="h-3 w-4/5 mt-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
    </article>`).join("");

  try {
    const projects = await loadJson("/data/projects.json");
    const featured = projects
      .filter((p) => p.featured)
      .sort((a, b) => (a.featuredOrder || 99) - (b.featuredOrder || 99));

    grid.innerHTML = "";
    featured.forEach((p) => {
      const card = document.createElement("a");
      card.href = p.page || p.github || p.link || "#";
      card.className = "group block rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-indigo-400/70 dark:hover:border-indigo-600/70 transition";
      const tags = (p.tags || []).slice(0, 5).map((t) => badge(t)).join("");
      card.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <h3 class="text-lg font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">${p.title || p.repo}</h3>
          <span class="shrink-0 text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">${p.category || "Project"}</span>
        </div>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${p.blurb || ""}</p>
        ${p.proof ? `<p class="mt-3 text-xs text-slate-500 dark:text-slate-400">${p.proof}</p>` : ""}
        <div class="mt-4 flex flex-wrap gap-2">${tags}</div>
        <p class="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">View project ▸</p>`;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    grid.innerHTML = '<p class="text-sm text-rose-500">Could not load featured projects.</p>';
  } finally {
    setTimeout(setLastUpdated, 400);
  }
})();
