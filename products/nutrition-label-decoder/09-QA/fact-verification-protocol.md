# PRE-PUBLICATION FACT VERIFICATION PROTOCOL
_Status: MANDATORY before any paid version ships. Owner: Daniel Martinez._
_Created 2026-09-18._

## Why this document exists

The research for this product was done in a sandboxed session whose network egress policy
**blocked direct access to primary sources** — including `www.fda.gov`, which returned a
403 policy denial at 18:04 UTC on 2026-09-18. Web *search* worked; opening the actual
regulatory pages did not.

Practical consequence, stated plainly:

> Every nutrition figure in this product was assembled from search results and model
> knowledge, **corroborated across sources but not read off an FDA page.**

For most products that's an acceptable risk. For this one it is not, because the entire
value proposition is *"we will tell you what the label actually means."* A wrong Daily
Value in a paid product aimed at parents is the kind of error that gets stitched by a
dietitian with 400k followers and ends the brand.

**So: nothing ships until the table below is signed off against primary sources.**
This is a 2–3 hour job on an unrestricted machine. It is the highest-leverage
2–3 hours in the whole project.

---

## Stage 1 — Owner verification (you, ~2 hours, free)

Open each source on your own machine, confirm the value, screenshot it, and date it.
Screenshots go in `09-QA/evidence/`. Do not skip the screenshot — it is your defense if
anyone challenges a number publicly.

### 1A. Daily Values — the load-bearing numbers
These drive **every computed %DV in every panel in every book.** One wrong entry
propagates into hundreds of printed percentages.

Source: 21 CFR 101.9(c)(8)(iv) and FDA's Daily Value reference chart.

| Nutrient | Value used in build | Verified? | Screenshot | Date |
|---|---|---|---|---|
| Total Fat | 78 g | ☐ | | |
| Saturated Fat | 20 g | ☐ | | |
| Cholesterol | 300 mg | ☐ | | |
| Sodium | 2,300 mg | ☐ | | |
| Total Carbohydrate | 275 g | ☐ | | |
| Dietary Fiber | 28 g | ☐ | | |
| Added Sugars | 50 g | ☐ | | |
| Protein | 50 g | ☐ | | |
| Vitamin D | 20 mcg | ☐ | | |
| Calcium | 1,300 mg | ☐ | | |
| Iron | 18 mg | ☐ | | |
| Potassium | 4,700 mg | ☐ | | |
| Reference calorie level | 2,000 | ☐ | | |

These live in `08-BUILD/lib/daily-values.mjs`. **Correct that file and re-run the build —
never patch a percentage inside a book.** The whole point of computing them is that they
can only be wrong in one place.

### 1B. The claims that carry legal weight
Any of these stated wrong is a substantiation problem, not just an accuracy problem.

| Claim in the product | Verified? | Source | Date |
|---|---|---|---|
| The gram threshold below which trans fat may be declared as 0 | ☐ | | |
| "Low sodium" / "low fat" / "low saturated fat" thresholds | ☐ | | |
| "Good source of" vs. "excellent source of / high in" thresholds | ☐ | | |
| "Sugar free" and "no sugar added" definitions | ☐ | | |
| "Healthy" claim rule — current status and compliance date | ☐ | | |
| Front-of-package Nutrition Info Box rule — status and compliance date | ☐ | | |
| Number of major food allergens requiring declaration (incl. sesame) | ☐ | | |
| Dual-column labeling trigger thresholds | ☐ | | |
| FDA's exact published wording of the 5%/20% rule of thumb | ☐ | | |
| "Good source" UPPER bound for fiber — computed 5.3 g (19% of 28 g) vs. 5.5 g in the fact base | ☐ | | |
| Which four micronutrients are mandatory on the current panel | ☐ | | |

### 1C. Child-specific guidance
Source: AAP (healthychildren.org), AHA, Dietary Guidelines for Americans.

| Claim | Verified? | Source | Date |
|---|---|---|---|
| Added-sugar limit for children by age | ☐ | | |
| Under-2 added-sugar guidance | ☐ | | |
| AAP guidance on discussing food and weight with children | ☐ | | |
| Eating-disorder-prevention guidance on food labeling language | ☐ | | |

### 1D. Platform policy (separate risk, same discipline)
The monetization research could not open TikTok Seller Center either.

| Item | Verified? | Screenshot | Date |
|---|---|---|---|
| TikTok Shop US Prohibited Products Policy — digital goods | ☐ | | |
| TikTok Shop Virtual Goods requirements and eligibility | ☐ | | |

Screenshot these. If you ever get an enforcement action, dated screenshots of the policy
you read are the difference between an appeal and a dead account.

---

### 1E. Known open deltas

Two things the research flagged as unresolved. Both are in a kids' product, so both matter.

1. **The Dietary Guidelines added-sugar age threshold contradicts itself across sources.**
   Peer-reviewed and university sources say avoid added sugars *birth through age 10*;
   an HHS-sourced summary said *age 4 and under*. Both cannot be true.
   **Standing instruction: no age number is printed anywhere in the product** until
   someone opens the 2025–2030 Dietary Guidelines document itself and settles it.
2. **"Good source" upper bound for fiber.** 19% of a 28 g DV computes to 5.3 g; the fact
   base states 5.5 g. The "high fiber" threshold (5.6 g) is confirmed by both. Resolve the
   upper bound against 21 CFR 101.54 before printing either figure.

Also worth knowing, and worth a video: **the 2025–2030 Dietary Guidelines did NOT change
the label.** They moved added sugars to a ≤10 g per-meal framing, but the Added Sugars
Daily Value is still 50 g and every %DV on every package is still computed from 50 g.
Changing that requires FDA rulemaking that has not happened. Any copy implying the label
changed would be false.

---

## Stage 2 — Registered Dietitian review (paid, $300–800, non-negotiable)

Hire an RD to review the full manuscript before launch. This buys three things:

1. **Error insurance** on anything Stage 1 missed.
2. **A credential on the cover.** The nearest comparable product on Amazon puts "MScN"
   in the author name. You are a creator and a part-time realtor. In a category where
   parents have been burned by wellness grifters, a reviewing RD's name is not vanity —
   it is the single cheapest conversion asset available to you.
3. **A defensible answer** the first time someone comments "who are you to teach this?"

Brief the RD specifically on:
- Every number in `01-FACTS/nutrition-fact-base.md`
- The framing rules — confirm nothing in the manuscript could contribute to disordered
  eating or food anxiety in a child
- The disclaimer language

Get permission in writing to use their name and credential, and agree what the byline says
("Reviewed by ___, RD" — not "written by," don't overstate it).

---

## Stage 3 — Build-level checks (automated, run before every release)

- [ ] `npm run build` completes with zero `build-error` blocks in the output HTML
- [ ] Every `nutrition-label` panel has a `caption` marking it as representative
- [ ] No real brand name appears in any panel or example
- [ ] No banned word appears anywhere (run the brand system's banned-words list as a grep)
- [ ] Every PDF renders legibly in **grayscale** — print one chapter on a home inkjet
- [ ] Disclaimer page present in every book
- [ ] Citations page present and every cited URL resolves

---

## Standing rule

Any number that cannot be traced to a primary source **does not go in the product.**
Cut it or soften it to a qualitative statement. A product with fewer numbers and zero
errors outsells a product with more numbers and one famous mistake.
