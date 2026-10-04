// Content for the experience, education and publications sections.
//
// A description separates an optional one-line header from its detail
// bullets with blank lines: '\n header \n\n bullet one \n\n bullet two'.
// One that opens with '\n\n' has no header; one with no '\n\n' at all is a
// single line with nothing to expand.

export const education = [
  {
    period: 'august 2023 – december 2026',
    title: 'university of illinois at urbana-champaign',
    description: '\n b.s. in statistics & computer science \n\n gpa: 3.86 \n\n activities: technology director @ national organization of business and engineering (nobe), technical lead @ illinois business consulting (ibc), content team @ reflections|projections 2025 \n\n courses: object oriented programming, data structures, algorithms, computer systems, database systems, distributed systems, high frequency trading technology, statistical modeling, statistical learning, applied machine learning',
  },
];

export const publications = [
  {
    period: 'february 2026',
    title: 'ripel: a data-augmented peer evaluation system for assessing teamwork',
    description: 'sigcse ts 2026',
    link: 'https://dl.acm.org/doi/10.1145/3770761.3777297',
    linkLabel: 'read more',
  },
];

export const experience = [
  {
    period: 'august 2026 – present',
    title: 'founding engineer @ vinskal',
    description: '\n\n architected the continuous job-discovery pipeline behind 130k+ live job postings using postgresql lease claims and per-host rate pacing; diagnosed a 50-hour, 49k+ row silent stall and redesigned the queue for durable recovery \n\n built an agentic incident responder (cloudflare workers, github actions) and its production alert-routing middleware, autonomously investigating downtime, quota, and runtime failures and opening prs for human review (1k+ alerts handled) \n\n built a playwright-based browser job application agent supporting five ats platforms and validated on live employer submissions; developed an evaluation harness measuring reliability, model quality, and per-run cost',
    technologies: ['python', 'typescript', 'fastapi', 'postgresql', 'playwright', 'docker', 'cloudflare workers', 'github actions'],
    link: 'https://vinskal.com',
    linkLabel: 'learn more',
  },
  {
    period: 'may 2026 – august 2026',
    title: 'software engineer intern @ pinterest',
    description: '\n application security \n\n built a multi-agent ai system (typescript, langgraph) that autonomously searches pinterest\'s source code for security vulnerabilities, grounded in a retrieval (rag) layer over the company\'s own history of confirmed vulnerabilities\n\n engineered a second agentic harness that dynamically validates suspected vulnerabilities by driving a chrome browser, logging into real accounts, attempting to perform the claimed attack, and returning a reproduced/refuted verdict \n\n owned the platform end-to-end as the sole engineer building the infrastructure beneath both systems: a fleet-wide rate governor and a postgres-backed job queue that keep hours-long agent runs durable under a shared llm token budget',
    technologies: ['typescript', 'python', 'postgresql', 'prisma', 'langgraph', 'deepagents', 'rag', 'llms', 'docker', 'rest apis', 'git'],
  },
  {
    period: 'february 2026 – april 2026',
    title: 'software development engineer intern @ amazon',
    description: '\n sequencing and voice recommendations for amazon music \n\n designed and deployed multilingual personalization features for amazon music\'s voice recommendation system (≈23m+ daily requests), integrating user listening behavior into an ml ranking pipeline and achieving 96%+ feature coverage \n\n owned end-to-end system design and development of a language-aware candidate filtering system in java, reducing irrelevant cross-language recommendations and improving music recommendation quality across 17m+ daily voice requests \n\n engineered 5 large-scale pyspark data pipelines (aws glue) to analyze 100m+ recommendation events, uncovering feature coverage gaps and critical quality issues that directly informed ranking model inputs and system design decisions',
    technologies: ['java', 'pyspark', 'aws (glue)', 'reinforcement learning (rl)', 'a/b testing', 'distributed systems'],
  },
  {
    period: 'january 2024 – december 2025',
    title: 'research assistant @ uiuc',
    description: '\n human-computer interaction, professor brian p. bailey \n\n engineered a scalable data pipeline in python to process and analyze teamwork behaviors across 100+ github repositories \n\n architected a cloud-native backend on gcp and firebase, ensuring efficient data management for over 120 concurrent users \n\n developed and deployed a responsive dashboard using next.js and fastapi with real-time data tracking capabilities',
    technologies: ['python', 'numpy', 'pandas', 'sci-kit learn', 'next.js', 'fastapi', 'gcp', 'firebase', 'restful apis'],
  },
  {
    period: 'may 2025 – august 2025',
    title: 'software engineer intern @ relativity',
    description: '\n processing arm & infrastructure \n\n owned the end-to-end development of internal api extensions and automated github actions ci/cd workflows, reducing direct client data access during incident resolution by 20%+ and improving resolution speed \n\n designed and engineered fault-tolerant .net (c#) migration jobs to transition over 1tb of data from legacy sql systems to a distributed, azure-hosted nosql architecture, enhancing horizontal scalability and reducing storage costs',
    technologies: ['c#', '.net', 'azure kubernetes service (aks)', 'mysql', 'docker', 'restful apis', 'github actions'],
  },
  {
    period: 'june 2024 – july 2024',
    title: 'software engineer intern @ am best',
    description: '\n web development \n\n developed a production .net api in c# to serve financial records and credit ratings for over 300 insurance clients \n\n identified and resolved performance bottlenecks, implementing caching strategies that reduced query response times by 25%',
    technologies: ['c#', 'mysql', 'blazor', 'asp.net', 'azure services', 'restful apis', 'ci/cd'],
  }
];

export const sections = [
  { id: 'experience', heading: 'experience', items: experience },
  { id: 'education', heading: 'education', items: education },
  // Publications link straight to the paper rather than expanding.
  { id: 'publications', heading: 'publications', items: publications, kind: 'link' },
];

export function splitDescription(description) {
  if (!description.includes('\n\n')) {
    return { header: description.trim(), details: [] };
  }
  const [header, ...details] = description.split('\n\n').map((part) => part.trim());
  return { header, details };
}
