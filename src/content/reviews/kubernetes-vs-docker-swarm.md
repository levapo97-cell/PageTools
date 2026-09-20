---
title: 'Kubernetes vs Docker Swarm: when is the simpler orchestrator the right call?'
description: >-
  Swarm is not dead and Kubernetes is not always the answer. We ran the same twelve-service
  workload on both for a quarter and measured what the complexity actually buys you — and what
  it costs in engineer-hours.
pubDate: 2026-07-30
author: The PageTools Team
category: Orchestration
tags: [kubernetes, docker-swarm, orchestration, containers, devops]
rating: 4.1
verdict: 'Kubernetes for anything that will grow; Swarm for small teams who need orchestration this month'
summary: >-
  Kubernetes wins on ecosystem, hiring, and every capability that matters past about twenty
  services. Swarm wins on the week you need to ship: three commands to a running cluster, and a
  Compose file you already have.
tools:
  - name: Kubernetes
    vendor: CNCF
    url: https://kubernetes.io
    rating: 4.5
    pricing: 'Open source; managed control planes $0–$73/cluster/mo plus nodes'
    bestFor: 'Anything expected to grow past a handful of services, or that needs the CNCF ecosystem'
    pros:
      - Every cloud offers a managed control plane; no orchestrator to operate yourself
      - The ecosystem — Helm, operators, service meshes, ArgoCD — has no equivalent elsewhere
      - Horizontal pod autoscaling and cluster autoscaling both work out of the box
      - By far the largest pool of engineers who already know it
    cons:
      - The learning curve is genuinely steep and does not flatten quickly
      - A minimal production setup still means ingress, cert-manager, monitoring and RBAC
      - YAML volume grows faster than service count
      - Managed control plane fees and idle node capacity cost money before you ship anything
  - name: Docker Swarm
    vendor: Docker Inc. / Mirantis
    url: https://docs.docker.com/engine/swarm/
    rating: 3.6
    pricing: 'Free — built into Docker Engine'
    bestFor: 'Small teams with fewer than ~20 services who already have Compose files'
    pros:
      - '`docker swarm init` and you have a working cluster in under a minute'
      - Compose files deploy almost unchanged as stacks
      - Built into Docker Engine — nothing extra to install or operate
      - Overlay networking and service discovery work with no configuration
    cons:
      - Development is in maintenance mode; do not expect new capability
      - No autoscaling of any kind without writing it yourself
      - Ecosystem is a fraction of Kubernetes — no operators, thin Helm equivalent
      - Hiring for Swarm experience is much harder than for Kubernetes
comparison:
  - feature: Time to first running cluster
    a: '30–90 min (managed) to days (self-hosted)'
    b: 'Under 5 minutes'
    winner: b
  - feature: Autoscaling
    a: 'HPA, VPA and cluster autoscaler built in'
    b: 'None'
    winner: a
  - feature: Ecosystem
    a: 'Helm, operators, ArgoCD, meshes, CRDs'
    b: 'Minimal'
    winner: a
  - feature: Config complexity for 12 services
    a: '~2,100 lines of YAML + Helm charts'
    b: '~380 lines of Compose'
    winner: b
  - feature: Rolling updates & rollback
    a: 'Fine-grained, with health-gated rollout'
    b: 'Built in, simpler, adequate'
    winner: a
  - feature: Multi-tenancy & RBAC
    a: 'Namespaces, RBAC, network policies, quotas'
    b: 'Basic'
    winner: a
  - feature: Ongoing project investment
    a: 'Very active, quarterly releases'
    b: 'Maintenance mode'
    winner: a
  - feature: Operational burden for a 3-person team
    a: 'High even when managed'
    b: 'Low'
    winner: b
---

## The workload

Twelve services: an API gateway, five application services, two workers, Postgres, Redis, a
message broker and a metrics stack. Roughly 4,000 requests per minute at peak, with a nightly
batch job that triples CPU demand for 40 minutes.

We ran it on managed Kubernetes (three nodes) and on a five-node Swarm cluster on equivalent
VMs, for a quarter.

## What the complexity buys

The nightly batch job is the clearest answer. On Kubernetes, the horizontal pod autoscaler and
cluster autoscaler added capacity for 40 minutes and removed it afterwards, and the monthly
compute bill reflected that. On Swarm, we provisioned for peak and paid for peak all month —
roughly 34% more compute for identical work.

That is the whole argument in one number. If your load varies, Kubernetes pays for its complexity
in infrastructure cost alone.

The second is everything the ecosystem gives you for free. cert-manager renewing TLS.
ExternalDNS updating records when a service appears. ArgoCD reconciling the cluster against git.
A Prometheus operator that discovers new services automatically. Each of these is a weekend of
scripting on Swarm, forever, maintained by you.

## What it costs

2,100 lines of YAML versus 380 lines of Compose, for the same twelve services. Even with Helm
and Kustomize doing their best, the ratio did not improve much.

More honestly: setting up a *production-grade* Kubernetes cluster is not `eks create cluster`. It
is ingress controller, cert-manager, external-dns, a monitoring stack, log shipping, RBAC,
network policies, pod security standards, a secrets solution and a GitOps controller. We have
watched three-person teams spend a quarter on that and ship nothing else.

Swarm's equivalent was: `docker swarm init`, `docker stack deploy -c docker-compose.yml`, and a
Traefik service for ingress. One afternoon.

## The uncomfortable truth about Swarm

It is in maintenance mode. Mirantis maintains it, it is stable, it is not going anywhere soon —
and it is not gaining capability either. Building a platform on it in 2026 is a decision to stop
at the capability level it has today.

For a lot of workloads that is a perfectly rational trade. For anything you expect to grow, it
means a migration later, at a worse time, with more services.

## How to choose

Choose **Swarm** if all of these are true: fewer than about twenty services, a team of one to
four, predictable load, and you need orchestration working this month rather than next quarter.
You already have the Compose files. It will be running by Friday.

Choose **Kubernetes** if any of these are true: variable load that autoscaling would meaningfully
cheapen, more than about twenty services, multiple teams sharing a cluster, compliance
requirements that want RBAC and network policies, or an expectation of growth.

And choose it on a *managed* control plane. The argument above assumes EKS, GKE, AKS or
equivalent. Self-hosting the control plane is a different, much harder decision that almost
nobody needs to make.
