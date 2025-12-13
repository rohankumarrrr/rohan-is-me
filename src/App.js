import React, { useRef } from 'react';
import { BrowserRouter } from "react-router-dom";
import './App.css';
import Home from './components/Home';
import Header from './components/Header';
import Experiences from './components/Experiences';

function App() {
  const windowMenuVisible = useRef(true);
  const setWindowMenuVisible = (value) => {
    windowMenuVisible.current = value;
  };

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
