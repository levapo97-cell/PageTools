# Deployment — DevToolSDK

Static Astro build (`output: 'static'`) deployed to Vercel. Two paths are supported and
they are mutually exclusive in practice: the **Vercel Git integration** (zero config) or
the **GitHub Actions workflows** in this repo (explicit, auditable). Pick one.

---

## Branch model

| Branch      | Purpose                    | Deploys to           |
| ----------- | -------------------------- | -------------------- |
| `main`      | Production                 | Production domain    |
| `develop`   | Integration / staging      | Vercel preview URL   |
| `feat/*`    | Feature work → PR to `develop` | Vercel preview URL per PR |

---

## Option A — Vercel Git integration (recommended for the first deploy)

1. Go to <https://vercel.com/new> and import `levapo97-cell/DevToolSDK`.
2. Vercel auto-detects Astro. Confirm the settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm ci`
   - **Node.js version:** 22.x
3. Add the environment variables (see the table below) for **Production**, **Preview** and
   **Development**.
4. Deploy. Every push to `main` becomes production; every other branch and PR becomes a preview.
5. Under **Settings → Git**, set the production branch to `main`.

If you use this option, disable the two Vercel workflows so deployments don't run twice:
rename `.github/workflows/vercel-*.yml` to `*.yml.disabled`, or delete them. `ci.yml` is still
useful — it type-checks and builds on every PR.

---

## Option B — GitHub Actions (workflows included)

The repo ships three workflows:

| Workflow                        | Trigger                              | What it does                                     |
| ------------------------------- | ------------------------------------ | ------------------------------------------------ |
| `ci.yml`                        | push/PR on `main`, `develop`         | `astro check` + `astro build`, uploads `dist/`    |
| `vercel-preview.yml`            | push on `develop`, any PR            | Preview deploy, comments the URL on the PR        |
| `vercel-production.yml`         | push on `main`, manual dispatch      | Production deploy                                 |

All three skip cleanly (with a notice, not a failure) when `package.json` or the Vercel
secrets are missing, so an empty branch never shows a red ❌.

### Required repository secrets

`Settings → Secrets and variables → Actions → New repository secret`:

| Secret              | Where to get it                                                      |
| ------------------- | -------------------------------------------------------------------- |
| `VERCEL_TOKEN`      | <https://vercel.com/account/tokens> → Create token (scope: your team) |
| `VERCEL_ORG_ID`     | `vercel link` then read `.vercel/project.json` → `orgId`              |
| `VERCEL_PROJECT_ID` | `vercel link` then read `.vercel/project.json` → `projectId`          |

```bash
npm i -g vercel
vercel login
vercel link          # creates .vercel/project.json (git-ignored)
cat .vercel/project.json
```

### Optional repository variables

`Settings → Secrets and variables → Actions → Variables`:

| Variable                | Example                    | Used by                       |
| ----------------------- | -------------------------- | ----------------------------- |
| `PUBLIC_SITE_URL`       | `https://devtoolsdk.dev`    | `ci.yml` build (canonical URLs, sitemap) |
| `PUBLIC_ADSENSE_CLIENT` | `ca-pub-XXXXXXXXXXXXXXXX`  | `ci.yml` build (AdSense snippet) |

---

## Environment variables

Set these in **Vercel → Settings → Environment Variables** (and in `.env` locally, copying
from `.env.example`). Everything prefixed `PUBLIC_` is inlined into the client bundle — never
put a secret behind that prefix.

| Variable                 | Required | Description                                                     |
| ------------------------ | -------- | --------------------------------------------------------------- |
| `PUBLIC_SITE_URL`        | yes      | Canonical origin, no trailing slash. Drives sitemap, RSS, OG tags. |
| `PUBLIC_ADSENSE_CLIENT`  | no       | AdSense publisher id `ca-pub-…`. Omit and all ad markup is skipped. |
| `PUBLIC_ADSENSE_ENABLED` | no       | `true` to emit the AdSense script. Leave unset in preview envs.   |
| `PUBLIC_CONTACT_ENDPOINT`| no       | Form POST endpoint (Formspree/Web3Forms). Falls back to `mailto:`. |

> Preview deployments should run **without** AdSense enabled. Google does not want ads served
> on staging URLs, and it can put the account at risk.

---

## Custom domain

1. **Vercel → Settings → Domains → Add** → `devtoolsdk.dev` (and `www.devtoolsdk.dev`).
2. At your registrar, point:
   - `A` record `@` → `76.76.21.21`
   - `CNAME` record `www` → `cname.vercel-dns.com`
3. Wait for the TLS certificate (usually < 1 min).
4. Update `PUBLIC_SITE_URL` to the final origin and redeploy — the sitemap, RSS feed and
   canonical tags are all derived from it.
5. Submit `https://devtoolsdk.dev/sitemap-index.xml` in Google Search Console.

---

## Caching

`vercel.json` sets the cache policy: immutable one-year caching for `/_astro/*` (hashed
filenames), a short `s-maxage` with `stale-while-revalidate` for HTML, and one hour for the
RSS feed. Nothing else needs tuning for a static build.

---

## Local verification before a release

```bash
npm ci
npm run check     # astro check — types + content collection schemas
npm run build     # static build into dist/
npm run preview   # serve dist/ at http://localhost:4321
```

## Rollback

Vercel keeps every deployment. **Deployments → pick the last good one → Promote to
Production**. That is instantaneous and does not require a git revert; do the revert on
`main` afterwards so the repo matches what is live.
