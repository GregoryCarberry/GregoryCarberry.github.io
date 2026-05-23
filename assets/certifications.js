// Render certifications & skills from JSON data files
(async function () {
  const certContainer = document.getElementById("certCategories");
  const skillsContainer = document.getElementById("skillsDomains");
  const relevantContainer = document.getElementById("relevantCerts");

  async function loadJson(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return res.json();
  }

  function createCertCard(item, compact = false) {
    const article = document.createElement("article");
    article.className = "card rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4";

    const title = document.createElement("h4");
    title.className = "font-semibold";
    title.textContent = item.name || "Untitled certification";
    article.appendChild(title);

    if (item.issuer) {
      const issuer = document.createElement("p");
      issuer.className = "mt-1 text-xs text-slate-500 dark:text-slate-400";
      issuer.textContent = item.issuer;
      article.appendChild(issuer);
    }

    if (item.summary && !compact) {
      const summary = document.createElement("p");
      summary.className = "mt-2 text-sm text-slate-600 dark:text-slate-300";
      summary.textContent = item.summary;
      article.appendChild(summary);
    }

    const meta = document.createElement("div");
    meta.className = "mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400";

    if (item.year) {
      const badge = document.createElement("span");
      badge.className = "px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700";
      badge.textContent = item.year;
      meta.appendChild(badge);
    }

    (item.tags || []).slice(0, compact ? 3 : 99).forEach((tag) => {
      const badge = document.createElement("span");
      badge.className = "px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700";
      badge.textContent = tag;
      meta.appendChild(badge);
    });

    if (meta.children.length) article.appendChild(meta);
    return article;
  }

  try {
    const skillsData = await loadJson("data/skills-page.json");
    if (!skillsData || !Array.isArray(skillsData.domains)) throw new Error("skills-page.json has unexpected shape");
    skillsContainer.innerHTML = "";

    skillsData.domains.forEach((domain) => {
      const wrapper = document.createElement("section");
      wrapper.className = "rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5";

      const h3 = document.createElement("h3");
      h3.className = "font-semibold";
      h3.textContent = domain.title || "Untitled domain";
      wrapper.appendChild(h3);

      if (domain.summary) {
        const summary = document.createElement("p");
        summary.className = "mt-2 text-sm text-slate-600 dark:text-slate-300";
        summary.textContent = domain.summary;
        wrapper.appendChild(summary);
      }

      const list = document.createElement("div");
      list.className = "mt-4 flex flex-wrap gap-2 text-sm";
      (domain.skills || []).forEach((skill) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = skill;
        list.appendChild(chip);
      });

      wrapper.appendChild(list);
      skillsContainer.appendChild(wrapper);
    });
  } catch (err) {
    console.error(err);
    if (skillsContainer) skillsContainer.innerHTML = '<p class="text-sm text-rose-500">Unable to load skills data right now.</p>';
  }

  try {
    const certData = await loadJson("data/certifications-page.json");
    if (!certData || !Array.isArray(certData.categories)) throw new Error("certifications-page.json has unexpected shape");

    const allItems = certData.categories.flatMap((cat) => (cat.items || []).map((item) => ({ ...item, category: cat.title })));
    const relevant = allItems.filter((item) => item.relevant);

    if (relevantContainer) {
      relevantContainer.innerHTML = "";
      relevant.slice(0, 9).forEach((item) => relevantContainer.appendChild(createCertCard(item, true)));
    }

    certContainer.innerHTML = "";
    certData.categories.forEach((cat) => {
      const section = document.createElement("section");
      section.className = "space-y-4";
      const h3 = document.createElement("h3");
      h3.className = "text-xl font-semibold";
      h3.textContent = cat.title || "Untitled category";
      section.appendChild(h3);
      const grid = document.createElement("div");
      grid.className = "mt-2 grid gap-4 md:grid-cols-2";
      (cat.items || []).forEach((item) => grid.appendChild(createCertCard(item)));
      section.appendChild(grid);
      certContainer.appendChild(section);
    });
  } catch (err) {
    console.error(err);
    if (certContainer) certContainer.innerHTML = '<p class="text-sm text-rose-500">Unable to load certifications data right now.</p>';
  }
})();
