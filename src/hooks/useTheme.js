import { createContext, useCallback, useContext, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

const ThemeContext = createContext(null);

// How long the fallback crossfade takes. Keep in step with the
// html.theme-transition rule in index.css.
const THEME_FADE_MS = 500;

let sweepsRunning = 0;
let fadeTimer;

// Saved data can be off-limits entirely (Safari with all cookies blocked
// throws on any access), so a failed read is no saved choice and a failed
// write leaves the choice to this visit.
function readSavedTheme() {
  try {
    const saved = localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null;
  }
}

function saveTheme(theme) {
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Not saved: the next visit falls back to the system's theme.
  }
}

const systemTheme = () => (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// The browser's own bars (Safari's tinted toolbar, Chrome's address bar) take
// their colour from the theme-color metas, whose media queries follow the
// system. Pointing both at the page's background makes them follow the
// toggle too.
function syncBrowserBars() {
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => meta.setAttribute('content', bg));
}

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
  // The inline script in index.html has already picked the theme before the
  // first paint; this picks it the same way only if that script didn't run.
  const [theme, setThemeState] = useState(() => {
    const root = document.documentElement;
    const picked = root.getAttribute('data-theme');
    if (picked === 'light' || picked === 'dark') return picked;
    const resolved = readSavedTheme() ?? systemTheme();
    root.setAttribute('data-theme', resolved);
    syncBrowserBars();
    return resolved;
  });

  // Every change comes through here, so the attribute the colours follow and
  // the state the toggle's icon follows flip together, inside one animation.
  const setTheme = useCallback((next) => {
    const root = document.documentElement;
    if (root.getAttribute('data-theme') === next) return;
    animateThemeChange(() => {
      root.setAttribute('data-theme', next);
      syncBrowserBars();
      setThemeState(next);
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!readSavedTheme()) setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, [setTheme]);

  const toggleTheme = useCallback(() => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    saveTheme(next);
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
