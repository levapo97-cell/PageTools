---
title: 'PostgreSQL vs MySQL: the 2026 comparison for new applications'
description: >-
  Both are excellent, free and battle-tested, which makes the choice harder rather than easier.
  We benchmarked identical schemas and workloads, then looked at the features that actually
  change how you write application code.
pubDate: 2026-06-04
author: The PageTools Team
category: Databases
tags: [postgresql, mysql, databases, sql, backend]
rating: 4.6
verdict: 'PostgreSQL for new projects, unless you have a specific reason to choose MySQL'
summary: >-
  PostgreSQL has the richer type system, stronger correctness guarantees, and the extension
  ecosystem that lets one database do several jobs. MySQL is faster on simple read-heavy
  workloads and easier to operate at scale with mature replication tooling.
featured: true
tools:
  - name: PostgreSQL
    vendor: PostgreSQL Global Development Group
    url: https://www.postgresql.org
    rating: 4.8
    pricing: 'Free and open source (PostgreSQL licence); managed from ~$15/mo'
    bestFor: 'Applications with complex data, or anyone who wants one database to do several jobs'
    pros:
      - Rich types — JSONB, arrays, ranges, custom types, proper enums
      - Extensions turn it into a vector store, time-series DB or geospatial engine
      - Strictest standards compliance and the best correctness guarantees under concurrency
      - Transactional DDL — schema migrations roll back cleanly
    cons:
      - Connection handling is heavier; you will need PgBouncer past a few hundred connections
      - Vacuum tuning is a real operational skill on write-heavy tables
      - Slightly slower on the simplest read-heavy workloads
      - Major version upgrades need pg_upgrade planning
  - name: MySQL
    vendor: Oracle / open source
    url: https://www.mysql.com
    rating: 4.3
    pricing: 'Community Edition free (GPL); managed from ~$15/mo; Enterprise licensed separately'
    bestFor: 'Read-heavy web workloads and teams with existing MySQL operational experience'
    pros:
      - Faster on simple primary-key and index-range reads at high concurrency
      - Replication tooling is mature, well understood and widely documented
      - Lighter connection model handles many connections without a pooler
      - Enormous installed base — hosting, tooling and expertise everywhere
    cons:
      - Weaker type system; JSON support is real but behind JSONB
      - DDL is not transactional — a failed migration can leave a half-changed schema
      - Historical defaults (silent truncation, utf8 that was not UTF-8) left scar tissue
      - Extension story is nothing like Postgres's
comparison:
  - feature: JSON support
    a: 'JSONB — binary, indexable with GIN, rich operators'
    b: 'JSON type, functional indexes only'
    winner: a
  - feature: Simple read throughput (our benchmark)
    a: '48,200 qps'
    b: '57,600 qps'
    winner: b
  - feature: Complex join/aggregate throughput
    a: '4,100 qps'
    b: '2,700 qps'
    winner: a
  - feature: Transactional DDL
    a: 'Yes — migrations roll back'
    b: 'No'
    winner: a
  - feature: Extensions
    a: 'PostGIS, pgvector, TimescaleDB, pg_partman and hundreds more'
    b: 'Limited plugin surface'
    winner: a
  - feature: Connection scaling
    a: 'Process per connection; needs PgBouncer'
    b: 'Thread per connection; lighter'
    winner: b
  - feature: Replication tooling maturity
    a: 'Logical and physical, good'
    b: 'Very mature, huge operational corpus'
    winner: b
  - feature: Standards compliance
    a: 'Strictest of the mainstream engines'
    b: 'Good, with historical quirks'
    winner: a
---

## The benchmark

Identical schema (a commerce model — orders, line items, products, customers, events), 50 million
rows, on identical 8-vCPU instances with the same memory and NVMe storage. Both tuned by someone
who knew what they were doing, because an untuned comparison is worthless.

**Simple reads** (primary key lookups and single-index range scans, 200 concurrent clients):
MySQL 57,600 qps, PostgreSQL 48,200 qps. MySQL is about 19% ahead.

**Complex queries** (four-table joins with aggregation and window functions): PostgreSQL 4,100
qps, MySQL 2,700 qps. PostgreSQL is about 52% ahead.

**Writes** (mixed insert/update with transactions): within 6% of each other — not a meaningful
difference.

That shape is consistent with everything else we have read. MySQL is faster at the simple thing;
PostgreSQL is faster at the complicated thing.

## What actually changes your code

Benchmarks rarely decide this. Features do.

**JSONB.** Storing semi-structured data — event payloads, feature flags, per-tenant settings — in
PostgreSQL means a real binary type with GIN indexes and operators that read like SQL. In MySQL
you have JSON, but indexing means generated columns and functional indexes, and the ergonomics
are worse. We have watched teams add a document store alongside MySQL for this and then regret
the second system.

**Transactional DDL.** A PostgreSQL migration that adds three columns, backfills one and fails on
the fourth statement leaves your schema untouched. The MySQL equivalent leaves you with three new
columns and a decision to make at an unpleasant hour. Over a few years of migrations, this is the
single feature we hear the most gratitude for.

**Extensions.** `pgvector` for embeddings, PostGIS for geospatial, TimescaleDB for time series,
`pg_partman` for partitioning. One database, one backup strategy, one set of credentials. Every
one of those is a separate service in a MySQL shop.

## Where MySQL is the better call

**Connection scaling.** PostgreSQL forks a process per connection, which gets expensive past a
few hundred. You will run PgBouncer, and that is one more component in the path to your data.
MySQL's threaded model absorbs thousands of connections without help. For a serverless
architecture opening connections indiscriminately, that is a real advantage — though RDS Proxy
and Neon-style poolers have narrowed it.

**Operational corpus.** Twenty-five years of people running MySQL replication at enormous scale
means that whatever is happening to you has happened to someone who wrote it up. Postgres's
equivalent body of knowledge is good and smaller.

**Existing expertise.** If your team has run MySQL for a decade, that is a legitimate reason to
keep running MySQL. Operational familiarity beats a 50% advantage on join-heavy queries you may
not be running.

## How to choose

Choose **PostgreSQL** for new projects. That is the honest default in 2026 — the type system,
transactional DDL and extension ecosystem compound over a project's life in a way the raw read
throughput does not.

Choose **MySQL** if your workload is genuinely simple reads at very high concurrency, if you have
deep in-house MySQL operational experience, or if you are constrained by a platform that supports
it better.

Do not migrate a working MySQL application to PostgreSQL for the reasons in this review. Nothing
here is worth the risk of a data migration on a system that is doing its job.
