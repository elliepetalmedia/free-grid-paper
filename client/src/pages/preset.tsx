import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { ContentCard } from '@/components/content/ContentCard';
import { PageLayout } from '@/components/content/PageLayout';
import { getCategoryById, getGuideBySlug, getPresetBySlug, getTemplateById, presets } from '@/content';
import { usePageMetadata } from '@/hooks/use-page-metadata';
import NotFound from './not-found';

interface PresetPageProps {
  params: { slug: string };
}

export default function PresetPage({ params }: PresetPageProps) {
  const preset = getPresetBySlug(params.slug);
  if (!preset) return <NotFound />;

  usePageMetadata(preset);
  const template = getTemplateById(preset.templateId);
  const category = getCategoryById(preset.categoryId);
  const relatedPresets = preset.relatedPresetIds.map((id) => presets.find((entry) => entry.id === id)).filter(Boolean);
  const relatedGuides = preset.relatedGuideIds.map(getGuideBySlug).filter(Boolean);

  const query = new URLSearchParams();
  Object.entries(preset.settings).forEach(([key, value]) => {
    query.set(key, encodeURIComponent(JSON.stringify(value)));
  });
  const generatorHref = `${template?.path || '/'}?${query.toString()}`;

  return (
    <PageLayout>
      <Breadcrumbs
        items={[
          { label: 'Templates', path: '/templates' },
          ...(category ? [{ label: category.h1, path: category.path }] : []),
          ...(template ? [{ label: template.label, path: template.path }] : []),
          { label: preset.h1, path: preset.path },
        ]}
      />
      <section className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <h1 className="text-4xl font-bold text-primary">{preset.h1}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{preset.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={generatorHref}>
              <Button>Open Generator</Button>
            </Link>
            {template && (
              <Link href={template.path}>
                <Button variant="outline">View Parent Template</Button>
              </Link>
            )}
          </div>
          {preset.body.map((section) => (
            <section key={section.heading} className="mt-8">
              <h2 className="text-2xl font-semibold">{section.heading}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>
        <aside className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-5">
          <img src={preset.previewImage} alt="" className="w-full rounded bg-background" />
          <h2 className="mt-5 font-semibold">Good for</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {preset.useCases.map((item) => <li key={item}>{item}</li>)}
          </ul>
          <h2 className="mt-5 font-semibold">Print tips</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {preset.printTips.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </aside>
      </section>

      {relatedPresets.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Similar Presets</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {relatedPresets.map((entry) => entry && (
              <ContentCard key={entry.id} href={entry.path} title={entry.label} description={entry.summary} image={entry.previewImage} />
            ))}
          </div>
        </section>
      )}

      {relatedGuides.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Related Guides</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {relatedGuides.map((guide) => guide && (
              <ContentCard key={guide.id} href={guide.path} title={guide.h1} description={guide.summary} image={guide.previewImage} />
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
