import { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

const ThemeContext = createContext(null);

// How long the fallback crossfade takes. Keep in step with the
// html.theme-transition rule in index.css.
const THEME_FADE_MS = 500;

let sweepsRunning = 0;
let fadeTimer;

// Runs `apply`, which flips the theme, as a diagonal sweep across the page:
// the one vinskal.com plays. The View Transitions API snapshots the page before
// and after the flip, and index.css reveals the new snapshot through a
// soft-edged mask travelling from the top-right corner to the bottom-left, so
// every pixel changes the moment the edge passes it. Where the API is missing,
// or reduced motion is asked for, the colours crossfade in place instead.
function animateThemeChange(apply) {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (document.startViewTransition && !reduceMotion) {
    // A flip during a sweep cuts the first one short, and its end must not
    // strip the class from the second.
    sweepsRunning += 1;
    root.classList.add('theme-sweep');
    // The browser snapshots the new theme as soon as `apply` returns, so the
    // React update inside it (the toggle's icon) has to land synchronously.
    const transition = document.startViewTransition(() => flushSync(apply));
    // A sweep that can't play (a hidden tab, or a second flip cutting in)
    // rejects `ready`; the theme still changes, so there's nothing to report.
    transition.ready.catch(() => {});
    transition.finished
      .catch(() => {})
      .finally(() => {
        sweepsRunning -= 1;
        if (sweepsRunning === 0) root.classList.remove('theme-sweep');
      });
    return;
  }

  root.classList.add('theme-transition');
  apply();
  clearTimeout(fadeTimer);
  fadeTimer = setTimeout(() => root.classList.remove('theme-transition'), THEME_FADE_MS + 50);
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const stored = localStorage.getItem('theme');
    const resolved = stored ??
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', resolved);
    return resolved;
  });

  // Every change comes through here, so the attribute the colours follow and
  // the state the toggle's icon follows flip together, inside one animation.
  const setTheme = useCallback((next) => {
    const root = document.documentElement;
    if (root.getAttribute('data-theme') === next) return;
    animateThemeChange(() => {
      root.setAttribute('data-theme', next);
      setThemeState(next);
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [setTheme]);

  const toggleTheme = useCallback(() => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    setTheme(next);
  }, [setTheme]);

  // T flips the theme, as on vinskal.com. It's a bare key, so it stays out of
  // the way of browser shortcuts, held-down keys, and anyone typing.
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key.toLowerCase() !== 't') return;
      if (e.defaultPrevented || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target;
      if (target.isContentEditable || target.closest?.('input, textarea, select')) return;
      toggleTheme();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggleTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
