import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import { ThemeProvider } from './hooks/useTheme';
import Navbar from './components/Navbar';
import About from './pages/About';
import Blog from './pages/Blog';
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
          <footer className="footer">© 2026 Rohan Kumar</footer>
        </div>
      </BrowserRouter>
      <Analytics />
    </ThemeProvider>
  );
}

export default App;
