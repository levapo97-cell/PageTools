import { getCollection, type CollectionEntry } from 'astro:content';

export type Review = CollectionEntry<'reviews'>;
export type Article = CollectionEntry<'articles'>;

const isPublished = (entry: { data: { draft: boolean } }) =>
  import.meta.env.DEV || !entry.data.draft;

const byNewest = (a: { data: { pubDate: Date } }, b: { data: { pubDate: Date } }) =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf();

export async function getReviews(): Promise<Review[]> {
  const entries = await getCollection('reviews', isPublished);
  return entries.sort(byNewest);
}

export async function getArticles(): Promise<Article[]> {
  const entries = await getCollection('articles', isPublished);
  return entries.sort(byNewest);
}

export async function getFeaturedReviews(limit = 3): Promise<Review[]> {
  const reviews = await getReviews();
  const featured = reviews.filter((r) => r.data.featured);
  return (featured.length > 0 ? featured : reviews).slice(0, limit);
}

/** Distinct categories present in a collection, with their entry counts. */
export function categoriesOf(entries: { data: { category: string } }[]) {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    counts.set(entry.data.category, (counts.get(entry.data.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Same category first, then most recent. Never returns the entry itself. */
export function relatedTo<T extends { id: string; data: { category: string; pubDate: Date } }>(
  entry: T,
  pool: T[],
  limit = 3,
): T[] {
  return pool
    .filter((candidate) => candidate.id !== entry.id)
    .sort((a, b) => {
      const aMatch = a.data.category === entry.data.category ? 1 : 0;
      const bMatch = b.data.category === entry.data.category ? 1 : 0;
      return bMatch - aMatch || b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
    })
    .slice(0, limit);
}
