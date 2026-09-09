---
name: Modern Indian Handcrafted
colors:
  surface: '#fff8f6'
  surface-dim: '#ead6d0'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ed'
  surface-container: '#ffe9e3'
  surface-container-high: '#f9e4de'
  surface-container-highest: '#f3ded8'
  on-surface: '#241916'
  on-surface-variant: '#57423b'
  inverse-surface: '#3a2e2a'
  inverse-on-surface: '#ffede8'
  outline: '#8a726a'
  outline-variant: '#dec0b7'
  surface-tint: '#a23e18'
  primary: '#9f3c16'
  on-primary: '#ffffff'
  primary-container: '#bf542c'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb59c'
  secondary: '#3f5f92'
  on-secondary: '#ffffff'
  secondary-container: '#a5c5fe'
  on-secondary-container: '#305183'
  tertiary: '#7b542b'
  on-tertiary: '#ffffff'
  tertiary-container: '#966c41'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcf'
  primary-fixed-dim: '#ffb59c'
  on-primary-fixed: '#390c00'
  on-primary-fixed-variant: '#822801'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#a9c7ff'
  on-secondary-fixed: '#001b3d'
  on-secondary-fixed-variant: '#254778'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#f0bd8b'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#623f18'
  background: '#fff8f6'
  on-background: '#241916'
  surface-variant: '#f3ded8'
typography:
  headline-xl:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 36px
  headline-sm:
    fontFamily: Noto Serif
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  grid-columns: '12'
  gutter: 24px
  margin: 32px
  space-xs: 4px
  space-sm: 8px
  space-md: 16px
  space-lg: 24px
  space-xl: 48px
  space-2xl: 80px
---

## Brand & Style

This design system channels a modern Indian handcrafted aesthetic—balancing rich cultural heritage with contemporary minimalism. The visual language is warm, authentic, and deeply human, moving away from sterile corporate tropes toward tactile, artisanal luxury. 

We blend principles of **Minimalism** with **Tactile / Skeuomorphic** undertones, emphasizing natural textures, generous whitespace, and purposeful focal points. The UI should evoke a sense of calm curation, storytelling, and thoughtful craftsmanship.

## Colors

The color palette draws directly from natural Indian dyes, earth pigments, and woven textiles. 

- **Primary (Terracotta):** Used for primary actions, key brand moments, and warm focal points.
- **Secondary (Indigo Blue):** Provides a grounding, deep contrast reminiscent of traditional block prints.
- **Tertiary (Turmeric Gold):** Applied sparingly as an accent for highlights, badges, and interactive states.
- **Neutrals:** Dominated by a warm cream background (`#F9F6F0`) that softens the interface, paired with a slate dark (`#222222`) for crisp, readable typography.

## Typography

Typography establishes an editorial rhythm, pairing the literary elegance of **Noto Serif** for headings with the clean, approachable geometry of **Plus Jakarta Sans** for body and functional text. 

Headings carry a deliberate, unhurried cadence with generous line heights. Body text prioritizes high legibility and soft contrast against the warm cream background, avoiding pure black in favor of slate dark.

## Layout & Spacing

The layout follows a **fluid grid system** built on an 8pt modular scale, infused with generous breathing room that mirrors traditional gallery spaces and textile borders. 

- **Breakpoints:** Mobile (`< 640px`), Tablet (`640px – 1024px`), and Desktop (`> 1024px`).
- **Margins & Gutters:** Generous outer margins (starting at 24px on mobile, scaling to 64px on desktop) ensure content feels curated rather than crowded.
- **Reflow:** Multi-column masonry and grid layouts gracefully collapse into single-column stacks on smaller viewports, preserving vertical rhythm and touch targets.

## Elevation & Depth

Depth is conveyed through **warm tonal layering** and subtle, low-opacity ambient shadows rather than stark elevation drops. 

Surfaces stack organically using shifts in tone between the warm cream base and slightly tinted container surfaces. When shadows are required, they use diffused, warm-tinted opacity (derived from the terracotta and indigo palette) to maintain an organic, tactile feel. Ghost borders and soft low-contrast outlines are preferred over hard, high-contrast lines to separate structural containers.

## Shapes

The shape language employs a **soft, gentle geometric approach** (`roundedness` level 1). 

Corners feature restrained radii (0.25rem for base elements, 0.5rem to 0.75rem for cards and containers) to soften the digital interface without losing structural integrity. Pill shapes are reserved exclusively for status tags and category chips, echoing the organic forms found in pottery and natural motifs.

## Components

### Buttons
Primary buttons feature the terracotta fill with slate dark or warm cream typography, utilizing soft 0.25rem rounded corners. Secondary buttons use an indigo or ghost border variant with clean label typography. Hover states subtly deepen the tone and elevate the surface.

### Chips & Tags
Compact, pill-shaped elements used for filtering and categorization. They feature soft neutral backgrounds with turmeric gold or indigo text accents to guide visual hierarchy.

### Input Fields
Clean, understated input fields with low-contrast slate outlines and generous internal padding. Focus states transition smoothly to an indigo or terracotta border with an ambient glow.

### Cards
Surfaced on warm container layers with subtle tonal separation and soft 0.75rem rounded corners. Ideal for showcasing handcrafted products, editorial stories, or curated collections with ample internal whitespace.

### Checkboxes & Radio Buttons
Custom geometric indicators that replace standard system controls with refined square (checkbox) and circular (radio) components, utilizing terracotta active states.

### Lists & Dividers
Lists feature generous vertical spacing with delicate, low-opacity terracotta or slate dividers that mimic the appearance of hand-pressed paper seams.