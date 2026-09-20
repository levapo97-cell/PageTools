# Google AdSense setup

The site ships ad-ready but ad-free. Nothing is emitted until both
`PUBLIC_ADSENSE_CLIENT` and `PUBLIC_ADSENSE_ENABLED=true` are set, which means preview
deployments never serve ads — Google does not permit that and it can put the account at risk.

---

## 1. Get approved

1. Sign up at <https://adsense.google.com> with the domain you will actually deploy to.
2. AdSense gives you a publisher id in the form `ca-pub-XXXXXXXXXXXXXXXX`.
3. Verification requires the AdSense script in `<head>` on the live site — step 2 below puts it
   there. Deploy first, then request review.
4. Approval usually takes a few days to two weeks. The site needs real content and working
   `/about`, `/contact` and privacy pages; all three exist here.

---

## 2. Wire in the publisher id

**Vercel → Settings → Environment Variables**, for **Production only**:

```
PUBLIC_ADSENSE_CLIENT  = ca-pub-XXXXXXXXXXXXXXXX
PUBLIC_ADSENSE_ENABLED = true
```

Leave both unset for Preview and Development.

Redeploy. `src/components/Head.astro` now emits:

```html
<script async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
  crossorigin="anonymous"></script>
```

That single tag is everything Auto Ads needs.

---

## 3. Turn on Auto Ads

In the AdSense dashboard: **Ads → By site → your domain → Edit**.

Recommended settings for a content site like this one:

| Setting | Value | Why |
| ------- | ----- | --- |
| Auto ads | On | Google places ads where they perform, without more code |
| Ad load | ~50–60% | Higher loads hurt Core Web Vitals and bounce rate |
| In-page ads | On | The bread and butter |
| Anchor ads | On (bottom) | Good revenue, low intrusion |
| Vignette ads | **Off** | Full-page interstitials wreck the reading experience |
| Side rail ads | On (desktop) | Uses otherwise empty gutter space |

Apply, then wait — Auto Ads takes a few hours to start placing.

---

## 4. Manual ad slots

Three placements are already in the templates, defined in `src/consts.ts`:

```ts
slots: {
  inArticle: '0000000001',        // fluid, in-article — mid-content
  displayHorizontal: '0000000002', // responsive banner — above content / between sections
  sidebar: '0000000003',           // reserved for a future sidebar unit
}
```

Where each one renders today:

| Slot | Location |
| ---- | -------- |
| `displayHorizontal` | Home (after featured), `/reviews` (after category nav), `/articles`, and above the body of every review and article |
| `inArticle` | Mid-article on reviews and articles, and in-feed on the reviews listing |
| `sidebar` | Not placed yet — available for the article sidebar |

To use them:

1. **AdSense → Ads → By ad unit → Create new ad unit.**
2. Create a *Display ad* (responsive) for `displayHorizontal` and an *In-article ad* for
   `inArticle`.
3. Copy each unit's `data-ad-slot` number.
4. Replace the placeholder ids in `src/consts.ts`.

Add another placement anywhere with:

```astro
---
import AdSlot from '@/components/AdSlot.astro';
---
<AdSlot slot="inArticle" format="fluid" layout="in-article" />
```

`AdSlot` renders nothing when ads are disabled, so it is safe to place anywhere.

---

## 5. Keeping UX intact

Rules this codebase already follows, and that you should keep following:

- **Never above the fold on mobile.** The first ad on every page sits below the header and the
  article intro.
- **No ads on `/contact`.** A form page with an ad next to the submit button generates accidental
  clicks, which is a policy violation waiting to happen.
- **Every slot is labelled.** `AdSlot` renders an "Advertisement" caption. This is required in
  some jurisdictions and is good practice everywhere.
- **No reserved empty space.** With ads off, the component renders nothing rather than a blank
  box, so Cumulative Layout Shift stays at 0.01.
- **Ad load below 60%.** Measure Core Web Vitals after enabling. If LCP moves past 2.5s, lower
  the ad load before you do anything else.

---

## 6. Before you go live

Everything on this list except the last three items is already built and committed.

| Requirement | Status |
| ----------- | ------ |
| Privacy policy covering cookies + third-party advertising | ✅ `/privacy` |
| Terms of use | ✅ `/terms` |
| Advertising & affiliate disclosure | ✅ `/disclosure` |
| All three linked from every page | ✅ footer bottom bar |
| About page with real editorial identity | ✅ `/about` |
| Contact page with a working method | ✅ `/contact` |
| Editorial methodology published | ✅ `/about#methodology` |
| `ads.txt` | ✅ generated from `PUBLIC_ADSENSE_CLIENT` at `/ads.txt` |
| Substantial original content | ✅ 11 reviews + 3 articles |
| Working navigation, no dead ends, custom 404 | ✅ |
| Favicon, OG image, web manifest | ✅ |
| Mobile-responsive | ✅ |
| Real publisher identity in `LEGAL` (`src/consts.ts`) | ✅ individual publisher, email contact |
| **Custom domain live with content** | ⬜ you |
| **`hello@` and `privacy@` mailboxes receiving mail** | ⬜ you |
| **GDPR/CCPA consent message** (AdSense → Privacy & messaging) | ⬜ you |

### `ads.txt`

You do not need to create this file. `src/pages/ads.txt.ts` derives it from
`PUBLIC_ADSENSE_CLIENT`, so the publisher id can never drift out of sync with the snippet in
`Head.astro`. With no id set it contains comments only, which is correct — no ads are served in
that configuration either.

Verify after deploying: `curl https://yourdomain.com/ads.txt` should print

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

### Consent message

Do **not** build your own cookie banner. For EEA, UK and Swiss traffic Google requires a
consent management platform it has certified, and a homemade banner does not qualify. Use
**AdSense → Privacy & messaging → GDPR message**, which is certified by definition and free.
The privacy policy already describes this mechanism.

---

## Troubleshooting

**Ads not showing after approval.** Give it 24–48 hours. Check the browser console for
`adsbygoogle` errors, and confirm the script tag is in the page source (`view-source:`, not
DevTools — an ad blocker will strip it from the rendered DOM).

**"AdSense head tag not found".** `PUBLIC_ADSENSE_ENABLED` is not `true`, or the publisher id is
empty. Both are required; either one missing suppresses the tag.

**Blank space where an ad should be.** Normal for unfilled inventory on low-traffic pages. If it
persists across all pages, the ad unit id in `src/consts.ts` is wrong.

**Policy violation on a page.** Most commonly the ad-to-content ratio. Remove a manual slot from
the offending template rather than reducing Auto Ads globally.
