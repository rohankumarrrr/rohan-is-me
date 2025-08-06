import React, { useState } from "react";
import { motion } from "framer-motion";
import "./styles/Home.css";
import LastListened from "./Scrobbler";

const Home = () => {

  return (
    <div className="container">
        <div className="content">
          <motion.div className="text-container">
            <div
              style = {
                {
                  flexDirection: 'row',
                  verticalAlign: "bottom",
                  display: "inline-flex"
                }
              }
            >
              <motion.h1
                initial = {{ opacity: 0, y: 100 }}
                animate = {{opacity: 1, y: 0}}
                transition = {{duration: 1.5, ease: "backIn", type: "spring", bounce: 0.5}}
                style={{whiteSpace: "nowrap"}}
              >
                hey, it's Rohan
              </motion.h1>
            </div>
            <motion.p  initial = {{ opacity: 0, y: 100 }} animate = {{ opacity: 1, y: 0 }} transition = {{ duration: 1.5, ease: "backIn", type: "spring", bounce: 0.5, delay: 0.25}}>
              i'm a junior at the university of illinois urbana-champaign. when i'm not thinking of what to eat next, producing music, or doomscrolling for my next favorite pair of jeans on depop, i'm a passionate software developer, data engineer, and computer scientist.
            </motion.p>
            <motion.div style={{marginTop: '2vh'}} initial = {{ opacity: 0, y: 100 }} animate = {{ opacity: 1, y: 0 }} transition = {{ duration: 1.5, ease: "backIn", type: "spring", bounce: 0.5, delay: 0.25}}>
                <LastListened />
            </motion.div>
            <motion.div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1vw'}}  initial = {{ opacity: 0, y: 100 }} animate = {{ opacity: 1, y: 0 }} transition = {{ duration: 1.5, ease: "backIn", type: "spring", bounce: 0.5, delay: 0.5}}>
                <motion.a className="cta-button" whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }} href="mailto:rohankumarrr313@gmail.com" target="_blank">connect with me</motion.a>
                <motion.a className="cta-button" whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }} href="/ROHAN_KUMAR.pdf" target="_blank" rel="noopener noreferrer">see my resume</motion.a>
            </motion.div>
          </motion.div>
          <motion.div className="image-container" initial={{opacity: 0, x: 500}} animate={{opacity: 1, x: 0}} transition={{duration: 2, ease: "circOut", type: "spring", bounce: 0.3}} whileHover={{scale: 0.8}}>
            <img src={require("../assets/images/banner-img.png")} alt="Rohan Kumar" draggable="false" className="banner-img" />
          </motion.div>
        </div>
    </div>
  );
};

export default Home;