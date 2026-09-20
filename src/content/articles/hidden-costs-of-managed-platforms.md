---
title: 'The hidden costs of managed platforms: what the pricing page leaves out'
description: >-
  Every managed platform quotes a headline price that is accurate and incomplete. We went through
  a year of real invoices across six vendors and catalogued the line items that show up after
  you have already migrated.
pubDate: 2026-08-20
author: The PageTools Team
category: Cost Engineering
tags: [pricing, cloud-costs, finops, platforms]
featured: true
---

The pricing page says $20 per user per month. The invoice in month four says $890. Nobody lied to
you — the gap lives in the dimensions the pricing page does not lead with, and they are broadly
the same six dimensions at every vendor.

We went through a year of invoices across six managed platforms. Here is what to check before you
migrate, not after.

## 1. Egress

The single most common surprise. Bandwidth out of the platform is metered, the allowance sounds
generous, and then someone puts a video on the marketing site or a customer starts polling your
API every second.

Check: what is the included allowance, what is the per-GB rate above it, and does traffic to your
own CDN count as egress? That last question has a surprising answer more often than it should.

## 2. Build minutes and compute time

CI minutes, build minutes, function execution duration, container seconds. These are cheap per
unit and unbounded by default, which is a combination that generates invoices.

The pattern to watch for: a platform that bills function *duration* rather than invocations. A
route handler that waits 400ms on a slow upstream costs four times one that waits 100ms, for
identical work. Optimising a slow dependency becomes a billing decision.

## 3. Image and asset transformation

On-the-fly image optimisation is billed per source image, per transformation, or per GB
processed, depending on the vendor. If your images are user-generated and unbounded, so is this
line item. This is the source of most of the viral "my hosting bill was $5,000" stories.

Check whether there is a spend cap. Set it.

## 4. Seats you did not think were seats

Read-only users. Contractors. Your designer who logs in twice a month. The CI service account.
Several platforms bill all of these as full seats, and a 30-person engineering team turns out to
have 47 billable identities.

## 5. The support plan

The free tier's support is a community forum. The moment you have production traffic, someone
will ask what happens when it breaks at 2am, and the answer is a support plan priced as a
percentage of spend — commonly 3–10%, sometimes with a floor of several hundred dollars a month.

Budget it from day one. You will buy it eventually.

## 6. The engineer-hours

The line item that never appears on any invoice and usually dominates the others. A managed
platform that needs one engineer at 20% time to operate costs you roughly $30,000 a year before
you pay the vendor anything.

This cuts both ways, and it is the strongest argument *for* managed platforms: the self-hosted
alternative that costs $200/month in compute may cost $80,000/year in attention.

## How to price a migration properly

Take last month's real usage — not your estimate, the actual numbers from your current platform —
and run it through the candidate's pricing calculator. Then:

- Add 40% for growth over the contract period.
- Add the support plan.
- Add every non-engineer who will need a login.
- Add an engineer-hours estimate, honestly, with the person who will do the work in the room.

If the result still wins, migrate. If it only wins on the headline number, you have found the
gap this article is about.

## The ask

Vendors: put egress, function duration and image transformation rates on the pricing page, above
the fold, with a calculator. The teams who would be annoyed by that clarity are not the ones you
want signing annual contracts anyway.
