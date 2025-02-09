import React, { useState } from "react";
import { motion } from "framer-motion";
import "./styles/Home.css";
import LastListened from "./Scrobbler";
import { Icon } from "@iconify-icon/react";
import sprayArrow from '../assets/images/spray-arrow.png';

const Home = () => {
  
  const [showExperience, setShowExperience] = useState(false);

  const uiucContainerHeightCollapsed = "20vh";
  const uiucContainerHeightExpanded = "30vh";
  const [uiucContainerHeight, setUiucContainerHeight] = useState(uiucContainerHeightCollapsed);

  const experience1ContainerHeightCollapsed = "18vh";
  const experience1ContainerHeightExpanded = "63vh";
  const [experience1ContainerHeight, setExperience1ContainerHeight] = useState(experience1ContainerHeightCollapsed);

  const experience2ContainerHeightCollapsed = "13vh";
  const experience2ContainerHeightExpanded = "53vh";
  const [experience2ContainerHeight, setExperience2ContainerHeight] = useState(experience2ContainerHeightCollapsed);

  const experience3ContainerHeightCollapsed = "13vh";
  const experience3ContainerHeightExpanded = "46vh";
  const [experience3ContainerHeight, setExperience3ContainerHeight] = useState(experience3ContainerHeightCollapsed);

  const variantsUIUC = {
    show: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            duration: 1,
            bounce: 0.3,
            ease: "easeOut",
            delay: 1
        }
    },
    hide: {
        opacity: 0,
        x: -520,
        transition: {
            type: "spring",
            duration: 1,
            bounce: 0.3,
            ease: "easeOut",
            delay: 0.25
        }
    }
  };

  const variantsExperience1 = {
    show: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            duration: 1,
            bounce: 0.3,
            ease: "easeOut",
            delay: 1.25
        }
    },
    hide: {
        opacity: 0,
        x: 520,
        transition: {
            type: "spring",
            duration: 1,
            bounce: 0.3,
            ease: "easeOut",
            delay: 0.5
        }
    }
  };

  const variantsExperience2 = {
    show: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            duration: 1,
            bounce: 0.3,
            ease: "easeOut",
            delay: 1.5
        }
    },
    hide: {
        opacity: 0,
        x: -520,
        transition: {
            type: "spring",
            duration: 1,
            bounce: 0.3,
            ease: "easeOut",
            delay: 0.75
        }
    }
  };

  const variantsExperience3 = {
    show: {
        opacity: 1,
        x: 0,
        transition: {
            type: "spring",
            duration: 1,
            bounce: 0.3,
            ease: "easeOut",
            delay: 1.75
        }
    },
    hide: {
        opacity: 0,
        x: 520,
        transition: {
            type: "spring",
            duration: 1,
            bounce: 0.3,
            ease: "easeOut",
            delay: 1
        }
    }
  };

  return (
    <div className="container">
        <div className="content">
          <motion.div className="text-container">
            <div style={{flexDirection: 'row', verticalAlign: "bottom", display: "inline-flex"}}>
            <motion.h1  initial = {{ opacity: 0, y: 100 }} animate = {{ opacity: 1, y: 0 }} transition = {{ duration: 1.5, ease: "backIn", type: "spring", bounce: 0.5}} style={{whiteSpace: "nowrap"}}>hey, it's</motion.h1>
            <motion.h1  initial = {{ opacity: 0, y: 100 }} animate = {{ opacity: 1, y: 0 }} transition = {{ duration: 1.5, ease: "backIn", type: "spring", bounce: 0.5}} style={{fontFamily: "Digitag", marginLeft: '1.5vw', marginTop: '6.8vh'}}>Rohan</motion.h1>
            </div>
            <motion.p  initial = {{ opacity: 0, y: 100 }} animate = {{ opacity: 1, y: 0 }} transition = {{ duration: 1.5, ease: "backIn", type: "spring", bounce: 0.5, delay: 0.25}}>
              i'm a sophomore at the university of illinois urbana-champaign. when i'm not thinking of what to eat next, producing music, or doomscrolling for my next favorite pair of jeans on depop, i'm a passionate software engineer, web developer, and data scientist.
            </motion.p>
            <motion.div style={{marginTop: '2vh'}} initial = {{ opacity: 0, y: 100 }} animate = {{ opacity: 1, y: 0 }} transition = {{ duration: 1.5, ease: "backIn", type: "spring", bounce: 0.5, delay: 0.25}}>
                <LastListened />
            </motion.div>
            <motion.div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}  initial = {{ opacity: 0, y: 100 }} animate = {{ opacity: 1, y: 0 }} transition = {{ duration: 1.5, ease: "backIn", type: "spring", bounce: 0.5, delay: 0.5}}>
                <motion.a className="cta-button" whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }} href="mailto:rohankumarrr313@gmail.com" target="_blank">connect with me</motion.a>
            </motion.div>
          </motion.div>
          <motion.div className="image-container" initial={{opacity: 0, x: 500}} animate={{opacity: 1, x: 0}} transition={{duration: 2, ease: "circOut", type: "spring", bounce: 0.3, delay: 0.5}} whileHover={{scale: 0.8}} onHoverStart={() => setShowExperience(true)} onHoverEnd={() => setShowExperience(false)}>
            {/* {<div className="background-shape"></div>} */}
            <motion.div className="click-me-div" style={{opacity: showExperience ? 0 : 1}}>
                <h1 className="click-me-h1">
                see my experience
                </h1>
                <img className="click-me-arrow" src={sprayArrow}></img>
            </motion.div>
            <motion.div className="uiuc-container" key="animation-on-state" initial={false} variants={variantsUIUC} animate={showExperience ? 'show' : 'hide'} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={() => uiucContainerHeight == uiucContainerHeightExpanded ? setUiucContainerHeight(uiucContainerHeightCollapsed) : setUiucContainerHeight(uiucContainerHeightExpanded)} style={{height: uiucContainerHeight, transition: "height 0.5s ease-out"}}>
                <p className="experience-p" style={{fontFamily: "Graffiti", fontSize: "2.75vh"}}>University of Illinois Urbana-Champaign</p>
                <p className="experience-p">August 2023 - May 2026</p>
                <p className="experience-p">Major: Statistics & Computer Science</p>
                <div style={{display: "flex", flexDirection: "row", margin: 0, width: "100%", alignItems: "flex-start"}}>
                    <p className="experience-p" style={{margin: 0, paddingRight: "0.5vw"}}>GPA: 3.97/4.0</p>
                    <Icon icon={"ic:baseline-play-arrow"} className="dropdown-arrow" style={{transform: uiucContainerHeight == uiucContainerHeightExpanded ? "rotate(90deg)" : "none"}}/>
                </div>
                {uiucContainerHeight == uiucContainerHeightExpanded && <p className="experience-p">Courses: Data Structures, Algorithms, Computer Systems, Numerical Methods, & Statistical Modeling</p>}
            </motion.div>
            <motion.div className="uiuc-line-horizontal" key="animation-on-state" initial={false} variants={variantsUIUC} animate={showExperience ? 'show' : 'hide'}/>
            <motion.div className="uiuc-line-vertical" key="animation-on-state" initial={false} variants={variantsUIUC} animate={showExperience ? 'show' : 'hide'}/>
            <motion.div className="uiuc-circle" key="animation-on-state" initial={false} variants={variantsUIUC} animate={showExperience ? 'show' : 'hide'}/>

            <motion.div className="experience1-container" key="animation-on-state" initial={false} variants={variantsExperience1} animate={showExperience ? 'show' : 'hide'} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={() => experience1ContainerHeight == experience1ContainerHeightExpanded ? setExperience1ContainerHeight(experience1ContainerHeightCollapsed) : setExperience1ContainerHeight(experience1ContainerHeightExpanded)} style={{height: experience1ContainerHeight, transition: "height 0.5s ease-out"}}>
                <p className="experience-p" style={{fontFamily: "Graffiti", fontSize: "2.75vh"}}>Human-Computer Interaction Lab</p>
                <p className="experience-p">Software Engineering Research Assistant</p>
                <div style={{display: "flex", flexDirection: "row", margin: 0, width: "100%", alignItems: "flex-start"}}>
                    <p className="experience-p" style={{margin: 0, paddingRight: "0.5vw"}}>January 2024 - Present</p>
                    <Icon icon={"ic:baseline-play-arrow"} className="dropdown-arrow" style={{transform: experience1ContainerHeight == experience1ContainerHeightExpanded ? "rotate(90deg)" : "none"}}/>
                </div>
                {experience1ContainerHeight == experience1ContainerHeightExpanded && <p className="experience-p">Contributed to the DATA Peer Tool to evaluate the utility of data from GitHub, Slack, Google Docs to determine value of contributions by team members in CS 465, a project-based UIUC course.</p>}
                {experience1ContainerHeight == experience1ContainerHeightExpanded && <p className="experience-p">Developed configurable dashboard web application using Qualtrics and Next.js to generate intelligent feedback on students’ teamwork behaviors, perform data-augmented peer evaluations, and enable assessment of teamwork processes.</p>}
                {experience1ContainerHeight == experience1ContainerHeightExpanded && <p className="experience-p">Generated data visualizations using Python, Streamlit, and GitHub REST API to determine generate actionable insights on how pull requests, commits, diff files, etc. can be used to determine contribution impact of a team member.</p>}
            </motion.div>
            <motion.div className="experience1-line-horizontal" key="animation-on-state" initial={false} variants={variantsExperience1} animate={showExperience ? 'show' : 'hide'}/>
            <motion.div className="experience1-line-vertical" key="animation-on-state" initial={false} variants={variantsExperience1} animate={showExperience ? 'show' : 'hide'}/>
            <motion.div className="experience1-circle" key="animation-on-state" initial={false} variants={variantsExperience1} animate={showExperience ? 'show' : 'hide'}/>

            <motion.div className="experience2-container" key="animation-on-state" initial={false} variants={variantsExperience2} animate={showExperience ? 'show' : 'hide'} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={() => experience2ContainerHeight == experience2ContainerHeightExpanded ? setExperience2ContainerHeight(experience2ContainerHeightCollapsed) : setExperience2ContainerHeight(experience2ContainerHeightExpanded)} style={{height: experience2ContainerHeight, transition: "height 0.5s ease-out"}}>
                <p className="experience-p" style={{fontFamily: "Graffiti", fontSize: "2.75vh"}}>AM Best</p>
                <p className="experience-p">Software Developer Intern</p>
                <div style={{display: "flex", flexDirection: "row", margin: 0, width: "100%", alignItems: "flex-start"}}>
                    <p className="experience-p" style={{margin: 0, paddingRight: "0.5vw"}}>June 2024 - July 2024</p>
                    <Icon icon={"ic:baseline-play-arrow"} className="dropdown-arrow" style={{transform: experience2ContainerHeight == experience2ContainerHeightExpanded ? "rotate(90deg)" : "none"}}/>
                </div>
                {experience2ContainerHeight == experience2ContainerHeightExpanded && <p className="experience-p">Successfully designed and launched the Company Logo API for AM Best Rating Services using ASP.NET, C# and Azure DevOps, resulting in client logos being displayed on AMBest mobile app, public profile webpage, credit ratings, and financial reports.</p>}
                {experience2ContainerHeight == experience2ContainerHeightExpanded && <p className="experience-p">Conducted unit and 30vhmated testing using MSTest and Azure Pipeline to ensure proper API functionality and
ensured code security using Veracode.</p>}
                {experience2ContainerHeight == experience2ContainerHeightExpanded && <p className="experience-p">Led technical team meetings, providing insights and feedback on project progress and potential improvements to
business executives.</p>}
            </motion.div>
            <motion.div className="experience2-line-horizontal" key="animation-on-state" initial={false} variants={variantsExperience2} animate={showExperience ? 'show' : 'hide'}/>
            <motion.div className="experience2-line-vertical" key="animation-on-state" initial={false} variants={variantsExperience2} animate={showExperience ? 'show' : 'hide'}/>
            <motion.div className="experience2-circle" key="animation-on-state" initial={false} variants={variantsExperience2} animate={showExperience ? 'show' : 'hide'}/>

            <motion.div className="experience3-container" key="animation-on-state" initial={false} variants={variantsExperience3} animate={showExperience ? 'show' : 'hide'} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} onClick={() => experience3ContainerHeight == experience3ContainerHeightExpanded ? setExperience3ContainerHeight(experience3ContainerHeightCollapsed) : setExperience3ContainerHeight(experience3ContainerHeightExpanded)} style={{height: experience3ContainerHeight, transition: "height 0.5s ease-out"}}>
                <p className="experience-p" style={{fontFamily: "Graffiti", fontSize: "2.75vh"}}>Changing the Present</p>
                <p className="experience-p">Front-End Developer Intern</p>
                <div style={{display: "flex", flexDirection: "row", margin: 0, width: "100%", alignItems: "flex-start"}}>
                    <p className="experience-p" style={{margin: 0, paddingRight: "0.5vw"}}>November 2023 - January 2024</p>
                    <Icon icon={"ic:baseline-play-arrow"} className="dropdown-arrow" style={{transform: experience3ContainerHeight == experience3ContainerHeightExpanded ? "rotate(90deg)" : "none"}}/>
                </div>
                {experience3ContainerHeight == experience3ContainerHeightExpanded && <p className="experience-p">Designed and implemented responsive user interfaces with Liquid, leading to full overhaul of Shopify product page.</p>}
                {experience3ContainerHeight == experience3ContainerHeightExpanded && <p className="experience-p">Led communication between front-end and back-end developer teams to streamline communication between API and front-end webpage.</p>}
                {experience3ContainerHeight == experience3ContainerHeightExpanded && <p className="experience-p">Contributed to the adoption of agile methodologies using Git, improving team productivity by 15% through iterative development cycles.</p>}
            </motion.div>
            <motion.div className="experience3-line-horizontal" key="animation-on-state" initial={false} variants={variantsExperience3} animate={showExperience ? 'show' : 'hide'}/>
            <motion.div className="experience3-line-vertical" key="animation-on-state" initial={false} variants={variantsExperience3} animate={showExperience ? 'show' : 'hide'}/>
            <motion.div className="experience3-circle" key="animation-on-state" initial={false} variants={variantsExperience3} animate={showExperience ? 'show' : 'hide'}/>

            <img src={require("../assets/images/banner-img-final3.png")} alt="Rohan Kumar" draggable="false" className="banner-img" />
          </motion.div>
        </div>
    </div>
  );
};

export default Home;