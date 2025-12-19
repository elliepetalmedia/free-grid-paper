import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Download, Info } from 'lucide-react';
import { jsPDF } from 'jspdf';

type PaperType = 'dot-grid' | 'graph-paper' | 'lined-paper' | 'music-staff' | 'checklist' | 'isometric-dots' | 'hex-grid' | 'knitting' | 'calligraphy';
type PageSize = 'A4' | 'Letter' | 'Legal' | 'A0' | 'A1' | 'A2' | 'ArchC' | 'ArchD' | 'ArchE';
type Unit = 'mm' | 'inches';

const PAGE_SIZES: Record<PageSize, { width: number; height: number; label: string }> = {
  'A4': { width: 210, height: 297, label: 'A4 (210×297mm)' },
  'Letter': { width: 215.9, height: 279.4, label: 'Letter (8.5×11in)' },
  'Legal': { width: 215.9, height: 355.6, label: 'Legal (8.5×14in)' },
  'A2': { width: 420, height: 594, label: 'A2 (420×594mm)' },
  'A1': { width: 594, height: 841, label: 'A1 (594×841mm)' },
  'A0': { width: 841, height: 1189, label: 'A0 (841×1189mm)' },
  'ArchC': { width: 457.2, height: 609.6, label: 'Arch C (18×24in)' },
  'ArchD': { width: 609.6, height: 914.4, label: 'Arch D (24×36in)' },
  'ArchE': { width: 914.4, height: 1219.2, label: 'Arch E (36×48in)' },
};

const ROUTE_PRESETS: Record<string, { paperType: PaperType; pageSize?: PageSize; title: string; h1: string; gridColor?: string; useCustomColor?: boolean; customColor?: string; backgroundColor?: string }> = {
  '/hex-paper': { paperType: 'hex-grid', title: 'Free Printable Hex Grid Paper | FreeGridPaper', h1: 'Free Printable Hex Grid Paper' },
  '/music-staff': { paperType: 'music-staff', title: 'Blank Sheet Music PDF | FreeGridPaper', h1: 'Blank Sheet Music PDF' },
  '/engineering': { paperType: 'graph-paper', title: 'Engineering Graph Paper | FreeGridPaper', h1: 'Engineering Graph Paper', useCustomColor: true, customColor: '#228B22', backgroundColor: '#FFFFC5' },
  '/poster-size': { paperType: 'graph-paper', pageSize: 'ArchD', title: 'Poster Size Grid Paper | FreeGridPaper', h1: 'Poster Size Grid Paper' },
  '/calligraphy': { paperType: 'calligraphy', title: 'Calligraphy Practice Paper | FreeGridPaper', h1: 'Calligraphy Practice Paper' },
  '/knitting': { paperType: 'knitting', title: 'Knitting & Cross-Stitch Graph Paper | FreeGridPaper', h1: 'Knitting & Cross-Stitch Graph Paper' },
};

interface Settings {
  paperType: PaperType;
  pageSize: PageSize;
  unit: Unit;
  dotSpacing: number;
  dotSize: number;
  dotOpacity: number;
  gridSize: number;
  lineWeight: number;
  gridColor: 'cyan' | 'gray' | 'black';
  useCustomColor: boolean;
  customColor: string;
  lineHeight: number;
  showMargin: boolean;
  stavesPerPage: number;
  batchPaperTypes: PaperType[];
  hexSize: number;
  stitchWidth: number;
  stitchHeight: number;
  calligraphyAngle: number;
  showRulers: boolean;
  backgroundColor: string;
  useCustomBackground: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  paperType: 'dot-grid',
  pageSize: 'A4',
  unit: 'mm',
  dotSpacing: 5,
  dotSize: 2,
  dotOpacity: 0.5,
  gridSize: 5,
  lineWeight: 0.5,
  gridColor: 'gray',
  useCustomColor: false,
  customColor: '#000000',
  lineHeight: 7.1,
  showMargin: true,
  stavesPerPage: 10,
  batchPaperTypes: [],
  hexSize: 25.4,
  stitchWidth: 5,
  stitchHeight: 7.5,
  calligraphyAngle: 55,
  showRulers: false,
  backgroundColor: '#ffffff',
  useCustomBackground: false,
};

const PAPER_TYPE_LABELS: Record<PaperType, string> = {
  'dot-grid': 'Dot Grid',
  'isometric-dots': 'Isometric Dots',
  'graph-paper': 'Graph Paper',
  'lined-paper': 'Lined Paper',
  'music-staff': 'Music Staff',
  'checklist': 'Checklist',
  'hex-grid': 'Hexagon Grid',
  'knitting': 'Knitting/Cross-Stitch',
  'calligraphy': 'Calligraphy',
};

const PAPER_TYPE_TO_ROUTE: Partial<Record<PaperType, string>> = {
  'hex-grid': '/hex-paper',
  'music-staff': '/music-staff',
  'calligraphy': '/calligraphy',
  'knitting': '/knitting',
};

export default function Home() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [pageTitle, setPageTitle] = useState('FreeGridPaper');
  const [pageH1, setPageH1] = useState('FreeGridPaper');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const preset = ROUTE_PRESETS[location];
    if (preset) {
      document.title = preset.title;
      setPageTitle(preset.title);
      setPageH1(preset.h1);
      setSettings(prev => ({
        ...prev,
        paperType: preset.paperType,
        ...(preset.pageSize && { pageSize: preset.pageSize }),
        ...(preset.useCustomColor !== undefined && { useCustomColor: preset.useCustomColor }),
        ...(preset.customColor && { customColor: preset.customColor }),
        ...(preset.backgroundColor && { backgroundColor: preset.backgroundColor, useCustomBackground: true }),
      }));
    } else {
      document.title = 'FreeGridPaper - Free Printable Grid Paper Generator';
      setPageTitle('FreeGridPaper');
      setPageH1('FreeGridPaper');
    }
  }, [location]);

  useEffect(() => {
    const saved = localStorage.getItem('freegridpaper-settings');
    if (saved && !ROUTE_PRESETS[location]) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('freegridpaper-settings', JSON.stringify(settings));
    drawCanvas();
  }, [settings]);

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePaperTypeChange = (paperType: PaperType) => {
    const route = PAPER_TYPE_TO_ROUTE[paperType];
    if (route) {
      setLocation(route);
    } else {
      if (location !== '/') {
        setLocation('/');
      }
      updateSetting('paperType', paperType);
    }
  };

  const getPageDimensions = () => PAGE_SIZES[settings.pageSize];

  const getCanvasScale = () => {
    return 1.5;
  };

  const getPreviewDimensions = () => {
    const pageSize = getPageDimensions();
    const scale = getCanvasScale();
    const maxPreviewHeight = 500;
    const maxPreviewWidth = 400;
    
    let previewWidth = pageSize.width * scale;
    let previewHeight = pageSize.height * scale;
    
    if (previewHeight > maxPreviewHeight || previewWidth > maxPreviewWidth) {
      previewWidth = Math.min(previewWidth, maxPreviewWidth);
      previewHeight = Math.min(previewHeight, maxPreviewHeight);
    }
    
    return { previewWidth, previewHeight, fullWidth: pageSize.width * scale, fullHeight: pageSize.height * scale };
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pageSize = getPageDimensions();
    const dpr = window.devicePixelRatio || 1;
    const scale = getCanvasScale();

    canvas.width = pageSize.width * scale * dpr;
    canvas.height = pageSize.height * scale * dpr;
    canvas.style.width = `${pageSize.width * scale}px`;
    canvas.style.height = `${pageSize.height * scale}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(scale * dpr, scale * dpr);
    
    ctx.fillStyle = settings.useCustomBackground ? settings.backgroundColor : '#ffffff';
    ctx.fillRect(0, 0, pageSize.width, pageSize.height);

    if (settings.showRulers) {
      drawRulers(ctx, pageSize.width, pageSize.height);
    }

    switch (settings.paperType) {
      case 'dot-grid':
        drawDotGrid(ctx, pageSize.width, pageSize.height);
        break;
      case 'isometric-dots':
        drawIsometricDots(ctx, pageSize.width, pageSize.height);
        break;
      case 'graph-paper':
        drawGraphPaper(ctx, pageSize.width, pageSize.height);
        break;
      case 'lined-paper':
        drawLinedPaper(ctx, pageSize.width, pageSize.height);
        break;
      case 'music-staff':
        drawMusicStaff(ctx, pageSize.width, pageSize.height);
        break;
      case 'checklist':
        drawChecklist(ctx, pageSize.width, pageSize.height);
        break;
      case 'hex-grid':
        drawHexGrid(ctx, pageSize.width, pageSize.height);
        break;
      case 'knitting':
        drawKnitting(ctx, pageSize.width, pageSize.height);
        break;
      case 'calligraphy':
        drawCalligraphy(ctx, pageSize.width, pageSize.height);
        break;
    }
  };

  const getColorStyle = () => {
    if (settings.useCustomColor) {
      return settings.customColor;
    }
    const colorMap = {
      cyan: '#38bdf8',
      gray: '#666666',
      black: '#000000',
    };
    return colorMap[settings.gridColor];
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  };

  const drawRulers = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const rulerWidth = 10;
    const tickSmall = 2;
    const tickMedium = 4;
    const tickLarge = 6;
    
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, rulerWidth);
    ctx.fillRect(0, 0, rulerWidth, height);
    
    ctx.strokeStyle = '#666666';
    ctx.lineWidth = 0.3;
    ctx.fillStyle = '#333333';
    ctx.font = '2px sans-serif';
    
    const unitSize = settings.unit === 'mm' ? 1 : 25.4;
    const majorTick = settings.unit === 'mm' ? 10 : 1;
    const minorTick = settings.unit === 'mm' ? 1 : 0.125;
    
    for (let x = 0; x <= width; x += minorTick * unitSize) {
      const isMajor = Math.abs(x % (majorTick * unitSize)) < 0.01;
      const isMedium = settings.unit === 'mm' ? Math.abs(x % (5 * unitSize)) < 0.01 : Math.abs(x % (0.5 * unitSize)) < 0.01;
      const tickHeight = isMajor ? tickLarge : (isMedium ? tickMedium : tickSmall);
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, tickHeight);
      ctx.stroke();
      
      if (isMajor && x > 0) {
        const label = settings.unit === 'mm' ? `${Math.round(x)}` : `${(x / 25.4).toFixed(0)}`;
        ctx.fillText(label, x + 0.5, rulerWidth - 1);
      }
    }
    
    for (let y = 0; y <= height; y += minorTick * unitSize) {
      const isMajor = Math.abs(y % (majorTick * unitSize)) < 0.01;
      const isMedium = settings.unit === 'mm' ? Math.abs(y % (5 * unitSize)) < 0.01 : Math.abs(y % (0.5 * unitSize)) < 0.01;
      const tickHeight = isMajor ? tickLarge : (isMedium ? tickMedium : tickSmall);
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(tickHeight, y);
      ctx.stroke();
    }
  };

  const drawDotGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const spacing = Math.max(5, Math.min(30, settings.dotSpacing));
    const size = Math.max(1, Math.min(3, settings.dotSize));
    const opacity = Math.max(0.1, Math.min(1, settings.dotOpacity));

    const color = settings.useCustomColor ? hexToRgb(settings.customColor) : [0, 0, 0];
    ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;

    const numCols = Math.floor(width / spacing);
    const numRows = Math.floor(height / spacing);
    const usedWidth = numCols * spacing;
    const usedHeight = numRows * spacing;
    const startX = (width - usedWidth) / 2 + spacing / 2;
    const startY = (height - usedHeight) / 2 + spacing / 2;

    for (let y = startY; y < height; y += spacing) {
      for (let x = startX; x < width; x += spacing) {
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawIsometricDots = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const spacing = Math.max(5, Math.min(30, settings.dotSpacing));
    const size = Math.max(1, Math.min(3, settings.dotSize));
    const opacity = Math.max(0.1, Math.min(1, settings.dotOpacity));
    
    const color = settings.useCustomColor ? hexToRgb(settings.customColor) : [0, 0, 0];
    ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;
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
        ctx.beginPath();
        ctx.arc(x + xOffset, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const drawGraphPaper = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const gridSize = Math.max(1, Math.min(20, settings.gridSize));
    const weight = Math.max(0.1, Math.min(2, settings.lineWeight));
    
    ctx.strokeStyle = getColorStyle();
    ctx.lineWidth = weight;

    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawLinedPaper = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const lineHeight = Math.max(5, Math.min(15, settings.lineHeight));
    
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 0.5;

    for (let y = lineHeight; y < height; y += lineHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (settings.showMargin) {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(30, 0);
      ctx.lineTo(30, height);
      ctx.stroke();
    }
  };

  const drawMusicStaff = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const staves = Math.min(Math.max(settings.stavesPerPage, 8), 12);
    const staffHeight = 8;
    const lineSpacing = staffHeight / 4;
    const availableHeight = height - 40;
    const totalStaffHeight = Math.min(staffHeight + 20, availableHeight / staves);
    const startY = 20;

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 0.3;

    for (let i = 0; i < staves && (startY + i * totalStaffHeight + staffHeight) < height; i++) {
      const y = startY + i * totalStaffHeight;

      for (let line = 0; line < 5; line++) {
        const lineY = y + line * lineSpacing;
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(width, lineY);
        ctx.stroke();
      }

      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.arc(10, y + staffHeight / 2, 2.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(10, y);
      ctx.lineTo(10, y + staffHeight);
      ctx.stroke();
      ctx.lineWidth = 0.3;
    }
  };

  const drawChecklist = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const lineHeight = Math.max(5, Math.min(15, settings.lineHeight));
    
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 0.5;

    for (let y = lineHeight; y < height; y += lineHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 0.5;
      const checkboxSize = 4;
      const checkboxY = y - lineHeight / 2 - checkboxSize / 2;
      ctx.strokeRect(15, checkboxY, checkboxSize, checkboxSize);
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 0.5;
    }

    if (settings.showMargin) {
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(30, 0);
      ctx.lineTo(30, height);
      ctx.stroke();
    }
  };

  const drawHexGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const hexSizeMM = settings.hexSize;
    const weight = Math.max(0.1, Math.min(2, settings.lineWeight));
    
    ctx.strokeStyle = getColorStyle();
    ctx.lineWidth = weight;

    const size = hexSizeMM / 2;
    const hexWidth = size * Math.sqrt(3);
    const hexHeight = size * 2;
    const vertDist = hexHeight * 0.75;

    const drawHexagon = (cx: number, cy: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + size * Math.cos(angle);
        const y = cy + size * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();
    };

    let row = 0;
    for (let y = size; y < height + hexHeight; y += vertDist) {
      const xOffset = row % 2 === 1 ? hexWidth / 2 : 0;
      for (let x = xOffset + hexWidth / 2; x < width + hexWidth; x += hexWidth) {
        drawHexagon(x, y);
      }
      row++;
    }
  };

  const drawKnitting = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cellWidth = Math.max(2, Math.min(15, settings.stitchWidth));
    const cellHeight = Math.max(2, Math.min(20, settings.stitchHeight));
    const weight = Math.max(0.1, Math.min(2, settings.lineWeight));
    
    ctx.strokeStyle = getColorStyle();
    ctx.lineWidth = weight;

    for (let x = 0; x <= width; x += cellWidth) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = 0; y <= height; y += cellHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawCalligraphy = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const lineHeight = Math.max(5, Math.min(15, settings.lineHeight));
    const angle = settings.calligraphyAngle;
    const angleRad = (angle * Math.PI) / 180;
    
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 0.5;

    for (let y = lineHeight; y < height; y += lineHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    ctx.strokeStyle = getColorStyle();
    ctx.lineWidth = 0.3;
    ctx.globalAlpha = 0.4;

    const slantSpacing = 5;
    const dx = Math.tan(angleRad) * height;
    
    for (let x = -dx; x < width + dx; x += slantSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, height);
      ctx.lineTo(x + dx, 0);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  };

  const downloadPDF = (paperType?: PaperType) => {
    const type = paperType || settings.paperType;
    const pageSize = getPageDimensions();
    
    let format: string | [number, number];
    const standardFormats = ['a4', 'letter', 'legal', 'a0', 'a1', 'a2'];
    const lowerPageSize = settings.pageSize.toLowerCase();
    
    if (standardFormats.includes(lowerPageSize)) {
      format = lowerPageSize as 'a4' | 'letter' | 'legal' | 'a0' | 'a1' | 'a2';
    } else {
      format = [pageSize.width, pageSize.height];
    }
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format
    });

    const width = pageSize.width;
    const height = pageSize.height;

    if (settings.useCustomBackground) {
      const bgColor = hexToRgb(settings.backgroundColor);
      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.rect(0, 0, width, height, 'F');
    }

    if (settings.showRulers) {
      drawRulersPDF(doc, width, height);
    }

    const tempSettings = { ...settings, paperType: type };

    switch (type) {
      case 'dot-grid':
        drawDotGridPDF(doc, width, height, tempSettings);
        break;
      case 'isometric-dots':
        drawIsometricDotsPDF(doc, width, height, tempSettings);
        break;
      case 'graph-paper':
        drawGraphPaperPDF(doc, width, height, tempSettings);
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
    }

    const filename = `${type}-${settings.pageSize}-${Date.now()}.pdf`;
    doc.save(filename);
  };

  const downloadBatchPDF = () => {
    if (settings.batchPaperTypes.length === 0) return;

    const pageSize = getPageDimensions();
    
    let format: string | [number, number];
    const standardFormats = ['a4', 'letter', 'legal', 'a0', 'a1', 'a2'];
    const lowerPageSize = settings.pageSize.toLowerCase();
    
    if (standardFormats.includes(lowerPageSize)) {
      format = lowerPageSize as 'a4' | 'letter' | 'legal' | 'a0' | 'a1' | 'a2';
    } else {
      format = [pageSize.width, pageSize.height];
    }
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format
    });

    let isFirstPage = true;
    const width = pageSize.width;
    const height = pageSize.height;

    settings.batchPaperTypes.forEach((type) => {
      if (!isFirstPage) {
        doc.addPage();
      }
      isFirstPage = false;

      if (settings.useCustomBackground) {
        const bgColor = hexToRgb(settings.backgroundColor);
        doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
        doc.rect(0, 0, width, height, 'F');
      }

      if (settings.showRulers) {
        drawRulersPDF(doc, width, height);
      }

      const tempSettings = { ...settings, paperType: type };

      switch (type) {
        case 'dot-grid':
          drawDotGridPDF(doc, width, height, tempSettings);
          break;
        case 'isometric-dots':
          drawIsometricDotsPDF(doc, width, height, tempSettings);
          break;
        case 'graph-paper':
          drawGraphPaperPDF(doc, width, height, tempSettings);
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
      }
    });

    const filename = `batch-${settings.pageSize}-${Date.now()}.pdf`;
    doc.save(filename);
  };

  const drawRulersPDF = (doc: jsPDF, width: number, height: number) => {
    const rulerWidth = 10;
    const tickSmall = 2;
    const tickMedium = 4;
    const tickLarge = 6;
    
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, width, rulerWidth, 'F');
    doc.rect(0, 0, rulerWidth, height, 'F');
    
    doc.setDrawColor(102, 102, 102);
    doc.setLineWidth(0.1);
    
    const unitSize = settings.unit === 'mm' ? 1 : 25.4;
    const majorTick = settings.unit === 'mm' ? 10 : 1;
    const minorTick = settings.unit === 'mm' ? 1 : 0.125;
    
    for (let x = 0; x <= width; x += minorTick * unitSize) {
      const isMajor = Math.abs(x % (majorTick * unitSize)) < 0.01;
      const isMedium = settings.unit === 'mm' ? Math.abs(x % (5 * unitSize)) < 0.01 : Math.abs(x % (0.5 * unitSize)) < 0.01;
      const tickHeight = isMajor ? tickLarge : (isMedium ? tickMedium : tickSmall);
      doc.line(x, 0, x, tickHeight);
    }
    
    for (let y = 0; y <= height; y += minorTick * unitSize) {
      const isMajor = Math.abs(y % (majorTick * unitSize)) < 0.01;
      const isMedium = settings.unit === 'mm' ? Math.abs(y % (5 * unitSize)) < 0.01 : Math.abs(y % (0.5 * unitSize)) < 0.01;
      const tickHeight = isMajor ? tickLarge : (isMedium ? tickMedium : tickSmall);
      doc.line(0, y, tickHeight, y);
    }
  };

  const drawDotGridPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
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
  };

  const drawIsometricDotsPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
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
  };

  const drawGraphPaperPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
    const gridSize = Math.max(1, Math.min(20, opts.gridSize));
    const weight = Math.max(0.1, Math.min(2, opts.lineWeight));
    
    let color;
    if (opts.useCustomColor) {
      color = hexToRgb(opts.customColor);
    } else {
      const colorMap: Record<string, number[]> = {
        cyan: [56, 189, 248],
        gray: [102, 102, 102],
        black: [0, 0, 0],
      };
      color = colorMap[opts.gridColor];
    }
    
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(weight);

    for (let x = 0; x <= width; x += gridSize) {
      doc.line(x, 0, x, height);
    }

    for (let y = 0; y <= height; y += gridSize) {
      doc.line(0, y, width, y);
    }
  };

  const drawLinedPaperPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
    const lineHeight = Math.max(5, Math.min(15, opts.lineHeight));
    
    doc.setDrawColor(204, 204, 204);
    doc.setLineWidth(0.5);

    for (let y = lineHeight; y < height; y += lineHeight) {
      doc.line(0, y, width, y);
    }

    if (opts.showMargin) {
      doc.setDrawColor(255, 0, 0);
      doc.setLineWidth(0.8);
      doc.line(30, 0, 30, height);
    }
  };

  const drawMusicStaffPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
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

      for (let line = 0; line < 5; line++) {
        const lineY = y + line * lineSpacing;
        doc.line(0, lineY, width, lineY);
      }

      doc.setLineWidth(0.5);
      doc.circle(10, y + staffHeight / 2, 2.5, 'S');
      doc.line(10, y, 10, y + staffHeight);
      doc.setLineWidth(0.3);
    }
  };

  const drawChecklistPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
    const lineHeight = Math.max(5, Math.min(15, opts.lineHeight));
    
    doc.setDrawColor(204, 204, 204);
    doc.setLineWidth(0.5);

    for (let y = lineHeight; y < height; y += lineHeight) {
      doc.line(0, y, width, y);

      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.5);
      const checkboxSize = 4;
      const checkboxY = y - lineHeight / 2 - checkboxSize / 2;
      doc.rect(15, checkboxY, checkboxSize, checkboxSize);
      doc.setDrawColor(204, 204, 204);
      doc.setLineWidth(0.5);
    }

    if (opts.showMargin) {
      doc.setDrawColor(255, 0, 0);
      doc.setLineWidth(0.8);
      doc.line(30, 0, 30, height);
    }
  };

  const drawHexGridPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
    const hexSizeMM = opts.hexSize;
    const weight = Math.max(0.1, Math.min(2, opts.lineWeight));
    
    let color;
    if (opts.useCustomColor) {
      color = hexToRgb(opts.customColor);
    } else {
      const colorMap: Record<string, number[]> = {
        cyan: [56, 189, 248],
        gray: [102, 102, 102],
        black: [0, 0, 0],
      };
      color = colorMap[opts.gridColor];
    }
    
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(weight);

    const size = hexSizeMM / 2;
    const hexWidth = size * Math.sqrt(3);
    const vertDist = size * 2 * 0.75;

    const drawHexagon = (cx: number, cy: number) => {
      const points: [number, number][] = [];
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        points.push([cx + size * Math.cos(angle), cy + size * Math.sin(angle)]);
      }
      
      for (let i = 0; i < 6; i++) {
        const next = (i + 1) % 6;
        doc.line(points[i][0], points[i][1], points[next][0], points[next][1]);
      }
    };

    let row = 0;
    for (let y = size; y < height + size * 2; y += vertDist) {
      const xOffset = row % 2 === 1 ? hexWidth / 2 : 0;
      for (let x = xOffset + hexWidth / 2; x < width + hexWidth; x += hexWidth) {
        drawHexagon(x, y);
      }
      row++;
    }
  };

  const drawKnittingPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
    const cellWidth = Math.max(2, Math.min(15, opts.stitchWidth));
    const cellHeight = Math.max(2, Math.min(20, opts.stitchHeight));
    const weight = Math.max(0.1, Math.min(2, opts.lineWeight));
    
    let color;
    if (opts.useCustomColor) {
      color = hexToRgb(opts.customColor);
    } else {
      const colorMap: Record<string, number[]> = {
        cyan: [56, 189, 248],
        gray: [102, 102, 102],
        black: [0, 0, 0],
      };
      color = colorMap[opts.gridColor];
    }
    
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(weight);

    for (let x = 0; x <= width; x += cellWidth) {
      doc.line(x, 0, x, height);
    }

    for (let y = 0; y <= height; y += cellHeight) {
      doc.line(0, y, width, y);
    }
  };

  const drawCalligraphyPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
    const lineHeight = Math.max(5, Math.min(15, opts.lineHeight));
    const angle = opts.calligraphyAngle;
    const angleRad = (angle * Math.PI) / 180;
    
    doc.setDrawColor(204, 204, 204);
    doc.setLineWidth(0.5);

    for (let y = lineHeight; y < height; y += lineHeight) {
      doc.line(0, y, width, y);
    }

    let color;
    if (opts.useCustomColor) {
      color = hexToRgb(opts.customColor);
    } else {
      const colorMap: Record<string, number[]> = {
        cyan: [56, 189, 248],
        gray: [102, 102, 102],
        black: [0, 0, 0],
      };
      color = colorMap[opts.gridColor];
    }
    
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.2);
    (doc as any).setGState(new (doc as any).GState({ opacity: 0.4 }));

    const slantSpacing = 5;
    const dx = Math.tan(angleRad) * height;
    
    for (let x = -dx; x < width + dx; x += slantSpacing) {
      doc.line(x, height, x + dx, 0);
    }

    (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));
  };

  const toggleBatchPaperType = (type: PaperType) => {
    updateSetting('batchPaperTypes', 
      settings.batchPaperTypes.includes(type)
        ? settings.batchPaperTypes.filter(t => t !== type)
        : [...settings.batchPaperTypes, type]
    );
  };

  const isInkSaverActive = settings.useCustomColor && settings.customColor === '#e0e0e0';

  const toggleInkSaver = () => {
    if (isInkSaverActive) {
      updateSetting('useCustomColor', false);
      updateSetting('customColor', '#000000');
    } else {
      updateSetting('useCustomColor', true);
      updateSetting('customColor', '#e0e0e0');
    }
  };

  const isLargeFormat = ['A0', 'A1', 'A2', 'ArchC', 'ArchD', 'ArchE'].includes(settings.pageSize);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col md:flex-row min-h-screen">
        <aside className="w-full md:w-80 bg-sidebar border-r border-sidebar-border p-4 md:p-6 md:h-screen md:overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-2" data-testid="text-app-title">
                {pageH1}
              </h1>
              <p className="text-sm text-muted-foreground">
                Generate custom printable paper
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paper-type" className="text-sm font-medium">
                  Paper Type
                </Label>
                <Select
                  value={settings.paperType}
                  onValueChange={(value) => handlePaperTypeChange(value as PaperType)}
                >
                  <SelectTrigger id="paper-type" className="h-10" data-testid="select-paper-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dot-grid" data-testid="option-dot-grid">Dot Grid</SelectItem>
                    <SelectItem value="isometric-dots" data-testid="option-isometric-dots">Isometric Dots</SelectItem>
                    <SelectItem value="graph-paper" data-testid="option-graph-paper">Graph Paper</SelectItem>
                    <SelectItem value="hex-grid" data-testid="option-hex-grid">Hexagon Grid (D&D)</SelectItem>
                    <SelectItem value="lined-paper" data-testid="option-lined-paper">Lined Paper</SelectItem>
                    <SelectItem value="music-staff" data-testid="option-music-staff">Music Staff</SelectItem>
                    <SelectItem value="checklist" data-testid="option-checklist">Checklist</SelectItem>
                    <SelectItem value="knitting" data-testid="option-knitting">Knitting/Cross-Stitch</SelectItem>
                    <SelectItem value="calligraphy" data-testid="option-calligraphy">Calligraphy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="page-size" className="text-sm font-medium">
                  Page Size
                </Label>
                <Select
                  value={settings.pageSize}
                  onValueChange={(value) => updateSetting('pageSize', value as PageSize)}
                >
                  <SelectTrigger id="page-size" className="h-10" data-testid="select-page-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4" data-testid="option-a4">A4 (210×297mm)</SelectItem>
                    <SelectItem value="Letter" data-testid="option-letter">Letter (8.5×11in)</SelectItem>
                    <SelectItem value="Legal" data-testid="option-legal">Legal (8.5×14in)</SelectItem>
                    <SelectItem value="A2" data-testid="option-a2">A2 (420×594mm)</SelectItem>
                    <SelectItem value="A1" data-testid="option-a1">A1 (594×841mm)</SelectItem>
                    <SelectItem value="A0" data-testid="option-a0">A0 (841×1189mm)</SelectItem>
                    <SelectItem value="ArchC" data-testid="option-archc">Arch C (18×24in)</SelectItem>
                    <SelectItem value="ArchD" data-testid="option-archd">Arch D (24×36in)</SelectItem>
                    <SelectItem value="ArchE" data-testid="option-arche">Arch E (36×48in)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="show-rulers" className="text-sm">
                    Edge Rulers
                  </Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Add measurement tick marks along the edges</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Switch
                  id="show-rulers"
                  checked={settings.showRulers}
                  onCheckedChange={(checked) => updateSetting('showRulers', checked)}
                  data-testid="switch-rulers"
                />
              </div>

              {settings.showRulers && (
                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-sm font-medium">
                    Ruler Unit
                  </Label>
                  <Select
                    value={settings.unit}
                    onValueChange={(value) => updateSetting('unit', value as Unit)}
                  >
                    <SelectTrigger id="unit" className="h-10" data-testid="select-unit">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm" data-testid="option-mm">Millimeters (mm)</SelectItem>
                      <SelectItem value="inches" data-testid="option-inches">Inches (in)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  variant={isInkSaverActive ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleInkSaver}
                  className="flex-1"
                  data-testid="button-ink-saver"
                >
                  {isInkSaverActive ? 'Ink Saver On' : 'Ink Saver (Light Grey)'}
                </Button>
              </div>

              {settings.paperType === 'dot-grid' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Perfect for bullet journaling, sketching, and planning. Adjust spacing for different grid densities and customize the dot appearance.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Spacing (mm)</Label>
                      <span className="text-number text-muted-foreground" data-testid="text-dot-spacing">
                        {settings.dotSpacing}mm
                      </span>
                    </div>
                    <Slider
                      value={[settings.dotSpacing]}
                      onValueChange={([value]) => updateSetting('dotSpacing', value)}
                      min={5}
                      max={30}
                      step={1}
                      data-testid="slider-dot-spacing"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Dot Size (px)</Label>
                      <span className="text-number text-muted-foreground" data-testid="text-dot-size">
                        {settings.dotSize}px
                      </span>
                    </div>
                    <Slider
                      value={[settings.dotSize]}
                      onValueChange={([value]) => updateSetting('dotSize', value)}
                      min={1}
                      max={3}
                      step={0.5}
                      data-testid="slider-dot-size"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Opacity</Label>
                      <span className="text-number text-muted-foreground" data-testid="text-dot-opacity">
                        {Math.round(settings.dotOpacity * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[settings.dotOpacity]}
                      onValueChange={([value]) => updateSetting('dotOpacity', value)}
                      min={0.1}
                      max={1}
                      step={0.1}
                      data-testid="slider-dot-opacity"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="use-custom-color" className="text-sm">
                      Custom Color
                    </Label>
                    <Switch
                      id="use-custom-color"
                      checked={settings.useCustomColor}
                      onCheckedChange={(checked) => updateSetting('useCustomColor', checked)}
                      data-testid="switch-custom-color"
                    />
                  </div>

                  {settings.useCustomColor && (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.customColor}
                        onChange={(e) => updateSetting('customColor', e.target.value)}
                        className="w-16 h-12 rounded cursor-pointer flex-shrink-0"
                        data-testid="input-color-picker"
                      />
                      <Input
                        type="text"
                        value={settings.customColor}
                        onChange={(e) => updateSetting('customColor', e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                        data-testid="input-color-hex"
                      />
                    </div>
                  )}
                </div>
              )}

              {settings.paperType === 'isometric-dots' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Ideal for 3D technical drawing, isometric sketches, and engineering diagrams. The hexagonal dot arrangement enables accurate perspective rendering.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Spacing (mm)</Label>
                      <span className="text-number text-muted-foreground" data-testid="text-isometric-spacing">
                        {settings.dotSpacing}mm
                      </span>
                    </div>
                    <Slider
                      value={[settings.dotSpacing]}
                      onValueChange={([value]) => updateSetting('dotSpacing', value)}
                      min={5}
                      max={30}
                      step={1}
                      data-testid="slider-isometric-spacing"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Dot Size (px)</Label>
                      <span className="text-number text-muted-foreground" data-testid="text-isometric-size">
                        {settings.dotSize}px
                      </span>
                    </div>
                    <Slider
                      value={[settings.dotSize]}
                      onValueChange={([value]) => updateSetting('dotSize', value)}
                      min={1}
                      max={3}
                      step={0.5}
                      data-testid="slider-isometric-size"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Opacity</Label>
                      <span className="text-number text-muted-foreground" data-testid="text-isometric-opacity">
                        {Math.round(settings.dotOpacity * 100)}%
                      </span>
                    </div>
                    <Slider
                      value={[settings.dotOpacity]}
                      onValueChange={([value]) => updateSetting('dotOpacity', value)}
                      min={0.1}
                      max={1}
                      step={0.1}
                      data-testid="slider-isometric-opacity"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="use-custom-color-iso" className="text-sm">
                      Custom Color
                    </Label>
                    <Switch
                      id="use-custom-color-iso"
                      checked={settings.useCustomColor}
                      onCheckedChange={(checked) => updateSetting('useCustomColor', checked)}
                      data-testid="switch-custom-color-iso"
                    />
                  </div>

                  {settings.useCustomColor && (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.customColor}
                        onChange={(e) => updateSetting('customColor', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                        data-testid="input-color-picker-iso"
                      />
                      <Input
                        type="text"
                        value={settings.customColor}
                        onChange={(e) => updateSetting('customColor', e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                        data-testid="input-color-hex-iso"
                      />
                    </div>
                  )}
                </div>
              )}

              {settings.paperType === 'graph-paper' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Precision grid paper for math, science, and technical work. Customize grid size, line weight, and color to match your needs.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-sm">Grid Size (mm)</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateSetting('gridSize', Math.max(1, settings.gridSize - 0.5))}
                        data-testid="button-grid-size-minus"
                      >
                        −
                      </Button>
                      <span className="flex-1 text-center text-number" data-testid="text-grid-size">
                        {settings.gridSize}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateSetting('gridSize', Math.min(20, settings.gridSize + 0.5))}
                        data-testid="button-grid-size-plus"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Line Weight</Label>
                      <span className="text-number text-muted-foreground" data-testid="text-line-weight">
                        {settings.lineWeight}
                      </span>
                    </div>
                    <Slider
                      value={[settings.lineWeight]}
                      onValueChange={([value]) => updateSetting('lineWeight', value)}
                      min={0.1}
                      max={2}
                      step={0.1}
                      data-testid="slider-line-weight"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grid-color" className="text-sm">
                      Grid Color
                    </Label>
                    <div className="flex items-center gap-2">
                      <Select
                        value={settings.useCustomColor ? 'custom' : settings.gridColor}
                        onValueChange={(value) => {
                          if (value === 'custom') {
                            updateSetting('useCustomColor', true);
                          } else {
                            updateSetting('useCustomColor', false);
                            updateSetting('gridColor', value as 'cyan' | 'gray' | 'black');
                          }
                        }}
                      >
                        <SelectTrigger id="grid-color" className="h-10" data-testid="select-grid-color">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cyan" data-testid="option-color-cyan">Cyan</SelectItem>
                          <SelectItem value="gray" data-testid="option-color-gray">Gray</SelectItem>
                          <SelectItem value="black" data-testid="option-color-black">Black</SelectItem>
                          <SelectItem value="custom" data-testid="option-color-custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {settings.useCustomColor && (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.customColor}
                        onChange={(e) => updateSetting('customColor', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                        data-testid="input-grid-color-picker"
                      />
                      <Input
                        type="text"
                        value={settings.customColor}
                        onChange={(e) => updateSetting('customColor', e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                        data-testid="input-grid-color-hex"
                      />
                    </div>
                  )}
                </div>
              )}

              {settings.paperType === 'hex-grid' && (
                <div className="space-y-4 pt-2">
                  <div className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded space-y-2">
                    <p>Perfect for tabletop gaming, D&D battle maps, and wargaming.</p>
                    <div className="flex items-center gap-2 text-primary">
                      <Info className="w-4 h-4" />
                      <span className="font-medium">1-inch hexes are standard for D&D miniatures.</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Hex Size (mm)</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateSetting('hexSize', Math.max(10, settings.hexSize - 1))}
                        data-testid="button-hex-size-minus"
                      >
                        −
                      </Button>
                      <span className="flex-1 text-center text-number" data-testid="text-hex-size">
                        {settings.hexSize}mm ({(settings.hexSize / 25.4).toFixed(2)}in)
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateSetting('hexSize', Math.min(100, settings.hexSize + 1))}
                        data-testid="button-hex-size-plus"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant={settings.hexSize === 25.4 ? 'default' : 'outline'}
                      onClick={() => updateSetting('hexSize', 25.4)}
                      className="flex-1"
                      size="sm"
                      data-testid="button-1inch-hex"
                    >
                      1 inch
                    </Button>
                    <Button
                      variant={settings.hexSize === 19.05 ? 'default' : 'outline'}
                      onClick={() => updateSetting('hexSize', 19.05)}
                      className="flex-1"
                      size="sm"
                      data-testid="button-3quarter-hex"
                    >
                      3/4 inch
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Line Weight</Label>
                      <span className="text-number text-muted-foreground" data-testid="text-hex-line-weight">
                        {settings.lineWeight}
                      </span>
                    </div>
                    <Slider
                      value={[settings.lineWeight]}
                      onValueChange={([value]) => updateSetting('lineWeight', value)}
                      min={0.1}
                      max={2}
                      step={0.1}
                      data-testid="slider-hex-line-weight"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hex-color" className="text-sm">
                      Line Color
                    </Label>
                    <Select
                      value={settings.useCustomColor ? 'custom' : settings.gridColor}
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          updateSetting('useCustomColor', true);
                        } else {
                          updateSetting('useCustomColor', false);
                          updateSetting('gridColor', value as 'cyan' | 'gray' | 'black');
                        }
                      }}
                    >
                      <SelectTrigger id="hex-color" className="h-10" data-testid="select-hex-color">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gray" data-testid="option-hex-gray">Gray</SelectItem>
                        <SelectItem value="black" data-testid="option-hex-black">Black</SelectItem>
                        <SelectItem value="cyan" data-testid="option-hex-cyan">Cyan</SelectItem>
                        <SelectItem value="custom" data-testid="option-hex-custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {settings.useCustomColor && (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.customColor}
                        onChange={(e) => updateSetting('customColor', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                        data-testid="input-hex-color-picker"
                      />
                      <Input
                        type="text"
                        value={settings.customColor}
                        onChange={(e) => updateSetting('customColor', e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                        data-testid="input-hex-color-hex"
                      />
                    </div>
                  )}
                </div>
              )}

              {settings.paperType === 'knitting' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Rectangular grid for knitting patterns and cross-stitch designs. Adjust the stitch ratio to match your gauge.
                  </p>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Stitch Width (mm)</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateSetting('stitchWidth', Math.max(2, settings.stitchWidth - 0.5))}
                        data-testid="button-stitch-width-minus"
                      >
                        −
                      </Button>
                      <span className="flex-1 text-center text-number" data-testid="text-stitch-width">
                        {settings.stitchWidth}mm
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateSetting('stitchWidth', Math.min(15, settings.stitchWidth + 0.5))}
                        data-testid="button-stitch-width-plus"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Stitch Height (mm)</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateSetting('stitchHeight', Math.max(2, settings.stitchHeight - 0.5))}
                        data-testid="button-stitch-height-minus"
                      >
                        −
                      </Button>
                      <span className="flex-1 text-center text-number" data-testid="text-stitch-height">
                        {settings.stitchHeight}mm
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateSetting('stitchHeight', Math.min(20, settings.stitchHeight + 0.5))}
                        data-testid="button-stitch-height-plus"
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Ratio: {(settings.stitchWidth / settings.stitchHeight).toFixed(2)}</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateSetting('stitchWidth', 5);
                          updateSetting('stitchHeight', 7.5);
                        }}
                        className="flex-1"
                        data-testid="button-ratio-2-3"
                      >
                        2:3 Ratio
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          updateSetting('stitchWidth', 5);
                          updateSetting('stitchHeight', 5);
                        }}
                        className="flex-1"
                        data-testid="button-ratio-1-1"
                      >
                        1:1 Square
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Line Weight</Label>
                      <span className="text-number text-muted-foreground" data-testid="text-knit-line-weight">
                        {settings.lineWeight}
                      </span>
                    </div>
                    <Slider
                      value={[settings.lineWeight]}
                      onValueChange={([value]) => updateSetting('lineWeight', value)}
                      min={0.1}
                      max={2}
                      step={0.1}
                      data-testid="slider-knit-line-weight"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="knit-color" className="text-sm">
                      Line Color
                    </Label>
                    <Select
                      value={settings.useCustomColor ? 'custom' : settings.gridColor}
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          updateSetting('useCustomColor', true);
                        } else {
                          updateSetting('useCustomColor', false);
                          updateSetting('gridColor', value as 'cyan' | 'gray' | 'black');
                        }
                      }}
                    >
                      <SelectTrigger id="knit-color" className="h-10" data-testid="select-knit-color">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gray" data-testid="option-knit-gray">Gray</SelectItem>
                        <SelectItem value="black" data-testid="option-knit-black">Black</SelectItem>
                        <SelectItem value="cyan" data-testid="option-knit-cyan">Cyan</SelectItem>
                        <SelectItem value="custom" data-testid="option-knit-custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {settings.useCustomColor && (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.customColor}
                        onChange={(e) => updateSetting('customColor', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                        data-testid="input-knit-color-picker"
                      />
                      <Input
                        type="text"
                        value={settings.customColor}
                        onChange={(e) => updateSetting('customColor', e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                        data-testid="input-knit-color-hex"
                      />
                    </div>
                  )}
                </div>
              )}

              {settings.paperType === 'calligraphy' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Practice paper with horizontal guide lines and slanted lines for consistent letter angles.
                  </p>
                  
                  <div className="space-y-2">
                    <Label className="text-sm">Line Height</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={settings.lineHeight === 7.1 ? 'default' : 'outline'}
                        onClick={() => updateSetting('lineHeight', 7.1)}
                        className="flex-1"
                        data-testid="button-calligraphy-college"
                      >
                        College (7.1mm)
                      </Button>
                      <Button
                        variant={settings.lineHeight === 8.7 ? 'default' : 'outline'}
                        onClick={() => updateSetting('lineHeight', 8.7)}
                        className="flex-1"
                        data-testid="button-calligraphy-wide"
                      >
                        Wide (8.7mm)
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Slant Angle</Label>
                      <span className="text-number text-muted-foreground" data-testid="text-slant-angle">
                        {settings.calligraphyAngle}°
                      </span>
                    </div>
                    <Slider
                      value={[settings.calligraphyAngle]}
                      onValueChange={([value]) => updateSetting('calligraphyAngle', value)}
                      min={45}
                      max={70}
                      step={1}
                      data-testid="slider-slant-angle"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant={settings.calligraphyAngle === 52 ? 'default' : 'outline'}
                        onClick={() => updateSetting('calligraphyAngle', 52)}
                        size="sm"
                        className="flex-1"
                        data-testid="button-angle-52"
                      >
                        52° Italic
                      </Button>
                      <Button
                        variant={settings.calligraphyAngle === 55 ? 'default' : 'outline'}
                        onClick={() => updateSetting('calligraphyAngle', 55)}
                        size="sm"
                        className="flex-1"
                        data-testid="button-angle-55"
                      >
                        55° Standard
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="calligraphy-color" className="text-sm">
                      Slant Line Color
                    </Label>
                    <Select
                      value={settings.useCustomColor ? 'custom' : settings.gridColor}
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          updateSetting('useCustomColor', true);
                        } else {
                          updateSetting('useCustomColor', false);
                          updateSetting('gridColor', value as 'cyan' | 'gray' | 'black');
                        }
                      }}
                    >
                      <SelectTrigger id="calligraphy-color" className="h-10" data-testid="select-calligraphy-color">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gray" data-testid="option-calligraphy-gray">Gray</SelectItem>
                        <SelectItem value="cyan" data-testid="option-calligraphy-cyan">Cyan</SelectItem>
                        <SelectItem value="black" data-testid="option-calligraphy-black">Black</SelectItem>
                        <SelectItem value="custom" data-testid="option-calligraphy-custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {settings.useCustomColor && (
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={settings.customColor}
                        onChange={(e) => updateSetting('customColor', e.target.value)}
                        className="w-12 h-10 rounded cursor-pointer"
                        data-testid="input-calligraphy-color-picker"
                      />
                      <Input
                        type="text"
                        value={settings.customColor}
                        onChange={(e) => updateSetting('customColor', e.target.value)}
                        className="flex-1"
                        placeholder="#000000"
                        data-testid="input-calligraphy-color-hex"
                      />
                    </div>
                  )}
                </div>
              )}

              {settings.paperType === 'lined-paper' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Classic ruled paper for writing and note-taking. Choose between college and wide rule spacing, with optional margin guide line.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-sm">Line Height</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={settings.lineHeight === 7.1 ? 'default' : 'outline'}
                        onClick={() => updateSetting('lineHeight', 7.1)}
                        className="flex-1"
                        data-testid="button-college-ruled"
                      >
                        College (7.1mm)
                      </Button>
                      <Button
                        variant={settings.lineHeight === 8.7 ? 'default' : 'outline'}
                        onClick={() => updateSetting('lineHeight', 8.7)}
                        className="flex-1"
                        data-testid="button-wide-ruled"
                      >
                        Wide (8.7mm)
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-margin" className="text-sm">
                      Red Margin Line
                    </Label>
                    <Switch
                      id="show-margin"
                      checked={settings.showMargin}
                      onCheckedChange={(checked) => updateSetting('showMargin', checked)}
                      data-testid="switch-margin"
                    />
                  </div>
                </div>
              )}

              {settings.paperType === 'music-staff' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Staff paper for composers and musicians. Adjust the number of staves per page to match your scoring needs and musical style.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-sm">Staves Per Page</Label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateSetting('stavesPerPage', Math.max(8, settings.stavesPerPage - 1))}
                        data-testid="button-staves-minus"
                      >
                        −
                      </Button>
                      <span className="flex-1 text-center text-number" data-testid="text-staves-count">
                        {settings.stavesPerPage}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateSetting('stavesPerPage', Math.min(12, settings.stavesPerPage + 1))}
                        data-testid="button-staves-plus"
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {settings.paperType === 'checklist' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Lined paper with checkbox squares for task lists and project planning. Quickly check off completed items while maintaining organized notes.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-sm">Line Height</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={settings.lineHeight === 7.1 ? 'default' : 'outline'}
                        onClick={() => updateSetting('lineHeight', 7.1)}
                        className="flex-1"
                        data-testid="button-college-ruled-checklist"
                      >
                        College (7.1mm)
                      </Button>
                      <Button
                        variant={settings.lineHeight === 8.7 ? 'default' : 'outline'}
                        onClick={() => updateSetting('lineHeight', 8.7)}
                        className="flex-1"
                        data-testid="button-wide-ruled-checklist"
                      >
                        Wide (8.7mm)
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-margin-checklist" className="text-sm">
                      Red Margin Line
                    </Label>
                    <Switch
                      id="show-margin-checklist"
                      checked={settings.showMargin}
                      onCheckedChange={(checked) => updateSetting('showMargin', checked)}
                      data-testid="switch-margin-checklist"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-2 border-t border-sidebar-border">
                <Button
                  onClick={() => downloadPDF()}
                  className="w-full h-12 text-base"
                  size="lg"
                  data-testid="button-download"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </Button>

                <details className="space-y-2">
                  <summary className="cursor-pointer font-medium text-sm text-primary hover:underline" data-testid="summary-batch-export">
                    Batch Export
                  </summary>
                  <div className="space-y-2 pt-2">
                    {(Object.keys(PAPER_TYPE_LABELS) as PaperType[]).map((type) => (
                      <label key={type} className="flex items-center gap-3 cursor-pointer py-2 px-2 rounded hover-elevate">
                        <input
                          type="checkbox"
                          id={`batch-${type}`}
                          checked={settings.batchPaperTypes.includes(type)}
                          onChange={() => toggleBatchPaperType(type)}
                          className="w-5 h-5 rounded border-primary cursor-pointer"
                          data-testid={`checkbox-batch-${type}`}
                        />
                        <span className="text-sm">{PAPER_TYPE_LABELS[type]}</span>
                      </label>
                    ))}
                    <Button
                      onClick={downloadBatchPDF}
                      disabled={settings.batchPaperTypes.length === 0}
                      className="w-full mt-2"
                      size="sm"
                      data-testid="button-batch-download"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Batch
                    </Button>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-2 md:p-8 flex flex-col items-center justify-center bg-background overflow-hidden">
          <div className="flex flex-col items-center gap-3 w-full max-w-4xl px-2 md:px-0">
            <div className="text-center">
              <span className="text-xl font-semibold text-foreground" data-testid="text-paper-size-label">
                {PAGE_SIZES[settings.pageSize].label}
              </span>
              {isLargeFormat && (
                <p className="text-xs text-muted-foreground mt-1">
                  Scroll to see more of the pattern
                </p>
              )}
            </div>
            <div 
              className="overflow-auto rounded shadow-[0_10px_30px_rgba(0,0,0,0.5)] bg-white"
              style={{ 
                maxWidth: '100%', 
                maxHeight: isLargeFormat ? '60vh' : '75vh',
              }}
              data-testid="canvas-container"
            >
              <canvas
                ref={canvasRef}
                data-testid="canvas-preview"
              />
            </div>
          </div>
        </main>
      </div>

      <article className="max-w-3xl mx-auto px-4 md:px-6 py-12 space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Why Use Printable Grid Paper?</h2>
        <p className="text-base leading-relaxed text-foreground/90">
          In a digital world, the tactile experience of writing on paper remains superior for memory retention. FreeGridPaper.com allows you to generate custom, high-resolution stationery instantly.
        </p>
        
        <h2 className="text-2xl font-bold text-foreground">Benefits of Dot Grid for Bullet Journaling</h2>
        <p className="text-base leading-relaxed text-foreground/90">
          Dot grid paper offers the structure of graph paper with the cleanliness of blank pages. Perfect for UX sketching, calligraphy, and planning.
        </p>
        
        <h2 className="text-2xl font-bold text-foreground">Isometric Dots for Technical Drawing</h2>
        <p className="text-base leading-relaxed text-foreground/90">
          Isometric dot grids are perfect for 3D sketching, technical drawing, and engineering diagrams. The hexagonal arrangement enables accurate perspective drawing.
        </p>

        <h2 className="text-2xl font-bold text-foreground">Hexagon Grids for Tabletop Gaming</h2>
        <p className="text-base leading-relaxed text-foreground/90">
          Hex grids are the gold standard for D&D battle maps and wargaming. Our 1-inch hex option is specifically designed for standard miniature bases.
        </p>
        
        <h2 className="text-2xl font-bold text-foreground">How to Print</h2>
        <p className="text-base leading-relaxed text-foreground/90">
          These files are vector PDFs. For accurate sizing (e.g., 5mm grid), set your printer to "Actual Size" or "Scale 100%".
        </p>
      </article>

      <footer className="bg-sidebar border-t border-sidebar-border py-8">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <nav className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 mb-4">
            <a
              href="/pages/about.html"
              className="text-primary hover:underline text-center"
              data-testid="link-about"
            >
              About
            </a>
            <span className="text-muted-foreground hidden sm:inline">|</span>
            <a
              href="/pages/contact.html"
              className="text-primary hover:underline text-center"
              data-testid="link-contact"
            >
              Contact
            </a>
            <span className="text-muted-foreground hidden sm:inline">|</span>
            <a
              href="/pages/privacy.html"
              className="text-primary hover:underline text-center"
              data-testid="link-privacy"
            >
              Privacy
            </a>
          </nav>
          <p className="text-center text-sm text-muted-foreground" data-testid="text-copyright">
            Copyright 2025 Ellie Petal Media
          </p>
        </div>
      </footer>
    </div>
  );
}
