import React, { useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";
import './App.css';
import Home from './components/Home';
import Header from './components/Header';
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contacts from "./components/Contacts";
import { isMobile, isTablet, isDesktop } from 'react-device-detect';

function App() {

  useEffect(() => {
    if (isMobile || isTablet) {
      alert("Warning: This experience is best enjoyed on desktop devices.")
    }
  }, []);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
    <div className="app">
      <Header />
      <div id="Home"><Home /></div>
      <div id="Skills"><Skills /></div>
      <div id="Projects"><Projects /></div>
      <div id="Contacts"><Contacts /></div>
    </div>
    </BrowserRouter>
  );
}

export default App;
