const recordLastUpdated = window.__recordLastUpdated || function () {};
const setLastUpdated = window.__setLastUpdated || function () {};

// Read ?repo=... from URL
function getRepoParam() {
  const params = new URLSearchParams(window.location.search);
  const value = params.get("repo") || "";
  return value.trim();
}

// Normalise owner/repo from query + project entry
function normaliseRepoPair(rawParam, project) {
  let owner = project.owner || "GregoryCarberry";
  let repo = project.repo || "";

  if (!repo && rawParam) {
    if (rawParam.includes("/")) {
      const parts = rawParam.split("/");
      owner = parts[0] || owner;
      repo = parts[1] || repo;
    } else {
      repo = rawParam;
    }
  }
  return { owner, repo };
}

(async function initProjectPage() {
  const titleEl  = document.getElementById("title");
  const blurbEl  = document.getElementById("blurb");
  const tagsEl   = document.getElementById("tags");
  const statsEl  = document.getElementById("stats");
  const repoLink = document.getElementById("repoLink");
  const demoLink = document.getElementById("demoLink");
  const caseEl   = document.getElementById("caseStudy");

  const prevLink = document.getElementById("prevProject");
  const nextLink = document.getElementById("nextProject");

  const repoParam = getRepoParam();

  // Load project list
  let projects = [];
  try {
    const res = await fetch("/data/projects.json", { cache: "no-store" });
    recordLastUpdated(res);
    projects = await res.json();
  } catch (err) {
    console.error("Could not load projects.json", err);
  }

  if (!Array.isArray(projects) || projects.length === 0) {
    if (titleEl) titleEl.textContent = "Project not found";
    if (caseEl) {
      caseEl.innerHTML = "<p class='text-rose-600'>projects.json could not be loaded.</p>";
    }
    setTimeout(setLastUpdated, 500);
    return;
  }

  // Find current project from ?repo=
  let current = null;
  const paramLower = repoParam.toLowerCase();

  for (const p of projects) {
    const owner = p.owner || "GregoryCarberry";
    const repo = p.repo || "";
    const combined = (owner + "/" + repo).toLowerCase();
    if (repoParam && combined === paramLower) {
      current = p;
      break;
    }
    if (!current && repo && repo.toLowerCase() === paramLower) {
      current = p;
    }
  }

  // Fallback: if still not found but we at least have a param, create a dummy
  if (!current && repoParam) {
    current = {
      title: repoParam,
      owner: "GregoryCarberry",
      repo: repoParam
    };
  }

  if (!current) {
    if (titleEl) titleEl.textContent = "Project not found";
    if (caseEl) {
      caseEl.innerHTML = "<p class='text-slate-500'>No project matches this URL.</p>";
    }
    setTimeout(setLastUpdated, 500);
    return;
  }

  const { owner, repo } = normaliseRepoPair(repoParam, current);

  // Page title
  const pageTitle = (current.title || repo || "Project") + " — Gregory John Carberry";
  document.title = pageTitle;

  // Hero content
  if (titleEl) titleEl.textContent = current.title || repo || "Project";
  if (blurbEl) blurbEl.textContent = current.blurb || "";

  // Tags
  if (tagsEl) {
    tagsEl.innerHTML = "";
    if (Array.isArray(current.tags)) {
      current.tags.forEach(tag => {
        const span = document.createElement("span");
        span.className = "text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700";
        span.textContent = tag;
        tagsEl.appendChild(span);
      });
    }
  }

  // Repo + demo links
  const repoUrl = owner && repo ? `https://github.com/${owner}/${repo}` : "";
  if (repoLink) {
    if (repoUrl) {
      repoLink.href = repoUrl;
    } else {
      repoLink.classList.add("hidden");
    }
  }

  if (demoLink) {
    const demo = current.demo || current.liveDemo || current.url || "";
    if (demo) {
      demoLink.href = demo;
      demoLink.classList.remove("hidden");
    } else {
      demoLink.classList.add("hidden");
    }
  }

  // GitHub stats
  if (statsEl && repoUrl) {
    statsEl.innerHTML = "<div class='text-xs text-slate-500'>Loading GitHub stats…</div>";
    try {
      const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      const meta = metaRes.ok ? await metaRes.json() : null;
      statsEl.innerHTML = "";
      if (meta) {
        const stars = document.createElement("div");
        stars.className = "flex items-center gap-1";
        stars.innerHTML = "<span aria-hidden='true'>★</span><span>" + meta.stargazers_count + " stars</span>";
        const forks = document.createElement("div");
        forks.className = "flex items-center gap-1";
        forks.innerHTML = "<span aria-hidden='true'>⑂</span><span>" + meta.forks_count + " forks</span>";
        statsEl.appendChild(stars);
        statsEl.appendChild(forks);
      } else {
        statsEl.innerHTML = "<div class='text-xs text-slate-500'>GitHub stats unavailable.</div>";
      }
    } catch (err) {
      console.error("GitHub API error", err);
      statsEl.innerHTML = "<div class='text-xs text-slate-500'>GitHub stats unavailable.</div>";
    }
  }

  // Prev / Next project navigation
  if (prevLink && nextLink && Array.isArray(projects) && projects.length > 1) {
    const idx = projects.indexOf(current);
    if (idx !== -1) {
      if (idx > 0) {
        const prev = projects[idx - 1];
        const po = prev.owner || "GregoryCarberry";
        const pr = prev.repo || "";
        if (pr) {
          prevLink.href = "/project.html?repo=" + encodeURIComponent(po + "/" + pr);
          prevLink.textContent = "← " + (prev.title || pr);
          prevLink.classList.remove("invisible");
        }
      }
      if (idx < projects.length - 1) {
        const nxt = projects[idx + 1];
        const no = nxt.owner || "GregoryCarberry";
        const nr = nxt.repo || "";
        if (nr) {
          nextLink.href = "/project.html?repo=" + encodeURIComponent(no + "/" + nr);
          nextLink.textContent = (nxt.title || nr) + " →";
          nextLink.classList.remove("invisible");
        }
      }
    }
  }

  // Case study markdown: /case-studies/<repo>.md or explicit caseStudy field
  if (caseEl && repo) {
    caseEl.innerHTML = "<p class='text-sm text-slate-500'>Loading case study…</p>";
    const fileName = (current.caseStudy && current.caseStudy.trim())
      ? current.caseStudy.trim()
      : repo + ".md";

    const path = "/case-studies/" + fileName;

    try {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) throw new Error("Case study not found");
      const md = await res.text();

      if (window.marked) {
        caseEl.innerHTML = window.marked.parse(md);
      } else {
        caseEl.textContent = md;
      }

      if (window.hljs) {
        try { window.hljs.highlightAll(); } catch (e) {}
      }
      if (window.mermaid) {
        try {
          window.mermaid.initialize({ startOnLoad: false });
          window.mermaid.run();
        } catch (e) {}
      }
    } catch (err) {
      console.error("Case study load error", err);
      caseEl.innerHTML = "<p class='text-rose-600'>Could not load the case study file.</p>";
    }
  }

  setTimeout(setLastUpdated, 500);
})();