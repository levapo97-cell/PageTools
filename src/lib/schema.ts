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

interface GuideInput extends ArticleInput {
  toolName: string;
  /** Ordered section titles, so search engines see the curriculum. */
  steps?: { name: string; url: string }[];
}

/**
 * Guide sections are TechArticle, not Article — it is the type Google uses for
 * developer documentation and it carries `proficiencyLevel` and `dependencies`.
 */
export const techArticleSchema = (input: GuideInput & { difficulty?: string }) => ({
  ...articleSchema(input),
  '@type': 'TechArticle',
  proficiencyLevel: input.difficulty ?? 'Beginner',
  about: {
    '@type': 'SoftwareApplication',
    name: input.toolName,
    applicationCategory: 'DeveloperApplication',
  },
});

/** Used on the tool overview page: the curriculum as an ordered HowTo. */
export const howToSchema = (input: {
  title: string;
  description: string;
  path: string;
  totalTime: number;
  steps: { name: string; text: string; url: string }[];
}) => ({
  '@type': 'HowTo',
  '@id': `${abs(input.path)}#howto`,
  name: input.title,
  description: input.description,
  totalTime: `PT${input.totalTime}M`,
  step: input.steps.map((step, index) => ({
    '@type': 'HowToStep',
    position: index + 1,
    name: step.name,
    text: step.text,
    url: abs(step.url),
  })),
});

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
