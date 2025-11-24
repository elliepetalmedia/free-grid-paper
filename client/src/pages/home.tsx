import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

type PaperType = 'dot-grid' | 'graph-paper' | 'lined-paper' | 'music-staff' | 'checklist' | 'isometric-dots';
type PageSize = 'A4' | 'Letter' | 'Legal';

const PAGE_SIZES: Record<PageSize, { width: number; height: number }> = {
  'A4': { width: 210, height: 297 },
  'Letter': { width: 215.9, height: 279.4 },
  'Legal': { width: 215.9, height: 355.6 },
};

interface Settings {
  paperType: PaperType;
  pageSize: PageSize;
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
}

const DEFAULT_SETTINGS: Settings = {
  paperType: 'dot-grid',
  pageSize: 'A4',
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
};

export default function Home() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('freegridpaper-settings');
    if (saved) {
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

  const getPageDimensions = () => PAGE_SIZES[settings.pageSize];

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pageSize = getPageDimensions();
    const dpr = window.devicePixelRatio || 1;
    const scale = 2;

    canvas.width = pageSize.width * scale * dpr;
    canvas.height = pageSize.height * scale * dpr;
    canvas.style.width = `${pageSize.width * scale}px`;
    canvas.style.height = `${pageSize.height * scale}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(scale * dpr, scale * dpr);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageSize.width, pageSize.height);

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

  const drawDotGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const spacing = Math.max(5, Math.min(30, settings.dotSpacing));
    const size = Math.max(1, Math.min(3, settings.dotSize));
    const opacity = Math.max(0.1, Math.min(1, settings.dotOpacity));

    const color = settings.useCustomColor ? hexToRgb(settings.customColor) : [0, 0, 0];
    ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${opacity})`;

    for (let y = spacing; y < height; y += spacing) {
      for (let x = spacing; x < width; x += spacing) {
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

    for (let y = 0; y < height; y += spacing * 1.5) {
      for (let x = 0; x < width; x += hexSpacing) {
        const xOffset = (y / (spacing * 1.5)) % 2 === 1 ? hexSpacing / 2 : 0;
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

  const downloadPDF = (paperType?: PaperType) => {
    const type = paperType || settings.paperType;
    const pageSize = getPageDimensions();
    const format = settings.pageSize.toLowerCase() as 'a4' | 'letter' | 'legal';
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format
    });

    const width = pageSize.width;
    const height = pageSize.height;

    // Save current settings
    const savedPaperType = settings.paperType;
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
    }

    const filename = `${type}-${settings.pageSize}-${Date.now()}.pdf`;
    doc.save(filename);
  };

  const downloadBatchPDF = () => {
    if (settings.batchPaperTypes.length === 0) return;

    const pageSize = getPageDimensions();
    const format = settings.pageSize.toLowerCase() as 'a4' | 'letter' | 'legal';
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
      }
    });

    const filename = `batch-${settings.pageSize}-${Date.now()}.pdf`;
    doc.save(filename);
  };

  const drawDotGridPDF = (doc: jsPDF, width: number, height: number, opts: Settings) => {
    const spacing = Math.max(5, Math.min(30, opts.dotSpacing));
    const size = Math.max(1, Math.min(3, opts.dotSize));
    const opacity = Math.max(0.1, Math.min(1, opts.dotOpacity));

    const color = opts.useCustomColor ? hexToRgb(opts.customColor) : [0, 0, 0];
    doc.setFillColor(color[0], color[1], color[2]);
    (doc as any).setGState(new (doc as any).GState({ opacity }));

    for (let y = spacing; y < height; y += spacing) {
      for (let x = spacing; x < width; x += spacing) {
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

    for (let y = 0; y < height; y += spacing * 1.5) {
      for (let x = 0; x < width; x += hexSpacing) {
        const xOffset = (y / (spacing * 1.5)) % 2 === 1 ? hexSpacing / 2 : 0;
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

  const toggleBatchPaperType = (type: PaperType) => {
    updateSetting('batchPaperTypes', 
      settings.batchPaperTypes.includes(type)
        ? settings.batchPaperTypes.filter(t => t !== type)
        : [...settings.batchPaperTypes, type]
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-col md:flex-row min-h-screen">
        <aside className="w-full md:w-80 bg-sidebar border-r border-sidebar-border p-6 md:h-screen md:overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-primary mb-2" data-testid="text-app-title">
                FreeGridPaper
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
                  onValueChange={(value) => updateSetting('paperType', value as PaperType)}
                >
                  <SelectTrigger id="paper-type" className="h-10" data-testid="select-paper-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dot-grid" data-testid="option-dot-grid">Dot Grid</SelectItem>
                    <SelectItem value="isometric-dots" data-testid="option-isometric-dots">Isometric Dots</SelectItem>
                    <SelectItem value="graph-paper" data-testid="option-graph-paper">Graph Paper</SelectItem>
                    <SelectItem value="lined-paper" data-testid="option-lined-paper">Lined Paper</SelectItem>
                    <SelectItem value="music-staff" data-testid="option-music-staff">Music Staff</SelectItem>
                    <SelectItem value="checklist" data-testid="option-checklist">Checklist</SelectItem>
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
                  </SelectContent>
                </Select>
              </div>

              {settings.paperType === 'dot-grid' && (
                <div className="space-y-4 pt-2">
                  <p className="text-sm text-muted-foreground bg-sidebar-accent/50 p-3 rounded">
                    Perfect for bullet journaling, sketching, and planning. Adjust spacing for different grid densities and customize the dot appearance.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Spacing (mm)</Label>
                      <span className="text-sm text-muted-foreground" data-testid="text-dot-spacing">
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
                      <span className="text-sm text-muted-foreground" data-testid="text-dot-size">
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
                      <span className="text-sm text-muted-foreground" data-testid="text-dot-opacity">
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
                        className="w-12 h-10 rounded cursor-pointer"
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
                      <span className="text-sm text-muted-foreground" data-testid="text-isometric-spacing">
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
                      <span className="text-sm text-muted-foreground" data-testid="text-isometric-size">
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
                      <span className="text-sm text-muted-foreground" data-testid="text-isometric-opacity">
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
                    <Label htmlFor="grid-size" className="text-sm">
                      Grid Size (mm)
                    </Label>
                    <Input
                      id="grid-size"
                      type="number"
                      value={settings.gridSize}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (isNaN(value) || value <= 0) {
                          updateSetting('gridSize', 5);
                        } else {
                          updateSetting('gridSize', Math.min(20, value));
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseFloat(e.target.value);
                        if (isNaN(value) || value <= 0) {
                          updateSetting('gridSize', 5);
                        }
                      }}
                      min={1}
                      max={20}
                      step={0.5}
                      data-testid="input-grid-size"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="text-sm">Line Weight</Label>
                      <span className="text-sm text-muted-foreground" data-testid="text-line-weight">
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
                    <Label htmlFor="staves-count" className="text-sm">
                      Staves Per Page
                    </Label>
                    <Input
                      id="staves-count"
                      type="number"
                      value={settings.stavesPerPage}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (isNaN(value) || value < 8 || value > 12) {
                          updateSetting('stavesPerPage', 10);
                        } else {
                          updateSetting('stavesPerPage', value);
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value);
                        if (isNaN(value) || value < 8 || value > 12) {
                          updateSetting('stavesPerPage', 10);
                        }
                      }}
                      min={8}
                      max={12}
                      data-testid="input-staves-count"
                    />
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
                    {(['dot-grid', 'isometric-dots', 'graph-paper', 'lined-paper', 'music-staff', 'checklist'] as PaperType[]).map((type) => (
                      <div key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`batch-${type}`}
                          checked={settings.batchPaperTypes.includes(type)}
                          onChange={() => toggleBatchPaperType(type)}
                          className="w-4 h-4 rounded border-primary cursor-pointer"
                          data-testid={`checkbox-batch-${type}`}
                        />
                        <label htmlFor={`batch-${type}`} className="text-sm cursor-pointer">
                          {type === 'dot-grid' ? 'Dot Grid' : type === 'isometric-dots' ? 'Isometric Dots' : type === 'graph-paper' ? 'Graph Paper' : type === 'lined-paper' ? 'Lined Paper' : type === 'music-staff' ? 'Music Staff' : 'Checklist'}
                        </label>
                      </div>
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

        <main className="flex-1 p-4 md:p-8 flex items-center justify-center bg-background">
          <div className="w-full max-w-2xl">
            <canvas
              ref={canvasRef}
              className="w-full h-auto rounded shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              data-testid="canvas-preview"
            />
          </div>
        </main>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12 space-y-6">
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
        
        <h2 className="text-2xl font-bold text-foreground">How to Print</h2>
        <p className="text-base leading-relaxed text-foreground/90">
          These files are vector PDFs. For accurate sizing (e.g., 5mm grid), set your printer to "Actual Size" or "Scale 100%".
        </p>
      </article>

      <footer className="bg-sidebar border-t border-sidebar-border py-8">
        <div className="max-w-3xl mx-auto px-6">
          <nav className="flex flex-wrap justify-center gap-4 mb-4">
            <a
              href="/pages/about.html"
              className="text-primary hover:underline"
              data-testid="link-about"
            >
              About
            </a>
            <span className="text-muted-foreground">|</span>
            <a
              href="/pages/contact.html"
              className="text-primary hover:underline"
              data-testid="link-contact"
            >
              Contact
            </a>
            <span className="text-muted-foreground">|</span>
            <a
              href="/pages/privacy.html"
              className="text-primary hover:underline"
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
