import test from 'node:test';
import assert from 'node:assert/strict';

import { jsPDF } from 'jspdf';
import { DEFAULT_SETTINGS } from '../client/src/generator/settings';
import { COORDINATE_PLANE_MARGIN_MM } from '../client/src/generator/constants';
import { renderBatchPdf, renderPdfPage } from '../client/src/generator/pdf-renderers';
import type { PaperType, Settings } from '../client/src/generator/types';

type Line = [number, number, number, number];
type TextCall = { text: string; x: number; y: number };

interface Recording {
  lines: Line[];
  circles: { x: number; y: number; r: number }[];
  texts: TextCall[];
}

// Record drawing calls from a real jsPDF instance, then also verify
// that the same render produces a real, non-empty PDF. Recording
// alone would be a mock test; the output check proves generation
// actually runs end to end.
function renderRecorded(paperType: PaperType, width: number, height: number, settings: Settings) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [width, height] });
  const recording: Recording = { lines: [], circles: [], texts: [] };
  const originalLine = doc.line.bind(doc);
  const originalCircle = doc.circle.bind(doc);
  const originalText = doc.text.bind(doc);
  (doc as unknown as { line: (...args: unknown[]) => unknown }).line = (...args: unknown[]) => {
    recording.lines.push(args.slice(0, 4) as unknown as Line);
    return originalLine(...(args as [number, number, number, number]));
  };
  (doc as unknown as { circle: (...args: unknown[]) => unknown }).circle = (...args: unknown[]) => {
    recording.circles.push({ x: args[0] as number, y: args[1] as number, r: args[2] as number });
    return originalCircle(...(args as [number, number, number, string]));
  };
  (doc as unknown as { text: (...args: unknown[]) => unknown }).text = (...args: unknown[]) => {
    const text = Array.isArray(args[0]) ? args[0].join(' ') : String(args[0]);
    recording.texts.push({ text, x: args[1] as number, y: args[2] as number });
    return originalText(...(args as [string, number, number]));
  };
  renderPdfPage(doc, width, height, settings, paperType);
  const output = doc.output('arraybuffer') as ArrayBuffer;
  const header = new TextDecoder().decode(output.slice(0, 5));
  return { doc, recording, output, header };
}

const LETTER = { width: 215.9, height: 279.4 };
const A4 = { width: 210, height: 297 };

function baseSettings(overrides: Partial<Settings> = {}): Settings {
  return { ...DEFAULT_SETTINGS, ...overrides };
}

test('coordinate plane stays inside a 6 mm printable margin, Letter and A4, at 6.35 mm spacing', () => {
  for (const size of [LETTER, A4]) {
    const { recording, header, output } = renderRecorded(
      'coordinate-plane',
      size.width,
      size.height,
      baseSettings({ gridSize: 6.35, lineWeight: 0.5 }),
    );
    assert.equal(header, '%PDF-');
    assert.ok(output.byteLength > 1000, 'PDF output is unexpectedly small');
    assert.equal(COORDINATE_PLANE_MARGIN_MM, 6);
    const margin = COORDINATE_PLANE_MARGIN_MM;
    // Non-empty guard: the bounds loop below would pass vacuously
    // on an empty recording, so require a real grid first.
    assert.ok(recording.lines.length > 50, `expected a full coordinate grid, got ${recording.lines.length} lines`);
    assert.ok(recording.texts.length > 10, `expected coordinate labels, got ${recording.texts.length} texts`);
    // Axes: a centre horizontal line spans the printable width and
    // a centre vertical line spans the printable height, and neither
    // touches a page edge. The centre grid line and the axis share
    // these coordinates, so require at least one spanning line each
    // way rather than asserting which of the two a find returns.
    const xSpanning = recording.lines.filter(
      ([, y1, , y2]) => y1 === y2 && Math.abs(y1 - size.height / 2) < 0.01,
    );
    const ySpanning = recording.lines.filter(
      ([x1, , x2]) => x1 === x2 && Math.abs(x1 - size.width / 2) < 0.01,
    );
    assert.ok(xSpanning.length >= 1, 'no centre horizontal line found');
    assert.ok(ySpanning.length >= 1, 'no centre vertical line found');
    assert.ok(
      xSpanning.some(([x1, , x2]) => Math.abs(x1 - margin) < 0.01 && Math.abs(x2 - (size.width - margin)) < 0.01),
      'no horizontal line spans the printable width inside the margin',
    );
    assert.ok(
      ySpanning.some(([, y1, , y2]) => Math.abs(y1 - margin) < 0.01 && Math.abs(y2 - (size.height - margin)) < 0.01),
      'no vertical line spans the printable height inside the margin',
    );
    for (const [x1, y1, x2, y2] of recording.lines) {
      assert.ok(x1 >= margin - 0.01 && x1 <= size.width - margin + 0.01, `line x1 ${x1} outside margin`);
      assert.ok(x2 >= margin - 0.01 && x2 <= size.width - margin + 0.01, `line x2 ${x2} outside margin`);
      assert.ok(y1 >= margin - 0.01 && y1 <= size.height - margin + 0.01, `line y1 ${y1} outside margin`);
      assert.ok(y2 >= margin - 0.01 && y2 <= size.height - margin + 0.01, `line y2 ${y2} outside margin`);
    }
    // Origin stays centred, quadrants stay symmetric, and labels
    // survive: 5, -5, 10, -10, 0, x, and y are all present.
    const labels = new Set(recording.texts.map((t) => t.text));
    for (const label of ['5', '-5', '10', '-10', '0', 'x', 'y']) {
      assert.ok(labels.has(label), `missing coordinate label ${label} on ${size.width}x${size.height}`);
    }
    // Grid spacing is honoured: vertical lines near the centre are
    // 6.35 mm apart, not the 5 mm default. A line is [x1, y1, x2, y2],
    // so a vertical line is x1 equal to x2, not x1 equal to y1. The
    // previous version compared x1 with y1 and found zero lines, so
    // this loop passed without checking anything. Guard both counts.
    const verticalXs = [...new Set(recording.lines.filter(([x1, , x2]) => x1 === x2).map(([x1]) => x1))].sort((a, b) => a - b);
    assert.ok(verticalXs.length > 20, `expected many vertical grid lines, got ${verticalXs.length}`);
    const nearCentre = verticalXs.filter((x) => Math.abs(x - size.width / 2) < 20);
    assert.ok(nearCentre.length >= 5, `expected at least 5 vertical lines near the centre, got ${nearCentre.length}`);
    for (let i = 1; i < nearCentre.length; i++) {
      assert.ok(Math.abs(nearCentre[i] - nearCentre[i - 1] - 6.35) < 0.01, `grid spacing ${nearCentre[i] - nearCentre[i - 1]} is not 6.35 mm`);
    }
  }
});

// Negative control for the spacing assertion: the same measurement
// at 5 mm spacing must measure 5 mm, not 6.35 mm, so the assertion
// above is not a tautology that passes for any grid.
test('coordinate spacing assertion distinguishes 5 mm from 6.35 mm', () => {
  const { recording } = renderRecorded('coordinate-plane', LETTER.width, LETTER.height, baseSettings({ gridSize: 5 }));
  const verticalXs = [...new Set(recording.lines.filter(([x1, , x2]) => x1 === x2).map(([x1]) => x1))].sort((a, b) => a - b);
  const nearCentre = verticalXs.filter((x) => Math.abs(x - LETTER.width / 2) < 20);
  assert.ok(nearCentre.length >= 5, `expected at least 5 vertical lines near the centre, got ${nearCentre.length}`);
  for (let i = 1; i < nearCentre.length; i++) {
    assert.ok(Math.abs(nearCentre[i] - nearCentre[i - 1] - 5) < 0.01, '5 mm grid did not measure 5 mm spacing');
    assert.ok(Math.abs(nearCentre[i] - nearCentre[i - 1] - 6.35) > 0.1, '5 mm grid wrongly measured as 6.35 mm spacing');
  }
});

test('Cornell notes layout: 30 percent cue column, full width rules, summary at the bottom', () => {
  const { recording, header } = renderRecorded('cornell-notes', LETTER.width, LETTER.height, baseSettings({ lineHeight: 7.1 }));
  assert.equal(header, '%PDF-');
  assert.ok(recording.lines.length >= 30, `expected many Cornell ruled lines, got ${recording.lines.length}`);
  const cueX = LETTER.width * 0.3;
  const summaryTop = LETTER.height - 7.1 * 7;
  const cueDivider = recording.lines.find(([x1, , x2]) => Math.abs(x1 - cueX) < 0.01 && Math.abs(x2 - cueX) < 0.01);
  assert.ok(cueDivider, 'cue divider not found');
  assert.ok(Math.abs(cueDivider![3] - summaryTop) < 0.01, 'cue divider does not end at the summary top');
  const summarySeparator = recording.lines.find(([x1, y1, x2, y2]) => Math.abs(y1 - summaryTop) < 0.01 && Math.abs(y2 - summaryTop) < 0.01 && x1 === 0 && Math.abs(x2 - LETTER.width) < 0.01);
  assert.ok(summarySeparator, 'full width summary separator not found');
  for (const [x1, y1, x2, y2] of recording.lines) {
    assert.ok(x1 >= 0 && x2 <= LETTER.width, 'Cornell line outside the page width');
    assert.ok(y1 >= 0 && y2 <= LETTER.height, 'Cornell line outside the page height');
  }
});

test('polar grid: rings, spokes, and labels stay on the page', () => {
  const { recording, header } = renderRecorded('polar-grid', LETTER.width, LETTER.height, baseSettings({ gridSize: 10 }));
  assert.equal(header, '%PDF-');
  // Letter, 10 mm spacing, 8 mm label margin: 9 rings at 10 to 90 mm.
  // Spokes are lines, not circles, so require exactly 24 spoke lines.
  assert.ok(recording.lines.length === 24, `expected 24 polar spokes, got ${recording.lines.length}`);
  assert.ok(recording.circles.length >= 9, `expected at least 9 polar circles, got ${recording.circles.length}`);
  assert.equal(recording.circles.filter((c) => c.r > 1).length, 9);
  const maxRadius = Math.min(LETTER.width, LETTER.height) / 2 - 8;
  assert.ok(Math.max(...recording.circles.map((c) => c.r)) <= maxRadius + 0.01);
  for (let angle = 0; angle < 360; angle += 30) {
    const label = `${angle}°`;
    assert.ok(recording.texts.some((t) => t.text === label), `missing polar label ${label}`);
  }
  for (const [x1, y1, x2, y2] of recording.lines) {
    assert.ok(x1 >= 0 && x1 <= LETTER.width && x2 >= 0 && x2 <= LETTER.width, 'polar spoke outside the page width');
    assert.ok(y1 >= 0 && y1 <= LETTER.height && y2 >= 0 && y2 <= LETTER.height, 'polar spoke outside the page height');
  }
});

test('isometric grid: three line families, no line outside the page, no vertical family', () => {
  const { recording, header } = renderRecorded('isometric-grid', LETTER.width, LETTER.height, baseSettings({ gridSize: 6.35 }));
  assert.equal(header, '%PDF-');
  assert.ok(recording.lines.length > 100, `expected many isometric lines, got ${recording.lines.length}`);
  for (const [x1, y1, x2, y2] of recording.lines) {
    assert.ok(x1 >= -0.01 && x1 <= LETTER.width + 0.01, `isometric line x1 ${x1} outside the page`);
    assert.ok(x2 >= -0.01 && x2 <= LETTER.width + 0.01, `isometric line x2 ${x2} outside the page`);
    assert.ok(y1 >= -0.01 && y1 <= LETTER.height + 0.01, `isometric line y1 ${y1} outside the page`);
    assert.ok(y2 >= -0.01 && y2 <= LETTER.height + 0.01, `isometric line y2 ${y2} outside the page`);
    // Slope is 0, sqrt(3), or -sqrt(3). A vertical line would have
    // x1 equal to x2 with y1 not equal to y2, and must not appear.
    if (Math.abs(x1 - x2) < 0.01) assert.ok(Math.abs(y1 - y2) < 0.01, 'vertical isometric line found, but the grid has no vertical family');
  }
  // Slope filter fix: a line is [x1, y1, x2, y2], so a non-vertical
  // line is x1 different from x2, not x1 different from y1. The
  // previous filter compared x1 with y1, which wrongly admitted
  // vertical lines and wrongly excluded diagonal lines crossing
  // x equal to y, while still passing because the three slopes were
  // present somewhere in the set.
  const nonVertical = recording.lines.filter(([x1, , x2]) => Math.abs(x1 - x2) > 0.01);
  assert.ok(nonVertical.length > 100, `expected many non-vertical isometric lines, got ${nonVertical.length}`);
  const slopes = new Set(
    nonVertical.map(([x1, y1, x2, y2]) => Math.round(((y2 - y1) / (x2 - x1)) / 0.01) * 0.01),
  );
  assert.ok(slopes.size === 3, `expected exactly 3 isometric slope families, got ${[...slopes].join(', ')}`);
  assert.ok(slopes.has(0), 'horizontal isometric family missing');
  assert.ok([...slopes].some((s) => Math.abs(s - Math.sqrt(3)) < 0.05), '60 degree isometric family missing');
  assert.ok([...slopes].some((s) => Math.abs(s + Math.sqrt(3)) < 0.05), '120 degree isometric family missing');
  // Each family must actually occur, not just be present in a set
  // that could have come from a single stray line.
  const familyCounts = { horizontal: 0, diagonal60: 0, diagonal120: 0 };
  for (const slope of slopes) {
    if (slope === 0) familyCounts.horizontal = nonVertical.filter(([x1, y1, x2, y2]) => Math.abs((y2 - y1) / (x2 - x1)) < 0.05).length;
    else if (Math.abs(slope - Math.sqrt(3)) < 0.05) familyCounts.diagonal60 = nonVertical.filter(([x1, y1, x2, y2]) => Math.abs((y2 - y1) / (x2 - x1) - Math.sqrt(3)) < 0.05).length;
    else if (Math.abs(slope + Math.sqrt(3)) < 0.05) familyCounts.diagonal120 = nonVertical.filter(([x1, y1, x2, y2]) => Math.abs((y2 - y1) / (x2 - x1) + Math.sqrt(3)) < 0.05).length;
  }
  assert.ok(familyCounts.horizontal > 10, `horizontal isometric family too small: ${familyCounts.horizontal}`);
  assert.ok(familyCounts.diagonal60 > 10, `60 degree isometric family too small: ${familyCounts.diagonal60}`);
  assert.ok(familyCounts.diagonal120 > 10, `120 degree isometric family too small: ${familyCounts.diagonal120}`);
  // Negative control: there must be zero vertical lines, counted
  // correctly, out of a recording that does contain many lines.
  const verticalLines = recording.lines.filter(([x1, y1, x2, y2]) => Math.abs(x1 - x2) < 0.01 && Math.abs(y1 - y2) >= 0.01);
  assert.equal(verticalLines.length, 0, `expected no vertical isometric lines, got ${verticalLines.length}`);
});

test('isometric guide instructions agree with the grid: no vertical cube edge', async () => {
  const { guides } = await import('../client/src/content/index');
  const guide = guides.find((g) => g.id === 'how-to-draw-isometric-on-grid-paper');
  assert.ok(guide, 'isometric guide not found');
  const text = [guide.description, guide.summary, guide.answerSummary, ...guide.body.map((b) => b.body)].join(' ');
  assert.ok(!/vertical edges stay vertical|start with a vertical edge/i.test(text), 'guide still instructs a vertical cube edge');
  assert.ok(/no vertical/i.test(text), 'guide does not warn that there is no vertical family');
  assert.ok(/120 degrees apart/i.test(text), 'guide does not give the 120 degree cube corner directions');
});

test('existing generators still produce a real one page PDF, and batch produces one page per type', () => {
  for (const paperType of ['graph-paper', 'dot-grid', 'lined-paper', 'storyboard', 'hex-grid'] as PaperType[]) {
    const { doc, header, output } = renderRecorded(paperType, LETTER.width, LETTER.height, baseSettings());
    assert.equal(header, '%PDF-');
    assert.equal(doc.getNumberOfPages(), 1, `${paperType} should be one page`);
    assert.ok(output.byteLength > 500, `${paperType} PDF output is unexpectedly small`);
  }
  const batchDoc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [LETTER.width, LETTER.height] });
  renderBatchPdf(batchDoc, LETTER.width, LETTER.height, baseSettings({ batchPaperTypes: ['graph-paper', 'dot-grid', 'coordinate-plane'] }));
  assert.equal(batchDoc.getNumberOfPages(), 3, 'batch should have one page per selected type');
  assert.equal(new TextDecoder().decode(batchDoc.output('arraybuffer').slice(0, 5)), '%PDF-');
});
