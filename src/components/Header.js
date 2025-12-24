import React, { useState, useEffect, useRef } from 'react';
import './styles/Header.css';
import { motion } from 'framer-motion';

function Header() {
    const [currentSection, setCurrentSection] = useState("Home");
    const [isContainerVisible, setIsContainerVisible] = useState(true); // State to control visibility

    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {

          const currentScrollY = window.scrollY;

          // Show when at the top or scrolling up, hide when scrolling down
          if (currentScrollY > lastScrollY.current && currentScrollY > 10) {
            setIsContainerVisible(false); // Scrolling down
          } else {
            setIsContainerVisible(true); // Scrolling up or at top
          }

          const sections = ['Home', 'Experiences'];

          sections.forEach((section) => {
            const element = document.getElementById(section);
            if (element) {
              const { offsetTop, offsetHeight } = element;
              const isInView = window.scrollY >= offsetTop - 50 && window.scrollY < offsetTop + offsetHeight - 50;

                if (isInView && section !== currentSection) {
                    setCurrentSection(section);
                }
            }
          });

          lastScrollY.current = currentScrollY;
        };
    
        window.addEventListener("scroll", handleScroll);
    
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
    }, [currentSection]); // Add dependencies

    const variantsContacts = {
        show: {
            opacity: 1,
            x: "0%",
            transition: {
                type: "spring",
                duration: 0.5,
                bounce: 0.3,
                ease: "easeOut"
            }
        },
        hide: {
            opacity: 1,
            x: "72%",
            transition: {
                type: "spring",
                duration: 0.5,
                bounce: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
    <header className="header">
        <motion.div 
            className="contacts-container" 
            key="animation-on-state" 
            variants={variantsContacts} 
            animate={isContainerVisible ? 'show' : 'hide'}
        >
            <motion.img src={require("../assets/images/rk-logo-2.png")} alt="logo" className="logo"  whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }} onClick={() => setIsContainerVisible(!isContainerVisible)}/>
            <motion.a href="mailto:rohankumarrr313@gmail.com" target="_blank" whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }}>
                <img alt="Mail Logo" className="contact-logo-container" src="https://pngimg.com/d/email_PNG100739.png" />
            </motion.a>
            <motion.a href="https://github.com/rohankumarrrr" target="_blank" whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }}>
                <img alt="GitHub Logo" className="contact-logo-container" src={'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg'} />
            </motion.a>
            <motion.a href="https://linkedin.com/in/rohankumarrr313" target="_blank" whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }}>
                <img alt="LinkedIn Logo" className="contact-logo-container" src="https://static.vecteezy.com/system/resources/previews/018/930/480/non_2x/linkedin-logo-linkedin-icon-transparent-free-png.png" style={{objectFit: "cover", width: "3vw", height: "5vw"}} />
            </motion.a>
        </motion.div>
    </header>
    )
}

export default Header;