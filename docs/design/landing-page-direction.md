# Landing page — design direction & evidence contract

Skill: `frontend-design-direction` (project-local), applied at the user's explicit request.
Surface: `src/components/PublicLandingPage.tsx` — the signed-out marketing page.

## 1. Direction

| Question | Answer |
| --- | --- |
| **Purpose** | Convert a visiting learner into starting a 5-minute spoken lesson. |
| **Audience** | Self-directed adults who want usable spoken language fast. They scan for three things: *is this a real product*, *did someone else use it*, *can I start without signing up*. |
| **Tone** | Quiet, technical, confident — a training instrument, not a hype page. Restraint over decoration. |
| **Memorable detail** | The hero contains the **actual lesson surface** — a real phrase card with audio, phonetic, English meaning and progress. The product is visible before any claim is made about it. |
| **Constraints** | React 19 + Tailwind v4, no new dependencies, dark base `#070b14`, indigo primary, emerald reserved for progress/success. Mobile-first at 390×844. Existing routes and handlers unchanged. |

### Colour direction

Two hue families, not one: **indigo** for action and structure, **emerald** for progress and confirmation, **amber** for a single attention accent (streak/announcement). No gradient text, no gradient buttons, no glow blobs.

## 2. Hierarchy (first viewport)

1. Product name + one-line claim (what it does, for whom).
2. The live lesson card — the thing the visitor would use.
3. Primary action: *Get Started*.
4. Secondary: sign in · guest.
5. Supporting proof (offline, no account needed) below the fold.

## 3. Target viewports

`["390x844", "1440x900"]`

## 4. Content states

The landing page is static marketing: it loads no remote data before sign-in, so several states legitimately do not apply. That is recorded rather than silently skipped.

| State | Applies? | Check / reason |
| --- | --- | --- |
| Loading | No | Static page, no async fetch before sign-in. Button feedback while auth is in flight is handled in `AuthModal`. |
| Empty | No | No collections or lists on this surface. |
| Error | No | No network call is made by the page itself. Auth errors surface inside `AuthModal`. |
| Partial | No | Nothing is fetched progressively. |
| Success | Yes | Primary action opens the registration modal; visible feedback is the modal's focus and its "Create Your Learner Account" heading. |
| Permission | No | No account is required to read the page; guest entry is offered explicitly. |

## 5. Anti-patterns found and removed

| Found | Action |
| --- | --- |
| Gradient banner (`from-indigo-900 via-indigo-600 to-sky-700`) | Replaced with a flat strip and hairline border |
| Two decorative blur blobs (700×400, 350×300) | Removed |
| Gradient-clipped headline text (`bg-clip-text`) | Solid text |
| Gradient CTA (`from-indigo-600 to-indigo-500`) | Solid indigo |
| 7xl hero type competing with the message | 4xl → 5xl responsive scale, tighter tracking |
| Vague hero copy ("Battle-Tested Methodology") | Grounded copy; the claim now sits under a visible product |
| Product hidden behind marketing sections | Lesson card placed in the first viewport |

## 6. Rendered finish gate

Not satisfied by this change. The gate requires screenshots at both target viewports; this environment has no browser. See `docs/design/evidence/README.md` for the two captures needed and the command to run afterwards.
