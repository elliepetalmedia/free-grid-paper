import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { ContentCard } from '@/components/content/ContentCard';
import { PageLayout } from '@/components/content/PageLayout';
import { categories, getSitePageByPath, getTemplatesForCategory } from '@/content';
import { usePageMetadata } from '@/hooks/use-page-metadata';
import { Link } from 'wouter';

export default function TemplatesPage() {
  const page = getSitePageByPath('/templates')!;
  usePageMetadata(page);

  return (
    <PageLayout>
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Templates', path: '/templates' }]} />
      <section className="max-w-3xl">
        <h1 className="text-4xl font-bold text-primary">{page.h1}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{page.summary}</p>
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
    </PageLayout>
  );
}
