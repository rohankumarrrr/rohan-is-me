import React from 'react';
import './App.css';
import { ThemeProvider } from './hooks/useTheme';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Experiences from './components/Experiences';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <Navbar />
        <Home />
        <Experiences />
        <footer className="footer">© 2026 Rohan Kumar</footer>
      </div>
      <Analytics />
    </ThemeProvider>
  );
}

export default App;
