import React, { useRef } from "react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";
import "./styles/Home.css";
import LastListened from "./Scrobbler";
import { useTheme } from "../hooks/useTheme";
import { ReactComponent as GitHubIcon } from "../assets/images/github-logo.svg";
import { ReactComponent as LinkedInIcon } from "../assets/images/linkedin-logo.svg";
import { ReactComponent as EmailIcon } from "../assets/images/email-logo.svg";
import { ReactComponent as ResumeIcon } from "../assets/images/cv-logo.svg";

const lightHighRes = require("../assets/images/banner-img-light.webp");
const darkHighRes  = require("../assets/images/banner-img-dark.webp");

const Home = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  const { theme } = useTheme();

  // Seed rotation from initial theme so the correct face shows on first paint
  const initialRotation = theme === 'dark' ? 180 : 0;
  const rotateYValue = useMotionValue(initialRotation);
  const currentRotation = useRef(initialRotation);
  const prevTheme = useRef(theme);

  React.useEffect(() => {
    if (prevTheme.current !== theme) {
      prevTheme.current = theme;
      currentRotation.current += 180;
      animate(rotateYValue, currentRotation.current, {
        duration: 0.45,
        ease: 'easeInOut',
      });
    }
  }, [theme, rotateYValue]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "backIn", type: "spring", bounce: 0.5 },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: 500 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 2, ease: "circOut", type: "spring", bounce: 0.3 },
    },
  };

  return (
    <div className="container" ref={ref}>
      <motion.div
        className="content"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="text-container">
          <div
            style={{
              flexDirection: 'row',
              verticalAlign: "bottom",
              display: "inline-flex"
            }}
          >
            <motion.h1 variants={itemVariants} style={{ whiteSpace: "nowrap" }}>
              hey, it's Rohan
            </motion.h1>
          </div>
          <motion.p style={{ marginTop: '2vh' }} variants={itemVariants}>
            i'm a rising senior studying statistics & computer science at the <a className="inline-link" href="https://siebelschool.illinois.edu/" target="_blank" rel="noopener noreferrer">university of illinois urbana-champaign.</a>
          </motion.p>
          <motion.p style={{ marginTop: '2vh' }} variants={itemVariants}>
            i'm passionate about building software that solves interesting, challenging problems at scale. my work has spanned full-stack development, distributed systems, applied ai/ml, computer security, and human-computer interaction.
          </motion.p>
          <motion.p style={{ marginTop: '2vh' }} variants={itemVariants}>
            i'm currently a software engineering intern at <a className="inline-link" href="https://medium.com/pinterest-engineering" target="_blank" rel="noopener noreferrer">pinterest</a>, building ai agents to proactively surface, investigate, and remediate security threats across pinterest's microservice ecosystem. prior to this, i was on <a className="inline-link" href="https://music.amazon.com/" target="_blank" rel="noopener noreferrer">amazon music</a>'s sequencing and alexa voice recommendations team, where i introduced language-affinity components into the music recommendation reinforcement learning pipeline, improving linguistic diveristy and recommendation accuracy for multilingual users.
          </motion.p>
          <motion.p style={{ marginTop: '2vh' }} variants={itemVariants}>
            when i'm not building, you can find me <a className="inline-link" href="https://open.spotify.com/artist/0dWCkDXiZhBI7l1LcE0BoV?si=yaev3hm-QPCRJjY37EUgVw" target="_blank" rel="noopener noreferrer">producing music</a>, doomscrolling for new jeans on <a className="inline-link" href="https://www.depop.com/rohankumarrr/" target="_blank" rel="noopener noreferrer">depop</a>, or enjoying the latest taco bell menu item.
          </motion.p>
          <motion.div style={{ marginTop: '2vh' }} variants={itemVariants}>
            <LastListened />
          </motion.div>
          <motion.div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.8vw' }} variants={itemVariants}>
            <motion.a href="/ROHAN_KUMAR.pdf" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <ResumeIcon className="social-icon" />
            </motion.a>
            <motion.a href="mailto:rohankumarrr313@gmail.com" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <EmailIcon className="social-icon" />
            </motion.a>
            <motion.a href="https://github.com/rohankumarrrr" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <GitHubIcon className="social-icon" />
            </motion.a>
            <motion.a href="https://linkedin.com/in/rohankumarrr313" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <LinkedInIcon className="social-icon" />
            </motion.a>
          </motion.div>
        </div>

        <motion.div
          className="image-container"
          variants={imageVariants}
          whileHover={{ scale: 0.9, transition: { type: "spring", bounce: 0.5 } }}
          style={{ perspective: 1200 }}
        >
          {/* Card — both faces always in DOM, GPU-decoded before first toggle */}
          <motion.div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              rotateY: rotateYValue,
              willChange: 'transform',
            }}
          >
            {/* Front face: light image */}
            <img
              src={lightHighRes}
              alt="Rohan Kumar"
              draggable="false"
              className="banner-img"
              decoding="async"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            />
            {/* Back face: dark image, pre-rotated so it faces the viewer at 180° */}
            <img
              src={darkHighRes}
              alt="Rohan Kumar"
              draggable="false"
              className="banner-img"
              decoding="async"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
