/**
 * Single source of truth for site-wide metadata.
 * Everything that changes between environments comes from PUBLIC_* env vars
 * (see .env.example); everything else is editorial and lives here.
 */

export const SITE_URL = (import.meta.env.PUBLIC_SITE_URL ?? 'https://devtoolsdk.com').replace(
  /\/$/,
  '',
);

export const SITE = {
  name: 'DevToolSDK',
  tagline: 'SaaS tools, reviewed by people who ship with them',
  description:
    'Independent, hands-on reviews and head-to-head comparisons of the SaaS and developer tools teams actually deploy — CI/CD, infrastructure, hosting, databases and frameworks.',
  locale: 'en',
  language: 'en-US',
  author: 'The DevToolSDK Team',
  email: 'hello@devtoolsdk.com',
  defaultImage: '/og-default.svg',
  twitter: '',
} as const;

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/articles', label: 'Articles' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

/**
 * Legal identity used across the policy pages. The site is operated by an
 * individual publisher, so the data controller is a natural person.
 */
export const LEGAL = {
  entityName: 'Ronny Vasquez',
  jurisdiction: 'Honduras',
  address: 'San Pedro Sula, Cortés, Honduras',
  effectiveDate: '2026-09-20',
  privacyEmail: 'privacy@devtoolsdk.com',
} as const;

export const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy policy' },
  { href: '/terms', label: 'Terms of use' },
  { href: '/disclosure', label: 'Advertising & affiliate disclosure' },
] as const;

export const FOOTER_LINKS = {
  Content: [
    { href: '/reviews', label: 'All reviews' },
    { href: '/articles', label: 'All articles' },
    { href: '/rss.xml', label: 'RSS feed' },
    { href: '/sitemap-index.xml', label: 'Sitemap' },
  ],
  Company: [
    { href: '/about', label: 'About DevToolSDK' },
    { href: '/about#methodology', label: 'Our methodology' },
    { href: '/contact', label: 'Contact' },
  ],
} as const;

/**
 * Ads are opt-in. With no publisher id, or with PUBLIC_ADSENSE_ENABLED unset,
 * every <AdSlot /> renders nothing at all — no layout shift, no empty boxes.
 */
export const ADS = {
  client: import.meta.env.PUBLIC_ADSENSE_CLIENT ?? '',
  enabled:
    import.meta.env.PUBLIC_ADSENSE_ENABLED === 'true' &&
    Boolean(import.meta.env.PUBLIC_ADSENSE_CLIENT),
  /** Replace with real ad unit ids from the AdSense dashboard. */
  slots: {
    inArticle: '0000000001',
    displayHorizontal: '0000000002',
    sidebar: '0000000003',
  },
} as const;

export const FORMS = {
  contactEndpoint: import.meta.env.PUBLIC_CONTACT_ENDPOINT ?? '',
  newsletterEndpoint: import.meta.env.PUBLIC_NEWSLETTER_ENDPOINT ?? '',
} as const;

export const CATEGORIES = [
  'Infrastructure as Code',
  'CI/CD',
  'Hosting & Deployment',
  'Containers',
  'Orchestration',
  'Cloud Platforms',
  'Frontend Frameworks',
  'Web Frameworks',
  'Databases',
  'Version Control',
] as const;

export type Category = (typeof CATEGORIES)[number];
