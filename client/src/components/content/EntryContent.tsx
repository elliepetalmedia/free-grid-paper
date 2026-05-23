import type { ContentSection, FaqEntry, ReferenceFact } from '@/content';

interface EntryContentProps {
  answerSummary?: string;
  bestFor?: string[];
  body: ContentSection[];
  referenceFacts?: ReferenceFact[];
  relatedQuestions?: FaqEntry[];
  updatedAt?: string;
}

function formatUpdatedAt(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function EntryContent({
  answerSummary,
  bestFor,
  body,
  referenceFacts,
  relatedQuestions,
  updatedAt,
}: EntryContentProps) {
  const formattedUpdatedAt = formatUpdatedAt(updatedAt);

  return (
    <>
      {answerSummary && (
        <section className="mt-6 rounded-lg border border-sidebar-border bg-sidebar-accent/40 p-5">
          <h2 className="text-lg font-semibold text-foreground">Quick answer</h2>
          <p className="mt-2 leading-7 text-muted-foreground">{answerSummary}</p>
        </section>
      )}

      {referenceFacts && referenceFacts.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Reference facts</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {referenceFacts.map((fact) => (
              <div key={`${fact.label}-${fact.value}`} className="rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-4">
                <dt className="text-sm font-medium text-muted-foreground">{fact.label}</dt>
                <dd className="mt-1 text-base font-semibold text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {bestFor && bestFor.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Best for</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
            {bestFor.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
      )}

      {body.map((section) => (
        <section key={section.heading} className="mt-8">
          <h2 className="text-2xl font-semibold">{section.heading}</h2>
          <p className="mt-3 leading-7 text-muted-foreground">{section.body}</p>
          {section.items && section.items.length > 0 && (
            <ul className="mt-3 list-disc space-y-2 pl-5 text-muted-foreground">
              {section.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
        </section>
      ))}

      {relatedQuestions && relatedQuestions.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl font-semibold">Related questions</h2>
          <div className="mt-4 space-y-4">
            {relatedQuestions.map((item) => (
              <article key={item.question} className="rounded-lg border border-sidebar-border bg-background/60 p-5">
                <h3 className="text-lg font-semibold text-foreground">{item.question}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{item.answer}</p>
                {item.href && (
                  <a href={item.href} className="mt-3 inline-block text-sm font-medium text-primary hover:underline">
                    Open related page
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {formattedUpdatedAt && (
        <p className="mt-8 text-sm text-muted-foreground">
          Updated {formattedUpdatedAt}
        </p>
      )}
    </>
  );
}
