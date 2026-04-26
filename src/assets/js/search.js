(function () {
  'use strict';

  const searchInput   = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  if (!searchInput || !searchResults) return;

  // ── Base path (set in base.njk <meta name="base-path">) ────────────────────
  const basePath = (
    document.querySelector('meta[name="base-path"]')?.content ?? '/'
  ).replace(/\/$/, '');

  // ── State ───────────────────────────────────────────────────────────────────
  let idx  = null;
  let docs = [];

  // ── Build lunr index from JSON ──────────────────────────────────────────────
  async function loadIndex() {
    try {
      const res = await fetch(basePath + '/search-index.json');
      if (!res.ok) return;
      docs = await res.json();
      idx = lunr(function () {          // lunr loaded from CDN in base.njk
        this.ref('url');
        this.field('title', { boost: 10 });
        this.field('body');
        docs.forEach((d) => this.add(d));
      });
    } catch (_) {
      // Search unavailable — silent fail
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadIndex);
  } else {
    loadIndex();
  }

  // ── Helpers ─────────────────────────────────────────────────────────────────
  function escHtml(str) {
    return (str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function closeResults() {
    searchResults.hidden = true;
    searchResults.innerHTML = '';
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  function renderResults(query) {
    const q = query.trim();
    if (!idx || q.length < 2) { closeResults(); return; }

    let matches;
    try {
      // Append wildcard so partial words match (e.g. "praye" → "prayer")
      matches = idx.search(q + '*');
    } catch (_) {
      matches = [];
    }
    if (!matches.length) { closeResults(); return; }

    const hits = matches
      .slice(0, 8)
      .map((m) => docs.find((d) => d.url === m.ref))
      .filter(Boolean);

    searchResults.innerHTML = hits.map((doc) => `
      <li>
        <a class="search-result" href="${escHtml(doc.url)}">
          <div class="search-result__title">${escHtml(doc.title)}</div>
          <div class="search-result__meta">
            <span class="tag tag--${escHtml(doc.section)}">${escHtml(doc.section)}</span>
          </div>
        </a>
      </li>
    `).join('');
    searchResults.hidden = false;
  }

  // ── Debounce ─────────────────────────────────────────────────────────────────
  let timer;
  searchInput.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(() => renderResults(this.value), 200);
  });

  // ── Dismiss ──────────────────────────────────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeResults();
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      closeResults();
    }
  });

  searchResults.addEventListener('click', closeResults);

})();
