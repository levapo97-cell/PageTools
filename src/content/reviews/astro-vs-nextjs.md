---
title: 'Astro vs Next.js: which one should render your content site?'
description: >-
  Next.js can build a content site and Astro can build an app, but each is clearly better at one
  of them. We rebuilt the same 200-page publication on both and measured what shipped to the
  browser.
pubDate: 2026-05-07
updatedDate: 2026-09-12
author: The DevToolSDK Team
category: Web Frameworks
tags: [astro, nextjs, static-site, performance, islands]
rating: 4.5
verdict: 'Astro for content-first sites; Next.js once the interactive surface dominates'
summary: >-
  Astro shipped 11 KB of JavaScript to our article pages. Next.js shipped 94 KB for the same
  content. That gap decides content sites. Once a majority of your pages are stateful and
  interactive, Next.js is the better tool and the gap closes.
featured: true
tools:
  - name: Astro
    vendor: The Astro Technology Company
    url: https://astro.build
    rating: 4.7
    pricing: 'Free and open source (MIT)'
    bestFor: 'Blogs, documentation, marketing sites and publications — anything content-first'
    pros:
      - Zero JavaScript by default; islands ship only what you explicitly hydrate
      - Bring any UI framework — React, Vue, Svelte, Solid — in the same project
      - Content collections give Markdown type-safe frontmatter and a real query API
      - Build output is plain static files that any host can serve
    cons:
      - Not the right tool for a heavily stateful application
      - Cross-island shared state needs deliberate design (nanostores or similar)
      - Smaller ecosystem of integrations than Next.js
      - SSR mode is capable but less mature than its static story
  - name: Next.js
    vendor: Vercel
    url: https://nextjs.org
    rating: 4.5
    pricing: 'Free and open source (MIT); hosting billed separately'
    bestFor: 'Applications where most routes are interactive, authenticated or personalised'
    pros:
      - Full-stack — API routes, server actions, middleware and auth in one project
      - ISR and partial prerendering handle mixed static/dynamic content well
      - React Server Components reduce the bundle substantially for an app framework
      - The largest ecosystem, hiring pool and template library in this category
    cons:
      - Ships a React runtime to every page, however static the page is
      - The App Router mental model is a real onboarding cost
      - Build times climb quickly at high route counts
      - Best experience is on Vercel; self-hosting ISR properly is more work
comparison:
  - feature: JS shipped to an article page
    a: '11 KB gzipped'
    b: '94 KB gzipped'
    winner: a
  - feature: Lighthouse performance (article page)
    a: '100'
    b: '94'
    winner: a
  - feature: Build time, 200 pages
    a: '14 s'
    b: '48 s'
    winner: a
  - feature: Interactive/stateful app routes
    a: 'Islands — deliberate, limited'
    b: 'Native, full-stack'
    winner: b
  - feature: API routes & server actions
    a: 'Endpoints only'
    b: 'Full server action model'
    winner: b
  - feature: Use several UI frameworks at once
    a: 'Yes, by design'
    b: 'React only'
    winner: a
  - feature: Content collections / typed Markdown
    a: 'First-class, schema-validated'
    b: 'Bring your own (Contentlayer, MDX plumbing)'
    winner: a
  - feature: Ecosystem size
    a: 'Growing'
    b: 'Largest'
    winner: b
---

## The rebuild

A 200-page publication: article pages, category listings, an author archive, search, a newsletter
form and a comments widget. Same content, same design, built on both.

## What shipped to the browser

The article page — the page that matters, because it is where the readers are:

| | Astro | Next.js |
|---|---|---|
| JS shipped, gzipped | 11 KB | 94 KB |
| HTML, gzipped | 9 KB | 12 KB |
| Lighthouse performance | 100 | 94 |
| LCP (throttled 4G) | 0.9 s | 1.3 s |
| Build time, 200 pages | 14 s | 48 s |

The 11 KB on the Astro page is the newsletter form and the theme toggle — the two things on that
page that genuinely need JavaScript. Everything else is HTML.

The 94 KB on the Next.js page is React, the router, and the framework runtime, plus the same two
interactive components. React Server Components did real work here — the same page in the Pages
Router was 140 KB — but the framework floor is still a framework floor.

## Islands, explained by the result

Astro's architecture is the whole story. A page is HTML by default. If a component needs to be
interactive, you mark it: `<Newsletter client:visible />`. Only that component's JavaScript ships,
and only when it scrolls into view.

The practical consequence on this rebuild: our comments widget, which is a heavy third-party
React component, loaded on `client:visible`. Readers who never scrolled past the article never
downloaded it. On Next.js, achieving the same thing meant `next/dynamic` with a manual
intersection observer — possible, but something you have to remember to do, on every component,
forever.

The default is the feature. Astro's default is fast; Next.js's default is capable.

## Where Next.js wins, and it is not close

The moment a route needs a session, a form that mutates server state, personalisation, or a
dashboard with live data, Next.js is simply the right tool. Server actions, middleware, route
handlers and the full-stack story are designed for exactly that, and Astro's answer — endpoints
plus islands plus a state library — is more assembly for less capability.

We tried building the publication's authenticated admin area in Astro. It worked. It was more
code than the Next.js equivalent and less pleasant, and we moved it.

Ecosystem matters too. Whatever you need — an auth library, a CMS integration, an analytics
wrapper — the Next.js version exists and is maintained. Astro's ecosystem is healthy and growing
and still a fraction of the size.

## The hybrid nobody mentions

You can run both. Astro for the marketing site and the blog at the apex domain; Next.js for the
application at `app.yourdomain.com`. We see this shape increasingly often and it is a good answer
— each framework doing the thing it is best at, with a DNS record between them.

The cost is two codebases and a shared design system to keep in sync. For a team of five that is
probably not worth it. For a company with a marketing team and a product team, it usually is.

## How to choose

Pick **Astro** if most of your pages are content — a blog, docs, a marketing site, a
publication, an e-commerce catalogue. The performance difference is large, it is the default
rather than something you maintain, and content collections make Markdown genuinely pleasant.

Pick **Next.js** if most of your pages are application — authenticated, stateful, personalised,
interactive. Trying to build that in Astro is fighting the framework.

If you are somewhere in the middle, ask which kind of page a new hire will spend their first
month building. Build for that one.
