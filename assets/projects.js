const recordLastUpdated = window.__recordLastUpdated || function(){};
const setLastUpdated = window.__setLastUpdated || function(){};

const state = { q:'', tag:null, sort:'featured', data:[] };

function skeletons(){
  const grid=document.getElementById('grid');
  grid.innerHTML = Array(6).fill(`
    <div class="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-800 p-5 bg-white/60 dark:bg-slate-900/40">
      <div class="h-5 w-2/3 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div class="h-3 w-5/6 mt-3 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div class="h-3 w-3/4 mt-2 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div class="flex gap-2 mt-4">
        <div class="h-4 w-10 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
        <div class="h-4 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
      </div>
    </div>
  `).join('');
}

function normalise(s){ return (s||'').toString().toLowerCase(); }

function render(){
  const grid=document.getElementById('grid');
  const count=document.getElementById('count');
  const q = normalise(state.q);
  let items = [...state.data];
  if(q){
    items = items.filter(p=>{
      const hay = [p.title, p.blurb, (p.tags||[]).join(' ')].map(normalise).join(' ');
      return hay.includes(q);
    });
  }
  if(state.tag){
    items = items.filter(p=>(p.tags||[]).map(normalise).includes(normalise(state.tag)));
  }
  if(state.sort==='alpha'){
    items.sort((a,b)=>normalise(a.title||'').localeCompare(normalise(b.title||'')));
  }else if(state.sort==='recent'){
    items.sort((a,b)=>new Date(b.updated||0)-new Date(a.updated||0));
  }else{
    items.sort((a,b)=>{
      const aw = (a.featured?1:0) - (b.featured?1:0);
      if(aw!==0) return -aw;
      return normalise(a.title||'').localeCompare(normalise(b.title||''));
    });
  }
  count.textContent = `${items.length} project${items.length===1?'':'s'}`;
  if(!items.length){
    grid.innerHTML = `<div class="text-sm text-slate-500">No projects match your filters.</div>`;
    return;
  }
  grid.innerHTML='';
  items.forEach(p=>{
    const owner = p.owner || 'GregoryCarberry';
    const repo = p.repo || '';
    const link = p.link || (repo ? `https://github.com/${owner}/${repo}` : '#');
    const card = document.createElement('a');
    card.href = link; card.target = '_blank'; card.rel = 'noopener';
    card.className = `
      block group rounded-2xl border border-slate-200 dark:border-slate-800 p-5
      bg-white dark:bg-slate-900 shadow-sm transition
      hover:-translate-y-1 hover:shadow-md hover:border-indigo-400/70
      dark:hover:border-indigo-600/70
    `;
    card.innerHTML = `
      <div class="flex items-start justify-between gap-3">
        <h3 class="text-lg font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400">${p.title || repo}</h3>
        ${p.badge ? `<span class="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">${p.badge}</span>` : ''}
      </div>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">${p.blurb || ''}</p>
      ${p.readme ? `<p class="mt-3 text-xs text-slate-500 dark:text-slate-400">${p.readme}</p>` : ''}
      <div class="mt-4 flex flex-wrap gap-2">
        ${(p.tags||[]).map(t=>`<span class="text-xs px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">${t}</span>`).join('')}
      </div>
      <div class="mt-3 text-xs text-slate-500 flex gap-4" data-meta>
        <span class="stars" title="Stars">★ —</span>
        <span class="forks" title="Forks">⑂ —</span>
        ${p.updated ? `<span class="updated" title="Updated">${new Date(p.updated).toLocaleDateString('en-GB')}</span>` : ''}
      </div>
    `;
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
      const meta = card.querySelector('[data-meta]');
      if (meta && meta.parentNode) meta.parentNode.insertBefore(actions, meta);
    })();
    grid.appendChild(card);

    if(owner && repo){
      fetch(`https://api.github.com/repos/${owner}/${repo}`)
        .then(r=>r.ok?r.json():null)
        .then(meta=>{
          if(!meta) return;
          const m = card.querySelector('[data-meta]');
          if(m){
            m.querySelector('.stars').textContent = `★ ${meta.stargazers_count}`;
            m.querySelector('.forks').textContent = `⑂ ${meta.forks_count}`;
          }
        }).catch(()=>{});
    }
  });
}

function renderTags(all){
  const tagsEl = document.getElementById('tags');
  const uniq = new Set();
  all.forEach(p => (p.tags||[]).forEach(t => uniq.add(t)));
  const tags = Array.from(uniq).sort((a,b)=>a.localeCompare(b));
  tagsEl.innerHTML = [
    `<button class="chip px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700 ${state.tag?'':'bg-indigo-600 text-white border-indigo-600'}" data-tag="">All</button>`,
    ...tags.map(t=>`<button class="chip px-3 py-1 rounded-full border border-slate-300 dark:border-slate-700 ${state.tag===t?'bg-indigo-600 text-white border-indigo-600':''}" data-tag="${t}">${t}</button>`)
  ].join(' ');
  tagsEl.querySelectorAll('.chip').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      state.tag = btn.dataset.tag || null;
      renderTags(state.data);
      render();
    });
  });
}

(async function loadProjects(){
  skeletons();
  try{
    const res = await fetch('/data/projects.json', { cache: 'no-store' });
    recordLastUpdated(res);
    const projects = await res.json();
    state.data = projects.map(p=>({ ...p }));
    renderTags(state.data);
    render();
  }catch{
    document.getElementById('grid').innerHTML = `<div class="text-sm text-rose-600">Could not load projects.json</div>`;
  }
  setTimeout(setLastUpdated, 400);
})();

document.getElementById('search').addEventListener('input', (e)=>{ state.q=e.target.value; render(); });
document.getElementById('sort').addEventListener('change', (e)=>{ state.sort=e.target.value; render(); });
