import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, frame, cancelFrame } from 'framer-motion';
import { sections, splitDescription } from '../data/entries';
import SwapText from './SwapText';
import './styles/Experiences.css';

// How long the cursor has to rest on a row before it opens. Without it,
// sweeping down this dense list flicks every row open on the way past.
const HOVER_OPEN_DELAY_MS = 100;

// A stat in a detail line: 130k+, ≈23m+, 96%+, 50-hour, 1tb, 3.86. The
// character before it is captured rather than looked behind at, which older
// Safari can't parse. A year is a date, not a stat.
const STAT = /(^|[^\w.])(≈?\d[\d,.]*(?:k|m|tb|%)?\+?(?:-hour)?)(?!\w)/gi;
const YEAR = /^(?:19|20)\d\d$/;

// Marks what a reader scans a detail line for: its lead, a label like
// "courses:" or else the opening verb, and its stats. Styled in
// Experiences.css.
function emphasize(text) {
  const colon = text.indexOf(':');
  const leadEnd = colon > 0 && colon < 24 ? colon + 1 : text.search(/\s|$/);
  const marks = [[0, leadEnd, 'row-lead']];
  for (const m of text.matchAll(STAT)) {
    const start = m.index + m[1].length;
    if (start >= leadEnd && !YEAR.test(m[2])) marks.push([start, start + m[2].length, 'row-stat']);
  }
  const parts = [];
  let at = 0;
  marks.forEach(([start, end, className]) => {
    if (start > at) parts.push(text.slice(at, start));
    parts.push(
      <span key={start} className={className}>
        {text.slice(start, end)}
      </span>
    );
    at = end;
  });
  parts.push(text.slice(at));
  return parts;
}

// Keeps `el` at the same place on screen while the rows above it change height,
// for the length of the open and close animations.
//
// Scrolling the page every frame to cancel the drift shakes it on iOS Safari,
// which applies a script's scroll a frame late: each correction lands after the
// layout it was chasing has moved on, and the page jumps tens of pixels back
// and forth until the animation ends. So the drift is cancelled by shifting the
// work page with a transform instead, set in framer-motion's post-render step,
// after that frame's animated heights and before paint, so the two land
// together on every browser. When the animation is over, the shift is traded
// for one scroll of the same distance. The browser's own scroll anchoring is
// off meanwhile, or it would cancel the same drift a second time.
let releaseHold = null;

function holdInPlace(el, duration = 450) {
  const page = el?.closest('.work-page');
  if (!page) return;
  releaseHold?.();
  const root = document.documentElement;
  const start = el.getBoundingClientRect().top;
  const until = performance.now() + duration;
  let shift = 0;
  root.style.overflowAnchor = 'none';

  const release = () => {
    cancelFrame(correct);
    page.style.transform = '';
    window.scrollBy(0, -shift);
    root.style.overflowAnchor = '';
    releaseHold = null;
  };
  function correct() {
    // Where the row sits in the layout, with the current shift taken back out.
    const top = el.getBoundingClientRect().top - shift;
    shift = start - top;
    page.style.transform = Math.abs(shift) >= 0.5 ? `translateY(${shift}px)` : '';
    if (performance.now() >= until) release();
  }
  releaseHold = release;
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

// A wrapped title's box keeps the full width it was given, wider than its last
// line, so a leader starting at the box's edge would leave a gap after the
// text. This measures that gap — from the box's edge back to `endRef`, an
// empty marker after the last word — so the leader can be pulled back over it.
function useLeaderReach(titleRef, endRef) {
  const [reach, setReach] = useState(0);
  useLayoutEffect(() => {
    const title = titleRef.current;
    const end = endRef.current;
    if (!title || !end) return undefined;
    const measure = () => {
      const gap = title.getBoundingClientRect().right - end.getBoundingClientRect().right;
      setReach(gap >= 1 ? Math.round(gap) : 0);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(title);
    window.addEventListener('resize', measure);
    document.fonts?.addEventListener('loadingdone', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      document.fonts?.removeEventListener('loadingdone', measure);
    };
  }, [titleRef, endRef]);
  return reach;
}

const leaderStyle = (reach) => (reach ? { marginLeft: -reach } : undefined);

function Row({ entry, index, isOpen, onOpen, onClose, onToggle }) {
  const lastPointerType = useRef('mouse');
  const focusOpened = useRef(false);
  const headRef = useRef(null);
  const titleRef = useRef(null);
  const endRef = useRef(null);
  const openTimer = useRef(null);
  const bodyId = useId();
  const reach = useLeaderReach(titleRef, endRef);
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

  // With a link, the title is the way out to it, so it can't also be the
  // button that toggles the row. Keyboard focus reveals the details the way
  // hover does, and on touch a first tap reveals them, a second follows.
  const handleLinkClick = (e) => {
    e.stopPropagation();
    if (e.detail !== 0 && lastPointerType.current !== 'mouse' && !isOpen) {
      e.preventDefault();
      onToggle(headRef.current);
    }
  };
  const handleLinkFocus = (e) => {
    if (!e.currentTarget.matches(':focus-visible')) return;
    focusOpened.current = true;
    onOpen();
  };
  const handleLinkBlur = () => {
    if (!focusOpened.current) return;
    focusOpened.current = false;
    onClose();
  };

  const leader = (
    <motion.span
      className="row-leader"
      aria-hidden="true"
      variants={drawIn}
      custom={index}
      style={leaderStyle(reach)}
    />
  );
  const period = <span className="row-period">{entry.period}</span>;
  const bodyContent = (
    <>
      {header && <p className="sr-only">{header}</p>}
      {details.length > 0 && (
        <ul className="row-bullets">
          {details.map((detail, i) => (
            <li key={i}>{emphasize(detail)}</li>
          ))}
        </ul>
      )}
      {entry.technologies?.length > 0 && (
        <ul className="row-tech" aria-label="technologies">
          {entry.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      )}
    </>
  );

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
      {entry.link ? (
        <div ref={headRef} className="row-head row-head--static">
          <a
            ref={titleRef}
            className="row-title row-title-link is-external"
            href={entry.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleLinkClick}
            onFocus={handleLinkFocus}
            onBlur={handleLinkBlur}
          >
            {/* As in the button rows, the visible text turns into the header
                while open; screen readers always get the title here. */}
            <span className="sr-only">{entry.title} (opens in a new tab)</span>
            <span className="row-link-line" aria-hidden="true">
              <SwapText from={entry.title} to={header} active={isOpen} render={renderLinkText} />
            </span>
            <span ref={endRef} />
          </a>
          {leader}
          {period}
        </div>
      ) : (
        <button
          ref={headRef}
          type="button"
          className="row-head"
          aria-expanded={isOpen}
          aria-controls={bodyId}
        >
          <span ref={titleRef} className="row-title">
            {/* The visible text turns into the header while open; screen
                readers always get the title here and the header in the body. */}
            <span className="sr-only">{entry.title}</span>
            <span aria-hidden="true">
              <SwapText from={entry.title} to={header} active={isOpen} />
            </span>
            <span ref={endRef} />
          </span>
          {leader}
          {period}
        </button>
      )}

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
            <div className="row-body">{bodyContent}</div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* A link row has no toggle to announce, so a screen reader reading
          straight past it still gets the details. */}
      {entry.link && !isOpen && <div className="sr-only">{bodyContent}</div>}
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

// The visible text of a title that links out. The icon rides with the last
// word, so a title that wraps never leaves it stranded on a line of its own.
function LinkText({ text }) {
  const split = text.lastIndexOf(' ') + 1;
  return (
    <>
      <span className="row-link-text">{text.slice(0, split)}</span>
      <span className="row-title-tail">
        <span className="row-link-text">{text.slice(split)}</span>
        <ExternalIcon />
      </span>
    </>
  );
}

const renderLinkText = (text) => <LinkText text={text} />;

// A row that is just a link out — used for publications.
function LinkRow({ entry, index }) {
  const titleRef = useRef(null);
  const endRef = useRef(null);
  const reach = useLeaderReach(titleRef, endRef);
  return (
    <motion.li className="row row--link" variants={fadeIn} custom={index}>
      <div className="row-head row-head--static">
        <a
          ref={titleRef}
          className="row-title row-title-link is-external"
          href={entry.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="row-link-line">
            <LinkText text={entry.title} />
          </span>
          <span className="sr-only"> (opens in a new tab)</span>
          <span ref={endRef} />
        </a>
        <motion.span
          className="row-leader"
          aria-hidden="true"
          variants={drawIn}
          custom={index}
          style={leaderStyle(reach)}
        />
        <span className="row-period">{entry.period}</span>
      </div>
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
