import { SITE } from '@/consts';

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(SITE.language, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString();
}

/** ~225 wpm, the usual figure for technical prose. Minimum one minute. */
export function readingTime(body: string | undefined): number {
  const words = (body ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

export function absoluteUrl(path: string, site: URL | string): string {
  return new URL(path, site).toString();
}
