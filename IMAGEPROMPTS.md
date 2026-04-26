# Illustration Prompts for the Kerygma Codex Website

Each slot has a target file path, dimensions, role on the site, and a detailed prompt for image generation via ChatGPT (DALL-E), Midjourney, or Ideogram.

---

## Visual Register (applies to all illustrations)

> Use this preamble at the start of every prompt:

**Base style preamble:**
> *Abstract, contemplative, illustrative vector art. Style references: Byzantine iconography geometry, sacred geometry, illuminated manuscript border motifs. Palette: warm ivory (#FAF7F2), deep charcoal (#1C1F2A), warm gold and amber (#C28840, #E8C98A), muted sage-green (#7A9E9F), dusty rose (#C4A99A). No human figures. No text, letters, or numerals. No photographic elements. No harsh primaries or neon. Mood: still, healing, gentle, inviting — never austere or clinical. High contrast between gold motifs and ivory background.*

**Technical requirements:**
- SVG preferred (scalable, small file size). PNG acceptable at 1600 px minimum width.
- Landscape orientation matching each slot's aspect ratio (see below).
- Save as the exact filename specified.

---

## 1. Hero Illustration

**File:** `src/assets/images/illustrations/hero/home-hero.svg`
**Dimensions:** 800 × 500 px (1.6:1)
**Used on:** Home page hero — right column, large and prominent
**Mood:** Threshold. An invitation to enter. Wholeness at rest.

### Prompt

[Base style preamble above, then:]

A large mandorla (vesica piscis) centred on a warm ivory field. Two overlapping circles of equal radius, rendered as fine gold lines, form the vesica. Within the vesica: a thin cruciform cross (equal-armed), also in gold, very lightly filled. Radiating outward from the mandorla: seven concentric rings that grow progressively more transparent with distance, suggesting expansion rather than containment. In the four corners: very faint Byzantine geometric ornament — interlaced knotwork or simple compass-rose fragments — barely perceptible against the background. The overall composition should feel like a portal or a breath being taken in. Wide horizontal format. Gold motifs on ivory. No colour fills except gold amber tints.

---

## 2. Practices Section Illustration

**File:** `src/assets/images/illustrations/sections/practices.svg`
**Dimensions:** 600 × 400 px (3:2)
**Used on:** Practices listing page hero, Practice individual page headers
**Mood:** Embodied participation. Layered engagement. Living rhythm.

### Prompt

[Base style preamble above, then:]

A composition of seven concentric circles in warm gold on ivory, each ring subtly distinct in weight (innermost heaviest, outermost lightest). Between the third and fourth ring: a dashed ring in muted sage-green, suggesting a living threshold. At the centre: a small equal-armed cross, softly filled with amber. At 12, 3, 6, and 9 o'clock positions along the outermost ring: four small teardrop or flame shapes in gold, suggesting participation or approach. The composition should feel like a practice space — circular, centred, gently energised. Horizontal format.

---

## 3. Foundation Section Illustration

**File:** `src/assets/images/illustrations/sections/foundation.svg`
**Dimensions:** 600 × 400 px (3:2)
**Used on:** Foundation listing page hero, Foundation document page headers
**Mood:** Stability. Architecture. The grammar beneath everything.

### Prompt

[Base style preamble above, then:]

A Byzantine architectural abstraction on an ivory field: three vertical gold pillar-lines of unequal height (tallest at centre), linked by three horizontal beam-lines forming a grid. Above the pillar tops: a single arch (pointed or rounded, slightly Byzantine) spanning the three pillars, in fine gold line. At the intersection of the centre pillar and the middle beam: a small equal-armed cross. The grid lines fade gently toward the edges. In the background at very low opacity: a faint pattern of interlocked diamond or square forms — Byzantine cosmateque floor geometry. Deep and quiet. Horizontal format.

---

## 4. Case Studies Section Illustration

**File:** `src/assets/images/illustrations/sections/case-studies.svg`
**Dimensions:** 600 × 400 px (3:2)
**Used on:** Case Studies listing page hero, Case Study individual page headers
**Mood:** Individual journeys. Pastoral encounter. Stories converging toward healing.

### Prompt

[Base style preamble above, then:]

Five graceful arcs in gold and dusty rose on an ivory field, each beginning at a different point on the lower edge and converging toward a single small circle of amber glow near the upper-centre. Each arc is slightly different in weight and curvature — suggesting distinct lives and distinct paths. The convergence point has a soft radiant halo (no hard edge — just a warm ambient glow). Between the arcs: very faint, thin horizontal lines, like still water. The overall composition should feel like five individuals being gently drawn toward the same healing centre. Horizontal format.

---

## 5. Rule of Life Section Illustration

**File:** `src/assets/images/illustrations/sections/rule-of-life.svg`
**Dimensions:** 600 × 400 px (3:2)
**Used on:** Rule of Life listing page hero, Rule of Life individual page headers
**Mood:** Seasonal rhythm. Return. Integration over time. A garden of chapels.

### Prompt

[Base style preamble above, then:]

A golden-ratio spiral (Fibonacci / nautilus form) on an ivory field, rendered as a continuous fine gold line beginning at the centre and expanding outward. The spiral is composed of quarter-circles nested in golden-ratio rectangles. At the four cardinal turning points of the spiral: small circle-dot markers in amber, suggesting the four seasons or liturgical quarters. At the spiral's centre: a tiny equal-armed cross. In the background at very low opacity: a faint geometric grid of golden-ratio rectangles suggesting the mathematical structure beneath the organic form. Calm and cyclical. Horizontal format.

---

## 6. About Section Illustration

**File:** `src/assets/images/illustrations/sections/about.svg`
**Dimensions:** 600 × 400 px (3:2)
**Used on:** About page (potential future use)
**Mood:** Commons. Shared language. Open hands. A protected garden.

### Prompt

[Base style preamble above, then:]

Three overlapping circles forming a trefoil (Borromean ring arrangement) on an ivory field. Two circles in warm gold line, one in muted sage-green line. Where two circles overlap: a soft amber tint fill at very low opacity. Where all three overlap at centre: a small equal-armed cross in gold. Around the trefoil at a distance: a fine circular border — like a garden wall — suggesting protected space. In the four spaces outside the circles but inside the border: very small botanical motifs (three-petalled forms, simple leaf shapes) barely visible against the ivory. The mood should feel like a protected commons — open but guarded. Horizontal format.

---

## 7. Mandorla Section Divider

**File:** `src/assets/images/illustrations/decorative/mandorla.svg`
**Dimensions:** 400 × 80 px (5:1 — wide, very narrow)
**Used on:** Between sections as a decorative divider element
**Mood:** Threshold. A breath between one thing and another.

### Prompt

[Base style preamble above, then:]

A very wide, very narrow composition (landscape strip format, 5:1 ratio). Centred: a slim horizontal vesica piscis (mandorla on its side) in fine gold line, filled with a whisper of amber at near-zero opacity. Flanking the mandorla on each side: a single fine horizontal rule in border-beige, tapering to nothing at the edges (the line fades out). The entire composition should feel like a single held breath — a delicate golden lens between sections. Minimal. No other elements.

---

## 8. Cross Section Divider

**File:** `src/assets/images/illustrations/decorative/cross-divider.svg`
**Dimensions:** 400 × 80 px (5:1 — wide, very narrow)
**Used on:** Between sections as a decorative divider element (alternative to mandorla)
**Mood:** Cruciform. A gentle pause.

### Prompt

[Base style preamble above, then:]

A very wide, very narrow composition (landscape strip format, 5:1 ratio). Centred: a small, fine equal-armed cross in gold (arms equal length, slightly rounded ends — not a Latin cross). On each side of the cross: a single fine horizontal rule in border-beige that tapers to nothing at the far edges. The cross is proportionally small relative to the full width — it should feel like a delicate marker, not a dominant symbol. No background fill, or the palest ivory. Minimal.

---

## Generation Tips

- **For SVG output:** Ask the tool to generate clean, geometric SVG code with minimal paths and no embedded rasters. Ideogram and some versions of ChatGPT can output SVG directly.
- **For PNG output:** Generate at 1600 px width minimum. Convert to SVG later using Inkscape (Path → Trace Bitmap for vectorising) or accept PNG.
- **Consistency:** Run all 6 section/hero prompts in the same session with the same model to maintain palette coherence. Generate the two decorative dividers together.
- **Iteration:** If the first result is too busy, add: *"Simplify drastically. Fewer elements. More negative space."* If too sparse: *"Add subtle geometric detail at very low opacity in the background."*
- **Saving:** Replace the corresponding placeholder SVG in `src/assets/images/illustrations/`. The filename must match exactly.
