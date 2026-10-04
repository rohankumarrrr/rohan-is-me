import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, frame, cancelFrame } from 'framer-motion';
import { sections, splitDescription } from '../data/entries';
import SwapText from './SwapText';
import './styles/Experiences.css';

// How long the cursor has to rest on a row before it opens. Without it,
// sweeping down this dense list flicks every row open on the way past.
const HOVER_OPEN_DELAY_MS = 100;

// Keeps `el` at the same place on screen for the length of the open and close
// animations, scrolling the page to cancel out any drift. The correction runs
// in framer-motion's post-render step — after it has applied that frame's
// animated heights, before the browser paints — so it lands in the same frame
// as the shift and the row never visibly moves.
function holdInPlace(el, duration = 450) {
  if (!el) return;
  const start = el.getBoundingClientRect().top;
  const until = performance.now() + duration;
  const correct = () => {
    const drift = el.getBoundingClientRect().top - start;
    if (Math.abs(drift) >= 1) window.scrollBy(0, drift);
    if (performance.now() >= until) cancelFrame(correct);
  };
  frame.postRender(correct, true);
}

// Seconds between one element's entrance and the next, down the page.
const STAGGER = 0.06;

// Entrance: text fades in while the heading rules and dotted leaders draw
// themselves from the left. Each element receives its position down the page
// as `custom`, so the stagger runs continuously across all three sections.
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i) => ({ opacity: 1, transition: { duration: 0.5, delay: i * STAGGER } }),
};

const drawIn = {
  hidden: { scaleX: 0 },
  visible: (i) => ({
    scaleX: 1,
    transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1], delay: i * STAGGER + 0.1 },
  }),
};

function useCanHover() {
  const query = '(hover: hover) and (pointer: fine)';
  const [canHover, setCanHover] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setCanHover(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);
  return canHover;
}

function Row({ entry, index, isOpen, onOpen, onClose, onToggle }) {
  const lastPointerType = useRef('mouse');
  const headRef = useRef(null);
  const openTimer = useRef(null);
  const bodyId = useId();
  const { header, details } = splitDescription(entry.description);

  useEffect(() => () => clearTimeout(openTimer.current), []);

  // A mouse opens a row by resting on it and closes it by leaving. Touch has
  // no hover to leave — a tap emits a synthetic mouseenter but never a
  // matching mouseleave — so it toggles on tap instead, anywhere on the row.
  // Deciding from the pointer that started the interaction, rather than from
  // the device, keeps both working on a touchscreen laptop.
  const handlePointerEnter = (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(openTimer.current);
    openTimer.current = setTimeout(onOpen, HOVER_OPEN_DELAY_MS);
  };
  const handlePointerLeave = (e) => {
    if (e.pointerType !== 'mouse') return;
    clearTimeout(openTimer.current);
    onClose();
  };
  const handlePointerDown = (e) => {
    lastPointerType.current = e.pointerType;
  };
  const handleClick = (e) => {
    // A click from Enter or Space has detail 0 and always toggles; a mouse
    // click is left alone because hover already owns the state.
    if (e.detail !== 0 && lastPointerType.current === 'mouse') return;
    onToggle(headRef.current);
  };

  return (
    <motion.li
      className={`row${isOpen ? ' is-open' : ''}`}
      variants={fadeIn}
      custom={index}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
    >
      <button
        ref={headRef}
        type="button"
        className="row-head"
        aria-expanded={isOpen}
        aria-controls={bodyId}
      >
        <span className="row-title">
          {/* The visible text turns into the header while open; screen
              readers always get the title here and the header in the body. */}
          <span className="sr-only">{entry.title}</span>
          <span aria-hidden="true">
            <SwapText from={entry.title} to={header} active={isOpen} />
          </span>
        </span>
        <motion.span className="row-leader" aria-hidden="true" variants={drawIn} custom={index} />
        <span className="row-period">{entry.period}</span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={bodyId}
            className="row-body-wrap"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto', transition: { duration: 0.3, delay: 0.05 } }}
            exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
            style={{ overflow: 'hidden' }}
          >
            <div className="row-body">
              {header && <p className="sr-only">{header}</p>}
              {details.length > 0 && (
                <ul className="row-bullets">
                  {details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              )}
              {entry.technologies?.length > 0 && (
                <p className="row-tech">{entry.technologies.join(', ')}</p>
              )}
              {entry.link && (
                <a
                  className="row-link"
                  href={entry.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  {entry.linkLabel || 'view'} <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

function ExternalIcon() {
  return (
    <svg
      className="row-external"
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 2.5H2.5v7h7V7" />
      <path d="M7 2h3v3M10 2 5.5 6.5" />
    </svg>
  );
}

// A row that is just a link out — used for publications.
function LinkRow({ entry, index }) {
  return (
    <motion.li className="row row--link" variants={fadeIn} custom={index}>
      <a className="row-head" href={entry.link} target="_blank" rel="noopener noreferrer">
        <span className="row-title">
          <span className="row-link-text">{entry.title}</span>
          <ExternalIcon />
          <span className="sr-only"> (opens in a new tab)</span>
        </span>
        <motion.span className="row-leader" aria-hidden="true" variants={drawIn} custom={index} />
        <span className="row-period">{entry.period}</span>
      </a>
    </motion.li>
  );
}

export default function Experiences() {
  const colRef = useRef(null);
  const [paddingTop, setPaddingTop] = useState(null);
  const [openKey, setOpenKey] = useState(null);

  // Only one row is open at a time. Hover opens and closes rows directly; a
  // tap or Enter toggles one and closes whichever other row was open.
  const openRow = (key) => setOpenKey(key);
  const closeRow = (key) => setOpenKey((current) => (current === key ? null : current));
  const toggleRow = (key, head) => {
    // When the row closing sits above the one tapped, everything below it
    // slides up as it collapses — the tapped row included, sometimes off
    // screen. Hold the tapped row still while that happens.
    if (openKey && openKey !== key) holdInPlace(head);
    setOpenKey(openKey === key ? null : key);
  };
  const canHover = useCanHover();
  const reduceMotion = useReducedMotion();

  // Centre the list on its collapsed height. Centring on its live height
  // would make an opening row grow the list in both directions, sliding the
  // rows above it — including the one under the cursor — upward. Subtracting
  // the open bodies keeps the offset fixed, so rows only ever push downward.
  useLayoutEffect(() => {
    const col = colRef.current;
    if (!col) return undefined;
    const measure = () => {
      const openBodies = [...col.querySelectorAll('.row-body-wrap')].reduce(
        (sum, el) => sum + el.offsetHeight,
        0
      );
      const collapsed = col.offsetHeight - openBodies;
      const footer = document.querySelector('.footer')?.offsetHeight ?? 0;
      const available = window.innerHeight - footer;
      const minimum = window.innerHeight * 0.06;
      setPaddingTop(Math.max(minimum, (available - collapsed) / 2));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(col);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Running position of each animated element down the page.
  let position = 0;

  return (
    <div className="work" style={paddingTop == null ? undefined : { paddingTop }}>
      {/* Like the home screen, this replays each time it scrolls into view. */}
      <motion.div
        ref={colRef}
        className="work-col"
        variants={{ hidden: {}, visible: {} }}
        initial={reduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {sections.map((section, sectionIndex) => {
          const headingPosition = position++;
          return (
            <section key={section.id} className="work-group" aria-labelledby={`work-${section.id}`}>
              <motion.div className="work-heading-row" variants={fadeIn} custom={headingPosition}>
                <h2 id={`work-${section.id}`} className="work-heading">
                  {section.heading}
                </h2>
                {sectionIndex === 0 && (
                  <span className="work-hint">{canHover ? 'hover for details' : 'tap for details'}</span>
                )}
                <motion.span
                  className="work-rule"
                  aria-hidden="true"
                  variants={drawIn}
                  custom={headingPosition}
                />
              </motion.div>
              <ul className="rows">
                {section.items.map((item, i) => {
                  const rowPosition = position++;
                  return section.kind === 'link' ? (
                    <LinkRow key={i} entry={item} index={rowPosition} />
                  ) : (
                    <Row
                      key={i}
                      entry={item}
                      index={rowPosition}
                      isOpen={openKey === `${section.id}-${i}`}
                      onOpen={() => openRow(`${section.id}-${i}`)}
                      onClose={() => closeRow(`${section.id}-${i}`)}
                      onToggle={(head) => toggleRow(`${section.id}-${i}`, head)}
                    />
                  );
                })}
              </ul>
            </section>
          );
        })}
      </motion.div>
    </div>
  );
}
