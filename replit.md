# FreeGridPaper - Printable Grid Paper Generator

## Overview

FreeGridPaper is a browser-based utility application that generates customizable printable stationery including dot grids, graph paper, lined paper, music staves, checklists, hexagon grids, knitting/cross-stitch patterns, and calligraphy guides. The application runs entirely client-side with no backend processing, generating vector PDFs directly in the browser using jsPDF. All user preferences are persisted locally using localStorage.

The application features a "Blueprint Dark" design theme with a professional, engineering-inspired aesthetic. It provides real-time canvas preview of paper configurations and exports high-resolution vector PDFs suitable for accurate printing.

## Quick Downloads Feature

The navigation bar provides "Quick Downloads" - pre-configured paper presets that load instantly:
- Graph Paper, Dot Grid, Hexagon (D&D), Music Staff, Engineering, Poster Size, Poster Hex (D&D)
- Each preset has its own SEO-optimized route (/graph, /dot-grid, /hex-paper, etc.)
- Preset pages show a "Ready to Print" banner with one-click download
- When user modifies any setting on a preset page, the app navigates to "/" (main generator) and the banner disappears
- This creates clear separation between quick preset downloads and custom paper generation

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework Stack:**
- React 18 with TypeScript
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query for data fetching and state management
- Tailwind CSS for styling with custom "Blueprint Dark" theme

**Component Library:**
- shadcn/ui components (Radix UI primitives with custom styling)
- All UI components follow the "New York" style variant
- Custom theme using HSL color variables for consistent dark mode appearance

**Key Design Patterns:**
- Component composition using Radix UI primitives
- Custom hooks for mobile detection and toast notifications
- Local state management with React hooks (useState, useEffect)
- localStorage for user preference persistence
- Canvas API for real-time preview rendering
- jsPDF for client-side vector PDF generation

**Responsive Layout:**
- Desktop: Fixed 320px left sidebar with flexible preview area
- Mobile (<768px): Stacked column layout with controls above preview
- Touch-friendly controls with minimum 44px tap targets on mobile

### PDF Generation Architecture

**Client-Side Vector Rendering:**
- All PDF generation happens in the browser using jsPDF library
- Uses vector commands (`doc.line`, `doc.circle`) rather than rasterized images
- Ensures accurate sizing when printed at 100% scale
- Supports 9 paper types with distinct rendering logic:
  - Dot Grid: Configurable spacing, size, and opacity
  - Isometric Dots: 60-degree angled dot pattern for 3D sketching
  - Graph Paper: Customizable grid size, line weight, and color
  - Hexagon Grid: For D&D/tabletop gaming with size presets
  - Lined Paper: Adjustable line height with optional margin lines
  - Music Staff: Multiple staves with treble clef rendering
  - Checklist: Lined paper with checkbox squares
  - Knitting/Cross-Stitch: Rectangular grid matching gauge ratios
  - Calligraphy: Horizontal lines with angled slant guides

### State Management

**Local Persistence:**
- All slider and control values automatically saved to localStorage
- Settings key: 'freegridpaper-settings'
- Merged with default settings on load to handle missing properties
- Quick Download presets always load fresh (ignore saved settings)
- Settings only persist when on main generator page ("/")
- No server-side state or user accounts

**Application State:**
- Managed through React component state (useState)
- Settings stored in a single object containing all paper configuration
- Real-time updates trigger canvas re-rendering

### Backend Architecture

**Express Server:**
- Minimal server setup for static file serving
- Separate dev and production entry points (index-dev.ts, index-prod.ts)
- Development mode integrates Vite middleware for HMR
- Production mode serves pre-built static assets from dist/public

**Static Content:**
- Three static HTML pages served from client/public/pages/
  - about.html - Publisher information
  - contact.html - Contact details and support policy
  - privacy.html - Privacy policy and cookie notice
- All pages styled inline with Blueprint Dark theme colors

**Routing:**
- Client-side routing handled by Wouter
- Server falls back to index.html for SPA behavior
- Static pages served directly via Express static middleware
- Quick Download preset routes: /graph, /dot-grid, /hex-paper, /music-staff, /engineering, /poster-size, /poster-hex, /calligraphy, /knitting
- FAQ page at /faq with collapsible accordion sections

### Database Schema

**Current Implementation:**
- Uses Drizzle ORM with PostgreSQL dialect configuration
- Schema defines a basic users table with username/password authentication
- Database connection via @neondatabase/serverless
- Currently implements MemStorage (in-memory) rather than actual database
- Schema ready for future database integration if needed

**Note:** The application currently does not require database functionality as it's a client-side tool. The schema and storage interfaces are scaffolding from the template.

## External Dependencies

### Core Libraries

**UI Framework:**
- React 18 with TypeScript
- Vite for build tooling
- @vitejs/plugin-react for JSX transformation

**PDF Generation:**
- jsPDF (via CDN in production) - Vector PDF creation in browser
- Canvas API (native) - Real-time preview rendering

**Component Libraries:**
- @radix-ui/* - Comprehensive set of accessible UI primitives
- class-variance-authority - Variant-based component styling
- clsx + tailwind-merge - Utility class composition

**State Management:**
- @tanstack/react-query - Server state management
- react-hook-form + @hookform/resolvers - Form handling
- zod - Schema validation
- drizzle-zod - Database schema to Zod conversion

**Styling:**
- Tailwind CSS - Utility-first CSS framework
- PostCSS with Autoprefixer
- Custom theme with Blueprint Dark color palette

### Development Tools

**Build & Development:**
- TypeScript - Type safety
- ESBuild - Fast bundling for production server
- tsx - TypeScript execution for development server
- Drizzle Kit - Database migrations and schema management

**Replit Integration:**
- @replit/vite-plugin-runtime-error-modal - Error overlay
- @replit/vite-plugin-cartographer - Development tooling
- @replit/vite-plugin-dev-banner - Development banner

### Database & Backend

**Database:**
- @neondatabase/serverless - Serverless Postgres client
- drizzle-orm - Type-safe ORM
- PostgreSQL dialect (configured but not actively used)

**Server:**
- Express - Web server framework
- connect-pg-simple - PostgreSQL session store (configured)

**Routing:**
- wouter - Lightweight client-side routing (~1.2KB)

### Utilities

**Date & Time:**
- date-fns - Date utility library

**Carousel:**
- embla-carousel-react - Touch-friendly carousel component

**Command Palette:**
- cmdk - Command palette interface