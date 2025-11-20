const recordLastUpdated = window.__recordLastUpdated || function(){};
const setLastUpdated = window.__setLastUpdated || function(){};

// Links for hero/contact
function mkBtn(label, href, variant){
  const a = document.createElement('a');
  a.href = href || '#';

  // External links open in new tab
  if (/^https?:\/\//.test(href || '')) {
    a.target = '_blank';
    a.rel = 'noopener';
  }

  const base =
    'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium ' +
    'transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
    'focus-visible:ring-indigo-500';

  const primary =
    ' bg-indigo-600 text-white shadow-sm hover:bg-indigo-500';

  const secondary =
    ' border border-slate-300 dark:border-slate-700 bg-white/5 text-slate-900 dark:text-slate-100 ' +
    'hover:bg-slate-100/60 dark:hover:bg-slate-800/80';

  a.className = base + (variant === 'primary' ? primary : secondary);
  a.textContent = label;
  return a;
}

(async function loadLinksExtended(){
  try{
    const res = await fetch('/data/links.json', { cache: 'no-store' });
    recordLastUpdated(res);
    const links = await res.json();
    const hero = document.getElementById('heroButtons');
    const contact = document.getElementById('contactButtons');
    if (hero) {
      hero.innerHTML='';
      links
        .filter(l=>l.slot==='hero')
        .forEach(l=>hero.appendChild(mkBtn(l.label,l.href,l.variant)));
    }
    if (contact) {
      contact.innerHTML='';
      links
        .filter(l=>l.slot==='contact')
        .forEach(l=>contact.appendChild(mkBtn(l.label,l.href)));
    }
    setTimeout(setLastUpdated, 200);
  }catch{}
})();

// Profile -> hero tagline + learning line
(async function loadProfile(){
  const taglineEl = document.getElementById('heroTagline');
  const learningEl = document.getElementById('heroLearning');
  try{
    const res = await fetch('/data/profile.json', { cache: 'no-store' });
    recordLastUpdated(res);
    const p = await res.json();
    if (taglineEl) taglineEl.textContent = p.tagline || '';
    if (learningEl) learningEl.textContent = p.learning || '';
  }catch{}
})();

// Highlights strip (data-driven pills)
(async function loadHighlights(){
  const strip = document.getElementById('highlightsStrip');
  if (!strip) return;
  strip.innerHTML = '<span class="text-xs text-slate-500">Loading highlights…</span>';
  try{
    const res = await fetch('/data/highlights.json', { cache: 'no-store' });
    recordLastUpdated(res);
    const items = await res.json();
    strip.innerHTML = '';
    if (Array.isArray(items) && items.length){
      items.forEach(raw => {
        let text = '';
        if (typeof raw === 'string') {
          text = raw;
        } else if (raw && typeof raw === 'object') {
          text = raw.label || raw.text || '';
        }
        if (!text) return;
        const pill = document.createElement('span');
        pill.className = 'inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1';
        pill.textContent = text;
        strip.appendChild(pill);
      });
    } else {
      strip.innerHTML = '<span class="text-xs text-slate-500">No highlights yet.</span>';
    }
  }catch{
    strip.innerHTML = '<span class="text-xs text-rose-600">Could not load highlights.json</span>';
  }
})();

// Skills grid
(async function loadSkills(){
  const grid = document.getElementById('skillsGrid');
  if (!grid) return;
  grid.innerHTML = '<div class="text-sm text-slate-500">Loading skills…</div>';
  try{
    const res = await fetch('/data/skills.json', { cache: 'no-store' });
    recordLastUpdated(res);
    const skills = await res.json();
    grid.innerHTML = '';
    skills.forEach(s => {
      const card = document.createElement('div');
      card.className = 'p-4 rounded-xl border border-slate-200 dark:border-slate-800';
      card.innerHTML = `<div class="font-medium">${s.title}</div>
        <p class="mt-1 text-slate-600 dark:text-slate-300">${s.text}</p>`;
      grid.appendChild(card);
    });
  }catch{
    grid.innerHTML = '<div class="text-sm text-rose-600">Could not load skills.json</div>';
  }
})();

// Featured projects
(async function loadProjects(){
  const grid = document.getElementById('projectGrid');
  if (!grid) return;
  grid.innerHTML = Array(3).fill(`
    <div class="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white/60 dark:bg-slate-900/40">
      <div class="h-5 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div class="h-3 w-5/6 mt-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div class="h-3 w-3/4 mt-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div class="flex gap-2 mt-4">
        <div class="h-4 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div class="h-4 w-14 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>
    </div>
  `).join('');
  try{
    const res = await fetch('/data/projects.json', { cache: 'no-store' });
    recordLastUpdated(res);
    const projects = await res.json();
    grid.innerHTML = '';
    projects.forEach(p => {
      const owner = p.owner || 'GregoryCarberry';
      const repo = p.repo || '';
      const link = p.link || (repo ? `https://github.com/${owner}/${repo}` : '#');
      const el = document.createElement('a');
      el.href = link; el.target = '_blank'; el.rel = 'noopener';
      el.className = `
        block group rounded-2xl border border-slate-200 dark:border-slate-800 p-5
        bg-white dark:bg-slate-900 shadow-sm transition
        hover:-translate-y-1 hover:shadow-md hover:border-indigo-400/70
        dark:hover:border-indigo-600/70
      `;
      el.innerHTML = `
        <div class="flex items-start justify-between gap-3">
          <h3 class="text-lg font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">${p.title || repo}</h3>
          <span class="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">Case Study</span>
        </div>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${p.blurb || ''}</p>
        <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">${p.readme || ''}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          ${(p.tags || []).map(t => `<span class="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">${t}</span>`).join('')}
        </div>
        <div class="mt-3 text-xs text-slate-500 flex gap-4" data-meta>
          <span class="stars" title="Stars">★ —</span>
          <span class="forks" title="Forks">⑂ —</span>
        </div>
      `;
      // Buttons
      (function() {
        const actions = document.createElement('div');
        actions.className = 'mt-4 flex gap-2';
        if (owner && repo) {
          const a = document.createElement('a');
          a.className = 'text-xs px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700';
          a.href = `/project.html?repo=${owner}/${repo}`;
          a.textContent = 'Details';
          actions.appendChild(a);
        } else {
          const span = document.createElement('span');
          span.className = 'text-xs px-3 py-1 rounded-lg border border-slate-300 dark:border-slate-700 opacity-50 cursor-not-allowed';
          span.setAttribute('aria-disabled','true');
          span.title = 'No details available';
          span.textContent = 'Details';
          actions.appendChild(span);
        }
        const gh = document.createElement('a');
        gh.className = 'text-xs px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500';
        gh.href = link; gh.target = '_blank'; gh.rel = 'noopener';
        gh.textContent = 'GitHub';
        actions.appendChild(gh);
        const meta = el.querySelector('[data-meta]');
        if (meta && meta.parentNode) meta.parentNode.insertBefore(actions, meta);
      })();
      grid.appendChild(el);

      if (owner && repo) {
        fetch(`https://api.github.com/repos/${owner}/${repo}`)
          .then(r => (r.ok ? r.json() : null))
          .then(meta => {
            if (!meta) return;
            const m = el.querySelector('[data-meta]');
            if (m) {
              m.querySelector('.stars').textContent = `★ ${meta.stargazers_count}`;
              m.querySelector('.forks').textContent = `⑂ ${meta.forks_count}`;
            }
          }).catch(() => {});
      }
    });
  }catch{
    grid.innerHTML = '<div class="text-sm text-rose-600">Could not load projects.json or GitHub API limited.</div>';
  }
})();

// Timeline with icons, legend, and continuous auto-scroll
(async function loadTimeline(){
  const section = document.getElementById('timeline');
  const list = document.getElementById('timelineList');
  if (!section || !list) return;

  list.innerHTML = '<li class="pl-6 py-3"><div class="text-sm text-slate-500">Loading…</div></li>';

  try {
    const res = await fetch('/data/timeline.json', { cache: 'no-store' });
    recordLastUpdated(res);
    const items = await res.json();

    list.innerHTML = '';

    // Ensure the list behaves like a scrollable pane (4–5 items high)
    list.classList.add('max-h-96', 'overflow-y-auto', 'pr-2');

    // Icon + colour per category
    const icons = {
      project:   { icon: "🛠️", colour: "text-indigo-500" },
      cert:      { icon: "🏅", colour: "text-emerald-500" },
      course:    { icon: "📘", colour: "text-fuchsia-500" },
      education: { icon: "🎓", colour: "text-amber-500" },
      other:     { icon: "📌", colour: "text-slate-500" }
    };

    // Build legend from the data present
    const seen = new Set();
    const legendWrapper = document.createElement("div");
    legendWrapper.className = "timeline-legend flex flex-wrap gap-4 mt-1 text-xs text-slate-500";

    items.forEach(it => {
      const cat = it.category || "other";
      if (seen.has(cat)) return;
      seen.add(cat);
      const conf = icons[cat] || icons.other;
      const block = document.createElement("div");
      block.className = "flex items-center gap-1";
      block.innerHTML = `
        <span class="${conf.colour} text-lg">${conf.icon}</span>
        <span class="capitalize">${cat}</span>
      `;
      legendWrapper.appendChild(block);
    });

    const header = section.querySelector("h2");
    if (header && !section.querySelector(".timeline-legend")) {
      header.insertAdjacentElement("afterend", legendWrapper);
    }

    // Render all items
    items.forEach(it => {
      const when    = it.date    || it.when    || "";
      const title   = it.title   || it.text    || "";
      const summary = it.summary || "";
      const cat     = it.category || "other";

      const conf = icons[cat] || icons.other;

      const li = document.createElement("li");
      li.className = "timeline-item pl-8 py-3 relative";
      li.dataset.category = cat;

      li.innerHTML = `
        <span class="timeline-icon absolute left-0 top-4 ${conf.colour} text-xl">${conf.icon}</span>
        <div class="text-xs text-slate-500">${when}</div>
        <div class="font-medium">${title}</div>
        ${summary ? `<div class="text-sm text-slate-400 mt-1">${summary}</div>` : ""}
      `;

      list.appendChild(li);
    });

    const allItems = Array.from(list.querySelectorAll(".timeline-item"));
    if (!allItems.length) return;

    // --- Continuous auto-scroll with pause on user interaction ---

    const SPEED_PX_PER_SEC = 12; // smaller = slower, larger = faster
    const PAUSE_MS = 6000;       // pause this long after user input

    let userPausedUntil = 0;
    let lastTs = null;
    let scrollPos = list.scrollTop || 0;

    function pauseFromUser() {
      userPausedUntil = Date.now() + PAUSE_MS;
    }

    // Pause auto-scroll when the user interacts with the timeline
    list.addEventListener('wheel',     pauseFromUser, { passive: true });
    list.addEventListener('touchmove', pauseFromUser, { passive: true });
    list.addEventListener('keydown',   pauseFromUser);

    function autoScroll(timestamp) {
      const maxScroll = list.scrollHeight - list.clientHeight;

      if (maxScroll > 0) {
        if (lastTs === null) {
          lastTs = timestamp;
        }
        const dt = timestamp - lastTs;
        lastTs = timestamp;

        const now = Date.now();
        if (now >= userPausedUntil) {
          const delta = (SPEED_PX_PER_SEC * dt) / 1000; // px this frame
          scrollPos += delta;
          if (scrollPos >= maxScroll) {
            scrollPos = 0; // loop back to top
          }
          list.scrollTop = scrollPos;
        }
      }

      requestAnimationFrame(autoScroll);
    }

    requestAnimationFrame(autoScroll);

  } catch (err) {
    console.error(err);
    list.innerHTML =
      '<li class="pl-6 py-3"><div class="text-sm text-rose-600">Could not load timeline.json.</div></li>';
  }
})();

// Active section underline
(function() {
  const nav = document.getElementById('navLinks');
  if (!nav) return;
  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window) || sections.length === 0) return;
  const setActive = (id) => {
    links.forEach(a => {
      const on = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('underline', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  };
  const io = new IntersectionObserver((entries) => {
    const topMost = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (topMost?.target?.id) setActive(topMost.target.id);
  }, { rootMargin: '-40% 0px -55% 0px', threshold: [0, .25, .5, .75, 1] });
  sections.forEach(s => io.observe(s));
})();

setTimeout(setLastUpdated, 500);
