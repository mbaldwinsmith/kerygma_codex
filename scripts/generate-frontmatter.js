import { glob } from 'glob';
import matter from 'gray-matter';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';

const EXCLUDE = new Set([
  'content/01_TERM_TEMPLATE.md',
  'content/TASKS.md',
  'content/ROADMAP.md',
  'content/SYSTEM_SPEC.md',
  'content/ESCHATOLOGICAL_COMPLETION.md',
  'content/07_fundamental_practices/_INDEX.md',
]);

// h1 headings that are too generic or verbose to use as page titles
const TITLE_OVERRIDES = {
  'content/00_CONSTITUTION.md':   'Project Constitution',
  'content/05_CORE_OPERATORS.md': 'Core Operators',
};

const FOUNDATION_SLUGS = {
  '00_CONSTITUTION':         'constitution',
  '02_FORMALISM':            'formalism',
  '03_GLOSSARY':             'glossary',
  '04_PASTORAL_GUARDRAILS':  'pastoral-guardrails',
  '05_CORE_OPERATORS':       'core-operators',
  '06_TESTS_AND_INVARIANTS': 'tests-and-invariants',
  'INTRODUCTION':            'introduction',
  'MANIFESTO':               'manifesto',
};

// Used for internal link rewriting
const LINK_MAP = {
  '00_CONSTITUTION.md':         '/foundation/constitution/',
  '02_FORMALISM.md':            '/foundation/formalism/',
  '03_GLOSSARY.md':             '/foundation/glossary/',
  '04_PASTORAL_GUARDRAILS.md':  '/foundation/pastoral-guardrails/',
  '05_CORE_OPERATORS.md':       '/foundation/core-operators/',
  '06_TESTS_AND_INVARIANTS.md': '/foundation/tests-and-invariants/',
  'INTRODUCTION.md':            '/foundation/introduction/',
  'MANIFESTO.md':               '/foundation/manifesto/',
};

function resolveSection(filePath) {
  if (filePath.includes('07_fundamental_practices')) return 'practices';
  if (filePath.includes('case_studies'))             return 'case-studies';
  if (filePath.includes('Rule_of_Life'))             return 'rule-of-life';
  return 'foundation';
}

const LAYOUT_MAP = {
  'practices':    'practice',
  'case-studies': 'case-study',
  'rule-of-life': 'rule-of-life',
  'foundation':   'foundation',
};

function resolvePermalink(filePath, section) {
  const name = basename(filePath, '.md');
  if (section === 'foundation') {
    const slug = FOUNDATION_SLUGS[name] ?? name.toLowerCase().replace(/_/g, '-');
    return `/foundation/${slug}/`;
  }
  const slug = name.replace(/_/g, '-').toLowerCase();
  return `/${section}/${slug}/`;
}

function parseTitle(content, filePath) {
  if (TITLE_OVERRIDES[filePath]) return TITLE_OVERRIDES[filePath];
  const match = content.match(/^#\s+(.+)$/m);
  if (match) return match[1].replace(/^﻿/, '').trim();
  return basename(filePath, '.md').replace(/_/g, ' ');
}

function rewriteLinks(content, section) {
  return content.replace(/\[([^\]]*)\]\(([^)]+\.md[^)]*)\)/g, (match, text, href) => {
    if (href.startsWith('http') || href.startsWith('/')) return match;

    const [hrefPath, anchor] = href.split('#');
    const name = basename(hrefPath);
    const suffix = anchor ? `#${anchor}` : '';

    if (LINK_MAP[name]) return `[${text}](${LINK_MAP[name]}${suffix})`;

    if (href.includes('07_fundamental_practices') || href.includes('fundamental_practices')) {
      const slug = basename(name, '.md').replace(/_/g, '-').toLowerCase();
      return `[${text}](/practices/${slug}/${suffix})`;
    }
    if (href.includes('case_studies')) {
      const slug = basename(name, '.md').replace(/_/g, '-').toLowerCase();
      return `[${text}](/case-studies/${slug}/${suffix})`;
    }
    if (href.includes('Rule_of_Life')) {
      const slug = basename(name, '.md').replace(/_/g, '-').toLowerCase();
      return `[${text}](/rule-of-life/${slug}/${suffix})`;
    }

    // Bare relative link (no path prefix) — infer destination from current file's section
    const stem = basename(name, '.md');
    if (section === 'practices') {
      return `[${text}](/practices/${stem.replace(/_/g, '-').toLowerCase()}/${suffix})`;
    }
    if (section === 'case-studies') {
      return `[${text}](/case-studies/${stem.replace(/_/g, '-').toLowerCase()}/${suffix})`;
    }
    if (section === 'rule-of-life') {
      return `[${text}](/rule-of-life/${stem.replace(/_/g, '-').toLowerCase()}/${suffix})`;
    }
    if (section === 'foundation') {
      const slug = FOUNDATION_SLUGS[stem] ?? stem.toLowerCase().replace(/_/g, '-');
      return `[${text}](/foundation/${slug}/${suffix})`;
    }

    return match;
  });
}

const files = await glob('content/**/*.md', { posix: true });
let processed = 0;
let skipped = 0;

for (const filePath of files) {
  if (EXCLUDE.has(filePath)) {
    skipped++;
    continue;
  }

  const raw = readFileSync(filePath, 'utf8').replace(/^﻿/, '');
  const { content } = matter(raw);

  const section   = resolveSection(filePath);
  const layout    = LAYOUT_MAP[section];
  const title     = parseTitle(content, filePath);
  const permalink = resolvePermalink(filePath, section);
  const rewritten = rewriteLinks(content, section);

  const output  = matter.stringify(rewritten, { title, section, layout, permalink });
  const outPath = join('generated', filePath);

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, output, 'utf8');

  processed++;
}

console.log(`✓ Frontmatter generated: ${processed} processed, ${skipped} skipped.`);
