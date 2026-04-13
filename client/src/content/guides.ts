import type { GuideEntry } from './types';

const previewImage = '/previews/freegridpaper-preview.svg';
const socialImage = '/og/freegridpaper-og.svg';

const guide = (
  id: string,
  title: string,
  description: string,
  h1: string,
  summary: string,
  relatedTemplateIds: string[],
  relatedPresetIds: string[],
): GuideEntry => ({
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
  previewImage,
  socialImage,
  relatedTemplateIds,
  relatedPresetIds,
  body: [
    { heading: 'Quick recommendation', body: summary },
    { heading: 'How to use the generator', body: 'Start with the related template or preset, confirm the paper size, then download a vector PDF and print at Actual Size.' },
  ],
});

export const guides: GuideEntry[] = [
  guide('graph-paper-sizes-explained', 'Graph Paper Sizes Explained | FreeGridPaper', 'Compare common graph paper spacing options and when to use each one.', 'Graph Paper Sizes Explained', 'Use 5 mm or 1/4 inch for everyday graph paper; use 1 cm when metric scale is more important.', ['graph-paper'], ['quarter-inch-graph-paper', 'one-centimeter-graph-paper', 'five-mm-graph-paper']),
  guide('how-to-print-at-actual-size', 'How to Print at Actual Size | FreeGridPaper', 'Learn how to print grid paper PDFs without scaling errors.', 'How to Print at Actual Size', 'Set the print dialog to Actual Size or 100% scale whenever exact spacing matters.', ['graph-paper', 'dot-grid', 'hex-grid'], ['five-mm-graph-paper', 'one-inch-hex-grid-paper']),
  guide('best-dot-grid-spacing-for-bullet-journaling', 'Best Dot Grid Spacing for Bullet Journaling | FreeGridPaper', 'Choose dot spacing for bullet journals, planners, and design notes.', 'Best Dot Grid Spacing for Bullet Journaling', '5 mm dot spacing is the most common bullet-journal choice because it balances structure and writing room.', ['dot-grid'], ['a4-dot-grid-paper', 'letter-dot-grid-paper']),
  guide('how-to-choose-hex-size-for-dnd-maps', 'How to Choose Hex Size for D&D Maps | FreeGridPaper', 'Pick the right hex size for tabletop maps, miniatures, and campaign planning.', 'How to Choose Hex Size for D&D Maps', 'Use 1 inch hexes for miniatures and smaller hexes when you need more map area on one sheet.', ['hex-grid', 'poster-hex'], ['one-inch-hex-grid-paper', 'three-quarter-inch-hex-grid-paper']),
  guide('handwriting-paper-by-grade-level', 'Handwriting Paper by Grade Level | FreeGridPaper', 'Choose handwriting guide spacing for early learners and classroom practice.', 'Handwriting Paper by Grade Level', 'Younger writers usually need larger guide spacing; reduce line height as control improves.', ['handwriting', 'lined-paper'], ['kindergarten-handwriting-paper', 'wide-ruled-paper']),
  guide('music-staff-spacing-guide', 'Music Staff Spacing Guide | FreeGridPaper', 'Choose blank sheet music and tablature spacing for notation and lessons.', 'Music Staff Spacing Guide', 'Use fewer staves when you need room for lyrics, analysis, or teacher notes.', ['music-staff', 'guitar-tab', 'bass-tab'], ['blank-sheet-music-10-staves', 'blank-guitar-tab-paper', 'blank-bass-tab-paper']),
];
