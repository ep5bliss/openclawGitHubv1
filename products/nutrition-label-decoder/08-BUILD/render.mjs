#!/usr/bin/env node
/**
 * Nutrition Label Decoder — print pipeline.
 *
 * Markdown (+ front matter) -> HTML -> print-ready PDF via headless Chromium.
 *
 *   node render.mjs                     build every book in content/ at both trim sizes
 *   node render.mjs --trim=letter       US Letter only
 *   node render.mjs --trim=a4           A4 only
 *   node render.mjs --html-only         skip PDF (fast iteration while writing)
 *   node render.mjs --only=parent-guide build a single book by slug
 */
import { readFile, writeFile, readdir, mkdir, access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { createMarkdown } from './lib/markdown.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PRODUCT = path.resolve(HERE, '..');
const CONTENT = path.join(HERE, 'content');
const OUT = path.join(HERE, 'out');

const TRIMS = {
  letter: { format: 'Letter', label: 'US Letter (8.5 × 11 in)' },
  a4:     { format: 'A4',     label: 'A4 (210 × 297 mm)' },
};

const argv = process.argv.slice(2);
const arg = (name, fallback = null) => {
  const hit = argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};
const flag = (name) => argv.includes(`--${name}`);

/** Load the brand tokens if the brand system has landed; otherwise fall back. */
async function loadTokens() {
  const brandTokens = path.join(PRODUCT, '02-BRAND', 'tokens.css');
  if (existsSync(brandTokens)) return readFile(brandTokens, 'utf8');
  console.warn('  ! 02-BRAND/tokens.css not found — using fallback tokens.');
  return readFile(path.join(HERE, 'styles', 'tokens.fallback.css'), 'utf8');
}

/** Pull h1/h2 out of the rendered HTML and build a table of contents. */
function buildToc(html) {
  const entries = [];
  let n = 0;
  const withIds = html.replace(/<(h[12])>(.*?)<\/\1>/g, (full, tag, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    if (!text) return full;
    const id = `sec-${++n}`;
    entries.push({ id, text, level: Number(tag[1]) });
    return `<${tag} id="${id}" class="has-toc">${inner}</${tag}>`;
  });
  const list = entries.length
    ? `<nav class="toc"><h1 class="toc-title">Contents</h1><ol class="toc-list">${entries
        .map((e) => `<li class="toc-l${e.level}"><a href="#${e.id}">${e.text}</a></li>`)
        .join('')}</ol></nav><div class="page-break"></div>`
    : '';
  return { html: withIds, toc: list, count: entries.length };
}

function coverHtml(fm) {
  if (!fm.title) return '';
  return `<section class="cover">
  ${fm.eyebrow ? `<p class="cover-eyebrow">${fm.eyebrow}</p>` : ''}
  <h1 class="cover-title">${fm.title}</h1>
  ${fm.subtitle ? `<p class="cover-subtitle">${fm.subtitle}</p>` : ''}
  ${fm.ages ? `<p class="cover-ages">${fm.ages}</p>` : ''}
  ${fm.byline ? `<p class="cover-byline">${fm.byline}</p>` : ''}
</section><div class="page-break"></div>`;
}

function pageHtml({ fm, body, toc, tokens, bookCss, trimLabel }) {
  return `<!DOCTYPE html>
<html lang="${fm.lang || 'en'}" data-audience="${fm.audience || 'parent'}">
<head>
<meta charset="utf-8">
<title>${fm.title || 'Untitled'}</title>
<meta name="description" content="${(fm.subtitle || '').replace(/"/g, '&quot;')}">
<style>
/* ---- brand tokens ---- */
${tokens}
/* ---- book layout ---- */
${bookCss}
</style>
</head>
<body class="book audience-${fm.audience || 'parent'}" data-trim="${trimLabel}">
${coverHtml(fm)}
${toc}
<main class="book-body">
${body}
</main>
</body>
</html>`;
}

async function renderPdf(htmlPath, pdfPath, trimKey, fm) {
  const { chromium } = await import('playwright-core');
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium',
    args: ['--no-sandbox', '--font-render-hinting=none'],
  });
  try {
    const page = await browser.newPage();
    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    await page.pdf({
      path: pdfPath,
      format: TRIMS[trimKey].format,
      printBackground: true,
      preferCSSPageSize: false,
      margin: { top: '0.6in', bottom: '0.7in', left: '0.6in', right: '0.6in' },
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `<div style="width:100%;font-size:8pt;font-family:Arial,sans-serif;
        color:#6b6b6b;padding:0 0.6in;display:flex;justify-content:space-between;">
        <span>${(fm.title || '').replace(/</g, '')}</span>
        <span class="pageNumber"></span></div>`,
    });
  } finally {
    await browser.close();
  }
}

async function buildBook(file, trimKeys, htmlOnly) {
  const slug = path.basename(file, '.md');
  const raw = await readFile(path.join(CONTENT, file), 'utf8');
  const { data: fm, content } = matter(raw);
  const md = createMarkdown();
  const rendered = md.render(content);
  const { html: withIds, toc, count } = buildToc(rendered);

  const tokens = await loadTokens();
  const bookCss = await readFile(path.join(HERE, 'styles', 'book.css'), 'utf8');

  const results = [];
  for (const trimKey of trimKeys) {
    const doc = pageHtml({
      fm, body: withIds, toc: fm.toc === false ? '' : toc,
      tokens, bookCss, trimLabel: trimKey,
    });
    const htmlPath = path.join(OUT, `${slug}.${trimKey}.html`);
    await writeFile(htmlPath, doc, 'utf8');
    let pdfPath = null;
    if (!htmlOnly) {
      pdfPath = path.join(OUT, `${slug}.${trimKey}.pdf`);
      await renderPdf(htmlPath, pdfPath, trimKey, fm);
    }
    results.push({ trimKey, htmlPath, pdfPath });
  }
  return { slug, title: fm.title, sections: count, results };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  if (!existsSync(CONTENT)) {
    console.error(`No content directory at ${CONTENT}. Nothing to build.`);
    process.exit(1);
  }
  const only = arg('only');
  const files = (await readdir(CONTENT))
    .filter((f) => f.endsWith('.md'))
    .filter((f) => !only || path.basename(f, '.md') === only);

  if (!files.length) {
    console.error('No markdown files matched.');
    process.exit(1);
  }

  const trimArg = arg('trim');
  const trimKeys = trimArg ? [trimArg] : Object.keys(TRIMS);
  for (const t of trimKeys) {
    if (!TRIMS[t]) { console.error(`Unknown trim "${t}". Use: ${Object.keys(TRIMS).join(', ')}`); process.exit(1); }
  }
  const htmlOnly = flag('html-only');

  console.log(`Building ${files.length} book(s) × ${trimKeys.length} trim(s)${htmlOnly ? ' [HTML only]' : ''}\n`);
  for (const file of files) {
    const r = await buildBook(file, trimKeys, htmlOnly);
    console.log(`  ✓ ${r.title || r.slug}  (${r.sections} sections)`);
    for (const out of r.results) {
      console.log(`      ${out.trimKey.padEnd(6)} ${path.relative(PRODUCT, out.pdfPath || out.htmlPath)}`);
    }
  }
  console.log('\nDone.');
}

main().catch((err) => { console.error(err); process.exit(1); });
