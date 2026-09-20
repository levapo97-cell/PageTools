import type { APIContext } from 'astro';

/**
 * Generated so the sitemap line always points at the deployed origin.
 * Preview deployments (PUBLIC_SITE_URL unset or a *.vercel.app host) are
 * disallowed wholesale to keep staging copies out of the index.
 */
export async function GET(context: APIContext) {
  const site = context.site?.toString().replace(/\/$/, '') ?? 'https://devtoolsdk.com';
  const isPreview = /vercel\.app$/.test(new URL(site).hostname);

  const body = isPreview
    ? ['User-agent: *', 'Disallow: /', ''].join('\n')
    : [
        'User-agent: *',
        'Allow: /',
        '',
        '# Ad crawlers need access for AdSense to serve relevant ads.',
        'User-agent: Mediapartners-Google',
        'Allow: /',
        '',
        'User-agent: AdsBot-Google',
        'Allow: /',
        '',
        '# Housekeeping',
        'Disallow: /404',
        'Disallow: /*?*utm_',
        '',
        `Sitemap: ${site}/sitemap-index.xml`,
        '',
      ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
