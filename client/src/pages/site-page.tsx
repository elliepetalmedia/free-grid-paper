import { Breadcrumbs } from '@/components/content/Breadcrumbs';
import { EntryContent } from '@/components/content/EntryContent';
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
      <Breadcrumbs items={[{ label: 'Templates', path: '/templates' }, { label: page.h1, path: page.path }]} />
      <article className="max-w-3xl">
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
      </article>
    </PageLayout>
  );
}
