/**
 * FDA Daily Values (DV) used to compute the %DV column on a Nutrition Facts panel.
 *
 * SOURCE OF TRUTH: `01-FACTS/nutrition-fact-base.md` §B. Every value below was
 * independently confirmed there at [HIGH] confidence against FDA's Daily Value
 * reference chart and 21 CFR 101.9(c)(8)(iv).
 *
 * Reference population: adults and children 4+ years. FDA publishes three other DV sets
 * (children 1-3, infants, pregnancy/lactation) which this product deliberately does NOT
 * use — see the fact base, gaps #2 and #3.
 *
 * !! BEFORE PRINT: these are corroborated, not read off an FDA page — this session's
 * egress policy blocked fda.gov. Sign off `09-QA/fact-verification-protocol.md` §1A first.
 *
 * Changing a value here re-propagates through every computed percentage in every book.
 * Never hand-edit a percentage inside a manuscript.
 */
export const DAILY_VALUES = {
  totalFat:      { dv: 78,   unit: 'g'   },
  saturatedFat:  { dv: 20,   unit: 'g'   },
  transFat:      { dv: null, unit: 'g'   }, // no DV established
  cholesterol:   { dv: 300,  unit: 'mg'  },
  sodium:        { dv: 2300, unit: 'mg'  },
  totalCarb:     { dv: 275,  unit: 'g'   },
  fiber:         { dv: 28,   unit: 'g'   },
  totalSugars:   { dv: null, unit: 'g'   }, // no DV established — deliberate
  addedSugars:   { dv: 50,   unit: 'g'   },
  protein:       { dv: 50,   unit: 'g'   }, // %DV declaration is voluntary
  vitaminD:      { dv: 20,   unit: 'mcg' },
  calcium:       { dv: 1300, unit: 'mg'  },
  iron:          { dv: 18,   unit: 'mg'  },
  potassium:     { dv: 4700, unit: 'mg'  },
};

/** Reference calorie level the %DV column is based on. */
export const REFERENCE_CALORIES = 2000;

/**
 * Compute %DV, rounded to the nearest whole percent per FDA convention.
 * Returns null when no DV is established (trans fat, total sugars) or the value is absent.
 */
export function percentDV(nutrientKey, amount) {
  const entry = DAILY_VALUES[nutrientKey];
  if (!entry || entry.dv == null || amount == null || Number.isNaN(amount)) return null;
  return Math.round((amount / entry.dv) * 100);
}

/**
 * FDA's "5/20 rule" of thumb: 5% DV or less is low, 20% DV or more is high.
 * Returned as a neutral band name — the product deliberately avoids good/bad framing.
 */
export function dvBand(pct) {
  if (pct == null) return 'none';
  if (pct <= 5) return 'low';
  if (pct >= 20) return 'high';
  return 'moderate';
}

/** Grams of sugar -> teaspoons. 1 tsp granulated sugar ≈ 4.2 g; the label-teaching
 *  convention rounds to 4 g. We keep both so the book can show the honest math. */
export const GRAMS_SUGAR_PER_TSP = 4.2;
export const GRAMS_SUGAR_PER_TSP_TEACHING = 4;

export function sugarToTeaspoons(grams, { teaching = true } = {}) {
  if (grams == null) return null;
  const per = teaching ? GRAMS_SUGAR_PER_TSP_TEACHING : GRAMS_SUGAR_PER_TSP;
  return Math.round((grams / per) * 10) / 10;
}

/**
 * Nutrient content claim thresholds, expressed as %DV per 21 CFR 101.54.
 *
 * NOTE — this is a genuine product differentiator. Because "good source" and "high" are
 * defined as PERCENTAGES of the DV, the gram cutoffs moved when DVs changed in 2016.
 * Fiber is the clearest case: most consumer articles still print the pre-2016 figures of
 * 2.5 g / 5 g, but against the current 28 g DV the real cutoffs are 2.8 g and 5.6 g.
 * See `01-FACTS/nutrition-fact-base.md` §G.
 */
export const CLAIM_THRESHOLDS = { goodSourceMinPct: 10, goodSourceMaxPct: 19, highMinPct: 20 };

/** Grams of a nutrient needed to legally qualify for a "good source" / "high" claim. */
export function claimThresholdGrams(nutrientKey) {
  const entry = DAILY_VALUES[nutrientKey];
  if (!entry || entry.dv == null) return null;
  const at = (pct) => Math.round((entry.dv * pct / 100) * 10) / 10;
  return {
    goodSourceMin: at(CLAIM_THRESHOLDS.goodSourceMinPct),
    goodSourceMax: at(CLAIM_THRESHOLDS.goodSourceMaxPct),
    high: at(CLAIM_THRESHOLDS.highMinPct),
    unit: entry.unit,
  };
}
