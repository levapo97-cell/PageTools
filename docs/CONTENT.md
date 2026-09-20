# Adding content

Two collections, both plain Markdown with YAML frontmatter, both schema-validated at build time
by `src/content.config.ts`. The filename becomes the URL slug.

- `src/content/reviews/` → `/reviews/<filename>` — head-to-head comparisons, with ratings, a
  comparison table and `Review` structured data.
- `src/content/articles/` → `/articles/<filename>` — blog posts, guides, field notes.

Run `npm run check` after adding a file. A missing or malformed field fails the build with the
exact path and reason — that is deliberate, and it is why every published page has complete
metadata.

Copy-paste starting points live in [`templates/`](templates).

---

## Review frontmatter

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `title` | string ≤120 | yes | Used as `<h1>` and in `<title>` |
| `description` | string 50–300 | yes | Meta description and card copy. Write it for a search result. |
| `pubDate` | date | yes | `YYYY-MM-DD` |
| `updatedDate` | date | no | Shown in the byline, feeds `dateModified` |
| `author` | string | no | Defaults to "The DevToolSDK Team" |
| `category` | string | yes | Groups the listing page. Reuse an existing one where it fits. |
| `tags` | string[] | no | Rendered as chips, emitted as `keywords` |
| `rating` | number 0–5 | yes | Overall score, one decimal |
| `verdict` | string | yes | One line: who wins, and when |
| `summary` | string | yes | Two or three sentences under the verdict |
| `tools` | Tool[] (1–2) | yes | See below |
| `comparison` | Row[] | no | Feature-by-feature table |
| `image` / `imageAlt` | image / string | no | Omit and a gradient card is generated |
| `featured` | boolean | no | Surfaces on the home page |
| `draft` | boolean | no | Visible in `dev`, excluded from the build |

### `tools[]`

```yaml
tools:
  - name: Terraform
    vendor: HashiCorp / IBM          # optional
    url: https://www.terraform.io    # optional, must be a valid URL
    rating: 4.6                      # 0–5
    pricing: 'Open source CLI free; HCP from $0.00014/resource-hour'
    bestFor: 'Teams running more than one cloud'
    pros: ['At least one', 'Usually three or four']
    cons: ['At least one', 'Be honest here — it is the whole point']
```

Each tool becomes a `Review` node in the page's Schema.org graph, and renders as a pros/cons card.

### `comparison[]`

```yaml
comparison:
  - feature: Multi-cloud support
    a: 'Native — one workflow across 4,000+ providers'
    b: 'AWS only'
    winner: a        # a | b | tie  (default: tie)
```

`a` is `tools[0]`, `b` is `tools[1]`. The winning cell is highlighted with a check mark.

---

## Article frontmatter

Same fields minus `rating`, `verdict`, `summary`, `tools` and `comparison`:

```yaml
---
title: 'How we test SaaS tools'
description: >-
  50 to 300 characters. This is what shows up in Google and on the card.
pubDate: 2026-09-10
author: The DevToolSDK Team
category: Methodology
tags: [methodology, transparency]
featured: false
draft: false
---
```

---

## Writing the body

- Start at `##`. The `<h1>` comes from `title`; a second one hurts SEO.
- Use `##` and `###` only — the table of contents ignores deeper levels, and it only appears when
  there are more than two headings.
- Code blocks get dual-theme Shiki highlighting automatically. Tag the language.
- Markdown tables become horizontally scrollable on mobile without any extra markup.
- Keep paragraphs short. The measure is ~46rem and long paragraphs read as walls on a phone.

## Drafts

Set `draft: true`. The entry renders in `npm run dev` so you can preview it, and is excluded from
`npm run build`, the sitemap and the RSS feed.
