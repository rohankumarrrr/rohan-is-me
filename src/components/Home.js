import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import "./styles/Home.css";
import LastListened from "./Scrobbler";

const Home = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });

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
          <motion.p variants={itemVariants}>
            i'm a junior at the university of illinois urbana-champaign. when i'm not thinking of what to eat next, producing music, or doomscrolling for my next favorite pair of jeans on depop, i'm a passionate software engineer and computer scientist.
          </motion.p>
          <motion.div style={{ marginTop: '2vh' }} variants={itemVariants}>
            <LastListened />
          </motion.div>
          <motion.div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1vw' }} variants={itemVariants}>
            <motion.a className="cta-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="mailto:rohankumarrr313@gmail.com" target="_blank">connect with me</motion.a>
            <motion.a className="cta-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="/ROHAN_KUMAR.pdf" target="_blank" rel="noopener noreferrer">see my resume</motion.a>
          </motion.div>
        </div>
        <motion.div className="image-container" variants={imageVariants} whileHover={{ scale: 0.9, transition: { type: "spring", bounce: 0.5 } }}>
          <img src={require("../assets/images/banner-img.png")} alt="Rohan Kumar" draggable="false" className="banner-img" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;