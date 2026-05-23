import React from 'react';
import { Link } from 'wouter';
import { EntryContent } from '@/components/content/EntryContent';
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
          <EntryContent
            answerSummary={template.answerSummary}
            bestFor={template.bestFor}
            body={template.body}
            referenceFacts={template.referenceFacts}
            relatedQuestions={template.relatedQuestions}
            updatedAt={template.updatedAt}
          />
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
