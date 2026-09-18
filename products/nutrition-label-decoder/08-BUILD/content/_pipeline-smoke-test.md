---
title: "Pipeline Smoke Test"
subtitle: "Exercises every component in the build system"
eyebrow: "Internal"
ages: "Build verification"
byline: "Not for distribution"
audience: parent
---

# Component Check

This page exists to prove the renderer works. Every teaching component appears below.

::: key-idea The 10-Second Read
Servings first. Then the first three ingredients. Then the one number that matters today.
:::

::: try-it
A label says 12g of added sugars. That's {{tsp:12}}. Write what you'd expect: {{blank}}
:::

::: myth Myth: "0g trans fat" means none
Rounding rules allow a declared zero below a threshold. Fill in your guess: {{blank:short}} grams.
:::

::: parent-note
This is where we give the parent the mechanism without the lecture.
:::

::: aisle
Pick up two boxes of the same thing. Compare only the serving size first.
:::

::: heads-up
Never frame a food as "bad." We teach reading, not restricting.
:::

::: activity
Build your own label on the blank panel below.
:::

::: kid-voice
Whoa. That box is *three* servings? Who eats one third of a box?
:::

## A live panel with teaching bands

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
  "ingredients": "Whole grain oats, sugar, salt, tripotassium phosphate.",
  "caption": "Representative example. Not a specific product."
}
```

## A blank panel for activities

```nutrition-label blank
{}
```

## A standard table

| Step | Question | Where |
|------|----------|-------|
| 1 | How many servings? | Top of panel |
| 2 | First three ingredients? | Ingredient list |
| 3 | Which number today? | %DV column |

::: answer
Step 1 is always servings. Everything else is meaningless until that's settled.
:::
