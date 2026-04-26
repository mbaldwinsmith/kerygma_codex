import markdownIt from 'markdown-it';

export default function (eleventyConfig) {

  // --- Ignores -----------------------------------------------------------------
  // Disable gitignore: generated/ is gitignored (build artifact) but must be
  // processed by Eleventy. We manually re-add the other important gitignore entries.
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.ignores.add('node_modules/**');
  eleventyConfig.ignores.add('_site/**');
  eleventyConfig.ignores.add('.claude/**');
  eleventyConfig.ignores.add('.git/**');

  // Raw content source: we process generated/ instead
  eleventyConfig.ignores.add('content/**');
  eleventyConfig.ignores.add('scripts/**');
  eleventyConfig.ignores.add('.github/**');

  // Root prose/documentation markdown — not web pages
  for (const f of [
    'README.md', 'AGENTS.md', 'WEBSITETASKS.md', 'IMAGEPROMPTS.md',
    'CHANGELOG.md', 'CONTRIBUTING.md', 'ETHICAL_USE_ADDENDUM.md', 'LICENSE.md',
  ]) {
    eleventyConfig.ignores.add(f);
  }

  // --- Passthrough copy --------------------------------------------------------
  // src/assets/ → _site/assets/  (CSS, JS, images — copied verbatim)
  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy('Infographic.png');

  // --- Markdown-it config ------------------------------------------------------
  const mdLib = markdownIt({ html: true, linkify: true, typographer: true });
  eleventyConfig.setLibrary('md', mdLib);

  // --- Collections -------------------------------------------------------------
  eleventyConfig.addCollection('practices', (api) =>
    api
      .getFilteredByGlob('generated/content/07_fundamental_practices/*.md')
      .sort((a, b) => (a.data.title ?? '').localeCompare(b.data.title ?? ''))
  );

  eleventyConfig.addCollection('foundations', (api) =>
    api
      .getFilteredByGlob('generated/content/*.md')
      .sort((a, b) => a.inputPath.localeCompare(b.inputPath))
  );

  eleventyConfig.addCollection('caseStudies', (api) =>
    api
      .getFilteredByGlob('generated/content/case_studies/*.md')
      .sort((a, b) => (a.data.title ?? '').localeCompare(b.data.title ?? ''))
  );

  eleventyConfig.addCollection('ruleOfLife', (api) =>
    api.getFilteredByGlob('generated/content/Rule_of_Life/*.md')
  );

  // --- Filters -----------------------------------------------------------------
  eleventyConfig.addFilter('slugify', (str) =>
    (str ?? '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  );

  eleventyConfig.addFilter('excerpt', (content) => {
    const plain = (content ?? '')
      .replace(/<[^>]+>/g, ' ')                  // strip HTML tags (templateContent)
      .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'") // decode entities
      .replace(/^#{1,6}\s+.+$/gm, '')            // markdown headings
      .replace(/\*\*([^*]+)\*\*/g, '$1')         // bold
      .replace(/\*([^*]+)\*/g, '$1')             // italic
      .replace(/`[^`]+`/g, '')                   // inline code
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')  // links
      .replace(/^\s*[-*+|>]{1,2}\s*/gm, '')     // list items, blockquotes, table rows
      .replace(/\s+/g, ' ')
      .trim();
    return plain.slice(0, 160).trim();
  });

  eleventyConfig.addFilter('uniqueFirstLetters', (collection) =>
    [...new Set(
      (collection ?? [])
        .map(item => (item.data?.title ?? '')[0]?.toUpperCase())
        .filter(Boolean)
    )].sort()
  );

  eleventyConfig.addFilter('readableDate', (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
  });

  // --- Config ------------------------------------------------------------------
  return {
    // GitHub Pages serves repo sites at /<repo-name>/.
    // All internal URLs in templates must go through the `url` filter so this prefix is applied.
    // Update to '/' once a custom domain is configured.
    pathPrefix: '/kerygma_codex/',

    dir: {
      input:   '.',
      output:  '_site',
      includes: '_includes',
      layouts: '_includes/layouts',
      data:    '_data',
    },

    templateFormats:    ['njk', 'md'],
    markdownTemplateEngine: false, // content markdown is plain, not Nunjucks
    htmlTemplateEngine: 'njk',
  };
}
