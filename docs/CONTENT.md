# Adding content

Two collections, both schema-validated at build time by `src/content.config.ts`.

- **`src/content/guides/<tool>/<chapter>.mdx`** → `/guides/<tool>/<chapter>`
- **`src/content/articles/<slug>.md`** → `/articles/<slug>`

Run `npm run check` after adding a file. A missing or malformed field fails the build with the
exact path and reason — that is deliberate, and it is why every published page has complete
metadata.

Copy-paste starting points live in [`templates/`](templates).

---

## Adding a chapter to an existing guide

Drop a `.mdx` file into the tool's folder. The filename is the URL slug; `order` decides where it
appears in the sidebar and the pager.

```
src/content/guides/docker/
├── introduction.mdx       order: 1
├── installation.mdx       order: 2
├── core-concepts.mdx      order: 3
├── first-project.mdx      order: 4
├── everyday-workflow.mdx  order: 5
├── common-mistakes.mdx    order: 6
└── troubleshooting.mdx    order: 7
```

### Chapter frontmatter

| Field | Type | Required | Notes |
| ----- | ---- | -------- | ----- |
| `title` | string ≤120 | yes | The `<h1>` and the sidebar entry |
| `description` | string 50–300 | yes | Meta description, card copy, and the HowTo step text |
| `order` | positive integer | yes | Position in the curriculum. Must be unique within the tool. |
| `pubDate` | date | yes | `YYYY-MM-DD` |
| `updatedDate` | date | no | Shown in the byline instead of `pubDate` |
| `author` | string | no | Defaults to "The DevToolSDK Team" |
| `tags` | string[] | no | Emitted as `keywords` |
| `howto` | boolean | no | Marks the chapter as step-by-step instructions |
| `draft` | boolean | no | Visible in `dev`, excluded from the build |

---

## Adding a whole new tool

Two steps.

**1. Register the tool** in `src/data/tools.ts`. The `slug` must match the folder name.

```ts
{
  slug: 'ansible',
  name: 'Ansible',
  category: 'Configuration Management',
  tagline: 'One line on what it does, in plain words',
  description: 'Two sentences for the card and the overview page.',
  version: '10.x',                 // the version the guide was verified against
  difficulty: 'Intermediate',      // Beginner | Intermediate | Advanced
  duration: 120,                   // minutes for the whole guide
  officialUrl: 'https://www.ansible.com',
  docsUrl: 'https://docs.ansible.com',
}
```

**2. Create `src/content/guides/ansible/` and add chapters.** The tool appears on `/guides` as
soon as it has at least one published chapter, and `/guides/ansible` is generated automatically
with the curriculum, the HowTo structured data and the sidebar.

Nothing else needs touching — no route, no nav entry, no index.

---

## The seven-chapter structure

Every guide follows the same order. The consistency is the point: once a reader has read one
guide they know where to find things in all of them.

1. **Introduction** — the problem the tool solves. No installation, no commands.
2. **Installation** — every platform, plus the commands that verify it worked.
3. **Core concepts** — the three to five primitives everything else derives from.
4. **First project** — a complete worked example, explained line by line.
5. **Everyday workflow** — the commands that make up 90% of real use.
6. **Common mistakes** — what everyone gets wrong and why the tool allows it.
7. **Troubleshooting** — a diagnostic path, and what the error messages really mean.

Chapters 3 and 6 are what distinguish these guides from the official documentation. If one of
them is thin, the guide is not finished.

---

## Writing the body

- Start headings at `##`. The `<h1>` comes from `title`.
- Only `##` and `###` appear in the table of contents, which shows once there are more than two.
- Tag every code block with a language. Shiki highlights for both themes automatically.
- **Every command must have been run before publishing.** This is the site's one hard rule.
- Tables become horizontally scrollable on mobile with no extra markup.
- Link between guides — `[Docker guide](/guides/docker)` — the cross-links are load-bearing for
  both readers and SEO.

### Callouts

```mdx
import Callout from '@/components/Callout.astro';

<Callout type="note">Default label is "Note".</Callout>
<Callout type="tip">"Tip"</Callout>
<Callout type="warning">"Watch out"</Callout>
<Callout type="danger">"This will break things"</Callout>
<Callout type="warning" title="Custom label">Overrides the default.</Callout>
```

Use `danger` only for data loss or security holes. If everything is a danger, nothing is.

The import line is required in each `.mdx` file that uses a callout — that is how MDX works.

---

## Articles

Blog posts, in `src/content/articles/`. Plain `.md` is fine; use `.mdx` if you want callouts.

```yaml
---
title: 'How to learn a new developer tool in a weekend'
description: >-
  50 to 300 characters. The search snippet and the card copy.
pubDate: 2026-09-18
author: The DevToolSDK Team
category: Learning
tags: [learning, method]
featured: false
draft: false
---
```

`featured: true` surfaces it on the home page.

---

## Drafts

Set `draft: true`. The entry renders in `npm run dev` so you can preview it, and is excluded from
`npm run build`, the sitemap and the RSS feed.
