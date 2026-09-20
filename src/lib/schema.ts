import { SITE, SITE_URL } from '@/consts';

const abs = (path: string) => new URL(path, SITE_URL).toString();

export const organizationSchema = () => ({
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: SITE.name,
  url: SITE_URL,
  description: SITE.description,
  logo: {
    '@type': 'ImageObject',
    url: abs('/favicon.svg'),
  },
  email: SITE.email,
});

export const websiteSchema = () => ({
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE.name,
  url: SITE_URL,
  description: SITE.description,
  inLanguage: SITE.language,
  publisher: { '@id': `${SITE_URL}/#organization` },
});

interface ArticleInput {
  title: string;
  description: string;
  path: string;
  author: string;
  pubDate: Date;
  updatedDate?: Date;
  image?: string;
  section: string;
  keywords?: string[];
}

export const articleSchema = (input: ArticleInput) => ({
  '@type': 'Article',
  '@id': `${abs(input.path)}#article`,
  headline: input.title,
  description: input.description,
  url: abs(input.path),
  mainEntityOfPage: { '@type': 'WebPage', '@id': abs(input.path) },
  datePublished: input.pubDate.toISOString(),
  dateModified: (input.updatedDate ?? input.pubDate).toISOString(),
  author: { '@type': 'Person', name: input.author },
  publisher: { '@id': `${SITE_URL}/#organization` },
  image: abs(input.image ?? SITE.defaultImage),
  articleSection: input.section,
  inLanguage: SITE.language,
  ...(input.keywords?.length ? { keywords: input.keywords.join(', ') } : {}),
});

interface ReviewInput extends ArticleInput {
  rating: number;
  /** The product(s) under review. */
  items: { name: string; url?: string; vendor?: string; rating: number }[];
}

/**
 * One Review node per tool, all nested under the article. Google requires the
 * reviewed item, the rating and an author on every Review.
 */
export const reviewSchemas = (input: ReviewInput) =>
  input.items.map((item, index) => ({
    '@type': 'Review',
    '@id': `${abs(input.path)}#review-${index + 1}`,
    name: `${item.name} review`,
    url: abs(input.path),
    datePublished: input.pubDate.toISOString(),
    author: { '@type': 'Organization', name: SITE.name },
    publisher: { '@id': `${SITE_URL}/#organization` },
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: item.name,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Web, Linux, macOS, Windows',
      ...(item.url ? { url: item.url } : {}),
      ...(item.vendor
        ? { author: { '@type': 'Organization', name: item.vendor } }
        : {}),
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: item.rating,
      bestRating: 5,
      worstRating: 0,
    },
  }));

export const breadcrumbSchema = (items: { label: string; href?: string }[]) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    ...(item.href ? { item: abs(item.href) } : {}),
  })),
});

export const collectionPageSchema = (input: {
  title: string;
  description: string;
  path: string;
  items: { title: string; path: string }[];
}) => ({
  '@type': 'CollectionPage',
  '@id': `${abs(input.path)}#collection`,
  name: input.title,
  description: input.description,
  url: abs(input.path),
  isPartOf: { '@id': `${SITE_URL}/#website` },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: input.items.length,
    itemListElement: input.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: abs(item.path),
    })),
  },
});

/** Wraps any set of nodes into a single @graph document. */
export const graph = (...nodes: Record<string, unknown>[]) => ({
  '@context': 'https://schema.org',
  '@graph': nodes,
});
