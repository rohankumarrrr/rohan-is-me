import React, { useState, useRef } from 'react';
import './styles/Experiences.css';
import { motion, AnimatePresence, useInView } from "framer-motion";

const education = [
  {
    period: 'august 2023 – december 2026',
    title: 'university of illinois at urbana-champaign',
    description: '\n b.s. in statistics & computer science \n\n gpa: 3.86 \n\n activities: technology director @ national organization of business and engineering (nobe), technical lead @ illinois business consulting (ibc), content team @ reflections|projections 2025 \n\n courses: object oriented programming, data structures, algorithms, database systems, distributed systems, high frequency trading technology, algorithmic market microstructure, statistical modeling, statistical learning, machine learning systems',
  },
];

const publications = [
  {
    period: 'february 2026',
    title: 'ripel: a data-augmented peer evaluation system for assessing teamwork',
    description: 'sigcse ts 2026',
    link: 'https://dl.acm.org/doi/10.1145/3770761.3777297',
    linkLabel: 'read more',
  },
];

const experience = [
  {
    period: 'september 2026 – present',
    title: 'co-founder, engineering @ vinskal',
    description: 'building the single source of truth for job search.',
    link: 'https://vinskal.com',
    linkLabel: 'read more',
  },
  {
    period: 'may 2026 – august 2026',
    title: 'software engineer intern @ pinterest',
    description: '\n application security \n\n built a multi-agent ai system (typescript, langgraph) that autonomously searches pinterest\'s source code for security vulnerabilities, grounded in a retrieval (rag) layer over the company\'s own history of confirmed vulnerabilities\n\n engineered a second agentic harness that dynamically validates suspected vulnerabilities by driving a chrome browser, logging into real accounts, attempting to perform the claimed attack, and returning a reproduced/refuted verdict \n\n owned the platform end-to-end as the sole engineer building the infrastructure beneath both systems: a fleet-wide rate governor and a postgres-backed job queue that keep hours-long agent runs alive and durable under a shared llm token budget',
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
    description: '\n processing arm & infrastructure \n\n owned the end-to-end development of internal api extensions and automated github actions ci/cd workflows, reducing direct client data access during incident resolution and improving resolution speed \n\n designed and engineered fault-tolerant .net (c#) migration jobs to transition over 1tb of data from legacy sql systems to a distributed, azure-hosted nosql architecture, enhancing horizontal scalability and reducing storage costs',
    technologies: ['c#', '.net', 'azure kubernetes service (aks)', 'mysql', 'docker', 'restful apis', 'github actions'],
  },
  {
    period: 'june 2024 – july 2024',
    title: 'software engineer intern @ am best',
    description: '\n web development \n\n developed a production .net api in c# to serve financial records and credit ratings for over 300 insurance clients \n\n identified and resolved performance bottlenecks, implementing caching strategies that reduced query response times by 25%',
    technologies: ['c#', 'mysql', 'blazor', 'asp.net', 'azure services', 'restful apis', 'ci/cd'],
  }
];

function Entry({ period, title, description, technologies = [], link, linkLabel = 'view', variants }) {
  const [isHovered, setIsHovered] = useState(false);

  const hasDetailsToExpand = description.includes('\n\n');
  const trimmed = description.trim();

  const techLine = technologies.length > 0 && (
    <p className="entry-tech">{technologies.join(', ')}</p>
  );

  const linkLine = link && (
    <a href={link} target="_blank" rel="noopener noreferrer" className="entry-link">
      {linkLabel} <span aria-hidden="true">→</span>
    </a>
  );

  if (!hasDetailsToExpand) {
    return (
      <motion.div className="entry" variants={variants}>
        <div className="entry-header">
          <h3 className="entry-title">{title}</h3>
          <span className="entry-period">{period}</span>
        </div>
        {linkLine}
        {trimmed && (
          <p className="entry-description" style={{ whiteSpace: "pre-line" }}>
            {trimmed}
          </p>
        )}
        {techLine}
      </motion.div>
    );
  }

  const descriptionParts = trimmed.split('\n\n').map((part) => part.trim());
  const [teamHeader, ...details] = descriptionParts;

  return (
    <motion.div
      className="entry"
      variants={variants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      layout
      transition={{ layout: { duration: 0.3, type: "spring", bounce: 0.3 } }}
    >
      <div className="entry-header">
        <h3 className="entry-title">{title}</h3>
        <span className="entry-period">{period}</span>
      </div>
      {linkLine}
      <p className="entry-description">{teamHeader}</p>
      <AnimatePresence>
        {isHovered && details.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3, delay: 0.1 } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
            style={{ overflow: 'hidden' }}
          >
            <ul className="entry-details-list">
              {details.map((detail, i) => (
                <li key={i}>{detail}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      {techLine}
    </motion.div>
  );
}

function Section({ heading, items }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="entries-section" ref={ref}>
      <h2 className="section-heading">{heading}</h2>
      <motion.div
        className="entries-list"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {items.map((item, i) => (
          <Entry key={i} {...item} variants={itemVariants} />
        ))}
      </motion.div>
    </section>
  );
}

export default function Experiences() {
  return (
    <div className="experiences-container">
      <Section heading="experience" items={experience} />
      <Section heading="education" items={education} />
      <Section heading="publications" items={publications} />
    </div>
  );
}
