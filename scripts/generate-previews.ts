import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { presets, templates, type PaperType, type TemplateSettings } from "../client/src/content/index";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, "../client/public");
const templatePreviewDir = path.join(publicDir, "previews/templates");
const presetPreviewDir = path.join(publicDir, "previews/presets");
const ogDir = path.join(publicDir, "og");

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function esc(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function svgFrame(width: number, height: number, title: string, subtitle: string, pattern: string, mode: "preview" | "og") {
  const isOg = mode === "og";
  const paperX = isOg ? 70 : 190;
  const paperY = isOg ? 70 : 80;
  const paperW = isOg ? 410 : 820;
  const paperH = isOg ? 490 : 640;
  const textX = isOg ? 540 : width / 2;
  const titleY = isOg ? 230 : 744;
  const subtitleY = isOg ? 285 : 0;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)} preview">
  <rect width="${width}" height="${height}" fill="#0f172a"/>
  <rect x="${paperX}" y="${paperY}" width="${paperW}" height="${paperH}" rx="8" fill="#ffffff"/>
  <g transform="translate(${paperX} ${paperY})">${pattern}</g>
  <rect x="${paperX}" y="${paperY}" width="${paperW}" height="${paperH}" rx="8" fill="none" stroke="#e2e8f0" stroke-width="6"/>
  ${isOg
    ? `<text x="${textX}" y="${titleY}" fill="#f8fafc" font-family="Arial, sans-serif" font-size="62" font-weight="800">${esc(title)}</text>
  <text x="${textX}" y="${subtitleY}" fill="#bae6fd" font-family="Arial, sans-serif" font-size="30">${esc(subtitle)}</text>
  <text x="${textX}" y="${subtitleY + 56}" fill="#e2e8f0" font-family="Arial, sans-serif" font-size="25">Free printable vector PDF</text>`
    : `<text x="${textX}" y="${titleY}" fill="#f8fafc" font-family="Arial, sans-serif" font-size="42" font-weight="700" text-anchor="middle">${esc(title)}</text>`}
</svg>
`;
}

function lines(count: number, vertical: boolean, maxA: number, maxB: number, color = "#38bdf8", opacity = "0.42") {
  return Array.from({ length: count }, (_, index) => {
    const pos = ((index + 1) / (count + 1)) * maxA;
    return vertical
      ? `<path d="M${pos.toFixed(1)} 40V${(maxB - 40).toFixed(1)}" stroke="${color}" stroke-opacity="${opacity}" stroke-width="2"/>`
      : `<path d="M40 ${pos.toFixed(1)}H${(maxB - 40).toFixed(1)}" stroke="${color}" stroke-opacity="${opacity}" stroke-width="2"/>`;
  }).join("");
}

function dots(w: number, h: number, iso = false) {
  const out: string[] = [];
  const step = iso ? 58 : 54;
  for (let y = 55; y < h - 45; y += step) {
    for (let x = 55; x < w - 45; x += step) {
      const offset = iso && Math.round(y / step) % 2 ? step / 2 : 0;
      out.push(`<circle cx="${x + offset}" cy="${y}" r="5" fill="#38bdf8" fill-opacity="0.55"/>`);
    }
  }
  return out.join("");
}

function hexes(w: number, h: number) {
  const out: string[] = [];
  const r = 34;
  const dx = r * Math.sqrt(3);
  const dy = r * 1.5;
  for (let row = 0, y = 50; y < h - 20; row++, y += dy) {
    for (let x = 50 + (row % 2 ? dx / 2 : 0); x < w - 20; x += dx) {
      const points = Array.from({ length: 6 }, (_, i) => {
        const angle = Math.PI / 3 * i - Math.PI / 6;
        return `${(x + r * Math.cos(angle)).toFixed(1)},${(y + r * Math.sin(angle)).toFixed(1)}`;
      }).join(" ");
      out.push(`<polygon points="${points}" fill="none" stroke="#38bdf8" stroke-opacity="0.48" stroke-width="2"/>`);
    }
  }
  return out.join("");
}

function panelGrid(w: number, h: number, cols: number, rows: number) {
  const gap = 26;
  const margin = 48;
  const cellW = (w - margin * 2 - gap * (cols - 1)) / cols;
  const cellH = (h - margin * 2 - gap * (rows - 1)) / rows;
  const out: string[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      out.push(`<rect x="${margin + c * (cellW + gap)}" y="${margin + r * (cellH + gap)}" width="${cellW}" height="${cellH}" fill="none" stroke="#38bdf8" stroke-opacity="0.62" stroke-width="4"/>`);
    }
  }
  return out.join("");
}

function patternFor(type: PaperType, settings: TemplateSettings, w: number, h: number) {
  switch (type) {
    case "dot-grid":
      return dots(w, h);
    case "isometric-dots":
      return dots(w, h, true);
    case "graph-paper":
      return `<g>${lines(11, true, w, h)}${lines(9, false, h, w)}</g>`;
    case "hex-grid":
      return hexes(w, h);
    case "lined-paper":
      return `<g>${lines(10, false, h, w, "#64748b", "0.45")}<path d="M110 30V${h - 30}" stroke="#ef4444" stroke-opacity="0.55" stroke-width="3"/></g>`;
    case "checklist":
      return `<g>${lines(9, false, h, w, "#64748b", "0.42")}${Array.from({ length: 9 }, (_, i) => `<rect x="70" y="${80 + i * 56}" width="24" height="24" fill="none" stroke="#0f172a" stroke-opacity="0.75" stroke-width="3"/>`).join("")}</g>`;
    case "music-staff":
      return `<g>${Array.from({ length: 6 }, (_, s) => Array.from({ length: 5 }, (_, l) => `<path d="M55 ${70 + s * 82 + l * 8}H${w - 55}" stroke="#0f172a" stroke-opacity="0.72" stroke-width="2"/>`).join("")).join("")}</g>`;
    case "guitar-tab":
      return `<g>${Array.from({ length: 5 }, (_, s) => Array.from({ length: 6 }, (_, l) => `<path d="M55 ${70 + s * 92 + l * 10}H${w - 55}" stroke="#0f172a" stroke-opacity="0.72" stroke-width="2"/>`).join("")).join("")}</g>`;
    case "bass-tab":
      return `<g>${Array.from({ length: 6 }, (_, s) => Array.from({ length: 4 }, (_, l) => `<path d="M55 ${70 + s * 82 + l * 12}H${w - 55}" stroke="#0f172a" stroke-opacity="0.72" stroke-width="2"/>`).join("")).join("")}</g>`;
    case "handwriting":
      return `<g>${Array.from({ length: 7 }, (_, i) => `<path d="M50 ${80 + i * 74}H${w - 50}" stroke="#38bdf8" stroke-opacity="0.55" stroke-width="3"/><path d="M50 ${117 + i * 74}H${w - 50}" stroke="#38bdf8" stroke-opacity="0.35" stroke-width="2" stroke-dasharray="8 8"/>`).join("")}</g>`;
    case "calligraphy":
      return `<g>${lines(9, false, h, w, "#64748b", "0.38")}${Array.from({ length: 18 }, (_, i) => `<path d="M${-120 + i * 70} ${h}L${180 + i * 70} 0" stroke="#38bdf8" stroke-opacity="0.28" stroke-width="2"/>`).join("")}</g>`;
    case "knitting":
      return `<g>${Array.from({ length: 12 }, (_, i) => `<path d="M${50 + i * 58} 40V${h - 40}" stroke="#38bdf8" stroke-opacity="0.42" stroke-width="2"/>`).join("")}${Array.from({ length: 8 }, (_, i) => `<path d="M40 ${55 + i * 72}H${w - 40}" stroke="#38bdf8" stroke-opacity="0.42" stroke-width="2"/>`).join("")}</g>`;
    case "genkoyoushi":
      return `<g>${Array.from({ length: 8 }, (_, r) => Array.from({ length: 10 }, (_, c) => `<rect x="${58 + c * 68}" y="${54 + r * 68}" width="50" height="50" fill="none" stroke="#38bdf8" stroke-opacity="0.45" stroke-width="2"/><path d="M${83 + c * 68} ${54 + r * 68}V${104 + r * 68}M${58 + c * 68} ${79 + r * 68}H${108 + c * 68}" stroke="#38bdf8" stroke-opacity="0.22" stroke-width="1"/>`).join("")).join("")}</g>`;
    case "perspective-grid":
      return `<g><path d="M40 ${h / 2}H${w - 40}" stroke="#38bdf8" stroke-opacity="0.45" stroke-width="3"/>${Array.from({ length: 28 }, (_, i) => { const a = Math.PI * 2 * i / 28; return `<path d="M${w / 2} ${h / 2}L${w / 2 + Math.cos(a) * w} ${h / 2 + Math.sin(a) * h}" stroke="#38bdf8" stroke-opacity="0.28" stroke-width="2"/>`; }).join("")}</g>`;
    case "comic-layout":
      return panelGrid(w, h, settings.comicLayout === "3x3" ? 3 : 2, settings.comicLayout === "splash" ? 1 : 3);
    case "storyboard":
      return panelGrid(w, h, settings.storyboardCols || 3, settings.storyboardRows || 2);
  }
}

function writePreview(id: string, label: string, summary: string, type: PaperType, settings: TemplateSettings, targetPath: string) {
  fs.writeFileSync(targetPath, svgFrame(1200, 800, label, summary, patternFor(type, settings, 820, 640), "preview"), "utf-8");
}

function writeOg(id: string, label: string, summary: string, type: PaperType, settings: TemplateSettings, targetPath: string) {
  fs.writeFileSync(targetPath, svgFrame(1200, 630, label, summary, patternFor(type, settings, 410, 490), "og"), "utf-8");
}

function validatePath(actual: string, expected: string, id: string, field: string) {
  if (actual !== expected) {
    throw new Error(`${id} ${field} must be ${expected}, got ${actual}`);
  }
}

ensureDir(templatePreviewDir);
ensureDir(presetPreviewDir);
ensureDir(ogDir);

for (const template of templates) {
  validatePath(template.previewImage, `/previews/templates/${template.id}.svg`, template.id, "previewImage");
  validatePath(template.socialImage, `/og/${template.id}.svg`, template.id, "socialImage");
  writePreview(template.id, template.label, template.summary, template.settings.paperType, template.settings, path.join(templatePreviewDir, `${template.id}.svg`));
  writeOg(template.id, template.label, template.summary, template.settings.paperType, template.settings, path.join(ogDir, `${template.id}.svg`));
}

for (const preset of presets) {
  validatePath(preset.previewImage, `/previews/presets/${preset.id}.svg`, preset.id, "previewImage");
  validatePath(preset.socialImage, `/og/${preset.id}.svg`, preset.id, "socialImage");
  writePreview(preset.id, preset.label, preset.summary, preset.settings.paperType, preset.settings, path.join(presetPreviewDir, `${preset.id}.svg`));
  writeOg(preset.id, preset.label, preset.summary, preset.settings.paperType, preset.settings, path.join(ogDir, `${preset.id}.svg`));
}

console.log(`Generated ${templates.length} template previews, ${presets.length} preset previews, and ${templates.length + presets.length} OG images.`);
