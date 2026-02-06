import { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Download, Info, X, Share2, Check } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { SEOContent, SEO_DATA } from '@/components/layout/SEOContent';
import { AdBanner } from '@/components/layout/AdBanner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TemplateGallery } from '@/components/home/TemplateGallery';
import { Grid } from 'lucide-react';

type PaperType = 'dot-grid' | 'graph-paper' | 'lined-paper' | 'music-staff' | 'checklist' | 'isometric-dots' | 'hex-grid' | 'knitting' | 'calligraphy' | 'handwriting' | 'guitar-tab' | 'bass-tab' | 'genkoyoushi' | 'perspective-grid' | 'comic-layout' | 'storyboard';
type PageSize = 'A4' | 'Letter' | 'Legal' | 'A0' | 'A1' | 'A2' | 'ArchC' | 'ArchD' | 'ArchE';
type Unit = 'mm' | 'inches';

// Helper to safely parse URL params
const parseUrlParams = (defaults: Settings) => {
  const params = new URLSearchParams(window.location.search);
  const updates: Partial<Settings> = {};
  let hasUpdates = false;


  try {
    for (const [key, value] of Array.from(params.entries())) {
      if (key in defaults) {
        // Handle types explicitly if needed, but JSON.parse is good for numbers/bools
        try {
          updates[key as keyof Settings] = JSON.parse(decodeURIComponent(value));
        } catch {
          // Fallback for strings that aren't JSON encoded
          updates[key as keyof Settings] = decodeURIComponent(value) as any;
        }
        hasUpdates = true;
      }
    }
  } catch (e) {
    console.error("Failed to parse URL params", e);
  }

  return hasUpdates ? updates : null;
};


const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : [0, 0, 0];
};

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

interface RoutePreset {
  paperType: PaperType;
  pageSize?: PageSize;
  lineHeight?: number;
  genkoyoushiSize?: number;
  perspectiveType?: '1-point' | '2-point';
  comicLayout?: '2x3' | '3x3' | 'splash';
  storyboardCols?: number;
  storyboardRows?: number;
  hexSize?: number;
  title: string;
  h1: string;
  quickDownloadText?: string;
  useCustomColor?: boolean;
  customColor?: string;
  backgroundColor?: string;
}

const ROUTE_PRESETS: Record<string, RoutePreset> = {
  '/hex-paper': { paperType: 'hex-grid', pageSize: 'Letter', hexSize: 25.4, title: 'Free Printable Hex Grid Paper | FreeGridPaper', h1: 'Hex Grid Paper', quickDownloadText: 'Hex Grid (Letter, 1")' },
  '/music-staff': { paperType: 'music-staff', pageSize: 'A4', title: 'Blank Sheet Music PDF | FreeGridPaper', h1: 'Blank Sheet Music', quickDownloadText: 'Blank Sheet Music (A4)' },
  '/engineering': { paperType: 'graph-paper', title: 'Engineering Graph Paper | FreeGridPaper', h1: 'Engineering Graph Paper', quickDownloadText: 'Engineering Paper', useCustomColor: true, customColor: '#228B22', backgroundColor: '#FFFFC5' },
  '/poster-size': { paperType: 'graph-paper', pageSize: 'ArchD', title: 'Poster Size Grid Paper | FreeGridPaper', h1: 'Poster Size Graph', quickDownloadText: 'Poster Graph (24×36")' },
  '/poster-hex': { paperType: 'hex-grid', pageSize: 'ArchD', hexSize: 25.4, title: 'Poster Size Hex Grid for D&D | FreeGridPaper', h1: 'Poster Size Hex (D&D)', quickDownloadText: 'Poster Hex Grid (24×36", 1")' },
  '/calligraphy': { paperType: 'calligraphy', title: 'Calligraphy Practice Paper | FreeGridPaper', h1: 'Calligraphy Practice Paper', quickDownloadText: 'Calligraphy Paper' },
  '/knitting': { paperType: 'knitting', title: 'Knitting & Cross-Stitch Graph Paper | FreeGridPaper', h1: 'Knitting Graph Paper', quickDownloadText: 'Knitting Graph' },
  '/graph': { paperType: 'graph-paper', pageSize: 'Letter', title: 'Standard Graph Paper | FreeGridPaper', h1: 'Standard Graph Paper', quickDownloadText: 'Graph Paper (Letter)' },
  '/dot-grid': { paperType: 'dot-grid', pageSize: 'A4', title: 'Dot Grid Paper | FreeGridPaper', h1: 'Dot Grid Paper', quickDownloadText: 'Dot Grid (A4)' },
  '/handwriting': { paperType: 'handwriting', pageSize: 'Letter', title: 'Handwriting Practice Paper | FreeGridPaper', h1: 'Handwriting Practice Paper', quickDownloadText: 'Handwriting Paper (Letter)', lineHeight: 15 },
  '/guitar-tab': { paperType: 'guitar-tab', pageSize: 'Letter', title: 'Guitar Tablature PDF | FreeGridPaper', h1: 'Guitar Tablature', quickDownloadText: 'Guitar Tab (Letter)' },
  '/bass-tab': { paperType: 'bass-tab', pageSize: 'Letter', title: 'Bass Tablature PDF | FreeGridPaper', h1: 'Bass Tablature', quickDownloadText: 'Bass Tab (Letter)' },
  '/genkoyoushi': { paperType: 'genkoyoushi', pageSize: 'A4', title: 'Genkoyoushi Japanese Manuscript Paper | FreeGridPaper', h1: 'Genkoyoushi Paper', quickDownloadText: 'Genkoyoushi (A4)', genkoyoushiSize: 10 },
  '/perspective-1': { paperType: 'perspective-grid', title: '1-Point Perspective Grid | FreeGridPaper', h1: '1-Point Perspective', quickDownloadText: '1-Point Perspective', perspectiveType: '1-point' },
  '/perspective-2': { paperType: 'perspective-grid', title: '2-Point Perspective Grid | FreeGridPaper', h1: '2-Point Perspective', quickDownloadText: '2-Point Perspective', perspectiveType: '2-point' },
  '/comic-2x3': { paperType: 'comic-layout', title: 'Comic Book Template (2x3) | FreeGridPaper', h1: 'Comic Layout (2x3)', quickDownloadText: 'Comic 2x3', comicLayout: '2x3' },
  '/storyboard': { paperType: 'storyboard', title: 'Storyboard Template | FreeGridPaper', h1: 'Storyboard Template', quickDownloadText: 'Storyboard (3x2)', storyboardCols: 3, storyboardRows: 2 },
  '/isometric-dots': { paperType: 'isometric-dots', pageSize: 'A4', title: 'Isometric Dot Grid Paper | FreeGridPaper', h1: 'Isometric Dot Grid', quickDownloadText: 'Isometric Dots (A4)' },
  '/lined-paper': { paperType: 'lined-paper', pageSize: 'Letter', title: 'Lined Paper PDF | FreeGridPaper', h1: 'Lined Paper', quickDownloadText: 'Lined Paper (Letter)' },
  '/checklist': { paperType: 'checklist', pageSize: 'Letter', title: 'Printable Checklist Paper | FreeGridPaper', h1: 'Checklist Paper', quickDownloadText: 'Checklist (Letter)' },
};

const TOP_NAV_PRESETS = [
  { label: 'Graph Paper', route: '/graph' },
  { label: 'Dot Grid', route: '/dot-grid' },
  { label: 'Hexagon (D&D)', route: '/hex-paper' },
  { label: 'Music Staff', route: '/music-staff' },
  { label: 'Engineering', route: '/engineering' },
  { label: 'Poster Size', route: '/poster-size' },
  { label: 'Poster Hex (D&D)', route: '/poster-hex' },
  { label: 'Handwriting', route: '/handwriting' },
  { label: 'Guitar Tab', route: '/guitar-tab' },
  { label: 'Genkoyoushi', route: '/genkoyoushi' },
  { label: 'Perspective', route: '/perspective-1' },
  { label: 'Storyboard', route: '/storyboard' },
];

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
  showHandwritingSlant: boolean;
  genkoyoushiSize: number;
  showRulers: boolean;
  backgroundColor: string;
  useCustomBackground: boolean;
  perspectiveType: '1-point' | '2-point';
  comicLayout: '2x3' | '3x3' | 'splash';
  storyboardCols: number;
  storyboardRows: number;
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
  showHandwritingSlant: false,
  genkoyoushiSize: 10,
  showRulers: false,
  backgroundColor: '#ffffff',
  useCustomBackground: false,
  perspectiveType: '1-point',
  comicLayout: '2x3',
  storyboardCols: 3,
  storyboardRows: 2,
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
  'handwriting': 'Handwriting Practice',
  'guitar-tab': 'Guitar Tab',
  'bass-tab': 'Bass Tab',
  'genkoyoushi': 'Genkoyoushi (Japanese)',
  'perspective-grid': 'Perspective Grid',
  'comic-layout': 'Comic Book Layout',
  'storyboard': 'Storyboard Template',
};

const PAPER_TYPE_TO_ROUTE: Partial<Record<PaperType, string>> = {
  'hex-grid': '/hex-paper',
  'music-staff': '/music-staff',
  'calligraphy': '/calligraphy',
  'knitting': '/knitting',
  'graph-paper': '/graph',
  'dot-grid': '/dot-grid',
  'handwriting': '/handwriting',
  'guitar-tab': '/guitar-tab',
  'bass-tab': '/bass-tab',
  'genkoyoushi': '/genkoyoushi',
  'perspective-grid': '/perspective-1',
  'comic-layout': '/comic-2x3',
  'storyboard': '/storyboard',
  'isometric-dots': '/isometric-dots',
  'lined-paper': '/lined-paper',
  'checklist': '/checklist',
};

const updateMetaDescription = (content: string) => {
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'description');
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
};

export default function Home() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [pageTitle, setPageTitle] = useState('FreeGridPaper');
  const [pageH1, setPageH1] = useState('FreeGridPaper');
  const [quickDownloadText, setQuickDownloadText] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const preset = ROUTE_PRESETS[location];
    let baseSettings = DEFAULT_SETTINGS;

    if (preset) {
      document.title = preset.title;
      setPageTitle(preset.title);
      setPageH1(preset.h1);
      setQuickDownloadText(preset.quickDownloadText || null);

      const desc = SEO_DATA[preset.paperType]?.description || "Free printable grid paper generator.";
      updateMetaDescription(desc);

      baseSettings = {
        ...DEFAULT_SETTINGS,
        paperType: preset.paperType,
        pageSize: preset.pageSize || DEFAULT_SETTINGS.pageSize,
        hexSize: preset.hexSize || DEFAULT_SETTINGS.hexSize,
        useCustomColor: preset.useCustomColor || false,
        customColor: preset.customColor || DEFAULT_SETTINGS.customColor,
        backgroundColor: preset.backgroundColor || DEFAULT_SETTINGS.backgroundColor,
        useCustomBackground: preset.backgroundColor ? true : false,
      };
    } else {
      document.title = 'FreeGridPaper - Free Printable Grid Paper Generator';
      setPageTitle('FreeGridPaper');
      setPageH1('FreeGridPaper');
      setQuickDownloadText(null);

      const saved = localStorage.getItem('freegridpaper-settings');
      let savedType = DEFAULT_SETTINGS.paperType;
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          baseSettings = { ...DEFAULT_SETTINGS, ...parsed };
          savedType = parsed.paperType || DEFAULT_SETTINGS.paperType;
        } catch (e) { }
      }

      const desc = SEO_DATA[savedType]?.description || "Free printable grid paper generator. Download custom graph paper, dot grid, lined paper, and more in PDF format.";
      updateMetaDescription(desc);
    }

    // Apply URL overrides on top of base settings
    const urlOverrides = parseUrlParams(DEFAULT_SETTINGS);
    setSettings(urlOverrides ? { ...baseSettings, ...urlOverrides } : baseSettings);

  }, [location]);

  // Sync settings to localStorage and update canvas
  useEffect(() => {
    localStorage.setItem('freegridpaper-settings', JSON.stringify(settings));
    drawCanvas();
  }, [settings]);

  const copyShareLink = () => {
    const params = new URLSearchParams();
    (Object.keys(settings) as Array<keyof Settings>).forEach(key => {
      const val = settings[key];
      params.set(key, encodeURIComponent(JSON.stringify(val)));
    });

    const url = `${window.location.origin}${location}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    if (ROUTE_PRESETS[location]) {
      setLocation('/');
    }
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePaperTypeChange = (paperType: PaperType) => {
    if (location !== '/') {
      setLocation('/');
    }
    setSettings(prev => ({ ...prev, paperType }));
  };

  const getPageDimensions = () => PAGE_SIZES[settings.pageSize];

  const getCanvasScale = () => {
    const pageSize = getPageDimensions();
    const isMobile = window.innerWidth < 800;
    const dpr = window.devicePixelRatio || 1;

    const maxCanvasPixels = isMobile ? 1080 : 2048;
    const maxDimension = Math.max(pageSize.width, pageSize.height);
    const naturalScale = 1.5;
    const maxScale = maxCanvasPixels / (maxDimension * dpr);

    return Math.min(naturalScale, maxScale);
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
    const isMobile = window.innerWidth < 800;
    const dpr = isMobile ? 1 : (window.devicePixelRatio || 1);
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
      case 'handwriting':
        drawHandwriting(ctx, pageSize.width, pageSize.height);
        break;
      case 'guitar-tab':
        drawGuitarTab(ctx, pageSize.width, pageSize.height);
        break;
      case 'bass-tab':
        drawBassTab(ctx, pageSize.width, pageSize.height);
        break;
      case 'genkoyoushi':
        drawGenkoyoushi(ctx, pageSize.width, pageSize.height);
        break;
      case 'perspective-grid':
        drawPerspectiveGrid(ctx, pageSize.width, pageSize.height);
        break;
      case 'comic-layout':
        drawComicLayout(ctx, pageSize.width, pageSize.height);
        break;
      case 'storyboard':
        drawStoryboard(ctx, pageSize.width, pageSize.height);
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

  const drawHandwriting = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const lineHeight = Math.max(5, Math.min(30, settings.lineHeight));
    const gap = lineHeight * 0.5; // Gap between rows
    const rowHeight = lineHeight + gap;
    const weight = Math.max(0.1, Math.min(2, settings.lineWeight));

    // Slant calculation (15 degrees if enabled)
    const angleRad = 15 * Math.PI / 180;
    const slantOffset = settings.showHandwritingSlant ? Math.tan(angleRad) * lineHeight : 0;

    for (let y = gap + lineHeight; y < height; y += rowHeight) {
      const baseY = y;
      const midY = y - lineHeight / 2;
      const topY = y - lineHeight;

      // Draw Slant Lines (Background, lighter)
      if (settings.showHandwritingSlant) {
        ctx.strokeStyle = '#e5e5e5';
        ctx.lineWidth = 0.2;
        ctx.setLineDash([]);
        const slantSpacing = lineHeight;

        // Simple slant grid
        for (let x = -lineHeight; x < width + lineHeight; x += slantSpacing) {
          ctx.beginPath();
          ctx.moveTo(x + slantOffset, topY);
          ctx.lineTo(x, baseY);
          ctx.stroke();
        }
      }

      // Top Line (Solid)
      ctx.strokeStyle = getColorStyle();
      ctx.lineWidth = weight;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(0, topY);
      ctx.lineTo(width, topY);
      ctx.stroke();

      // Mid Line (Dashed)
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = weight * 0.8;
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      // Base Line (Solid)
      ctx.setLineDash([]);
      ctx.lineWidth = weight;
      ctx.beginPath();
      ctx.moveTo(0, baseY);
      ctx.lineTo(width, baseY);
      ctx.stroke();
    }
  };

  const drawGuitarTab = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const staves = Math.min(Math.max(settings.stavesPerPage, 4), 10);
    const lineSpacing = 3; // 3mm spacing looks good for tab
    const staffHeight = lineSpacing * 5; // 6 lines = 5 spaces
    const availableHeight = height - 40;
    const totalStaffHeight = Math.min(staffHeight + 25, availableHeight / staves);
    const startY = 20;

    for (let i = 0; i < staves && (startY + i * totalStaffHeight + staffHeight) < height; i++) {
      const y = startY + i * totalStaffHeight;
      ctx.strokeStyle = getColorStyle();
      ctx.lineWidth = settings.lineWeight;
      ctx.beginPath();

      // Draw 6 lines
      for (let line = 0; line < 6; line++) {
        const ly = y + line * lineSpacing;
        ctx.moveTo(0, ly);
        ctx.lineTo(width, ly);
      }
      ctx.stroke();

      // Vertical bars at ends
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(0, y + staffHeight);
      ctx.moveTo(width, y);
      ctx.lineTo(width, y + staffHeight);
      ctx.stroke();

      // TAB label? optional.
      ctx.font = `${lineSpacing * 2.5}px sans-serif`;
      ctx.fillStyle = getColorStyle() === '#000000' ? '#000000' : '#666';
      ctx.fillText("T", 5, y + lineSpacing * 1.8);
      ctx.fillText("A", 5, y + lineSpacing * 3.2);
      ctx.fillText("B", 5, y + lineSpacing * 4.6);
    }
  };

  const drawBassTab = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const staves = Math.min(Math.max(settings.stavesPerPage, 4), 12);
    const lineSpacing = 3.5; // Slightly larger for bass
    const staffHeight = lineSpacing * 3; // 4 lines = 3 spaces
    const availableHeight = height - 40;
    const totalStaffHeight = Math.min(staffHeight + 25, availableHeight / staves);
    const startY = 20;

    for (let i = 0; i < staves && (startY + i * totalStaffHeight + staffHeight) < height; i++) {
      const y = startY + i * totalStaffHeight;
      ctx.strokeStyle = getColorStyle();
      ctx.lineWidth = settings.lineWeight;
      ctx.beginPath();

      // Draw 4 lines
      for (let line = 0; line < 4; line++) {
        const ly = y + line * lineSpacing;
        ctx.moveTo(0, ly);
        ctx.lineTo(width, ly);
      }
      ctx.stroke();

      // Vertical bars at ends
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(0, y + staffHeight);
      ctx.moveTo(width, y);
      ctx.lineTo(width, y + staffHeight);
      ctx.stroke();

      // TAB label
      ctx.font = `${lineSpacing * 2.5}px sans-serif`;
      ctx.fillStyle = getColorStyle() === '#000000' ? '#000000' : '#666';
      ctx.fillText("T", 5, y + lineSpacing * 1.8);
      ctx.fillText("A", 5, y + lineSpacing * 2.8);
      ctx.fillText("B", 5, y + lineSpacing * 3.8); // Adjust position
    }
  };

  const drawGenkoyoushi = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const size = Math.max(5, Math.min(20, settings.genkoyoushiSize));
    const gap = 2; // Gap between columns/rows
    // Usually vertical columns. We'll do columns.
    // 20x10 or so.

    // Let's standard horizontal rows for simplicity unless user wants vertical.
    // Standard Japanese manuscript is vertical columns right-to-left.
    // But "Graph Paper" usually implies a grid.
    // The "Genkoyoushi" preset is usually vertical columns for writing logic.
    // Let's implement vertical columns of squares.
    // BUT, Western printers are portrait/landscape.
    // Let's do horizontal rows of squares (easier to use for westerners learning).

    // We'll do horizontal rows.
    const colSpacing = 0;
    const rowSpacing = size * 0.4; // Gap between rows for furigana/ruby

    const cols = Math.floor((width - 20) / size);
    const rows = Math.floor((height - 20) / (size + rowSpacing));

    const startX = (width - cols * size) / 2;
    const startY = (height - (rows * (size + rowSpacing))) / 2;

    for (let r = 0; r < rows; r++) {
      const y = startY + r * (size + rowSpacing);
      for (let c = 0; c < cols; c++) {
        const x = startX + c * size;

        ctx.strokeStyle = getColorStyle();
        ctx.lineWidth = settings.lineWeight;
        ctx.setLineDash([]);
        ctx.strokeRect(x, y, size, size);

        // Dotted cross
        ctx.setLineDash([1, 2]);
        ctx.lineWidth = 0.2;
        ctx.beginPath();
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x + size / 2, y + size);
        ctx.moveTo(x, y + size / 2);
        ctx.lineTo(x + size, y + size / 2);
        ctx.stroke();
      }
    }
  };

  const drawPerspectiveGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = getColorStyle();
    ctx.lineWidth = settings.lineWeight; // Main lines
    ctx.beginPath();

    const horizonY = height / 2;

    // Horizon Line
    ctx.moveTo(0, horizonY);
    ctx.lineTo(width, horizonY);
    ctx.stroke();

    if (settings.perspectiveType === '1-point') {
      const centerX = width / 2;
      const centerY = horizonY;
      const density = 20; // Number of radiating lines

      for (let i = 0; i < density; i++) {
        const angle = (Math.PI * 2 * i) / density;
        // Extend lines off canvas
        const maxLength = Math.max(width, height) * 1.5;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * maxLength, centerY + Math.sin(angle) * maxLength);
        ctx.stroke();
      }
    } else {
      // 2-point
      const vp1X = -width * 0.5; // Left VP off-screen
      const vp2X = width * 1.5;  // Right VP off-screen
      const centerY = horizonY;
      const density = 20;

      // Radiating from left
      for (let i = 0; i <= density; i++) {
        // Fan out vertically at center
        const t = i / density;
        const targetY = -height + (3 * height) * t;
        ctx.beginPath();
        ctx.moveTo(vp1X, centerY);
        ctx.lineTo(width, targetY);
        ctx.stroke();
      }

      // Radiating from right
      for (let i = 0; i <= density; i++) {
        const t = i / density;
        const targetY = -height + (3 * height) * t;
        ctx.beginPath();
        ctx.moveTo(vp2X, centerY);
        ctx.lineTo(0, targetY);
        ctx.stroke();
      }
    }
  };

  const drawComicLayout = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = getColorStyle();
    ctx.lineWidth = 2; // Thicker border for panels

    const margin = 15; // 15mm margin
    const panelGap = 5;

    const usableWidth = width - margin * 2;
    const usableHeight = height - margin * 2;
    const startX = margin;
    const startY = margin;

    let rows = 3;
    let cols = 2;

    if (settings.comicLayout === '3x3') { cols = 3; rows = 3; }
    if (settings.comicLayout === 'splash') { cols = 1; rows = 1; }

    const panelWidth = (usableWidth - (cols - 1) * panelGap) / cols;
    const panelHeight = (usableHeight - (rows - 1) * panelGap) / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (panelWidth + panelGap);
        const y = startY + r * (panelHeight + panelGap);
        ctx.strokeRect(x, y, panelWidth, panelHeight);
      }
    }
  };

  const drawStoryboard = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = getColorStyle();

    const margin = 15;
    const gapX = 10;
    const gapY = 30; // More gap vertically for lines

    const cols = settings.storyboardCols || 3;
    const rows = settings.storyboardRows || 2;

    const totalGapX = (cols - 1) * gapX;
    const availableWidth = width - margin * 2 - totalGapX;
    const frameWidth = availableWidth / cols;
    const frameHeight = frameWidth * (9 / 16); // 16:9 aspect ratio

    // Check if we fit vertically
    // If not, scale down? Or just flow. For now, assume fit or static.

    const startX = margin;
    const startY = margin;

    for (let r = 0; r < rows; r++) {
      const rowY = startY + r * (frameHeight + gapY);

      for (let c = 0; c < cols; c++) {
        const x = startX + c * (frameWidth + gapX);

        // Frame
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, rowY, frameWidth, frameHeight);

        // Lines below
        ctx.lineWidth = 0.5;
        const lineAreaY = rowY + frameHeight + 5;
        const lineAreaH = gapY - 10;
        const lineCount = 3;
        const lineStep = lineAreaH / lineCount;

        for (let l = 1; l <= lineCount; l++) {
          const ly = lineAreaY + l * lineStep;
          ctx.beginPath();
          ctx.moveTo(x, ly);
          ctx.lineTo(x + frameWidth, ly);
          ctx.stroke();
        }
      }
    }
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



  const drawPerspectiveGridPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
    let color = opts.useCustomColor ? hexToRgb(opts.customColor) : [0, 0, 0];
    if (!opts.useCustomColor && opts.gridColor !== 'black') {
      const colorMap: Record<string, number[]> = { cyan: [56, 189, 248], gray: [102, 102, 102] };
      color = colorMap[opts.gridColor] || [0, 0, 0];
    }
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
        const endX = centerX + Math.cos(angle) * maxLength;
        const endY = centerY + Math.sin(angle) * maxLength;
        doc.line(centerX, centerY, endX, endY);
      }
    } else {
      const vp1X = -width * 0.5;
      const vp2X = width * 1.5;
      const centerY = horizonY;
      const density = 20;

      for (let i = 0; i <= density; i++) {
        const t = i / density;
        const targetY = -height + (3 * height) * t;
        doc.line(vp1X, centerY, width, targetY);
      }
      for (let i = 0; i <= density; i++) {
        const t = i / density;
        const targetY = -height + (3 * height) * t;
        doc.line(vp2X, centerY, 0, targetY);
      }
    }
  };

  const drawComicLayoutPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
    let color = opts.useCustomColor ? hexToRgb(opts.customColor) : [0, 0, 0];
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(0.7);

    const margin = 15;
    const panelGap = 5;
    const usableWidth = width - margin * 2;
    const usableHeight = height - margin * 2;
    const startX = margin;
    const startY = margin;

    let rows = 3;
    let cols = 2;
    if (opts.comicLayout === '3x3') { cols = 3; rows = 3; }
    if (opts.comicLayout === 'splash') { cols = 1; rows = 1; }

    const panelWidth = (usableWidth - (cols - 1) * panelGap) / cols;
    const panelHeight = (usableHeight - (rows - 1) * panelGap) / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (panelWidth + panelGap);
        const y = startY + r * (panelHeight + panelGap);
        doc.rect(x, y, panelWidth, panelHeight);
      }
    }
  };

  const drawStoryboardPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
    let color = opts.useCustomColor ? hexToRgb(opts.customColor) : [0, 0, 0];
    doc.setDrawColor(color[0], color[1], color[2]);

    const margin = 15;
    const gapX = 10;
    const gapY = 30;

    const cols = opts.storyboardCols || 3;
    const rows = opts.storyboardRows || 2;

    const totalGapX = (cols - 1) * gapX;
    const availableWidth = width - margin * 2 - totalGapX;
    const frameWidth = availableWidth / cols;
    const frameHeight = frameWidth * (9 / 16);

    const startX = margin;
    const startY = margin;

    for (let r = 0; r < rows; r++) {
      const rowY = startY + r * (frameHeight + gapY);
      for (let c = 0; c < cols; c++) {
        const x = startX + c * (frameWidth + gapX);

        // Frame
        doc.setLineWidth(0.5);
        doc.rect(x, rowY, frameWidth, frameHeight);

        // Lines
        doc.setLineWidth(0.2);
        const lineAreaY = rowY + frameHeight + 5;
        const lineAreaH = gapY - 10;
        const lineCount = 3;
        const lineStep = lineAreaH / lineCount;

        for (let l = 1; l <= lineCount; l++) {
          const ly = lineAreaY + l * lineStep;
          doc.line(x, ly, x + frameWidth, ly);
        }
      }
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

  const drawHandwritingPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
    const lineHeight = Math.max(5, Math.min(30, opts.lineHeight));
    const gap = lineHeight * 0.5;
    const rowHeight = lineHeight + gap;
    const weight = Math.max(0.1, Math.min(2, opts.lineWeight));

    const angleRad = 15 * Math.PI / 180;
    const slantOffset = opts.showHandwritingSlant ? Math.tan(angleRad) * lineHeight : 0;

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

    // Set Main Color
    doc.setDrawColor(color[0], color[1], color[2]);

    for (let y = gap + lineHeight; y < height; y += rowHeight) {
      const baseY = y;
      const midY = y - lineHeight / 2;
      const topY = y - lineHeight;

      // Slant Lines
      if (opts.showHandwritingSlant) {
        doc.setDrawColor(229, 229, 229); // #e5e5e5
        doc.setLineWidth(0.2);
        const slantSpacing = lineHeight;

        for (let x = -lineHeight; x < width + lineHeight; x += slantSpacing) {
          doc.line(x + slantOffset, topY, x, baseY);
        }

        // Restore color
        doc.setDrawColor(color[0], color[1], color[2]);
      }

      // Top Line
      doc.setLineWidth(weight);
      doc.line(0, topY, width, topY);

      // Mid Line (Dashed)
      doc.setLineWidth(weight * 0.8);
      doc.setLineDashPattern([1, 1], 0); // 1mm dash approx
      doc.line(0, midY, width, midY);
      doc.setLineDashPattern([], 0); // Solid

      // Base Line
      doc.setLineWidth(weight);
      doc.line(0, baseY, width, baseY);
    }
  };

  const drawGuitarTabPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
    const staves = Math.min(Math.max(opts.stavesPerPage, 4), 10);
    const lineSpacing = 3;
    const staffHeight = lineSpacing * 5;
    const availableHeight = height - 40;
    const totalStaffHeight = Math.min(staffHeight + 25, availableHeight / staves);
    const startY = 20;

    let color = opts.useCustomColor ? hexToRgb(opts.customColor) : [0, 0, 0];
    if (!opts.useCustomColor && opts.gridColor !== 'black') {
      const colorMap: Record<string, number[]> = { cyan: [56, 189, 248], gray: [102, 102, 102] };
      color = colorMap[opts.gridColor] || [0, 0, 0];
    }
    doc.setDrawColor(color[0], color[1], color[2]);

    for (let i = 0; i < staves && (startY + i * totalStaffHeight + staffHeight) < height; i++) {
      const y = startY + i * totalStaffHeight;
      doc.setLineWidth(opts.lineWeight);

      for (let line = 0; line < 6; line++) {
        const ly = y + line * lineSpacing;
        doc.line(0, ly, width, ly);
      }

      doc.line(0, y, 0, y + staffHeight);
      doc.line(width, y, width, y + staffHeight);

      // Text
      doc.setFontSize(lineSpacing * 2.5 * 0.3528); // px to mm approx conversion for font? PDF uses points?
      // jsPDF font size is in points. 1mm approx 2.8pt.
      doc.setFontSize(9);
      doc.text("T", 2, y + lineSpacing * 2.5);
      doc.text("A", 2, y + lineSpacing * 3.8);
      doc.text("B", 2, y + lineSpacing * 5.1);
    }
  };

  const drawBassTabPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
    const staves = Math.min(Math.max(opts.stavesPerPage, 4), 12);
    const lineSpacing = 3.5;
    const staffHeight = lineSpacing * 3;
    const availableHeight = height - 40;
    const totalStaffHeight = Math.min(staffHeight + 25, availableHeight / staves);
    const startY = 20;

    let color = opts.useCustomColor ? hexToRgb(opts.customColor) : [0, 0, 0];
    doc.setDrawColor(color[0], color[1], color[2]);

    for (let i = 0; i < staves && (startY + i * totalStaffHeight + staffHeight) < height; i++) {
      const y = startY + i * totalStaffHeight;
      doc.setLineWidth(opts.lineWeight);

      for (let line = 0; line < 4; line++) {
        const ly = y + line * lineSpacing;
        doc.line(0, ly, width, ly);
      }

      doc.line(0, y, 0, y + staffHeight);
      doc.line(width, y, width, y + staffHeight);

      doc.setFontSize(9);
      doc.text("T", 2, y + lineSpacing * 2.5);
      doc.text("A", 2, y + lineSpacing * 3.5);
      doc.text("B", 2, y + lineSpacing * 4.5); // approximate
    }
  };

  const drawGenkoyoushiPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
    const size = Math.max(5, Math.min(20, opts.genkoyoushiSize));
    const rowSpacing = size * 0.4;

    // Margins
    const cols = Math.floor((width - 20) / size);
    const rows = Math.floor((height - 20) / (size + rowSpacing));
    const startX = (width - cols * size) / 2;
    const startY = (height - (rows * (size + rowSpacing))) / 2;

    let color = opts.useCustomColor ? hexToRgb(opts.customColor) : [0, 0, 0];
    doc.setDrawColor(color[0], color[1], color[2]);

    for (let r = 0; r < rows; r++) {
      const y = startY + r * (size + rowSpacing);
      for (let c = 0; c < cols; c++) {
        const x = startX + c * size;

        doc.setLineWidth(opts.lineWeight);
        doc.setLineDashPattern([], 0);
        doc.rect(x, y, size, size);

        // Dotted cross
        doc.setLineDashPattern([1, 2], 0);
        doc.setLineWidth(0.2);
        doc.line(x + size / 2, y, x + size / 2, y + size);
        doc.line(x, y + size / 2, x + size, y + size / 2);
      }
    }
    doc.setLineDashPattern([], 0);
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

  const dismissQuickDownload = () => setQuickDownloadText(null);

  const handleGallerySelect = (route: string) => {
    setLocation(route);
    setGalleryOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <nav className="bg-sidebar border-b border-sidebar-border px-2 md:px-4 py-2 flex-shrink-0">
        <div className="flex items-center gap-2 md:gap-4 w-full">
          <div className="flex-shrink-0">
            <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 border-primary/20 hover:border-primary/50" data-testid="button-open-gallery">
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline">All Templates</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Stationery Template Gallery</DialogTitle>
                </DialogHeader>
                <TemplateGallery onSelect={handleGallerySelect} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="w-px h-6 bg-border mx-1 hidden md:block" />

          <span className="text-xs text-muted-foreground whitespace-nowrap hidden lg:inline">Quick Access:</span>
          <div className="flex items-center gap-1 md:gap-2 overflow-x-auto scrollbar-hide flex-1 mask-linear-fade">
            {TOP_NAV_PRESETS.map((preset) => (
              <Link key={preset.route} href={preset.route}>
                <Button
                  variant={location === preset.route ? 'default' : 'ghost'}
                  size="sm"
                  className="whitespace-nowrap text-xs md:text-sm"
                  data-testid={`nav-${preset.route.slice(1)}`}
                >
                  {preset.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <aside className="w-full md:w-80 bg-sidebar border-r border-sidebar-border p-4 md:p-6 md:h-[calc(100vh-48px)] md:overflow-y-auto flex-shrink-0">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-primary" data-testid="text-app-title">
                    {pageH1}
                  </h1>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={copyShareLink} title="Copy Link to current settings">
                    {copiedLink ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                  </Button>
                </div>
                <Link href="/faq" className="text-base text-primary hover:underline" data-testid="link-faq-sidebar">
                  FAQ
                </Link>
              </div>
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
                    <SelectItem value="handwriting" data-testid="option-handwriting">Handwriting Practice</SelectItem>
                    <SelectItem value="guitar-tab" data-testid="option-guitar-tab">Guitar Tablature</SelectItem>
                    <SelectItem value="bass-tab" data-testid="option-bass-tab">Bass Tablature</SelectItem>
                    <SelectItem value="genkoyoushi" data-testid="option-genkoyoushi">Genkoyoushi</SelectItem>
                    <SelectItem value="perspective-grid" data-testid="option-perspective-grid">Perspective Grid</SelectItem>
                    <SelectItem value="comic-layout" data-testid="option-comic-layout">Comic Book Layout</SelectItem>
                    <SelectItem value="storyboard" data-testid="option-storyboard">Storyboard Template</SelectItem>
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

              {settings.paperType === 'handwriting' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Handwriting practice paper with dashed midlines to guide letter formation.
                  </p>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Line Height</Label>
                      <span className="text-number text-muted-foreground">
                        {settings.lineHeight}mm
                      </span>
                    </div>
                    <Slider
                      value={[settings.lineHeight]}
                      onValueChange={([value]) => updateSetting('lineHeight', value)}
                      min={5}
                      max={30}
                      step={1}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-slant" className="text-sm">
                      Show Slant Guides (15°)
                    </Label>
                    <Switch
                      id="show-slant"
                      checked={settings.showHandwritingSlant}
                      onCheckedChange={(checked) => updateSetting('showHandwritingSlant', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="handwriting-color" className="text-sm">
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
                      <SelectTrigger id="handwriting-color" className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gray">Gray</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="cyan">Cyan</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {settings.useCustomColor && (
                    <div className="flex gap-2">
                      <input type="color" value={settings.customColor} onChange={(e) => updateSetting('customColor', e.target.value)} className="w-12 h-10 rounded cursor-pointer" />
                      <Input type="text" value={settings.customColor} onChange={(e) => updateSetting('customColor', e.target.value)} className="flex-1" />
                    </div>
                  )}
                </div>
              )}

              {settings.paperType === 'guitar-tab' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Standard 6-line tablature for guitar. Numbers indicate fret positions.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-sm">Staves Per Page</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => updateSetting('stavesPerPage', Math.max(4, settings.stavesPerPage - 1))}>−</Button>
                      <span className="flex-1 text-center text-number">{settings.stavesPerPage}</span>
                      <Button variant="outline" size="icon" onClick={() => updateSetting('stavesPerPage', Math.min(10, settings.stavesPerPage + 1))}>+</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Line Weight</Label>
                    <div className="flex justify-between"><span className="text-number text-muted-foreground">{settings.lineWeight}</span></div>
                    <Slider value={[settings.lineWeight]} onValueChange={([value]) => updateSetting('lineWeight', value)} min={0.1} max={2} step={0.1} />
                  </div>
                </div>
              )}

              {settings.paperType === 'bass-tab' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Standard 4-line tablature for bass guitar.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-sm">Staves Per Page</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => updateSetting('stavesPerPage', Math.max(4, settings.stavesPerPage - 1))}>−</Button>
                      <span className="flex-1 text-center text-number">{settings.stavesPerPage}</span>
                      <Button variant="outline" size="icon" onClick={() => updateSetting('stavesPerPage', Math.min(12, settings.stavesPerPage + 1))}>+</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Line Weight</Label>
                    <div className="flex justify-between"><span className="text-number text-muted-foreground">{settings.lineWeight}</span></div>
                    <Slider value={[settings.lineWeight]} onValueChange={([value]) => updateSetting('lineWeight', value)} min={0.1} max={2} step={0.1} />
                  </div>
                </div>
              )}

              {settings.paperType === 'genkoyoushi' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Traditional Japanese manuscript paper (Genkoyoushi) with square grid.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-sm">Square Size (mm)</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => updateSetting('genkoyoushiSize', Math.max(5, settings.genkoyoushiSize - 1))}>−</Button>
                      <span className="flex-1 text-center text-number">{settings.genkoyoushiSize}mm</span>
                      <Button variant="outline" size="icon" onClick={() => updateSetting('genkoyoushiSize', Math.min(20, settings.genkoyoushiSize + 1))}>+</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Line Weight</Label>
                    <div className="flex justify-between"><span className="text-number text-muted-foreground">{settings.lineWeight}</span></div>
                    <Slider value={[settings.lineWeight]} onValueChange={([value]) => updateSetting('lineWeight', value)} min={0.1} max={2} step={0.1} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gen-color" className="text-sm">Line Color</Label>
                    <Select value={settings.useCustomColor ? 'custom' : settings.gridColor} onValueChange={(value) => { if (value === 'custom') updateSetting('useCustomColor', true); else { updateSetting('useCustomColor', false); updateSetting('gridColor', value as any); } }}>
                      <SelectTrigger id="gen-color" className="h-10"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gray">Gray</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="cyan">Cyan</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}


              {settings.paperType === 'perspective-grid' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Radiating lines for technical drawing and illustration.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-sm">Perspective Type</Label>
                    <div className="flex gap-2">
                      <Button variant={settings.perspectiveType === '1-point' ? 'default' : 'outline'} onClick={() => updateSetting('perspectiveType', '1-point')} className="flex-1">1-Point</Button>
                      <Button variant={settings.perspectiveType === '2-point' ? 'default' : 'outline'} onClick={() => updateSetting('perspectiveType', '2-point')} className="flex-1">2-Point</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Line Weight</Label>
                    <div className="flex justify-between"><span className="text-number text-muted-foreground">{settings.lineWeight}</span></div>
                    <Slider value={[settings.lineWeight]} onValueChange={([value]) => updateSetting('lineWeight', value)} min={0.1} max={2} step={0.1} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="persp-color" className="text-sm">Line Color</Label>
                    <Select value={settings.useCustomColor ? 'custom' : settings.gridColor} onValueChange={(value) => { if (value === 'custom') updateSetting('useCustomColor', true); else { updateSetting('useCustomColor', false); updateSetting('gridColor', value as any); } }}>
                      <SelectTrigger id="persp-color" className="h-10"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gray">Gray</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="cyan">Cyan</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {settings.paperType === 'comic-layout' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Standard panel layouts for comic creation.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-sm">Layout Style</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button variant={settings.comicLayout === '2x3' ? 'default' : 'outline'} onClick={() => updateSetting('comicLayout', '2x3')} size="sm">2x3</Button>
                      <Button variant={settings.comicLayout === '3x3' ? 'default' : 'outline'} onClick={() => updateSetting('comicLayout', '3x3')} size="sm">3x3</Button>
                      <Button variant={settings.comicLayout === 'splash' ? 'default' : 'outline'} onClick={() => updateSetting('comicLayout', 'splash')} size="sm">Splash</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comic-color" className="text-sm">Line Color</Label>
                    <Select value={settings.useCustomColor ? 'custom' : settings.gridColor} onValueChange={(value) => { if (value === 'custom') updateSetting('useCustomColor', true); else { updateSetting('useCustomColor', false); updateSetting('gridColor', value as any); } }}>
                      <SelectTrigger id="comic-color" className="h-10"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gray">Gray</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                        <SelectItem value="cyan">Cyan</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {settings.paperType === 'storyboard' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    16:9 frames with ruled lines for scene description.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-sm">Columns: {settings.storyboardCols}</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => updateSetting('storyboardCols', Math.max(1, settings.storyboardCols - 1))}>−</Button>
                      <Slider value={[settings.storyboardCols]} onValueChange={([value]) => updateSetting('storyboardCols', value)} min={1} max={4} step={1} className="flex-1" />
                      <Button variant="outline" size="icon" onClick={() => updateSetting('storyboardCols', Math.min(4, settings.storyboardCols + 1))}>+</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Rows: {settings.storyboardRows}</Label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => updateSetting('storyboardRows', Math.max(1, settings.storyboardRows - 1))}>−</Button>
                      <Slider value={[settings.storyboardRows]} onValueChange={([value]) => updateSetting('storyboardRows', value)} min={1} max={5} step={1} className="flex-1" />
                      <Button variant="outline" size="icon" onClick={() => updateSetting('storyboardRows', Math.min(5, settings.storyboardRows + 1))}>+</Button>
                    </div>
                  </div>
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
          {quickDownloadText && (
            <div className="w-full max-w-2xl mb-4 bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-center justify-between gap-4" data-testid="quick-download-banner">
              <div className="flex items-center gap-3">
                <span className="text-base font-medium text-foreground">
                  Ready to download: {quickDownloadText}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => downloadPDF()} size="sm" data-testid="button-quick-download">
                  <Download className="w-4 h-4 mr-2" />
                  Download Now
                </Button>
                <Button variant="ghost" size="icon" onClick={dismissQuickDownload} data-testid="button-dismiss-banner">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
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

      <SEOContent paperType={settings.paperType} />
      <AdBanner />

      <footer className="bg-sidebar border-t border-sidebar-border py-8">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <nav className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 mb-4">
            <Link
              href="/faq"
              className="text-primary hover:underline text-center"
              data-testid="link-faq"
            >
              FAQ
            </Link>
            <span className="text-muted-foreground hidden sm:inline">|</span>
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
