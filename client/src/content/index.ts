import { categories as rawCategories } from './categories';
import { guides as rawGuides } from './guides';
import { presets as rawPresets } from './presets';
import { sitePages as rawSitePages } from './site-pages';
import { templates as rawTemplates } from './templates';
import type { CategoryEntry, GuideEntry, IndexableEntry, PaperType, PresetEntry, SitePageEntry, TemplateEntry } from './types';

export * from './types';

// Canonical URLs use a trailing slash, because prerendered pages are
// served as directory index.html files, and static hosting serves those
// at the slash URL. App routes in `path` stay slash free, because that
// is what Wouter matches, and the client lookup normalises a slash
// location back to the route. The root is the exception: '/' already
// ends in a slash, and it must not become '//'.
function withSlashCanonical<T extends { path: string; canonicalPath: string }>(entry: T): T {
  return {
    ...entry,
    canonicalPath: entry.path === '/' ? '/' : entry.path.endsWith('/') ? entry.path : `${entry.path}/`,
  };
}

export const categories = rawCategories.map(withSlashCanonical);
export const guides = rawGuides.map(withSlashCanonical);
export const presets = rawPresets.map(withSlashCanonical);
export const sitePages = rawSitePages.map(withSlashCanonical);
export const templates = rawTemplates.map(withSlashCanonical);

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
  // Wouter keeps a trailing slash in the location (for example /graph/),
  // while app routes in `path` have none, and canonical paths now carry
  // the slash. Without this, /graph/ missed the lookup and Home fell
  // back to the default dot grid paper.
  const normalizedPath = path.length > 1 ? path.replace(/\/+$/, '') : path;
  return templatesByPath.get(normalizedPath);
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
