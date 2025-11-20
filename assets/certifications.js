// Render certifications & skills from JSON data files
(async function () {
  const certContainer = document.getElementById('certCategories');
  const skillsContainer = document.getElementById('skillsDomains');

  async function loadJson(path) {
    const res = await fetch(path, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to load ${path}: ${res.status}`);
    }
    return res.json();
  }

  // Render certifications
  try {
    const certData = await loadJson('data/certifications-page.json');

    if (!certData || !Array.isArray(certData.categories)) {
      throw new Error('certifications-page.json has unexpected shape');
    }

    certContainer.innerHTML = '';

    certData.categories.forEach((cat) => {
      const section = document.createElement('section');
      section.className = 'space-y-4';

      const h3 = document.createElement('h3');
      h3.className = 'text-xl font-semibold';
      h3.textContent = cat.title || 'Untitled category';
      section.appendChild(h3);

      const grid = document.createElement('div');
      grid.className = 'mt-2 grid gap-4 md:grid-cols-2';

      (cat.items || []).forEach((item) => {
        const article = document.createElement('article');
        // `card` is a utility class in site.css; fall back to basic styling if needed
        article.className =
          'card rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4';

        const title = document.createElement('h4');
        title.className = 'font-semibold';
        title.textContent = item.name || 'Untitled certification';
        article.appendChild(title);

        if (item.issuer) {
          const issuer = document.createElement('p');
          issuer.className = 'mt-1 text-xs text-slate-500 dark:text-slate-400';
          issuer.textContent = item.issuer;
          article.appendChild(issuer);
        }

        if (item.summary) {
          const summary = document.createElement('p');
          summary.className = 'mt-2 text-sm text-slate-600 dark:text-slate-300';
          summary.textContent = item.summary;
          article.appendChild(summary);
        }

        if ((item.tags && item.tags.length) || item.year) {
          const meta = document.createElement('div');
          meta.className =
            'mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500 dark:text-slate-400';

          if (item.year) {
            const badge = document.createElement('span');
            badge.className =
              'px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700';
            badge.textContent = item.year;
            meta.appendChild(badge);
          }

          (item.tags || []).forEach((tag) => {
            const badge = document.createElement('span');
            badge.className =
              'px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700';
            badge.textContent = tag;
            meta.appendChild(badge);
          });

          article.appendChild(meta);
        }

        grid.appendChild(article);
      });

      section.appendChild(grid);
      certContainer.appendChild(section);
    });
  } catch (err) {
    console.error(err);
    if (certContainer) {
      certContainer.innerHTML =
        '<p class="text-sm text-rose-500">Unable to load certifications data right now.</p>';
    }
  }

  // Render skills
  try {
    const skillsData = await loadJson('data/skills-page.json');

    if (!skillsData || !Array.isArray(skillsData.domains)) {
      throw new Error('skills-page.json has unexpected shape');
    }

    skillsContainer.innerHTML = '';

    skillsData.domains.forEach((domain) => {
      const wrapper = document.createElement('section');
      wrapper.className = 'space-y-3';

      const h3 = document.createElement('h3');
      h3.className =
        'text-sm font-semibold uppercase tracking-wide text-slate-400';
      h3.textContent = domain.title || 'Untitled domain';
      wrapper.appendChild(h3);

      const list = document.createElement('div');
      list.className = 'flex flex-wrap gap-2 text-sm';

      (domain.skills || []).forEach((skill) => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = skill;
        list.appendChild(chip);
      });

      wrapper.appendChild(list);
      skillsContainer.appendChild(wrapper);
    });
  } catch (err) {
    console.error(err);
    if (skillsContainer) {
      skillsContainer.innerHTML =
        '<p class="text-sm text-rose-500">Unable to load skills data right now.</p>';
    }
  }
})();
