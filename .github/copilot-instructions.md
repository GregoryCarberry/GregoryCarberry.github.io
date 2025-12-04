<!-- .github/copilot-instructions.md -->
# Copilot / AI Agent Instructions

Purpose: Help an AI agent be immediately productive in this repository by summarising the architecture, developer workflows, conventions, and concrete code examples to modify content and behavior safely.

1) Big picture
- This is a static, data-driven portfolio served on GitHub Pages. HTML pages (`index.html`, `projects.html`, `project.html`) load JSON from `/data/*.json` and render UI with scripts in `assets/*.js`.
- No build step or framework: changes are usually direct edits to `data/` JSON, `assets/*.js`, or `assets/site.css` and are published by committing + pushing.

2) Key files and roles (quick reference)
- Content: `data/*.json` (e.g. `projects.json`, `certs.json`, `skills.json`, `timeline.json`).
- Pages: `index.html`, `projects.html`, `project.html`.
- Shared JS/CSS: `assets/common.js`, `assets/site.css`.
- Page logic: `assets/index.js`, `assets/projects.js`, `assets/project.js`.
- Case studies: `case-studies/*.md` (loaded by `assets/project.js`).
- PWA: `manifest.webmanifest`, `sw.js` (registered only on the real site hostname).
- Tailwind: runtime Tailwind v4 (browser CDN). `tailwind-config.js` is present but there is no compilation step.

3) Data-driven conventions (exact patterns to follow)
- To add or update content, edit the appropriate `data/*.json` file and push. The site reads these files at runtime.
- Project entries in `data/projects.json` commonly include: `title`, `owner`, `repo`, `blurb`, `tags` (array), `demo`/`liveDemo`/`url`, and optional `caseStudy` (filename). Example use in `assets/project.js`:
  - The project page accepts `?repo=<owner>/<repo>` and resolves against `projects.json`.
  - Case study fallback path: `/case-studies/<repo>.md` unless `caseStudy` is provided.

4) Runtime & UX conventions agents must preserve
- Theme/dark mode: implemented via a `.dark` class on `<html>`; toggled in `assets/common.js`. Do not replace with CSS-only assumptions.
- Fresh fetches: code commonly uses `fetch(..., { cache: "no-store" })` to avoid stale JSON; preserve when updating network logic.
- Last-updated tracking: `assets/common.js` exposes `window.__recordLastUpdated(res)` and `window.__setLastUpdated()`; use these when adding any network fetches so the page shows update dates.
- GitHub API: `assets/project.js` calls `https://api.github.com/repos/${owner}/${repo}` without auth — expect unauthenticated rate limits and graceful fallbacks (`metaRes.ok` checks).

5) Service worker & local dev
- Service worker (`sw.js`) only registers when `location.hostname === "gregorycarberry.github.io"`. During local testing use VS Code Live Server or a simple static server; SW will remain disabled.

6) Third-party integrations (what to keep in mind)
- Markdown rendering: `marked.js` is used when present; fallback to plain text otherwise.
- Syntax highlighting: `highlight.js` is initiated after injecting content; preserve calls to `hljs.highlightAll()` where applicable.
- Mermaid diagrams: `mermaid.initialize()` + `mermaid.run()` are used; keep these when rendering case study markdown.

7) Useful implementation examples (copyable snippets)
- Load projects.json (preserve cache policy and last-mod header recording):
  ```js
  const res = await fetch('/data/projects.json', { cache: 'no-store' });
  window.__recordLastUpdated(res);
  const projects = await res.json();
  ```
- Resolve case study file (from `assets/project.js`):
  ```js
  const fileName = (current.caseStudy && current.caseStudy.trim()) ? current.caseStudy.trim() : repo + '.md';
  const path = '/case-studies/' + fileName;
  ```

8) Tests / build / deploy
- There are no automated tests or build artifacts. Local dev: open `index.html` with VS Code Live Server. Deploy: push to `main` (GitHub Pages config serves the site).

9) Safety & non-goals for agents
- Do not add a bundler/build pipeline unless requested. This repo intentionally avoids build tools.
- Avoid changing how data is structured in `data/*.json` without updating all callers in `assets/*.js`.

10) If you need clarification
- Ask the repository owner about desired change scope (content, layout, styling, or architecture change). If modifying network flows (e.g., adding authenticated GitHub API calls), request credentials and deployment preferences first.

--
Please review and tell me if you'd like additional examples (e.g., concrete `projects.json` shape or sample edits to `assets/site.css`).
