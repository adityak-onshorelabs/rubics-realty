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
| Display | wdth 80, wght 300, tracking -0.02em, lh 0.98, `clamp(2.6rem, min(1.6rem + 5.2vw, 0.75rem + 9.5svh), 6.5rem)` |
| Hero (home) | as Display, smaller so the film leads: `clamp(2.4rem, min(1.2rem + 3.6vw, 0.6rem + 6.6svh), 4.75rem)` |
| Board (directory names) | wdth 78, wght 300, lh 0.95, `clamp(2.5rem, min(1.4rem + 4.4vw, 0.9rem + 7.5svh), 5.5rem)` |
| Statement | wdth 90, wght 300, lh 1.16, `clamp(1.55rem, min(1rem + 2.1vw, 0.8rem + 3.6svh), 2.75rem)` |
| Numeral | wdth 75, wght 300, `tabular-nums lining-nums`, lh 0.9; sizes from 2.5 to 7rem |
| H2 | wdth 85, wght 350, lh 1.04, `clamp(2rem, min(1.4rem + 2.6vw, 1rem + 5svh), 3.5rem)` |
| Note (drawing annotation) | wdth 112, wght 500, 0.625rem, tracking 0.14em, uppercase |
| H3 | wdth 100, wght 500, lh 1.2, `clamp(1.25rem, 1.1rem + 0.6vw, 1.6rem)` |
| Lead | wdth 100, wght 350, 1.25rem, lh 1.5 |
| Body | wdth 100, wght 400, 1rem (17px on desktop), lh 1.6, max 66ch; on navy lh 1.7 |
| Label (engraved) | wdth 125, wght 500, 0.72rem, tracking 0.16em, uppercase |
| Level code | wdth 75, wght 500, tabular, 0.85rem, e.g. `L06` |

Scale ratio ≥ 1.25. No italics. No monospace.

## 4. Components

- **Datum header** (every section): a full-width hairline with a level marker at the start (`▽ L03`), an engraved label (`HOW WE BUILD`) and optional sheet meta at the far end (`PRINCIPLES 01 TO 03 OF 06`), then the H2 on a 12-column grid, asymmetric. The marker uses `--brass` on navy and `--brass-deep` on cream. The label wipes in and the hairline draws from the start.
- **Header**: 56px (64px from 1536px), transparent over the home film until the page moves, lacquer otherwise. Carries the phone number and a "Book a visit" outline button.
  - Desktop (1024px+): after 120px of scroll the full bar fades up and a floating brass-framed **pill** drops in (logo, Menu, the current page, Book a visit). Menu folds the five links out inside the pill (grid column 0fr to 1fr, links staggered); Escape, a click outside, a navigation or returning to the top folds it. It never hides, and the transparent bar lets clicks through to the page.
  - Below 1024px: a compact bar that tucks away while reading downwards and returns on any upward scroll (`--header-shift`); Menu opens the full-screen dialog.
- **Lift shaft** (`floor-rail.tsx`, from 1024px): the page's only vertical navigation, fixed on the left edge. Segments are as tall as their sections; passed floors fill with brass; the car carries the current level code and floor name. Every floor is a link, its label sliding out on hover or focus. It replaced both the header floor readout and the right-hand lift index. Below 1024px, project pages use the horizontal chip track (`lift-index.tsx`). Next keeps previous routes mounted but hidden, so both read only rendered sections.
- **Plate** (`plate.tsx`): an image presented as a numbered drawing plate, with printer's crop marks outside the frame, `Pl. 03` and a caption underneath, and the "Artist's impression" tag on renders. Frames are capped by viewport height so a plate never exceeds a laptop screen.
- **Title block** (`.tblock`): ruled cells, each with a tiny `t-note` label over a value, like the corner of a drawing sheet. Used for the home hero strip, BeauMonté facts, the visit band and press counts.
- **Inlay** (`.inlay`): a double brass hairline, the Deco metal strip set into stone. Sits above figures and schedules.
- **Step rule** (`StepRule`): a hairline broken by three stacked chevrons taken from the logo's "I". Ends a band.
- **Drawing sheet** (`build-drawing.tsx`, home "How we build"): the BeauMonté pencil elevation is the section's centrepiece, on a full-height sheet (7 of 12 columns, sticky on desktop) in the sketch's own paper colour (`--paper`). Sheet header (plate, project, "Not to scale"), a dimension string ("41 storeys") and ±0.00 ground datum outside the drawing, and a title block (storeys, residences per floor, acres). As the section arrives the tower draws in from the ground up and the storey count climbs to 41, scrubbed to scroll.
- **Plaque**: a framed brass-hairline box with chamfered corners. Used for the RERA number and the lift-door floor indicator. Plaques are never nested and never rounded.
- **Figures**: a ruled manifest line under an inlay (number, then a label underneath, separated by vertical hairlines), never as stat cards. Numerals roll like an odometer. Group figures carry an attribution note until the client confirms them.
- **Buttons**: square corners (radius 0), height 52px, label in engraved style. Primary (navy on cream, ivory on navy), outline, and text-with-arrow variants. On hover the brass bottom rule grows from the start; square arrow buttons fill and the arrow turns 45°.
- **Directory board** (projects): full-width lobby rows with tall condensed names (`t-board`), level code, locality, status, RERA and two facts. A navy wash slides in from the start on hover. Each row carries its own image in its own grid cell (a thumbnail column on wide screens, a full-width plate on small ones); nothing floats over content. Filter tabs are adapted from Watermelon `continuous-tabs`.
- **Section explorer** (signature, BeauMonté): an SVG tower section with a brass lift scrubber, adapted from Watermelon `scrub-slider` and turned vertical. It has `role="slider"`, arrow, Page and Home/End keys, clickable level bands and a live panel. Its width follows viewport height so the whole tower fits on a short laptop. Discoverability: on first view the lift rides itself from G to L24; until the first interaction the carriage shows a pulsing ring and bobbing up/down chevrons; hovered floors get a brass outline and their level code; "Jump to a stop" buttons (Crown, Residences, Level 7, E-Deck, Podium, Ground, Basement) ride the lift there floor by floor; an icon row states "Drag the brass lift / Tap any floor".
- **Unit tables**: RERA carpet tables with tabular numerals, right-aligned numbers, hairline rows, the unit number as a level-code tag, and a scale bar per row drawn to the largest home (carpet solid, balcony or terrace hatched).
- **Orientation key** (views): a site compass with the tower at its centre, sectors only for the published outlooks (West, North) and an elevation arrow for "Above". Labelled "Not to scale".
- **Route line** (location): key connections as a schematic transit line, stops in order of travel time at even spacing, labels alternating above and below. A vertical list on phones, which is also the accessible version.
- **Club directory** (amenities): a numbered two-column disclosure that animates `grid-template-rows`. Adapted from `faq-6`.
- **Visit picker**: day rows with times revealed for the selected day. Adapted from `slot-picker`. It records a *preferred* slot only, and the sales team confirms.
- **Map on request**: a button that loads the Google map iframe only when clicked. Adapted from `view-on-map`.
- **Back to top** (`scroll-top.tsx`): a round brass lift-call button, bottom-right, shown after one screen of scroll (above the mobile action bar on project pages). A brass ring fills with reading progress. Pressed, the page rides to the top on an ease-in-out-quint curve (1.1–2.4s by distance; Lenis on wheel devices, a native rAF ride on touch) while the arrow keeps launching upward, the ring drains and a "Going up" readout counts the floor codes down to G; a brass pulse marks arrival and focus moves to the main content. Hover shows "Back to the lobby". Reduced motion jumps straight to the top.
- Radii: 0 everywhere, except route-line stops. Shadows: none. Depth comes from navy and cream bands, hairlines, the lacquer grain and the travertine texture (`.stone`: faint horizontal veining and pits on cream bands).

## 5. Layout

- 12 columns, max width 1360px, gutters of 16px on mobile and 24px on tablet; from 1024px the start gutter is 64px (end 40px) to give the lift shaft its lane. The grid is not visible. The horizontal datum lines are the visible structure.
- Composition is asymmetric and left-aligned, and varies per section: a sticky drawing beside a scrolling list, a portrait plate beside a statement, a full-width directory, title-block strips. Headlines span 7 to 8 columns, copy 5 to 6 columns, offset.
- Sizes respond to viewport height as well as width (`min(… vw, … svh)` inside `clamp()`): display, H2, statement and section spacing (`clamp(3.5rem, 1.25rem + 3.2vw + 3svh, 8rem)`). Checked at 1280×720, 1366×768, 1920×1080, 2560×1440 and 390×844.
- Large monitors: from 1600px the root font size grows with the viewport (16px at 1600, about 18px at 1920, capped at 21px from 2560), so type, spacing and the 85rem frame scale together instead of leaving a small column of small text.
- Mobile first, with no horizontal page scroll (verified on every page at 360 and 390px). Horizontal tracks (chips, tabs, stops) scroll inside their own container and fade at the end edge (`.scroll-hint`) so it is clear there is more. Touch targets are at least 44px, including footer legal links and contact lines. The RERA table drops the saleable column below 640px so it fits without sideways scrolling. A sticky mobile action bar (Call, WhatsApp, Visit) appears on project pages.

## 6. Motion

Two layers, by client decision (Nov 2026, replacing the earlier native-scroll-only rule): **Lenis smooth scroll + GSAP ScrollTrigger** for scroll-linked motion, and a CSS reveal system for entrances. Easing is exponential out (`--ease-out-expo`, `--ease-out-quart`); the lift doors keep `--ease-lift`.

Smooth scroll (`smooth-scroll.tsx`): Lenis (`lerp 0.1`) eases wheel and trackpad only (touch stays native), driven by `gsap.ticker` so Lenis, ScrollTrigger and paint share one frame at any refresh rate. Anchors are smoothed with the header offset; inner scrollers, dialogs and the map opt out (`data-lenis-prevent`); Lenis stops while the mobile menu is open; each new route starts at the top and refreshes ScrollTrigger. Off under reduced motion.

Scrubbed effects (`scroll-fx.tsx`, `build-drawing.tsx`), each inside a reduced-motion `gsap.matchMedia` and reverted on unmount:
- `HeroScroll`: as a hero leaves, its media sinks 18% and enlarges to 1.08 while the copy lifts and dims (home film, BeauMonté lobby).
- `Parallax`: a plate's image drifts ±5% inside its frame (portraits, tower, pool, lobby, Three Sixty West). The media is oversized via `[data-parallax] .plate-media`.
- `Drift`: large display type slides sideways (visit band heading), with the band clipping horizontal overflow.
- Drawing sheet: tower clip-path rises from the ground, dimension string extends, storey count climbs.

Performance rules (jitter showed on a 164Hz monitor): nothing scroll-driven re-renders React or carries a CSS transition. Scroll position is written to the DOM once per frame (the lift shaft uses refs and transforms); `transform` on plate media belongs to GSAP, so the reveal settle uses the independent `scale` property; no blend modes on full-section texture layers.

Entrance reveals are declared in markup (`data-reveal="kind"`, delay via `--d`) and driven by one IntersectionObserver (`reveal-observer.tsx`), so server components carry no per-element JS. CSS in `globals.css` owns every animation. Kinds:

- `text` (`SplitText`): each word rises out of its own mask, staggered 34ms. Every headline uses it.
- `fade`: soft 18px rise. `stagger`: children in order (`--i`).
- `plate`: a curtain in the surface colour lifts so the image rises into its frame bottom-up, settling from 1.12 zoom.
- `wipe`: engraved labels revealed from the start edge. `line`: hairlines draw from the start. `draw`: SVG strokes (`pathLength=1`) draw on.
- `count` (`RollingNumber`): odometer digits roll up from zero; the real value is in the DOM for screen readers.

Rules:
- Hidden states apply only when JS is running (`html.js`, set inline before paint), never under reduced motion, and a 4s failsafe (`html.reveal-off`) shows everything if the observer never starts.
- Reveal elements carry `suppressHydrationWarning`, because `data-in` belongs to the observer, not React.
- Never put a hidden clip-path on the observed element itself: IntersectionObserver treats a fully clipped element as invisible. Clip its children, or cover it.

Moments:
- Home hero: the film plays full-bleed with a visible pause control; the short headline rises word by word, then the title-block strip and caption fade up.
- Page transition and loader: lift doors (Deco inset panels, brass kick rail, brass seam) close in 650ms. Over the seam sits the indicator housing, a solid brass-framed plaque, so the seam ends at its frame and never crosses text. Inside: logo, direction arrows, a rolling floor readout, the destination, a lamp row (G to 06) lit floor by floor at 150ms a floor, and a journey hairline that fills as the progress indicator, with an arrival pulse. Doors stay shut at least 700ms and until the journey has arrived and the page has painted, then open in 800ms; the arriving page's reveals play as they part.
- Section explorer: the scrubber follows the pointer directly and snaps to levels with a critically damped spring (no overshoot).
- `prefers-reduced-motion: reduce`: no smooth scroll, no scrubbed effects, everything renders in its final state, and the video does not load (the poster is shown).

## 7. Imagery

Only Rubics' own material:
- the Three Sixty West aerial (hero video with poster),
- BeauMonté renders (lobby, tower) and the pool deck,
- the pencil elevation sketches of BeauMonté and Lalbaug,
- black-and-white leadership portraits.

Renders carry a small "Artist's impression" tag (the `impression: true` flag in the content file). Images are presented as plates (see Components). The home hero shades only its bottom edge (behind the headline and strip) and a thin band at the top for the nav; the film itself stays clear. Scrims elsewhere are navy, bottom-up, and only behind text. The client's real photography (sales gallery, site progress, sample flat) is a launch ask.
