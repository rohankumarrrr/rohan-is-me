import React from 'react';
import { BrowserRouter } from "react-router-dom";
import './App.css';
import Home from './components/Home';
import Header from './components/Header';
import Experiences from './components/Experiences';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <div className="app">
        <Header/>
        <div id="Home"><Home /></div>
        <div id="Experiences"><Experiences/></div>
      </div>
    </BrowserRouter>
  );
}

export default App;
