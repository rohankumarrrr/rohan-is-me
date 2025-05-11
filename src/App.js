import React, { useEffect, useRef } from 'react';
import { BrowserRouter } from "react-router-dom";
import './App.css';
import Home from './components/Home';
import Header from './components/Header';
import Experiences from './components/Experiences';
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contacts from "./components/Contacts";
import WrongScreenSize from "./components/WrongScreenSize";
import { isMobile, isTablet, isDesktop } from 'react-device-detect';
import { throttle } from 'lodash';

function App() {
  const currentSectionIdx = useRef(0);
  const sections = ["Home", "Experiences"];
  const isScrolling = useRef(false);
  const lastScrollY = useRef(0);
  const windowMenuVisible = useRef(true);
  const setWindowMenuVisible = (value) => {
    windowMenuVisible.current = value;
  };

  const handleScrollEvent = () => {
    if (isScrolling.current) return;

    const scrollY = window.scrollY;
    const direction = scrollY > lastScrollY.current ? "down" : "up";
    lastScrollY.current = scrollY;

    let newIdx = currentSectionIdx.current;
    if (direction === "down") {
      newIdx = Math.min(currentSectionIdx.current + 1, sections.length - 1);
    }
    else {
      newIdx = Math.max(currentSectionIdx.current - 1, 0);
    }


    const targetElement = document.getElementById(sections[newIdx]);
    if (targetElement && newIdx !== currentSectionIdx.current) {
      isScrolling.current = true;
      const targetPosition = targetElement.offsetTop;
      setWindowMenuVisible(!windowMenuVisible.current);
      console.log("Window Menu Visible: ", windowMenuVisible.current);
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
      currentSectionIdx.current = newIdx;
      setTimeout(() => {
        isScrolling.current = false;
      }, 200); // Adjust the timeout as needed
    }
  }

  useEffect(() => {
    const throttledHandleScroll = throttle(handleScrollEvent, 200);
    window.addEventListener('scroll', throttledHandleScroll);

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, []);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
    {isMobile || isTablet || Math.min(window.screen.width, window.screen.height) < 768 ?
    <div className="app">
      <div><WrongScreenSize /></div>
    </div> :
    <div className="app">
      <Header windowMenuVisible={windowMenuVisible} setWindowMenuVisible={setWindowMenuVisible} />
      <div id="Home"><Home /></div>
      <div id="Experiences"><Experiences /></div>
      <div id="Contacts"><Contacts /></div>
    </div>}
    </BrowserRouter>
  );
}

export default App;
