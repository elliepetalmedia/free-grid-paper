# FreeGridPaper Design Guidelines

## Design Approach
**Utility-Focused Application** - This is a production tool prioritizing function over form. Use a clean, professional interface that emphasizes the generator controls and live preview without distraction.

## Visual Theme: Blueprint Dark
A technical, engineering-inspired aesthetic that evokes precision and professional toolmaking.

**Color Palette:**
- Background: #0f172a (Deep slate)
- Sidebar: #1e293b (Slate gray)
- Accent: #38bdf8 (Bright cyan blue)
- Text: #f1f5f9 (Off-white)

## Layout System

**Desktop Layout (≥768px):**
- Fixed left sidebar: 320px width containing all controls
- Right area: Flexible preview container
- Canvas preview: Centered with white (#ffffff) background and subtle drop shadow to simulate physical paper floating on the dark interface

**Mobile Layout (<768px):**
- Stacked column layout
- Controls section at top (full width)
- Preview section below (full width)
- Touch-friendly control sizing (minimum 44px tap targets)
- Adequate spacing between interactive elements

**Spacing System:**
Use Tailwind-style spacing: p-4, p-6, p-8 for consistent rhythm throughout the interface.

## Typography
- Font Family: System sans-serif stack (Arial, Helvetica, sans-serif)
- Header (Logo): Bold, 1.5rem, cyan accent color
- Control Labels: 0.875rem, medium weight, off-white text
- Body Text: 1rem, normal weight, off-white text
- SEO Article: Standard semantic sizing (h2: 1.5rem, p: 1rem)

## Component Library

**Sidebar Controls:**
- Dropdown Select (Paper Type): Full-width, dark background with cyan accent on focus, 40px height
- Range Sliders: Cyan track fill, white thumb, labels showing current value
- Number Inputs: Inline, monospace font for precision
- Toggle Switches: Cyan when active (e.g., margin toggle)
- Download Button: Prominent cyan background, white text, full sidebar width, 48px height

**Canvas Preview:**
- White background (#ffffff)
- Box shadow: 0 10px 30px rgba(0,0,0,0.3)
- Border radius: 4px
- Maintains A4 aspect ratio (210mm × 297mm)
- Scales responsively within container while preserving ratio

**SEO Article Section:**
- Positioned below the app container
- Standard article markup with semantic HTML
- Max-width: 800px, centered
- Dark background matching main theme
- Adequate line-height for readability (1.6)

**Legal Pages (/pages/):**
- Minimal standalone pages
- Same Blueprint Dark theme
- Back link with cyan color and left arrow
- Padding: 2rem on all sides
- Simple, readable typography

**Footer:**
- Dark background matching sidebar
- Centered navigation links (About | Contact | Privacy)
- Links styled in cyan with no underline
- Copyright notice: "Copyright 2025 Ellie Petal Media"
- Padding: 2rem vertical

## Paper Generation Tools (5 Types)

Each tool should have clearly labeled, grouped controls:

1. **Dot Grid:** Spacing slider (5-30mm), Size slider (1-3px), Opacity slider
2. **Graph Paper:** Grid size input (mm), Line weight slider, Color dropdown (Cyan/Gray/Black)
3. **Lined Paper:** Line height presets (College 7.1mm / Wide 8.7mm radio buttons), Red margin toggle
4. **Music Staff:** Number input for staves (8-12), automatic 5-line grouping
5. **Checklist:** Inherits lined paper controls + automatic 5mm checkbox squares

## Interaction Patterns

- All slider changes trigger immediate canvas redraw
- LocalStorage auto-saves all input values on change
- Download button generates vector PDF using jsPDF library
- Tool dropdown switches between paper type controls with smooth transition
- Mobile: Scroll controls, fixed download button at bottom of controls section

## Images
**No hero image required** - This is a utility application where the live preview canvas serves as the primary visual element.

## Quality Standards
- Vector PDF output (no raster screenshots)
- Crisp canvas rendering at device pixel ratio
- Proper A4 dimensions (210mm × 297mm) maintained
- Print-ready output when set to "Actual Size" or "100% scale"
- Accessible contrast ratios (cyan on dark meets WCAG AA)
- Responsive breakpoint at 768px with seamless layout shift