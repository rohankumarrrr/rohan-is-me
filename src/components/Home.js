import React, { useState } from "react";
import { motion } from "framer-motion";
import "./styles/Home.css";
import LastListened from "./Scrobbler";
import { Icon } from "@iconify-icon/react";
import sprayArrow from '../assets/images/spray-arrow.png';

const Home = () => {
  
  const [showExperience, setShowExperience] = useState(false);

  const uiucContainerHeightCollapsed = "20vh";
  const uiucContainerHeightExpanded = "35vh";
  const [uiucContainerHeight, setUiucContainerHeight] = useState(uiucContainerHeightCollapsed);

  const experience1ContainerHeightCollapsed = "18vh";
  const experience1ContainerHeightExpanded = "68vh";
  const [experience1ContainerHeight, setExperience1ContainerHeight] = useState(experience1ContainerHeightCollapsed);

  const experience2ContainerHeightCollapsed = "13vh";
  const experience2ContainerHeightExpanded = "58vh";
  const [experience2ContainerHeight, setExperience2ContainerHeight] = useState(experience2ContainerHeightCollapsed);

  const experience3ContainerHeightCollapsed = "13vh";
  const experience3ContainerHeightExpanded = "51vh";
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
            <motion.h1  initial = {{ opacity: 0, y: 100 }} animate = {{ opacity: 1, y: 0 }} transition = {{ duration: 1.5, ease: "backIn", type: "spring", bounce: 0.5}} style={{whiteSpace: "nowrap"}}>hey, it's Rohan</motion.h1>
            </div>
            <motion.p  initial = {{ opacity: 0, y: 100 }} animate = {{ opacity: 1, y: 0 }} transition = {{ duration: 1.5, ease: "backIn", type: "spring", bounce: 0.5, delay: 0.25}}>
              i'm a sophomore at the university of illinois urbana-champaign. when i'm not thinking of what to eat next, producing music, or doomscrolling for my next favorite pair of jeans on depop, i'm a passionate software developer, data engineer, and computer scientist.
            </motion.p>
            <motion.div style={{marginTop: '2vh'}} initial = {{ opacity: 0, y: 100 }} animate = {{ opacity: 1, y: 0 }} transition = {{ duration: 1.5, ease: "backIn", type: "spring", bounce: 0.5, delay: 0.25}}>
                <LastListened />
            </motion.div>
            <motion.div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1vw'}}  initial = {{ opacity: 0, y: 100 }} animate = {{ opacity: 1, y: 0 }} transition = {{ duration: 1.5, ease: "backIn", type: "spring", bounce: 0.5, delay: 0.5}}>
                <motion.a className="cta-button" whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }} href="mailto:rohankumarrr313@gmail.com" target="_blank">connect with me</motion.a>
                <motion.a className="cta-button" whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }} href="/ROHAN_KUMAR_GENERAL.pdf" target="_blank" rel="noopener noreferrer">see my resume</motion.a>
            </motion.div>
          </motion.div>
          <motion.div className="image-container" initial={{opacity: 0, x: 500}} animate={{opacity: 1, x: 0}} transition={{duration: 2, ease: "circOut", type: "spring", bounce: 0.3}} whileHover={{scale: 0.8}}>

            <img src={require("../assets/images/profpic3.png")} alt="Rohan Kumar" draggable="false" className="banner-img" />
          </motion.div>
        </div>
    </div>
  );
};

export default Home;