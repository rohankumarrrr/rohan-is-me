import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify-icon/react';
import { useTheme } from '../hooks/useTheme';
import './styles/Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* Desktop */}
      <div className="navbar-links">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link--active' : '')}>
            my life
          </NavLink>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <NavLink to="/blog" className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link--active' : '')}>
            my shower thoughts
          </NavLink>
        </motion.div>
        <motion.button
          className="theme-toggle"
          onClick={toggleTheme}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle theme"
        >
          <Icon icon={theme === 'dark' ? 'ph:sun-bold' : 'ph:moon-bold'} width="1em" height="1em" />
        </motion.button>
      </div>

      {/* Mobile */}
      <div className={`navbar-mobile${menuOpen ? ' navbar-mobile--open' : ''}`} ref={menuRef}>
        {/* Hamburger / X row — always visible top-right */}
        <div className="mobile-menu-row">
          <motion.button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(o => !o)}
            whileTap={{ scale: 0.9 }}
            aria-label="Toggle menu"
          >
            <Icon icon={menuOpen ? 'ph:x-bold' : 'ph:list-bold'} width="1.4em" height="1.4em" />
          </motion.button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="mobile-dropdown"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              <NavLink
                to="/"
                end
                className={({ isActive }) => 'mobile-nav-link' + (isActive ? ' nav-link--active' : '')}
                onClick={() => setMenuOpen(false)}
              >
                my life
              </NavLink>
              <NavLink
                to="/blog"
                className={({ isActive }) => 'mobile-nav-link' + (isActive ? ' nav-link--active' : '')}
                onClick={() => setMenuOpen(false)}
              >
                my shower thoughts
              </NavLink>
              <button
                className="mobile-theme-toggle"
                onClick={() => { toggleTheme(); setMenuOpen(false); }}
              >
                <Icon icon={theme === 'dark' ? 'ph:sun-bold' : 'ph:moon-bold'} width="1.2em" height="1.2em" />
                {theme === 'dark' ? 'light mode' : 'dark mode'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
