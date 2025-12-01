// Projects page logic: filtering, sorting, and tag chips.
//
// Depends on:
// - /data/projects.json (array of project objects)
// - DOM elements with ids: search, sort, tags, count, grid
// - Optional window.__recordLastUpdated(res) and window.__setLastUpdated()

const recordLastUpdated = window.__recordLastUpdated || function () {};
const setLastUpdated = window.__setLastUpdated || function () {};

const state = {
  q: "",
  tag: null,          // null means "All"
  sort: "featured",   // 'featured' | 'alpha' | 'recent'
  data: [],
};

function normalise(value) {
  return (value || "").toString().toLowerCase();
}

// ---------------- Tag rendering ----------------

function renderTags(allProjects) {
  const tagsEl = document.getElementById("tags");
  if (!tagsEl) return;

  const tagSet = new Set();
  allProjects.forEach((p) => {
    (p.tags || []).forEach((t) => tagSet.add(t));
  });
  const tags = Array.from(tagSet).sort((a, b) => a.localeCompare(b));

  tagsEl.innerHTML = "";

  function makeChip(label, tagValue) {
    const isActive = tagValue === null ? state.tag === null : state.tag === tagValue;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;

    btn.className = [
      "px-3",
      "py-1",
      "rounded-full",
      "border",
      "text-sm",
      "font-medium",
      "transition",
      isActive
        ? "bg-indigo-600 text-white border-indigo-600"
        : "border-slate-300 dark:border-slate-700 text-slate-300 dark:text-slate-400 hover:bg-slate-800 hover:text-slate-200",
    ].join(" ");

    btn.addEventListener("click", () => {
      state.tag = tagValue;
      renderTags(state.data);
      renderProjects();
    });

    return btn;
  }

  // "All" chip
  tagsEl.appendChild(makeChip("All", null));

  // Individual tags
  tags.forEach((tag) => {
    tagsEl.appendChild(makeChip(tag, tag));
  });
}

// ---------------- Project filtering / sorting ----------------

function matchesSearch(project, q) {
  if (!q) return true;
  const n = normalise(q);

  const haystack = [
    project.title,
    project.blurb,
    (project.tags || []).join(" "),
  ]
    .map(normalise)
    .join(" ");

  return haystack.includes(n);
}

function matchesTag(project, tag) {
  if (!tag) return true;
  return (project.tags || []).map(normalise).includes(normalise(tag));
}

function sortProjects(list, mode) {
  const items = [...list];

  if (mode === "alpha") {
    items.sort((a, b) => normalise(a.title).localeCompare(normalise(b.title)));
  } else if (mode === "recent") {
    items.sort(
      (a, b) => new Date(b.updated || 0) - new Date(a.updated || 0)
    );
  } else {
    // 'featured' default: featured first, then alpha
    items.sort((a, b) => {
      const af = a.featured ? 1 : 0;
      const bf = b.featured ? 1 : 0;
      if (af !== bf) return bf - af;
      return normalise(a.title).localeCompare(normalise(b.title));
    });
  }

  return items;
}

// ---------------- Project card rendering ----------------

function renderProjects() {
  const grid = document.getElementById("grid");
  const countEl = document.getElementById("count");
  if (!grid) return;

  const q = state.q;
  const tag = state.tag;
  const sort = state.sort;

  let items = state.data.filter(
    (p) => matchesSearch(p, q) && matchesTag(p, tag)
  );

  items = sortProjects(items, sort);

  if (countEl) {
    countEl.textContent = `${items.length} project${
      items.length === 1 ? "" : "s"
    }`;
  }

  if (!items.length) {
    grid.innerHTML =
      '<div class="text-sm text-slate-500">No projects match your filters.</div>';
    return;
  }

  grid.innerHTML = "";

  items.forEach((p) => {
    const owner = p.owner || "GregoryCarberry";
    const repo = p.repo || "";
    const pageLink = p.page || "#";

    const card = document.createElement("a");
    card.href = pageLink;
    card.className = [
      "block",
      "group",
      "rounded-2xl",
      "border",
      "border-slate-800",
      "bg-slate-900/60",
      "dark:bg-slate-800/60",
      "p-5",
      "shadow-sm",
      "hover:shadow-md",
      "hover:-translate-y-1",
      "transition",
    ].join(" ");

    const tagsHtml = (p.tags || [])
      .map(
        (t) =>
          `<span class="px-2 py-0.5 text-xs rounded-full border border-slate-700 text-slate-300">${t}</span>`
      )
      .join("");

    card.innerHTML = `
      <h3 class="text-lg font-semibold mb-1 group-hover:text-indigo-400">${p.title ||
        repo}</h3>
      <p class="text-sm text-slate-400 mb-3">${p.blurb || ""}</p>
      <div class="flex flex-wrap gap-2 mt-auto">
        ${tagsHtml}
      </div>
    `;

    grid.appendChild(card);
  });
}

// ---------------- Initialisation ----------------

(async function init() {
  try {
    const res = await fetch("/data/projects.json", { cache: "no-store" });
    recordLastUpdated(res);

    const projects = await res.json();
    state.data = projects.map((p) => ({ ...p }));

    renderTags(state.data);
    renderProjects();
  } catch (err) {
    console.error("Error loading projects.json", err);
    const grid = document.getElementById("grid");
    if (grid) {
      grid.innerHTML =
        '<div class="text-sm text-rose-500">Could not load projects.json.</div>';
    }
  } finally {
    setTimeout(setLastUpdated, 400);
  }
})();

// ---------------- Events ----------------

const searchInput = document.getElementById("search");
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    state.q = e.target.value || "";
    renderProjects();
  });
}

const sortSelect = document.getElementById("sort");
if (sortSelect) {
  sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value || "featured";
    renderProjects();
  });
}
