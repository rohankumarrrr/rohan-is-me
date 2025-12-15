import React, { useRef } from 'react';
import { BrowserRouter } from "react-router-dom";
import './App.css';
import Home from './components/Home';
import Header from './components/Header';
import Experiences from './components/Experiences';

function App() {
  const isProgrammaticScroll = useRef(false);

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="app">
        <Header isProgrammaticScroll={isProgrammaticScroll} />
        <div id="Home"><Home /></div>
        <div id="Experiences"><Experiences isProgrammaticScroll={isProgrammaticScroll} /></div>
      </div>
    </BrowserRouter>
  );
}

export default App;
