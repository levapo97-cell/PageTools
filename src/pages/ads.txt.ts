import { ADS } from '@/consts';

/**
 * Authorized Digital Sellers (IAB ads.txt).
 *
 * Generated from PUBLIC_ADSENSE_CLIENT so the publisher id can never drift out of
 * sync with the AdSense snippet in Head.astro. With no id configured the file
 * contains comments only, which declares no authorized sellers — correct, since
 * no ads are served in that configuration either.
 */
export async function GET() {
  const publisherId = ADS.client.replace(/^ca-/, '');

  const body = publisherId
    ? [
        '# Authorized Digital Sellers for this domain.',
        '# https://iabtechlab.com/ads-txt/',
        `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`,
        '',
      ].join('\n')
    : [
        '# No advertising configured for this deployment.',
        '# Set PUBLIC_ADSENSE_CLIENT to publish the authorized seller record.',
        '',
      ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
