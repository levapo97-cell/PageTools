---
title: 'Docker vs Podman: is the daemonless container runtime ready for your team?'
description: >-
  Podman promises rootless, daemonless containers with a Docker-compatible CLI. We migrated a
  development team of twelve for a full sprint to find out what actually breaks, and what the
  licensing change really costs.
pubDate: 2026-08-14
author: The PageTools Team
category: Containers
tags: [docker, podman, containers, rootless, devops]
rating: 4.2
verdict: 'Docker for team-wide developer experience; Podman for rootless production hosts and licence-free CI'
summary: >-
  Podman has closed almost the entire gap and wins outright on security architecture. Docker still
  wins on the last mile — Compose, Desktop, and the thousand small integrations that assume a
  daemon at /var/run/docker.sock.
tools:
  - name: Docker
    vendor: Docker Inc.
    url: https://www.docker.com
    rating: 4.4
    pricing: 'Engine free (Apache 2.0); Desktop free under 250 employees/$10M revenue, else $9–24/user/mo'
    bestFor: 'Development teams who want the shortest path from zero to a running container'
    pros:
      - Docker Compose is still the clearest multi-container development experience
      - Desktop gives non-Linux developers a working environment in one installer
      - Every CI platform, IDE and testing library assumes Docker exists
      - Docker Hub remains the default registry everything pulls from
    cons:
      - Desktop requires a paid subscription for larger companies
      - The daemon runs as root by default — a long-standing security complaint
      - A daemon crash takes every container with it
      - Docker Hub rate limits bite anonymous CI pulls
  - name: Podman
    vendor: Red Hat / containers org
    url: https://podman.io
    rating: 4.1
    pricing: 'Free and open source (Apache 2.0), including Podman Desktop'
    bestFor: 'Rootless production hosts, CI runners, and anyone avoiding Desktop licensing'
    pros:
      - Daemonless and rootless by default — containers are ordinary child processes
      - '`alias docker=podman` covers the overwhelming majority of daily commands'
      - Pods map directly onto Kubernetes pods; `podman kube generate` is genuinely useful
      - systemd integration (Quadlet) makes containers behave like normal services
    cons:
      - '`podman compose` shells out to an external provider and is not fully equivalent'
      - Rootless networking via pasta/slirp4netns is slower than the bridge Docker uses
      - Tooling that hardcodes the Docker socket needs a shim
      - Smaller community means fewer answers when something is genuinely weird
comparison:
  - feature: Architecture
    a: 'Client + long-running root daemon'
    b: 'Daemonless — fork/exec child processes'
    winner: b
  - feature: Rootless by default
    a: 'Opt-in, extra setup'
    b: 'Default'
    winner: b
  - feature: Compose support
    a: 'Native, first-class'
    b: 'External provider, mostly compatible'
    winner: a
  - feature: Licensing cost
    a: 'Desktop paid above the size threshold'
    b: 'Free at any size'
    winner: b
  - feature: CLI compatibility
    a: 'The reference implementation'
    b: 'Near-complete drop-in replacement'
    winner: a
  - feature: Kubernetes alignment
    a: 'Containers only'
    b: 'Native pods, `kube generate`/`kube play`'
    winner: b
  - feature: Ecosystem & tooling assumptions
    a: 'Everything assumes Docker'
    b: 'Needs a socket shim in places'
    winner: a
  - feature: Rootless network throughput
    a: 'Bridge networking, faster'
    b: 'pasta/slirp4netns, measurably slower'
    winner: a
---

## The migration

Twelve developers, one sprint, one instruction: `alias docker=podman` and tell us what breaks.
Mixed fleet — seven macOS, four Linux, one Windows/WSL2.

Things that broke, in order of how much they hurt:

1. **Testcontainers.** The Java and Node libraries look for `/var/run/docker.sock`. Fixable with
   `DOCKER_HOST` pointing at the Podman socket, plus `podman system service` running. Two hours
   of fleet-wide confusion before someone wrote it down.
2. **`docker compose up` on macOS.** `podman compose` delegates to an external provider. It
   mostly worked; volume mount performance inside the Podman machine was worse, and one service
   with a `depends_on: condition: service_healthy` needed rewriting.
3. **A CI job** that mounted the Docker socket into a container to build images. That pattern
   does not translate; we replaced it with `podman build` directly, which is better anyway.

Things that did not break: every `docker run`, `docker build`, `docker ps`, `docker exec`,
registry login, multi-stage builds, BuildKit-style cache mounts. The CLI compatibility claim
holds up.

## The security argument

This is Podman's real case and it is a good one. Docker's daemon runs as root; a user in the
`docker` group is effectively root on that host, which is a fact that has surprised many an
auditor. Podman runs containers as ordinary unprivileged child processes of your shell, using
user namespaces.

On production hosts and CI runners, that difference is worth the migration on its own. A
compromised build job in a rootless Podman container has the blast radius of the CI user, not of
root.

The Quadlet integration compounds it: a container described in a systemd unit file, managed with
`systemctl`, restarting under the same supervision as everything else on the box. For long-lived
services on a VM, it is a cleaner story than a Docker daemon plus restart policies.

## The licensing question

Docker Desktop is free for individuals, education, open source and companies under 250 employees
or $10M revenue. Above that, it is $9–24 per user per month. For a 400-person engineering
organisation that is $43k–115k a year for a local development tool.

Podman Desktop is free at any size and does the same job. For a lot of the teams asking us about
this, the security architecture is a bonus and the invoice is the actual reason.

Note the distinction: Docker *Engine* is Apache 2.0 and free on Linux regardless of company size.
Only Desktop is licensed. If your developers are on Linux, there is no bill to escape.

## How to choose

Run **Docker** for developer workstations if you are under the licensing threshold and your team
lives in Compose. The experience is smoother and nothing in this review is worth spending a
sprint on to avoid.

Run **Podman** on production hosts and CI runners regardless. Rootless-by-default is the correct
posture for anything running untrusted or semi-trusted workloads, and Quadlet makes containers
behave like the services they are.

Run **Podman everywhere** if you are over the Desktop licensing threshold. Budget one sprint,
write down the Testcontainers fix on day one, and expect Compose to be the rough edge.
