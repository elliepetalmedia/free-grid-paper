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

export interface TemplateSettings {
  paperType: PaperType;
  pageSize?: PageSize;
  lineHeight?: number;
  genkoyoushiSize?: number;
  perspectiveType?: '1-point' | '2-point';
  comicLayout?: '2x3' | '3x3' | 'splash';
  storyboardCols?: number;
  storyboardRows?: number;
  hexSize?: number;
  gridSize?: number;
  dotSpacing?: number;
  useCustomColor?: boolean;
  customColor?: string;
  backgroundColor?: string;
  useCustomBackground?: boolean;
  stavesPerPage?: number;
}

export interface FaqEntry {
  question: string;
  answer: string;
  href?: string;
}

export interface ReferenceFact {
  label: string;
  value: string;
}

export interface ContentSection {
  heading: string;
  body: string;
  items?: string[];
}

export interface SeoEntry {
  title: string;
  description: string;
  h1: string;
}

interface BaseContentEntry extends SeoEntry {
  id: string;
  slug: string;
  path: string;
  indexable: boolean;
  canonicalPath: string;
  previewImage: string;
  socialImage: string;
  summary: string;
  answerSummary?: string;
  updatedAt: string;
  body: ContentSection[];
  bestFor?: string[];
  referenceFacts?: ReferenceFact[];
  relatedQuestions?: FaqEntry[];
  faqs?: FaqEntry[];
}

export interface TemplateEntry extends BaseContentEntry {
  kind: 'template';
  label: string;
  categoryId: string;
  settings: TemplateSettings;
  quickDownloadText?: string;
  relatedTemplateIds: string[];
  popularPresetIds: string[];
}

export interface CategoryEntry extends BaseContentEntry {
  kind: 'category';
  templateIds: string[];
  relatedCategoryIds: string[];
  relatedGuideIds: string[];
}

export interface PresetEntry extends BaseContentEntry {
  kind: 'preset';
  label: string;
  templateId: string;
  categoryId: string;
  settings: TemplateSettings;
  useCases: string[];
  printTips: string[];
  relatedPresetIds: string[];
  relatedGuideIds: string[];
}

export interface GuideEntry extends BaseContentEntry {
  kind: 'guide';
  primaryTemplateId?: string;
  primaryPresetId?: string;
  relatedTemplateIds: string[];
  relatedPresetIds: string[];
}

export interface SitePageEntry extends BaseContentEntry {
  kind: 'site';
}

export type IndexableEntry = TemplateEntry | CategoryEntry | PresetEntry | GuideEntry | SitePageEntry;
