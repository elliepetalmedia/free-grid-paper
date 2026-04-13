import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { PageLayout } from '@/components/content/PageLayout';
import { getSitePageByPath } from '@/content';
import { usePageMetadata } from '@/hooks/use-page-metadata';
import NotFound from './not-found';

interface SitePageProps {
  path: string;
}

export default function SitePage({ path }: SitePageProps) {
  const page = getSitePageByPath(path);
  if (!page) return <NotFound />;

  usePageMetadata(page);

  return (
    <PageLayout>
      <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: page.h1, path: page.path }]} />
      <article className="max-w-3xl">
        <h1 className="text-4xl font-bold text-primary">{page.h1}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{page.summary}</p>
        {page.body.map((section) => (
          <section key={section.heading} className="mt-8">
            <h2 className="text-2xl font-semibold">{section.heading}</h2>
            <p className="mt-3 leading-7 text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </article>
    </PageLayout>
  );
}
