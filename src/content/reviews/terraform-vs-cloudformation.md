---
title: 'Terraform vs CloudFormation: which IaC tool should you standardise on?'
description: >-
  We rebuilt the same three-tier AWS workload in Terraform and in CloudFormation,
  then ran both through a quarter of real change requests. Here is where each one
  saved us time, and where it cost us a weekend.
pubDate: 2026-09-15
updatedDate: 2026-09-18
author: The PageTools Team
category: Infrastructure as Code
tags: [terraform, cloudformation, aws, iac, devops]
rating: 4.4
verdict: 'Terraform, unless you are all-in on AWS and value zero-drift guarantees above all else'
summary: >-
  Terraform wins on ecosystem, module reuse and multi-cloud portability. CloudFormation wins on
  native AWS coverage, drift detection and the fact that it is already there. Most teams should
  pick Terraform and keep CloudFormation for the handful of services it supports first.
featured: true
tools:
  - name: Terraform
    vendor: HashiCorp / IBM
    url: https://www.terraform.io
    rating: 4.6
    pricing: 'Open source CLI free; HCP Terraform from $0.00014/resource-hour after 500 free resources'
    bestFor: 'Teams running more than one cloud, or who want reusable modules across many accounts'
    pros:
      - Provider ecosystem covers AWS, Azure, GCP, Cloudflare, Datadog and ~4,000 more
      - HCL is far more readable than 900 lines of YAML for the same stack
      - Module registry means most common patterns are a `source =` line away
      - '`terraform plan` output is the clearest change preview of any IaC tool we tested'
    cons:
      - You own the state file, and its backend, and its locking, and its blast radius
      - New AWS services land in the provider days to weeks after launch
      - The BUSL relicense still makes some legal teams nervous; OpenTofu exists for that reason
  - name: AWS CloudFormation
    vendor: Amazon Web Services
    url: https://aws.amazon.com/cloudformation/
    rating: 4.0
    pricing: 'Free for AWS resource types; $0.0009 per handler operation for third-party/private types'
    bestFor: 'Single-account AWS shops that want managed state and native rollback'
    pros:
      - No state file to lose — AWS keeps it, versions it and locks it for you
      - Automatic rollback on failed stack updates has saved us from ourselves repeatedly
      - Drift detection is built in and free
      - New AWS services are usually supported on launch day
    cons:
      - YAML/JSON templates get unwieldy past a few hundred resources
      - AWS-only, so a second cloud means a second toolchain
      - Change sets are noticeably vaguer than `terraform plan`
      - Stuck `UPDATE_ROLLBACK_FAILED` states still require console surgery
comparison:
  - feature: Multi-cloud support
    a: 'Native — one workflow across 4,000+ providers'
    b: 'AWS only'
    winner: a
  - feature: State management
    a: 'You run the backend (S3 + DynamoDB, or HCP)'
    b: 'Fully managed by AWS'
    winner: b
  - feature: Change preview quality
    a: '`terraform plan` — precise, diff-style, trustworthy'
    b: 'Change sets — coarse, often says "Replacement: Conditional"'
    winner: a
  - feature: New AWS service coverage
    a: 'Days to weeks behind launch'
    b: 'Usually available at launch'
    winner: b
  - feature: Module / template reuse
    a: 'Public registry plus private modules, semver-pinned'
    b: 'Nested stacks and modules — workable, far less shared'
    winner: a
  - feature: Rollback on failure
    a: 'Manual — re-apply or restore state'
    b: 'Automatic, built into the stack lifecycle'
    winner: b
  - feature: Learning curve
    a: 'HCL is new syntax, but readable within a day'
    b: 'YAML is familiar, intrinsics (!GetAtt, !Sub) are not'
    winner: a
  - feature: Cost at scale
    a: 'Free CLI, or per-resource-hour on HCP'
    b: 'Free for native AWS types'
    winner: b
---

## The test

We took an existing three-tier workload — ALB, ECS Fargate services, RDS Postgres with a read
replica, ElastiCache, an S3 origin behind CloudFront, and the IAM to hold it together — and
rebuilt it twice from scratch. Then we ran a quarter's worth of real change requests through
both: a Postgres major version bump, an extra environment, a region addition, and one genuine
3am incident that needed a rollback.

Both descriptions ended up managing the same 214 AWS resources. Terraform did it in 1,180 lines
of HCL across nine modules. CloudFormation did it in 2,940 lines of YAML across six nested
stacks.

## Where Terraform pulled ahead

The plan output is the single biggest reason teams stay on Terraform. When a change is going to
replace your RDS instance rather than modify it, `terraform plan` tells you in red, at the
attribute level, before you commit. CloudFormation change sets will tell you `Replacement:
Conditional`, which is a way of saying *maybe*. Over a quarter, that difference is the gap
between reviewing a diff and guessing.

Module reuse is the second. Our VPC, ECS service and RDS patterns became three private modules
consumed by every environment with a version pin. In CloudFormation the equivalent is nested
stacks, which work, but the sharing culture never developed the same way — there is no registry
to pull a battle-tested VPC from.

The third is portability. When the same team later needed Cloudflare DNS records and a Datadog
monitor tied to the same deploy, that was fifteen lines in the existing Terraform. In
CloudFormation it meant a custom resource backed by a Lambda function, which is a thing you have
to operate.

## Where CloudFormation is genuinely better

State. Terraform's state file is a single point of failure that you are responsible for: the S3
bucket, the lock table, the encryption, the backup, and the person who ran `terraform apply` from
their laptop against prod with a stale local state. CloudFormation has none of that surface
because AWS holds the state. For a team without a platform engineer, that is worth a lot.

Rollback is the other. When a CloudFormation stack update fails, it rolls back by default. When a
`terraform apply` fails halfway, you are left with partially-applied infrastructure and a state
file that may or may not reflect it. We hit exactly this during the incident scenario, and the
recovery took 40 minutes on Terraform versus 6 on CloudFormation.

Day-one service coverage matters if you adopt new AWS services early. The AWS provider for
Terraform is fast, but it is still downstream of the service launch.

## The licensing question

HashiCorp's move to the Business Source License in 2023 pushed a real chunk of the community to
OpenTofu, the Linux Foundation fork. For almost every team, BUSL changes nothing — it restricts
offering a competing managed Terraform service, not internal use. If your legal department still
balks, OpenTofu is a drop-in replacement and everything in this review applies to it.

## How to choose

Pick **CloudFormation** if you are one AWS account deep, have no platform team, adopt new AWS
services early, and value automatic rollback over plan precision. It is already installed, it is
free, and nobody has to own a state backend.

Pick **Terraform** in every other case — and that is most cases. The moment you have a second
cloud, a SaaS provider to configure alongside your infrastructure, or more than two environments
sharing patterns, the module ecosystem and plan quality repay the state-management overhead
several times over.

The hybrid that actually works: Terraform as the standard, with CloudFormation kept in the
toolbox for the rare service the provider has not caught up with yet, imported into Terraform
state once it has.
