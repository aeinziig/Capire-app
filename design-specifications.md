# Institutional Design Specifications for CAPIRE App

## Color System

### Primary Palette
- Dark Green: `#1B4332` - Headers, navigation bars, primary headings
- Sage Green: `#2D6A4F` - Primary buttons, active states, links
- Light Green: `#52B788` - Hover states, category tags, secondary accents
- Pale Green: `#D8F3DC` - Card backgrounds, badges, input focus fills

### Secondary Palette
- Amber Gold: `#E9C46A` - Accents, highlights, active indicators, chatbot button
- Deep Gold: `#D4A017` - Moderate similarity badges, warning states
- Pale Gold: `#FFF3CD` - AI suggestion boxes, notification backgrounds

### Neutral Palette
- Pure White: `#FFFFFF` - Main content backgrounds, card surfaces
- Off White: `#F8F9FA` - Page backgrounds, input fields
- Light Gray: `#E9ECEF` - Borders, dividers, disabled states
- Medium Gray: `#6C757D` - Secondary text, placeholders, captions
- Dark Gray: `#212529` - Primary body text, paragraph content

### Status Colors
- Success Green: `#40916C` - Approved status, original topic badge
- Warning Orange: `#F4A261` - High similarity warning, needs revision
- Danger Red: `#E76F51` - Duplicate topic, rejected status
- Critical Red: `#C1121F` - 80%+ similarity, critical errors

### Similarity Score Color Mapping
- 0% – 30%: Original - `#40916C` text on `#D8F3DC` background
- 31% – 60%: Moderate - `#D4A017` text on `#FFF3CD` background
- 61% – 79%: High - `#E76F51` text on `#FFE8D6` background
- 80% – 100%: Duplicate - `#C1121F` text on `#FFE0DB` background

## Typography

### Font Family
- Primary: Inter (all UI elements)
- Fallback: system-ui, -apple-system, sans-serif

### Type Scale
- Screen Title: 20px, 700 weight, `#FFFFFF` color
- Section Heading: 18px, 700 weight, `#1B4332` color
- Card Title: 16px, 600 weight, `#1B4332` color
- Body Text: 14px, 400 weight, `#212529` color
- Label: 12px, 600 weight, `#1B4332` color
- Caption: 12px, 400 weight, `#6C757D` color
- Micro Text: 11px, 400 weight, `#6C757D` color
- Button Text: 16px, 600 weight, `#FFFFFF` color

### Typography Rules
- No italic for UI elements
- No decorative or script fonts
- Line height: 1.5 for body text, 1.2 for headings
- Letter spacing: normal for body, 0.5px for labels
- Maximum line width: 320px for readable paragraphs
- Two-line truncation with ellipsis for card titles
- Single-line truncation for metadata (authors, dates)

## Spacing and Layout

### Base Grid
- Base unit: 8px
- Screen padding: 16px (left and right, all screens)
- Section gap: 24px (between major content sections)
- Component gap: 12px (between related elements)
- Element gap: 8px (between tightly coupled elements)

### Border Radius Scale
- Small: 8px - Chips, tags, small badges
- Medium: 10px - Input fields
- Large: 12px - Buttons
- Extra Large: 16px - Cards, panels
- Pill: 24px - Toggle tabs, filter chips
- Circle: 50% - Avatars, icon buttons

### Elevation (Shadow)
- Card shadow: 0 2px 8px rgba(0, 0, 0, 0.06)
- Button shadow: 0 4px 12px rgba(45, 106, 79, 0.30)
- Sheet shadow: 0 -4px 24px rgba(0, 0, 0, 0.12)
- Chatbot shadow: 0 4px 16px rgba(233, 196, 106, 0.40)

## Accessibility Guidelines

### Color Contrast Requirements
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Dark green on white: #1B4332 on #FFFFFF = 12.6:1 (AAA)
- Sage green on white: #2D6A4F on #FFFFFF = 7.2:1 (AA)
- White on dark green: #FFFFFF on #1B4332 = 12.6:1 (AAA)
- Body text on white: #212529 on #FFFFFF = 16.1:1 (AAA)
- Gray text on white: #6C757D on #FFFFFF = 4.6:1 (AA)

### Touch Targets
- Minimum tap target: 44×44px (all interactive elements)
- Button height: 52px minimum
- Icon buttons: 44px circle minimum
- Bottom nav tabs: Full width / 5 equal sections

### Text Sizing
- Minimum font size: 11px (footer/version only)
- Body minimum: 14px
- Interactive labels: 14px minimum