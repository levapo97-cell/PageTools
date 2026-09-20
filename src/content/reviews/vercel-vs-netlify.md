---
title: 'Vercel vs Netlify: we deployed the same app to both for 90 days'
description: >-
  Same Next.js app, same traffic, two platforms, one quarter. We tracked cold starts, edge
  latency from five regions, build times and the bill — including the parts of the bill that
  do not appear until month two.
pubDate: 2026-08-28
author: The PageTools Team
category: Hosting & Deployment
tags: [vercel, netlify, hosting, jamstack, edge]
rating: 4.5
verdict: 'Vercel if you write Next.js; Netlify if you want framework neutrality and calmer pricing'
summary: >-
  Vercel is the better Next.js host by a distance nobody else is closing — it ships the framework.
  Netlify is the better general-purpose platform: more predictable bills, a stronger free tier for
  serious projects, and no incentive to steer your architecture.
featured: true
tools:
  - name: Vercel
    vendor: Vercel Inc.
    url: https://vercel.com
    rating: 4.6
    pricing: 'Hobby free; Pro $20/user/mo + usage; bandwidth $0.15/GB after 1 TB'
    bestFor: 'Next.js apps, and teams who want zero-config ISR, image optimisation and edge middleware'
    pros:
      - Next.js features land on Vercel first and work without configuration
      - Preview deployments with comment threads are the best review workflow in the category
      - Edge network latency was the lowest in four of our five test regions
      - Analytics and Speed Insights need one line to enable
    cons:
      - Usage-based pricing can surprise you — image optimisation and function duration add up
      - Strongly opinionated toward Next.js; other frameworks are supported, not privileged
      - No built-in form handling or identity; you bring your own
      - Commercial use on the free tier is not permitted
  - name: Netlify
    vendor: Netlify Inc.
    url: https://www.netlify.com
    rating: 4.3
    pricing: 'Free tier 100 GB bandwidth + 300 build min; Pro $19/user/mo; bandwidth $55/100 GB'
    bestFor: 'Static and hybrid sites across any framework, and teams who want predictable billing'
    pros:
      - Genuinely framework-neutral — Astro, Nuxt, SvelteKit and Hugo are first-class
      - Built-in forms, identity, split testing and redirects with no extra services
      - Deploy previews and instant rollbacks are as good as Vercel's
      - Pricing is easier to forecast; fewer metered dimensions
    cons:
      - Next.js support trails Vercel on new features by a release or two
      - Build minutes on the free tier run out quickly on a real project
      - Edge function cold starts were consistently slower in our tests
      - The dashboard has accumulated a decade of products and shows it
comparison:
  - feature: Next.js feature parity
    a: 'Day-one, by definition'
    b: 'A release or two behind'
    winner: a
  - feature: Framework neutrality
    a: 'Supported, not privileged'
    b: 'First-class across the board'
    winner: b
  - feature: Edge latency (median, 5 regions)
    a: '38 ms'
    b: '52 ms'
    winner: a
  - feature: Cold start (edge function)
    a: '~22 ms'
    b: '~48 ms'
    winner: a
  - feature: Built-in forms & identity
    a: 'None — bring your own'
    b: 'Included'
    winner: b
  - feature: Billing predictability
    a: 'Many metered dimensions'
    b: 'Fewer, flatter'
    winner: b
  - feature: Free tier for commercial use
    a: 'Not permitted'
    b: 'Permitted'
    winner: b
  - feature: Preview deployment workflow
    a: 'Comments, visual diffs, Slack integration'
    b: 'Comments and deploy previews'
    winner: a
---

## What we ran

A production Next.js 15 app: ~120 routes, ISR on the content pages, a handful of route handlers,
image optimisation on user-uploaded avatars, and roughly 400k requests a month. Deployed
identically to both platforms behind separate domains, with traffic mirrored for 90 days.

## Latency and cold starts

Median TTFB from five regions (Virginia, Frankfurt, São Paulo, Singapore, Sydney):

- **Vercel**: 38 ms median, 91 ms p95
- **Netlify**: 52 ms median, 134 ms p95

Vercel won four of five regions; Netlify was ahead in São Paulo. Edge function cold starts were
the wider gap — 22 ms versus 48 ms — which matters if middleware sits in front of every request.

For a content site, neither number is perceptible. For an app where middleware does auth on every
navigation, Vercel's lead is worth something.

## The bill

This is where it got interesting. At identical traffic:

- **Vercel Pro**, 3 seats: $60 base. Bandwidth within the 1 TB allowance. Image optimisation:
  $24. Function duration: $31. **Total ≈ $115/month.**
- **Netlify Pro**, 3 seats: $57 base. Bandwidth within allowance. Build minutes: $0.
  **Total ≈ $57/month.**

The gap is almost entirely image optimisation and function duration — two dimensions Vercel
meters and Netlify largely does not at this scale. Neither bill is unreasonable; Vercel's is
harder to predict before you incur it.

Worth saying plainly: the horror stories about five-figure Vercel bills come from unbounded image
optimisation on user-generated content, and Vercel has since added spend controls. Set them.

## Developer experience

Both platforms do preview-deploy-per-PR properly, and both roll back instantly. Vercel's preview
comments — click an element, leave a note, it threads back to the PR — are the single best review
workflow we have used, and the designers on the team noticed within a week.

Netlify's advantage is that it does not care what you build with. Our Astro marketing site and the
Next.js app deployed with equal enthusiasm. On Vercel, the Astro site worked fine but nothing
about the platform was designed for it.

Netlify's built-in forms saved us a Formspree subscription. Small, but it is the kind of thing
that adds up.

## How to choose

Write Next.js and care about being on the newest features? **Vercel.** You are using the
framework the platform was built to run, and every other host is reverse-engineering it.

Anything else — Astro, Nuxt, SvelteKit, Hugo, a static export — or a team that wants a bill it
can forecast a quarter out? **Netlify.**

If you are somewhere in between: deploy to both. It costs an afternoon, both have real free
tiers, and 90 days of your own traffic will tell you more than this review.
