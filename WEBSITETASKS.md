# Website Build Tasks

This is the build workbench for the Kerygma Codex website. It mirrors the phase/task structure of `TASKS.md`. Each task specifies target file(s), what to build, and any decisions required of the human steward.

**Stack:** Eleventy (11ty) · Nunjucks templates · Vanilla CSS (modular) · Vanilla JS · GitHub Actions → GitHub Pages

**Build model:** A pre-build script (`scripts/generate-frontmatter.js`) programmatically injects YAML frontmatter into copies of the content markdown files, writing them to `_generated/`. Eleventy reads `_generated/` and `src/pages/`. Original `content/` files are never modified.

---

## Target Directory Structure

```
kerygma_codex/
├── .github/
│   └── workflows/
│       └── deploy.yml                    # GitHub Actions: build + deploy to gh-pages
│
├── _includes/                            # Eleventy layouts and partials
│   ├── layouts/
│   │   ├── base.njk                      # HTML shell (head, body wrapper, scripts)
│   │   ├── practice.njk                  # Fundamental Practice pages
│   │   ├── foundation.njk                # Foundation doc pages (00–06)
│   │   ├── case-study.njk                # Case study pages
│   │   ├── rule-of-life.njk              # Rule of Life pages
│   │   └── listing.njk                   # Section index/listing pages
│   └── partials/
│       ├── header.njk                    # Site header, wordmark
│       ├── nav.njk                       # Primary navigation
│       ├── footer.njk                    # Site footer
│       └── search-bar.njk                # Search input + results container
│
├── _data/
│   ├── site.js                           # Site-wide metadata (title, baseUrl, etc.)
│   └── navigation.js                     # Top-level nav items array
│
├── _generated/                           # git-ignored; temp copies with injected frontmatter
│   └── content/                          # Mirrors content/ structure
│
├── _site/                                # git-ignored; Eleventy build output
│
├── src/
│   ├── assets/
│   │   ├── css/
│   │   │   ├── tokens.css               # Design tokens: palette, type scale, spacing
│   │   │   ├── typography.css           # Font loading, heading/body/blockquote styles
│   │   │   ├── layout.css               # Grid, containers, page structure
│   │   │   ├── components.css           # Cards, nav, footer, search, tables, badges
│   │   │   ├── animations.css           # All keyframes and transitions
│   │   │   └── main.css                 # @import hub only (no styles here)
│   │   ├── js/
│   │   │   ├── search.js                # lunr.js index fetch + search UI
│   │   │   └── ui.js                    # IntersectionObserver for scroll reveals, misc
│   │   └── images/
│   │       └── illustrations/
│   │           ├── hero/
│   │           │   └── home-hero.svg    # Landing page hero illustration
│   │           ├── sections/
│   │           │   ├── foundation.svg   # Foundation docs section
│   │           │   ├── practices.svg    # Practices section
│   │           │   ├── case-studies.svg # Case studies section
│   │           │   ├── rule-of-life.svg # Rule of Life section
│   │           │   └── about.svg        # About/license section
│   │           └── decorative/
│   │               ├── mandorla.svg     # Mandorla / vesica piscis motif (page divider)
│   │               └── cross-divider.svg # Thin cross motif for section breaks
│   └── pages/
│       ├── index.njk                    # Home page
│       ├── practices/
│       │   └── index.njk               # Practices listing
│       ├── foundation/
│       │   └── index.njk               # Foundation docs listing
│       ├── case-studies/
│       │   └── index.njk               # Case studies listing
│       ├── rule-of-life/
│       │   └── index.njk               # Rule of Life listing
│       └── about/
│           └── index.njk               # About, license, contributing
│
├── scripts/
│   └── generate-frontmatter.js          # Pre-build script: reads content/, writes _generated/
│
├── content/                             # EXISTING — NEVER MODIFIED
├── eleventy.config.js                   # Eleventy configuration
├── package.json
├── IMAGEPROMPTS.md                      # ChatGPT prompts for each illustration slot
├── WEBSITETASKS.md                      # This file
└── README.md
```

---

## Phase 1: Project Setup

### 1.1 — Initialize npm
**File:** `package.json`

Run `npm init -y` at the project root, then configure scripts:

```json
{
  "scripts": {
    "prebuild":  "node scripts/generate-frontmatter.js",
    "build":     "eleventy --config=eleventy.config.js",
    "prestart":  "node scripts/generate-frontmatter.js",
    "start":     "eleventy --config=eleventy.config.js --serve",
    "clean":     "rimraf _generated _site"
  }
}
```

**Dependencies to install:**
- `@11ty/eleventy` — static site generator
- `rimraf` — cross-platform directory clean
- `gray-matter` — frontmatter parsing (used in pre-build script)
- `glob` — file matching in pre-build script
- `markdown-it` — Eleventy's markdown renderer (configure directly in eleventy.config.js)

**Status:** [ ] Not started

---

### 1.2 — Extend .gitignore
**File:** `.gitignore`

Append:
```
_site/
_generated/
node_modules/
```

**Status:** [ ] Not started

---

### 1.3 — Create directory skeleton
Create all directories listed in the target structure. Touch `.gitkeep` files in empty leaf directories (`_generated/`, `src/assets/images/illustrations/hero/`, etc.) so git tracks them.

**Status:** [ ] Not started

---

## Phase 2: Pre-Build Frontmatter Script

### 2.1 — Write generate-frontmatter.js
**File:** `scripts/generate-frontmatter.js`

This script reads every relevant markdown file under `content/`, infers metadata from the file path and first `# ` heading, and writes a copy with injected YAML frontmatter to `_generated/`, preserving the relative directory structure.

**Frontmatter injected per content type:**

| Source path pattern | `section` | `layout` | `title` |
|---|---|---|---|
| `content/00_CONSTITUTION.md` | `foundation` | `foundation` | From first `# ` heading |
| `content/02_FORMALISM.md` | `foundation` | `foundation` | From first `# ` heading |
| `content/03_GLOSSARY.md` | `foundation` | `foundation` | From first `# ` heading |
| `content/04_PASTORAL_GUARDRAILS.md` | `foundation` | `foundation` | From first `# ` heading |
| `content/05_CORE_OPERATORS.md` | `foundation` | `foundation` | From first `# ` heading |
| `content/06_TESTS_AND_INVARIANTS.md` | `foundation` | `foundation` | From first `# ` heading |
| `content/INTRODUCTION.md` | `foundation` | `foundation` | `Introduction` |
| `content/MANIFESTO.md` | `foundation` | `foundation` | `Manifesto` |
| `content/07_fundamental_practices/*.md` | `practices` | `practice` | From first `# ` heading |
| `content/case_studies/*.md` | `case-studies` | `case-study` | From first `# ` heading |
| `content/Rule_of_Life/*.md` | `rule-of-life` | `rule-of-life` | From first `# ` heading |

**Files to exclude from the site (internal/tooling docs):**
- `content/01_TERM_TEMPLATE.md`
- `content/TASKS.md`
- `content/ROADMAP.md`
- `content/SYSTEM_SPEC.md`
- `content/ESCHATOLOGICAL_COMPLETION.md`
- `content/07_fundamental_practices/_INDEX.md`

**Script logic:**
1. `glob('content/**/*.md')` — collect all source files
2. Filter against the exclusion list above
3. For each file: read content, strip any pre-existing frontmatter with `gray-matter`, parse first `# ` heading as `title`
4. Resolve `section` and `layout` from the file path using the table above
5. Prepend YAML frontmatter block, write to `_generated/<same relative path>`
6. Also rewrite relative markdown links from `content/` paths to their site URLs (e.g. `[03_GLOSSARY.md](../03_GLOSSARY.md)` → `/foundation/glossary/`) — see Phase 11.3 for full link mapping

> **User task:** Review the exclusion list above. Are there any files in `content/` that should appear on the site that are not listed in the frontmatter table? Are there any listed that should be hidden?

**Status:** [ ] Not started

---

### 2.2 — Verify script output
After writing the script, run `node scripts/generate-frontmatter.js` and spot-check five generated files — one practice, one foundation doc, one case study, one Rule of Life, one edge case — to confirm frontmatter injection and title parsing are correct.

**Status:** [ ] Not started

---

## Phase 3: Eleventy Configuration

### 3.1 — Write eleventy.config.js
**File:** `eleventy.config.js`

Key configuration:
- Input dir: project root (`.`)
- Output dir: `_site`
- Ignored paths: `content/` (raw source), `node_modules/`, `README.md`, `AGENTS.md`, `WEBSITETASKS.md`, `IMAGEPROMPTS.md`, `TASKS.md`, `CHANGELOG.md`, `CONTRIBUTING.md`, `ETHICAL_USE_ADDENDUM.md`, `LICENSE.md`
- Processed paths: `_generated/**/*.md` (content pages), `src/pages/**/*.njk` (static pages)
- Template language: Nunjucks for `.njk`, Markdown for `.md`
- Passthrough copy: `src/assets/` → `assets/`, `Infographic.png`

**Collections to define:**
- `practices` — all items from `_generated/content/07_fundamental_practices/`, sorted alphabetically by `data.title`
- `foundations` — all items from `_generated/content/` where `data.section === "foundation"`, sorted by `inputPath` (preserves 00–06 numeric order)
- `caseStudies` — all items from `_generated/content/case_studies/`, sorted by `data.title`
- `ruleOfLife` — all items from `_generated/content/Rule_of_Life/`

**Filters to add:**
- `readableDate` — format ISO date as `D MMMM YYYY`
- `slugify` — convert a title string to a URL-safe slug (lowercase, hyphens)
- `excerpt` — strip markdown syntax and return first 160 characters of content

**Markdown configuration (markdown-it):**
- `typographer: true` — smart quotes, em-dashes
- `html: true` — allow HTML in markdown
- `linkify: true`

**Status:** [ ] Not started

---

### 3.2 — Global data files
**File:** `_data/site.js`
```js
module.exports = {
  title: "Kerygma Codex",
  description: "A gentle grammar for spiritual healing and coherence repair.",
  baseUrl: "https://mbaldwinsmith.github.io/kerygma_codex",
  author: "Kerygma Codex Contributors",
  license: "CC BY-SA 4.0",
  githubUrl: "https://github.com/mbaldwinsmith/kerygma_codex",
};
```

**File:** `_data/navigation.js`
```js
module.exports = [
  { label: "Practices",     url: "/practices/" },
  { label: "Foundation",    url: "/foundation/" },
  { label: "Case Studies",  url: "/case-studies/" },
  { label: "Rule of Life",  url: "/rule-of-life/" },
  { label: "About",         url: "/about/" },
];
```

> **User task:** Confirm the GitHub username. Based on git config the username appears to be `mbaldwinsmith` — verify this matches your GitHub account so the `baseUrl` and `githubUrl` resolve correctly. Update both when you acquire a custom domain.

**Status:** [ ] Not started

---

## Phase 4: Design Tokens & CSS Foundation

### 4.1 — Design tokens
**File:** `src/assets/css/tokens.css`

```css
:root {
  /* Palette */
  --color-cream:       #FAF7F2;
  --color-charcoal:    #1C1F2A;
  --color-gold:        #C28840;
  --color-gold-light:  #E8C98A;
  --color-sage:        #7A9E9F;
  --color-rose:        #C4A99A;
  --color-mid:         #6B7180;
  --color-border:      #E5DED3;
  --color-surface:     #F4EFE8;

  /* Typography */
  --font-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --font-body:    'Inter', system-ui, -apple-system, sans-serif;

  /* Type scale */
  --size-xs:   0.75rem;
  --size-sm:   0.875rem;
  --size-base: 1rem;
  --size-lg:   1.125rem;
  --size-xl:   1.375rem;
  --size-2xl:  1.75rem;
  --size-3xl:  2.25rem;
  --size-4xl:  3rem;
  --size-5xl:  clamp(2.5rem, 6vw, 4.5rem);

  /* Spacing */
  --space-1:  0.25rem;
  --space-2:  0.5rem;
  --space-3:  0.75rem;
  --space-4:  1rem;
  --space-6:  1.5rem;
  --space-8:  2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-24: 6rem;
  --space-32: 8rem;

  /* Layout */
  --max-reading: 68ch;
  --max-wide:    90rem;
  --max-content: 80rem;

  /* Radii */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;

  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(28, 31, 42, 0.08);
  --shadow-md: 0 4px 16px rgba(28, 31, 42, 0.10);
  --shadow-lg: 0 8px 32px rgba(28, 31, 42, 0.12);

  /* Transitions */
  --transition-fast:   150ms ease;
  --transition-base:   220ms ease;
  --transition-slow:   350ms ease;
}
```

**Status:** [ ] Not started

---

### 4.2 — Typography
**File:** `src/assets/css/typography.css`

Load via `@import url(...)` from Google Fonts:
- Cormorant Garamond: weights 300, 400, 500, 600 — both roman and italic
- Inter: weights 400, 500 — variable font preferred

Define:
- `body`: Inter 400/1rem/1.75, `var(--color-charcoal)`, background `var(--color-cream)`
- `h1`: Cormorant Garamond 400, `var(--size-5xl)`, line-height 1.1, letter-spacing −0.02em
- `h2`: Cormorant Garamond 400, `var(--size-3xl)`, line-height 1.2
- `h3`: Inter 500, `var(--size-lg)`, uppercase, letter-spacing 0.08em — section labels
- `h4`–`h6`: Cormorant Garamond 500/italic, `var(--size-xl)`
- `blockquote`: italic Cormorant Garamond, left border 3px `var(--color-gold)`, padding-left `var(--space-6)`, color `var(--color-mid)`
- `code`, `kbd`: monospace, background `var(--color-surface)`, border-radius `var(--radius-sm)`, padding 0.15em 0.4em
- `pre`: same background, border `1px solid var(--color-border)`, padding `var(--space-4)`, overflow-x auto
- `a`: color `var(--color-gold)`, underline on hover, no decoration at rest
- `strong`: Inter 500
- Mathematical Unicode (`↑ ↓ → ′ σ Φ`): inherits body font — no special treatment needed; verify rendering in Phase 11.4

**Status:** [ ] Not started

---

### 4.3 — Layout
**File:** `src/assets/css/layout.css`

```css
.container          { max-width: var(--max-reading); margin-inline: auto; padding-inline: var(--space-6); }
.container--wide    { max-width: var(--max-content); margin-inline: auto; padding-inline: var(--space-8); }
.page               { min-height: 100dvh; display: flex; flex-direction: column; }
.page-content       { flex: 1; }
.section            { padding-block: var(--space-24); }
.section--sm        { padding-block: var(--space-12); }
.grid-cards         { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: var(--space-6); }
.grid-two           { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8); }
.prose              { max-width: var(--max-reading); }
.prose > * + *      { margin-block-start: var(--space-4); }
```

Responsive breakpoints (mobile-first):
- `768px` — grid-two collapses to single column
- `1024px` — full layout with sidebar
- `1280px` — max-width caps kick in

**Status:** [ ] Not started

---

### 4.4 — Components
**File:** `src/assets/css/components.css`

Define the following components:

**`.card`**
- White/cream background, 1px border `var(--color-border)`, radius `var(--radius-md)`
- Padding `var(--space-6)`, box-shadow `var(--shadow-sm)`
- Hover: `box-shadow var(--shadow-md)`, `transform translateY(-2px)`, transition `var(--transition-base)`
- `.card__title`: h3 style, no uppercase
- `.card__excerpt`: `var(--color-mid)`, `var(--size-sm)`, margin-top `var(--space-2)`
- `.card__tag`: section badge (see `.tag` below)

**`.tag`**
- Inline-block, small padding, radius `var(--radius-sm)`
- `var(--size-xs)` Inter 500, uppercase, letter-spacing 0.1em
- Variants: `.tag--practices` (gold bg, charcoal text), `.tag--foundation` (sage bg), `.tag--case-studies` (rose bg), `.tag--rule-of-life` (charcoal bg, cream text)

**`.nav`**
- Sticky top-0, background `rgba(250, 247, 242, 0.92)`, backdrop-filter blur(12px)
- Flex row, space-between, `var(--space-4)` vertical padding, border-bottom `var(--color-border)`
- `.nav__wordmark`: Cormorant Garamond `var(--size-xl)`, no decoration
- `.nav__links`: flex row, gap `var(--space-6)`, list-style none
- `.nav__link`: `var(--color-charcoal)`, no decoration, `var(--size-sm)` Inter 500, uppercase letter-spacing 0.06em
- `.nav__link:hover`, `.nav__link[aria-current]`: `var(--color-gold)`, transition `var(--transition-fast)`
- Mobile (<768px): hamburger toggle, nav links collapse to a drawer

**`.hero`**
- Min-height 70vh, display flex align-center
- Background: very subtle radial gradient from `var(--color-cream)` to `var(--color-surface)`
- Two-column layout (text left, illustration right) on ≥768px; stacked on mobile
- `.hero__title`: `var(--size-5xl)` Cormorant Garamond
- `.hero__tagline`: `var(--size-lg)` Inter, `var(--color-mid)`
- `.hero__cta`: flex row, gap `var(--space-4)`

**`.btn`**
- `.btn--primary`: gold bg, charcoal text, `var(--radius-sm)`, padding `var(--space-3) var(--space-6)`
- `.btn--ghost`: transparent, gold border, gold text; hover inverts
- Hover: `filter brightness(0.92)`, transition `var(--transition-fast)`

**`.breadcrumb`**
- `var(--size-xs)` Inter, `var(--color-mid)`, flex row, gap `var(--space-2)`
- Separator: `/` in `var(--color-border)`

**`.layer-table`** (applied to markdown tables in practice pages)
- Matches the `| Layer | Healthy use | Misuse mode |` structure in source files
- Header row: charcoal bg, cream text, `var(--size-sm)` uppercase
- Alternating row bg: cream / surface
- `↑` cells: colour `var(--color-sage)`; `↓` cells: colour `var(--color-rose)`; `0` cells: `var(--color-mid)`
- On <640px: horizontal scroll wrapper

**`.search-bar`** (search input + results)
- Pill input, full-width within container, border `var(--color-border)`, focus ring `var(--color-gold)`
- `#search-results`: positioned list, shadow `var(--shadow-lg)`, max-height 400px, overflow-y auto
- Each result item: title bold, section tag, URL in small `var(--color-mid)` text

**`.footer`**
- Background `var(--color-charcoal)`, color `var(--color-cream)`
- Three-column grid on desktop, stacked on mobile
- Columns: Wordmark + tagline | Nav links | License info
- Bottom bar: smaller text, GitHub link, copyright
- Cross-divider SVG sits directly above `.footer`

**Status:** [ ] Not started

---

### 4.5 — Animations
**File:** `src/assets/css/animations.css`

All animations must be wrapped in a `prefers-reduced-motion` guard:
```css
@media (prefers-reduced-motion: no-preference) { /* all animations inside */ }
```

**Keyframes to define:**

`@keyframes fadeUp`
- `from`: `opacity: 0; transform: translateY(20px);`
- `to`: `opacity: 1; transform: translateY(0);`

`@keyframes fadeIn`
- `from`: `opacity: 0;`
- `to`: `opacity: 1;`

`@keyframes float`
- `0%, 100%`: `transform: translateY(0);`
- `50%`: `transform: translateY(-8px);`

`@keyframes shimmer`
- `0%`: background-position left
- `100%`: background-position right
- Used for a subtle gold shimmer on the hero title on first load

`@keyframes drawStroke`
- `from`: `stroke-dashoffset: 1000;`
- `to`: `stroke-dashoffset: 0;`
- Applied to decorative SVG paths via `.svg-draw path`

**Classes:**

`.reveal`
- Initial state: `opacity: 0; transform: translateY(20px);`
- Added class `.reveal--visible` (toggled by IntersectionObserver in `ui.js`): applies `fadeUp` 500ms `ease-out` forwards

`.float`
- Applied to hero illustrations: `animation: float 5s ease-in-out infinite;`

`.hero__title`
- Page-load: `animation: fadeIn 800ms ease-out both 200ms;`

`.hero__tagline`
- Page-load: `animation: fadeIn 800ms ease-out both 400ms;`

`.hero__cta`
- Page-load: `animation: fadeIn 800ms ease-out both 600ms;`

`.card` hover transitions
- Defined in `components.css` — `transition: box-shadow var(--transition-base), transform var(--transition-base);`

**Status:** [ ] Not started

---

### 4.6 — main.css
**File:** `src/assets/css/main.css`

```css
@import './tokens.css';
@import './typography.css';
@import './layout.css';
@import './components.css';
@import './animations.css';
```

No styles of its own. Import order matters: tokens must load first.

**Status:** [ ] Not started

---

## Phase 5: Base Layout & Partials

### 5.1 — Base layout
**File:** `_includes/layouts/base.njk`

Full HTML5 shell. Include:
- `<!DOCTYPE html>`, `<html lang="en">`
- `<meta charset="utf-8">`, `<meta name="viewport" content="width=device-width, initial-scale=1">`
- `<title>{{ title }} — {{ site.title }}</title>` (fallback: `{{ site.title }}`)
- `<meta name="description" content="{{ description or site.description }}">`
- Open Graph tags: `og:title`, `og:description`, `og:type` (website), `og:url`
- `<link rel="preconnect">` for Google Fonts
- `<link rel="stylesheet" href="/assets/css/main.css">`
- Body: `<div class="page">`, `{% include "partials/header.njk" %}`, `<main class="page-content" id="main">{{ content | safe }}</main>`, `{% include "partials/footer.njk" %}`
- Before `</body>`: `<script src="/assets/js/ui.js" defer></script>`, `<script src="/assets/js/search.js" defer></script>`
- Skip-to-main link for accessibility: `<a class="skip-link" href="#main">Skip to content</a>`

**Status:** [ ] Not started

---

### 5.2 — Header partial
**File:** `_includes/partials/header.njk`

Sticky header (CSS `position: sticky; top: 0;`, high z-index).

Structure:
```html
<header class="nav">
  <a class="nav__wordmark" href="/">Kerygma Codex</a>
  {% include "partials/nav.njk" %}
  {% include "partials/search-bar.njk" %}
</header>
```

**Status:** [ ] Not started

---

### 5.3 — Nav partial
**File:** `_includes/partials/nav.njk`

Iterate `navigation` global data. Mark active item by comparing `page.url` against each nav item's `url` — use `aria-current="page"` on the active link.

Include a hamburger `<button>` (hidden on desktop, visible on mobile) that toggles a `.nav__drawer--open` class via `ui.js`.

**Status:** [ ] Not started

---

### 5.4 — Footer partial
**File:** `_includes/partials/footer.njk`

```
[cross-divider.svg — full width, cream fill on charcoal]
<footer class="footer">
  <div class="container--wide">
    <div class="footer__grid">
      Column 1: Wordmark, tagline ("A gentle grammar for spiritual healing")
      Column 2: Nav links (same as header)
      Column 3: "CC BY-SA 4.0 · Ethical Use Addendum applies" + link
    </div>
    <div class="footer__bar">
      "Kerygma Codex Contributors · [GitHub ↗]"
    </div>
  </div>
</footer>
```

**Status:** [ ] Not started

---

### 5.5 — Search bar partial
**File:** `_includes/partials/search-bar.njk`

```html
<div class="search-bar">
  <input type="search" id="search-input" placeholder="Search practices, terms…" aria-label="Search Codex">
  <div id="search-results" role="listbox" aria-live="polite" hidden></div>
</div>
```

`search.js` handles all binding and rendering.

**Status:** [ ] Not started

---

## Phase 6: Page-Specific Layouts

### 6.1 — Practice layout
**File:** `_includes/layouts/practice.njk`

Extends `base.njk` via `{% extends "layouts/base.njk" %}`.

Structure:
1. `.breadcrumb`: Home / Practices / [title]
2. `.practice-header`: section tag badge, title in display font, `sections/practices.svg` illustration alongside on wide screens
3. `.prose.container`: `{{ content | safe }}` — full rendered markdown
4. Aside (≥1024px only): auto-generated table of contents built from `## ` headings via a Nunjucks macro or Eleventy filter
5. `.layer-table` class automatically applied to any `<table>` within `.practice-header + .prose` via CSS `:has()` or a JS pass in `ui.js`
6. Bottom nav: Previous / Next practice links (alphabetical by title, from `collections.practices`)

**Status:** [ ] Not started

---

### 6.2 — Foundation layout
**File:** `_includes/layouts/foundation.njk`

Like practice layout but:
- No sidebar TOC (foundation docs are denser and shorter)
- Breadcrumb: Home / Foundation / [title]
- Section illustration: `sections/foundation.svg`
- Bottom nav: Previous / Next in `collections.foundations` (numeric 00→06 order)
- Wider reading column — these are reference docs, not long-form prose

**Status:** [ ] Not started

---

### 6.3 — Case study layout
**File:** `_includes/layouts/case-study.njk`

- Breadcrumb: Home / Case Studies / [title]
- Section illustration: `sections/case-studies.svg`
- Narrower reading column than practices — these read as narrative
- First blockquote in the file pulled into a styled `.pastoral-callout` aside (above the main content)
- No bottom prev/next nav — case studies are stand-alone

**Status:** [ ] Not started

---

### 6.4 — Rule of Life layout
**File:** `_includes/layouts/rule-of-life.njk`

- Breadcrumb: Home / Rule of Life / [title]
- Section illustration: `sections/rule-of-life.svg`
- `@media print` styles: remove nav, footer, sidebar; expand to full width; clean serif type only; suitable for printing and personal use

**Status:** [ ] Not started

---

### 6.5 — Listing layout
**File:** `_includes/layouts/listing.njk`

Extends `base.njk`. Used for all index pages.

Structure:
1. Hero section: section illustration, section title, short description
2. `.grid-cards` of all items in the relevant collection
3. Each card: `.card__tag`, `.card__title`, `.card__excerpt` (first 160 chars of content, stripped of markdown syntax)
4. Cards link to individual content pages

For the Practices listing only: add alphabetical letter headings (`A`, `B`, `C`…) and a small alphabetical jump-nav at the top.

**Status:** [ ] Not started

---

## Phase 7: Static Pages

### 7.1 — Home page
**File:** `src/pages/index.njk`

Sections (top to bottom):
1. **Hero**: "Kerygma Codex" display title, tagline drawn from `README.md` ("A gentle grammar for spiritual healing and coherence repair"), home-hero.svg illustration, two CTA buttons — "Begin with a practice" (`/practices/`) and "Read the Introduction" (`/foundation/`)
2. **Welcome**: Short paragraph (~80 words), drawn from `README.md` Welcome section — warm, consent-based, honouring AGENTS.md tone rules (analogical not mechanistic, no hype, genuinely pastoral)
3. **Three entry points**: Large cards for Practices, Case Studies, Rule of Life — with section illustrations, item counts, and short descriptions
4. **Covenant of Posture**: Styled blockquote block, drawn verbatim from the README covenant list — not paraphrased
5. **Foundation Documents**: Compact grid of the 00–06 docs with titles and one-line descriptions

> **User task:** Claude will draft home page body copy from `README.md` and `content/INTRODUCTION.md`, honouring AGENTS.md tone rules. Please review the draft before the Phase 7 PR is merged — especially the Welcome paragraph and three-entry-point descriptions. Approve, adjust, or rewrite as needed.

**Status:** [ ] Not started

---

### 7.2 — Practices index
**File:** `src/pages/practices/index.njk`

- Uses `listing` layout
- Iterates `collections.practices` sorted alphabetically by `data.title`
- Alphabetical letter group headers (A, B, C…) with anchor links
- Count badge: "N practices" total
- Illustration: `sections/practices.svg`

**Status:** [ ] Not started

---

### 7.3 — Foundation index
**File:** `src/pages/foundation/index.njk`

- Uses `listing` layout
- Iterates `collections.foundations` in numeric order (00→06 + INTRODUCTION + MANIFESTO)
- Brief one-sentence description for each doc (either from frontmatter `description` field added in a future pass, or hard-coded in the template for these ~8 items)
- Illustration: `sections/foundation.svg`

**Status:** [ ] Not started

---

### 7.4 — Case studies index
**File:** `src/pages/case-studies/index.njk`

- Uses `listing` layout
- Iterates `collections.caseStudies` sorted alphabetically by `data.title`
- Illustration: `sections/case-studies.svg`

> **Note:** Case study titles come from the first `# ` heading in each file. Spot-check during Phase 2.2 that these headings are expressive and human-readable (e.g. "The Ashamed Addict") rather than filename-style.

**Status:** [ ] Not started

---

### 7.5 — Rule of Life index
**File:** `src/pages/rule-of-life/index.njk`

- Uses `listing` layout
- Two entries: Monthly Attractor Discernment + The Coherent Gardener
- Direct links with short descriptions (hard-code descriptions in template — only two items)
- Illustration: `sections/rule-of-life.svg`

**Status:** [ ] Not started

---

### 7.6 — About
**File:** `src/pages/about/index.njk`

Uses `base` layout. Sections:
- What the Codex is (drawn from README — brief, no duplication of home page)
- License: CC BY-SA 4.0 with plain-English summary
- Ethical Use Addendum: key principle excerpts + link to full `ETHICAL_USE_ADDENDUM.md` on GitHub
- How to Contribute: link to `CONTRIBUTING.md` on GitHub
- GitHub repository link

**Status:** [ ] Not started

---

## Phase 8: Illustrations & IMAGEPROMPTS.md

### 8.1 — Placeholder SVGs
**Files:** all 8 illustration slots listed in the directory structure

For each slot, create a minimal SVG placeholder:
- ViewBox `0 0 800 500` (hero), `0 0 600 400` (sections), `0 0 400 100` (decorative)
- Background rect: `fill="#FAF7F2"`
- Centred gold cross motif (two overlapping rects): `fill="#C28840"`, 10% opacity
- Text label: filename in small `var(--color-mid)` — so you know which placeholder is which while building

**Status:** [ ] Not started

---

### 8.2 — Write IMAGEPROMPTS.md
**File:** `IMAGEPROMPTS.md`

For each of the 8 illustration slots, provide:
1. Target filename and intended dimensions
2. Role on the site (where it appears, what mood it should carry)
3. A detailed ChatGPT/DALL-E image generation prompt in the Codex's visual register

**Visual register for all prompts:**
- Style: Abstract, contemplative, illustrative — not photographic, not figurative
- Motifs: Byzantine geometry, golden-ratio spirals, mandorla / vesica piscis, concentric circles, cross forms, radiant light without a source
- Palette: warm cream, deep charcoal, warm gold and amber, muted sage, dusty rose — no harsh primaries
- Mood: Still, healing, inviting — never austere or cold
- No human figures, no text, no letterforms
- SVG or high-resolution PNG output (1600px minimum width)

> **User task:** Once `IMAGEPROMPTS.md` is written, generate each image using ChatGPT (DALL-E) or another tool of your choice. Save the output to the corresponding `illustrations/` subdirectory, replacing the placeholder SVG. Name files exactly as specified. SVG is preferred; PNG is acceptable.

**Status:** [ ] Not started

---

## Phase 9: Search

### 9.1 — Search index file
**File:** `src/search-index.njk`

A dedicated Eleventy page that outputs `/search-index.json` at build time (set `permalink: /search-index.json` in frontmatter, `templateEngineOverride: njk`).

The template iterates all four collections and emits a JSON array:
```json
[
  { "title": "...", "section": "...", "url": "...", "body": "..." },
  ...
]
```

`body` is the content stripped of markdown syntax (first 400 chars). The `lunr` index is built client-side from this file at runtime (simpler than a pre-built index for this content volume).

**Status:** [ ] Not started

---

### 9.2 — Search UI script
**File:** `src/assets/js/search.js`

- On `DOMContentLoaded`: fetch `/search-index.json`, build a `lunr` index, store in module scope
- On `#search-input` `input` event (debounced 200ms): query index, render top 8 results into `#search-results`
- Each result: `<a>` wrapping title + section tag + URL
- Close results: on `Escape`, on click outside `#search-results`, on result click
- Load `lunr` from CDN (add to `base.njk` before `search.js`)

> **Note:** lunr.js CDN link goes in `base.njk`. Do not bundle — keeps build simple.

**Status:** [ ] Not started

---

## Phase 10: GitHub Actions

### 10.1 — Deployment workflow
**File:** `.github/workflows/deploy.yml`

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - run: npm run build

      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./_site
```

`workflow_dispatch` allows manual re-runs from the GitHub Actions UI.

> **User task:** After pushing this workflow for the first time, go to your GitHub repo → **Settings** → **Pages** → **Source**, and set it to `Deploy from a branch` → `gh-pages` → `/ (root)`. The workflow creates the `gh-pages` branch on first run. Your site will then be live at `https://mbaldwinsmith.github.io/kerygma_codex`.

**Status:** [ ] Not started

---

## Phase 11: Polish & QA

### 11.1 — Verify CSS animations
Walk through every page type in the browser. Verify:
- `.reveal` fade-up fires correctly on scroll (IntersectionObserver threshold 0.15)
- Hero float animation on illustration does not cause layout shift
- Card hover lift feels smooth (200ms, no jank on mobile)
- `prefers-reduced-motion` disables all animations — test in browser devtools (Rendering → Emulate CSS prefers-reduced-motion)

**Status:** [ ] Not started

---

### 11.2 — Mobile responsiveness
Test at 375px, 768px, 1024px, 1280px, 1440px.

- Nav collapses to a hamburger below 768px — drawer opens/closes cleanly
- Cards reflow to single column on mobile
- Display headings scale correctly via `clamp()`
- Layer effects tables scroll horizontally on small screens (CSS `overflow-x: auto` wrapper)
- Hero illustration hides or shrinks gracefully on mobile — text remains readable

**Status:** [ ] Not started

---

### 11.3 — Cross-reference link rewriting
The markdown files contain relative links like `../03_GLOSSARY.md`, `07_fundamental_practices/prayer.md`, etc. The `generate-frontmatter.js` script needs a second pass to rewrite these to their correct site URLs.

Mapping rules:
- `content/0N_FILENAME.md` → `/foundation/slugified-title/`
- `content/07_fundamental_practices/TERM.md` → `/practices/TERM/`
- `content/case_studies/TERM.md` → `/case-studies/TERM/`
- `content/Rule_of_Life/TERM.md` → `/rule-of-life/TERM/`

Implement as a regex replacement pass after frontmatter injection in `generate-frontmatter.js`. Handle both `[text](../path.md)` and `[text](path.md)` patterns.

**Status:** [ ] Not started

---

### 11.4 — Mathematical notation check

> **User task:** Once the site is running locally (`npm start`), open a practice page — e.g. `/practices/adoption/` — and visually inspect that mathematical and symbolic characters render correctly: `↑`, `↓`, `→`, `H′`, `{Hᵢ}`, `σ`, `Φ`, `ΔG`, `ΔL`, `ΔP`. If any glyphs are missing or rendering oddly in Cormorant Garamond, report back and a targeted `font-family` fallback can be added to a `.layer-table` or `.prose-math` class.

**Status:** [ ] Awaiting user

---

### 11.5 — Accessibility pass
- All `<img>` and inline SVG have `alt` or `<title>` + `role="img"` + `aria-label`
- Colour contrast: cream on charcoal (`#1C1F2A` on `#FAF7F2`) — passes WCAG AA at all sizes
- Gold on cream (`#C28840` on `#FAF7F2`) — check at `var(--size-sm)` (may need slight darkening to pass AA)
- All interactive elements have visible focus rings (`:focus-visible` outline in gold)
- Heading hierarchy is correct on every page type — no skipped levels
- Skip-to-main link in `base.njk` works correctly

**Status:** [ ] Not started

---

## Decisions Log

| # | Decision | Who | Status |
|---|---|---|---|
| 1 | Confirm which `content/` files to exclude from the site | User | Exclude TASKS.md |
| 2 | Confirm GitHub username is `mbaldwinsmith` for `baseUrl` | User | Yes |
| 3 | Review and approve home page copy draft (Phase 7.1) | User | Awaiting Phase 7 |
| 4 | Generate illustrations from IMAGEPROMPTS.md prompts | User | Awaiting Phase 8 |
| 5 | Enable GitHub Pages in repo settings after first workflow push | User | Awaiting Phase 10 |
| 6 | Verify mathematical notation rendering (Phase 11.4) | User | Awaiting Phase 11 |
| 7 | Acquire and configure custom domain (planned next month) | User | Future |
