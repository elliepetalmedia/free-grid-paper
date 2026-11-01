import type { PresetEntry, TemplateSettings } from './types';

const updatedAt = '2026-05-22';

const preset = (
  id: string,
  label: string,
  templateId: string,
  categoryId: string,
  settings: TemplateSettings,
  title: string,
  description: string,
  h1: string,
  summary: string,
  overrides?: {
    updatedAt?: string;
    useCases?: string[];
    printTips?: string[];
    bestFor?: string[];
  },
): PresetEntry => ({
  kind: 'preset',
  id,
  slug: id,
  path: `/preset/${id}`,
  canonicalPath: `/preset/${id}`,
  indexable: true,
  label,
  templateId,
  categoryId,
  settings,
  title,
  description,
  h1,
  summary,
  answerSummary: `${label} is a stable preset page that opens the generator with proven settings for this paper format.`,
  updatedAt: overrides?.updatedAt ?? updatedAt,
  previewImage: `/previews/presets/${id}.svg`,
  socialImage: `/og/${id}.svg`,
  bestFor: overrides?.bestFor ?? ['Quick printing from a canonical preset page', 'Reusable classroom or home downloads', 'Users who want a known measurement without manual setup'],
  useCases: overrides?.useCases ?? ['Fast printing with proven settings', 'Classroom and home use', 'Reusable stationery downloads'],
  printTips: overrides?.printTips ?? ['Print at Actual Size or 100% scale.', 'Disable Fit to Page when exact measurements matter.'],
  relatedPresetIds: [],
  relatedGuideIds: ['how-to-print-at-actual-size'],
  relatedQuestions: [
    { question: 'Why use a preset page instead of a shared settings URL?', answer: 'Preset pages have stable canonical URLs, unique descriptions, and print guidance, which makes them easier to revisit and cite.' },
  ],
  body: [
    { heading: 'Why this preset works', body: summary },
    { heading: 'Printing guidance', body: 'The generator creates vector PDFs, so lines remain crisp when printed at the selected paper size.' },
  ],
});

export const presets: PresetEntry[] = [
  preset('quarter-inch-graph-paper', '1/4 Inch Graph Paper', 'graph-paper', 'graph-and-grid-paper', { paperType: 'graph-paper', pageSize: 'Letter', gridSize: 6.35, unit: 'inches' } as TemplateSettings, 'Quarter Inch Graph Paper PDF | FreeGridPaper', 'Print quarter-inch graph paper with crisp vector lines on Letter paper.', 'Quarter Inch Graph Paper', 'A familiar grid size for math notes, charts, and general classroom work.'),
  preset('one-centimeter-graph-paper', '1 cm Graph Paper', 'graph-paper', 'graph-and-grid-paper', { paperType: 'graph-paper', pageSize: 'A4', gridSize: 10 }, 'One Centimeter Graph Paper PDF | FreeGridPaper', 'Print 1 cm graph paper on A4 with exact metric spacing.', 'One Centimeter Graph Paper', 'A metric grid for diagrams, geometry, planning, and technical notes.'),
  preset('five-mm-graph-paper', '5 mm Graph Paper', 'graph-paper', 'graph-and-grid-paper', { paperType: 'graph-paper', pageSize: 'A4', gridSize: 5 }, '5 mm Graph Paper PDF | FreeGridPaper', 'Create printable 5 mm graph paper with vector PDF output.', '5 mm Graph Paper', 'A compact metric grid for notes, engineering sketches, charts, and math.'),
  preset('a4-dot-grid-paper', 'A4 Dot Grid Paper', 'dot-grid', 'dot-and-drawing-grids', { paperType: 'dot-grid', pageSize: 'A4', dotSpacing: 5 }, 'A4 Dot Grid Paper PDF | FreeGridPaper', 'Download A4 dot grid paper with common 5 mm bullet-journal spacing.', 'A4 Dot Grid Paper', 'A clean A4 dot grid for bullet journals, notes, layouts, and design sketches.'),
  preset('letter-dot-grid-paper', 'Letter Dot Grid Paper', 'dot-grid', 'dot-and-drawing-grids', { paperType: 'dot-grid', pageSize: 'Letter', dotSpacing: 5 }, 'Letter Dot Grid Paper PDF | FreeGridPaper', 'Download US Letter dot grid paper with subtle printable dots.', 'Letter Dot Grid Paper', 'A US Letter dot-grid layout for planning, journaling, and sketches.'),
  preset('one-inch-hex-grid-paper', '1 Inch Hex Grid Paper', 'hex-grid', 'gaming-and-hex-grids', { paperType: 'hex-grid', pageSize: 'Letter', hexSize: 25.4 }, 'One Inch Hex Grid Paper PDF | FreeGridPaper', 'Print 1 inch hex grid paper for D&D, tabletop maps, and miniatures.', 'One Inch Hex Grid Paper', 'The standard tabletop hex size for miniatures, campaign maps, and encounter planning.'),
  preset('three-quarter-inch-hex-grid-paper', '3/4 Inch Hex Grid Paper', 'hex-grid', 'gaming-and-hex-grids', { paperType: 'hex-grid', pageSize: 'Letter', hexSize: 19.05 }, 'Three Quarter Inch Hex Grid Paper PDF | FreeGridPaper', 'Print 3/4 inch hex grid paper for compact maps and strategy layouts.', '3/4 Inch Hex Grid Paper', 'A denser hex grid for compact tactical maps and larger regions on one page.'),
  preset('college-ruled-paper', 'College Ruled Paper', 'lined-paper', 'writing-and-handwriting-paper', { paperType: 'lined-paper', pageSize: 'Letter', lineHeight: 7.1 }, 'College Ruled Paper PDF | FreeGridPaper', 'Print college ruled lined paper with optional margin line.', 'College Ruled Paper', 'A compact ruled format for notes, school assignments, and everyday writing.'),
  preset('wide-ruled-paper', 'Wide Ruled Paper', 'lined-paper', 'writing-and-handwriting-paper', { paperType: 'lined-paper', pageSize: 'Letter', lineHeight: 8.7 }, 'Wide Ruled Paper PDF | FreeGridPaper', 'Print wide ruled lined paper with crisp vector lines.', 'Wide Ruled Paper', 'A roomier ruled format for larger handwriting and younger students.'),
  preset('kindergarten-handwriting-paper', 'Kindergarten Handwriting Paper', 'handwriting', 'writing-and-handwriting-paper', { paperType: 'handwriting', pageSize: 'Letter', lineHeight: 20 }, 'Kindergarten Handwriting Paper PDF | FreeGridPaper', 'Print large handwriting practice paper for early writing skills.', 'Kindergarten Handwriting Paper', 'Large guided lines for letter formation, spacing, and early penmanship practice.'),
  preset('blank-guitar-tab-paper', 'Blank Guitar Tab Paper', 'guitar-tab', 'music-paper', { paperType: 'guitar-tab', pageSize: 'Letter' }, 'Blank Guitar Tab Paper PDF | FreeGridPaper', 'Print blank guitar tablature paper with six-line staves.', 'Blank Guitar Tab Paper', 'A clean page for guitar riffs, exercises, lessons, and transcription.'),
  preset('blank-bass-tab-paper', 'Blank Bass Tab Paper', 'bass-tab', 'music-paper', { paperType: 'bass-tab', pageSize: 'Letter' }, 'Blank Bass Tab Paper PDF | FreeGridPaper', 'Print blank bass tablature paper with four-line staves.', 'Blank Bass Tab Paper', 'A focused four-line tab format for bass parts and practice notes.'),
  preset('blank-sheet-music-10-staves', 'Blank Sheet Music - 10 Staves', 'music-staff', 'music-paper', { paperType: 'music-staff', pageSize: 'A4', stavesPerPage: 10 }, 'Blank Sheet Music with 10 Staves | FreeGridPaper', 'Print blank sheet music with 10 staves per page.', 'Blank Sheet Music - 10 Staves', 'A balanced staff-paper layout for composition, theory, and transcription.'),
  preset('16-9-storyboard-template', '16:9 Storyboard Template', 'storyboard', 'art-and-storyboarding', { paperType: 'storyboard', pageSize: 'Letter', storyboardCols: 3, storyboardRows: 2 }, '16:9 Storyboard Template PDF | FreeGridPaper', 'Print storyboard paper with 16:9 frames and note space.', '16:9 Storyboard Template', 'A production-friendly storyboard layout for video, film, animation, and ads.'),
  preset('quarter-inch-coordinate-plane', '1/4 Inch Coordinate Plane', 'coordinate-plane', 'graph-and-grid-paper', { paperType: 'coordinate-plane', pageSize: 'Letter', gridSize: 6.35 }, 'Quarter Inch Coordinate Plane PDF | FreeGridPaper', 'Print a four-quadrant coordinate plane with 1/4 inch squares, bold axes, and numbers every five units on Letter paper.', 'Quarter Inch Coordinate Plane', 'A familiar classroom coordinate plane for plotting points, graphing lines, and algebra homework.', { updatedAt: '2026-11-01', useCases: ['Plotting ordered pairs for algebra homework', 'Graphing lines, slope, and intercepts', 'Classroom worksheets with numbered axes'], printTips: ['Print at Actual Size or 100% scale so one square stays one unit.', 'Count from the origin, and use the bold lines as five unit checkpoints.'] }),
  preset('college-cornell-notes', 'College Cornell Notes', 'cornell-notes', 'writing-and-handwriting-paper', { paperType: 'cornell-notes', pageSize: 'Letter', lineHeight: 7.1 }, 'College Cornell Notes Paper PDF | FreeGridPaper', 'Print Cornell notes paper with college ruled spacing, a cue column, and a summary section on Letter paper.', 'College Cornell Notes', 'A compact Cornell layout for lectures, reading notes, and revision, with more lines per page.', { updatedAt: '2026-11-01', useCases: ['Lecture notes with cues added after class', 'Textbook notes summarised after review', 'Revision by reciting from the cue column'], printTips: ['Print at Actual Size or 100% scale.', 'Write the summary after review, not during the lecture.'] }),
  preset('polar-grid-10mm', 'Polar Grid 10 mm', 'polar-grid', 'graph-and-grid-paper', { paperType: 'polar-grid', pageSize: 'Letter', gridSize: 10 }, 'Polar Grid Paper 10 mm PDF | FreeGridPaper', 'Print polar grid paper with 10 mm rings, 15 degree spokes, and angle labels on Letter paper.', 'Polar Grid 10 mm', 'A clear polar grid for polar plots, trigonometry, and circular charts, with nine rings on Letter paper.', { updatedAt: '2026-11-01', useCases: ['Plotting polar coordinates and polar equations', 'Trigonometry and angle worksheets', 'Circular charts and compass work'], printTips: ['Print at Actual Size or 100% scale so ring spacing stays 10 mm.', 'Count rings from the centre, and read angles from the labelled spokes.'] }),
  preset('quarter-inch-isometric-grid', '1/4 Inch Isometric Grid', 'isometric-grid', 'dot-and-drawing-grids', { paperType: 'isometric-grid', pageSize: 'Letter', gridSize: 6.35 }, 'Quarter Inch Isometric Grid PDF | FreeGridPaper', 'Print isometric grid paper with 1/4 inch triangle sides and full lines at 0, 60, and 120 degrees on Letter paper.', 'Quarter Inch Isometric Grid', 'A precise isometric line grid for 3D sketches, architecture, and technical drawing.', { updatedAt: '2026-11-01', useCases: ['Drawing cubes and 3D objects', 'Architecture and product sketches', 'Geometry and technical drawing practice'], printTips: ['Print at Actual Size or 100% scale so the triangle side stays 1/4 inch.', 'Keep parallel edges parallel along the grid families.'] }),
].map((entry, _index, all) => ({
  ...entry,
  relatedPresetIds: all
    .filter((candidate) => candidate.id !== entry.id && candidate.categoryId === entry.categoryId)
    .slice(0, 3)
    .map((candidate) => candidate.id),
}));
