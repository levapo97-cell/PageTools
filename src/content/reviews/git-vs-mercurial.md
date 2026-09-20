---
title: 'Git vs Mercurial: is there still a case for hg in 2026?'
description: >-
  Git won, comprehensively. But Mercurial is still maintained, still used at very large scale,
  and still better at several things. We looked at what the remaining case actually is, and who
  it applies to.
pubDate: 2026-05-21
author: The DevToolSDK Team
category: Version Control
tags: [git, mercurial, version-control, dvcs, developer-tools]
rating: 4.0
verdict: 'Git for essentially every team; Mercurial only for very large monorepos with dedicated tooling staff'
summary: >-
  Git has the network effects, the hosting, the tooling and the hiring pool, and that settles it
  for almost everyone. Mercurial retains a cleaner CLI and better very-large-repository
  performance — advantages that only pay off if you have people to invest in them.
tools:
  - name: Git
    vendor: Git project / Software Freedom Conservancy
    url: https://git-scm.com
    rating: 4.6
    pricing: 'Free and open source (GPLv2)'
    bestFor: 'Every team that is not operating a multi-gigabyte monorepo with dedicated tooling staff'
    pros:
      - Universal — GitHub, GitLab, Bitbucket, every CI system, every IDE
      - Every developer you hire already knows it
      - Enormous tooling surface, from CLI helpers to review platforms
      - Active development; partial clone and sparse checkout closed the monorepo gap
    cons:
      - The CLI is famously inconsistent — `checkout` did four unrelated jobs for a decade
      - Rewriting history is easy to do and easy to do catastrophically
      - Submodules remain unpleasant
      - Large binary files need LFS, which is a second system with its own failure modes
  - name: Mercurial
    vendor: Mercurial project
    url: https://www.mercurial-scm.org
    rating: 3.5
    pricing: 'Free and open source (GPLv2+)'
    bestFor: 'Very large monorepos at organisations with engineers dedicated to source control'
    pros:
      - Consistent, discoverable CLI — commands do one thing and are named for it
      - Revsets are a genuinely better query language than anything in Git
      - Scales to enormous repositories, which is why Meta still runs it
      - Safer defaults; history rewriting is opt-in via extensions
    cons:
      - Hosting options have collapsed — Bitbucket dropped support in 2020
      - Almost no CI platform supports it natively any more
      - Hiring for Mercurial experience is close to impossible
      - The contributor community is a fraction of Git's
comparison:
  - feature: Hosting options
    a: 'GitHub, GitLab, Bitbucket, Gitea, Forgejo, self-host'
    b: 'Heptapod and self-hosting'
    winner: a
  - feature: CI/CD support
    a: 'Universal'
    b: 'Rare; usually needs a bridge'
    winner: a
  - feature: CLI consistency
    a: 'Improving, historically poor'
    b: 'Consistent and discoverable'
    winner: b
  - feature: History query language
    a: 'Flags on `git log`'
    b: 'Revsets — composable and expressive'
    winner: b
  - feature: Very large repo performance
    a: 'Good with partial clone and sparse checkout'
    b: 'Excellent, proven at Meta scale'
    winner: b
  - feature: Hiring pool
    a: 'Effectively everyone'
    b: 'Very small'
    winner: a
  - feature: Safety of default workflow
    a: 'History rewriting available by default'
    b: 'Immutable by default, rewriting opt-in'
    winner: b
  - feature: Ecosystem & tooling
    a: 'Vast'
    b: 'Small'
    winner: a
---

## Let us be clear about the outcome

Git won. Surveys consistently put it above 93% of professional developers; Mercurial does not
reliably clear 1%. Bitbucket, the last major host offering Mercurial, removed it in 2020. If you
are choosing version control for a new project today and you are not Meta, you are choosing Git,
and this review is not going to talk you out of it.

What is worth understanding is *why* Mercurial lost despite being, in several concrete ways, the
better-designed tool. That understanding is useful when you are next choosing between a better
design and a bigger network.

## Where Mercurial is genuinely better

**The command line.** `hg` commands do one thing and are named after it. Git's `checkout` spent a
decade switching branches, restoring files and creating branches, which is why `git switch` and
`git restore` now exist. Mercurial never needed that correction.

**Revsets.** Mercurial's revision query language is composable in a way Git's log flags are not.
`hg log -r "author(ana) and merge() and date('>2026-01-01')"` reads as one expression; the Git
equivalent is flags that happen to combine.

**Safe defaults.** History in Mercurial is immutable unless you enable an extension that makes it
otherwise. Git ships `rebase`, `commit --amend` and `push --force` to anyone who reads a blog
post, and the resulting force-push incident is a rite of passage at most companies.

**Scale.** Meta still runs Mercurial (heavily modified, as Sapling) on one of the largest
repositories in existence. That is not nostalgia; it is because it handled the scale better at the
time the decision was made.

## Why none of that was enough

Network effects. GitHub launched in 2008 and made Git's rough edges worth tolerating, because the
collaboration model on top of it was better than anything else available. Every subsequent tool —
CI platforms, code review, IDE integrations, dependency managers that fetch from VCS URLs —
assumed Git. Each assumption raised the cost of being elsewhere.

And Git closed the gap on Mercurial's genuine technical advantages. Partial clone, sparse
checkout, commit graphs and the multi-pack index have made Git viable on repositories that would
have been unusable in 2012. The performance argument that justified Mercurial at scale is much
weaker now.

## Who should still consider it

Honestly: almost nobody. The specific profile is an organisation with a multi-gigabyte monorepo,
hundreds of millions of files or a very long history, *and* engineers whose job is source control
tooling. If you have those people, Sapling — Meta's Mercurial-derived client, which can work
against Git repositories — is the more interesting thing to look at than Mercurial itself.

For everyone else: use Git. Use `git switch` and `git restore` instead of `checkout`. Turn on
`push.default = simple` and protect your main branch. Most of Mercurial's safety advantage can be
configured into Git, and none of Git's ecosystem advantage can be configured into Mercurial.

## How to choose

Choose **Git**. Then spend the hour you saved on learning `git rebase -i`, `git bisect` and
`git reflog` — the three commands that separate people who find Git frustrating from people who
find it powerful.

Consider **Sapling** if you are at genuine monorepo scale and the Git client is the bottleneck.
It gives you much of Mercurial's ergonomics while still talking to Git repositories, which is the
only way that trade makes sense in 2026.
