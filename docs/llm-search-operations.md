# LLM Search Operations

This document covers the off-site and measurement work needed to support the in-repo crawl and content changes.

## Indexing

1. Verify `https://freegridpaper.com/sitemap.xml` in Google Search Console.
2. Verify the same sitemap index in Bing Webmaster Tools.
3. Track coverage for:
   - `/templates`
   - `/category/*`
   - `/preset/*`
   - `/guides/*`
4. Treat query-string generator URLs as non-canonical. If they appear in reports, inspect internal links and canonical tags before requesting reindexing.

## AI Search Query Set

Check these prompts manually on a recurring basis:

- `best dot grid spacing for bullet journal`
- `5 mm vs quarter inch graph paper`
- `college ruled vs wide ruled`
- `what hex size for dnd map`
- `printable storyboard sheets`
- `printable knitting chart paper`

Track whether FreeGridPaper is cited in:

- Google web results
- Bing web results
- AI overviews or answer modules when present
- ChatGPT web-grounded answers
- Perplexity answers
- Claude web-grounded answers
- Gemini answers
- Copilot answers

## Referrals And Analytics

`client/src/lib/analytics.ts` emits `content_page_view` with:

- `content_kind`
- `content_id`
- `category_id`
- `ai_referrer`

Review high-impression pages separately from low-indexation pages:

- High impressions + weak clicks usually means weak titles, descriptions, or answer framing.
- Low indexation usually means a crawl, canonical, linking, or content-thinness problem.

## Citation Targets

Prioritize relevant citations and mentions over generic link building:

- teacher and classroom printable directories
- music education resource lists
- tabletop gaming and map-planning references
- bullet journal and planner communities
- handwriting and calligraphy resource pages
- craft and knitting reference lists
