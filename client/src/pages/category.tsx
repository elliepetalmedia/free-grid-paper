import { Link } from 'wouter';
import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { ContentCard } from '@/components/content/ContentCard';
import { EntryContent } from '@/components/content/EntryContent';
import { PageLayout } from '@/components/content/PageLayout';
import { categories, getCategoryBySlug, getGuideBySlug, getTemplatesForCategory } from '@/content';
import { usePageMetadata } from '@/hooks/use-page-metadata';
import NotFound from './not-found';

interface CategoryPageProps {
  params: { slug: string };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.slug);
  if (!category) return <NotFound />;

  usePageMetadata(category);
  const categoryTemplates = getTemplatesForCategory(category.id);
  const relatedGuides = category.relatedGuideIds.map(getGuideBySlug).filter(Boolean);

  return (
    <PageLayout>
      <Breadcrumbs items={[{ label: 'Templates', path: '/templates' }, { label: category.h1, path: category.path }]} />
      <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-4xl font-bold text-primary">{category.h1}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{category.summary}</p>
          <EntryContent
            answerSummary={category.answerSummary}
            bestFor={category.bestFor}
            body={category.body}
            referenceFacts={category.referenceFacts}
            relatedQuestions={category.relatedQuestions}
            updatedAt={category.updatedAt}
          />
        </div>
        <aside className="rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-5">
          <h2 className="font-semibold text-foreground">Related Categories</h2>
          <div className="mt-3 space-y-2">
            {category.relatedCategoryIds.map((id) => {
              const related = categories.find((entry) => entry.id === id);
              return related ? (
                <Link key={related.id} href={related.path} className="block text-primary hover:underline">
                  {related.h1}
                </Link>
              ) : null;
            })}
          </div>
        </aside>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Templates</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categoryTemplates.map((template) => (
            <ContentCard key={template.id} href={template.path} title={template.label} description={template.summary} image={template.previewImage} />
          ))}
        </div>
      </section>

      {relatedGuides.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-bold">Helpful Guides</h2>
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
