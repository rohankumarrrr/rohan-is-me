import React from "react";
import { motion, spring } from "framer-motion";
import "./styles/Projects.css";
import { Icon } from '@iconify-icon/react';
import SoundSwipeImg from '../assets/images/soundswipe-img-png.png';
import StreetBytesImg from '../assets/images/streebytes-promo-img.jpeg';

const projects = [
  { title: "SoundSwipe", description: "Swipe-based web application that allows users to discover new music each week and save songs to their library and playlists.", tech: ["React", "HTML", "CSS", "Spotify API"], img: SoundSwipeImg, uri: "https://github.com/rohankumarrrr/SoundSwipe" },
  { title: "StreetBytes", description: "Mobile app for iOS and Android that displays real-time locations, hours, and menus of active food trucks acros campus.", tech: ["React Native", "HTML", "CSS", "Google Maps API", "FireBase"], img: StreetBytesImg, uri: "https://github.com/rohankumarrrr/Food-Truck-App-Final" },
];

const container = {
  hidden: {  },
  show: {
      transition: {
          staggerChildren: 0.5,
          delayChildren: 0.8,
          duration: 1,
          type: "spring",
          bounce: 0.3,
      }
  }
}

const item = {
  hidden: { opacity: 0, y: 300 },
  show: { opacity: 1, y: 0, transition: { duration: 1, type: "spring", bounce: 0.3} }
}

const ProjectCard = ({ project, p_index }) => {
  return (
    <motion.a className="card-wrapper" whileHover={{scale: 1.02}} href={project.uri} target="_blank" variants={item}>

    <motion.div 
      className="project-card"
      whileHover={{boxShadow: '5px 5px #6b7280'}}
    >
        <motion.div className="project-content">
            <motion.div className="project-info">
                <h3 className="project-title">{project.title}</h3>
                <div className="tech-tags">
                        {project.tech.map((tech, index) => (
                        <span key={index} className="tech-tag">{tech}</span>
                        ))}
                </div>
                <p className="project-description">{project.description}</p>
            </motion.div>
            <div className="img-container">
                <img src={project.img} draggable={false} className="project-img" />
            </div>
        </motion.div>
    </motion.div>
    </motion.a>

  );
};

const Projects = () => {
  return (
    <motion.section className={"section-container"}>
      <motion.h2 className="section-title" initial={{opacity: 0, y: 150}} viewport={{once: true}} whileInView={{opacity: 1, y: 0}} transition={{duration: 1, type: "spring", bounce: 0.1}}>/ featured works /</motion.h2>
      <motion.h2 className="section-subheader"  initial={{opacity: 0, y: 150}} viewport={{once: true}} whileInView={{opacity: 1, y: 0}} transition={{duration: 1, type: "spring", bounce: 0.1, delay: 0.3}}>click on a project to view it on my GitHub</motion.h2>
      <motion.div className="projects-section" variants={container} initial="hidden" whileInView={"show"} viewport={{once: true}}>
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} p_index={index}/>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Projects;