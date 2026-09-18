import MarkdownIt from 'markdown-it';
import container from 'markdown-it-container';
import attrs from 'markdown-it-attrs';
import { renderNutritionPanel } from './nutrition-panel.mjs';
import { sugarToTeaspoons } from './daily-values.mjs';

/**
 * Teaching components available to authors as `::: name Optional Title` blocks.
 * Each maps to a styled, print-safe box defined in styles/book.css.
 */
const BLOCKS = {
  'try-it':      { label: 'Try It',            icon: '&#9998;' },
  'myth':        { label: 'Myth vs. Fact',     icon: '&#9888;' },
  'parent-note': { label: 'Parent Note',       icon: '&#9733;' },
  'key-idea':    { label: 'Key Idea',          icon: '&#9679;' },
  'activity':    { label: 'Activity',          icon: '&#9654;' },
  'aisle':       { label: 'In the Aisle',      icon: '&#128722;' },
  'heads-up':    { label: 'Heads Up',          icon: '&#9873;' },
  'answer':      { label: 'Answer Key',        icon: '&#10003;' },
  'kid-voice':   { label: '',                  icon: '' },
  'callout':     { label: '',                  icon: '' },
};

export function createMarkdown() {
  const md = new MarkdownIt({ html: true, typographer: true, linkify: false });
  md.use(attrs);

  for (const [name, meta] of Object.entries(BLOCKS)) {
    md.use(container, name, {
      validate: (params) => params.trim().startsWith(name),
      render(tokens, idx) {
        if (tokens[idx].nesting === 1) {
          const raw = tokens[idx].info.trim().slice(name.length).trim();
          const title = raw || meta.label;
          const head = title
            ? `<p class="box-title">${meta.icon ? `<span class="box-icon" aria-hidden="true">${meta.icon}</span>` : ''}${md.utils.escapeHtml(title)}</p>`
            : '';
          return `<aside class="box box-${name}">${head}\n`;
        }
        return '</aside>\n';
      },
    });
  }

  // Page control: `::: page-break` and `::: spread` (keep block on one page)
  md.use(container, 'page-break', {
    render: (t, i) => (t[i].nesting === 1 ? '<div class="page-break"></div>\n' : ''),
  });
  md.use(container, 'keep', {
    render: (t, i) => (t[i].nesting === 1 ? '<div class="keep-together">\n' : '</div>\n'),
  });

  // Fenced ```nutrition-label renders a live FDA panel from JSON.
  // ```nutrition-label blank        -> empty panel for fill-in activities
  // ```nutrition-label highlight    -> tint %DV cells by the 5/20 band
  const defaultFence = md.renderer.rules.fence.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];
    const info = (token.info || '').trim();
    if (!info.startsWith('nutrition-label')) return defaultFence(tokens, idx, options, env, self);
    const flags = info.split(/\s+/).slice(1);
    let data = {};
    try {
      data = token.content.trim() ? JSON.parse(token.content) : {};
    } catch (err) {
      return `<pre class="build-error">Nutrition label JSON is invalid: ${md.utils.escapeHtml(err.message)}</pre>`;
    }
    return renderNutritionPanel(data, {
      blank: flags.includes('blank'),
      highlight: flags.includes('highlight'),
    });
  };

  // Inline shortcodes authors can use in running text.
  //   {{tsp:12}}        -> "3 teaspoons"
  //   {{blank}}         -> a fill-in-the-blank writing line
  //   {{blank:short}}   -> a short writing line
  const SHORTCODES = [
    [/\{\{tsp:([\d.]+)\}\}/g, (_, g) => {
      const t = sugarToTeaspoons(parseFloat(g));
      return `<span class="tsp">${t} teaspoon${t === 1 ? '' : 's'}</span>`;
    }],
    [/\{\{blank:short\}\}/g, () => '<span class="write-line write-line-short"></span>'],
    [/\{\{blank\}\}/g, () => '<span class="write-line"></span>'],
  ];
  const defaultText = md.renderer.rules.text?.bind(md.renderer.rules)
    || ((t, i, o, e, s) => s.renderToken(t, i, o));
  md.renderer.rules.text = (tokens, idx, options, env, self) => {
    let out = md.utils.escapeHtml(tokens[idx].content);
    for (const [re, fn] of SHORTCODES) out = out.replace(re, fn);
    return out;
  };

  return md;
}
