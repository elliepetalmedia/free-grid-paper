import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { ContentCard } from '@/components/content/ContentCard';
import { EntryContent } from '@/components/content/EntryContent';
import { PageLayout } from '@/components/content/PageLayout';
import { categories, getGuideBySlug, getSitePageByPath, getTemplatesForCategory } from '@/content';
import { usePageMetadata } from '@/hooks/use-page-metadata';
import { Link } from 'wouter';

export default function TemplatesPage() {
  const page = getSitePageByPath('/templates')!;
  usePageMetadata(page);
  const featuredGuides = categories
    .flatMap((category) => category.relatedGuideIds)
    .filter((value, index, all) => all.indexOf(value) === index)
    .map(getGuideBySlug)
    .filter(Boolean)
    .slice(0, 6);

  return (
    <PageLayout>
      <Breadcrumbs items={[{ label: 'Templates', path: '/templates' }]} />
      <section className="max-w-3xl">
        <h1 className="text-4xl font-bold text-primary">{page.h1}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{page.summary}</p>
        <EntryContent
          answerSummary={page.answerSummary}
          bestFor={page.bestFor}
          body={page.body}
          referenceFacts={page.referenceFacts}
          relatedQuestions={page.relatedQuestions}
          updatedAt={page.updatedAt}
        />
      </section>

      <div className="mt-10 space-y-12">
        {categories.map((category) => {
          const categoryTemplates = getTemplatesForCategory(category.id);
          return (
            <section key={category.id}>
              <Link href={category.path} className="inline-block">
                <h2 className="text-2xl font-bold text-foreground hover:text-primary">{category.h1}</h2>
              </Link>
              <p className="mt-2 max-w-3xl text-muted-foreground">{category.summary}</p>
              {category.bestFor && category.bestFor.length > 0 && (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                  {category.bestFor.slice(0, 3).map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
              <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryTemplates.map((template) => (
                  <ContentCard
                    key={template.id}
                    href={template.path}
                    title={template.label}
                    description={template.summary}
                    image={template.previewImage}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {featuredGuides.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold">Popular questions and guides</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredGuides.map((guide) => guide && (
              <ContentCard key={guide.id} href={guide.path} title={guide.h1} description={guide.summary} image={guide.previewImage} />
            ))}
          </div>
        </section>
      )}
    </PageLayout>
  );
}
