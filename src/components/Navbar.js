import { motion } from 'framer-motion';
import { Icon } from '@iconify-icon/react';
import { useTheme } from '../hooks/useTheme';
import './styles/Navbar.css';

export default function Navbar() {
  const { toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <motion.button
        className="theme-toggle"
        onClick={toggleTheme}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle theme"
        aria-keyshortcuts="t"
        title="Toggle theme (T)"
      >
        {/* One half-filled circle for both themes; Navbar.css turns it over
            when the theme flips. */}
        <Icon className="theme-toggle-icon" icon="ph:circle-half-fill" width="1em" height="1em" />
      </motion.button>
    </nav>
  );
}
