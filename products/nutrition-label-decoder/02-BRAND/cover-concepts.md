# FLIP THE BOX — Cover Art Direction v1.0

Three directions for the **Parent Guide**, three for the **Kids Workbook**, a winner for each, and the thumbnail math that decided it.

---

## 0. The thumbnail constraint, in actual numbers

Covers in this business are bought at **200 px wide** — a Kindle carousel card, a Gumroad grid tile, a TikTok product sticker, an email thumbnail. Every decision below is made against that, not against a full-size PDF.

**Scale factor.** A US Letter cover (8.5 in / 612 pt wide) displayed at 200 px renders at:

```
200 px ÷ 8.5 in   = 23.53 px per inch
23.53 ÷ 72        = 0.327 px per point
```

**What that means for type:**

| Set size | Rendered at 200 px | Readable? |
|---|---|---|
| 96 pt | 31.4 px | Yes — reads across a room |
| 72 pt | 23.5 px | Yes |
| 60 pt | 19.6 px | Yes |
| 48 pt | 15.7 px | Yes, if bold |
| 36 pt | 11.8 px | **Threshold.** Bold sans only. |
| 24 pt | 7.8 px | **No.** Texture only. |
| 14 pt | 4.6 px | No. |

**The rule this produces, and it governs all six concepts:** a cover is allowed exactly **two** pieces of information that must survive the thumbnail — the **title** (≥ 60 pt) and one **promise line** (≥ 36 pt, bold sans). Everything else — subhead, age range, credential line, bullet stack — is set below the threshold on purpose and exists for the full-size view only. Designing a cover where the subhead "has to be read" is designing a cover that fails.

**The second rule:** at 200 px the eye resolves **luminance blocks before it resolves anything else.** A cover therefore needs one high-contrast structural move — a split, a pop-out, a giant letterform — that survives being blurred. Every concept below is tested by squinting at it at 200 px and asking *does a shape still happen?*

### Mechanical spec (all covers)

| Property | Value |
|---|---|
| Digital cover art | 2550 × 3300 px, 300 ppi, sRGB (8.5 × 11 in) |
| A4 variant | 2480 × 3508 px, 300 ppi, sRGB |
| Thumbnail exports | 200 × 259, 400 × 518, 800 × 1036 px |
| Social crops | 1080 × 1080, 1080 × 1350, 1080 × 1920 |
| Print bleed (POD edition only) | 0.125 in all sides |
| Cover safe area | 0.5 in from trim — nothing critical outside it |
| Spine (POD, 120 pp, 60# uncoated) | ≈ 0.27 in — **title only, no subhead, no art** |
| Home-print cover | No bleed. Art stops 0.25 in from trim per the inkjet rule. |
| Type | Fraunces (title), Lexend (promise line, metadata), per `brand-system.md` §4 |
| Palette | `brand-system.md` §3. `--c-paprika-bright #D4622A` is permitted here, fill only. |

---

## PART 1 — THE PARENT GUIDE

Target reader: a competent, tired adult who has been sold a diet book before and resents it. The cover's first job is to say *this is not that.* Warmth and authority. Zero urgency, zero alarm, zero before/after.

---

### **P-A — "The Word"**
*Type-led editorial. The trade-nonfiction move.*

- **Concept.** The cover is the word. No illustration above the fold. This borrows nothing from the kids' market and everything from serious trade nonfiction — which is exactly the shelf a parent wants to think they're buying from.
- **Focal image.** The wordmark itself: **FLIP** set at **190 pt** Fraunces 800 (`WONK 1`, `SOFT 50`), tracking −2.5%, filling the top two-thirds. **THE BOX** at 72 pt directly beneath, flush left to the same left edge. Below the type, a single small orthographic package rendered in four ghosted rotation states — a 12-frame flip reduced to four — across the bottom 15%, at 16% Ink. Nothing else.
- **Headline.** `FLIP THE BOX`
- **Subhead.** *The parent's guide to reading any food label — and raising a kid who isn't afraid of one.* (18 pt Lexend 400, below threshold, full-size only.)
- **Promise line.** `READ ANY LABEL IN 10 SECONDS` — 40 pt Lexend 700, +6% tracking, Paprika, in a Paper band.
- **Color treatment.** Blueberry `#23386B` field, Paper `#FBF7F0` type (10.63:1). Paprika promise band. Sunbutter used nowhere — the parent cover is the only asset in the system with no yellow, which is what makes it read adult.
- **Thumbnail at 200 px.** FLIP renders at 62 px tall. It is the single most legible cover in the category at that size. Squint test: a big pale rectangle of letterforms on dark blue — a shape definitely happens.
- **Why it stops a thumb.** It looks like a book with a publisher. In a feed of pastel Canva templates and stock photos of grocery carts, restraint is the loud option.
- **Risk.** Communicates zero about *what's inside.* Relies entirely on the promise band to do the selling. Also the most copyable cover of the three.

---

### **P-B — "Front / Back"**
*The thesis, rendered as a graphic.*

- **Concept.** The cover is split vertically down the middle. **Left = the front of the box:** a loud fictional package front, starbursts, a big claim, saturated. **Right = the back of the box:** a clean Nutrition Facts panel on white, silent, orderly. One cover, two worlds, and the reader gets the entire argument before reading a word.
- **Focal image.** Hard 50/50 vertical split at x = 306 pt.
  - *Left half:* a full-bleed fictional package front — Paprika-bright `#D4622A` ground, a Sunbutter starburst, the invented claim **"MADE WITH REAL FRUIT!"** set in Fraunces 800 at 44 pt, a fake "NEW!" flash, and a 4% grain. Deliberately over-designed — it is a small piece of satire that never names anyone.
  - *Right half:* Paper ground, and a true-proportion Nutrition Facts panel replica in Arimo, black on white, set at 72% of cover height, dead centered, with a 0.5 pt rule and enormous surrounding white space.
- **Headline.** `FLIP THE BOX` — 78 pt Fraunces 800, reversed out of a full-width Blueberry band across the lower third, spanning **both** halves and stitching the split together.
- **Subhead.** *The front of the box is an ad. The back of the box is the facts.* (20 pt Lexend 500, Paper, under the headline. Below threshold — and that's fine, because the picture already said it.)
- **Promise line.** `A 10-SECOND METHOD FOR ANY PACKAGE` — 36 pt Lexend 700 +6%, Sunbutter on Blueberry (6.28:1).
- **Color treatment.** Left half carries every warm saturated value in the palette at once; right half carries none. The chromatic imbalance *is* the content. The Blueberry band is the only thing both halves share.
- **Thumbnail at 200 px.** The strongest of the six. The eye resolves a hot orange block beside a white block with a dark bar across the bottom — three luminance zones, legible at any size, recognizable after a half-second scroll. Title renders at 25.5 px.
- **Why it stops a thumb.** The split reads as a **before/after of information, not of a body**, which is a genuinely novel thing to see in this category. A scrolling parent decodes it in under a second: *loud promise, quiet truth.* It also makes the product look like media literacy rather than nutrition advice — the positioning that keeps this brand out of trouble.
- **Risk.** The satirical left half must be scrupulously generic (§5, illustration bible) or it becomes a legal problem. And the two halves have to be designed by the same hand with equal care — a cheap-looking left half reads as an actual mistake rather than as satire.

---

### **P-C — "One Package, Two Hands"**
*The differentiator, made literal.*

- **Concept.** Top-down, plan view: an adult hand and a child's hand on the same package at the same moment. This is the only cover that sells the product's actual differentiator — both tracks, one kitchen table — as an image.
- **Focal image.** Hero illustration **S-501** cropped to portrait. Package centered, flat rectangle from above. Adult hand entering from the bottom edge (`--hand-4`), child's hand from the left (`--hand-1`), one finger from each resting on the package. Tally seated at the right edge, arm extended. Nothing else in frame — no table, no room, no wood grain.
- **Headline.** `FLIP THE BOX` — 84 pt Fraunces 800, Blueberry, top of the cover, centered.
- **Subhead.** *Learn it together at the kitchen table. Ages 6–13 + the grown-ups.* (20 pt Lexend 400, Slate.)
- **Promise line.** `FOR PARENTS AND KIDS — BOTH BOOKS, ONE METHOD` — 36 pt Lexend 700, Paprika.
- **Color treatment.** Paper ground, ~70% of the cover left empty. The only saturated element is the package. The generosity of the white space is the entire premium signal, and it is also the single most expensive-looking thing a cover can do.
- **Thumbnail at 200 px.** Weakest of the three. The two hand shapes collapse into one warm blob at 45 px; you can tell *something human* is happening but not what. Title still renders at 27 px, so the cover is not illegible — it just isn't *informative*.
- **Why it stops a thumb.** Emotional rather than structural: it's the only cover that shows two people. In a category of lone-product shots, human contact is a pattern break.
- **Risk.** Fails the squint test. Also the hardest of the three to execute — hands are the single easiest thing to draw badly, and a badly drawn hand on a cover is fatal.

---

### ▶ PARENT GUIDE WINNER: **P-B — "Front / Back"**

**Why.**

1. **It wins the squint test outright.** Three high-contrast luminance zones survive any amount of blur. P-A survives too but says nothing; P-C says something but doesn't survive.
2. **It is the positioning, not just a picture.** The cover argues *media literacy*, not *nutrition advice*, before the buyer reads a word. That reframing is the brand's entire strategic moat and its protection against backlash — and this is the only concept that does it visually.
3. **It is unstealable.** Anyone can set a big word (P-A) or draw hands (P-C). The Front/Back split only works if you have actually built a product around the front/back distinction. The cover is a proof of the product.
4. **It is the video.** The TikTok hook is a hand rotating a box — the cover is the same gesture frozen. Ad creative and cover art become one asset, which for a creator-led launch is worth more than any aesthetic argument.
5. **It scales.** The split becomes the sales-page hero, the email header, the 9:16 hook frame, and the fold on the printed cover. One idea, ten placements.

**What we take from the runner-up.** P-A's typographic *scale* is absorbed into P-B: the Blueberry band gets the full Fraunces 800 `WONK 1` treatment at 78 pt rather than a modest 48 pt title. P-B's original weakness was a timid headline; P-A fixes it.

**What we do with P-C.** It is not wasted — it becomes the **back cover** and the sales-page hero (S-501). It is a wonderful image and a mediocre thumbnail, so it goes where it will be seen large.

**Production notes.** Left half must be cleared against §5 of the illustration bible before render. The Nutrition Facts panel on the right is live Arimo type at true proportions with values cited to `01-FACTS`; it is never AI-generated raster. Grayscale variant: the left half drops to 62% K flat and keeps its starburst *shape*, so the loud/quiet contrast survives as form when it can no longer survive as color.

---

## PART 2 — THE KIDS WORKBOOK

Two tiers ship from one cover system: **Starter Kit (6–9)** and **Pro Kit (10–13)**. The system must make them obviously siblings and obviously *not* the same book — a 12-year-old must not feel handed the little kid's version.

---

### **K-A — "Tally Flips It"**
*Character-led. The safe, warm, classic move.*

- **Concept.** The mascot, mid-action, on a huge package. The cover a parent expects, executed better than the category executes it.
- **Focal image.** A tall fictional carton occupying the center 55% of the cover, drawn dead flat-on, already rotated 20° into its flip with a single thin motion arc. Tally (E2, "Caught it") braced against the carton's left edge with both arms, antenna leaning forward. Three Bits watching from the baseline. Ground-shadow ellipse only — no floor.
- **Headline.** `FLIP THE BOX` — 96 pt Fraunces 800 arcing… **no.** Flat, flush left, top-aligned. (Arched type is on the reject list; noted here because it is the first thing a lesser designer will reach for.)
- **Subhead.** *Read any snack in 10 seconds.* (28 pt Lexend 600.)
- **Promise line.** `STARTER KIT · AGES 6–9` — 36 pt Lexend 700 +6% in a pill.
- **Color treatment.** Sunbutter `#F4B63F` field for Starter, Tidepool `#1A6C69` for Pro. Ink type on Sunbutter (8.98:1); Paper type on Tidepool (5.80:1).
- **Thumbnail at 200 px.** Good. Tally renders ~35 px tall — the antenna survives, the tally-mark chest does not. Title at 31 px.
- **Why it stops a thumb.** Warm, friendly, instantly legible as a kids' book. It converts the parent who is *already* looking for a kids' workbook.
- **Risk.** It is the expected cover. It converts search traffic and does nothing for a cold scroll. It also leans the entire brand on the mascot, which is a fragile place to put it this early.

---

### **K-B — "The Wall"**
*Pattern, with one break in it.*

- **Concept.** A grid of packages, all facing front, **except one**, which is turned around showing its Nutrition Facts panel. Tally stands on top of the turned one. The cover is a tiny visual puzzle, and finding the odd one out is the same act the book teaches.
- **Focal image.**
  - *Starter Kit:* a **3 × 3 grid** of nine fictional packages from the §5.2 list, evenly spaced, flat orthographic, all fronts, all in palette colors, gutters at 18 pt.
  - *Pro Kit:* a **4 × 4 grid** of sixteen — denser, more to scan, visibly the harder book. The tier difference is carried by grid density, which is an honest signal rather than a cosmetic one.
  - In both, the **center-right** cell is rotated: a white Nutrition Facts panel, black Arimo rules, ringed with a 3 pt Paprika keyline. Tally (E1) stands on its top edge, pointing down at it, at ~18% of cover height so the antenna survives the thumbnail.
- **Headline.** `FLIP THE BOX` — 72 pt Fraunces 800 reversed out of a full-width Blueberry band across the bottom 22%.
- **Subhead.** *Nine boxes. One of them is telling you the truth on the back. So are the other eight.* (22 pt Lexend 400, Paper.)
- **Promise line.** `STARTER KIT · AGES 6–9` / `PRO KIT · AGES 10–13` — 36 pt Lexend 700 +6%, Sunbutter or Tidepool pill at the top-right.
- **Color treatment.** Paper ground behind the grid; the packages supply every palette color at small scale, which reads as a *pattern* rather than as chaos because each individual element is small. Blueberry band anchors the bottom. The turned package is the only pure white in the composition — a deliberate luminance spike.
- **Thumbnail at 200 px.** **The strongest of all six.** Individual packages resolve to ~45 px and aren't individually readable — irrelevant. What the eye gets is a regular colored grid with one white hole in it, which is a pre-attentive pop-out: it is processed before you decide to look. Title at 23.5 px.
- **Why it stops a thumb.** The pop-out fires before conscious attention does. And the cover *is* the product — a shelf of packages and one of them turned around. No competitor in this category ships a pattern cover; they all ship a mascot or a photo of vegetables.
- **Risk.** Nine to sixteen packages is nine to sixteen pieces of art that must all be equally good. It is the most expensive cover to produce. Mitigated by the fact that §5.2's twelve fictional brands are needed for the interior anyway — the cover is assembled from assets the book already pays for.

---

### **K-C — "Your Hands"**
*First person. The reader is on the cover.*

- **Concept.** The reader's own hands, from the reader's own viewpoint, holding a box mid-flip and filling the frame. Not a kid on the cover — **you** on the cover.
- **Focal image.** Hero **S-204** scaled to fill: two hands cropped at the wrists, gripping a tall carton at a 30° roll with one thin curved arrow. Hands occupy the lower 40%, the carton the center. Skin tone `--hand-2` on the Starter Kit and `--hand-5` on the Pro Kit — a small, deliberate statement that there is no default.
- **Headline.** `FLIP THE BOX` — 88 pt Fraunces 800, Paper, reversed over the upper field.
- **Subhead.** *You already have everything you need. It's printed on the box.* (24 pt Lexend 400.)
- **Promise line.** `STARTER KIT · AGES 6–9` — 36 pt Lexend 700 +6%.
- **Color treatment.** Full-bleed Paprika-bright `#D4622A` field with a 4% grain, Paper type, the carton in Blueberry and Sunbutter. The hottest cover in the set — chosen because a first-person shot needs saturation behind it or the hands read as a beige smear.
- **Thumbnail at 200 px.** Good, not great. The hand shapes resolve as two pale masses gripping a dark rectangle; the gesture reads, the detail doesn't. Title at 28.8 px.
- **Why it stops a thumb.** POV framing is native to the platform this brand sells on — it is the visual grammar of every phone video in the feed. The cover looks like a frame *from* a TikTok, which is exactly the right signal for a creator-led product.
- **Risk.** The riskiest render in the set. A slightly-wrong hand on a cover is worse than no hand at all. It is also the most saturated asset in the whole system and will want careful proofing against the "not fast-food garish" constraint.

---

### ▶ KIDS WORKBOOK WINNER: **K-B — "The Wall"**

**Why.**

1. **It wins on pre-attentive processing, which is the only thing that matters at 200 px.** A uniform grid with one white break is a pop-out the visual system resolves before the viewer chooses to look. K-A and K-C both require a decision to look; K-B does not.
2. **The cover is the curriculum.** A shelf of packages, one turned around, is the literal content of the book. A cover that is a compressed version of the product is worth more than a cover that is a nice picture next to the product.
3. **It solves the two-tier problem honestly.** 3×3 versus 4×4 makes the Pro Kit visibly denser and harder. A 12-year-old handed the 4×4 feels promoted. Doing this with a size badge alone would be a sticker; doing it with grid density is design.
4. **It de-risks the mascot.** Tally is present, small, and on-brand, but the cover does not live or die on whether a stranger falls in love with a character in 200 ms. For a brand this young, that is the correct bet.
5. **It photographs and films beautifully.** Nine packages on a table with one turned around is a shot the owner can *physically stage in a kitchen*, which turns the cover into a repeatable, zero-budget video format. The cover and the content calendar become the same idea.
6. **It is the most expensive-looking cover of the six**, and it earns the price point. Pattern covers signal art direction. Mascot covers signal a template.

**What we take from the runners-up.** K-A's Sunbutter/Tidepool tier fields move into K-B as the color of the age pill and the spine, so the two tiers are still tellable apart on a shelf edge or in a stack of home-printed pages. K-C's first-person shot becomes **page 3** of the Starter Kit (S-204), where it belongs — it is a superb interior image and a merely good cover.

**Production notes.** All nine/sixteen packages come from the approved fictional-brand list; no package may be cleared for the cover that isn't already cleared for the interior. The turned package's panel is live Arimo at true proportions, values cited to `01-FACTS`. The Paprika keyline around it is 3 pt and is the only keyline on the cover. Grayscale variant: the eight/fifteen fronts drop to their L\* values (§3.7) and the turned panel stays pure white — the pop-out survives grayscale by construction, because it was built on luminance in the first place.

---

## 3. The family shot

The three covers have to work as one object on a sales page and in a bundle graphic (S-502, S-511).

| | Parent Guide | Starter Kit (6–9) | Pro Kit (10–13) |
|---|---|---|---|
| Structure | Vertical 50/50 split | 3 × 3 grid | 4 × 4 grid |
| Dominant field | Paprika-bright + Paper | Paper + Blueberry band | Paper + Blueberry band |
| Age pill | none | Sunbutter | Tidepool |
| Spine color | Blueberry | Sunbutter | Tidepool |
| Title treatment | identical Fraunces 800 lockup in a Blueberry band | identical | identical |

The shared Blueberry band and the identical title lockup are what make them a set. The structural difference — split versus grid versus denser grid — is what makes them three different books. Fanned in a family shot, the eye reads *one system, three products,* which is exactly what an offer stack needs to communicate.

---

## 4. Cover QA checklist

Nothing ships until every line is true.

1. Exported at 200 × 259 px and viewed on a phone at arm's length: the **title** and the **promise line** are both readable.
2. Squint / 8 px Gaussian blur at 200 px: a **structure** still happens — not a smear.
3. Grayscale variant: the cover's primary contrast move survives.
4. Nothing critical outside the 0.5 in safe area; nothing at all within 0.25 in of trim on the home-print edition.
5. Every package depicted is from the approved fictional-brand list, and no element resembles real trade dress (illustration bible §5).
6. Every panel value is cited to `01-FACTS`.
7. No body, no scale, no before/after, no crossed-out food, no red-vs-green, no arched or warped type, no blurred drop shadow.
8. Title lockup is pixel-identical across all three covers.
9. Spine title legible at 0.27 in.
10. Social crops (1:1, 4:5, 9:16) generated from the same master with the title still inside the safe area at each ratio.
