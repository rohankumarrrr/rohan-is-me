// TimelineSection.js
import React, { useState, useRef } from 'react';
import './styles/Experiences.css';
import { motion, AnimatePresence, useInView } from "framer-motion";

const education = [
  {
    period: 'august 2023 – december 2026',
    title: 'university of illinois at urbana-champaign',
    description: '\n b.s. in statistics & computer science \n\n gpa: 3.86 \n\n activites: technology director @ national organization of business and engineering (nobe), technical lead @ illinois business consulting (ibc), content team @ reflections|projections 2025 \n\n courses: object oriented programming, data structures, algorithms, database systems, distributed systems, computer security, high frequency trading technology, algorithmic market microstructure, statistical modeling, statistical learning, machine learning, machine learning systems',
  },
  {
    period: 'september 2019 – june 2023',
    title: 'randolph high school',
    description: '\n gpa: 4.87',
  },
];

const experience = [
  {
    period: 'may 2026 – august 2026',
    title: 'software engineer intern @ pinterest',
    description: '\n (summer 2026) product security'
  },
  {
    period: 'february 2026 – april 2026',
    title: 'software development engineer intern @ amazon',
    description: '\n sequencing and voice recommendations for amazon music \n\n designed and deployed multilingual personalization features for amazon music’s voice recommendation system (≈23m+ daily requests), integrating user listening behavior into an ml ranking pipeline and achieving 96%+ feature coverage \n\n owned end-to-end system design and development of a language-aware candidate filtering system in Java, reducing irrelevant cross-language recommendations and improving music recommendation quality across 17m+ daily voice requests \n\n engineered 5 large-scale pyspark data pipelines (aws glue) to analyze 100m+ recommendation events, uncovering feature coverage gaps and critical quality issues that directly informed ranking model inputs and system design decisions. \n\n technologies: java, pyspark, aws (glue), reinforcement learning (rl), a/b testing, distributed systems',
  },
  {
    period: 'january 2024 – december 2025',
    title: 'research assistant @ uiuc',
    description: '\n human-computer interaction, professor brian p. bailey \n\n engineered a scalable data pipeline in python to process and analyze teamwork behaviors across 100+ github repositories \n\n architected a cloud-native backend on gcp and firebase, ensuring efficient data management for over 120 concurrent users \n\n developed and deployed a responsive dashboard using next.js and fastapi with real-time data tracking capabilities \n\n technologies: python, numpy, pandas, sci-kit learn, next.js, fastapi, gcp, firebase, restful apis',
  },
  {
    period: 'may 2025 – august 2025',
    title: 'software engineer intern @ relativity',
    description: '\n processing arm & infrastructure \n\n owned the end-to-end development of internal api extensions and automated github actions ci/cd workflows, reducing direct client data access during incident resolution and improving resolution speed \n\n designed and engineered fault-tolerant .net (c#) migration jobs to transition over 1tb of data from legacy sql systems to a distributed, azure-hosted nosql architecture, enhancing horizontal scalability and reducing storage costs \n\n technologies: c#, .net, azure kubernetes service (aks), mysql, docker, restful apis, gitHub actions',
  },
  {
    period: 'june 2024 – july 2024',
    title: 'software engineer intern @ am best',
    description: '\n web development \n\n developed a production .net api in c# to serve financial records and credit ratings for over 300 insurance clients \n\n identified and resolved performance bottlenecks, implementing caching strategies that reduced query response times by 25% \n\n technologies: c#, mysql, blazor, asp.net, azure services, restful apis, ci/cd',
  }
];

function TimelineItem({ period, title, description, type = 'experience', variants }) {
  const [isHovered, setIsHovered] = useState(false);
  const contentRef = useRef(null);

  const hasDetailsToExpand = description.includes('\n\n');

  if (!hasDetailsToExpand) {
    return (
      <motion.div className="timeline-item" variants={variants}>
        <div className="timeline-dot" />
        <motion.div 
          className="timeline-content"
          whileHover={{ scale: 1.03 }}
        >
          <span className="timeline-period">{period}</span>
          <h3 className="timeline-title">{title}</h3>
          <p className="timeline-description" style={{ whiteSpace: "pre-line", margin: 0 }}>
            {description.trim()}
          </p>
        </motion.div>
      </motion.div>
    );
  }

  const descriptionParts = description.trim().split('\n\n');
  const teamHeader = descriptionParts[0];
  const details = descriptionParts.slice(1);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setTimeout(() => {
      if (contentRef.current) {
        const element = contentRef.current;
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        if (rect.bottom > viewportHeight) {
          const scrollByAmount = rect.bottom - viewportHeight + 20;
          
          window.scrollBy({ top: scrollByAmount, behavior: 'smooth' });
        }
      }
    }, 400);
  };

  return (
    <motion.div className="timeline-item" variants={variants}>
      <div className="timeline-dot" />
      <motion.div 
        ref={contentRef}
        className="timeline-content"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        layout
        transition={{ layout: { duration: 0.3, type: "spring", bounce: 0.4 } }}
      >
        <span className="timeline-period">{period}</span>
        <h3 className="timeline-title">{title}</h3>
        <p className="timeline-description" style={{whiteSpace: "pre-line", margin: 0 }}>
          {teamHeader}
        </p>
        <AnimatePresence>
          {isHovered && details.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3, delay: 0.1 } }}
              exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
              style={{ overflow: 'hidden' }}
            >
              <p className="timeline-description" style={{whiteSpace: "pre-line", paddingTop: '1rem'}}>
                {details.join('\n\n')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default function Experiences() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger the animation of children by 0.2s
      },
    },
  };

  const itemVariantsLeft = {
    hidden: { opacity: 0, x: -100 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 50 } },
  };

  const itemVariantsRight = {
    hidden: { opacity: 0, x: 100 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 50 } },
  };

  // Variants for the timeline line itself to "draw" from top to bottom
  const lineVariants = {
    hidden: { scaleY: 0 },
    show: { 
      scaleY: 1, 
      transition: { 
        duration: 1, 
        ease: "easeIn",
        delay: 0.4 // Delay to start after the last item has animated in
      } 
    },
  };

  return (
    <section className="timeline-section" ref={ref}>
      <div className="timeline-column">
        <h2 className="timeline-heading">education</h2>
        <motion.div 
          className="timeline-line"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          <motion.div 
            className="timeline-line-visual"
            variants={lineVariants}
          />
          {education.map((item, i) => (
            <TimelineItem key={i} {...item} type="education" variants={itemVariantsLeft}/>
          ))}
        </motion.div>
      </div>
      <div className="timeline-column">
        <h2 className="timeline-heading">experience</h2>
        <motion.div 
          className="timeline-line"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          <motion.div 
            className="timeline-line-visual"
            variants={lineVariants}
          />
          {experience.map((item, i) => (
            <TimelineItem key={i} {...item} type="experience" variants={itemVariantsRight}/>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
