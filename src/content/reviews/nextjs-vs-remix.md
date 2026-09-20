---
title: 'Next.js vs Remix: two takes on the full-stack React framework'
description: >-
  One bets on the server component, the other on the web platform. We shipped the same commerce
  storefront on both and measured Core Web Vitals, deploy portability and how each one behaves
  when JavaScript fails to load.
pubDate: 2026-06-18
author: The PageTools Team
category: Web Frameworks
tags: [nextjs, remix, react-router, react, ssr]
rating: 4.3
verdict: 'Next.js for ecosystem and rendering flexibility; Remix for web-standards purity and portability'
summary: >-
  Next.js has more ways to render a page and a much larger ecosystem, at the cost of a bigger
  mental model. Remix is smaller, more predictable, degrades gracefully without JavaScript, and
  runs anywhere. Both produced excellent Core Web Vitals.
tools:
  - name: Next.js
    vendor: Vercel
    url: https://nextjs.org
    rating: 4.5
    pricing: 'Free and open source (MIT); hosting billed separately'
    bestFor: 'Content-heavy and hybrid apps that want ISR, RSC and the largest React ecosystem'
    pros:
      - React Server Components cut our client bundle by roughly a third
      - ISR and partial prerendering cover the whole static-to-dynamic spectrum
      - By far the most tutorials, templates, starters and hireable experience
      - Built-in image, font and script optimisation are genuinely good
    cons:
      - The App Router mental model — server vs client, caching layers — takes weeks to internalise
      - Caching defaults have changed across releases and caught teams out
      - Best-in-class experience is on Vercel; elsewhere needs an adapter
      - Build times grow quickly on large route counts
  - name: Remix
    vendor: Shopify (merged into React Router v7)
    url: https://remix.run
    rating: 4.1
    pricing: 'Free and open source (MIT)'
    bestFor: 'Form-heavy applications that value progressive enhancement and runtime portability'
    pros:
      - Loaders and actions map onto HTTP in a way you can reason about completely
      - Forms work without JavaScript — real progressive enhancement, not a claim
      - Nested routes with per-route error boundaries are the best data story in React
      - Runs on any runtime with a fetch handler — Node, Deno, Workers, Bun
    cons:
      - No built-in static generation or ISR equivalent; you reach for a CDN
      - Ecosystem is much smaller; fewer starters, fewer answers
      - The merge into React Router v7 confused the naming and the docs for a while
      - Fewer engineers have production experience with it
comparison:
  - feature: Rendering modes
    a: 'Static, ISR, SSR, RSC, partial prerendering'
    b: 'SSR (plus CDN caching you configure)'
    winner: a
  - feature: Client bundle (same storefront)
    a: '94 KB gzipped'
    b: '121 KB gzipped'
    winner: a
  - feature: Works with JavaScript disabled
    a: 'Partially — forms need client JS'
    b: 'Fully — forms post natively'
    winner: b
  - feature: Mental model complexity
    a: 'High — server/client boundary plus caching layers'
    b: 'Low — loader, action, component'
    winner: b
  - feature: Runtime portability
    a: 'Best on Vercel; adapters elsewhere'
    b: 'Any fetch-compatible runtime'
    winner: b
  - feature: Ecosystem & starters
    a: 'Enormous'
    b: 'Modest'
    winner: a
  - feature: Nested routing & error isolation
    a: 'Good'
    b: 'Best in class'
    winner: b
  - feature: Hiring pool
    a: 'Large'
    b: 'Small'
    winner: a
---

## The storefront

A commerce storefront: 2,000 product pages, faceted search, cart, checkout, account area and a
CMS-driven marketing section. Same designs, same headless commerce API, same team, built twice.

## Core Web Vitals

Measured on a throttled 4G profile, median of 50 runs, on the product detail page:

| | Next.js | Remix |
|---|---|---|
| LCP | 1.24 s | 1.38 s |
| INP | 62 ms | 58 ms |
| CLS | 0.01 | 0.01 |
| Client JS (gzipped) | 94 KB | 121 KB |

Both are comfortably in the green. Next.js's edge on LCP comes from ISR — product pages were
prerendered and served from cache. Remix fetched them per request, and we recovered most of the
difference with a CDN cache header, at the cost of configuring that ourselves.

The bundle difference is React Server Components doing what they promise. A third of our
product-page components never shipped to the browser at all.

## The philosophical split

Remix's position is that the web platform already solved most of this. A form posts. A link
navigates. The server returns HTML. Its job is to get out of the way and make those primitives
composable.

The consequence is a framework you can hold in your head. A route has a `loader` (GET), an
`action` (POST) and a component. That is nearly the whole API. Our checkout flow — the most
complex part of the build — was materially simpler in Remix, and it worked with JavaScript
disabled, which we tested and which genuinely surprised the QA engineer.

Next.js's position is that the server should render as much as possible, and the framework should
give you every rendering strategy so you can pick per route. That is more powerful and it is more
to learn. The server/client component boundary, plus the request/router/full-route caching
layers, took our team about three weeks to stop getting wrong.

## Portability

Remix runs on anything with a fetch handler. We deployed the same build to Node, Cloudflare
Workers and Deno Deploy in an afternoon, unchanged.

Next.js runs best on Vercel. That is not a criticism — Vercel builds the framework and it shows —
but self-hosting Next.js with ISR and image optimisation working properly is meaningfully more
work than `next build && next start` suggests, and the OpenNext adapters exist because of it.

If "we must be able to leave our host in a week" is a real constraint, that is a Remix argument.

## The naming situation

Remix merged into React Router v7. New projects start with React Router in framework mode; the
Remix APIs are largely the same. It is the right technical outcome and it cost the project a year
of confused documentation and blog posts. Budget an hour to work out which docs apply to you.

## How to choose

Pick **Next.js** if you have content that benefits from static generation or ISR, if you want the
largest ecosystem and hiring pool, if you are deploying to Vercel, or if RSC's bundle savings
matter for your page weight.

Pick **Remix / React Router** if your app is form and mutation heavy, if progressive enhancement
is a real requirement rather than a nice-to-have, if you need to run on arbitrary runtimes, or if
you want a framework a new hire can fully understand in a week.

For this storefront, we shipped the Next.js version — ISR on 2,000 product pages was decisive.
For the form-heavy admin panel that came after it, we used Remix, and did not regret either call.
