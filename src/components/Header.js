import React, { useState, useEffect, useRef } from 'react';
import './styles/Header.css';
import { motion } from 'framer-motion';

function Header({ windowMenuVisible, setWindowMenuVisible }) {
    const [currentSection, setCurrentSection] = useState("Home");
    const [isScrolling, setIsScrolling] = useState(false);
    const [isAtTop, setIsAtTop] = useState(true);
    const [contactContainerVisible, setContactContainerVisible] = useState(false);

    const lastScrollY = useRef(0);

    const handleHeaderClick = (section) => {
      const element = document.getElementById(section);
      element.scrollIntoView({block: "start", behavior: "smooth"});
    }

    useEffect(() => {
        const handleScroll = () => {
          if (window.scrollY > lastScrollY.current) {
            setIsScrolling(true); // Scrolling down
            // setWindowMenuVisible(false);
            // setContactContainerVisible(true);
          } else {
            setIsScrolling(false); // Scrolling up
            // setWindowMenuVisible(true);
            // setContactContainerVisible(false);
          }

          const sections = ['Home', 'Experiences', 'Projects'];

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

          lastScrollY.current = window.scrollY;
          setIsAtTop(window.scrollY === 0);
        };
    
        window.addEventListener("scroll", handleScroll);
    
        return () => {
          window.removeEventListener("scroll", handleScroll);
        };
      }, []);

      const variantsWindows = {
        show: {
            opacity: 1,
            x: "0vw",
            transition: {
                type: "spring",
                duration: 0.5,
                bounce: 0.3,
                ease: "easeOut"
            }
        },
        hide: {
            opacity: 1,
            x: "14.5vw",
            transition: {
                type: "spring",
                duration: 0.5,
                bounce: 0.3,
                ease: "easeOut"
            }
        }
    };

    const variantsContacts = {
        show: {
            opacity: 1,
            x: "0vw",
            transition: {
                type: "spring",
                duration: 0.5,
                bounce: 0.3,
                ease: "easeOut"
            }
        },
        hide: {
            opacity: 1,
            x: "-14vw",
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
        <motion.div className="contacts-container" key="animation-on-state" variants={variantsContacts} animate={!windowMenuVisible.current ? 'show' : 'hide'}>
            <motion.a href="mailto:rohankumarrr313@gmail.com" target="_blank" whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }}>
                <img alt="Mail Logo" className="contact-logo-container" src="https://icons.veryicon.com/png/o/miscellaneous/practical-life-icon/mail-255.png" style={{width: "3vw", height: "8vh", marginTop: '0.2vh'}}></img>
            </motion.a>
            <motion.a href="https://github.com/rohankumarrrr" target="_blank" whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }}>
                <img alt="GitHub Logo" className="contact-logo-container" style={{width: "3vw", height: "3vw", marginLeft: "1vw", marginTop: '0.1vh'}} src={'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg'}></img>
            </motion.a>
            <motion.a href="https://linkedin.com/in/rohankumarrr313" target="_blank" whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }}>
                <img alt="LinkedIn Logo" className="contact-logo-container" src="https://img.icons8.com/ios11/512/linkedin.png" style={{width: "2.5vw", height: "6vh", marginTop: "0.5vh", marginLeft: "1vw", marginRight: '0.25vw'}}></img>
            </motion.a>
            <motion.img src={require("../assets/images/rk-logo-2.png")} alt="logo" className="logo"  whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }} onClick={() => {setWindowMenuVisible(!windowMenuVisible.current)}}/>
        </motion.div>
         <nav>
           <motion.ul className="nav-links" key="animation-on-state" variants={variantsWindows} animate={windowMenuVisible.current ? 'show' : 'hide'}>
             <motion.img whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }} className='menu-icon' src={require("../assets/images/menu-icon.png")}  onClick={() => {setWindowMenuVisible(!windowMenuVisible.current)}} />
             <motion.li style={{cursor: "pointer"}} whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }} onClick={() => handleHeaderClick("Home")}>home</motion.li>
             <motion.li style={{cursor: "pointer"}} whileHover={{ scale: 1.05 }} whileTap ={{ scale: 0.95 }} onClick={() => handleHeaderClick("Experiences")}>experiences</motion.li>
           </motion.ul>
         </nav>
    </header>
    )
}

export default Header;