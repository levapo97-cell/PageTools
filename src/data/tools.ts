/**
 * Catalogue of the tools we publish guides for.
 * The `slug` must match the folder name under src/content/guides/.
 */
export interface Tool {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  /** Version the guide was written and verified against. */
  version: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  /** Rough time to work through the whole guide, in minutes. */
  duration: number;
  officialUrl: string;
  docsUrl: string;
}

export const TOOLS: Tool[] = [
  {
    slug: 'docker',
    name: 'Docker',
    category: 'Containers',
    tagline: 'Package an application with everything it needs to run',
    description:
      'Learn Docker in the order that actually makes sense: the problem it solves, the four concepts everything else is built on, your first real Dockerfile, and the six mistakes every beginner makes.',
    version: '28.x',
    difficulty: 'Beginner',
    duration: 95,
    officialUrl: 'https://www.docker.com',
    docsUrl: 'https://docs.docker.com',
  },
  {
    slug: 'git',
    name: 'Git',
    category: 'Version Control',
    tagline: 'Track every change, and undo any of them',
    description:
      'A guide built around the one thing most Git tutorials skip: the object model. Understand what a commit actually is and the scary commands stop being scary.',
    version: '2.5x',
    difficulty: 'Beginner',
    duration: 110,
    officialUrl: 'https://git-scm.com',
    docsUrl: 'https://git-scm.com/doc',
  },
  {
    slug: 'terraform',
    name: 'Terraform',
    category: 'Infrastructure as Code',
    tagline: 'Describe your infrastructure, then let a plan tell you the truth',
    description:
      'From your first resource to a module structure that survives a second environment — including the state management decisions that are painful to change later.',
    version: '1.x',
    difficulty: 'Intermediate',
    duration: 120,
    officialUrl: 'https://www.terraform.io',
    docsUrl: 'https://developer.hashicorp.com/terraform/docs',
  },
  {
    slug: 'kubernetes',
    name: 'Kubernetes',
    category: 'Orchestration',
    tagline: 'Declare what should be running, and let the cluster keep it that way',
    description:
      'The reconciliation loop first, YAML second. Learn why a Deployment exists before you learn its fields, and Kubernetes stops feeling arbitrary.',
    version: '1.3x',
    difficulty: 'Advanced',
    duration: 150,
    officialUrl: 'https://kubernetes.io',
    docsUrl: 'https://kubernetes.io/docs/home/',
  },
];

export const toolBySlug = (slug: string): Tool | undefined =>
  TOOLS.find((tool) => tool.slug === slug);

export const TOOL_CATEGORIES = [...new Set(TOOLS.map((tool) => tool.category))].sort();
