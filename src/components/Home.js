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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
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
        <motion.h1 variants={itemVariants}>hey, it's Rohan.</motion.h1>
        <motion.p className="last-updated-row" variants={itemVariants}>
          <span className="last-updated">last updated: August 28, 2026</span>
        </motion.p>
        <motion.p variants={itemVariants}>
          i'm a senior studying statistics & computer science at the <a className="inline-link" href="https://siebelschool.illinois.edu/" target="_blank" rel="noopener noreferrer">university of illinois urbana-champaign.</a> i'm currently at <a className="inline-link" href="https://kosmos.fyi/" target="_blank" rel="noopener noreferrer">kosmos</a>, helping build the intelligence and agentic execution layer for prediction markets. i've also built:
        </motion.p>
        <motion.ul className="build-list" variants={itemVariants}>
          <li><a className="inline-link" href="https://pinterest.com/" target="_blank" rel="noopener noreferrer">pinterest's</a> first-party agentic harness for autonomous vulnerability discovery and validation.</li>
          <li>the personalization layer behind multilingual music recommendations at <a className="inline-link" href="https://music.amazon.com/" target="_blank" rel="noopener noreferrer">amazon music</a>.</li>
        </motion.ul>
        <motion.p variants={itemVariants}>
          when i'm not building, i'm probably <a className="inline-link" href="https://open.spotify.com/artist/0dWCkDXiZhBI7l1LcE0BoV?si=yaev3hm-QPCRJjY37EUgVw" target="_blank" rel="noopener noreferrer">producing music</a> or doomscrolling <a className="inline-link" href="https://www.depop.com/rohankumarrr/" target="_blank" rel="noopener noreferrer">depop</a> for new jeans.
        </motion.p>
        <motion.div className="last-listened" variants={itemVariants}>
          <LastListened />
        </motion.div>
        <motion.div className="link-row" variants={itemVariants}>
          <a href="/ROHAN_KUMAR.pdf" target="_blank" rel="noopener noreferrer" className="text-link">resume</a>
          <span className="link-sep">·</span>
          <a href="mailto:rohankumarrr313@gmail.com" target="_blank" rel="noopener noreferrer" className="text-link">email</a>
          <span className="link-sep">·</span>
          <a href="https://github.com/rohankumarrrr" target="_blank" rel="noopener noreferrer" className="text-link">github</a>
          <span className="link-sep">·</span>
          <a href="https://linkedin.com/in/rohankumarrr313" target="_blank" rel="noopener noreferrer" className="text-link">linkedin</a>
          <span className="link-sep">·</span>
          <a href="https://x.com/rohankumarrr313" target="_blank" rel="noopener noreferrer" className="text-link">x</a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
