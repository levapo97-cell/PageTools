import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getReviews, getArticles } from '@/lib/content';
import { SITE, SITE_URL } from '@/consts';

export async function GET(context: APIContext) {
  const [reviews, articles] = await Promise.all([getReviews(), getArticles()]);

  const items = [
    ...reviews.map((review) => ({
      title: review.data.title,
      description: review.data.description,
      pubDate: review.data.pubDate,
      link: `/reviews/${review.id}`,
      categories: [review.data.category, ...review.data.tags],
      author: review.data.author,
    })),
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
