export interface BlogPost {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  excerpt: string;
  date: string;
  readTime: string;
  keywords: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-ai-phone-answering-services-work-for-small-businesses',
    title: 'How AI Phone Answering Services Work for Small Businesses',
    metaTitle: 'How AI Phone Answering Services Work for Small Businesses',
    description:
      'Learn how AI phone answering services help small businesses handle calls 24/7, book appointments, and never miss a lead. Discover how HelloML works in 3 simple steps.',
    excerpt:
      'AI phone answering services are transforming how small businesses handle incoming calls. Learn what they do, how they differ from voicemail, and how to get started.',
    date: '2026-03-06',
    readTime: '7 min read',
    keywords: ['ai phone answering service', 'ai answering service small business'],
  },
  {
    slug: 'ai-receptionist-vs-virtual-receptionist',
    title: 'AI Receptionist vs Virtual Receptionist: Which Is Better for Your Business?',
    metaTitle: 'AI Receptionist vs Virtual Receptionist: Which Is Better?',
    description:
      'Compare AI receptionists ($29/mo) with human virtual receptionists ($200-800/mo). See pros, cons, and which option fits your small business best.',
    excerpt:
      'Human virtual receptionists cost $200 to $800 per month. AI receptionists start at $29. But cost is not the only factor. Here is how they compare.',
    date: '2026-03-05',
    readTime: '6 min read',
    keywords: ['ai receptionist vs virtual receptionist', 'ai receptionist for small business'],
  },
  {
    slug: 'never-miss-a-call-why-callers-wont-leave-voicemail',
    title: 'Never Miss a Call Again: Why 80% of Callers Won\'t Leave a Voicemail',
    metaTitle: 'Never Miss a Call Again: Why 80% of Callers Won\'t Leave a Voicemail',
    description:
      'Did you know 80% of callers hang up instead of leaving a voicemail? Learn how missed business calls cost you revenue and how to fix it with AI phone answering.',
    excerpt:
      'Most callers hang up when they reach voicemail. That means missed revenue and lost customers. Here is what the data says and how to solve it.',
    date: '2026-03-04',
    readTime: '5 min read',
    keywords: ['missed business calls', 'callers won\'t leave voicemail'],
  },
  {
    slug: 'best-ai-phone-systems-for-contractors-and-home-services',
    title: 'The Best AI Phone Systems for Contractors and Home Services',
    metaTitle: 'Best AI Phone Systems for Contractors and Home Services',
    description:
      'Contractors miss calls because they are on job sites. Discover how AI phone systems help plumbers, electricians, HVAC techs, and landscapers capture every lead.',
    excerpt:
      'Plumbers, electricians, and HVAC techs miss calls all day because they are on the job. AI phone systems solve this problem without hiring office staff.',
    date: '2026-03-03',
    readTime: '6 min read',
    keywords: ['ai phone system for contractors', 'contractor phone answering'],
  },
  {
    slug: 'how-to-set-up-ai-receptionist-in-under-5-minutes',
    title: 'How to Set Up an AI Receptionist in Under 5 Minutes',
    metaTitle: 'How to Set Up an AI Receptionist in Under 5 Minutes',
    description:
      'A step-by-step guide to setting up your AI receptionist with HelloML. Go from signup to live AI phone answering in less than 5 minutes.',
    excerpt:
      'Setting up an AI receptionist does not have to be complicated. This step-by-step guide walks you through getting HelloML running in under 5 minutes.',
    date: '2026-03-02',
    readTime: '5 min read',
    keywords: ['setup ai receptionist', 'ai receptionist setup guide'],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
