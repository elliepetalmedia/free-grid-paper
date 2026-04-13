import React from 'react';
import { Link } from 'wouter';
import { getCategoryById, getPresetsForTemplate, getTemplateById, getTemplateByPaperType } from '@/content';
import type { PaperType } from '@/content';

interface SEOContentProps {
  paperType: PaperType;
}

export const SEOContent: React.FC<SEOContentProps> = ({ paperType }) => {
  const template = getTemplateByPaperType(paperType);
  if (!template) return null;

  const category = getCategoryById(template.categoryId);
  const relatedTemplates = template.relatedTemplateIds.map(getTemplateById).filter(Boolean);
  const popularPresets = getPresetsForTemplate(template.id).slice(0, 4);

  return (
    <section className="w-full bg-white border-t border-sidebar-border mt-12 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-4 text-primary">{template.h1}</h2>
        <div className="prose prose-slate max-w-none text-slate-700">
          <p>{template.summary}</p>
          {template.body.map((section) => (
            <React.Fragment key={section.heading}>
              <h3 className="text-lg font-semibold mt-6 mb-2 text-slate-800">{section.heading}</h3>
              <p>{section.body}</p>
              {section.items && (
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
            </React.Fragment>
          ))}
          <div className="mt-8 pt-4 border-t border-slate-200">
            <p className="text-sm font-semibold text-slate-600 mb-2">Explore more:</p>
            <div className="flex flex-wrap gap-4 text-sm text-primary">
              {category && <Link href={category.path}>{category.h1}</Link>}
              <Link href="/templates">All Templates</Link>
              {relatedTemplates.map((entry) => entry && (
                <Link key={entry.id} href={entry.path}>{entry.label}</Link>
              ))}
              {popularPresets.map((entry) => (
                <Link key={entry.id} href={entry.path}>{entry.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
