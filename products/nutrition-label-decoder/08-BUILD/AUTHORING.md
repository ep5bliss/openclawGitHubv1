# AUTHORING GUIDE — how to write content for this product

All book content is **Markdown with front matter**, placed in `08-BUILD/content/`.
The build renders it to print-ready PDF at US Letter and A4.

```
cd 08-BUILD
npm install          # once
npm run build        # every book, both trim sizes
node render.mjs --only=parent-guide --html-only   # fast loop while writing
```

Output lands in `08-BUILD/out/`.

---

## 1. Front matter (required)

```yaml
---
title: "The Parent Field Guide"
subtitle: "Read any label in ten seconds — and teach your kid to do it too"
eyebrow: "THE 10-SECOND READ"
ages: "For parents"          # rendered as a pill on the cover
byline: "..."
audience: parent             # parent | kid | kid-young  -> changes type + leading
lang: en                     # en | es
toc: true                    # set false to suppress the contents page
---
```

`audience` matters: `kid-young` (ages 6–9) bumps body type to 14pt with looser leading,
`kid` (10–13) to 12.5pt. Don't fight this with inline styles.

## 2. Headings

- `#` starts a new chapter — it **forces a page break**. Use deliberately.
- `##` is a section. `###` is a small uppercase label.
- `#` and `##` are auto-collected into the table of contents.

## 3. Teaching components

Write them as fenced containers. The title after the name is optional; omit it to use the
default label.

```
::: key-idea The 10-Second Read
The one thing to remember from this chapter.
:::
```

| Component | Use it for |
|-----------|-----------|
| `key-idea` | The single takeaway. Max one per chapter — scarcity is what makes it land. |
| `try-it` | A small in-book exercise with a writing line. |
| `myth` | Myth vs. fact. Lead with the myth as a quote, resolve it inside. |
| `parent-note` | Parent-facing aside inside a kids' book, or extra depth in the parent guide. |
| `activity` | A full activity with instructions. |
| `aisle` | A do-this-at-the-store mission. The signature component — use it often. |
| `heads-up` | A caution, usually about framing or a common trap. |
| `answer` | Answer-key content. |
| `kid-voice` | Dialogue in the guide character's voice. No box drawn. |
| `callout` | A centered pull-quote. |
| `page-break` | Force a page break. |
| `keep` | Wrap a block so it never splits across pages. |

## 4. Nutrition Facts panels

Fence with `nutrition-label` and give it JSON. **%DV is computed for you** from
`lib/daily-values.mjs` — never type a percentage by hand, and never override one.

````
```nutrition-label highlight
{
  "servingsPerContainer": "about 8",
  "servingSize": "2/3 cup (55g)",
  "calories": 230,
  "totalFat": 8, "saturatedFat": 1, "transFat": 0,
  "cholesterol": 0, "sodium": 160,
  "totalCarb": 37, "fiber": 4, "totalSugars": 12, "addedSugars": 10,
  "protein": 3,
  "vitaminD": 2, "calcium": 260, "iron": 8, "potassium": 235,
  "ingredients": "Whole grain oats, sugar, salt.",
  "caption": "Representative example. Not a specific product."
}
```
````

Flags after the fence name:
- `highlight` — tints the %DV cells by the FDA 5/20 band (low / moderate / high).
  Use in teaching passages, not in "read this like it's real life" passages.
- `blank` — renders an empty panel for fill-in-the-blank activities. Pass `{}`.

**Rules for panel data**
- Never use a real brand name. Use generic categories and always set `caption` to
  mark it as representative.
- Keep numbers realistic. A reader who recognizes the category will notice if they aren't.
- Units are implied per field: fat/carb/fiber/sugars/protein in **g**, sodium/
  cholesterol/calcium/iron/potassium in **mg**, vitamin D in **mcg**.

## 5. Inline shortcodes

| Shortcode | Renders |
|-----------|---------|
| `{{tsp:12}}` | `3 teaspoons` — grams of sugar converted, using the teaching 4g/tsp figure |
| `{{blank}}` | A full-width writing line |
| `{{blank:short}}` | A short writing line |

## 6. Hard content rules

1. **Every number traces to `01-FACTS/nutrition-fact-base.md`.** If it isn't in there,
   don't state it. If you need a number that isn't there, flag it — don't invent it.
2. **No good food / bad food.** No "junk," "clean," "cheat," "guilty," "toxic."
   Check `02-BRAND/brand-system.md` for the banned-words list and approved replacements.
3. **No medical advice.** Educational framing only.
4. **No real brand names** in examples.
5. Write so a page survives being printed in grayscale. Never rely on color alone
   to carry meaning.
