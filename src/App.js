import React, { useEffect, useRef } from 'react';
import { BrowserRouter } from "react-router-dom";
import './App.css';
import Home from './components/Home';
import Header from './components/Header';
import Experiences from './components/Experiences';
import { isMobile, isTablet } from 'react-device-detect';
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

    if (isMobile || isTablet) {
      // For mobile and tablet devices, we can use touch events instead of scroll events
      // This is a placeholder for future implementation if needed
      return;
    }

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
      <div className="app">
        <Header windowMenuVisible={windowMenuVisible} setWindowMenuVisible={setWindowMenuVisible} />
        <div id="Home"><Home /></div>
        <div id="Experiences"><Experiences /></div>
      </div>
    </BrowserRouter>
  );
}

export default App;
