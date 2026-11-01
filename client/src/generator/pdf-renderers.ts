import type { jsPDF } from 'jspdf';
import { COORDINATE_PLANE_MARGIN_MM } from './constants';
import type { PaperType, Settings } from './types';

export { COORDINATE_PLANE_MARGIN_MM };

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ] : [0, 0, 0];
};

const getLineColor = (opts: Settings) => {
  if (opts.useCustomColor) return hexToRgb(opts.customColor);
  const colorMap: Record<string, number[]> = {
    cyan: [56, 189, 248],
    gray: [102, 102, 102],
    black: [0, 0, 0],
  };
  return colorMap[opts.gridColor] || [0, 0, 0];
};

export function renderPdfPage(
  doc: jsPDF,
  width: number,
  height: number,
  settings: Settings,
  paperType: PaperType = settings.paperType,
) {
  const tempSettings = { ...settings, paperType };

  if (settings.useCustomBackground) {
    const bgColor = hexToRgb(settings.backgroundColor);
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(0, 0, width, height, 'F');
  }

  if (settings.showRulers) {
    drawRulersPDF(doc, width, height, settings);
  }

  switch (paperType) {
    case 'dot-grid':
      drawDotGridPDF(doc, width, height, tempSettings);
      break;
    case 'isometric-dots':
      drawIsometricDotsPDF(doc, width, height, tempSettings);
      break;
    case 'graph-paper':
      drawGraphPaperPDF(doc, width, height, tempSettings);
      break;
    case 'coordinate-plane':
      drawCoordinatePlanePDF(doc, width, height, tempSettings);
      break;
    case 'cornell-notes':
      drawCornellNotesPDF(doc, width, height, tempSettings);
      break;
    case 'polar-grid':
      drawPolarGridPDF(doc, width, height, tempSettings);
      break;
    case 'isometric-grid':
      drawIsometricGridPDF(doc, width, height, tempSettings);
      break;
    case 'lined-paper':
      drawLinedPaperPDF(doc, width, height, tempSettings);
      break;
    case 'music-staff':
      drawMusicStaffPDF(doc, width, height, tempSettings);
      break;
    case 'checklist':
      drawChecklistPDF(doc, width, height, tempSettings);
      break;
    case 'hex-grid':
      drawHexGridPDF(doc, width, height, tempSettings);
      break;
    case 'knitting':
      drawKnittingPDF(doc, width, height, tempSettings);
      break;
    case 'calligraphy':
      drawCalligraphyPDF(doc, width, height, tempSettings);
      break;
    case 'handwriting':
      drawHandwritingPDF(doc, width, height, tempSettings);
      break;
    case 'guitar-tab':
      drawGuitarTabPDF(doc, width, height, tempSettings);
      break;
    case 'bass-tab':
      drawBassTabPDF(doc, width, height, tempSettings);
      break;
    case 'genkoyoushi':
      drawGenkoyoushiPDF(doc, width, height, tempSettings);
      break;
    case 'perspective-grid':
      drawPerspectiveGridPDF(doc, width, height, tempSettings);
      break;
    case 'comic-layout':
      drawComicLayoutPDF(doc, width, height, tempSettings);
      break;
    case 'storyboard':
      drawStoryboardPDF(doc, width, height, tempSettings);
      break;
  }
}

export function renderBatchPdf(doc: jsPDF, width: number, height: number, settings: Settings) {
  settings.batchPaperTypes.forEach((type, index) => {
    if (index > 0) {
      doc.addPage();
    }
    renderPdfPage(doc, width, height, settings, type);
  });
}

function drawRulersPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const rulerWidth = 10;
  const tickSmall = 2;
  const tickMedium = 4;
  const tickLarge = 6;

  doc.setFillColor(240, 240, 240);
  doc.rect(0, 0, width, rulerWidth, 'F');
  doc.rect(0, 0, rulerWidth, height, 'F');

  doc.setDrawColor(102, 102, 102);
  doc.setLineWidth(0.1);

  const unitSize = opts.unit === 'mm' ? 1 : 25.4;
  const majorTick = opts.unit === 'mm' ? 10 : 1;
  const minorTick = opts.unit === 'mm' ? 1 : 0.125;

  for (let x = 0; x <= width; x += minorTick * unitSize) {
    const isMajor = Math.abs(x % (majorTick * unitSize)) < 0.01;
    const isMedium = opts.unit === 'mm' ? Math.abs(x % (5 * unitSize)) < 0.01 : Math.abs(x % (0.5 * unitSize)) < 0.01;
    const tickHeight = isMajor ? tickLarge : (isMedium ? tickMedium : tickSmall);
    doc.line(x, 0, x, tickHeight);
  }

  for (let y = 0; y <= height; y += minorTick * unitSize) {
    const isMajor = Math.abs(y % (majorTick * unitSize)) < 0.01;
    const isMedium = opts.unit === 'mm' ? Math.abs(y % (5 * unitSize)) < 0.01 : Math.abs(y % (0.5 * unitSize)) < 0.01;
    const tickHeight = isMajor ? tickLarge : (isMedium ? tickMedium : tickSmall);
    doc.line(0, y, tickHeight, y);
  }
}

function drawDotGridPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const spacing = Math.max(5, Math.min(30, opts.dotSpacing));
  const size = Math.max(1, Math.min(3, opts.dotSize));
  const opacity = Math.max(0.1, Math.min(1, opts.dotOpacity));
  const color = opts.useCustomColor ? hexToRgb(opts.customColor) : [0, 0, 0];

  doc.setFillColor(color[0], color[1], color[2]);
  (doc as any).setGState(new (doc as any).GState({ opacity }));

  const numCols = Math.floor(width / spacing);
  const numRows = Math.floor(height / spacing);
  const usedWidth = numCols * spacing;
  const usedHeight = numRows * spacing;
  const startX = (width - usedWidth) / 2 + spacing / 2;
  const startY = (height - usedHeight) / 2 + spacing / 2;

  for (let y = startY; y < height; y += spacing) {
    for (let x = startX; x < width; x += spacing) {
      doc.circle(x, y, size / 2, 'F');
    }
  }
  (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));
}

function drawIsometricDotsPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const spacing = Math.max(5, Math.min(30, opts.dotSpacing));
  const size = Math.max(1, Math.min(3, opts.dotSize));
  const opacity = Math.max(0.1, Math.min(1, opts.dotOpacity));
  const color = opts.useCustomColor ? hexToRgb(opts.customColor) : [0, 0, 0];

  doc.setFillColor(color[0], color[1], color[2]);
  (doc as any).setGState(new (doc as any).GState({ opacity }));

  const hexSpacing = spacing * Math.sqrt(3) / 2;
  const vertSpacing = spacing * 1.5;
  const numCols = Math.floor(width / hexSpacing);
  const numRows = Math.floor(height / vertSpacing);
  const usedWidth = numCols * hexSpacing;
  const usedHeight = numRows * vertSpacing;
  const startX = (width - usedWidth) / 2 + hexSpacing / 2;
  const startY = (height - usedHeight) / 2;

  for (let y = startY; y < height; y += vertSpacing) {
    for (let x = startX; x < width; x += hexSpacing) {
      const rowIndex = Math.round(y / vertSpacing);
      const xOffset = rowIndex % 2 === 1 ? hexSpacing / 2 : 0;
      doc.circle(x + xOffset, y, size / 2, 'F');
    }
  }
  (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));
}

function drawGraphPaperPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const gridSize = Math.max(1, Math.min(20, opts.gridSize));
  const weight = Math.max(0.1, Math.min(2, opts.lineWeight));
  const color = getLineColor(opts);

  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(weight);
  for (let x = 0; x <= width; x += gridSize) doc.line(x, 0, x, height);
  for (let y = 0; y <= height; y += gridSize) doc.line(0, y, width, y);
}

function drawCoordinatePlanePDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  // Four-quadrant plane centred on the page. Grid lines are counted
  // outwards from the origin, so a square is one unit in either
  // direction. Every fifth square is a major line and is labelled,
  // which keeps numbers readable instead of labelling every square.
  // Printable margin: axes, arrowheads, grid lines, and labels stop
  // 6 mm inside the page edge, so an ordinary printer at Actual Size
  // does not clip them. The printable rectangle is symmetric about
  // the centre, so the origin stays centred and quadrants stay equal.
  const gridSize = Math.max(1, Math.min(20, opts.gridSize));
  const weight = Math.max(0.1, Math.min(2, opts.lineWeight));
  const color = getLineColor(opts);
  const centerX = width / 2;
  const centerY = height / 2;
  const margin = COORDINATE_PLANE_MARGIN_MM;
  const leftEdge = margin;
  const rightEdge = width - margin;
  const topEdge = margin;
  const bottomEdge = height - margin;

  doc.setDrawColor(color[0], color[1], color[2]);
  for (let step = 0; step * gridSize <= Math.max(width, height); step++) {
    const isMajor = step % 5 === 0;
    doc.setLineWidth(isMajor ? Math.min(2, weight * 1.6) : weight);
    const right = centerX + step * gridSize;
    const left = centerX - step * gridSize;
    const down = centerY + step * gridSize;
    const up = centerY - step * gridSize;
    if (right >= leftEdge && right <= rightEdge) doc.line(right, topEdge, right, bottomEdge);
    if (left >= leftEdge && left <= rightEdge) doc.line(left, topEdge, left, bottomEdge);
    if (down >= topEdge && down <= bottomEdge) doc.line(leftEdge, down, rightEdge, down);
    if (up >= topEdge && up <= bottomEdge) doc.line(leftEdge, up, rightEdge, up);
  }

  // Bold axes with arrowheads at both ends, all inside the margin.
  const axisWeight = Math.max(0.8, weight * 2);
  const arrow = 3;
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(axisWeight);
  doc.line(leftEdge, centerY, rightEdge, centerY);
  doc.line(centerX, topEdge, centerX, bottomEdge);
  doc.setLineWidth(0.5);
  doc.line(rightEdge, centerY, rightEdge - arrow, centerY - arrow / 2);
  doc.line(rightEdge, centerY, rightEdge - arrow, centerY + arrow / 2);
  doc.line(leftEdge, centerY, leftEdge + arrow, centerY - arrow / 2);
  doc.line(leftEdge, centerY, leftEdge + arrow, centerY + arrow / 2);
  doc.line(centerX, topEdge, centerX - arrow / 2, topEdge + arrow);
  doc.line(centerX, topEdge, centerX + arrow / 2, topEdge + arrow);
  doc.line(centerX, bottomEdge, centerX - arrow / 2, bottomEdge - arrow);
  doc.line(centerX, bottomEdge, centerX + arrow / 2, bottomEdge - arrow);

  // Labels every five units, plus x, y, and the origin.
  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  for (let step = 5; step * gridSize <= Math.max(width, height); step += 5) {
    const right = centerX + step * gridSize;
    const left = centerX - step * gridSize;
    const down = centerY + step * gridSize;
    const up = centerY - step * gridSize;
    if (right < rightEdge) doc.text(String(step), right, centerY + 5, { align: 'center' });
    if (left > leftEdge) doc.text(String(-step), left, centerY + 5, { align: 'center' });
    if (down < bottomEdge) doc.text(String(-step), centerX - 2, down + 1, { align: 'right' });
    if (up > topEdge) doc.text(String(step), centerX - 2, up + 1, { align: 'right' });
  }
  doc.text('0', centerX + 1.5, centerY + 5);
  doc.text('x', rightEdge - 4, centerY + 5, { align: 'center' });
  doc.text('y', centerX + 2, topEdge + 3);
  doc.setTextColor(0, 0, 0);
}

function drawCornellNotesPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  // Standard Cornell layout: a title strip at the top, a cue column
  // taking 30 percent of the width on the left, a wider notes column
  // on the right, and a summary section at the bottom, seven ruled
  // lines tall. Ruled lines run across the full width so cue and
  // notes lines stay aligned; only the divider and the summary
  // separator are bold.
  const lineHeight = Math.max(5, Math.min(15, opts.lineHeight));
  const cueWidth = width * 0.3;
  const headerHeight = Math.max(12, lineHeight * 1.5);
  const summaryHeight = lineHeight * 7;
  const summaryTop = height - summaryHeight;

  doc.setDrawColor(204, 204, 204);
  doc.setLineWidth(0.5);
  doc.line(0, headerHeight, width, headerHeight);
  for (let y = headerHeight + lineHeight; y < summaryTop; y += lineHeight) doc.line(0, y, width, y);
  for (let y = summaryTop + lineHeight; y < height; y += lineHeight) doc.line(0, y, width, y);

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.8);
  doc.line(cueWidth, headerHeight, cueWidth, summaryTop);
  doc.line(0, summaryTop, width, summaryTop);
}

function drawPolarGridPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  // One polar grid centred on the page. Concentric circles are spaced
  // by gridSize, spokes run every 15 degrees, the four cardinal spokes
  // are bold, and angle labels every 30 degrees sit just outside the
  // outermost circle, so an 8 mm margin is kept for them.
  const spacing = Math.max(1, Math.min(20, opts.gridSize));
  const weight = Math.max(0.1, Math.min(2, opts.lineWeight));
  const color = getLineColor(opts);
  const centerX = width / 2;
  const centerY = height / 2;
  const maxRadius = Math.min(width, height) / 2 - 8;
  const ringCount = Math.floor(maxRadius / spacing);

  doc.setDrawColor(color[0], color[1], color[2]);
  for (let ring = 1; ring <= ringCount; ring++) {
    doc.setLineWidth(ring % 5 === 0 ? Math.min(2, weight * 1.6) : weight);
    doc.circle(centerX, centerY, ring * spacing, 'S');
  }

  doc.setDrawColor(0, 0, 0);
  for (let angle = 0; angle < 360; angle += 15) {
    const radians = (angle * Math.PI) / 180;
    const isCardinal = angle % 90 === 0;
    doc.setLineWidth(isCardinal ? Math.max(0.8, weight * 2) : weight);
    doc.line(centerX, centerY, centerX + Math.cos(radians) * maxRadius, centerY - Math.sin(radians) * maxRadius);
  }
  doc.setFillColor(0, 0, 0);
  doc.circle(centerX, centerY, 0.8, 'F');

  doc.setFontSize(8);
  doc.setTextColor(0, 0, 0);
  for (let angle = 0; angle < 360; angle += 30) {
    const radians = (angle * Math.PI) / 180;
    const labelRadius = maxRadius + 4.5;
    doc.text(`${angle}°`, centerX + Math.cos(radians) * labelRadius, centerY - Math.sin(radians) * labelRadius + 1, { align: 'center' });
  }
}

function clippedSlopeSegment(m: number, b: number, width: number, height: number): [number, number, number, number] | null {
  // Intersections of y = m*x + b with the four page edges, deduplicated.
  const points: [number, number][] = [];
  const add = (x: number, y: number) => {
    if (x >= -0.01 && x <= width + 0.01 && y >= -0.01 && y <= height + 0.01) {
      const clamped: [number, number] = [Math.max(0, Math.min(width, x)), Math.max(0, Math.min(height, y))];
      if (!points.some(([px, py]) => Math.abs(px - clamped[0]) < 0.01 && Math.abs(py - clamped[1]) < 0.01)) points.push(clamped);
    }
  };
  add(0, b);
  add(width, m * width + b);
  add(-b / m, 0);
  add((height - b) / m, height);
  if (points.length < 2) return null;
  return [points[0][0], points[0][1], points[1][0], points[1][1]];
}

function drawIsometricGridPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  // Triangular lattice, unlike isometric dots: three families of lines
  // at 0 degrees, 60 degrees, and 120 degrees. gridSize is the
  // triangle side; the spacing between parallel lines is side times
  // sqrt(3) / 2, and the intercept step for the diagonal families is
  // side times sqrt(3), because distance is intercept divided by 2.
  const side = Math.max(1, Math.min(20, opts.gridSize));
  const weight = Math.max(0.1, Math.min(2, opts.lineWeight));
  const color = getLineColor(opts);
  const rowHeight = side * Math.sqrt(3) / 2;
  const interceptStep = side * Math.sqrt(3);
  const slope = Math.sqrt(3);

  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(weight);
  for (let y = 0; y <= height; y += rowHeight) doc.line(0, y, width, y);
  for (let b = -slope * width; b <= height; b += interceptStep) {
    const segment = clippedSlopeSegment(slope, b, width, height);
    if (segment) doc.line(segment[0], segment[1], segment[2], segment[3]);
  }
  for (let b = 0; b <= height + slope * width; b += interceptStep) {
    const segment = clippedSlopeSegment(-slope, b, width, height);
    if (segment) doc.line(segment[0], segment[1], segment[2], segment[3]);
  }
}

function drawLinedPaperPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const lineHeight = Math.max(5, Math.min(15, opts.lineHeight));
  doc.setDrawColor(204, 204, 204);
  doc.setLineWidth(0.5);
  for (let y = lineHeight; y < height; y += lineHeight) doc.line(0, y, width, y);
  if (opts.showMargin) {
    doc.setDrawColor(255, 0, 0);
    doc.setLineWidth(0.8);
    doc.line(30, 0, 30, height);
  }
}

function drawMusicStaffPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const staves = Math.min(Math.max(opts.stavesPerPage, 8), 12);
  const staffHeight = 8;
  const lineSpacing = staffHeight / 4;
  const availableHeight = height - 40;
  const totalStaffHeight = Math.min(staffHeight + 20, availableHeight / staves);
  const startY = 20;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.3);
  for (let i = 0; i < staves && (startY + i * totalStaffHeight + staffHeight) < height; i++) {
    const y = startY + i * totalStaffHeight;
    for (let line = 0; line < 5; line++) doc.line(0, y + line * lineSpacing, width, y + line * lineSpacing);
    doc.setLineWidth(0.5);
    doc.circle(10, y + staffHeight / 2, 2.5, 'S');
    doc.line(10, y, 10, y + staffHeight);
    doc.setLineWidth(0.3);
  }
}

function drawPerspectiveGridPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const color = getLineColor(opts);
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(opts.lineWeight);
  const horizonY = height / 2;
  doc.line(0, horizonY, width, horizonY);

  if (opts.perspectiveType === '1-point') {
    const centerX = width / 2;
    const centerY = horizonY;
    const density = 20;
    for (let i = 0; i < density; i++) {
      const angle = (Math.PI * 2 * i) / density;
      const maxLength = Math.max(width, height) * 1.5;
      doc.line(centerX, centerY, centerX + Math.cos(angle) * maxLength, centerY + Math.sin(angle) * maxLength);
    }
  } else {
    const vp1X = -width * 0.5;
    const vp2X = width * 1.5;
    const centerY = horizonY;
    const density = 20;
    for (let i = 0; i <= density; i++) {
      const targetY = -height + (3 * height) * (i / density);
      doc.line(vp1X, centerY, width, targetY);
      doc.line(vp2X, centerY, 0, targetY);
    }
  }
}

function drawComicLayoutPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const color = getLineColor(opts);
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(0.7);

  const margin = 15;
  const panelGap = 5;
  const usableWidth = width - margin * 2;
  const usableHeight = height - margin * 2;
  let rows = 3;
  let cols = 2;
  if (opts.comicLayout === '3x3') { cols = 3; rows = 3; }
  if (opts.comicLayout === 'splash') { cols = 1; rows = 1; }

  const panelWidth = (usableWidth - (cols - 1) * panelGap) / cols;
  const panelHeight = (usableHeight - (rows - 1) * panelGap) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      doc.rect(margin + c * (panelWidth + panelGap), margin + r * (panelHeight + panelGap), panelWidth, panelHeight);
    }
  }
}

function drawStoryboardPDF(doc: jsPDF, width: number, _height: number, opts: Settings) {
  const color = getLineColor(opts);
  doc.setDrawColor(color[0], color[1], color[2]);

  const margin = 15;
  const gapX = 10;
  const gapY = 30;
  const cols = opts.storyboardCols || 3;
  const rows = opts.storyboardRows || 2;
  const availableWidth = width - margin * 2 - (cols - 1) * gapX;
  const frameWidth = availableWidth / cols;
  const frameHeight = frameWidth * (9 / 16);

  for (let r = 0; r < rows; r++) {
    const rowY = margin + r * (frameHeight + gapY);
    for (let c = 0; c < cols; c++) {
      const x = margin + c * (frameWidth + gapX);
      doc.setLineWidth(0.5);
      doc.rect(x, rowY, frameWidth, frameHeight);
      doc.setLineWidth(0.2);
      const lineAreaY = rowY + frameHeight + 5;
      const lineStep = (gapY - 10) / 3;
      for (let l = 1; l <= 3; l++) doc.line(x, lineAreaY + l * lineStep, x + frameWidth, lineAreaY + l * lineStep);
    }
  }
}

function drawChecklistPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const lineHeight = Math.max(5, Math.min(15, opts.lineHeight));
  doc.setDrawColor(204, 204, 204);
  doc.setLineWidth(0.5);
  for (let y = lineHeight; y < height; y += lineHeight) {
    doc.line(0, y, width, y);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.5);
    doc.rect(15, y - lineHeight / 2 - 2, 4, 4);
    doc.setDrawColor(204, 204, 204);
    doc.setLineWidth(0.5);
  }
  if (opts.showMargin) {
    doc.setDrawColor(255, 0, 0);
    doc.setLineWidth(0.8);
    doc.line(30, 0, 30, height);
  }
}

function drawHexGridPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const weight = Math.max(0.1, Math.min(2, opts.lineWeight));
  const color = getLineColor(opts);
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(weight);

  const size = opts.hexSize / 2;
  const hexWidth = size * Math.sqrt(3);
  const vertDist = size * 2 * 0.75;
  const drawHexagon = (cx: number, cy: number) => {
    const points: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      points.push([cx + size * Math.cos(angle), cy + size * Math.sin(angle)]);
    }
    for (let i = 0; i < 6; i++) doc.line(points[i][0], points[i][1], points[(i + 1) % 6][0], points[(i + 1) % 6][1]);
  };

  let row = 0;
  for (let y = size; y < height + size * 2; y += vertDist) {
    const xOffset = row % 2 === 1 ? hexWidth / 2 : 0;
    for (let x = xOffset + hexWidth / 2; x < width + hexWidth; x += hexWidth) drawHexagon(x, y);
    row++;
  }
}

function drawKnittingPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const cellWidth = Math.max(2, Math.min(15, opts.stitchWidth));
  const cellHeight = Math.max(2, Math.min(20, opts.stitchHeight));
  const weight = Math.max(0.1, Math.min(2, opts.lineWeight));
  const color = getLineColor(opts);
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(weight);
  for (let x = 0; x <= width; x += cellWidth) doc.line(x, 0, x, height);
  for (let y = 0; y <= height; y += cellHeight) doc.line(0, y, width, y);
}

function drawCalligraphyPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const lineHeight = Math.max(5, Math.min(15, opts.lineHeight));
  doc.setDrawColor(204, 204, 204);
  doc.setLineWidth(0.5);
  for (let y = lineHeight; y < height; y += lineHeight) doc.line(0, y, width, y);

  const color = getLineColor(opts);
  doc.setDrawColor(color[0], color[1], color[2]);
  doc.setLineWidth(0.2);
  (doc as any).setGState(new (doc as any).GState({ opacity: 0.4 }));
  const dx = Math.tan((opts.calligraphyAngle * Math.PI) / 180) * height;
  for (let x = -dx; x < width + dx; x += 5) doc.line(x, height, x + dx, 0);
  (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));
}

function drawHandwritingPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const lineHeight = Math.max(5, Math.min(30, opts.lineHeight));
  const gap = lineHeight * 0.5;
  const rowHeight = lineHeight + gap;
  const weight = Math.max(0.1, Math.min(2, opts.lineWeight));
  const color = getLineColor(opts);
  const angleRad = 15 * Math.PI / 180;
  const slantOffset = opts.showHandwritingSlant ? Math.tan(angleRad) * lineHeight : 0;

  doc.setDrawColor(color[0], color[1], color[2]);
  for (let y = gap + lineHeight; y < height; y += rowHeight) {
    const baseY = y;
    const midY = y - lineHeight / 2;
    const topY = y - lineHeight;
    if (opts.showHandwritingSlant) {
      doc.setDrawColor(229, 229, 229);
      doc.setLineWidth(0.2);
      for (let x = -lineHeight; x < width + lineHeight; x += lineHeight) doc.line(x + slantOffset, topY, x, baseY);
      doc.setDrawColor(color[0], color[1], color[2]);
    }
    doc.setLineWidth(weight);
    doc.line(0, topY, width, topY);
    doc.setLineWidth(weight * 0.8);
    doc.setLineDashPattern([1, 1], 0);
    doc.line(0, midY, width, midY);
    doc.setLineDashPattern([], 0);
    doc.setLineWidth(weight);
    doc.line(0, baseY, width, baseY);
  }
}

function drawGuitarTabPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const staves = Math.min(Math.max(opts.stavesPerPage, 4), 10);
  const lineSpacing = 3;
  const staffHeight = lineSpacing * 5;
  const availableHeight = height - 40;
  const totalStaffHeight = Math.min(staffHeight + 25, availableHeight / staves);
  const color = getLineColor(opts);
  doc.setDrawColor(color[0], color[1], color[2]);

  for (let i = 0; i < staves && (20 + i * totalStaffHeight + staffHeight) < height; i++) {
    const y = 20 + i * totalStaffHeight;
    doc.setLineWidth(opts.lineWeight);
    for (let line = 0; line < 6; line++) doc.line(0, y + line * lineSpacing, width, y + line * lineSpacing);
    doc.line(0, y, 0, y + staffHeight);
    doc.line(width, y, width, y + staffHeight);
    doc.setFontSize(9);
    doc.text("T", 2, y + lineSpacing * 2.5);
    doc.text("A", 2, y + lineSpacing * 3.8);
    doc.text("B", 2, y + lineSpacing * 5.1);
  }
}

function drawBassTabPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const staves = Math.min(Math.max(opts.stavesPerPage, 4), 12);
  const lineSpacing = 3.5;
  const staffHeight = lineSpacing * 3;
  const availableHeight = height - 40;
  const totalStaffHeight = Math.min(staffHeight + 25, availableHeight / staves);
  const color = getLineColor(opts);
  doc.setDrawColor(color[0], color[1], color[2]);

  for (let i = 0; i < staves && (20 + i * totalStaffHeight + staffHeight) < height; i++) {
    const y = 20 + i * totalStaffHeight;
    doc.setLineWidth(opts.lineWeight);
    for (let line = 0; line < 4; line++) doc.line(0, y + line * lineSpacing, width, y + line * lineSpacing);
    doc.line(0, y, 0, y + staffHeight);
    doc.line(width, y, width, y + staffHeight);
    doc.setFontSize(9);
    doc.text("T", 2, y + lineSpacing * 2.5);
    doc.text("A", 2, y + lineSpacing * 3.5);
    doc.text("B", 2, y + lineSpacing * 4.5);
  }
}

function drawGenkoyoushiPDF(doc: jsPDF, width: number, height: number, opts: Settings) {
  const size = Math.max(5, Math.min(20, opts.genkoyoushiSize));
  const rowSpacing = size * 0.4;
  const cols = Math.floor((width - 20) / size);
  const rows = Math.floor((height - 20) / (size + rowSpacing));
  const startX = (width - cols * size) / 2;
  const startY = (height - (rows * (size + rowSpacing))) / 2;
  const color = getLineColor(opts);
  doc.setDrawColor(color[0], color[1], color[2]);

  for (let r = 0; r < rows; r++) {
    const y = startY + r * (size + rowSpacing);
    for (let c = 0; c < cols; c++) {
      const x = startX + c * size;
      doc.setLineWidth(opts.lineWeight);
      doc.setLineDashPattern([], 0);
      doc.rect(x, y, size, size);
      doc.setLineDashPattern([1, 2], 0);
      doc.setLineWidth(0.2);
      doc.line(x + size / 2, y, x + size / 2, y + size);
      doc.line(x, y + size / 2, x + size, y + size / 2);
    }
  }
  doc.setLineDashPattern([], 0);
}
