import React from "react";
import { motion } from "framer-motion";
import "./styles/Contacts.css";

const Contacts = () => {

    const container = {
        hidden: {  },
        show: {
            transition: {
                staggerChildren: 0.5,
                duration: 1,
                type: "spring",
                bounce: 0.3,
                delayChildren: 0.5
            }
        }
    }

    const item = {
        hidden: { opacity: 0, x: 300 },
        show: { opacity: 1, x: 0, transition: { duration: 1, type: "spring", bounce: 0.3} }
    }

    return (
        <motion.div className="container-for-section" >
            <motion.div className="container-for-contacts" variants={container} initial="hidden" whileInView={"show"} viewport={{once: true}}>
                <motion.a className="contact-link" variants={item} href="mailto:rohankumarrr313@gmail.com" target="_blank" whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }}>
                email
                </motion.a>
                <p className="divider">/</p>
                <motion.a className="contact-link" variants={item} href="https://github.com/rohankumarrrr" target="_blank" whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }}>
                github
                </motion.a>
                <p className="divider">/</p>
                <motion.a className="contact-link" variants={item} href="https://linkedin.com/in/rohankumarrr313" target="_blank" whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }}>
                linkedin
                </motion.a>
            </motion.div>
        </motion.div>
    );
};

export default Contacts;