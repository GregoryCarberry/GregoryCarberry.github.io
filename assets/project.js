const recordLastUpdated = window.__recordLastUpdated || function(){};
const setLastUpdated = window.__setLastUpdated || function(){};

const qs = new URLSearchParams(location.search);
const repoParam = qs.get('repo') || '';
const ownerParam = qs.get('owner') || '';
const [ownerFromRepo, repoFromRepo] = repoParam.includes('/') ? repoParam.split('/') : [null, repoParam];
const owner = ownerParam || ownerFromRepo || 'GregoryCarberry';
const repo = repoFromRepo || repoParam;
const repoURL = (owner && repo) ? `https://github.com/${owner}/${repo}` : '#';
const rawBase = `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/`;

function setDynamicSEO(project){
  if(!project) return;
  const title = `${project.title || repo} — Project by Gregory John Carberry`;
  document.title = title;
  const desc = project.blurb || 'Project details and README.';
  const pairs = [
    ['meta[name="description"]','content',desc],
    ['meta[property="og:title"]','content',title],
    ['meta[property="og:description"]','content',desc],
    ['meta[property="og:url"]','content',location.href],
    ['meta[name="twitter:title"]','content',title],
    ['meta[name="twitter:description"]','content',desc],
  ];
  pairs.forEach(([sel,attr,val])=>{ const el = document.querySelector(sel); if(el) el.setAttribute(attr,val); });
}

function chip(text){
  const span=document.createElement('span');
  span.className='badge border border-slate-200 dark:border-slate-700';
  span.textContent=text;
  return span;
}
function stat(text){ const s=document.createElement('span'); s.className='stat'; s.textContent=text; return s; }

function githubifyReadme(container){
  if(!container) return;
  container.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src') || '';
    if (src && !/^https?:\/\//i.test(src) && !src.startsWith('#')) {
      const clean = src.replace(/^\.\//,'').replace(/^\/+/,'');
      img.src = rawBase + clean;
    }
  });
  container.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (!href) return;
    if (/^https?:\/\//i.test(href) || href.startsWith('#')) return;
    const clean = href.replace(/^\.\//,'').replace(/^\/+/,'');
    a.href = `${repoURL}/blob/HEAD/${clean}`;
    a.target = '_blank'; a.rel = 'noopener';
  });
  container.querySelectorAll('pre code').forEach(el => { try { hljs.highlightElement(el); } catch(e){} });
  if (window.mermaid) {
    container.querySelectorAll('code.language-mermaid, pre code.language-mermaid').forEach(block => {
      const parent = block.closest('pre') || block.parentElement;
      const graph = document.createElement('div');
      graph.className = 'mermaid';
      graph.textContent = block.textContent;
      parent.replaceWith(graph);
    });
    try { mermaid.initialize({ startOnLoad: true, securityLevel: 'loose', theme: (document.documentElement.classList.contains('dark') ? 'dark' : 'default') }); } catch(e){}
  }
}

async function fetchReadmeHTML(owner, repo){
  try{
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: { 'Accept': 'application/vnd.github.v3.html' }
    });
    if (res.ok) return { html: await res.text(), source: 'api-html' };
  }catch{}
  try{
    const raw = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/README.md`);
    if (raw.ok) {
      const md = await raw.text();
      const html = (window.marked && window.marked.parse) ? window.marked.parse(md) : `<pre>${md.replace(/[&<>]/g,m=>({ "&":"&amp;","<":"&lt;",">":"&gt;"}[m]))}</pre>`;
      return { html, source: 'raw-md' };
    }
  }catch{}
  return { html: null, source: 'none' };
}

(async function loadProject(){
  let project = null, list = [];
  try{
    const res = await fetch('/data/projects.json', { cache: 'no-store' });
    recordLastUpdated(res);
    list = await res.json();
    project = list.find(p => (p.repo||'').toLowerCase() === (repo||'').toLowerCase() ||
                              (p.link||'').toLowerCase().endsWith(`/${owner}/${repo}`));
  }catch{}

  const titleEl = document.getElementById('title');
  const blurbEl = document.getElementById('blurb');
  const tagsEl  = document.getElementById('tags');
  const statsEl = document.getElementById('stats');
  const readmeEl= document.getElementById('readme');
  const repoLink= document.getElementById('repoLink');
  const demoLink= document.getElementById('demoLink');

  titleEl.textContent = project?.title || repo || 'Project';
  blurbEl.textContent = project?.blurb || '';
  repoLink.href = project?.link || repoURL;

  if (project?.demo){
    demoLink.href = project.demo;
    demoLink.classList.remove('hidden');
  }

  tagsEl.innerHTML = '';
  (project?.tags || []).forEach(t => tagsEl.appendChild(chip(t)));
  if (project?.badge) {
    const b = document.createElement('span');
    b.className = 'badge bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60';
    b.textContent = project.badge;
    tagsEl.appendChild(b);
  }

  setDynamicSEO(project);

  if (owner && repo){
    try{
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
      const meta = res.ok ? await res.json() : null;
      if (meta){
        statsEl.innerHTML = '';
        statsEl.appendChild(stat(`★ ${meta.stargazers_count}`));
        statsEl.appendChild(stat(`⑂ ${meta.forks_count}`));
        if (project?.updated || meta.updated_at) {
          const dt = new Date(project?.updated || meta.updated_at);
          const span = stat(`Updated ${dt.toLocaleDateString('en-GB')}`);
          statsEl.appendChild(span);
        }
      }
    }catch{}
  }

  if (owner && repo){
    const { html } = await fetchReadmeHTML(owner, repo);
    if (html) {
      readmeEl.innerHTML = html;
      readmeEl.querySelectorAll('a[href^="http"]').forEach(a => { a.target='_blank'; a.rel='noopener'; });
      githubifyReadme(readmeEl);
    } else {
      readmeEl.innerHTML = `<div class="text-sm text-slate-500">README not available. <a class="underline" target="_blank" rel="noopener" href="${repoURL}#readme">Open on GitHub</a>.</div>`;
    }
  } else {
    readmeEl.innerHTML = `<div class="text-sm text-slate-500">Repository not specified.</div>`;
  }

  if (project && Array.isArray(list)) {
    const idx = list.findIndex(p => (p.repo||'').toLowerCase() === (repo||'').toLowerCase());
    const prev = idx > 0 ? list[idx - 1] : null;
    const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
    const prevEl = document.getElementById('prevProject');
    const nextEl = document.getElementById('nextProject');
    const toHref = (p) => {
      const own = (p.owner || 'GregoryCarberry');
      const r = p.repo || '';
      return r ? `/project.html?repo=${own}/${r}` : '/projects.html';
    };
    if (prev) { prevEl.textContent = `← ${prev.title || prev.repo || 'Previous'}`; prevEl.href = toHref(prev); prevEl.classList.remove('invisible'); }
    if (next) { nextEl.textContent = `${next.title || next.repo || 'Next'} →`; nextEl.href = toHref(next); nextEl.classList.remove('invisible'); }
  }

  setTimeout(setLastUpdated, 400);
})();
