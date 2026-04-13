import { categories } from './categories';
import { guides } from './guides';
import { presets } from './presets';
import { sitePages } from './site-pages';
import { templates } from './templates';
import type { CategoryEntry, GuideEntry, IndexableEntry, PaperType, PresetEntry, SitePageEntry, TemplateEntry } from './types';

export * from './types';
export { categories, guides, presets, sitePages, templates };

export const topNavTemplateIds = [
  'graph-paper',
  'dot-grid',
  'hex-grid',
  'music-staff',
  'engineering',
  'poster-size',
  'poster-hex',
  'handwriting',
  'guitar-tab',
  'genkoyoushi',
  'perspective-grid',
  'storyboard',
];

export const indexableEntries: IndexableEntry[] = [
  ...sitePages,
  ...categories,
  ...templates,
  ...presets,
  ...guides,
];

export const templatesById = new Map<string, TemplateEntry>(templates.map((entry) => [entry.id, entry]));
export const templatesByPath = new Map<string, TemplateEntry>(templates.map((entry) => [entry.path, entry]));
export const categoriesById = new Map<string, CategoryEntry>(categories.map((entry) => [entry.id, entry]));
export const categoriesBySlug = new Map<string, CategoryEntry>(categories.map((entry) => [entry.slug, entry]));
export const presetsBySlug = new Map<string, PresetEntry>(presets.map((entry) => [entry.slug, entry]));
export const guidesBySlug = new Map<string, GuideEntry>(guides.map((entry) => [entry.slug, entry]));
export const sitePagesByPath = new Map<string, SitePageEntry>(sitePages.map((entry) => [entry.path, entry]));

export function getTemplateByPath(path: string) {
  return templatesByPath.get(path);
}

export function getTemplateByPaperType(paperType: PaperType) {
  return templates.find((entry) => entry.settings.paperType === paperType);
}

export function getTemplateById(id: string) {
  return templatesById.get(id);
}

export function getCategoryById(id: string) {
  return categoriesById.get(id);
}

export function getCategoryBySlug(slug: string) {
  return categoriesBySlug.get(slug);
}

export function getPresetBySlug(slug: string) {
  return presetsBySlug.get(slug);
}

export function getGuideBySlug(slug: string) {
  return guidesBySlug.get(slug);
}

export function getSitePageByPath(path: string) {
  return sitePagesByPath.get(path);
}

export function getTopNavTemplates() {
  return topNavTemplateIds
    .map((id) => templatesById.get(id))
    .filter((entry): entry is TemplateEntry => Boolean(entry));
}

export function getTemplatesForCategory(categoryId: string) {
  return templates.filter((entry) => entry.categoryId === categoryId);
}

export function getPresetsForTemplate(templateId: string) {
  return presets.filter((entry) => entry.templateId === templateId);
}
