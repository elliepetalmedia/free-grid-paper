import React from 'react';
import { Link } from 'wouter';

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
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Best Uses</h3>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li><strong>Bullet Journaling (BuJo):</strong> 5mm dot spacing at 50% opacity is widely considered the standard for journals and planners.</li>
          <li><strong>UI/UX Design:</strong> Perfect for wireframing mobile apps and websites without the visual clutter of full grid lines.</li>
          <li><strong>Lettering & Calligraphy:</strong> Provides subtle baseline guides that won't show up heavily in final scans.</li>
        </ul>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Print Tips</h3>
        <p>When printing, ensure your printer dialog is set to "Actual Size" or "100% Scale" rather than "Fit to Page" to maintain exact physical dimensions of the dot spacing.</p>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/graph">Graph Paper</Link>
            <Link href="/isometric-dots">Isometric Dots</Link>
          </div>
        </div>
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
          Adjust grid line weight, color, and spacing (mm or inches) to build the exact layout you need.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Common Configurations</h3>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li><strong>Math Homework:</strong> 1/4 inch or 5mm grid spacing printed on standard Letter or A4 paper.</li>
          <li><strong>Engineering Paper:</strong> Often relies on a 5x5 per square inch format. Use a green grid on a slight yellow background for authenticity.</li>
          <li><strong>Pixel Art & Mapping:</strong> High-contrast black lines with larger 10mm squares.</li>
        </ul>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Print Tips</h3>
        <p>For engineering applications requiring exact scale measurements, disable any scaling settings in your PDF viewer before printing.</p>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/engineering">Engineering Paper</Link>
            <Link href="/hex-paper">Hexagon Grid</Link>
          </div>
        </div>
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
          Our generator lets you dial in the exact line height you need, whether you prefer tight college ruling or wider spacing for younger writers.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Standard Ruled Sizes</h3>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li><strong>Wide Ruled (Legal Ruled):</strong> Standard format for American elementary school students, featuring 11/32" (8.7mm) spacing.</li>
          <li><strong>College Ruled (Medium Ruled):</strong> Standard format for older students and adults, featuring 9/32" (7.1mm) spacing.</li>
          <li><strong>Narrow Ruled:</strong> Used for packing more text onto a page, featuring 1/4" (6.35mm) spacing.</li>
        </ul>
        <p>You can optionally enable a classic red margin line to replicate standard binder filler paper.</p>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/handwriting">Handwriting Practice</Link>
            <Link href="/calligraphy">Calligraphy Guidelines</Link>
          </div>
        </div>
      </>
    )
  },
  'music-staff': {
    title: 'Blank Sheet Music (Staff Paper)',
    description: 'Free printable blank sheet music. Customize staves per page. Professional quality PDF staff paper for composers.',
    content: (
      <>
        <p>
          Free printable blank sheet music (manuscript paper). Customize the number of staves per page to suit your composition or transcription style.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Best Uses</h3>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li><strong>Music Theory Students:</strong> 10 to 12 staves per page is the standard for homework and exercises.</li>
          <li><strong>Composers & Songwriters:</strong> Adjust stave spacing dynamically depending on how many lyrics or articulation marks you need to write between systems.</li>
          <li><strong>Instrumentalists:</strong> Need larger staves for easy reading on a music stand? Set your generator to 6 or 8 staves per page.</li>
        </ul>
        <p>Our vector-based PDF export ensures that stave lines remain perfectly crisp, even on high-end laser printers.</p>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/guitar-tab">Guitar Tablature</Link>
            <Link href="/bass-tab">Bass Tablature</Link>
          </div>
        </div>
      </>
    )
  },
  'checklist': {
    title: 'Printable To-Do List & Checklist Templates',
    description: 'Stay organized with free printable checklist templates. Standard lined paper with checkboxes.',
    content: (
      <>
        <p>
          Stay organized with our free printable checklist templates. Features standard horizontal spacing combined with clean, left-aligned checkboxes for tracking tasks, glossaries, or inventories.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Common Scenarios</h3>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li><strong>Daily To-Do Lists:</strong> Print on a half-sheet or A5 size to keep on your desk.</li>
          <li><strong>Packing & Inventories:</strong> Increase the line height (e.g., to 10mm) if you are tracking large physical items or taking notes on a clipboard while standing.</li>
        </ul>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/lined-paper">Lined Paper</Link>
            <Link href="/dot-grid">Dot Grid</Link>
          </div>
        </div>
      </>
    )
  },
  'isometric-dots': {
    title: 'Isometric Dot Paper',
    description: 'Printable isometric dot paper for 3D sketching and architectural drawing. Accurate perspective guides.',
    content: (
      <>
        <p>
          Printable isometric dot paper for 3D sketching, architectural drawing, and tabletop game design.
          The triangular arrangement of dots helps you draw three-dimensional objects with accurate perspective and scale.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Who Uses Isometric Grids?</h3>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li><strong>Industrial Designers:</strong> Rapidly prototyping mechanical parts or product designs in pseudo-3D.</li>
          <li><strong>Architects:</strong> Sketching floor plans and extrusion models.</li>
          <li><strong>Game Designers:</strong> Mapping out isometric RPG levels or classic 2.5D game environments.</li>
        </ul>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/perspective-1">Perspective Grid</Link>
            <Link href="/hex-paper">Hexagon Grid</Link>
          </div>
        </div>
      </>
    )
  },
  'hex-grid': {
    title: 'Hexagon Grid Paper (Hex Paper)',
    description: 'Free hexagonal graph paper PDF generator. Perfect for organic chemistry, D&D maps, and strategy games.',
    content: (
      <>
        <p>
          Free hexagonal graph paper PDF generator. Essential for organic chemistry structures, tabletop strategy games (like Dungeons & Dragons or wargaming), and tessellation art.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Common Sizing Guide</h3>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li><strong>Tabletop Gaming (D&D):</strong> 1-inch (25.4mm) hexagons are the absolute standard for tabletop miniatures.</li>
          <li><strong>Organic Chemistry:</strong> Smaller hexagons (e.g., 5mm to 8mm) provide excellent guides for drawing carbon rings and complex molecular structures.</li>
          <li><strong>Quilting & Art:</strong> Set to large sizes for creating English Paper Piecing templates.</li>
        </ul>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/isometric-dots">Isometric Dots</Link>
            <Link href="/graph">Graph Paper</Link>
          </div>
        </div>
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
          Unlike standard square grids, you can adjust the height-to-width ratio to match your specific gauge (stitch size).
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Why Use Non-Square Grids?</h3>
        <p className="mb-4">Knitting stitches are rarely perfectly square; they are typically wider than they are tall (often forming a V shape). If you draft a pattern on standard square graph paper, the final knitted piece will look squashed. By adjusting our generator to match your swatched gauge (e.g., 5mm wide by 7.5mm tall), your drawn design will accurately reflect the final physical shape.</p>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/graph">Standard Graph Paper</Link>
          </div>
        </div>
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
          Features standard slant lines to help you master traditional pointed-pen scripts like Copperplate and Spencerian.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Understanding Calligraphy Angles</h3>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li><strong>Copperplate:</strong> Traditionally relies on a 55° slant angle for elegance and consistency.</li>
          <li><strong>Spencerian:</strong> Often utilizes a steeper 52° slant angle.</li>
          <li><strong>Italic Script:</strong> Generally uses a much gentler 5° to 10° slant.</li>
        </ul>
        <p>Our generator lets you dial in the exact angle and x-height you need for your current level of practice.</p>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/handwriting">Handwriting Practice</Link>
            <Link href="/lined-paper">Lined Paper</Link>
          </div>
        </div>
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
          Features standard three-line guides with dashed midlines to help children practice letter formation, sizing, and spacing.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Who Uses This?</h3>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li><strong>Kindergarten & First Grade:</strong> Set the line height to a large size (e.g., 20mm or 1 inch) to help beginners develop fine motor control.</li>
          <li><strong>Second & Third Grade:</strong> Progressing to smaller line heights (e.g., 10mm to 15mm) as penmanship improves and standard cursive is introduced.</li>
          <li><strong>Homeschoolers:</strong> Print endless variations without buying expensive workbooks.</li>
        </ul>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/calligraphy">Calligraphy Guidelines</Link>
            <Link href="/lined-paper">Lined Paper</Link>
          </div>
        </div>
      </>
    )
  },
  'guitar-tab': {
    title: 'Blank Guitar Tablature Sheets',
    description: 'Clean, customizable guitar tab paper. 6-line staves with adjustable spacing using our free PDF generator.',
    content: (
      <>
        <p>
          Clean, customizable guitar tablature (tab) paper. Standard 6-line staves to represent the strings of a guitar, perfect for transcribing solos, lessons, and original music.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Best Uses</h3>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li><strong>Guitar Teachers:</strong> Leave large amounts of space between staves to write rhythm notation, chord diagrams, or notes for your students.</li>
          <li><strong>Transcribers:</strong> Fit more staves on a page to quickly jot down licks and solos without constantly turning pages.</li>
        </ul>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/bass-tab">Bass Tablature</Link>
            <Link href="/music-staff">Blank Sheet Music</Link>
          </div>
        </div>
      </>
    )
  },
  'bass-tab': {
    title: 'Blank Bass Tablature Sheets',
    description: 'Free printable bass tab paper. 4-line staves designed for bass guitar transcription.',
    content: (
      <>
        <p>
          Free printable bass tab paper. Features 4-line staves designed specifically for the standard four-string bass guitar, eliminating the clutter of unused guitar strings.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Best Uses</h3>
        <p className="mb-4">Perfect for bass instructors, students, and session musicians creating quick lead sheets. You can easily adjust the line weight to make the strings bold and visible under stage lighting.</p>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/guitar-tab">Guitar Tablature</Link>
            <Link href="/music-staff">Blank Sheet Music</Link>
          </div>
        </div>
      </>
    )
  },
  'genkoyoushi': {
    title: 'Genkoyoushi (Japanese Manuscript Paper)',
    description: 'Traditional Japanese Genkoyoushi paper for kanji practice. Square grids with quarter-split guides.',
    content: (
      <>
        <p>
          Traditional Japanese Genkoyoushi paper for kanji practice, essays, and composition.
          Features vertical columns of square grids with quarter-split center guides to aid in character balance.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Standard usage</h3>
        <p className="mb-4">In Japan, Genkoyoushi is the standard format for students writing essays. Each square holds a single character, punctuation mark, or kana. Sentences are typically written top-to-bottom and right-to-left. Our generator allows you to switch between A4 and B5 (using custom offsets) sizing, common in Asian stationery.</p>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/graph">Standard Graph Paper</Link>
          </div>
        </div>
      </>
    )
  },
  'perspective-grid': {
    title: 'Perspective Drawing Grids',
    description: 'Download 1-point and 2-point perspective grids. Helper guides for architectural sketches and 3D illustration.',
    content: (
      <>
        <p>
          Download pristine 1-point and 2-point perspective grids to aid your architectural sketches and technical illustrations.
          These guides provide a receding "spiderweb" structure to ensure your vanishing points and horizon lines are flawless.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">When to use which</h3>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li><strong>1-Point Perspective:</strong> Best for looking down hallways, train tracks, or directly at the front face of a room or building.</li>
          <li><strong>2-Point Perspective:</strong> Best for drawing city street corners, angled objects, or building exteriors viewed from the edge.</li>
        </ul>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/isometric-dots">Isometric Dots</Link>
            <Link href="/storyboard">Storyboard Template</Link>
          </div>
        </div>
      </>
    )
  },
  'comic-layout': {
    title: 'Comic Book Page Templates',
    description: 'Printable comic book page templates. Standard panel layouts (2x3, 3x3) and splash pages for manga and comics.',
    content: (
      <>
        <p>
          Start pencilling your manga, graphic novel, or zine with pre-ruled comic book page templates.
          Choose from standard 2x3 grids (classic American comic layout), 3x3 grids (stiffer, dense layouts), or full splash pages.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Best Uses</h3>
        <p className="mb-4">Instead of spending 10 minutes measuring out panels and gutters with a ruler, simply print out a batch of these layout boards and get straight to drawing. Combine these structural guides with light blue or grey grid lines to create the ultimate comic artist toolkit.</p>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/storyboard">Storyboard Template</Link>
            <Link href="/perspective-1">Perspective Grid</Link>
          </div>
        </div>
      </>
    )
  },
  'storyboard': {
    title: 'Storyboard Templates',
    description: 'Professional storyboard templates with 16:9 frames and note lines. Ideal for film and video production planning.',
    content: (
      <>
        <p>
          Professional storyboard templates for film, animation, commercial, and video production.
          Features standard 16:9 aspect ratio frames with dedicated space underneath for dialogue, camera directions, and action notes.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">Best Uses</h3>
        <ul className="list-disc pl-5 space-y-1 mb-4">
          <li><strong>Directors & Cinematographers:</strong> Pre-visualize shot compositions and camera movements (pan, tilt, swoop) before getting to set.</li>
          <li><strong>Animators:</strong> Block out keyframes and pacing.</li>
          <li><strong>Creative Agencies:</strong> Pitch commercial concepts clearly to clients with neatly ruled 3x2 board layouts.</li>
        </ul>
        <div className="mt-8 pt-4 border-t border-slate-200">
          <p className="text-sm font-semibold text-slate-600 mb-2">Related Templates:</p>
          <div className="flex gap-4 text-sm text-primary">
            <Link href="/comic-2x3">Comic Layout</Link>
            <Link href="/checklist">Checklist Maker</Link>
          </div>
        </div>
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
