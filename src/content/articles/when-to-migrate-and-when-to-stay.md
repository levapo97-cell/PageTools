---
title: 'When to migrate and when to stay: a framework for stack decisions'
description: >-
  A better tool is not a reason to migrate. We use four questions to decide whether a stack
  change is worth the disruption, and they have talked us out of more migrations than into
  them.
pubDate: 2026-07-24
author: The PageTools Team
category: Engineering Strategy
tags: [migration, architecture, decision-making, strategy]
---

We review tools for a living, which means we get asked to bless migrations constantly. Most of
the time our answer disappoints people: stay where you are.

Here is the framework, which is four questions. A migration needs a yes to at least two of them,
and the fourth is a veto.

## 1. Is the current tool the actual bottleneck?

Not "could be better". Bottleneck. Something you can point at — a deploy that takes 40 minutes, a
query that times out weekly, a bill that grew 3× while traffic grew 1.2×, a hiring pipeline where
three candidates in a row have never heard of your framework.

If you cannot name the number that the migration will improve, the migration is aesthetic. This
disqualifies the majority of proposals we see, including some we have made ourselves.

## 2. Is the improvement worth twice the estimate?

Every migration takes longer than planned. Not because engineers are bad at estimating in
general, but because the parts nobody remembers — the cron job on the old box, the integration
that authenticates with a shared secret nobody documented, the analytics that silently break —
are by definition the parts nobody remembers.

Take the estimate. Double it. If the improvement still justifies the cost, you have a real
candidate. If it only works at the original estimate, you do not.

## 3. Can you do it incrementally?

A migration you can run for one service, one route or one environment at a time is a
fundamentally different risk than a big-bang cutover. The incremental version lets you stop
halfway when you learn something, which you will.

This is why moving one service to Podman, or one route to a new framework, is usually a good
idea, and why moving forty services in a quarter usually is not.

If the answer is "we have to do it all at once", the bar for questions 1 and 2 goes up
substantially.

## 4. Does the team want to?

This is the veto, and it is the one engineering leaders most often skip.

A migration is executed by people. If the team believes in it, they will find the edge cases and
fix them before they matter. If it has been handed down, they will do exactly what the ticket
says and the edge cases will find you in production.

We have watched technically correct migrations fail entirely on this, and technically marginal
ones succeed because the people doing them cared. This question outranks the other three.

## What to do instead, usually

Most of the time the answer is not "migrate" or "do nothing". It is one of these:

**Fix the specific thing.** The deploy takes 40 minutes because of one unbatched step. That is a
day of work, not a quarter.

**Adopt it for new work only.** New services use the new thing; existing services stay. You get
the benefit on everything you build from now on, with none of the migration risk, at the cost of
running two things. That cost is real and usually smaller than people assume.

**Write the decision down and revisit in six months.** Half of the migrations we have declined
stopped being attractive on their own, because the incumbent shipped the missing feature or the
team stopped caring.

## When we do say migrate

For completeness, the cases where the answer is usually yes:

- The vendor has announced end-of-life, or the project is unmaintained.
- The cost curve is diverging from the usage curve and you have modelled it out twelve months.
- A security or compliance requirement cannot be met where you are.
- You cannot hire for it, and you have the evidence rather than the impression.

Notice what is not on that list: a better tool exists. That is never sufficient on its own, and
it is the reason given for most of the migrations that go badly.
