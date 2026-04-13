export type PaperType =
  | 'dot-grid'
  | 'graph-paper'
  | 'lined-paper'
  | 'music-staff'
  | 'checklist'
  | 'isometric-dots'
  | 'hex-grid'
  | 'knitting'
  | 'calligraphy'
  | 'handwriting'
  | 'guitar-tab'
  | 'bass-tab'
  | 'genkoyoushi'
  | 'perspective-grid'
  | 'comic-layout'
  | 'storyboard';

export type PageSize = 'A4' | 'Letter' | 'Legal' | 'A0' | 'A1' | 'A2' | 'ArchC' | 'ArchD' | 'ArchE';
export type Unit = 'mm' | 'inches';

export interface Settings {
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
