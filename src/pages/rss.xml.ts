import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getGuideSections, getArticles, pathOf, toolSlugOf } from '@/lib/content';
import { toolBySlug } from '@/data/tools';
import { SITE, SITE_URL } from '@/consts';

export async function GET(context: APIContext) {
  const [sections, articles] = await Promise.all([getGuideSections(), getArticles()]);

  const items = [
    ...sections.map((section) => {
      const tool = toolBySlug(toolSlugOf(section));
      return {
        title: `${tool?.name ?? 'Guide'}: ${section.data.title}`,
        description: section.data.description,
        pubDate: section.data.pubDate,
        link: pathOf(section),
        categories: [tool?.category ?? 'Guides', ...section.data.tags],
        author: section.data.author,
      };
    }),
    ...articles.map((article) => ({
      title: article.data.title,
      description: article.data.description,
      pubDate: article.data.pubDate,
      link: `/articles/${article.id}`,
      categories: [article.data.category, ...article.data.tags],
      author: article.data.author,
    })),
  ].sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());

  return rss({
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    site: context.site ?? SITE_URL,
    items,
    customData: `<language>${SITE.language.toLowerCase()}</language><copyright>© ${new Date().getFullYear()} ${SITE.name}</copyright>`,
  });
}
