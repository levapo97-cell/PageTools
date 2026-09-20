---
title: 'How we test SaaS tools: the DevToolSDK methodology, in full'
description: >-
  Every score on this site comes from the same five-criterion rubric applied over at least four
  weeks of real use. Here is the rubric, the weights, the process, and the things we deliberately
  refuse to do.
pubDate: 2026-09-10
author: The DevToolSDK Team
category: Methodology
tags: [methodology, reviews, transparency]
featured: true
---

Most tool comparisons on the web are rewritten pricing pages. Someone reads two marketing sites,
builds a feature table, and publishes it. The table is accurate and completely useless, because
every feature is listed and none of them is weighted by how much it matters at month three.

We do it differently, and because we want you to be able to check our work, here is exactly how.

## The rubric

Every tool gets scored on five criteria with fixed weights. The weights do not change between
reviews, which is what makes two DevToolSDK scores comparable.

**Developer experience — 30%.** Time from zero to a working deployment. Quality of the error
messages when you get it wrong. How far the happy path carries you before you need the docs, and
how good the docs are when you do.

**Total cost of ownership — 25%.** The list price, plus the line items that appear in month two:
egress, seats, build minutes, the support plan you did not think you needed, the engineer-hours
spent operating the thing.

**Operational maturity — 20%.** Observability. The rollback story. Incident history and how the
vendor communicated during it. How the tool behaves at 3am when something else is already broken.

**Ecosystem and lock-in — 15%.** How portable your configuration is. How alive the community is.
What an exit migration would actually cost, priced in weeks.

**Trajectory — 10%.** Release cadence. Roadmap transparency. Whether the last two years suggest
anything useful about the next two.

## The process

1. **Pick a decision teams are actively arguing about.** Not whatever launched last week. We take
   suggestions, and the ones we hear most often become the next review.
2. **Port one real project onto both options.** The same application, the same team, the same
   deadline. A greenfield toy tells you nothing about migration cost, which is most of the cost.
3. **Run it for at least four weeks.** Including at least one deploy under time pressure, because
   tools reveal themselves when you are in a hurry.
4. **Score against the rubric before writing prose.** Numbers first. It is much harder to talk
   yourself into a conclusion when the scores are already on the page.
5. **Send the draft to both vendors for factual correction.** They get to tell us we described a
   pricing tier wrong. They do not get to change a score, see it early enough to respond publicly,
   or approve the conclusion.
6. **Revisit when either tool ships something that would move the result.** Reviews carry an
   `updatedDate` and we mean it.

## What we will not do

No sponsored reviews. No paid placement in a comparison table. No "featured partner" slot. No
rewriting a score because a vendor was unhappy with it.

Affiliate links exist on a minority of the tools we cover, and they are marked wherever they
appear. They have never moved a score, and the review is written before anyone looks at whether a
programme exists.

Display advertising through Google AdSense pays for the rest. Google sells the inventory; we
cannot see who bought it and they cannot see what we are writing.

## Where this breaks down

Two honest limitations.

**Four weeks is not four years.** We can tell you what a migration costs and how a tool feels in
its first quarter. We cannot tell you what maintaining it looks like in 2030. Where we have
long-running production experience with something, we say so explicitly.

**Our projects are not your project.** A twelve-service workload at 4,000 requests per minute is
representative of a lot of teams and irrelevant to some. Every review states what we ran, so you
can judge how far the result travels.

If you think we got something wrong, [tell us](/contact). Corrections get published, and they get
priority over everything else in the queue.
