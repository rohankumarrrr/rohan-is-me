import { useEffect, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';

// The site's two kinds of page: home (the intro and the work page) and a post,
// at /shower-thoughts/<slug>. Going between them turns the page with a view transition
// (turnPage, below), the browser's back and forward buttons included.
//
// The path is kept here rather than read from the address bar during render,
// so that between the address changing and the transition's update, the page
// still renders the old one.

const normalize = (path) => path.replace(/\/+$/, '') || '/';

let path = normalize(window.location.pathname);
const listeners = new Set();

function emit() {
  path = normalize(window.location.pathname);
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePath() {
  return useSyncExternalStore(subscribe, () => path);
}

// Left by a page turn for the next page's list to pick up as it mounts: the
// row or section to bring into view (`key`), and whether to skip the entrance
// animation (`quiet`), since the turn has already shown it.
export const arrival = { key: null, quiet: false };

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Elements marked data-vt carry that name through a page turn, so a title on
// one page (a post's row in the work list) glides into its place on the other
// (the post's heading). The names are only given for the length of a turn:
// left on, they would pull those elements out of the theme sweep.
function nameElements(on) {
  document.querySelectorAll('[data-vt]').forEach((el) => {
    el.style.viewTransitionName = on ? el.dataset.vt : '';
  });
}

// Overlapping turns share one class; the last to finish takes it off.
let turning = 0;

function turnPage(update) {
  if (!document.startViewTransition || prefersReducedMotion()) {
    update();
    return;
  }
  const root = document.documentElement;
  turning += 1;
  root.classList.add('page-turn');
  nameElements(true);
  const transition = document.startViewTransition(() => {
    update();
    nameElements(true);
  });
  // A turn that can't run (a name found twice, say) still updates the page;
  // it just isn't animated.
  transition.ready.catch(() => {});
  transition.finished.finally(() => {
    turning -= 1;
    if (turning > 0) return;
    root.classList.remove('page-turn');
    nameElements(false);
  });
}

// Go to `to`. Coming home with `focusKey` brings that experience row into
// view; otherwise the new page starts at the top.
export function navigate(to, { focusKey = null } = {}) {
  const target = normalize(to);
  if (target === path && !focusKey) return;
  const fromHome = path === '/';
  // Remember how far down this page was, for the back button.
  window.history.replaceState({ ...window.history.state, scrollY: window.scrollY }, '');
  turnPage(() => {
    Object.assign(arrival, { key: focusKey, quiet: true });
    window.history.pushState({ fromHome }, '', target);
    flushSync(emit);
    if (!focusKey) window.scrollTo(0, 0);
  });
}

// The row of the work page that the page showing belongs to (a post's own
// row), set by that page while it's up (useLeaveTo). Leaving it any way but
// the "rohan" crumb (the ×, escape, its section's crumb, the browser's back
// button) comes back to the work page on that row's section.
let leaveKey = null;

export function useLeaveTo(key) {
  useEffect(() => {
    leaveKey = key;
    return () => {
      if (leaveKey === key) leaveKey = null;
    };
  }, [key]);
}

// Back to the work page: as the reader left it, if they came from there;
// otherwise brought to this page's row.
export function goBack() {
  if (window.history.state?.fromHome) window.history.back();
  else navigate('/', { focusKey: leaveKey });
}

const opensElsewhere = (e) => e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;

// A link that navigates in place, unless it's being opened in a new tab.
export const linkTo = (to, options) => (e) => {
  if (opensElsewhere(e)) return;
  e.preventDefault();
  navigate(to, options);
};

// A link that goes back, as goBack does, unless it's being opened in a new tab.
export const backLink = (e) => {
  if (opensElsewhere(e)) return;
  e.preventDefault();
  goBack();
};

if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';

window.addEventListener('popstate', (e) => {
  const target = normalize(window.location.pathname);
  if (target === path) return;
  turnPage(() => {
    // Read before the page it's leaving unmounts and takes its key with it.
    const key = target === '/' ? leaveKey : null;
    Object.assign(arrival, { key, quiet: true });
    flushSync(emit);
    // Back where the reader was; failing that, the row brought into view.
    const saved = e.state?.scrollY;
    if (saved != null || !key) window.scrollTo(0, saved ?? 0);
  });
});
