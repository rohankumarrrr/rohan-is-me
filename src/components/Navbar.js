import { motion } from 'framer-motion';
import { Icon } from '@iconify-icon/react';
import { useTheme } from '../hooks/useTheme';
import './styles/Navbar.css';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <motion.button
        className="theme-toggle"
        onClick={toggleTheme}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle theme"
      >
        <Icon icon={theme === 'dark' ? 'ph:sun-bold' : 'ph:moon-bold'} width="1em" height="1em" />
      </motion.button>
    </nav>
  );
}
