# FLIP THE BOX — Illustration Bible v1.0

**Scope:** every drawn mark in the product — characters, spot art, diagrams, icons, covers.
**Originality mandate:** every character, style rule and asset in this document is original to this product. Nothing here references, imitates, or is derived from an existing IP, mascot, franchise, or the identifiable style of any living artist. Any asset that arrives looking like something a reviewer could name is rejected and redrawn — no exceptions, no "it's just inspired by."
**Numbers:** every nutrition value that appears inside an illustration is sourced from `01-FACTS/nutrition-fact-base.md`. Illustrators and prompt operators receive values; they do not invent them.

---

## 1. The three principles this whole visual world runs on

1. **The guide never judges. The guide counts.** Every drawing has to survive the test: *could a reader infer that this picture thinks a food is bad?* If yes, redraw.
2. **The reader is never drawn.** We draw their hands. Identity stays open; the kid in the picture is always the kid holding the book.
3. **One hand made everything.** One line weight, one shading move, one palette, one perspective rule. The consistency is the premium signal — not the rendering quality.

---

## 2. GUIDE CHARACTER — **TALLY**

### 2.1 Who Tally is

Tally is a small pantry-dwelling creature who cannot resist counting things. Tally does not know more than the reader; Tally is just better at *looking in the right order*. Tally is the reader's peer, not their teacher.

**Name rationale:** a tally is the most primitive form of counting stuff, which is precisely what a Nutrition Facts panel is. The name also gives the brand a free graphic motif (§2.6) that works at any size, in any color, in grayscale, and as a progress tracker.

*Clearance note: "Tally" is a common English noun. Run a formal clearance on the character name alongside the wordmark before first commercial use. Backup name if it fails: **TICK**, with all other specs unchanged.*

### 2.2 Silhouette — the part that has to work at 16 px

Tally is built from three shapes and one stroke:

- **Body:** a single upright superellipse — a rounded rectangle, wider at the bottom than the top, ratio **3 wide : 4 tall**, corner radius **38% of body width**. Weighted low, like a weeble. No neck. The head is not a separate shape; the top third of the body *is* the head.
- **Limbs:** two short arms, one body-width long, ending in simple four-finger mitten hands. Two stubby legs, one-quarter body height, ending in rounded shoes drawn as half-capsules.
- **THE STROKE:** a single upright antenna rising from the top of the head, **0.55× body height**, ending in a small solid dot. It is drawn at the contour line weight, not thicker.

**The antenna is the whole silhouette.** It is what makes Tally identifiable at favicon size, on a sticker, embossed, in grayscale, and as a single-color stamp. It is also the emotion carrier (§2.4) — Tally has no eyebrows, so the antenna does all the emotional work. This is deliberate: an emoting line is legible at sizes where a face is not.

**Silhouette test (mandatory before any Tally asset ships):** fill the whole character 100% Ink at 16 px wide. If you cannot tell it is Tally, it is wrong.

### 2.3 Palette — fixed, never varies

| Part | Token | HEX | Note |
|---|---|---|---|
| Body fill | `--c-oat` | `#EDE4D6` | **Tally is the color of label paper.** The guide is literally made of the thing the book teaches you to read. |
| Contour | `--c-ink` | `#22201D` | Single weight, all the way around |
| Tally markings (chest) | `--c-blueberry` | `#23386B` | Four uprights + one diagonal |
| Antenna dot | `--c-paprika` | `#AD3F1B` | The only warm note on the character. It is the "idea" light. |
| Shoes | `--c-blueberry` | `#23386B` | |
| Eyes | `--c-ink` | `#22201D` | |
| Shading | Ink at 12% | — | One flat shape, lower-right |
| Ground shadow | Ink at 8% | — | One ellipse |

**Why Tally is not a loud color.** The mascot is the quietest thing on most pages. A pale, paper-toned character against a cream ground, with one red dot, reads as editorial illustration. A saturated mascot reads as a cereal-box character — which is exactly the register this product is teaching kids to see through. This is the single most important color decision in the character system and it is not negotiable.

On covers and any asset below 2 inches, Tally sits against a **Blueberry** or **Sunbutter** field for separation. Never against Paper at small size — Oat on Paper is 1.18:1 and the contour alone will not carry it.

### 2.4 Expressions — exactly three

Tally ships with three expressions. Not five. Not a sheet of twenty. Three, drawn identically every time, is what makes a character feel designed rather than generated.

| # | Name | Eyes | Mouth | Antenna | Head tilt | Used for |
|---|---|---|---|---|---|---|
| **E1** | **Curious** (default, ~70% of appearances) | Two even circles, 11% of body width | Small open oval, 7% of body width | Straight up, dot centered | **8° to the reader's left** | Asking the question. Pointing at where to look. |
| **E2** | **Caught it** | Two upward arcs, 2.2× contour weight, open at the bottom | Wide flat-bottomed smile, 26% of body width | Leaning **20° forward**, with a single thin arc behind the dot | 0° | The moment the reader finds the number. Never used to mean "correct answer" — used to mean "you looked." |
| **E3** | **Hold on** | Left eye a circle, right eye a circle at 75% scale | A short straight line, 14% of body width, offset 8% to the left | Bent into a **question hook** — a 180° curl at the top | **12° to the reader's right** | "Read that again." "What does *made with* actually mean?" |

**E3 is not a frown.** Tally has no sad, angry, disgusted, disapproving, or shocked expression, and never will. Tally's skepticism is aimed at a *claim on a package* — never at a food, never at a person, never at what anyone eats. If an art request asks for Tally reacting negatively to a food, the request is rejected and escalated to `09-QA`.

### 2.5 Behavior rules — what Tally does and does not do

**Tally does:**
- Point. Tally's most common pose is one arm extended, index side of the mitten toward the panel.
- Count out loud (Tally's dialogue often contains a number, always sourced).
- Get it wrong, notice, and say so — at least twice per book. A guide who is never wrong teaches kids to defer rather than check.
- Climb on packages. Tally is one-third the height of a standard cereal box, so Tally can sit on a box, hang off a lid, or stand on a shelf edge.
- Hand things to the reader's hands (§4).

**Tally does not:**
- Eat, anything, ever, on any page. The guide has no food preferences. This closes off every "but Tally eats X" argument before it starts.
- Take food away from anyone, hide anything, or cross anything out.
- Appear in the Parent Guide body. The Parent Guide is typographic and illustration-light by design (§6.1) — Tally appears there only as a mono head-mark on the parent-note sidebar and on the cover.
- Wear clothes, accessories, hats, or props that change between drawings. Tally's only variable is pose and expression.

### 2.6 The tally-mark motif

Four uprights and one diagonal. It lives on Tally's chest, and it is also the brand's general-purpose graphic device:

- **Section rules:** five strokes, Stone, used instead of a plain hairline between sections.
- **Progress trackers:** activity completion marked in fives.
- **Sticker and badge art:** a tally group inside the Sunbutter circle.
- **Endpapers / pattern fills:** a scattered tally field at 8% Ink.
- **Page-count device** on the fridge poster.

The motif is grayscale-native, prints at 0.75pt, scales from 8 px to a 24 in poster, and costs almost no ink.

### 2.7 Turnaround and model sheet deliverables

The illustrator delivers, as layered SVG plus a single reference PNG sheet at 300 ppi:
1. Front, 3/4-left, 3/4-right, side, back (5 views), E1 only.
2. E1 / E2 / E3 heads at front and 3/4-left (6 heads).
3. Eight canonical poses: point-right, point-down, both-arms-up, sitting-on-edge, climbing, holding-a-card, handing-over, walking.
4. A 16 px, 24 px and 48 px solid-Ink silhouette test strip.
5. A grayscale (`data-theme="mono"`) version of every asset above.
6. The construction grid (proportions expressed as ratios of body width, so Tally can be rebuilt at any size).

---

## 3. SUPPORTING CHARACTERS

### 3.1 **BLURB** — the voice of the front of the package

**Role.** Blurb is what the front of the box sounds like. Blurb is sincere, enthusiastic, and says things that are **true but incomplete** — which is what marketing claims actually are. Blurb is not a liar and is not a villain.

**This is the most important rule in the whole product.** A villain teaches kids that food companies are the enemy, which is fear-based, unfalsifiable, and legally hazardous. An over-excited friend who keeps saying "made with real fruit!" teaches kids the actual skill: *listen to the words, then go check.*

**Silhouette.** Blurb's head **is a speech bubble** — a rounded rectangle with a tail pointing down-left, corner radius 22% of bubble width. The body is thin and tall: **1.6× Tally's height** but only **0.7× Tally's width**. Long arms, permanently mid-gesture, one raised. Two small feet. No neck. The bubble tail is the silhouette tell — it reads at 16 px.

**Palette.**

| Part | HEX | Note |
|---|---|---|
| Bubble head fill | `#F4B63F` Sunbutter | |
| Body fill | `#AD3F1B` Paprika | |
| Contour | `#22201D` Ink | |
| Eyes / mouth | `#22201D` Ink | |

Blurb is built from the two loudest colors in the palette, on purpose. Blurb is *made of advertising*. Tally is made of paper. That contrast is the entire thesis rendered as two characters.

**Expressions — three.**
- **B1 Delighted** (default): eyes as two upward arcs, mouth wide open in a shout, both arms up.
- **B2 Mid-pitch:** one eye a wink, mouth an open oval, one arm presenting toward the package.
- **B3 Huh!:** eyes as two even circles, mouth a small flat line, bubble tail drooping 20°, one arm scratching the top of the bubble. Used when the panel and the claim don't line up. **Blurb is never embarrassed, never scolded, never shown as defeated.** Blurb shrugs and says "huh!" and that's the end of it.

**Typographic tie-in.** Blurb's dialogue is always set the way the myth-buster box sets a front-of-package claim: inside straight quotes, Fraunces 700, with a `--t-micro` Slate gloss underneath giving the phrase's actual regulatory meaning (sourced to `01-FACTS`). Blurb's words and the myth-buster component are the same object in two places.

**Blurb never:** appears without a package nearby; says anything untrue; refers to a person; appears in the Parent Guide.

### 3.2 **BIT** — the unit

**Role.** Bit is one serving, made visible. Bit exists to solve the single most misunderstood element of the Nutrition Facts panel: *the numbers are per serving, and there is usually more than one serving in the package.*

**The mechanic.** Bit appears **in multiples**. A package with three servings gets three Bits sitting in a row beneath it. Kids count Bits. That's it. That's the whole device, and it is the best visual metaphor available for servings-per-container because the reader performs the multiplication themselves instead of being told the answer.

**Silhouette.** A small rounded cube — a squircle-faced cube drawn front-on with a 30° cabinet top face. **0.2× Tally's height.** Two dot eyes. **No mouth, no arms, no legs.** Bit moves by hopping, indicated by a single thin arc.

**Palette.** Fill `#5F7588` (the Amount Ladder's mid rung), contour `#22201D`, eyes `#22201D`. Bit is deliberately built from the measurement palette, not the character palette, because Bit *is* a measurement.

**Expressions — two.** Eyes open. Eyes closed. That is the entire range. The restraint is the point; a silent, expressionless unit cannot accidentally editorialize about a quantity.

**Bit never:** speaks, has a personality moment, is drawn at a size that implies a portion is "too big," or appears alone when a package has more than one serving.

### 3.3 **THE HANDS** — the reader's own

Not a character. A system rule.

Every "now you do it" moment in the product is drawn as **a pair of hands holding a package, cropped at the wrist, from a first-person over-the-shoulder viewpoint.** We never draw the reader's face, body, hair, or clothes.

**Why:** it is inclusive by construction, it costs a fraction of what drawing varied children costs, it keeps the reader's identity open, and it is a technique the premium end of children's publishing already uses because it puts the reader *inside* the page instead of watching someone else do the activity.

**Skin tone set — rotated, no default.** Six tones, used in rotation across the shot list, never the same tone on consecutive spreads, and no tone assigned to a "main" character because there isn't one.

| Token | HEX | Shading (12% Ink multiply over) | Knuckle/nail line |
|---|---|---|---|
| `--hand-1` | `#F3D6C0` | — | `#D9B69B` |
| `--hand-2` | `#E8BC98` | — | `#C99A73` |
| `--hand-3` | `#D19E72` | — | `#AE7C51` |
| `--hand-4` | `#B07A4E` | — | `#8E5E38` |
| `--hand-5` | `#8A5A38` | — | `#6B4227` |
| `--hand-6` | `#5C3A25` | — | `#452A1A` |

Contour stays Ink `#22201D` on all six. Nails are drawn as a single arc, not filled. No rings, no watches, no nail polish, no age markers — the hands must be readable as a kid's or an adult's depending on context, and the only thing that changes is scale relative to the package.

**QA rule:** across each book, the six tones must each appear at least twice, and the sequence must be logged in the shot list so the rotation is auditable rather than accidental.

---

## 4. ILLUSTRATION STYLE SPEC

Precise enough that a human illustrator and an AI image tool produce the same book.

### 4.1 Medium and construction

- **Vector only.** SVG authored on a **1000 × 1000 pt** artboard. No raster sources except the grain overlay (§4.6).
- All geometry built from **superellipse** curves (continuous curvature), not circular fillets. Nothing in this world has a mechanically perfect circular corner except the Nutrition Facts panel replica, which is square-cornered because the real one is.
- Every asset ships as layered SVG **plus** a 300 ppi PNG **plus** a grayscale variant. Flattened-only deliveries are rejected (Hard Rule #6 in the master brief).

### 4.2 Line

| Property | Value |
|---|---|
| Contour weight | **3.5% of the subject's height** (e.g. 3.5 pt on a 100 pt character) |
| Interior detail weight | **60% of contour** |
| Minimum printed weight | **1 pt / 0.35 mm** at final print size — below this a home inkjet drops the line |
| Caps / joins | Round. Always. No mitres anywhere. |
| Variation | **None.** One weight per drawing. No tapering, no pressure simulation, no calligraphic modulation. |
| Wobble | A very slight hand tremor is permitted — **maximum 0.4% of the subject's height** of deviation from true. Enough to not look machine-traced. Not enough to look sketchy. |
| Open contours | Forbidden. Every shape closes. |

The single-weight rule is what separates this from clip art. Mixed line weights on one page is the number-one tell of assembled stock art.

### 4.3 Corner radius

- No corner tighter than **4% of the shape's shorter dimension.**
- Character body radius: 38% of body width.
- Speech bubble radius: 22% of bubble width.
- Package corners: 3% of package width (packages are *nearly* sharp — they are the un-soft objects in a soft world, which is itself a small piece of art direction).
- Icons: 2 px radius on a 24 px grid (§8).

### 4.4 Shading

- **Exactly one** flat shadow shape per object. Not two. Not a gradient.
- Fixed light source: **upper-left, 135°.** Shadow falls lower-right.
- Shadow value: **Ink at 12%, multiply.** Never a darker tint of the object's own color — one shadow value across the whole book keeps the light consistent.
- **Ground shadow:** one ellipse, Ink at 8%, width 80% of the object's width, height 12% of that width, centered under the object with no offset.
- **Forbidden:** gradients, gradient meshes, blurred shadows, ambient occlusion, rim light, specular highlights, gloss, bevel, emboss, inner shadow, outer glow.

### 4.5 Color application

- **Maximum 4 palette colors + Paper + Ink per illustration.** Count the tints; `--sunbutter-16` counts as a color.
- Character colors are **locked** (§2.3, §3.1, §3.2). They do not change for a cover, a season, a promotion, or a mood.
- Flat fill only. No blends, no overprint simulation except the grain in §4.6.
- The Amount Ladder's three values (`#2B3F55` / `#5F7588` / `#CDD9E2`) are **reserved**. They may not be used decoratively anywhere in the product. If a reader sees those three values, it means an amount.
- Fills below 8% or above 60% tint do not appear on any page a customer prints.

### 4.6 Texture

- One **halftone grain** overlay: Ink at **4%**, **40 lpi**, 45° screen angle.
- Applied **only** to flat fills larger than one square inch. Never to line work, never to type, never to the Nutrition Facts panel.
- **Baked into the asset.** We do not rely on the customer's printer to produce a texture effect.
- A **0.5 pt deliberate misregistration** of the grain layer against the contour is permitted on cover art only — it is the riso-print cue that reads as "designed object," and on interior pages it would just look like a printing fault.

### 4.7 Perspective and staging

- **Flat orthographic. No vanishing points. Ever.**
- Objects are drawn either dead front-on or at a fixed **30° cabinet projection** with **zero foreshortening** (depth edges drawn at true length).
- **Packages are always drawn front-on** — front face for the front, back face for the back. Never in perspective, never angled, never with a curved panel. The reader has to be able to read the panel; a "nicer" angled shot destroys the entire teaching function of the image. This rule outranks composition.
- **Horizon:** none. Objects sit on their ground-shadow ellipse and nothing else. No floors, no walls, no rooms, unless the shot list explicitly calls for a scene (S-501, S-502).
- **Subject occupies 55–70% of the frame height**, with a minimum **8% empty Paper margin** on all four sides.
- **Scale constants:** Tally = 1/3 of a standard cereal-box height. Bit = 1/5 of Tally. Blurb = 1.6 × Tally. A hand's width = 0.9 × Tally's height. These never vary.

### 4.8 Type inside illustrations

- Any lettering drawn inside an illustration is set in a brand face (§ brand-system.md 4.1) and converted to outlines on export. No hand-lettering, no faux-handwriting, no arched or warped text.
- Package names on fictional products: **Fraunces 700** or **Lexend 700** only.
- Nutrition Facts panel replicas: **Arimo**, at true proportions.

### 4.9 NEVER DO — the reject list

An asset containing any of the following is rejected on sight, regardless of how good it otherwise looks:

**Craft**
1. More than one line weight in a drawing.
2. Gradients, gradient meshes, blurred drop shadows, glows, bevels, gloss highlights, lens flares.
3. Perspective on a package, or any vanishing point anywhere.
4. Photographic elements, photo-collage, or photorealistic food.
5. Stock clip art of any kind, at any scale, for any reason.
6. Decorative sparkles, stars, swooshes, confetti, or motion lines used as filler.
7. Non-proportional scaling of any asset or type.
8. Outlined, arched, warped, or 3D-extruded lettering.
9. A drawing that does not close its contours, or open paths in the final SVG.

**Legal**
10. Any real brand's logo, wordmark, script, character, mascot, or packaging.
11. Any recognizable trade dress — including colorway-plus-form combinations a reader could name (see §5).
12. Any real product's nutrition values without a `01-FACTS` citation.
13. Any depiction imitating a living artist's identifiable style.

**Editorial / brand-safety**
14. Red-versus-green to signify anything.
15. Color as the only carrier of a meaning.
16. A human body — any body, any size, any age. We draw hands and characters only.
17. A character eating, refusing, hiding, discarding, or reacting with disgust to a food.
18. A crossed-out food, a red X over a package, a "no" symbol over anything edible.
19. A scale, a tape measure, a mirror, a "before/after," or any weight imagery.
20. Two columns of food sorted into an implied good pile and bad pile.
21. Any food drawn with a face, expression, or emotional state.
22. Tally frowning at, or Blurb being humiliated over, anything at all.

---

## 5. FICTIONAL BRAND SYSTEM (legal safety layer)

Every package drawn in this product is a **fictional brand from the approved list below.** This is not optional garnish; it is the layer that keeps a product about reading labels from becoming a product that gets a cease-and-desist.

### 5.1 Rules for fictional packaging

1. **No name within edit-distance 2 of a real brand**, and no name that is a real brand with one letter changed, a rhyme of a real brand, or a pun on a real brand. Parody is a defense we do not want to need.
2. **No real trade dress.** Specifically forbidden combinations: red-and-white script on a carbonated drink; red-and-yellow on a fast-food carton; a specific cartoon animal mascot silhouette on a cereal front; a blue box with a specific shade-and-shape macaroni lockup; a green mermaid-adjacent roundel on a cup. If a reviewer can name the real product from the drawing, redraw it.
3. **Fictional packaging uses the brand palette only** (`brand-system.md` §3) — never a palette chosen to evoke a real product.
4. **All panel values on fictional packages come from `01-FACTS`** as typical/composite values for that food category, cited in the asset's metadata.
5. Each fictional brand has **one** locked package design, reused everywhere, so the books feel like one grocery store.

### 5.2 The approved in-world brand list

| Brand | Category | Package form | Palette |
|---|---|---|---|
| **Krunchola** | Breakfast cereal | Tall carton | Blueberry + Sunbutter |
| **Two Rivers** | Rolled oats | Cylindrical canister | Oat + Tidepool |
| **Fizzwell** | Sparkling drink | Slim can | Tidepool + Paper |
| **Pockit** | Snack bar | Rectangular wrapper | Paprika + Oat |
| **Copper Kettle** | Chips | Foil bag | Paprika + Ink |
| **Blue Barn** | Yogurt cup | Tub with foil lid | Blueberry + Paper |
| **Nightowl** | Cocoa mix | Squat tin | Ink + Sunbutter |
| **Marigold Mills** | Sandwich bread | Poly bag with tie | Sunbutter + Oat |
| **Tumbleweed** | Trail mix | Stand-up pouch | Oat + Paprika |
| **Pepperbox** | Crackers | Flat box | Tidepool + Sunbutter |
| **Lunar** | Lemonade | Tall bottle | Sunbutter + Blueberry |
| **Grandpa Wick's** | Pasta sauce | Glass jar | Paprika + Ink |

Twelve brands is enough to teach every comparison in the curriculum and few enough that a kid starts recognizing them, which is itself a small joke the product is in on.

---

## 6. SHOT LIST

Every illustration the product needs. **ID · description · where it appears.** Hero shots are marked **[H]** and have full production prompts in §7.

### 6.0 — Identity and brand assets

| ID | Description | Location |
|---|---|---|
| S-001 | **[H]** Tally, E1, full body, front, arm extended pointing right | Master art; everywhere |
| S-002 | Tally head-mark, mono, single-color Ink, 24 pt | Parent-note sidebar; favicon; sticker |
| S-003 | Tally E2 full body, both arms up | Completion pages; badge art |
| S-004 | Tally E3 full body, head tilted right, one hand raised | Myth-buster pages |
| S-005 | Blurb B1, full body, both arms up, mid-shout | Front-of-package spreads |
| S-006 | Blurb B2, presenting a Krunchola carton | Myth-buster component |
| S-007 | Blurb B3, bubble tail drooping, scratching head | After every myth-buster |
| S-008 | Bit, eyes open, single | Serving-size lessons |
| S-009 | Bit ×3 in a row, hopping arc on the middle one | Servings-per-container |
| S-010 | Tally-mark motif: five strokes, Stone, as a section rule | Every book, between sections |
| S-011 | Tally-mark scatter field, 8% Ink, seamless tile | Endpapers; poster backgrounds |
| S-012 | **[H]** Tally and Blurb standing either side of one package — the thesis image | Sales page; back cover; ch.1 opener |
| S-013 | The FLIP THE BOX wordmark lockup, horizontal | Covers, spine, footer |
| S-014 | The FLIP THE BOX wordmark lockup, stacked | Square social; sticker |
| S-015 | The flip glyph (box + curved arrow), standalone | App icon; video end card |

### 6.1 — Parent Guide (`03-PARENT-GUIDE/`)

The Parent Guide is deliberately illustration-light. It is typographic, editorial, and adult. Characters appear on the cover and in the sidebar mark only. The drawn content here is **diagrammatic**, not decorative.

| ID | Description | Location |
|---|---|---|
| S-101 | **[H]** Parent Guide cover art | Front cover |
| S-102 | Anatomy of a Nutrition Facts panel: full replica with numbered callout leaders to each region | Ch.1 |
| S-103 | The serving-size line isolated and enlarged, with a bracket to the rest of the panel | Ch.2 |
| S-104 | Same package, two serving-size assumptions, panel values shown twice | Ch.2 |
| S-105 | **[H]** The 10-Second Flip — four-step strip | Ch.3 opener; repeated in every book |
| S-106 | **[H]** The Amount Ladder explainer: three chips, three glyphs, one nutrient shown at each rung | Ch.4 |
| S-107 | The Amount Ladder applied to two different nutrients, identical colors, to prove the color is not a verdict | Ch.4 |
| S-108 | Ingredient list anatomy: descending-weight order shown as a descending bar of Bits | Ch.5 |
| S-109 | The same ingredient under its several names, as a linked ring diagram | Ch.5 |
| S-110 | Front-of-package claim taxonomy: a grid of claim phrases with their regulatory meaning | Ch.6 |
| S-111 | Two-up package comparison template, blank | Ch.7 |
| S-112 | Two-up package comparison, filled (Krunchola vs Two Rivers) | Ch.7 |
| S-113 | The cereal-aisle script: a three-panel dialogue strip, hands + packages only, no faces | Ch.8 |
| S-114 | What to do when a kid asks "is this bad for me" — a decision strip, typographic with one Tally mark | Ch.8 |
| S-115 | Allergen statement location diagram | Ch.9 |
| S-116 | Unit-price vs package-price shelf tag diagram | Ch.9 |
| S-117 | Panel format variants: standard, dual-column, small-package | Ch.10 |
| S-118 | Chapter opener ornament ×10 (tally group + chapter numeral) | Each chapter opener |
| S-119 | Source-citation mark (small superscript device) | Throughout |
| S-120 | Back-cover author/creator device (mono, no photograph) | Back cover |

### 6.2 — Kids Starter Kit, Ages 6–9 (`04-KIDS-WORKBOOK/`)

| ID | Description | Location |
|---|---|---|
| S-201 | **[H]** Starter Kit cover art | Front cover |
| S-202 | Tally E1 waving, small, with a name label | p.1 "Hi, I'm Tally" |
| S-203 | Tally climbing a Krunchola carton to reach the top | p.2 |
| S-204 | **[H]** First-person hands flipping a cereal box — the money shot | p.3, the core instruction |
| S-205 | Tally pointing at the serving-size line, enlarged panel behind | p.4 |
| S-206 | Bit ×1 next to a small bag | p.5 |
| S-207 | **[H]** Bit ×4 under a big bag — the servings-per-container reveal | p.6 |
| S-208 | Count-the-Bits activity field: five packages, blank Bit slots underneath | p.7 activity |
| S-209 | Blurb B1 shouting "MADE WITH REAL FRUIT!" beside a Pockit bar | p.8 |
| S-210 | The same Pockit bar, panel side, Tally E3 | p.9 |
| S-211 | Big-number tracing field: the word CALORIES in outline, with a start dot | p.10 activity |
| S-212 | Amount Ladder chips, oversized, three in a row with glyphs | p.11 |
| S-213 | Sticker-match activity: six chips, six panels, dotted join lines | p.12 activity |
| S-214 | Hands holding a Fizzwell can, tone `--hand-2` | p.13 |
| S-215 | Hands holding a Copper Kettle bag, tone `--hand-5` | p.14 |
| S-216 | Tally E2 beside a completed checklist | p.15 |
| S-217 | Ingredient list as a staircase: biggest step first, descending | p.16 |
| S-218 | Cut-out Bit tokens, 8-up, with scissor guide rules | Back matter, cut-out sheet |
| S-219 | Cut-out Tally bookmark, front and back | Back matter |
| S-220 | "I flipped a box today" badge, Sunbutter circle, tally group inside | Back matter, sticker sheet |
| S-221 | Section header ornaments ×6 (tally group + section numeral, Sunbutter) | Section openers |
| S-222 | Blank practice panel (empty Nutrition Facts replica to fill in) ×2 sizes | Activity pages |
| S-223 | Tally E1 seated on a shelf edge, legs hanging | Chapter transitions |
| S-224 | Answer-key opener ornament | Back matter |

### 6.3 — Kids Pro Kit, Ages 10–13 (`04-KIDS-WORKBOOK/`)

Older tier: fewer characters, more diagrams, dryer humor. Tally appears roughly half as often as in the Starter Kit, which is a deliberate signal that the reader has graduated.

| ID | Description | Location |
|---|---|---|
| S-301 | **[H]** Pro Kit cover art | Front cover |
| S-302 | Tally E1, smaller than in the Starter Kit, arms folded, leaning on a panel edge | p.1 |
| S-303 | Full panel replica, true size, all regions labeled | p.2 |
| S-304 | **[H]** Two-up comparison hero: Krunchola vs Two Rivers, panels side by side | p.4 |
| S-305 | %DV bar array: one nutrient, five products, sorted, Amount Ladder colored | p.6 |
| S-306 | Serving-size manipulation demo: one product, two package sizes, panels compared | p.7 |
| S-307 | Ingredient-order puzzle: shuffled ingredient cards to re-sort by weight | p.8 activity |
| S-308 | The many-names-for-one-ingredient ring diagram, harder version | p.9 |
| S-309 | Blurb B2 with a claim, and the claim's regulatory definition set beneath as fine print | p.10 |
| S-310 | Claim-decoder table: eight front-of-package phrases, eight meanings | p.11 |
| S-311 | Dual-column panel format explained | p.12 |
| S-312 | Small-package / abbreviated panel format explained | p.13 |
| S-313 | Unit price vs package price: two shelf tags, math shown | p.14 |
| S-314 | Build-your-own comparison worksheet, blank two-up | p.15 activity |
| S-315 | Hands holding a Tumbleweed pouch, tone `--hand-3` | p.16 |
| S-316 | Hands holding a Blue Barn tub, tone `--hand-6` | p.17 |
| S-317 | "Design a package that tells the truth on the front" activity field | p.18 activity |
| S-318 | Marketing-word bingo card, 5×5, Stone rules | p.19 activity |
| S-319 | Tally E3 with a magnifier over a claim | p.20 |
| S-320 | Section header ornaments ×6 (tally group + numeral, Tidepool) | Section openers |
| S-321 | Bit ×8 grid for a large-format package | p.21 |
| S-322 | Glossary opener ornament | Back matter |
| S-323 | Answer-key opener ornament | Back matter |
| S-324 | "Pro" completion badge, Tidepool ring | Back matter |

### 6.4 — Printables (`05-PRINTABLES/`)

| ID | Description | Location |
|---|---|---|
| S-401 | **[H]** The 10-Second Flip fridge poster, portrait, full color | Poster 1 |
| S-402 | The 10-Second Flip fridge poster, grayscale/low-ink variant | Poster 1-mono |
| S-403 | Amount Ladder reference poster, landscape | Poster 2 |
| S-404 | Claim-decoder poster: sixteen front-of-package phrases and their meanings | Poster 3 |
| S-405 | Panel anatomy poster, true-size replica with leaders | Poster 4 |
| S-406 | Grocery-run pocket card, front (the four steps) | Card sheet, 8-up |
| S-407 | Grocery-run pocket card, back (Amount Ladder) | Card sheet, 8-up |
| S-408 | Comparison cards, blank, for two products | Card sheet, 4-up |
| S-409 | Bit token cut-outs, 24-up | Cut sheet |
| S-410 | Tally bookmark, 4-up, front and back | Cut sheet |
| S-411 | Sticker sheet: 12 badges (tally groups, Amount chips, "I flipped it") | Sticker sheet |
| S-412 | Pantry-shelf label set: 10 blank labels with tally rules | Label sheet |
| S-413 | Weekly flip tracker, tally-mark grid, 5-day | Tracker |
| S-414 | "Ask me about" conversation card deck, 12 cards, hands-and-package art | Card deck |
| S-415 | Family flip rules card (the three brand sentences), framed | Single card |
| S-416 | Lunchbox note cards, 8-up, one question each | Card sheet |

### 6.5 — Sales and video assets (`06-VIDEO-SCRIPTS/`, `07-SALES-ASSETS/`)

| ID | Description | Location |
|---|---|---|
| S-501 | **[H]** The kitchen-table scene: two pairs of hands, one package, Tally on the table edge | Sales page hero |
| S-502 | Product family shot: three covers fanned, flat orthographic, ground shadows | Sales page; offer stack |
| S-503 | Tally E1 at 1:1 square crop on Blueberry field | Social avatar |
| S-504 | Tally E2 at 9:16 with headline safe-zone guides | TikTok end card |
| S-505 | Blurb B1 at 9:16, "the front of the box" half of the thesis | TikTok hook frame |
| S-506 | Tally E1 at 9:16, "the back of the box" half of the thesis | TikTok payoff frame |
| S-507 | Animated flip loop: 12-frame box flip, front to back | Video sting; site loader |
| S-508 | Before/after page spread mockups ×4 (page art only, no device frames) | Sales page gallery |
| S-509 | Email header banner, 600 px wide, tally rule + wordmark | Email sequence |
| S-510 | Testimonial card frame, Oat field with tally rule | Sales page |
| S-511 | Offer-stack bundle graphic: flat orthographic stack of all assets | Sales page |
| S-512 | Guarantee seal: Sunbutter circle, Ink ring, tally group | Sales page |

### 6.6 — Icons

| ID | Description | Location |
|---|---|---|
| S-601–S-624 | The 24-icon set, specified in §8 | Throughout all books and printables |
| S-625 | Amount Ladder glyph set (3 filled triangles groups) | Amount chips only |

**Total: 136 numbered assets.**

| Block | Range | Count |
|---|---|---|
| Identity | S-001–S-015 | 15 |
| Parent Guide | S-101–S-120 | 20 |
| Starter Kit (6–9) | S-201–S-224 | 24 |
| Pro Kit (10–13) | S-301–S-324 | 24 |
| Printables | S-401–S-416 | 16 |
| Sales & video | S-501–S-512 | 12 |
| Icons | S-601–S-625 | 25 |
| **Total** | | **136** |

Twelve assets are marked **[H]** in the lists above. They resolve as follows:

- **Eight** have full AI prompts + illustrator briefs in §7: **S-001, S-012, S-105, S-106, S-204, S-207, S-304, S-501.**
- **Three** are covers and are art-directed in `cover-concepts.md` instead: **S-101** (Parent Guide), **S-201** (Starter Kit), **S-301** (Pro Kit).
- **One** is a reuse, not a new image: **S-401** (the fridge poster) is built from **S-105** at poster scale. It is never redrawn.

---

## 7. HERO ILLUSTRATIONS — production prompts and illustrator briefs

### 7.0 The Consistency Block

Every AI prompt in this section ends with the following block, verbatim. It is what makes shot 3 look like shot 1. Do not paraphrase it, do not shorten it, do not "improve" it between shots.

> **STYLE BLOCK (append to every prompt):**
> Flat vector children's-book illustration. Single uniform line weight contour in warm near-black #22201D, rounded caps and joins, no line weight variation anywhere. Flat fills only, no gradients, no blurred shadows, no glow, no gloss, no bevel. Exactly one flat shadow shape per object at 12% black, falling lower-right from an upper-left light. One soft ground-shadow ellipse at 8% black under each object. Strictly orthographic, flat-on, no perspective, no vanishing point, no horizon line. Warm cream background #FBF7F0. Palette limited to: #FBF7F0 cream, #EDE4D6 oat, #22201D ink, #23386B deep blue, #AD3F1B burnt orange, #F4B63F warm yellow, #1A6C69 deep teal. Subject fills 55–70% of frame height with generous empty margins. Subtle 4% halftone grain on large flat fills only. Clean, calm, premium editorial children's publishing. Print-ready.
>
> **NEGATIVE (append to every prompt):** photorealistic, 3D render, gradient, gradient mesh, drop shadow, blur, glow, glossy, bevel, emboss, lens flare, sparkles, stars, confetti, swooshes, clip art, stock art, watermark, signature, multiple line weights, sketchy lines, crosshatching, perspective, vanishing point, depth of field, real brand logos, real product packaging, recognizable trademarks, text errors, gibberish text, human faces, human bodies, red and green traffic-light colors, sad face, angry face, crossed-out food, prohibition sign, weighing scale, body shapes.

**Operator note:** AI output is a *starting point* for the vector redraw, never a shipped asset. Every hero is rebuilt as SVG by a human before it enters the book. AI-generated raster art will not survive the print spec in §4 (single line weight, exact palette, true-size panel type) and must not be trusted to render a Nutrition Facts panel — panels are always placed as real Arimo type in vector.

---

### **H1 · S-001 — Tally, master pose**

**AI prompt:**
> A small original cartoon creature named Tally, standing, three-quarter body facing the viewer. Body is a single upright rounded-rectangle shape, 3 units wide by 4 units tall, wider at the bottom than the top, corner radius 38% of body width, in pale warm oat #EDE4D6. No neck — the top third of the body is the head. Two short arms ending in simple four-finger mitten hands; the right arm extends straight out to the viewer's right, pointing. Two stubby legs in rounded half-capsule shoes, deep blue #23386B. On the chest, four vertical strokes and one diagonal stroke across them — a tally mark — in deep blue #23386B. A single thin antenna rises straight up from the top of the head, 0.55 times the body height, ending in a small solid dot in burnt orange #AD3F1B. Face: two even round black eyes, and a small open oval mouth. Head tilted 8 degrees to the viewer's left. Curious, calm, friendly. No eyebrows. No clothes, no props, no accessories.
> [STYLE BLOCK] [NEGATIVE]
> Aspect 1:1.

**Illustrator brief:** This is the master. Build it on the construction grid and express every proportion as a ratio of body width so Tally can be rebuilt at any size by anyone. The antenna is the character — it must read as Tally at 16 px filled solid black. Tally is the quietest thing on the page and that is intentional: pale paper-colored body, one orange dot. Do not add a mouth expression beyond the small oval; E1 is *curious*, not delighted. Deliver 5 views, 6 heads, 8 poses, silhouette test strip, mono variant, and the ratio-annotated construction grid.

---

### **H2 · S-012 — Tally and Blurb, the thesis image**

**AI prompt:**
> Two original cartoon characters standing on either side of a single tall cereal carton, flat orthographic, dead front-on.
> LEFT: Blurb — a tall thin character whose entire head is a speech bubble shape, a rounded rectangle with a tail pointing down-left, corner radius 22% of bubble width, filled warm yellow #F4B63F. Thin tall body in burnt orange #AD3F1B, 1.6 times the height of the other character but 0.7 times the width. Long arms both raised in an enthusiastic presenting gesture. Two small feet. Eyes are two upward arcs, mouth wide open mid-shout. Sincerely excited.
> RIGHT: Tally — a small oat-colored #EDE4D6 rounded-rectangle creature, bottom-heavy, no neck, four vertical strokes and one diagonal on the chest in deep blue #23386B, a single thin antenna with a burnt-orange dot on top, two round black eyes, small oval mouth, head tilted slightly. One arm points at the carton. Calm and curious.
> CENTER: a fictional tall cereal carton, drawn perfectly flat-on with no perspective, deep blue and warm yellow, corner radius 3% of width, with a large invented wordmark and a blank panel area. No real brand.
> The two characters are the same distance from the carton. Neither is above the other. Symmetrical, balanced, equal weight.
> [STYLE BLOCK] [NEGATIVE]
> Aspect 3:2.

**Illustrator brief:** This single image is the brand argument: the loud character is made of the two warmest, loudest colors in the palette; the quiet character is made of paper. Do not make Blurb villainous, smug, shifty, or sweaty. Blurb is *sincerely* excited and completely likeable — a reader should want to hang out with Blurb. Do not make Tally look superior. The composition must be dead symmetrical: the moment one character is staged above the other, the image starts making a moral argument and the whole brand position collapses. The carton must be readable as a carton at 1 inch wide.

---

### **H3 · S-105 — The 10-Second Flip, four-step strip**

**AI prompt:**
> A horizontal four-panel instructional strip, flat vector, on a warm cream #FBF7F0 background. Four equal square cells separated by generous empty space, no borders, no boxes.
> Cell 1: a pair of hands, cropped at the wrists, seen from a first-person over-the-shoulder viewpoint, holding a rectangular food package front-face toward the viewer. Skin tone #E8BC98, warm near-black #22201D contour.
> Cell 2: the same hands rotating the same package, a single thin curved arrow at the top indicating the flip, no motion blur, no speed lines beyond the one arrow.
> Cell 3: the same hands holding the package back-face toward the viewer, showing a blank white rectangular label panel with fine horizontal rules.
> Cell 4: the same hands holding the package, with one index finger touching the top line of the label panel.
> Above each cell, a small solid deep blue #23386B circle containing a white numeral 1, 2, 3, 4.
> Absolutely flat, no perspective, hands drawn straight-on. No faces, no arms above the wrist, no bodies.
> [STYLE BLOCK] [NEGATIVE]
> Aspect 4:1.

**Illustrator brief:** This strip is the product's spine — if a customer remembers one thing, it is this. It appears in all three books and on the fridge poster at the same proportions, so build it once as a component, not four times as art. Hands are cropped exactly at the wrist; no forearms, no sleeves. The package must be a locked fictional brand from §5.2 and must be the *same* package in all four cells. The single curved arrow in cell 2 is the only motion indicator permitted — no speed lines, no ghosting, no multiple arrows. Skin tone rotates per placement; log which tone is used where.

---

### **H4 · S-106 — The Amount Ladder explainer**

**AI prompt:**
> A vertical diagram, flat vector, on warm cream #FBF7F0. Three horizontal pill-shaped chips stacked with generous even spacing, all the same width and height, rounded fully at both ends.
> Top chip: filled deep slate blue #2B3F55, containing three small solid white upward-pointing triangles followed by the words A LOT in white uppercase sans-serif.
> Middle chip: filled medium slate blue #5F7588, containing two small solid white upward triangles followed by the word SOME in white uppercase sans-serif.
> Bottom chip: filled pale slate blue #CDD9E2, containing one small solid dark upward triangle followed by the words A LITTLE in warm near-black uppercase sans-serif.
> To the left of the stack, a small oat-colored rounded-rectangle creature with a tally mark on its chest and a single antenna with an orange dot, one arm pointing at the middle chip, calm and curious.
> No red, no green, no traffic light, no arrows up or down beside the chips, no faces on anything but the creature.
> [STYLE BLOCK] [NEGATIVE]
> Aspect 2:3.

**Illustrator brief:** This is the most carefully designed element in the product and the one most likely to be "improved" into failure. Hard constraints: (1) the three chips are one hue at three lightnesses — **never** introduce a second hue, and never, under any circumstances, make the top chip red or the bottom chip green; (2) the triangle count and the word are both mandatory and are what carry the meaning — the color is redundant by design, so the diagram has to still work printed in black and white; (3) the middle chip's label is pure white `#FFFFFF`, not cream — cream on `#5F7588` measures 4.48:1 and fails AA, white measures 4.79:1 and passes; (4) no up/down arrows outside the chips, because an arrow implies a direction you should be heading, and this ladder reports quantity, not a goal.

---

### **H5 · S-207 — Bit ×4, the servings reveal**

**AI prompt:**
> Flat vector illustration on warm cream #FBF7F0. A large stand-up snack pouch drawn perfectly flat-on with no perspective, in burnt orange #AD3F1B and oat #EDE4D6, with an invented wordmark, corner radius 3% of width. Directly beneath it, in a neat evenly spaced row, four identical small rounded cube characters, each about one fifth the height of the pouch, filled medium slate blue #5F7588 with warm near-black contour and two simple round black dot eyes, no mouths, no arms, no legs. The second cube from the left has a single thin arc above it indicating a small hop. Beneath the row of cubes, generous empty cream space.
> [STYLE BLOCK] [NEGATIVE]
> Aspect 1:1.

**Illustrator brief:** The cubes are a *unit of measurement wearing two eyes*, not a character with personality — keep them identical, evenly spaced, and expressionless. The entire teaching function is that the reader counts them, so spacing must be even enough to count at a glance and the row must never exceed eight without wrapping to a grid. The hop arc appears on exactly one cube; more than one turns a diagram into decoration. The cubes use the Amount Ladder's mid value on purpose — they belong to the measurement family, not the character family.

---

### **H6 · S-204 — First-person hands flipping a box**

**AI prompt:**
> First-person point-of-view flat vector illustration on warm cream #FBF7F0. Two hands, cropped cleanly at the wrists with no forearms and no sleeves, seen from directly above as if they are the viewer's own hands, gripping the left and right edges of a tall rectangular cereal carton. The carton is drawn perfectly flat-on, deep blue #23386B and warm yellow #F4B63F, with an invented wordmark and no real branding, corner radius 3% of width. A single thin curved arrow wraps around the carton indicating rotation. Skin tone #D19E72 with warm near-black #22201D contour, knuckle and nail lines as simple single arcs, no rings, no watch, no nail polish. Hands occupy the lower third; the carton fills the center.
> [STYLE BLOCK] [NEGATIVE]
> Aspect 3:4.

**Illustrator brief:** This is the emotional center of the kids' book — the moment the reader's own hands are on the page. Everything depends on the crop reading as *the reader's* hands rather than someone else's: crop exactly at the wrist, angle the hands as they would appear looking down at your own, and keep them symmetrical. No age markers, no jewelry, no clothing. Produce the artwork once and output six versions, one per skin tone in §3.3, all identical apart from the fill and knuckle-line values. The curved arrow is the same arrow asset used in H3 — reuse it, don't redraw it.

---

### **H7 · S-304 — Two-up comparison hero (Pro Kit)**

**AI prompt:**
> Flat vector editorial diagram on warm cream #FBF7F0. Two food packages side by side, exactly the same size on the page, each drawn perfectly flat-on with no perspective, separated by a generous even gap with a single thin vertical hairline in stone #C3B8A6 between them. Left: a tall cereal carton in deep blue #23386B and warm yellow #F4B63F with an invented wordmark. Right: a cylindrical oats canister in oat #EDE4D6 and deep teal #1A6C69 with a different invented wordmark. Beneath each package, a clean white rectangular nutrition information panel with fine black horizontal rules and small black sans-serif text, both panels identical in size, position and structure. Perfectly symmetrical composition, equal visual weight left and right. No arrows between them, no checkmark, no cross, no highlight on either side, no winner.
> [STYLE BLOCK] [NEGATIVE]
> Aspect 3:2.

**Illustrator brief:** This is the layout that carries the whole brand argument, so read the constraint carefully: **the image must not indicate a preference.** Equal size, equal position, equal color weight, equal panel treatment, nothing circled, nothing ticked, nothing dimmed, nothing arrowed. The reader compares and the reader concludes. The moment one side gets a visual advantage, the product becomes a diet book. The panels are placed as live Arimo type in the vector file at true proportions — never as AI-generated raster, which will produce plausible-looking nonsense numbers, and every value comes from `01-FACTS`.

---

### **H8 · S-501 — The kitchen-table scene (sales page hero)**

**AI prompt:**
> Flat vector illustration on warm cream #FBF7F0, viewed straight down from directly overhead — a true top-down plan view with no perspective and no vanishing point. In the center, a single rectangular food package lying flat, drawn as a plain rectangle from above, in burnt orange #AD3F1B and oat #EDE4D6 with an invented wordmark. From the bottom edge of the frame, one pair of adult-scale hands reaching in, cropped at the wrists, skin tone #B07A4E. From the left edge, one pair of smaller child-scale hands reaching in, cropped at the wrists, skin tone #F3D6C0. One finger from each pair rests on the package. To the right of the package, a small oat-colored rounded-rectangle creature with a tally mark on its chest and a thin antenna topped with an orange dot, seated, one arm pointing at the package. Beside the package, an open workbook drawn as two plain cream rectangles with fine stone-colored rules. Warm, calm, unhurried. No faces, no bodies, no chairs, no room, no furniture, no floor, no table edge.
> [STYLE BLOCK] [NEGATIVE]
> Aspect 16:9.

**Illustrator brief:** This is the image that has to communicate the product's actual differentiator — parent and kid at the same table, at the same time, on the same package — in under one second on a sales page. The top-down plan view is what makes that possible without drawing a single face. Scale is the only thing distinguishing the adult hands from the kid hands; do not add sleeves, jewelry or any other age cue. The two hands touch the *same* package, which is the whole point. Keep the background completely empty — no table texture, no wood grain, no room. The emptiness is the premium signal.

---

## 8. ICON SET — 24 icons

### 8.1 Spec

| Property | Value |
|---|---|
| Grid | **24 × 24 px**, live area **20 × 20**, 2 px trim on all sides |
| Keyline shapes | Square 18×18 · Circle 20 dia · Portrait 16×20 · Landscape 20×16 |
| Stroke | **2 px** at 24 px. Scales to **1.5 pt** when printed at 18 pt. |
| Caps / joins | Round. Always. |
| Corner radius | **2 px** minimum; nothing sharper |
| Fill | **None.** Stroke only — except the three Amount Ladder glyphs (S-625), which are solid by definition. |
| Color | `--c-blueberry` `#23386B` on Paper. Mono variant `--c-ink`. Icons **never** take a track color, and never take an Amount Ladder color. |
| Alignment | All strokes snap to the pixel grid at 24 px; no half-pixel strokes |
| Optical sizing | Two masters: **24 px** (UI, inline) and **40 px** (the 10-Second Flip strip, posters). The 40 px master has proportionally *lighter* stroke (2.5 px at 40, not 3.3) so it doesn't go clubby. |
| Legibility floor | Must read at **16 px** on screen and **12 pt** in print. Test both before shipping. |
| Never | Filled shapes, two colors, gradients, drop shadows, a character's face, an emoji redraw, a diagonal-slash "no" symbol over any food |

### 8.2 The 24

| ID | Icon | Glyph description | Primary use |
|---|---|---|---|
| S-601 | **flip** | Rectangle with a curved arrow wrapping its right edge | The master icon. Step 1 everywhere. |
| S-602 | **panel** | Portrait rectangle with a heavy top rule and four fine rules | "Find the panel" |
| S-603 | **serving-size** | Shallow bowl with a bracket spanning its width | Serving size line |
| S-604 | **servings-per-container** | Three stacked cubes with a small multiplication cross | Servings per container |
| S-605 | **calories** | Rounded rectangle frame containing a heavy horizontal bar | Calories line |
| S-606 | **percent-dv** | Percent sign inside a circle | % Daily Value column |
| S-607 | **ingredients** | Three horizontal lines, each preceded by a short tick | Ingredient list |
| S-608 | **first-ingredient** | Numeral 1 with a small pennant flag | "What's first?" |
| S-609 | **total-sugars** | A cube drawn in cabinet projection | Total sugars line |
| S-610 | **added-sugars** | The same cube with a small plus at its upper-right | Added sugars line |
| S-611 | **sodium** | A shaker outline with three dots above it | Sodium line |
| S-612 | **fiber** | A three-strand braid | Dietary fiber line |
| S-613 | **protein** | Two circles joined by a short bar | Protein line |
| S-614 | **fat** | A single teardrop outline | Total fat line |
| S-615 | **saturated** | The teardrop with one straight internal stroke | Saturated fat |
| S-616 | **unsaturated** | The teardrop with one kinked internal stroke | Unsaturated fat |
| S-617 | **allergen-check** | Rounded triangle containing an exclamation | "Check this if it applies to you" — neutral, never alarm-red |
| S-618 | **compare** | Two portrait rectangles joined by a low bracket | The two-up comparison |
| S-619 | **look-closer** | Magnifier: circle plus a short angled handle | "Read it again" |
| S-620 | **ten-seconds** | Circle with a hand at 12 and a filled 10-of-60 arc | The 10-Second Flip |
| S-621 | **cart** | Simple cart outline, two wheels | Grocery-run assets |
| S-622 | **measure** | Measuring cup with a single fill line and a handle | Serving-size activities |
| S-623 | **ask** | Speech bubble with a question mark | "Ask a grown-up" / discussion prompts |
| S-624 | **checked** | Rounded square with a check stroke breaking the upper-right edge | Activity completion |

Plus **S-625**, the Amount Ladder glyph set — one, two and three solid upward triangles. These are the only filled icons in the system, they exist only inside an Amount chip, and they always appear with their word.

### 8.3 Icon QA checklist

Before any icon ships:
1. Renders legibly at 16 px and at 12 pt print.
2. Solid-black silhouette test: still identifiable.
3. 2 px stroke, round caps, no sharp corners under 2 px.
4. No fill, one color, no shadow.
5. Nothing in it could be read as approving or disapproving of a food.
6. Sits on the same optical weight as its neighbors in a row of six.

---

## 9. ASSET NAMING AND DELIVERY

```
02-BRAND/assets/
  characters/  tally-e1-front.svg  tally-e1-front.png  tally-e1-front.mono.svg
  spots/       S-204-hands-flip-box.svg  .png  .mono.svg
  icons/       S-601-flip-24.svg  S-601-flip-40.svg
  covers/      cover-parent-v3.svg
  patterns/    tally-scatter-tile.svg
```

- Filename = `S-###-kebab-case-description`.
- Every asset ships **SVG + 300 ppi PNG + `.mono` grayscale variant.** Flattened-only deliveries are rejected.
- SVG requirements: no open paths, no embedded raster except the sanctioned grain, no `<text>` elements (all type converted to outlines), viewBox present, no inline styles referencing colors outside the palette.
- Each asset carries a sidecar `.json`: `{ id, description, characters[], hand_tone, brands_depicted[], facts_cited[], theme_variants[] }`. `09-QA` reads this file to audit the hand-tone rotation, the fictional-brand usage, and the fact citations without opening the art.
