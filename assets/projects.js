const recordLastUpdated = window.__recordLastUpdated || function () {};
const setLastUpdated = window.__setLastUpdated || function () {};

const state = { q: "", tag: null, category: "", sort: "featured", data: [] };

function normalise(value) {
  return (value || "").toString().toLowerCase();
}

function pill(text, classes = "") {
  return `<span class="inline-flex items-center rounded-full border border-slate-300 dark:border-slate-700 px-2.5 py-1 text-xs text-slate-600 dark:text-slate-300 ${classes}">${text}</span>`;
}

function populateCategories(projects) {
  const select = document.getElementById("category");
  if (!select) return;
  const categories = [...new Set(projects.map((p) => p.category).filter(Boolean))].sort();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

function renderTags(projects) {
  const tagsEl = document.getElementById("tags");
  if (!tagsEl) return;

  const tags = [...new Set(projects.flatMap((p) => p.tags || []))].sort((a, b) => a.localeCompare(b));
  tagsEl.innerHTML = "";

  function makeChip(label, value) {
    const isActive = value === null ? state.tag === null : state.tag === value;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = label;
    btn.className = [
      "px-3 py-1 rounded-full border text-sm font-medium transition",
      isActive
        ? "bg-indigo-600 text-white border-indigo-600"
        : "border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800",
    ].join(" ");
    btn.addEventListener("click", () => {
      state.tag = value;
      renderTags(state.data);
      renderProjects();
    });
    return btn;
  }

  tagsEl.appendChild(makeChip("All tags", null));
  tags.forEach((tag) => tagsEl.appendChild(makeChip(tag, tag)));
}

function matchesSearch(project, q) {
  if (!q) return true;
  const n = normalise(q);
  const haystack = [
    project.title,
    project.blurb,
    project.proof,
    project.type,
    project.category,
    project.status,
    (project.tags || []).join(" "),
  ].map(normalise).join(" ");
  return haystack.includes(n);
}

function matchesTag(project, tag) {
  if (!tag) return true;
  return (project.tags || []).map(normalise).includes(normalise(tag));
}

function matchesCategory(project, category) {
  if (!category) return true;
  return normalise(project.category) === normalise(category);
}

function sortProjects(list, mode) {
  const items = [...list];
  if (mode === "alpha") {
    items.sort((a, b) => normalise(a.title).localeCompare(normalise(b.title)));
  } else if (mode === "recent") {
    items.sort((a, b) => new Date(b.updated || 0) - new Date(a.updated || 0));
  } else {
    items.sort((a, b) => {
      const af = a.featured ? 1 : 0;
      const bf = b.featured ? 1 : 0;
      if (af !== bf) return bf - af;
      const ao = a.featuredOrder || 999;
      const bo = b.featuredOrder || 999;
      if (ao !== bo) return ao - bo;
      return normalise(a.title).localeCompare(normalise(b.title));
    });
  }
  return items;
}

function updateClearButton() {
  const btn = document.getElementById("clearFilters");
  if (!btn) return;
  const active = Boolean(state.q || state.tag || state.category || state.sort !== "featured");
  btn.classList.toggle("hidden", !active);
}

function renderProjects() {
  const grid = document.getElementById("grid");
  const countEl = document.getElementById("count");
  if (!grid) return;

  let items = state.data.filter((p) =>
    matchesSearch(p, state.q) && matchesTag(p, state.tag) && matchesCategory(p, state.category)
  );
  items = sortProjects(items, state.sort);

  if (countEl) countEl.textContent = `${items.length} project${items.length === 1 ? "" : "s"}`;
  updateClearButton();

  if (!items.length) {
    grid.innerHTML = '<div class="text-sm text-slate-500">No projects match your filters.</div>';
    return;
  }

  grid.innerHTML = "";
  items.forEach((p) => {
    const card = document.createElement("a");
    card.href = p.page || p.github || p.link || "#";
    card.className = "group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-indigo-400/70 dark:hover:border-indigo-600/70 transition";
    const tagsHtml = (p.tags || []).slice(0, 6).map((t) => pill(t)).join("");
    const extraTags = Math.max((p.tags || []).length - 6, 0);
    card.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <h2 class="text-lg font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">${p.title || p.repo}</h2>
        ${p.featured ? '<span class="shrink-0 text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Featured</span>' : ""}
      </div>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${p.blurb || ""}</p>
      <div class="mt-4 flex flex-wrap gap-2">
        ${p.category ? pill(p.category, "bg-slate-50 dark:bg-slate-950") : ""}
        ${p.status ? pill(p.status) : ""}
      </div>
      <div class="mt-3 flex flex-wrap gap-2">${tagsHtml}${extraTags ? pill(`+${extraTags} more`) : ""}</div>
      <p class="mt-4 text-sm font-medium text-indigo-600 dark:text-indigo-400">View project ▸</p>`;
    grid.appendChild(card);
  });
}

(async function init() {
  try {
    const res = await fetch("/data/projects.json", { cache: "no-store" });
    recordLastUpdated(res);
    state.data = await res.json();
    populateCategories(state.data);
    renderTags(state.data);
    renderProjects();
  } catch (err) {
    console.error(err);
    const grid = document.getElementById("grid");
    if (grid) grid.innerHTML = '<div class="text-sm text-rose-500">Could not load projects.json.</div>';
  } finally {
    setTimeout(setLastUpdated, 400);
  }
})();

document.getElementById("search")?.addEventListener("input", (e) => {
  state.q = e.target.value || "";
  renderProjects();
});

document.getElementById("category")?.addEventListener("change", (e) => {
  state.category = e.target.value || "";
  renderProjects();
});

document.getElementById("sort")?.addEventListener("change", (e) => {
  state.sort = e.target.value || "featured";
  renderProjects();
});

document.getElementById("clearFilters")?.addEventListener("click", () => {
  state.q = "";
  state.tag = null;
  state.category = "";
  state.sort = "featured";
  const search = document.getElementById("search");
  const category = document.getElementById("category");
  const sort = document.getElementById("sort");
  if (search) search.value = "";
  if (category) category.value = "";
  if (sort) sort.value = "featured";
  renderTags(state.data);
  renderProjects();
});
