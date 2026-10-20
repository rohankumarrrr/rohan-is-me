import React, { useEffect, useId, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import { motion, AnimatePresence, useReducedMotion, frame, cancelFrame } from 'framer-motion';
import { sections, splitDescription } from '../data/entries';
import { parsePost, readingTime } from '../data/posts';
import { arrival, linkTo } from '../hooks/useRoute';
import SwapText from './SwapText';
import './styles/Experiences.css';

// How long the cursor has to rest on a row before it opens. Without it,
// sweeping down this dense list flicks every row open on the way past.
const HOVER_OPEN_DELAY_MS = 100;

// A stat in a detail line: 500k+, ≈23m+, 96%+, 50-hour, 1tb, 3.86. The
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

// A company held more than once (an internship, then a full-time role) is
// shown once, as a line of its own over its roles, the way LinkedIn does.
// Titles are "role @ company"; each company's roles gather where its latest
// one sits, newest first, as the entries are ordered.
function groupRoles(items) {
  const groups = [];
  const byCompany = new Map();
  items.forEach((item, i) => {
    const at = item.title.lastIndexOf(' @ ');
    const company = at >= 0 ? item.title.slice(at + 3) : null;
    const member = { item, i, role: at >= 0 ? item.title.slice(0, at) : item.title };
    const group = company && byCompany.get(company);
    if (group) {
      group.members.push(member);
      return;
    }
    const fresh = { company, members: [member] };
    groups.push(fresh);
    if (company) byCompany.set(company, fresh);
  });
  return groups;
}

// ---- A role still to come, and the role I'm in ----
// An entry with `starts` instead of a period hasn't begun: it sits a step
// back, on a hollow dot, with "incoming" and the month as its date
// (Experiences.css). One whose period runs to "present" is current, marked
// .row--current for the design lab to try ways of making it stand out.
//
// The lab (dev only) is also trying the dates on a company line, and names
// its pick on <html data-lab-company-dates>. Production shows the first.
const LAB = process.env.NODE_ENV === 'development';
// What ships: the lab's picks when it isn't there to make them.
const LAB_DEFAULTS = {
  'company-dates': 'none',
  layout: 'side',
  fit: 'off',
  pretend: 'off',
  'side-switch': 'hover',
  'side-motion': 'y',
  'side-hint': 'end',
  'writing-name': 'writing',
  'writing-order': 'kinds',
  'writing-line': 'opening',
  'writing-label': 'tracked',
  'writing-words': 'standard',
};

function subscribeLab(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true });
  return () => observer.disconnect();
}
const subscribeNothing = () => () => {};

function useLabChoice(name) {
  return useSyncExternalStore(LAB ? subscribeLab : subscribeNothing, () =>
    (LAB && document.documentElement.getAttribute(`data-lab-${name}`)) || LAB_DEFAULTS[name]
  );
}

const periodOf = (entry) => (entry.starts ? `incoming ${entry.starts}` : entry.period);
const isCurrent = (entry) => !entry.starts && / – present$/.test(entry.period);

// The company line's dates, from its first role's start: to "present" while
// a role there is current or still to come ("open"), to the end of the last
// role that has started ("started"), or none at all.
function spanOf(members, companyDates) {
  if (companyDates === 'none') return null;
  const begun = members.filter((m) => !m.item.starts);
  const start = members[members.length - 1].item.period.split(' – ')[0];
  const latest = begun[0]?.item.period.split(' – ').pop();
  const end = companyDates === 'open' && members[0].item.starts ? 'present' : latest;
  return `${start} – ${end}`;
}

// `late`: mounted after the list's entrance has played (a list unfolding), so
// the row brings itself in instead of waiting for a cue that won't come.
const lateProps = (late) => (late ? { initial: 'hidden', animate: 'visible' } : {});

// `alwaysOpen`: the only entry in its section, so there's nothing to choose
// between and its details simply show. Its header sits under the title
// instead of taking the title's place.
function Row({
  entry,
  index,
  rowKey,
  isOpen,
  onOpen,
  onClose,
  onToggle,
  title = entry.title,
  arrived = false,
  late = false,
  alwaysOpen = false,
}) {
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
    if (e.pointerType !== 'mouse' || !expandable) return;
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
    if (!expandable || (e.detail !== 0 && lastPointerType.current === 'mouse')) return;
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
  const period = <span className="row-period">{periodOf(entry)}</span>;
  // A row with only a header has nothing to open onto: the header still swaps
  // in for the title, but the rows below stay where they are. A row with
  // neither is just a line, with nothing to toggle.
  const hasBody = details.length > 0 || entry.technologies?.length > 0;
  const expandable = !alwaysOpen && (Boolean(header) || hasBody);
  const bodyContent = (
    <>
      {header && !alwaysOpen && <p className="sr-only">{header}</p>}
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

  const Head = expandable ? 'button' : 'div';
  const headProps = expandable
    ? { type: 'button', className: 'row-head', 'aria-expanded': isOpen, 'aria-controls': bodyId }
    : { className: 'row-head row-head--static' };

  return (
    <motion.li
      className={`row${isOpen ? ' is-open' : ''}${entry.starts ? ' row--incoming' : ''}${isCurrent(entry) ? ' row--current' : ''}${arrived ? ' row--arrived' : ''}`}
      data-key={rowKey}
      variants={fadeIn}
      custom={index}
      {...lateProps(late)}
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
            <span className="sr-only">{title} (opens in a new tab)</span>
            <span className="row-link-line" aria-hidden="true">
              <SwapText from={title} to={header} active={isOpen} render={renderLinkText} />
            </span>
            <span ref={endRef} />
          </a>
          {leader}
          {period}
        </div>
      ) : (
        <Head ref={headRef} {...headProps}>
          <span ref={titleRef} className="row-title">
            {/* The visible text turns into the header while open; screen
                readers always get the title here and the header in the body. */}
            <span className="sr-only">{title}</span>
            <span aria-hidden="true">
              <SwapText from={title} to={header} active={isOpen && !alwaysOpen} />
            </span>
            <span ref={endRef} />
          </span>
          {leader}
          {period}
        </Head>
      )}

      {alwaysOpen && (
        <>
          {header && <p className="row-subline">{header}</p>}
          <div className="row-body row-body--static">{bodyContent}</div>
        </>
      )}
      <AnimatePresence initial={false}>
        {isOpen && hasBody && !alwaysOpen && (
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

// A row that is just a link out — used for papers.
function LinkRow({ entry, index, subline, late = false }) {
  const titleRef = useRef(null);
  const endRef = useRef(null);
  const reach = useLeaderReach(titleRef, endRef);
  return (
    <motion.li className="row row--link" variants={fadeIn} custom={index} {...lateProps(late)}>
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
      {subline && <p className="row-subline">{subline}</p>}
    </motion.li>
  );
}

// A post, as a row of the work list: its title opens it, turning the page.
// The title glides up into the post's heading (useRoute.js).
function PostRow({ post, index, rowKey, subline, arrived = false, late = false }) {
  const titleRef = useRef(null);
  const endRef = useRef(null);
  const reach = useLeaderReach(titleRef, endRef);
  const href = `/shower-thoughts/${post.slug}`;
  return (
    <motion.li
      className={`row row--link row--post${arrived ? ' row--arrived' : ''}`}
      data-key={rowKey}
      variants={fadeIn}
      custom={index}
      {...lateProps(late)}
    >
      <div className="row-head row-head--static">
        <a ref={titleRef} className="row-title row-title-link row-title-post" href={href} onClick={linkTo(href)}>
          <span className="row-link-line">
            <span className="row-post-name" data-vt={`post-${post.slug}`}>
              {post.title}
            </span>
          </span>
          <span className="row-post-arrow" aria-hidden="true">
            →
          </span>
          <span ref={endRef} />
        </a>
        <motion.span
          className="row-leader"
          aria-hidden="true"
          variants={drawIn}
          custom={index}
          style={leaderStyle(reach)}
        />
        <span className="row-period">{post.date}</span>
      </div>
      {subline && <p className="row-subline">{subline}</p>}
    </motion.li>
  );
}

const hoverCapable = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---- Layouts (design lab) ----
// Ways to keep the work page organised as every list grows, named on
// <html data-lab-layout>:
//   stack    every section in full, one under another (as it ships)
//   tabs     one strip of section names; one section showing
//   side     the section names down the left; one section beside them
//   columns  sections | entries | the hovered entry's details
//   split    experience on the left; the other sections tabbed on the right
// <html data-lab-fit="on"> caps a section's list at about a screen, scrolling
// inside; <html data-lab-pretend="on"> pads every list with placeholders, to
// see the page as it will be in a year or two. Under 900px wide, every
// layout but stack falls back to tabs.

const PRETEND = {
  experience: [
    ['course assistant @ uiuc', 'august 2023 – december 2023'],
    ['software engineer intern @ example co', 'june 2023 – august 2023'],
    ['web developer @ example studio', 'january 2023 – may 2023'],
  ].map(([title, period]) => ({
    title,
    period,
    description: '\n placeholder role \n\n a placeholder detail line, to show how the list holds up at size',
    technologies: ['placeholder'],
  })),
  writing: [
    ...[
      ['measuring what peer reviews miss', 'june 2026'],
      ['durable job queues for long-running agents', 'march 2026'],
      ['a dataset of confirmed web vulnerabilities', 'october 2025'],
    ].map(([title, period]) => ({ kind: 'link', title, period, link: 'https://dl.acm.org/', description: 'placeholder venue' })),
    ...[
      ['on reading code you didn\'t write', 'september 2026'],
      ['the agent wrote it; who owns it?', 'july 2026'],
      ['what a 50-hour stall taught me about queues', 'may 2026'],
      ['notes from a first security review', 'february 2026'],
      ['leaving chicago', 'november 2025'],
      ['why i keep a changelog for myself', 'june 2025'],
    ].map(([title, date], i) => ({ kind: 'post', slug: `placeholder-${i + 1}`, title, date, body: `${title}. a placeholder post.` })),
  ],
};

const withPretend = (section) =>
  PRETEND[section.id] ? { ...section, items: [...section.items, ...PRETEND[section.id]] } : section;

// The year an entry is filed under: the one it began in.
const yearOf = (item) => (item.date ?? item.starts ?? item.period).split(' – ')[0].split(' ').pop();

// When an entry began, as a number that sorts: 2026.09 for september 2026.
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const whenOf = (item) => {
  const [month, year] = (item.date ?? item.starts ?? item.period).split(' – ')[0].split(' ');
  return Number(year) + (MONTHS.indexOf(month) + 1) / 100;
};

// What an entry is: a paper ('link') or a post, in the writing section;
// otherwise whatever its section holds.
const kindOf = (section, item) => item.kind ?? section.kind;

const keyOf = (section, item, i) => (kindOf(section, item) === 'post' ? `${section.id}-${item.slug}` : `${section.id}-${i}`);

function useNarrow(query = '(max-width: 900px)') {
  const [narrow, setNarrow] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = (e) => setNarrow(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return narrow;
}

// The writing section's name, as the lab picks it.
const WRITING_NAMES = { writing: 'writing', words: 'words', ideas: 'ideas', both: 'papers & thoughts' };

// The kinds of writing, in the order they're listed, and what the lab can
// call them: one and many of each.
const KINDS = ['link', 'post'];
const KIND_WORDS = {
  standard: { link: ['paper', 'publications'], post: ['shower thought', 'shower thoughts'] },
  short: { link: ['paper', 'papers'], post: ['thought', 'thoughts'] },
  review: { link: ['peer reviewed', 'peer reviewed'], post: ['not peer reviewed', 'not peer reviewed'] },
  shower: { link: ['in print', 'in print'], post: ['in the shower', 'in the shower'] },
};

// A post's first sentence, in lowercase like the rest of the site.
const openingOf = (post) => {
  const first = parsePost(post.body.toLowerCase()).find((b) => b.type === 'p')?.text ?? '';
  const end = first.search(/[.?!](\s|$)/);
  return end < 0 ? first : first.slice(0, end + 1);
};

const NOUNS = {
  experience: ['role', 'roles'],
  education: ['school', 'schools'],
  writing: ['piece', 'pieces'],
};
const countOf = (sec) => `${sec.items.length} ${(NOUNS[sec.id] ?? ['', ''])[sec.items.length === 1 ? 0 : 1]}`;

// The section names as tabs, with a marker that slides to the one showing.
// Each carries its count three ways (a number, a leader running to it, and in
// words); the layout's styles pick which, if any, shows. Arrow keys move
// between them, as tabs should; with `hoverSwitch`, resting on one picks it.
function SectionNav({ list, active, onPick, vertical = false, id, hoverSwitch = false }) {
  const refs = useRef([]);
  const navRef = useRef(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const keys = vertical ? { ArrowDown: 1, ArrowUp: -1 } : { ArrowRight: 1, ArrowLeft: -1 };

  // A strip that scrolls sideways (on a phone) keeps the tab showing in view.
  // Only the strip scrolls; scrollIntoView would move the page too.
  const activeIndex = list.findIndex((sec) => sec.id === active);
  useEffect(() => {
    const nav = navRef.current;
    const tab = refs.current[activeIndex];
    if (vertical || !nav || !tab || nav.scrollWidth <= nav.clientWidth) return;
    const left = tab.getBoundingClientRect().left - nav.getBoundingClientRect().left + nav.scrollLeft;
    const right = left + tab.offsetWidth;
    if (left < nav.scrollLeft || right > nav.scrollLeft + nav.clientWidth) {
      nav.scrollTo({ left: Math.max(0, left - 16), behavior: 'smooth' });
    }
  }, [activeIndex, vertical]);

  return (
    <div
      ref={navRef}
      className={`work-nav${vertical ? ' work-nav--vertical' : ''}`}
      role="tablist"
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
    >
      {list.map((sec, i) => {
        const selected = sec.id === active;
        return (
          <button
            key={sec.id}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="tab"
            id={`${id}-tab-${sec.id}`}
            aria-selected={selected}
            aria-controls={`${id}-panel`}
            tabIndex={selected ? 0 : -1}
            className="work-nav-tab"
            onClick={() => onPick(sec.id)}
            onMouseEnter={
              hoverSwitch
                ? () => {
                    clearTimeout(timer.current);
                    timer.current = setTimeout(() => onPick(sec.id), HOVER_OPEN_DELAY_MS + 20);
                  }
                : undefined
            }
            onMouseLeave={hoverSwitch ? () => clearTimeout(timer.current) : undefined}
            onKeyDown={(e) => {
              const step = keys[e.key];
              if (!step) return;
              e.preventDefault();
              const next = (i + step + list.length) % list.length;
              onPick(list[next].id);
              refs.current[next]?.focus();
            }}
          >
            <span className="work-nav-label">
              {sec.heading}
              {selected && (
                <motion.span
                  layoutId={`${id}-marker`}
                  className="work-nav-marker"
                  aria-hidden="true"
                  transition={{ type: 'spring', stiffness: 520, damping: 42 }}
                />
              )}
            </span>
            <span className="sr-only">, {countOf(sec)}</span>
            <span className="work-nav-leader" aria-hidden="true" />
            <span className="work-nav-count" aria-hidden="true">
              {sec.items.length}
            </span>
            <span className="work-nav-noun" aria-hidden="true">
              {countOf(sec)}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// A panel's way in and out: a short slide along `axis` ('x' or 'y') in the
// direction the tabs moved, or a crossfade ('fade').
const panelMotion = {
  hidden: ({ dir, axis }) => (axis === 'fade' ? { opacity: 0 } : { opacity: 0, [axis]: 14 * dir }),
  visible: { opacity: 1, x: 0, y: 0, transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit: ({ dir, axis }) =>
    axis === 'none'
      ? { opacity: 0, transition: { duration: 0 } }
      : axis === 'fade'
        ? { opacity: 0, transition: { duration: 0.14 } }
        : { opacity: 0, [axis]: -10 * dir, transition: { duration: 0.14 } },
};

// An entry's details, for the details column and the compact lists.
function EntryDetails({ section, item, small = false }) {
  if (kindOf(section, item) === 'link') {
    return (
      <div className={`entry-details${small ? ' entry-details--small' : ''}`}>
        {item.description && <p className="entry-header">{item.description}</p>}
        <a className="text-link entry-go" href={item.link} target="_blank" rel="noopener noreferrer">
          read the paper ↗
        </a>
      </div>
    );
  }
  if (kindOf(section, item) === 'post') {
    const first = parsePost(item.body.toLowerCase()).find((b) => b.type === 'p')?.text ?? '';
    const href = `/shower-thoughts/${item.slug}`;
    return (
      <div className={`entry-details${small ? ' entry-details--small' : ''}`}>
        <p className="entry-header">{readingTime(item.body)}</p>
        <p className="entry-excerpt">{first}</p>
        <a className="text-link entry-go" href={href} onClick={linkTo(href)}>
          read it →
        </a>
      </div>
    );
  }
  const { header, details } = splitDescription(item.description);
  return (
    <div className={`entry-details${small ? ' entry-details--small' : ''}`}>
      {header && <p className="entry-header">{header}</p>}
      {details.length > 0 && (
        <ul className="row-bullets">
          {details.map((detail, i) => (
            <li key={i}>{emphasize(detail)}</li>
          ))}
        </ul>
      )}
      {item.technologies?.length > 0 && (
        <ul className="row-tech" aria-label="technologies">
          {item.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// A section as a compact list: each entry's title over its date, no leaders,
// so it fits a narrow column. Pointing at an entry picks it (`onPick`);
// `inline` opens the picked entry's details under it instead of elsewhere.
function CompactList({ section, picked, onPick, inline = false, companyDates }) {
  const entry = (item, i, title = item.title) => {
    const key = keyOf(section, item, i);
    const isPicked = picked === key;
    const classes = `entry${isPicked ? ' is-picked' : ''}${item.starts ? ' row--incoming' : ''}${
      section.id === 'experience' && isCurrent(item) ? ' row--current' : ''
    }`;
    const go =
      kindOf(section, item) === 'post'
        ? { href: `/shower-thoughts/${item.slug}`, onClick: linkTo(`/shower-thoughts/${item.slug}`) }
        : kindOf(section, item) === 'link'
          ? { href: item.link, target: '_blank', rel: 'noopener noreferrer' }
          : null;
    const Tag = go ? 'a' : 'button';
    return (
      <li key={key} className={classes}>
        <Tag
          className="entry-head"
          {...(go ?? { type: 'button', 'aria-expanded': inline ? isPicked : undefined })}
          onMouseEnter={() => onPick(key)}
          onFocus={() => onPick(key)}
          onClick={go ? go.onClick : () => onPick(inline && isPicked ? null : key)}
        >
          <span className="row-title entry-title">{title}</span>
          <span className="entry-when">{item.date ?? periodOf(item)}</span>
        </Tag>
        {inline && (
          <AnimatePresence initial={false}>
            {isPicked && (
              <motion.div
                className="entry-inline"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto', transition: { duration: 0.25 } }}
                exit={{ opacity: 0, height: 0, transition: { duration: 0.15 } }}
                style={{ overflow: 'hidden' }}
              >
                <EntryDetails section={section} item={item} small />
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </li>
    );
  };

  if (section.kind) {
    const out = [];
    let last = null;
    const spansYears = new Set(section.items.map(yearOf)).size > 1;
    section.items.forEach((item, i) => {
      if (spansYears && yearOf(item) !== last) {
        last = yearOf(item);
        out.push(
          <li key={`year-${last}`} className="work-year" aria-hidden="true">
            {last}
          </li>
        );
      }
      out.push(entry(item, i));
    });
    return <ul className="entries">{out}</ul>;
  }

  return (
    <ul className="entries">
      {groupRoles(section.items).map(({ company, members }) =>
        members.length === 1 ? (
          entry(members[0].item, members[0].i)
        ) : (
          <li key={`group-${members[0].i}`} className="entry-group">
            <span className="entry-company">{company}</span>
            {spanOf(members, companyDates) && <span className="entry-when">{spanOf(members, companyDates)}</span>}
            <ul className="entries entry-roles">{members.map(({ item, i, role }) => entry(item, i, role))}</ul>
          </li>
        )
      )}
    </ul>
  );
}

export default function Experiences() {
  const colRef = useRef(null);
  const [paddingTop, setPaddingTop] = useState(null);

  // Back from a post on one of its experiences: that row comes into view,
  // marked for a moment, and on a touchscreen, where there's no hovering to
  // read it, open. The page turn has already shown the list, so it skips its
  // entrance.
  const [arrived] = useState(() => ({ ...arrival }));
  useEffect(() => {
    Object.assign(arrival, { key: null, quiet: false });
  }, []);
  const [openKey, setOpenKey] = useState(() => (arrived.key && !hoverCapable() ? arrived.key : null));
  const [markedKey, setMarkedKey] = useState(arrived.key);
  useEffect(() => {
    if (!markedKey) return undefined;
    const timer = setTimeout(() => setMarkedKey(null), 2000);
    return () => clearTimeout(timer);
  }, [markedKey]);

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
  const companyDates = useLabChoice('company-dates');

  // ---- the lab's layout ----
  const narrow = useNarrow();
  const picked = useLabChoice('layout');
  const layout = narrow && picked !== 'stack' ? 'tabs' : picked;
  const fit = useLabChoice('fit') === 'on';
  const sideSwitch = useLabChoice('side-switch');
  const sideMotion = useLabChoice('side-motion');
  const sideHint = useLabChoice('side-hint');
  const pretend = useLabChoice('pretend') === 'on';
  const writingName = WRITING_NAMES[useLabChoice('writing-name')] ?? 'writing';
  const writingOrder = useLabChoice('writing-order');
  const writingLine = useLabChoice('writing-line');
  const writingLabel = useLabChoice('writing-label');
  const kindWords = KIND_WORDS[useLabChoice('writing-words')] ?? KIND_WORDS.standard;
  // Whether the line under a paper or a post starts by saying which it is:
  // when nothing else in the list does.
  const sayKind = writingOrder === 'date' || writingLabel === 'none';
  const all = (pretend ? sections.map(withPretend) : sections).map((sec) =>
    sec.id === 'writing' ? { ...sec, heading: writingName } : sec
  );
  const others = all.filter((sec) => sec.id !== 'experience');

  // Which section a tabbed layout shows, which way the last switch went, and
  // whether there has been one (the first panel arrives with the page's own
  // entrance; later ones bring themselves in). Back from a post, it's the
  // section of the row it came back to.
  const arrivedIn = all.find((sec) => arrived.key?.startsWith(`${sec.id}-`))?.id;
  const [tab, setTab] = useState(arrivedIn ?? all[0].id);
  const [sideTab, setSideTab] = useState(arrivedIn && arrivedIn !== 'experience' ? arrivedIn : others[0].id);
  const [dir, setDir] = useState(1);
  const [switched, setSwitched] = useState(false);
  const pick = (list, current, set) => (id) => {
    if (id === current) return;
    setDir(list.findIndex((sec) => sec.id === id) > list.findIndex((sec) => sec.id === current) ? 1 : -1);
    setSwitched(true);
    set(id);
  };

  // Two of the side layout's ways to show that rows open: the role I'm in
  // starts open ('open'), or opens itself for a moment the first time the
  // list comes into view, unless the reader has already started pointing
  // ('peek').
  const currentIndex = all[0].items.findIndex((item) => isCurrent(item));
  const currentKey = currentIndex >= 0 ? `experience-${currentIndex}` : null;
  const touched = useRef(false);
  const peeked = useRef(false);
  useEffect(() => {
    if (layout !== 'side' || sideHint !== 'open' || !currentKey || !canHover) return;
    setOpenKey((key) => key ?? currentKey);
  }, [layout, sideHint, currentKey, canHover]);
  useEffect(() => {
    const col = colRef.current;
    if (layout !== 'side' || sideHint !== 'peek' || !currentKey || peeked.current || !col) return undefined;
    let timer;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || peeked.current) return;
        peeked.current = true;
        observer.disconnect();
        timer = setTimeout(() => {
          if (touched.current) return;
          setOpenKey((key) => key ?? currentKey);
          timer = setTimeout(() => {
            if (!touched.current) setOpenKey((key) => (key === currentKey ? null : key));
          }, 2400);
        }, 800);
      },
      { threshold: 0.4 }
    );
    observer.observe(col);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, [layout, sideHint, currentKey]);

  // The columns layout's picked entry, per section: the current role first.
  const [pickedEntry, setPickedEntry] = useState({});
  const defaultPick = (section) => {
    if (section.id === 'experience') {
      const i = section.items.findIndex((item) => isCurrent(item));
      if (i >= 0) return keyOf(section, section.items[i], i);
    }
    return section.items[0] ? keyOf(section, section.items[0], 0) : null;
  };

  // Centre the list on its collapsed height. Centring on its live height
  // would make an opening row grow the list in both directions, sliding the
  // rows above it — including the one under the cursor — upward. Subtracting
  // the open bodies keeps the offset fixed, so rows only ever push downward.
  //
  // A tabbed layout isn't centred at all: its panels differ in height, and
  // re-centring on each switch would move the tabs out from under the cursor.
  // It sits a fixed way down the screen instead (.work--anchored).
  const anchored = layout !== 'stack';
  useLayoutEffect(() => {
    const col = colRef.current;
    if (!col) return undefined;
    if (anchored) {
      setPaddingTop(null);
      return undefined;
    }
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
  }, [anchored, layout]);

  // Once the list has its final padding, put the row it came back to a little
  // above the middle of the screen, or nearer the top when it's open, to
  // leave room for its details. A tabbed layout comes no higher than the top
  // of its page, where it rests, so its tabs show. This runs inside the page
  // turn's update, so the turn lands on the row where it will stay.
  const broughtIn = useRef(false);
  useLayoutEffect(() => {
    if (!arrived.key || (paddingTop == null && !anchored) || broughtIn.current) return;
    broughtIn.current = true;
    const col = colRef.current;
    const head = col?.querySelector(`[data-key="${arrived.key}"] > .row-head`);
    const page = col?.closest('.work-page');
    const floor = anchored && page ? page.getBoundingClientRect().top + window.scrollY : 0;
    if (!head) {
      if (anchored) window.scrollTo(0, floor);
      return;
    }
    const top = head.getBoundingClientRect().top + window.scrollY;
    const from = openKey === arrived.key ? 0.18 : 0.38;
    window.scrollTo(0, Math.max(floor, top - window.innerHeight * from));
    (head.matches('a, button') ? head : head.querySelector('a, button'))?.focus({ preventScroll: true });
  }, [arrived.key, paddingTop, openKey, anchored]);

  // Running position of each animated element down the page.
  let position = 0;

  const rowProps = (section, i) => {
    const key = `${section.id}-${i}`;
    return {
      rowKey: key,
      isOpen: openKey === key,
      onOpen: () => openRow(key),
      onClose: () => closeRow(key),
      onToggle: (head) => toggleRow(key, head),
      arrived: markedKey === key,
    };
  };

  const renderGroups = (section, groups) =>
    groups.map(({ company, members }) => {
      if (members.length === 1) {
        const { item, i } = members[0];
        const solo = section.items.length === 1;
        return <Row key={i} entry={item} index={position++} {...rowProps(section, i)} alwaysOpen={solo} />;
      }
      const headPosition = position++;
      const span = spanOf(members, companyDates);
      return (
        <motion.li key={`group-${members[0].i}`} className="row-group" variants={fadeIn} custom={headPosition}>
          {/* The leader stays mounted when there are no dates, only hidden:
              one mounted after the entrance has played would stay undrawn. */}
          <div className={`row-head row-head--static row-group-head${span ? '' : ' row-group-head--bare'}`}>
            <span className="row-title">{company}</span>
            <motion.span className="row-leader" aria-hidden="true" variants={drawIn} custom={headPosition} />
            <span className="row-period">{span}</span>
          </div>
          <ul className="rows row-group-roles">
            {members.map(({ item, i, role }) => (
              <Row key={i} entry={item} index={position++} {...rowProps(section, i)} title={role} />
            ))}
          </ul>
        </motion.li>
      );
    });

  // The line under a paper or a post, as the degree sits under education's
  // title: a paper's venue; a line from a post, or how long it takes to
  // read. In one list by date, it starts by saying which of the two it is.
  const sublineOf = (item) => {
    let line;
    if (item.kind === 'link') line = item.description;
    else if (writingLine === 'time') line = readingTime(item.body);
    else if (writingLine === 'quote' && item.quote) line = `“${item.quote.toLowerCase()}”`;
    else line = openingOf(item);
    if (writingLabel === 'tag' && writingOrder !== 'date') {
      return (
        <>
          <span className="row-tag">{kindWords[item.kind][0]}</span>
          {line}
        </>
      );
    }
    return sayKind ? `${kindWords[item.kind][0]} · ${line}` : line;
  };

  const renderItem = (section, item, i) => {
    const key = keyOf(section, item, i);
    if (kindOf(section, item) === 'link') {
      return <LinkRow key={key} entry={item} index={position++} subline={sublineOf(item)} />;
    }
    return (
      <PostRow key={key} post={item} index={position++} rowKey={key} subline={sublineOf(item)} arrived={markedKey === key} />
    );
  };

  // A year over the entries that began in it, once a list spans more than one.
  const withYears = (section) => {
    const years = new Set(section.items.map(yearOf));
    if (years.size < 2) return section.items.map((item, i) => renderItem(section, item, i));
    const out = [];
    let last = null;
    section.items.forEach((item, i) => {
      const year = yearOf(item);
      if (year !== last) {
        last = year;
        out.push(
          <motion.li key={`year-${year}`} className="work-year" variants={fadeIn} custom={position++} aria-hidden="true">
            {year}
          </motion.li>
        );
      }
      out.push(renderItem(section, item, i));
    });
    return out;
  };

  // Writing, either as its two kinds, each under its name, newest first
  // within it; or as one list, newest first, with the years over it. The
  // lab names how a kind's name is set (writingLabel): as a label over its
  // entries (styled in Experiences.css, a note in the margin among them), as
  // a company line with its entries on the rail, as a tag on each entry's
  // line, or not at all, the kinds parted by a gap or an asterism.
  const renderWriting = (section) => {
    const items = section.items.map((item, i) => ({ item, i })).sort((a, b) => whenOf(b.item) - whenOf(a.item));
    if (writingOrder === 'date') {
      return withYears({ ...section, items: items.map(({ item }) => item) });
    }
    let shown = 0;
    return KINDS.flatMap((kind) => {
      const ofKind = items.filter(({ item }) => item.kind === kind);
      if (!ofKind.length) return [];
      const name = kindWords[kind][1];
      const labelPosition = position++;
      const rows = ofKind.map(({ item, i }) => renderItem(section, item, i));
      shown += 1;
      if (writingLabel === 'rail') {
        return [
          <motion.li key={`kind-${kind}`} className="row-group work-kind-group" variants={fadeIn} custom={labelPosition}>
            <div className="row-head row-head--static row-group-head row-group-head--bare">
              <span className="row-title">{name}</span>
              <span className="row-leader" aria-hidden="true" />
              <span className="row-period" />
            </div>
            <ul className="rows row-group-roles">{rows}</ul>
          </motion.li>,
        ];
      }
      if (writingLabel === 'none' || writingLabel === 'tag') {
        return shown > 1 ? [<li key={`kind-${kind}`} className="work-kind-gap" aria-hidden="true" />, ...rows] : rows;
      }
      if (writingLabel === 'asterism') {
        return [
          <motion.li key={`kind-${kind}`} className="work-kind-break" variants={fadeIn} custom={labelPosition}>
            <span className="sr-only">{name}</span>
            {shown > 1 && <span aria-hidden="true">⁂</span>}
          </motion.li>,
          ...rows,
        ];
      }
      const rule = (side) => (
        <motion.span
          className={`work-kind-rule work-kind-rule--${side}`}
          aria-hidden="true"
          variants={drawIn}
          custom={labelPosition}
        />
      );
      return [
        <motion.li key={`kind-${kind}`} className={`work-kind work-kind--${writingLabel}`} variants={fadeIn} custom={labelPosition}>
          {rule('before')}
          <span className="work-kind-name">{name}</span>
          {rule('after')}
          <span className="work-kind-count" aria-hidden="true">
            {ofKind.length}
          </span>
        </motion.li>,
        ...rows,
      ];
    });
  };

  const renderRows = (section) =>
    section.kind === 'writing' ? renderWriting(section) : renderGroups(section, groupRoles(section.items));

  const hint = <span className="work-hint">{canHover ? 'hover for details' : 'tap for details'}</span>;

  const heading = (section, withHint) => {
    const headingPosition = position++;
    return (
      <motion.div className="work-heading-row" variants={fadeIn} custom={headingPosition}>
        <h2 id={`work-${section.id}`} className="work-heading">
          {section.heading}
        </h2>
        {withHint && hint}
        <motion.span className="work-rule" aria-hidden="true" variants={drawIn} custom={headingPosition} />
      </motion.div>
    );
  };

  // A tab's panel. The first arrives with the page's own entrance; after a
  // switch, each new one slides in by itself, its rows counting their
  // stagger from zero.
  const panel = (section, id, content) => {
    if (switched) position = 0;
    const axis = layout === 'side' ? sideMotion : 'x';
    const motionOf = { dir, axis };
    // With no motion, the new panel and its rows are simply there.
    const own = !switched ? {} : axis === 'none' ? { initial: 'visible', animate: 'visible' } : { initial: 'hidden', animate: 'visible' };
    return (
      <AnimatePresence mode="wait" initial={false} custom={motionOf}>
        <motion.div
          key={section.id}
          id={`${id}-panel`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${section.id}`}
          className={`work-panel${fit ? ' is-fit' : ''}`}
          variants={panelMotion}
          custom={motionOf}
          exit="exit"
          {...own}
        >
          {content(section)}
        </motion.div>
      </AnimatePresence>
    );
  };

  const navRow = (list, active, onPick, id, vertical = false) => {
    const navPosition = position++;
    return (
      <motion.div
        className={`work-nav-row${vertical ? ' work-nav-row--vertical' : ''}`}
        variants={fadeIn}
        custom={navPosition}
      >
        <SectionNav list={list} active={active} onPick={onPick} vertical={vertical} id={id} />
        {!vertical && <motion.span className="work-rule" aria-hidden="true" variants={drawIn} custom={navPosition} />}
      </motion.div>
    );
  };

  const rowsOf = (section) => <ul className="rows">{renderRows(section)}</ul>;

  let body;
  if (layout === 'tabs') {
    const active = all.find((sec) => sec.id === tab) ?? all[0];
    body = (
      <>
        {navRow(all, active.id, pick(all, active.id, setTab), 'work')}
        {panel(active, 'work', rowsOf)}
      </>
    );
  } else if (layout === 'side') {
    // The names down the left, staying put as the list scrolls; the hint
    // under them while the section showing has rows to open.
    const active = all.find((sec) => sec.id === tab) ?? all[0];
    const opens = !active.kind && active.items.length > 1;
    body = (
      <div className="work-side">
        <motion.div className="work-side-nav" variants={fadeIn} custom={position++}>
          <div className="work-side-nav-inner">
            <SectionNav
              list={all}
              active={active.id}
              onPick={pick(all, active.id, setTab)}
              vertical
              id="work"
              hoverSwitch={sideSwitch === 'hover' && canHover}
            />
            <p className={`work-hint work-side-hint${opens ? '' : ' is-hidden'}`}>
              {canHover ? 'hover for details' : 'tap for details'}
            </p>
          </div>
        </motion.div>
        <div className="work-side-main">
          {panel(active, 'work', (sec) => (
            <>
              <h3 className="work-side-heading">{sec.heading}</h3>
              {rowsOf(sec)}
              <p className={`work-end-hint${opens ? '' : ' is-hidden'}`}>
                {canHover ? 'hover for details' : 'tap for details'}
              </p>
            </>
          ))}
        </div>
      </div>
    );
  } else if (layout === 'columns') {
    const active = all.find((sec) => sec.id === tab) ?? all[0];
    const key = pickedEntry[active.id] ?? defaultPick(active);
    const index = active.items.findIndex((item, i) => keyOf(active, item, i) === key);
    const item = active.items[index];
    body = (
      <div className="work-columns">
        {navRow(all, active.id, pick(all, active.id, setTab), 'work', true)}
        <div className="work-columns-list">
          {panel(active, 'work', (sec) => (
            <CompactList
              section={sec}
              picked={key}
              onPick={(k) => k && setPickedEntry((m) => ({ ...m, [sec.id]: k }))}
              companyDates={companyDates}
            />
          ))}
        </div>
        <motion.div className="work-columns-detail" variants={fadeIn} custom={position++} aria-live="polite">
          {item && (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
            >
              <p className="entry-detail-title">{item.title}</p>
              <p className="entry-when">{item.date ?? periodOf(item)}</p>
              <EntryDetails section={active} item={item} />
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  } else if (layout === 'split') {
    const experience = all[0];
    const active = others.find((sec) => sec.id === sideTab) ?? others[0];
    const key = pickedEntry[active.id] ?? null;
    body = (
      <div className="work-split">
        <section className="work-group work-split-main" aria-labelledby="work-experience">
          {heading(experience, true)}
          {rowsOf(experience)}
        </section>
        <div className="work-split-side">
          {navRow(others, active.id, pick(others, active.id, setSideTab), 'side')}
          {panel(active, 'side', (sec) => (
            <CompactList
              section={sec}
              picked={key}
              inline
              onPick={(k) => setPickedEntry((m) => ({ ...m, [sec.id]: k }))}
              companyDates={companyDates}
            />
          ))}
        </div>
      </div>
    );
  } else {
    body = all.map((section, sectionIndex) => (
      <section key={section.id} className="work-group" aria-labelledby={`work-${section.id}`}>
        {heading(section, sectionIndex === 0)}
        <div className={fit ? 'work-panel is-fit' : undefined}>{rowsOf(section)}</div>
      </section>
    ));
  }

  return (
    <div
      className={`work${anchored ? ' work--anchored' : ''}`}
      style={paddingTop == null || anchored ? undefined : { paddingTop }}
    >
      {/* Like the home screen, this replays each time it scrolls into view.
          A new layout or arrangement from the lab mounts a fresh column,
          which plays again. */}
      <motion.div
        key={`${layout}-${pretend}-${writingOrder}-${writingLabel}`}
        ref={colRef}
        className="work-col"
        data-layout={layout}
        variants={{ hidden: {}, visible: {} }}
        initial={reduceMotion || arrived.quiet ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        onPointerMove={() => (touched.current = true)}
      >
        {body}
      </motion.div>
    </div>
  );
}
