import React, { useEffect } from 'react';
import { backLink, goBack, linkTo, useLeaveTo } from '../hooks/useRoute';
import './styles/PostPage.css';

// A page other than home: crumbs back, an × at the right, and escape to
// leave. "rohan" goes to the top of home; everything else (the crumb of the
// page's `section`, the ×, escape) goes back to the work page on that
// section, at the page's own row (`section.focusKey`). `title` is the
// document's.
export default function PageShell({ section, title, children }) {
  useLeaveTo(section.focusKey);

  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · rohan`;
    return () => {
      document.title = previous;
    };
  }, [title]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== 'Escape' || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest?.('input, textarea, select') || e.target.isContentEditable) return;
      goBack();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="post-page">
      <div className="post-wrap">
        <div className="post">
          <nav className="post-crumbs" aria-label="Breadcrumb">
            <a className="text-link" href="/" onClick={linkTo('/')}>
              rohan
            </a>
            <span className="post-crumb-sep" aria-hidden="true">
              /
            </span>
            <a className="text-link" href="/" onClick={backLink}>
              {section.label}
            </a>
            <button type="button" className="post-close" onClick={goBack} aria-label={`Back to ${section.label}`} title="back (esc)">
              ×
            </button>
          </nav>
          {children}
        </div>
      </div>
      <footer className="footer">© 2026 Rohan Kumar</footer>
    </div>
  );
}
