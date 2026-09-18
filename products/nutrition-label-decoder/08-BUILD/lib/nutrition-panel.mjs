import { percentDV, dvBand, REFERENCE_CALORIES } from './daily-values.mjs';

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Format a declared amount + unit, e.g. 2.5 -> "2.5g". Blank when absent. */
const amt = (v, unit) => (v == null ? '' : `${v}${unit}`);

/** One %DV cell. `highlight` draws the teaching band used by the workbooks. */
function dvCell(key, value, { highlight = false } = {}) {
  const pct = percentDV(key, value);
  if (pct == null) return '<td class="nf-dv"></td>';
  const band = highlight ? ` nf-band-${dvBand(pct)}` : '';
  return `<td class="nf-dv${band}"><b>${pct}%</b></td>`;
}

/**
 * Render an FDA-style vertical Nutrition Facts panel.
 *
 * All %DV figures are COMPUTED from the declared amounts — never hand-entered — so a
 * typo in the book can't produce a label that teaches wrong arithmetic.
 *
 * @param {object} d  panel data (see AUTHORING.md for the schema)
 * @param {object} opts
 * @param {boolean} opts.highlight  tint %DV cells by the 5/20 band (teaching mode)
 * @param {boolean} opts.blank      render an empty panel for fill-in-the-blank activities
 */
export function renderNutritionPanel(d = {}, opts = {}) {
  const { highlight = false, blank = false } = opts;
  const b = (v) => (blank ? '' : v);

  const rows = [];
  const push = (html) => rows.push(html);

  // --- Macronutrient block -------------------------------------------------
  push(`<tr class="nf-row nf-major">
    <th scope="row"><b>Total Fat</b> ${b(amt(d.totalFat, 'g'))}</th>
    ${blank ? '<td class="nf-dv"></td>' : dvCell('totalFat', d.totalFat, { highlight })}
  </tr>`);
  push(`<tr class="nf-row nf-indent">
    <th scope="row">Saturated Fat ${b(amt(d.saturatedFat, 'g'))}</th>
    ${blank ? '<td class="nf-dv"></td>' : dvCell('saturatedFat', d.saturatedFat, { highlight })}
  </tr>`);
  push(`<tr class="nf-row nf-indent">
    <th scope="row"><i>Trans</i> Fat ${b(amt(d.transFat, 'g'))}</th>
    <td class="nf-dv"></td>
  </tr>`);
  push(`<tr class="nf-row nf-major">
    <th scope="row"><b>Cholesterol</b> ${b(amt(d.cholesterol, 'mg'))}</th>
    ${blank ? '<td class="nf-dv"></td>' : dvCell('cholesterol', d.cholesterol, { highlight })}
  </tr>`);
  push(`<tr class="nf-row nf-major">
    <th scope="row"><b>Sodium</b> ${b(amt(d.sodium, 'mg'))}</th>
    ${blank ? '<td class="nf-dv"></td>' : dvCell('sodium', d.sodium, { highlight })}
  </tr>`);
  push(`<tr class="nf-row nf-major">
    <th scope="row"><b>Total Carbohydrate</b> ${b(amt(d.totalCarb, 'g'))}</th>
    ${blank ? '<td class="nf-dv"></td>' : dvCell('totalCarb', d.totalCarb, { highlight })}
  </tr>`);
  push(`<tr class="nf-row nf-indent">
    <th scope="row">Dietary Fiber ${b(amt(d.fiber, 'g'))}</th>
    ${blank ? '<td class="nf-dv"></td>' : dvCell('fiber', d.fiber, { highlight })}
  </tr>`);
  push(`<tr class="nf-row nf-indent">
    <th scope="row">Total Sugars ${b(amt(d.totalSugars, 'g'))}</th>
    <td class="nf-dv"></td>
  </tr>`);
  push(`<tr class="nf-row nf-indent2">
    <th scope="row">Includes ${b(amt(d.addedSugars, 'g'))} Added Sugars</th>
    ${blank ? '<td class="nf-dv"></td>' : dvCell('addedSugars', d.addedSugars, { highlight })}
  </tr>`);
  push(`<tr class="nf-row nf-major">
    <th scope="row"><b>Protein</b> ${b(amt(d.protein, 'g'))}</th>
    <td class="nf-dv"></td>
  </tr>`);

  // --- Micronutrient block -------------------------------------------------
  const micros = [
    ['vitaminD', 'Vitamin D', 'mcg'],
    ['calcium', 'Calcium', 'mg'],
    ['iron', 'Iron', 'mg'],
    ['potassium', 'Potassium', 'mg'],
  ];
  const microRows = micros.map(([key, label, unit]) => `<tr class="nf-row nf-micro">
      <th scope="row">${label} ${b(amt(d[key], unit))}</th>
      ${blank ? '<td class="nf-dv"></td>' : dvCell(key, d[key], { highlight })}
    </tr>`).join('');

  const servings = blank ? '' : esc(d.servingsPerContainer ?? '');
  const servingSize = blank ? '' : esc(d.servingSize ?? '');
  const calories = blank ? '' : (d.calories ?? '');

  return `<figure class="nf-figure"${d.id ? ` id="${esc(d.id)}"` : ''}>
  <table class="nf-panel${blank ? ' nf-blank' : ''}" role="table"
         aria-label="${esc(d.label || 'Nutrition Facts panel')}">
    <caption class="nf-caption">
      <span class="nf-title">Nutrition Facts</span>
      <span class="nf-servings">${servings} servings per container</span>
      <span class="nf-serving-size"><b>Serving size</b><b class="nf-ss-val">${servingSize}</b></span>
    </caption>
    <tbody>
      <tr class="nf-rule-thick"><td colspan="2"></td></tr>
      <tr class="nf-calorie-row">
        <th scope="row"><span class="nf-apc">Amount per serving</span><span class="nf-cal-label">Calories</span></th>
        <td class="nf-cal-val">${calories}</td>
      </tr>
      <tr class="nf-rule-med"><td colspan="2"></td></tr>
      <tr class="nf-dv-header"><td colspan="2">% Daily Value*</td></tr>
      ${rows.join('\n      ')}
      <tr class="nf-rule-thick"><td colspan="2"></td></tr>
      ${microRows}
      <tr class="nf-rule-med"><td colspan="2"></td></tr>
    </tbody>
  </table>
  <p class="nf-footnote">* The % Daily Value (DV) tells you how much a nutrient in a
    serving of food contributes to a daily diet. ${REFERENCE_CALORIES} calories a day is
    used for general nutrition advice.</p>
  ${d.ingredients ? `<p class="nf-ingredients"><b>INGREDIENTS:</b> ${esc(d.ingredients)}</p>` : ''}
  ${d.caption ? `<figcaption class="nf-fig-caption">${esc(d.caption)}</figcaption>` : ''}
</figure>`;
}
