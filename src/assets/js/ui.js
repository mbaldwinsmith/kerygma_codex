(function () {
  'use strict';

  // ── Scroll reveal ───────────────────────────────────────────────────────────
  // .reveal elements fade up (via CSS) when they enter the viewport.

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('reveal--visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0, rootMargin: '0px 0px -40px 0px' }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add('reveal--visible'));
    }
  }

  // ── Hamburger nav ───────────────────────────────────────────────────────────

  const nav       = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav__hamburger');

  if (nav && hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('nav--open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('nav--open')) {
        nav.classList.remove('nav--open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── TOC builder ─────────────────────────────────────────────────────────────
  // Reads h2 headings from .prose, adds IDs if missing, populates #toc-list.

  const tocList = document.getElementById('toc-list');
  const prose   = document.querySelector('.prose');

  if (tocList && prose) {
    const headings  = Array.from(prose.querySelectorAll('h2'));
    const usedIds   = new Set();

    function makeId(text) {
      let base = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
        .slice(0, 50) || 'section';
      let id = base;
      let n  = 2;
      while (usedIds.has(id)) id = base + '-' + n++;
      usedIds.add(id);
      return id;
    }

    headings.forEach((heading) => {
      if (!heading.id) heading.id = makeId(heading.textContent);
      const li = document.createElement('li');
      const a  = document.createElement('a');
      a.href      = '#' + heading.id;
      a.className = 'toc__link';
      a.textContent = heading.textContent;
      li.appendChild(a);
      tocList.appendChild(li);
    });

    // Highlight the active TOC link as the user scrolls.
    if ('IntersectionObserver' in window && tocList.children.length) {
      const tocLinks = tocList.querySelectorAll('.toc__link');
      const headingObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              tocLinks.forEach((l) => l.classList.remove('active'));
              const active = tocList.querySelector(`a[href="#${entry.target.id}"]`);
              if (active) active.classList.add('active');
            }
          });
        },
        { rootMargin: '0px 0px -60% 0px', threshold: 0 }
      );
      headings.forEach((h) => headingObserver.observe(h));
    }
  }

  // ── Layer effects table ─────────────────────────────────────────────────────
  // Only applies to tables whose first header cell contains "Layer".

  document.querySelectorAll('.prose table').forEach((table) => {
    const firstTh = table.querySelector('th');
    if (!firstTh || !firstTh.textContent.includes('Layer')) return;
    table.querySelectorAll('td').forEach((cell) => {
      const t = cell.textContent.trim();
      if      (t === '↑') cell.classList.add('layer-up');
      else if (t === '↓') cell.classList.add('layer-down');
      else if (t === '0') cell.classList.add('layer-zero');
    });
  });

})();
