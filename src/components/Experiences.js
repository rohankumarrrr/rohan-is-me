// TimelineSection.js
import React from 'react';
import './styles/Experiences.css';
import Contacts from './Contacts';
import { motion } from "framer-motion";

const education = [
  {
    period: 'august 2023 - may 2026',
    title: 'university of illinois at urbana-champaign',
    description: '\n b.s. in statistics & computer science \n\n gpa: 3.89 \n\n activites: technology chair @ nobe, software developer @ ibc, content coordinator @ reflections|projections \n\n courses: object oriented programming, data structures, algorithms, database systems, distributed systems, computer systems, numerical methods, probability \& statistics, statistical modeling, statistical learning, data science, linear algebra',
  },
  {
    period: 'september 2019 - june 2023',
    title: 'randolph high school',
    description: '\n gpa: 4.87, sat: 1560',
  },
];

const experience = [
  {
    period: 'may 2025 – present',
    title: 'software engineer intern \@ relativity',
    description: '\n processing arm \& infrastructure — backend infrastructure and automation tools to migrate terabytes of data from mysql to azure nosql, and reduce direct client database access by 20\% by extending api endpoints and developing automated github actions workflows.',
  },
  {
    period: 'january 2024 – present',
    title: 'research assistant \@ uiuc',
    description: '\n orchid research group — developed a real-time dashboard that tracks individual contribution metrics aggregated from gitHub, slack, google drive, and google docs to provide insight and feedback on teamwork behaviors in project-based cs courses.',
  },
  {
    period: 'june 2024 – july 2024',
    title: 'software engineer intern @ am best',
    description: '\n developed a web application api for insurance analytics using c# and .net core.',
  },
];

function TimelineItem({ period, title, description }) {
  return (
    <div className="timeline-item">
      <div className="timeline-dot" />
      <div className="timeline-content">
        <span className="timeline-period">{period}</span>
        <h3 className="timeline-title">{title}</h3>
        <p className="timeline-description" style={{whiteSpace: "pre-line"}}>{description}</p>
      </div>
    </div>
  );
}

export default function Experiences() {
  return (
    <section className="timeline-section">
      <div className="timeline-column">
        <h2 className="timeline-heading">education</h2>
        <div className="timeline-line">
          {education.map((item, i) => (
            <TimelineItem key={i} {...item} />
          ))}
        </div>
      </div>
      <div className="timeline-column">
        <h2 className="timeline-heading">experience</h2>
        <div className="timeline-line">
          {experience.map((item, i) => (
            <TimelineItem key={i} {...item} />
          ))}
        </div>
      </div>
      <div id="Contacts"><Contacts /></div>
    </section>
  );
}
