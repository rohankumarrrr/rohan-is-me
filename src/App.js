import React from 'react';
import { BrowserRouter } from "react-router-dom";
import Home from './components/Home';
import Header from './components/Header';
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contacts from "./components/Contacts";

function App() {
  return (
    <BrowserRouter>
    <div>
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
