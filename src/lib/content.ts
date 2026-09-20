import { getCollection, type CollectionEntry } from 'astro:content';
import { TOOLS, toolBySlug, type Tool } from '@/data/tools';

export type GuideSection = CollectionEntry<'guides'>;
export type Article = CollectionEntry<'articles'>;

/** A tool plus its ordered curriculum. */
export interface Guide {
  tool: Tool;
  sections: GuideSection[];
}

const isPublished = (entry: { data: { draft: boolean } }) =>
  import.meta.env.DEV || !entry.data.draft;

/** The tool slug is the first path segment of the entry id. */
export const toolSlugOf = (entry: GuideSection): string => entry.id.split('/')[0] ?? '';

/** The section slug is everything after the tool segment. */
export const sectionSlugOf = (entry: GuideSection): string =>
  entry.id.split('/').slice(1).join('/');

export const pathOf = (entry: GuideSection): string => `/guides/${entry.id}`;

export async function getGuideSections(): Promise<GuideSection[]> {
  const entries = await getCollection('guides', isPublished);
  return entries.sort((a, b) => {
    const tool = toolSlugOf(a).localeCompare(toolSlugOf(b));
    return tool !== 0 ? tool : a.data.order - b.data.order;
  });
}

/** Every tool that has at least one published section, in catalogue order. */
export async function getGuides(): Promise<Guide[]> {
  const sections = await getGuideSections();
  return TOOLS.map((tool) => ({
    tool,
    sections: sections.filter((section) => toolSlugOf(section) === tool.slug),
  })).filter((guide) => guide.sections.length > 0);
}

export async function getGuide(slug: string): Promise<Guide | undefined> {
  const tool = toolBySlug(slug);
  if (!tool) return undefined;
  const sections = (await getGuideSections()).filter((s) => toolSlugOf(s) === slug);
  return sections.length > 0 ? { tool, sections } : undefined;
}

/** Previous and next section within the same tool, for the pager. */
export function neighbours(sections: GuideSection[], current: GuideSection) {
  const index = sections.findIndex((section) => section.id === current.id);
  return {
    prev: index > 0 ? sections[index - 1] : undefined,
    next: index >= 0 && index < sections.length - 1 ? sections[index + 1] : undefined,
  };
}

export async function getArticles(): Promise<Article[]> {
  const entries = await getCollection('articles', isPublished);
  return entries.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export async function getFeaturedArticles(limit = 3): Promise<Article[]> {
  const articles = await getArticles();
  const featured = articles.filter((article) => article.data.featured);
  return (featured.length > 0 ? featured : articles).slice(0, limit);
}

export function categoriesOf(entries: { data: { category: string } }[]) {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    counts.set(entry.data.category, (counts.get(entry.data.category) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

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
