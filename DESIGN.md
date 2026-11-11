# Design System: Rubics Realty

## 1. Visual Theme & Atmosphere

**The lift lobby: a brass floor indicator read against the tower's section drawing.**

The site reads like a Mumbai Art Deco lift lobby: navy lacquer walls, a brass floor indicator above the doors, and cream travertine underfoot. It is laid out like an architect's section drawing, with every section a "floor" sitting between two datum lines and carrying a level code.

The Rubics logo already replaces the "I" with stacked upward chevrons, which is literally floors rising, and the system extends that idea. Navy is committed across brand moments, cream carries reading, and brass is only ever a line or a numeral. Imagery is Rubics' own: pencil elevation sketches, project renders, black-and-white portraits, and the Three Sixty West aerial.

Scene: a Mumbai family or NRI buyer opens a WhatsApp link on a phone in the evening, then revisits on a laptop with a spouse to compare floors. Mixed theme: navy for brand bands, cream for reading. There is no user-toggled dark mode.

## 2. Color Palette & Roles

Strategy: **Committed navy.** Navy covers roughly 40 to 55 percent of the surface: the hero, the directory, project bands and the footer. Cream is the reading surface. Brass stays at or under 8 percent.

Named reference: an Art Deco lift lobby on Marine Drive. This is the category's first-order reflex (navy and gold), kept deliberately because it is the client's identity. It avoids looking generic by using brass only as line and numeral: no gold gradients, no gold fills, no script.

| Token | OKLCH | Role |
|---|---|---|
| `--lacquer` | `oklch(0.2 0.045 266)` | Deepest navy: hero, footer, directory. |
| `--navy` | `oklch(0.27 0.06 262)` | Brand bands. Close to the existing BeauMonté #162444. |
| `--navy-2` | `oklch(0.32 0.06 262)` | Raised navy: hover rows, plaques on navy. |
| `--travertine` | `oklch(0.955 0.018 85)` | Page background (cream). |
| `--travertine-2` | `oklch(0.92 0.028 82)` | Alternate bands, table zebra, inputs. |
| `--graphite` | `oklch(0.25 0.03 262)` | Body text on cream. |
| `--graphite-muted` | `oklch(0.45 0.025 262)` | Secondary text on cream (AA). |
| `--ivory` | `oklch(0.95 0.015 85)` | Text on navy. |
| `--ivory-muted` | `oklch(0.78 0.02 262)` | Secondary text on navy (AA). |
| `--brass` | `oklch(0.77 0.115 75)` | Numerals, rules, focus on navy. Sampled from the logo gradient (#CD9443 to #EEB757). |
| `--brass-deep` | `oklch(0.5 0.09 70)` | Brass as text or rule on cream (AA). |
| `--datum` / `--datum-navy` | `oklch(0.82 0.02 80)` / `oklch(0.38 0.045 262)` | Hairlines on cream and on navy. |
| `--accent` | BeauMonté `oklch(0.6 0.15 38)` (on cream use `--accent-deep` `oklch(0.52 0.15 36)`) | Per-project accent. Used only inside that project: tags, the active level, large type. |

Rules:
- No pure black or white.
- Gradients appear only as photo scrims (navy, bottom-up).
- Brass never fills a button. The primary button on navy is ivory with navy text, and on cream it is navy with ivory text. Brass is the focus ring and the hover rule.
- Contrast is verified with `contrast.py` (see the README for the lowest ratios).

## 3. Typography

Family: **Mona Sans** (variable: `wdth` 75 to 125, `wght` 200 to 900), used as one deliberate family.

Width carries the concept. Condensed means tall, so lift readouts, numerals and towers use it. Wide and tracked reads as engraved, so plaque labels use it. Normal width is for reading.

Rejected: Cinzel and Josefin Sans (the ui-ux-pro-max real-estate default), Cormorant (BeauMonté's current font and on the impeccable reject list), and Playfair. The editorial italic-serif lane is out.

| Role | Setting |
|---|---|
| Display | wdth 80, wght 300, tracking -0.02em, lh 0.98, `clamp(2.75rem, 1.6rem + 5.2vw, 6.5rem)` |
| Numeral | wdth 75, wght 300, `tabular-nums lining-nums`, lh 0.9; sizes from 2.5 to 7rem |
| H2 | wdth 85, wght 350, lh 1.05, `clamp(2rem, 1.4rem + 2.6vw, 3.5rem)` |
| H3 | wdth 100, wght 500, lh 1.2, `clamp(1.25rem, 1.1rem + 0.6vw, 1.6rem)` |
| Lead | wdth 100, wght 350, 1.25rem, lh 1.5 |
| Body | wdth 100, wght 400, 1rem (17px on desktop), lh 1.6, max 66ch; on navy lh 1.7 |
| Label (engraved) | wdth 125, wght 500, 0.72rem, tracking 0.16em, uppercase |
| Level code | wdth 75, wght 500, tabular, 0.85rem, e.g. `L06` |

Scale ratio ≥ 1.25. No italics. No monospace.

## 4. Components

- **Datum header** (every section): a full-width hairline with a level marker at the start (`▽ L03`) and an engraved label (`HOW WE BUILD`), then the H2 on a 12-column grid, asymmetric. The marker uses `--brass` on navy and `--brass-deep` on cream.
- **Plaque**: a framed brass-hairline box with chamfered corners (`clip-path` 8px). Used for the RERA number, contact facts and key figures. Plaques are never nested and never rounded.
- **Figures**: presented as a ruled manifest line (number, then a label underneath, separated by vertical hairlines), never as stat cards. Group figures carry an attribution note until the client confirms them.
- **Buttons**: square corners (radius 0), height 52px, label in engraved style. Primary (navy on cream, ivory on navy), outline, and text-with-arrow variants. On hover the brass bottom rule grows from the start.
- **Floor readout** (header): a small brass-framed window showing `L00`. It updates by IntersectionObserver as sections pass, the digits roll vertically like a lift indicator, and it is `aria-hidden` (decorative).
- **Directory board** (projects): a lobby directory with rows of level code, project, neighbourhood, status, RERA and an arrow. The row hover is `--navy-2` with the brass rule. Filter tabs are adapted from Watermelon `continuous-tabs`.
- **Section explorer** (signature, BeauMonté): an SVG tower section with a brass lift scrubber, adapted from Watermelon `scrub-slider` and turned vertical. It has `role="slider"`, arrow, Page and Home/End keys, clickable level bands and a live panel. Details are in the component header.
- **Lift index** (BeauMonté section nav): a column of round lift buttons with level codes, whose label reveals by clip-path. Adapted from `vertical-tooltip-navbar`. On mobile it becomes a horizontal chip track.
- **Club directory** (amenities): a numbered two-column disclosure that animates `grid-template-rows`. Adapted from `faq-6`.
- **Visit picker**: day rows with times revealed for the selected day. Adapted from `slot-picker`. It records a *preferred* slot only, and the sales team confirms.
- **Map on request**: a button that loads the Google map iframe only when clicked. Adapted from `view-on-map`.
- **Tables**: RERA carpet tables use tabular numerals, right-aligned numbers, hairline rows and the unit number as a level-code style tag.
- Radii: 0 everywhere, except round lift buttons. Shadows: none. Depth comes from navy and cream bands and hairlines.

## 5. Layout

- 12 columns, max width 1360px, gutters of 16px on mobile, 24px on tablet and 40px on desktop. The grid is not visible. The horizontal datum lines are the visible structure.
- Composition is asymmetric and left-aligned. Headlines span 7 to 8 columns, copy 5 to 6 columns, offset.
- Vertical rhythm: sections are separated by `clamp(5rem, 3rem + 6vw, 9rem)`, inner groups by 1.5 to 2.5rem.
- Mobile first, with no horizontal page scroll. Horizontal tracks (chips, tabs) scroll inside their own container. A sticky mobile action bar (Call, WhatsApp, Visit) appears on project pages.

## 6. Motion

Library: Motion (`motion/react`). Native browser scroll only, with no scroll hijacking, no smooth-scroll libraries and no GSAP.

- Hero: the headline lines rise 14px (transform only, so content is always painted), staggered 70ms, with lift easing `cubic-bezier(0.65, 0, 0.35, 1)`.
- Sections: `whileInView` fade plus a 10px rise, once.
- Numerals: the floor readout digits roll vertically at 280ms. Counts are server-rendered at their final value.
- Section explorer: the scrubber follows the pointer directly and snaps to levels with a critically damped spring (no overshoot).
- `prefers-reduced-motion: reduce`: everything renders in its final state, and the video does not autoplay (the poster is shown).

## 7. Imagery

Only Rubics' own material:
- the Three Sixty West aerial (hero video with poster),
- BeauMonté renders (lobby, tower) and the pool deck,
- the pencil elevation sketches of BeauMonté and Lalbaug,
- black-and-white leadership portraits.

Renders carry a small "Artist's impression" tag (the `impression: true` flag in the content file). The AI and stock lifestyle images from the old site are dropped. Photos have hard edges and bleed to the grid edge. Scrims are navy, bottom-up, and only behind text. The client's real photography (sales gallery, site progress, sample flat) is a launch ask.
