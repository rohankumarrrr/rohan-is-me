import React, { useEffect } from "react";
import { motion } from "framer-motion";
import "./styles/Skills.css"; // Ensure this CSS file matches your site styling
import { Icon } from '@iconify-icon/react';

const skills = [
  { name: "JavaScript", icon: "logos:javascript", profiency: 10 },
  { name: "HTML/CSS", icon: "vscode-icons:file-type-html", profiency: 10 },
  { name: "React.js", icon: "logos:react", profiency: 10 },
  { name: "Next.js", icon: "logos:nextjs-icon", profiency: 8 },
  { name: "Node.js", icon: "logos:nodejs-icon", profiency: 10 },
  { name: "C++", icon: "logos:c-plusplus", profiency: 8 },
  { name: "Python", icon: "logos:python", profiency: 10 },
  { name: "Flask", icon: "logos:flask", profiency: 7 },
  { name: "Postman", icon: "logos:postman-icon", profiency: 6 },
  { name: "Pandas", icon: "logos:pandas-icon", profiency: 9 },
  { name: "PyTorch", icon: "logos:pytorch-icon", profiency: 5 },
  { name: "TensorFlow", icon: "logos:tensorflow", profiency: 5 },
  { name: "MySQL", icon: "logos:mysql", profiency: 5 },
  { name: "Java", icon: "logos:java", profiency: 7 },
  { name: "Firebase", icon: "logos:google-cloud", profiency: 8 },
  { name: "Git", icon: "logos:git-icon", profiency: 10 },
  { name: "Docker", icon: "logos:docker-icon", profiency: 6},
  { name: ".NET Core", icon: "logos:dotnet", profiency: 7 },
  { name: "Azure DevOps", icon: "logos:azure-icon", profiency: 6 },
  { name: "Shopify", icon: "logos:shopify", profiency: 5 },
];

const Skills = () => {
  const SkillBar = ({ skill, index }) => {
    return (
      <motion.div className="skill-bar" whileHover={{scale: 1.05}}>
        <Icon icon={skill.icon} className="skills-progress-icon" />
        <span className="skill-name">{skill.name}</span>
        <div className="bar-container" id={`${skill.name}-bar-container`}>
          <motion.div
            id={`${skill.name}-bar`}
            className="bar-fill"
            initial={{ width: 0 }}
            whileInView={{ width: `${skill.profiency * 10}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.2 + 1 }}
          ></motion.div>
        </div>
        <span className="proficiency">{skill.profiency}</span>
      </motion.div>
    );
  };

  return (
    <motion.section className="skills-container">
      <motion.h2 className="section-title" style={{color: "#6b7280"}} initial={{opacity: 0, y: 150}} viewport={{once: true}} whileInView={{opacity: 1, y: 0}} transition={{duration: 1, type: "spring", bounce: 0.3}}>/ skills & proficiency /</motion.h2>
      <motion.div className="skills-section">
        {skills.map((skill, index) => (
          <SkillBar key={index} skill={skill} index={index} />
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Skills;