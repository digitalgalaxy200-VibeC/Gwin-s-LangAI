# Landing page — rendered evidence

The `frontend-design-direction` skill's finish gate requires **rendered** inspection at
each target viewport. This environment has no browser, so the gate is **not** satisfied
yet. Nothing here should be marked `pass` until you have actually looked.

Target viewports (from `docs/design/landing-page-direction.md`):

- `390x844` — phone, default FR/EN copy
- `1440x900` — desktop

## What to capture

1. Start the dev server: `npm run dev`
2. Open `http://localhost:5173` in a **private window** (so you land on the landing page)
3. DevTools → device toolbar → set **390 × 844**, capture the full page
4. Set **1440 × 900**, capture the full page
5. Save both into this folder as `shot-390x844.png` and `shot-1440x900.png`
6. Repeat step 3 with the language toggle set to **FR**, to confirm the longer copy fits

## What to check while you are there

| Check | What "pass" looks like |
| --- | --- |
| First viewport | Product name, claim, drill card and *Get Started* all visible without scrolling |
| Focus | `Tab` reaches every button with a visible ring |
| Contrast | Body copy legible on `#070b14`; the amber banner tag readable |
| Touch targets | Hero buttons ≥ 44px tall at 390px |
| Narrow copy | No horizontal scroll with FR copy at 390px |
| Drill card | Volume button audibly speaks the French phrase |
| Motion | No animation that hides slow load |

## Then run the gate

```sh
node .agents/skills/frontend-design-direction/scripts/check-evidence.js \
  docs/design/evidence/report.json
```

Copy `report.template.json` to `report.json`, replace every `<fill …>` and the two
artifact filenames, then run the command above. It prints
`Evidence record complete; visual correctness still requires rendered inspection.`

The checker validates the record's shape and that the artifacts exist. It cannot tell
whether your observations are true, and a passing record does not replace looking at the
page.
