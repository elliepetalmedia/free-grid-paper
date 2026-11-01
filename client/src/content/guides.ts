import type { GuideEntry } from './types';

const previewImage = '/previews/freegridpaper-preview.svg';
const socialImage = '/og/freegridpaper-og.svg';
const updatedAt = '2026-05-22';

interface GuideConfig {
  id: string;
  title: string;
  description: string;
  h1: string;
  summary: string;
  answerSummary: string;
  referenceFacts?: GuideEntry['referenceFacts'];
  bestFor?: string[];
  body: GuideEntry['body'];
  primaryTemplateId?: string;
  primaryPresetId?: string;
  relatedTemplateIds: string[];
  relatedPresetIds: string[];
  relatedQuestions?: GuideEntry['relatedQuestions'];
  // Only for guides actually written or changed on a later date.
  // Older guides keep the shared date; do not bump them in bulk.
  updatedAt?: string;
}

const guide = ({
  id,
  title,
  description,
  h1,
  summary,
  answerSummary,
  referenceFacts = [],
  bestFor = [],
  body,
  primaryTemplateId,
  primaryPresetId,
  relatedTemplateIds,
  relatedPresetIds,
  relatedQuestions = [],
  updatedAt: updatedAtOverride = updatedAt,
}: GuideConfig): GuideEntry => ({
  kind: 'guide',
  id,
  slug: id,
  path: `/guides/${id}`,
  canonicalPath: `/guides/${id}`,
  indexable: true,
  title,
  description,
  h1,
  summary,
  answerSummary,
  updatedAt: updatedAtOverride,
  previewImage,
  socialImage,
  referenceFacts,
  bestFor,
  body,
  primaryTemplateId,
  primaryPresetId,
  relatedTemplateIds,
  relatedPresetIds,
  relatedQuestions,
});

export const guides: GuideEntry[] = [
  guide({
    id: 'graph-paper-sizes-explained',
    title: 'Graph Paper Sizes Explained | FreeGridPaper',
    description: 'Compare common graph paper spacing options and when to use each one.',
    h1: 'Graph Paper Sizes Explained',
    summary: 'Use 5 mm or 1/4 inch for everyday graph paper; use 1 cm when metric scale is more important.',
    answerSummary: '5 mm and 1/4 inch graph paper cover most classroom, note-taking, and sketching needs. Choose 1 cm when you need larger metric blocks for diagrams, counting, or planning.',
    referenceFacts: [
      { label: '5 mm in inches', value: '0.197 inch' },
      { label: '1/4 inch in mm', value: '6.35 mm' },
      { label: 'Best general-purpose choices', value: '5 mm or 1/4 inch' },
      { label: 'Best large metric option', value: '1 cm' },
    ],
    bestFor: ['Everyday school graph paper', 'Math notes and charts', 'Choosing between metric and imperial spacing'],
    body: [
      {
        heading: 'How to choose a grid size',
        body: 'Pick the smallest grid that still leaves comfortable writing room. Denser grids fit more information on one page, while larger grids are easier for diagrams, young learners, and high-visibility work.',
        items: ['Use 5 mm for compact notes and most metric worksheets.', 'Use 1/4 inch for common US classroom graph paper.', 'Use 1 cm for larger labels, plotting, or counting blocks.'],
      },
      {
        heading: 'Metric and imperial conversions',
        body: 'Many printable graph paper searches are really comparison searches. Listing the exact conversion helps users and crawlers understand that 1/4 inch is slightly larger than 5 mm, while 1 cm is noticeably larger than both.',
      },
      {
        heading: 'Printing guidance',
        body: 'Always print graph paper at Actual Size or 100% scale. Even small automatic scaling changes will distort the real-world measurement of each square.',
      },
    ],
    primaryTemplateId: 'graph-paper',
    primaryPresetId: 'five-mm-graph-paper',
    relatedTemplateIds: ['graph-paper'],
    relatedPresetIds: ['quarter-inch-graph-paper', 'one-centimeter-graph-paper', 'five-mm-graph-paper'],
    relatedQuestions: [
      { question: 'How does 5 mm compare to 1/4 inch graph paper?', answer: '5 mm squares are smaller than 1/4 inch squares. Use 5 mm when you want a denser page and 1/4 inch when you want slightly more writing room.', href: '/guides/five-mm-vs-quarter-inch-graph-paper' },
      { question: 'Which graph paper size is best for engineering homework?', answer: '5 mm graph paper is usually the safest starting point because it balances precision with enough room for notes and sketches.', href: '/guides/best-graph-paper-for-engineering-homework' },
    ],
  }),
  guide({
    id: 'five-mm-vs-quarter-inch-graph-paper',
    title: '5 mm vs 1/4 Inch Graph Paper | FreeGridPaper',
    description: 'See the exact difference between 5 mm and quarter-inch graph paper for school, engineering, and planning.',
    h1: '5 mm vs 1/4 Inch Graph Paper',
    summary: '5 mm graph paper is denser than 1/4 inch graph paper, while 1/4 inch gives slightly more writing room per square.',
    answerSummary: 'Choose 5 mm when you want more squares per page and tighter spacing. Choose 1/4 inch when you want a slightly roomier grid that still feels standard in US classrooms.',
    referenceFacts: [
      { label: '5 mm', value: '0.197 inch' },
      { label: '1/4 inch', value: '6.35 mm' },
      { label: 'Difference per square', value: '1.35 mm larger for 1/4 inch' },
      { label: 'Better for dense notes', value: '5 mm' },
    ],
    bestFor: ['Comparing popular graph-paper sizes', 'Picking between metric and imperial defaults', 'Students moving between A4 and Letter workflows'],
    body: [
      {
        heading: 'Why the difference matters',
        body: 'The spacing difference seems small, but over a full page it changes how much data, labeling, and drawing detail fits comfortably on the sheet.',
      },
      {
        heading: 'When 5 mm wins',
        body: 'Use 5 mm for denser worksheets, compact engineering notes, or when you want more graph squares on an A4 page.',
      },
      {
        heading: 'When 1/4 inch wins',
        body: 'Use 1/4 inch when you want a roomier, familiar US classroom format for plotting, arithmetic, and general graphing.',
      },
    ],
    primaryTemplateId: 'graph-paper',
    primaryPresetId: 'quarter-inch-graph-paper',
    relatedTemplateIds: ['graph-paper'],
    relatedPresetIds: ['quarter-inch-graph-paper', 'five-mm-graph-paper'],
  }),
  guide({
    id: 'college-ruled-vs-wide-ruled',
    title: 'College Ruled vs Wide Ruled Paper | FreeGridPaper',
    description: 'Understand the spacing difference between college ruled and wide ruled paper and when to use each one.',
    h1: 'College Ruled vs Wide Ruled Paper',
    summary: 'College ruled fits more lines per page, while wide ruled provides more room for larger handwriting and younger students.',
    answerSummary: 'Use college ruled paper when you want more lines and smaller handwriting. Use wide ruled paper when readability and larger letterforms matter more than total line count.',
    referenceFacts: [
      { label: 'College ruled spacing', value: '7.1 mm' },
      { label: 'Wide ruled spacing', value: '8.7 mm' },
      { label: 'Best for older students', value: 'College ruled' },
      { label: 'Best for larger handwriting', value: 'Wide ruled' },
    ],
    bestFor: ['Choosing school writing paper', 'Comparing ruled-paper formats', 'Parents and teachers selecting printable worksheets'],
    body: [
      {
        heading: 'Line count versus writing room',
        body: 'College ruled packs more lines onto the page, which helps with longer notes. Wide ruled trades line count for more vertical room, making it easier to keep handwriting legible.',
      },
      {
        heading: 'Who usually prefers each format',
        body: 'Wide ruled is often easier for children or anyone with larger handwriting. College ruled is usually better for older students, lecture notes, journaling, and compact written work.',
      },
      {
        heading: 'Printing guidance',
        body: 'If the ruled spacing is part of a classroom requirement, print at Actual Size so each line stays true to the intended measurement.',
      },
    ],
    primaryTemplateId: 'lined-paper',
    primaryPresetId: 'college-ruled-paper',
    relatedTemplateIds: ['lined-paper', 'handwriting'],
    relatedPresetIds: ['college-ruled-paper', 'wide-ruled-paper'],
  }),
  guide({
    id: 'common-hex-grid-sizes',
    title: 'Common Hex Grid Sizes | FreeGridPaper',
    description: 'Compare standard printable hex sizes for tabletop maps, miniatures, and planning sheets.',
    h1: 'Common Hex Grid Sizes',
    summary: '1 inch hexes are the default for many tabletop uses, while 3/4 inch hexes fit more map area on the page.',
    answerSummary: 'Use 1 inch hexes when the paper needs to work with standard miniatures or clearly readable tactical maps. Use 3/4 inch hexes when you need more territory on a single sheet and can accept tighter detail.',
    referenceFacts: [
      { label: '1 inch in mm', value: '25.4 mm' },
      { label: '3/4 inch in mm', value: '19.05 mm' },
      { label: 'Best miniatures default', value: '1 inch hexes' },
      { label: 'Best compact option', value: '3/4 inch hexes' },
    ],
    bestFor: ['D&D and tabletop map planning', 'Comparing hex sizes before printing', 'Choosing between readability and map density'],
    body: [
      {
        heading: 'Hex size controls map usability',
        body: 'The hex size changes how easy the map is to read, annotate, and use with tokens or miniatures. Larger hexes feel more comfortable at the table, while smaller hexes fit larger regions on the same sheet.',
      },
      {
        heading: 'Choosing between Letter and poster sizes',
        body: 'For encounter maps on standard printers, start with 1 inch hexes on Letter. For campaign or wall maps, move to poster sizes so the hexes stay usable while the map area expands.',
      },
      {
        heading: 'Printing guidance',
        body: 'Measure one printed hex after export. If the hex width is off, the print dialog is scaling the PDF and the map will not match the intended tabletop size.',
      },
    ],
    primaryTemplateId: 'hex-grid',
    primaryPresetId: 'one-inch-hex-grid-paper',
    relatedTemplateIds: ['hex-grid', 'poster-hex'],
    relatedPresetIds: ['one-inch-hex-grid-paper', 'three-quarter-inch-hex-grid-paper'],
  }),
  guide({
    id: 'a4-vs-letter-dot-grid',
    title: 'A4 vs Letter Dot Grid Paper | FreeGridPaper',
    description: 'Choose between A4 and US Letter dot grid paper for bullet journals, notes, and printable planning pages.',
    h1: 'A4 vs Letter Dot Grid Paper',
    summary: 'A4 is better for international printing workflows, while Letter is the better default for US home and school printers.',
    answerSummary: 'Pick the page size that matches the paper in your printer first, then keep the dot spacing consistent. For most dot-grid use, the page size matters less than printing on the correct physical sheet.',
    referenceFacts: [
      { label: 'A4 size', value: '210 x 297 mm' },
      { label: 'Letter size', value: '8.5 x 11 inches' },
      { label: 'Common bullet journal spacing', value: '5 mm dots' },
      { label: 'Best rule', value: 'Match the paper in your printer' },
    ],
    bestFor: ['Bullet journal printables', 'Choosing between A4 and US Letter', 'Home printing without scaling errors'],
    body: [
      {
        heading: 'Dot spacing stays the same',
        body: 'Most users want 5 mm dot spacing no matter which page size they choose. The practical decision is whether the sheet needs to fit A4 or Letter paper without automatic resizing.',
      },
      {
        heading: 'When A4 is better',
        body: 'A4 is the better choice for international printers, school systems, and planners built around metric dimensions.',
      },
      {
        heading: 'When Letter is better',
        body: 'Letter is the better default for most US classrooms, offices, and home printers that already use 8.5 x 11 inch paper.',
      },
    ],
    primaryTemplateId: 'dot-grid',
    primaryPresetId: 'a4-dot-grid-paper',
    relatedTemplateIds: ['dot-grid'],
    relatedPresetIds: ['a4-dot-grid-paper', 'letter-dot-grid-paper'],
  }),
  guide({
    id: 'best-dot-grid-spacing-for-bullet-journaling',
    title: 'Best Dot Grid Spacing for Bullet Journaling | FreeGridPaper',
    description: 'Choose dot spacing for bullet journals, planners, and design notes.',
    h1: 'Best Dot Grid Spacing for Bullet Journaling',
    summary: '5 mm dot spacing is the most common bullet-journal choice because it balances structure and writing room.',
    answerSummary: 'For most printable bullet-journal pages, 5 mm spacing is the safest default. It gives enough structure for lists and layouts without making the page feel crowded.',
    referenceFacts: [
      { label: 'Best default spacing', value: '5 mm' },
      { label: 'Typical dot size', value: 'Small to medium' },
      { label: 'Useful opacity range', value: 'Subtle to moderate' },
    ],
    bestFor: ['Bullet journals', 'Habit trackers', 'Planner layouts'],
    body: [
      {
        heading: 'Why 5 mm is common',
        body: '5 mm spacing is tight enough for checklists and layout grids, but loose enough for handwriting, small sketches, and tracker boxes.',
      },
      {
        heading: 'When to use looser spacing',
        body: 'Increase the spacing when you want a more open notebook feel, larger lettering, or design pages that use boxes and diagrams.',
      },
      {
        heading: 'Printing guidance',
        body: 'For print-friendly bullet-journal paper, keep the dots light enough to guide the page without competing with handwriting.',
      },
    ],
    primaryTemplateId: 'dot-grid',
    primaryPresetId: 'a4-dot-grid-paper',
    relatedTemplateIds: ['dot-grid'],
    relatedPresetIds: ['a4-dot-grid-paper', 'letter-dot-grid-paper'],
  }),
  guide({
    id: 'best-graph-paper-for-engineering-homework',
    title: 'Best Graph Paper for Engineering Homework | FreeGridPaper',
    description: 'Choose printable graph paper for engineering homework, technical notes, and problem sets.',
    h1: 'Best Graph Paper for Engineering Homework',
    summary: '5 mm graph paper is the best default for engineering homework because it offers precise spacing without wasting page area.',
    answerSummary: 'Start with 5 mm graph paper for engineering homework. It supports calculations, diagrams, and labeling well, and it prints cleanly on standard A4 or Letter pages.',
    referenceFacts: [
      { label: 'Best default spacing', value: '5 mm' },
      { label: 'Alternative US-friendly spacing', value: '1/4 inch' },
      { label: 'Best template for engineering look', value: 'Engineering paper' },
    ],
    bestFor: ['Engineering class problem sets', 'Technical notes', 'Hand-drawn diagrams with measurements'],
    body: [
      {
        heading: 'Why 5 mm is the default',
        body: '5 mm provides enough precision for diagrams and calculations while leaving adequate room for annotation, axes, and labels.',
      },
      {
        heading: 'When engineering paper helps',
        body: 'If you prefer the classic green-on-yellow look or want a stronger technical-paper aesthetic, use the engineering template while keeping the grid spacing practical.',
      },
      {
        heading: 'Printing guidance',
        body: 'Export the PDF, then print at Actual Size. Engineering assignments often depend on accurate spacing for neat work and consistent scale.',
      },
    ],
    primaryTemplateId: 'engineering',
    primaryPresetId: 'five-mm-graph-paper',
    relatedTemplateIds: ['graph-paper', 'engineering'],
    relatedPresetIds: ['five-mm-graph-paper', 'quarter-inch-graph-paper'],
  }),
  guide({
    id: 'how-to-print-at-actual-size',
    title: 'How to Print at Actual Size | FreeGridPaper',
    description: 'Learn how to print grid paper PDFs without scaling errors.',
    h1: 'How to Print at Actual Size',
    summary: 'Set the print dialog to Actual Size or 100% scale whenever exact spacing matters.',
    answerSummary: 'The most important printing setting is Actual Size or 100% scale. Disable Fit to Page, Shrink to Fit, or similar automatic resizing features before printing.',
    referenceFacts: [
      { label: 'Required print scaling', value: 'Actual Size or 100%' },
      { label: 'Avoid', value: 'Fit to Page and Shrink to Fit' },
      { label: 'Best verification', value: 'Measure one printed square or line gap' },
    ],
    bestFor: ['Any template with real-world measurements', 'Classroom worksheets', 'Gaming maps and gauge-sensitive crafts'],
    body: [
      {
        heading: 'Why print scaling breaks measurements',
        body: 'Printable paper only works as intended when the exported PDF is printed at its real size. Automatic scaling changes the physical dimensions of every square, dot, line, or hex.',
      },
      {
        heading: 'What to check in the print dialog',
        body: 'Use the printer setting called Actual Size, 100% scale, or equivalent. Turn off any option that tries to fit the PDF inside the printable area automatically.',
      },
      {
        heading: 'How to verify the result',
        body: 'After printing, measure one grid square or one ruled spacing with a ruler. If the value is off, check scaling again before printing more pages.',
      },
    ],
    primaryTemplateId: 'graph-paper',
    primaryPresetId: 'five-mm-graph-paper',
    relatedTemplateIds: ['graph-paper', 'dot-grid', 'hex-grid'],
    relatedPresetIds: ['five-mm-graph-paper', 'one-inch-hex-grid-paper'],
  }),
  guide({
    id: 'handwriting-paper-by-grade-level',
    title: 'Handwriting Paper by Grade Level | FreeGridPaper',
    description: 'Choose handwriting guide spacing for early learners and classroom practice.',
    h1: 'Handwriting Paper by Grade Level',
    summary: 'Younger writers usually need larger guide spacing; reduce line height as control improves.',
    answerSummary: 'Kindergarten and early primary students usually benefit from larger handwriting guides. As letter control improves, move to smaller guide spacing or standard wide-ruled paper.',
    referenceFacts: [
      { label: 'Best for kindergarten', value: 'Large handwriting guides' },
      { label: 'Transition option', value: 'Wide ruled paper' },
      { label: 'Advanced option', value: 'Smaller handwriting guides or college ruled' },
    ],
    bestFor: ['Teachers choosing handwriting worksheets', 'Parents printing practice pages at home', 'Moving students from guided writing to lined paper'],
    body: [
      {
        heading: 'Start larger for early writers',
        body: 'Large handwriting guides make it easier to place letters on the baseline, understand ascenders and descenders, and maintain spacing between letters and words.',
      },
      {
        heading: 'Reduce spacing as control improves',
        body: 'Once letter formation is more consistent, narrower handwriting lines or standard ruled paper helps students adjust to everyday classroom writing.',
      },
      {
        heading: 'Printing guidance',
        body: 'If you are printing repeated practice sheets, keep the sizing consistent across sessions so students build reliable motor patterns.',
      },
    ],
    primaryTemplateId: 'handwriting',
    primaryPresetId: 'kindergarten-handwriting-paper',
    relatedTemplateIds: ['handwriting', 'lined-paper'],
    relatedPresetIds: ['kindergarten-handwriting-paper', 'wide-ruled-paper'],
  }),
  guide({
    id: 'best-blank-music-paper-for-piano-and-guitar',
    title: 'Best Blank Music Paper for Piano and Guitar | FreeGridPaper',
    description: 'Choose between staff paper and tablature paper for piano, guitar, and music lessons.',
    h1: 'Best Blank Music Paper for Piano and Guitar',
    summary: 'Use standard staff paper for piano and notation-focused work, and use tablature paper when the instrument-specific fingering layout matters more.',
    answerSummary: 'Piano work usually starts on staff paper. Guitar work can use staff paper, guitar tab, or both depending on whether the focus is notation, fingering, or transcription.',
    referenceFacts: [
      { label: 'Best for piano', value: 'Staff paper' },
      { label: 'Best for guitar riffs', value: 'Guitar tablature' },
      { label: 'Best mixed workflow', value: 'Staff paper plus guitar tab' },
    ],
    bestFor: ['Music teachers', 'Students printing blank notation sheets', 'Guitar players deciding between staff and tab'],
    body: [
      {
        heading: 'When to use staff paper',
        body: 'Staff paper is the best choice for piano, harmony, theory, and any situation where pitch relationships and notation conventions matter more than instrument fingering.',
      },
      {
        heading: 'When to use guitar tab',
        body: 'Guitar tab is faster for riff writing, fretboard patterns, and many lesson handouts because it maps directly to the string layout of the instrument.',
      },
      {
        heading: 'Printing guidance',
        body: 'Use fewer staves per page when you want room for chord symbols, lyrics, technique notes, or teacher annotations.',
      },
    ],
    primaryTemplateId: 'music-staff',
    primaryPresetId: 'blank-sheet-music-10-staves',
    relatedTemplateIds: ['music-staff', 'guitar-tab', 'bass-tab'],
    relatedPresetIds: ['blank-sheet-music-10-staves', 'blank-guitar-tab-paper', 'blank-bass-tab-paper'],
  }),
  guide({
    id: 'how-to-choose-hex-size-for-dnd-maps',
    title: 'How to Choose Hex Size for D&D Maps | FreeGridPaper',
    description: 'Pick the right hex size for tabletop maps, miniatures, and campaign planning.',
    h1: 'How to Choose Hex Size for D&D Maps',
    summary: 'Use 1 inch hexes for miniatures and smaller hexes when you need more map area on one sheet.',
    answerSummary: 'If the map will be used directly with miniatures, 1 inch hexes are the safest choice. Use smaller hexes only when you need a denser regional or overland layout.',
    referenceFacts: [
      { label: 'Miniatures default', value: '1 inch hexes' },
      { label: 'Compact alternative', value: '3/4 inch hexes' },
      { label: 'Best large-format option', value: 'Poster hex grid' },
    ],
    bestFor: ['D&D battle maps', 'Hex-based strategy maps', 'Campaign and overland planning'],
    body: [
      {
        heading: 'Tactical maps versus regional maps',
        body: 'Tactical maps need enough room for tokens, miniatures, and labels. Regional maps can use smaller hexes because the focus is area coverage rather than exact tabletop placement.',
      },
      {
        heading: 'When to move to poster sizes',
        body: 'Large encounters, wall displays, and persistent campaign maps benefit from poster-size hex paper because it preserves usable hex size while giving you much more map area.',
      },
      {
        heading: 'Printing guidance',
        body: 'Measure a printed hex before building a full campaign map around it. Scaling mistakes are much more painful once the map is annotated.',
      },
    ],
    primaryTemplateId: 'poster-hex',
    primaryPresetId: 'one-inch-hex-grid-paper',
    relatedTemplateIds: ['hex-grid', 'poster-hex'],
    relatedPresetIds: ['one-inch-hex-grid-paper', 'three-quarter-inch-hex-grid-paper'],
  }),
  guide({
    id: 'printable-storyboard-sheets',
    title: 'Printable Storyboard Sheets | FreeGridPaper',
    description: 'Choose printable storyboard sheets for film, animation, video, and ad planning.',
    h1: 'Printable Storyboard Sheets',
    summary: 'Storyboard sheets work best when the frame count and note space match the speed of your planning session.',
    answerSummary: 'Use fewer storyboard frames per page when you need more note space and larger thumbnails. Use more frames per page when you are planning fast sequences or rough visual beats.',
    referenceFacts: [
      { label: 'Default frame ratio', value: '16:9' },
      { label: 'Best for note-heavy planning', value: 'Fewer rows' },
      { label: 'Best for rapid iteration', value: 'More frames per page' },
    ],
    bestFor: ['Film and video pre-production', 'Animation thumbnails', 'Commercial and marketing shot planning'],
    body: [
      {
        heading: 'Match the storyboard to the planning stage',
        body: 'Early concept work benefits from larger frames and more note space. Later planning stages can use denser pages when the visual language is already established.',
      },
      {
        heading: 'Choosing rows and columns',
        body: 'More frames per page speed up rough ideation, while fewer frames make it easier to annotate camera moves, dialogue, and production details under each panel.',
      },
      {
        heading: 'Printing guidance',
        body: 'Print a sample page first so you can confirm there is enough space for handwritten notes and timing cues.',
      },
    ],
    primaryTemplateId: 'storyboard',
    primaryPresetId: '16-9-storyboard-template',
    relatedTemplateIds: ['storyboard', 'comic-layout'],
    relatedPresetIds: ['16-9-storyboard-template'],
  }),
  guide({
    id: 'printable-comic-panel-paper',
    title: 'Printable Comic Panel Paper | FreeGridPaper',
    description: 'Use printable comic panel paper for thumbnails, manga pages, and comic-page planning.',
    h1: 'Printable Comic Panel Paper',
    summary: 'Comic panel paper is best when you want consistent page structure without spending time measuring panel boxes.',
    answerSummary: 'Start with a simple 2x3 comic layout when you need a general-purpose printable page for thumbnails or page planning. Use it as a fast structure, then customize the art on top.',
    referenceFacts: [
      { label: 'Best default layout', value: '2x3 panels' },
      { label: 'Best use', value: 'Thumbnails and page rhythm planning' },
    ],
    bestFor: ['Comic thumbnails', 'Manga page planning', 'Graphic-novel pacing exercises'],
    body: [
      {
        heading: 'Why fixed panel paper helps',
        body: 'A printable panel template removes measuring and keeps every page on the same rhythm, which is especially useful during scripting, pacing, and thumbnail passes.',
      },
      {
        heading: 'When to use storyboard paper instead',
        body: 'Storyboard sheets are better when each frame needs more written production notes or when the project is screen-based rather than page-based.',
      },
    ],
    primaryTemplateId: 'comic-layout',
    relatedTemplateIds: ['comic-layout', 'storyboard'],
    relatedPresetIds: ['16-9-storyboard-template'],
  }),
  guide({
    id: 'printable-knitting-chart-paper',
    title: 'Printable Knitting Chart Paper | FreeGridPaper',
    description: 'Choose printable knitting chart paper that matches real stitch proportions and planning needs.',
    h1: 'Printable Knitting Chart Paper',
    summary: 'Knitting chart paper works best when the printable rectangles reflect the actual width-to-height ratio of your stitches.',
    answerSummary: 'Use knitting chart paper instead of ordinary graph paper when stitch proportions matter. A rectangular grid gives a more accurate preview of how motifs will look once knitted.',
    referenceFacts: [
      { label: 'Best template', value: 'Knitting graph paper' },
      { label: 'Why it differs from graph paper', value: 'Stitches are not usually square' },
    ],
    bestFor: ['Colorwork planning', 'Knitting charts', 'Cross-stitch and craft pattern drafts'],
    body: [
      {
        heading: 'Why ordinary graph paper falls short',
        body: 'Square graph paper can distort the look of a knitted motif because real stitches often render taller or wider than a square. Rectangular cells help the chart reflect the finished material more accurately.',
      },
      {
        heading: 'How to choose the right ratio',
        body: 'Measure a swatch first, then pick or adjust a printable grid that reflects the stitch and row proportions you actually knit.',
      },
      {
        heading: 'Printing guidance',
        body: 'Keep the same page setup throughout a project so all charts stay visually consistent when compared side by side.',
      },
    ],
    primaryTemplateId: 'knitting',
    relatedTemplateIds: ['knitting', 'graph-paper'],
    relatedPresetIds: [],
  }),
  guide({
    id: 'music-staff-spacing-guide',
    title: 'Music Staff Spacing Guide | FreeGridPaper',
    description: 'Choose blank sheet music and tablature spacing for notation and lessons.',
    h1: 'Music Staff Spacing Guide',
    summary: 'Use fewer staves when you need room for lyrics, analysis, or teacher notes.',
    answerSummary: 'The right number of staves depends on how much annotation the page needs. Denser staff layouts maximize writing space for notes, while looser layouts help with teaching, lyrics, and analysis.',
    referenceFacts: [
      { label: 'Best for compact notation', value: 'More staves per page' },
      { label: 'Best for annotation', value: 'Fewer staves per page' },
    ],
    bestFor: ['Composition sheets', 'Music theory handouts', 'Teacher or student notation pages'],
    body: [
      {
        heading: 'Balancing notes and margin space',
        body: 'Composition-heavy pages can use more staves per page. Lesson sheets often need fewer staves so there is room for fingering, lyrics, or teacher comments.',
      },
      {
        heading: 'Choosing between staff and tablature',
        body: 'If the assignment focuses on pitch and rhythm relationships, use staff paper. If it focuses on fretboard positions, guitar or bass tablature may be more effective.',
      },
    ],
    primaryTemplateId: 'music-staff',
    primaryPresetId: 'blank-sheet-music-10-staves',
    relatedTemplateIds: ['music-staff', 'guitar-tab', 'bass-tab'],
    relatedPresetIds: ['blank-sheet-music-10-staves', 'blank-guitar-tab-paper', 'blank-bass-tab-paper'],
  }),
  guide({
    id: 'how-to-plot-points-on-a-coordinate-plane',
    title: 'How to Plot Points on a Coordinate Plane | FreeGridPaper',
    description: 'Learn to read quadrants, count from the origin, and plot ordered pairs on a printable coordinate plane.',
    h1: 'How to Plot Points on a Coordinate Plane',
    summary: 'Start at the origin, move horizontally for x first, then vertically for y, and count squares, not page edges.',
    answerSummary: 'An ordered pair (x, y) always means x first, then y. From the origin, move right for positive x and left for negative x, then up for positive y and down for negative y. On the FreeGridPaper plane, one square is one unit, and bold lines and numbers mark every five units.',
    referenceFacts: [
      { label: 'Origin', value: '(0, 0), where the axes cross' },
      { label: 'Quadrant I', value: 'x positive, y positive, top right' },
      { label: 'Quadrant II', value: 'x negative, y positive, top left' },
      { label: 'Quadrant III', value: 'x negative, y negative, bottom left' },
      { label: 'Quadrant IV', value: 'x positive, y negative, bottom right' },
      { label: 'Major lines', value: 'Every five units, on the printable plane' },
    ],
    bestFor: ['Algebra homework and graphing', 'Plotting ordered pairs for the first time', 'Checking slope and intercepts on paper'],
    body: [
      {
        heading: 'Read the axes before you plot',
        body: 'The horizontal axis is x and the vertical axis is y. The sign of each number tells you the direction from the origin, and the quadrant tells you whether you should end up in the top right, top left, bottom left, or bottom right. If your point lands in a different quadrant from the signs, you swapped a direction or swapped x and y.',
        items: ['(3, 4) is right 3, up 4, in Quadrant I.', '(-2, 5) is left 2, up 5, in Quadrant II.', '(-4, -1) is left 4, down 1, in Quadrant III.', '(5, -3) is right 5, down 3, in Quadrant IV.'],
      },
      {
        heading: 'Count from the origin, not from the edge',
        body: 'The most common plotting error is counting squares from the edge of the page. Always start at the labelled 0 where the axes cross. On this plane, count one square per unit, and use the bold lines as checkpoints: the first bold line out from the origin is five units, the next is ten, and so on. That checkpoint catches a miscount before it becomes a wrong graph.',
      },
      {
        heading: 'Common mistakes to check',
        body: 'Swap x and y and the point mirrors across the diagonal. Miss a negative sign and the point jumps to the opposite side of an axis. Plot a line by plotting at least two points, then check a third, because a single wrong point can hide behind a straight looking line that is actually shifted.',
      },
      {
        heading: 'Printing guidance',
        body: 'Print at Actual Size or 100% scale so one square stays one unit. The default 1/4 inch plane is a familiar classroom size; use 5 mm if you want more points on one page.',
      },
    ],
    primaryTemplateId: 'coordinate-plane',
    primaryPresetId: 'quarter-inch-coordinate-plane',
    relatedTemplateIds: ['coordinate-plane', 'graph-paper'],
    relatedPresetIds: ['quarter-inch-coordinate-plane', 'quarter-inch-graph-paper'],
    relatedQuestions: [
      { question: 'Which number comes first in an ordered pair?', answer: 'x comes first, then y. Move horizontally for x, then vertically for y, always starting from the origin.', href: '/guides/graph-paper-sizes-explained' },
    ],
    updatedAt: '2026-11-01',
  }),
  guide({
    id: 'cornell-note-taking-method',
    title: 'The Cornell Note Taking Method | FreeGridPaper',
    description: 'Use the Cornell method: notes on the right, cues and questions on the left, and a summary at the bottom after review.',
    h1: 'The Cornell Note Taking Method',
    summary: 'Record notes during class, add cues and questions after, recite from the cues, then write the summary last, not first.',
    answerSummary: 'Cornell notes split the page into three jobs. The wide right column is for recording notes during a lecture or reading. The narrow left column is for cues, questions, and key words, added after the session. The bottom section is for a summary written after review, which is what makes the page useful for revision instead of just a transcript.',
    referenceFacts: [
      { label: 'Cue column', value: 'About 30 percent of the width, on the left' },
      { label: 'Notes column', value: 'The wider right column' },
      { label: 'Summary section', value: 'Seven lines tall, at the bottom' },
      { label: 'College ruled', value: '7.1 mm line spacing' },
      { label: 'Wide ruled', value: '8.7 mm line spacing' },
    ],
    bestFor: ['Lecture and class notes', 'Textbook and reading notes', 'Revision from cues instead of rereading'],
    body: [
      {
        heading: 'Record, in the right column only',
        body: 'During the lecture, write in the wide right column and leave the left column blank. Capture main ideas, definitions, and examples in your own words where you can, because copying word for word is slower and harder to revise from later.',
      },
      {
        heading: 'Reduce, within a day if you can',
        body: 'Soon after the session, go back and fill the left column with short cues: questions the notes answer, key terms, and prompts for the main ideas. This step is the method, not an extra. If you skip it, you have lined paper with a divider, not Cornell notes.',
        items: ['Turn a heading into a question, for example, what does this term mean, or why does this step matter.', 'Keep cues short, one phrase per line, so they work as recall prompts.', 'Star cues you could not answer without looking, and revisit those first.'],
      },
      {
        heading: 'Recite, then summarise',
        body: 'Cover the right column, read a cue, and say the answer out loud before checking. That retrieval step is what builds memory; rereading the notes column without covering it feels easier and teaches less. Only after reciting should you write the summary at the bottom, in a few sentences, in your own words. A summary written before review is usually just a repeat of the first paragraph.',
      },
      {
        heading: 'Printing guidance',
        body: 'Print at Actual Size or 100% scale. College ruled fits more lines per page, wide ruled gives more room per line, and the summary section stays seven lines tall at either spacing.',
      },
    ],
    primaryTemplateId: 'cornell-notes',
    primaryPresetId: 'college-cornell-notes',
    relatedTemplateIds: ['cornell-notes', 'lined-paper'],
    relatedPresetIds: ['college-cornell-notes', 'college-ruled-paper'],
    relatedQuestions: [
      { question: 'When should I write the summary?', answer: 'After review and reciting, not during the lecture. The summary should capture what you now understand, in your own words.', href: '/guides/college-ruled-vs-wide-ruled' },
    ],
    updatedAt: '2026-11-01',
  }),
  guide({
    id: 'how-to-plot-polar-coordinates',
    title: 'How to Plot Polar Coordinates | FreeGridPaper',
    description: 'Learn to read polar grid paper: count rings out from the centre for r, and use spokes and angle labels for theta.',
    h1: 'How to Plot Polar Coordinates',
    summary: 'Polar points are (r, theta): count rings out from the centre for distance, then follow the spoke for the angle.',
    answerSummary: 'A polar point (r, theta) is not x then y. r is how many rings out from the centre you go, and theta is the angle from the positive horizontal axis, measured counter-clockwise. On the FreeGridPaper polar grid, spokes run every 15 degrees, angle labels run every 30 degrees, and the cardinal spokes at 0, 90, 180, and 270 degrees are bold.',
    referenceFacts: [
      { label: 'r', value: 'Distance from the centre, counted in rings' },
      { label: 'Theta', value: 'Angle from the positive horizontal axis, counter-clockwise' },
      { label: 'Spokes', value: 'Every 15 degrees' },
      { label: 'Angle labels', value: 'Every 30 degrees, outside the outer circle' },
      { label: 'Default ring spacing', value: '10 mm, nine rings on Letter paper' },
    ],
    bestFor: ['Polar equations and trigonometry', 'Angles, circles, and circular motion', 'Converting between polar and rectangular thinking'],
    body: [
      {
        heading: 'Plot in two steps, angle then distance, or distance then angle',
        body: 'Either order works if you keep them separate. Find the angle first by following the labelled spoke from the centre, then count rings out along that spoke. Or count rings first on the 0 degree spoke, then rotate to the angle. Mixing the two, for example counting rings along the wrong spoke, is the usual error.',
        items: ['(3, 60 degrees) is three rings out along the 60 degree spoke, up and to the right.', '(4, 180 degrees) is four rings out to the left, on the bold horizontal spoke.', '(2, 270 degrees) is two rings straight down.'],
      },
      {
        heading: 'What about negative r and angles over 360 degrees',
        body: 'A negative r means go the same distance in the opposite direction: (3, 60 degrees) with r negated lands where (3, 240 degrees) lands. An angle over 360 degrees just wraps around the circle again, so 390 degrees is the same spoke as 30 degrees. Keep the centre marked, because every ring and spoke is measured from there, not from the edge of the page.',
      },
      {
        heading: 'Common mistakes to check',
        body: 'Measuring the angle from the vertical axis instead of the horizontal axis rotates the whole plot by 90 degrees. Counting rings from the outer circle inward reverses r. Using radians when the labels are in degrees, or vice versa, shifts every point, so check the unit before you start.',
      },
      {
        heading: 'Printing guidance',
        body: 'Print at Actual Size or 100% scale so ring spacing stays as selected. Lower the ring spacing in the generator for more, finer rings, and raise it for fewer, larger rings.',
      },
    ],
    primaryTemplateId: 'polar-grid',
    primaryPresetId: 'polar-grid-10mm',
    relatedTemplateIds: ['polar-grid', 'coordinate-plane'],
    relatedPresetIds: ['polar-grid-10mm'],
    relatedQuestions: [
      { question: 'How is a polar point different from an ordered pair?', answer: 'An ordered pair gives x then y from the origin. A polar point gives distance from the centre, then angle from the horizontal axis.', href: '/guides/how-to-plot-points-on-a-coordinate-plane' },
    ],
    updatedAt: '2026-11-01',
  }),
  guide({
    id: 'how-to-draw-isometric-on-grid-paper',
    title: 'How to Draw Isometric on Grid Paper | FreeGridPaper',
    description: 'Draw cubes and 3D objects on isometric grid paper using vertical edges and 60 and 120 degree edges, with no vanishing point.',
    h1: 'How to Draw Isometric on Grid Paper',
    summary: 'Isometric drawing keeps all three axes at equal scale: vertical edges stay vertical, and the other two edges run along the grid diagonals.',
    answerSummary: 'Isometric paper is not perspective paper. There is no vanishing point, and lengths along all three axes use the same scale, which is why a cube looks consistent from any part of the page. On this grid, one family of lines is horizontal, and the other two run at 60 and 120 degrees, forming equilateral triangles. Draw vertical edges along the page vertical, then draw the other edges along the two diagonal families.',
    referenceFacts: [
      { label: 'Line directions', value: '0, 60, and 120 degrees' },
      { label: 'Triangle side, default', value: '1/4 inch, 6.35 mm' },
      { label: 'Vanishing point', value: 'None, unlike perspective drawing' },
      { label: 'Scale', value: 'Equal along all three axes' },
      { label: 'Lines vs dots', value: 'Lines guide edges, dots leave edges to the eye' },
    ],
    bestFor: ['Cubes, boxes, and 3D sketches', 'Architecture and product sketches', 'Geometry and technical drawing practice'],
    body: [
      {
        heading: 'Draw a cube in three steps',
        body: 'Start with a vertical edge for the front corner of the cube. From its top and bottom, draw edges along the two diagonal families, one going up and to the right at 60 degrees, the other going down and to the right at 120 degrees, or the mirror of those, depending on which faces you want visible. Close the cube with vertical edges at the far corners, then the remaining diagonal edges. If an edge does not follow a grid family, it is probably a perspective edge sneaking in.',
        items: ['Count the same number of triangles along each edge for a regular cube.', 'Keep parallel edges parallel: in isometric drawing they never converge.', 'Use the horizontal grid lines as a level check for the top and bottom faces.'],
      },
      {
        heading: 'Lines or dots, which to choose',
        body: 'Full lines make it easier to keep edges straight and to count triangles, which helps beginners and technical sketches. Dots are lighter on the page and better for free sketching, where you want guidance without a strong grid showing through. Both use the same triangular lattice, so a sketch started on one can be redrawn on the other without rescaling.',
      },
      {
        heading: 'Common mistakes to check',
        body: 'Drawing one face in perspective, with edges converging, breaks the isometric look even if the rest is correct. Using different lengths for edges that should be equal makes a box look stretched. Starting a cube in the middle of a triangle, instead of on a grid intersection, makes counting harder from the first edge.',
      },
      {
        heading: 'Printing guidance',
        body: 'Print at Actual Size or 100% scale so the triangle size stays as selected. Increase the triangle size in the generator for larger, more forgiving sketches, and decrease it for denser technical work.',
      },
    ],
    primaryTemplateId: 'isometric-grid',
    primaryPresetId: 'quarter-inch-isometric-grid',
    relatedTemplateIds: ['isometric-grid', 'isometric-dots', 'hex-grid'],
    relatedPresetIds: ['quarter-inch-isometric-grid'],
    relatedQuestions: [
      { question: 'What is the difference between isometric grid and isometric dots?', answer: 'Both use the same triangular lattice. Grid paper draws the full lines, dots paper shows only the lattice points, so lines guide edges and dots stay lighter.', href: '/guides/how-to-choose-hex-size-for-dnd-maps' },
    ],
    updatedAt: '2026-11-01',
  }),
];
