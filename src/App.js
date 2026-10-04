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
        {/* The work section and footer share the second screen, so scrolling
            down lands on a page of its own. */}
        <div className="work-page">
          <Experiences />
          <footer className="footer">© 2026 Rohan Kumar</footer>
        </div>
      </div>
      <Analytics />
    </ThemeProvider>
  );
}

export default App;
