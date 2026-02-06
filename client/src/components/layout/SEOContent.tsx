
import React from 'react';

type PaperType = 'dot-grid' | 'graph-paper' | 'lined-paper' | 'music-staff' | 'checklist' | 'isometric-dots' | 'hex-grid' | 'knitting' | 'calligraphy' | 'handwriting' | 'guitar-tab' | 'bass-tab' | 'genkoyoushi' | 'perspective-grid' | 'comic-layout' | 'storyboard';

interface SEOContentProps {
  paperType: PaperType;
}

export const SEO_DATA: Record<PaperType, { title: string; description: string; content: React.ReactNode }> = {
  'dot-grid': {
    title: 'Free Printable Dot Grid Paper',
    description: 'Download free printable dot grid paper. Customize dot size, spacing, and opacity. Perfect for bullet journaling and design.',
    content: (
      <>
        <p>
          Download free printable dot grid paper (dotted paper) perfect for bullet journaling, sketching, and design.
          Our dot grid generator allows you to customize dot spacing, size, and opacity to create the perfect template for your needs.
        </p>
        <p className="mt-2">
          Available in A4, Letter, and other standard sizes. Ideal for UI/UX designers, architects, and anyone who loves organized creativity.
        </p>
      </>
    )
  },
  'graph-paper': {
    title: 'Customizable Graph Paper PDF Generator',
    description: 'Create and download custom graph paper PDFs. Adjust grid lines, color, and spacing. Ideal for math, engineering, and pixel art.',
    content: (
      <>
        <p>
          Create and download custom graph paper (grid paper/squared paper) PDFs.
          Adjust grid line weight, color, and spacing (mm or inches). Perfect for math homework, engineering diagrams, and pixel art.
        </p>
        <p className="mt-2">
          Supports standard engineering formats (green lines on yellow background) and variable subdivisions.
        </p>
      </>
    )
  },
  'lined-paper': {
    title: 'Printable Lined Paper (Ruled Paper)',
    description: 'Generate free printable lined paper. Choose College Ruled or Wide Ruled. Optional margins. Download high-quality PDFs.',
    content: (
      <>
        <p>
          Generate free printable lined paper for handwriting, note-taking, and school assignments.
          Switch between College Ruled (7.1mm) and Wide Ruled (8.7mm) formats.
        </p>
        <p className="mt-2">
          Optionally add a red margin line for a classic notebook look. Download high-quality PDFs in A4 or Letter size.
        </p>
      </>
    )
  },
  'music-staff': {
    title: 'Blank Sheet Music (Staff Paper)',
    description: 'Free printable blank sheet music. Customize staves per page. Professional quality PDF staff paper for composers.',
    content: (
      <>
        <p>
          Free printable blank sheet music (manuscript paper). Customize the number of staves per page to suit your composition style.
        </p>
        <p className="mt-2">
          Clean, professional-quality staff paper for music theory students, composers, and songwriters.
        </p>
      </>
    )
  },
  'checklist': {
    title: 'Printable To-Do List & Checklist Templates',
    description: 'Stay organized with free printable checklist templates. Standard lined paper with checkboxes.',
    content: (
      <>
        <p>
          Stay organized with our free printable checklist templates. Features standard spacing with checkboxes for tracking tasks, glossaries, or inventories.
        </p>
      </>
    )
  },
  'isometric-dots': {
    title: 'Isometric Dot Paper',
    description: 'Printable isometric dot paper for 3D sketching and architectural drawing. Accurate perspective guides.',
    content: (
      <>
        <p>
          Printable isometric dot paper for 3D sketching, architectural drawing, and game design.
          The triangular arrangement of dots helps you draw 3D objects with accurate perspective.
        </p>
      </>
    )
  },
  'hex-grid': {
    title: 'Hexagon Grid Paper (Hex Paper)',
    description: 'Free hexagonal graph paper PDF generator. Perfect for organic chemistry, D&D maps, and strategy games.',
    content: (
      <>
        <p>
          Free hexagonal graph paper PDF generator. Essential for organic chemistry structures, tabletop strategy games (D&D, wargaming), and tessellation art.
        </p>
        <p className="mt-2">
          Customize hexagon size and line weight.
        </p>
      </>
    )
  },
  'knitting': {
    title: 'Knitting & Cross-Stitch Graph Paper',
    description: 'Customizable knitting and cross-stitch graph paper. Adjust grid ratio to match your gauge.',
    content: (
      <>
        <p>
          Design your own patterns with our customizable knitting and cross-stitch graph paper.
          Unlike standard square grids, you can adjust the height-to-width ratio to match your gauge (stitch size).
        </p>
      </>
    )
  },
  'calligraphy': {
    title: 'Calligraphy Practice Sheets',
    description: 'Free printable calligraphy guide sheets with 55° slant lines. Master Copperplate and Spencerian scripts.',
    content: (
      <>
        <p>
          Improve your penmanship with free printable calligraphy guide sheets.
          Features 55° slant lines (customizable angle) to help you master Copperplate and Spencerian scripts.
        </p>
      </>
    )
  },
  'handwriting': {
    title: 'Handwriting Practice Paper',
    description: 'Free printable handwriting paper for primary school. 3-line guides with dashed midlines for penmanship practice.',
    content: (
      <>
        <p>
          Free printable handwriting paper templates for primary school students.
          Features standard three-line guides with dashed midlines to help children practice letter formation and spacing.
        </p>
        <p className="mt-2">
          Ideal for kindergarten and first-grade penmanship practice. Adjustable line heights and optional slant guides.
        </p>
      </>
    )
  },
  'guitar-tab': {
    title: 'Blank Guitar Tablature Sheets',
    description: 'Clean, customizable guitar tab paper. 6-line staves with adjustable spacing using our free PDF generator.',
    content: (
      <>
        <p>
          Clean, customizable guitar tablature (tab) paper. Standard 6-line staves for transcribing guitar music.
          Adjust spacing and staves per page.
        </p>
      </>
    )
  },
  'bass-tab': {
    title: 'Blank Bass Tablature Sheets',
    description: 'Free printable bass tab paper. 4-line staves designed for bass guitar transcription.',
    content: (
      <>
        <p>
          Free printable bass tab paper. 4-line staves designed specifically for bass guitar transcription.
        </p>
      </>
    )
  },
  'genkoyoushi': {
    title: 'Genkoyoushi (Japanese Manuscript Paper)',
    description: 'Traditional Japanese Genkoyoushi paper for kanji practice. Square grids with quarter-split guides.',
    content: (
      <>
        <p>
          Traditional Japanese Genkoyoushi paper for kanji practice and composition.
          Features vertical columns of square grids with quarter-split guides.
        </p>
      </>
    )
  },
  'perspective-grid': {
    title: 'Perspective Drawing Grids',
    description: 'Download 1-point and 2-point perspective grids. Helper guides for architectural sketches and 3D illustration.',
    content: (
      <>
        <p>
          Download 1-point and 2-point perspective grids to aid your architectural sketches and illustrations.
          These guides act as a "spiderweb" to help you draw realistic 3D environments.
        </p>
      </>
    )
  },
  'comic-layout': {
    title: 'Comic Book Page Templates',
    description: 'Printable comic book page templates. Standard panel layouts (2x3, 3x3) and splash pages for manga and comics.',
    content: (
      <>
        <p>
          Start your manga or graphic novel with these pre-ruled comic book page templates.
          Choose from standard 2x3, 3x3 grids or splash page layouts.
        </p>
      </>
    )
  },
  'storyboard': {
    title: 'Storyboard Templates',
    description: 'Professional storyboard templates with 16:9 frames and note lines. Ideal for film and video production planning.',
    content: (
      <>
        <p>
          Professional storyboard templates for film, animation, and video production.
          Features 16:9 aspect ratio frames with space for dialogue and action notes.
        </p>
      </>
    )
  }
};

export const SEOContent: React.FC<SEOContentProps> = ({ paperType }) => {
  const data = SEO_DATA[paperType];

  if (!data) return null;

  return (
    <div className="w-full bg-white border-t border-sidebar-border mt-12 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-4 text-primary">{data.title}</h2>
        <div className="prose prose-slate max-w-none text-muted-foreground">
          {data.content}
        </div>
      </div>
    </div>
  );
};
