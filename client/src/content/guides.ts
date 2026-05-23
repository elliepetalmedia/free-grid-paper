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
  updatedAt,
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
];
