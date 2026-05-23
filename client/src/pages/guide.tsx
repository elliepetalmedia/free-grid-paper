import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { ContentCard } from '@/components/content/ContentCard';
import { EntryContent } from '@/components/content/EntryContent';
import { PageLayout } from '@/components/content/PageLayout';
import { getGuideBySlug, getPresetBySlug, getTemplateById } from '@/content';
import { usePageMetadata } from '@/hooks/use-page-metadata';
import NotFound from './not-found';

interface GuidePageProps {
  params: { slug: string };
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = getGuideBySlug(params.slug);
  if (!guide) return <NotFound />;

  usePageMetadata(guide);
  const relatedTemplates = guide.relatedTemplateIds.map(getTemplateById).filter(Boolean);
  const relatedPresets = guide.relatedPresetIds.map(getPresetBySlug).filter(Boolean);
  const primaryTemplate = guide.primaryTemplateId ? getTemplateById(guide.primaryTemplateId) : relatedTemplates[0];
  const primaryPreset = guide.primaryPresetId ? getPresetBySlug(guide.primaryPresetId) : relatedPresets[0];

  return (
    <PageLayout>
      <Breadcrumbs items={[{ label: 'Templates', path: '/templates' }, { label: guide.h1, path: guide.path }]} />
      <article className="max-w-3xl">
        <h1 className="text-4xl font-bold text-primary">{guide.h1}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{guide.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {primaryTemplate && (
            <a href={primaryTemplate.path} className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
              Open template
            </a>
          )}
          {primaryPreset && (
            <a href={primaryPreset.path} className="inline-flex items-center rounded-md border border-sidebar-border px-4 py-2 text-sm font-medium text-foreground hover:bg-sidebar-accent/40">
              Open preset
            </a>
          )}
        </div>
        <EntryContent
          answerSummary={guide.answerSummary}
          bestFor={guide.bestFor}
          body={guide.body}
          referenceFacts={guide.referenceFacts}
          relatedQuestions={guide.relatedQuestions}
          updatedAt={guide.updatedAt}
        />
      </article>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Related Templates</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {relatedTemplates.map((template) => template && (
            <ContentCard key={template.id} href={template.path} title={template.label} description={template.summary} image={template.previewImage} />
          ))}
        </div>
      </section>

      {relatedPresets.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Related Presets</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {relatedPresets.map((preset) => preset && (
              <ContentCard key={preset.id} href={preset.path} title={preset.label} description={preset.summary} image={preset.previewImage} />
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
