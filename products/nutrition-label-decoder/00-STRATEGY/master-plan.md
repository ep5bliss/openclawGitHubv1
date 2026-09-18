# MASTER PLAN — Nutrition Label Literacy Product
_Owner: Daniel "Lucky King" Martinez · Status doc · Last updated 2026-09-18_

## The short version
We are not making "a PDF about nutrition labels." We are making a **10-second decision
system** that a parent and a kid run together in a grocery aisle, packaged as a premium
print-at-home kit, launched off short-form video, and sold through a storefront the
creator owns.

The product's whole reason to exist fits on one line:
> **Most people don't misread the label. They never look at it, because nobody told them
> which 3 lines actually matter.**

That's the hook, the lead magnet, the first video, and the first page of the book.

---

## 1. The core teaching spine (everything is built on this)

The entire product is one mental model taught at three depths. This is what keeps it from
being another pile of worksheets.

**THE 10-SECOND READ** — a fixed, repeatable, 3-step sequence:

| Step | Question | Where you look | Why it's first |
|------|----------|----------------|----------------|
| 1 | "How many servings am I actually eating?" | Top of the panel | Every other number is a lie until this is settled |
| 2 | "What are the first three ingredients?" | Ingredient list | Descending by weight — this is the real recipe |
| 3 | "What's the one number I care about today?" | %DV column | Teaches decision-making, not memorization |

Three depths of the same model:
- **Ages 6–9** — "Serving Size Detective." Counting, matching, spotting. No math beyond
  doubling. Story and game driven.
- **Ages 10–13** — "Label Decoder." Real multiplication, real comparisons, real
  marketing-claim debunking. They start catching packages lying to them — which is the
  single most engaging thing you can hand a middle-schooler.
- **Parents** — the mechanism, the exceptions, the rounding rules, the claim thresholds,
  and — critically — **how to teach this without creating a kid with food anxiety.**

## 2. What ships (deliverable inventory)

### Core
| # | Asset | Format | Est. pages | Audience |
|---|-------|--------|-----------|----------|
| 1 | Parent Field Guide | PDF, print + screen | 40–55 | Parents |
| 2 | Kids Workbook — Ages 6–9 | PDF, print | 30–40 | Kids |
| 3 | Kids Workbook — Ages 10–13 | PDF, print | 35–45 | Kids |
| 4 | Answer keys | PDF | 8–12 | Parents |
| 5 | The 10-Second Read fridge poster | PDF, 8.5×11 + 11×17 + A4 | 1 | Both |

### Printables & tools
| # | Asset | Why it earns its place |
|---|-------|------------------------|
| 6 | Grocery Store Mission Cards (deck of 30) | Turns a chore into a game — this is the asset that gets photographed and shared |
| 7 | Sugar-in-Teaspoons visual conversion chart | The single most screenshot-able page in the product |
| 8 | "Decoder Ring" claim-translator card | Wallet/purse sized — "low fat" vs. what it legally means |
| 9 | Ingredient-list sugar alias hunt sheet | 60+ names for sugar, as a game |
| 10 | 30-Day Label Challenge calendar | Retention + a reason to come back daily |
| 11 | Blank label template + build-your-own-product activity | Best learning device in the whole kit |
| 12 | Certificate of completion | Costs nothing, drives completion + social posts |

### Multipliers
| # | Asset | Purpose |
|---|-------|---------|
| 13 | Video script pack (30 scripts) | The traffic engine |
| 14 | Lead magnet: one-page 10-Second Read card | Top of funnel |
| 15 | Sales page + 7-email sequence | Conversion |
| 16 | Teacher/classroom license edition | Highest-margin tier |
| 17 | Spanish edition | **El Paso.** This is not a nice-to-have — see §5 |

## 3. The three rules that protect the brand

1. **No good food / bad food. Ever.**
   We teach *reading*, not *restricting*. Any product in this category that moralizes food
   is one viral stitch away from a dietitian dragging it. Our defensibility IS our
   positioning: "the label literacy kit that doesn't make your kid scared of food."
2. **Every number traces to a primary source.** FDA, USDA, AAP. Cited in-product.
   A visible citations page is a *trust asset*, not a legal chore.
3. **No medical advice.** Educational framing only, disclaimer on the copyright page.

## 4. Production pipeline (how this actually gets made)

Content is authored as **Markdown + a design token system**, then rendered to print-ready
PDF by headless Chromium. Reasons this beats designing it in Canva:

- Regenerate all 5 books in ~30 seconds after any edit
- US Letter and A4 from one source — international sales with no rework
- Spanish edition = translate the markdown, re-run the build
- Version control on the whole product
- A price change or a rebrand is a token edit, not 200 manual pages

`08-BUILD/` holds the renderer. `02-BRAND/tokens.css` is the single styling source.

## 5. The El Paso / bilingual edge (unfair advantage — do not skip)

El Paso is ~80%+ Hispanic and functionally bilingual. A genuinely bilingual label-literacy
kit is:
- A **far** less competitive keyword set on Etsy/TPT than the English-only market
- Directly relevant to communities with elevated Type 2 diabetes prevalence — real need,
  real urgency, real word-of-mouth
- Instant differentiation in a market where the competition ships English-only clipart
- Locally credible content the owner can actually film in his own city

**Recommendation: the Spanish edition is a launch asset, not a v2.** It roughly doubles the
addressable market for maybe 15% more production effort given the pipeline above.

## 6. Content → video strategy (Entertain · Educate · Sell)

| Layer | Job | Format | Example |
|-------|-----|--------|---------|
| **Entertain the Masses** | Stop the thumb | "I let my 8-year-old grade my groceries" | Reaction, kid POV, shock-number reveals |
| **Educate the Interested** | Earn trust | "The rounding rule that lets a label print 0g when it isn't" | Single-mechanism teaching, one idea per video |
| **Sell to the Committed** | Convert | "The whole system my kids use — link in bio" | Product demo, printed pages on the table, results |

The kid-on-camera format is the moat. Nobody can copy his kids. Everyone can copy a PDF.

## 7. Build sequence

- **Phase 1 — Foundation** _(in progress)_: fact base, market/pricing, brand system
- **Phase 2 — Content**: parent guide, both workbooks, printables, answer keys
- **Phase 3 — Production**: render pipeline, illustrations, covers, QA
- **Phase 4 — Go-to-market**: sales page, emails, 30 video scripts, launch calendar
- **Phase 5 — Adversarial QA**: red-team every claim, every page, every price
- **Phase 6 — Spanish edition**

## 8. Open decisions (owner's call)

1. **Kids on camera?** Highest-performing format, but it's a real privacy decision.
   Alternative: hands-and-voice only, no faces — still works.
2. **Product name** — brand agent is generating candidates; final call is the owner's.
3. **Physical version?** POD workbook unlocks TikTok Shop if digital-only isn't allowed
   there. Strategy agent is verifying the policy.
4. **Niche down harder?** A diabetes-household or food-allergy edition would command a
   higher price and convert better, at the cost of volume.
