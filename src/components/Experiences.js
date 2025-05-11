// TimelineSection.js
import React from 'react';
import './styles/Experiences.css';

const education = [
  {
    period: 'august 2023 - may 2025',
    title: 'university of illinois at urbana-champaign',
    description: '\n b.s. in statistics & computer science \n\n gpa: 3.97 \n\n activites: technology chair @ nobe, software developer @ ibc, content coordinator @ reflections|projections \n\n courses: data structures, algorithms, applied machine learning, database systems, programming languages & compilers, numerical methods, computer systems, statistical modeling, data science',
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
    title: 'software engineer intern',
    description: '\n relativity — working on the relativity processing platform team to build a data pipeline for data ingestion and analysis.',
  },
  {
    period: 'january 2024 – present',
    title: 'research assistant',
    description: '\n hci lab @ uiuc — building a full-stack peer evaluation platform using next.js and python.',
  },
  {
    period: 'june 2024 – july 2024',
    title: 'software engineer intern',
    description: '\n am best — developed a web application api for insurance analytics using c# and .net core.',
  },
  {
    period: 'november 2023 - january 2024',
    title: 'software engineer intern',
    description: '\n changing the present — developed a web application for non-profit organizations using liquid.js, flask, and supabase.',
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
    </section>
  );
}
