const AI_REFERRER_MAP = [
  { match: 'chatgpt.com', source: 'chatgpt' },
  { match: 'openai.com', source: 'openai' },
  { match: 'perplexity.ai', source: 'perplexity' },
  { match: 'claude.ai', source: 'claude' },
  { match: 'anthropic.com', source: 'anthropic' },
  { match: 'gemini.google.com', source: 'gemini' },
  { match: 'copilot.microsoft.com', source: 'copilot' },
  { match: 'bing.com', source: 'bing' },
];

function getGtag() {
  if (typeof window === 'undefined') return null;
  return (window as Window & { gtag?: (...args: unknown[]) => void }).gtag ?? null;
}

export function detectAiReferrer() {
  if (typeof document === 'undefined' || !document.referrer) return null;

  try {
    const hostname = new URL(document.referrer).hostname.toLowerCase();
    return AI_REFERRER_MAP.find((entry) => hostname.includes(entry.match))?.source ?? null;
  } catch {
    return null;
  }
}

export const trackEvent = (eventName: string, eventParams?: Record<string, unknown>) => {
  const gtag = getGtag();
  if (!gtag) return;

  gtag('event', eventName, eventParams);
};

export const trackContentPageView = (params: {
  page_title: string;
  page_path: string;
  content_kind?: string;
  content_id?: string;
  category_id?: string;
}) => {
  const gtag = getGtag();
  if (!gtag) return;

  gtag('event', 'content_page_view', {
    ...params,
    ai_referrer: detectAiReferrer() ?? 'none',
  });
};
