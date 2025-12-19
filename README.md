# FreeGridPaper - Vector PDF Stationery Generator

FreeGridPaper is a privacy-first tool that generates high-resolution printable paper. Unlike other sites that generate blurry images, this tool uses `jsPDF` to create vector-based PDFs that print perfectly crisp at any size.

**[Launch Live Tool](https://freegridpaper.com)**

## Features

### Quick Downloads
The navigation bar provides instant access to pre-configured paper types with optimized settings:
- **Graph Paper** - Standard grid for math and technical work
- **Dot Grid** - Perfect for bullet journaling
- **Hexagon (D&D)** - 1-inch hex grid for tabletop gaming
- **Music Staff** - Blank sheet music
- **Engineering** - Green grid on yellow background
- **Poster Size** - Large format graph paper (24×36")
- **Poster Hex (D&D)** - Large format hex grid for battle maps

Click any Quick Download button to load the preset and see a "Ready to Print" banner. Any customization automatically switches to the full generator mode.

### 9 Paper Types
- **Dot Grid** - For bullet journaling and note-taking
- **Isometric Dots** - For 3D sketching and technical drawing
- **Graph Paper** - Square grid for math and charts
- **Hexagon Grid** - For D&D, tabletop RPGs, and strategy games
- **Lined Paper** - College and wide rule options
- **Music Staff** - Blank sheet music with treble clefs
- **Checklist** - Lined paper with checkboxes
- **Knitting/Cross-Stitch** - Rectangular grid matching gauge ratios
- **Calligraphy** - Horizontal lines with angled guides

### Paper Sizes
- **Standard:** A4, US Letter, Legal
- **Large Format:** A2, A1, A0
- **Architectural:** Arch C (18×24"), Arch D (24×36"), Arch E (36×48")

### Customization
- Adjustable spacing, size, weight, and opacity for all patterns
- Custom pattern colors with color picker
- Custom background colors (for engineering paper effects)
- Ink Saver mode for economical printing
- Edge rulers in mm or inches
- Batch export multiple paper types in one PDF

### Technical
- **Vector Output:** True PDF vector graphics, not images. Lines remain crisp at 300+ DPI.
- **Client-Side:** No server processing. Files generated entirely in your browser.
- **Automatic Settings:** Your customizations are saved locally and restored on return.
- **Real-time Preview:** Canvas preview updates instantly as you adjust settings.

## Tech Stack
- **Frontend:** React + TypeScript + Tailwind CSS
- **PDF Generation:** jsPDF (vector-based)
- **Preview:** HTML5 Canvas
- **Routing:** Wouter
- **Build:** Vite

## License
MIT License - Open source and free to use.
