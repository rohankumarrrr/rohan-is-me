import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from '@iconify-icon/react';
import { useTheme } from '../hooks/useTheme';
import { sections } from '../data/entries';
import './styles/DesignLab.css';

// Dev-only: a panel for trying typefaces and colours against the real page.
// App.js mounts it only under `npm start`, so none of this reaches the
// production bundle.

// ---------- type ----------

const googleFont = (query) =>
  `https://fonts.googleapis.com/css2?family=${query}&display=swap`;

// Fontshare (Indian Type Foundry) fonts are free for commercial use too.
// `@1,2` asks for the variable roman and italic.
const fontshare = (slug) =>
  `https://api.fontshare.com/v2/css?f%5B%5D=${slug}@1,2&display=swap`;

// `scale` is the root font size (%) each face starts at, chosen so it sits
// roughly level with Times on the page; the size slider takes over from there.
// Faces without an `href` are installed on the system and load nothing.
const FONTS = [
  { group: 'favorites', id: 'satoshi', label: 'Satoshi', family: "'Satoshi', sans-serif", href: fontshare('satoshi'), scale: 96, note: 'what the site uses today: a modernist grotesk (Fontshare)' },
  { group: 'favorites', id: 'times', label: 'Times New Roman', family: "'Times New Roman', Times, Georgia, serif", scale: 100, note: "the site's previous face" },
  { group: 'favorites', id: 'mona', label: 'Mona Sans', family: "'Mona Sans', sans-serif", href: googleFont('Mona+Sans:ital,wdth,wght@0,75..125,200..900;1,75..125,200..900'), scale: 94, note: "GitHub's variable grotesk, true italics" },
  { group: 'favorites', id: 'inter', label: 'Inter', family: "'Inter', sans-serif", href: googleFont('Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900'), scale: 92, note: 'the neutral standard; optical sizes for headings' },

  { group: 'sans', id: 'sf-pro', label: 'SF Pro (system)', family: "-apple-system, BlinkMacSystemFont, system-ui, sans-serif", scale: 94, note: 'loads nothing; Windows and Android get Segoe UI / Roboto instead' },
  { group: 'sans', id: 'helvetica-neue', label: 'Helvetica Neue (system)', family: "'Helvetica Neue', Helvetica, Arial, sans-serif", scale: 94, note: 'the classic neo-grotesk; Apple devices only' },
  { group: 'sans', id: 'geist', label: 'Geist', family: "'Geist', sans-serif", href: googleFont('Geist:wght@100..900'), scale: 94, note: "Vercel's grotesk, Inter-adjacent; no italics" },
  { group: 'sans', id: 'hubot', label: 'Hubot Sans', family: "'Hubot Sans', sans-serif", href: googleFont('Hubot+Sans:ital,wdth,wght@0,75..125,200..900;1,75..125,200..900'), scale: 94, note: "Mona Sans' more technical sibling" },
  { group: 'sans', id: 'switzer', label: 'Switzer', family: "'Switzer', sans-serif", href: fontshare('switzer'), scale: 94, note: 'Helvetica-lineage neo-grotesk, true italics (Fontshare)' },
  { group: 'sans', id: 'general-sans', label: 'General Sans', family: "'General Sans', sans-serif", href: fontshare('general-sans'), scale: 94, note: 'crisp grotesk with tight apertures (Fontshare)' },
  { group: 'sans', id: 'instrument-sans', label: 'Instrument Sans', family: "'Instrument Sans', sans-serif", href: googleFont('Instrument+Sans:ital,wdth,wght@0,75..100,400..700;1,75..100,400..700'), scale: 96, note: 'compact grotesk, true italics' },
  { group: 'sans', id: 'public-sans', label: 'Public Sans', family: "'Public Sans', sans-serif", href: googleFont('Public+Sans:ital,wght@0,100..900;1,100..900'), scale: 94, note: 'neutral, slightly warmer than Inter' },
  { group: 'sans', id: 'plex-sans', label: 'IBM Plex Sans', family: "'IBM Plex Sans', sans-serif", href: googleFont('IBM+Plex+Sans:ital,wdth,wght@0,85..100,100..700;1,85..100,100..700'), scale: 94, note: 'engineered grotesk with a few quirks' },
  { group: 'sans', id: 'schibsted', label: 'Schibsted Grotesk', family: "'Schibsted Grotesk', sans-serif", href: googleFont('Schibsted+Grotesk:ital,wght@0,400..900;1,400..900'), scale: 96, note: 'newspaper grotesk, compact and sturdy' },
  { group: 'sans', id: 'figtree', label: 'Figtree', family: "'Figtree', sans-serif", href: googleFont('Figtree:ital,wght@0,300..900;1,300..900'), scale: 96, note: 'geometric and friendly' },

  { group: 'serif', id: 'stix', label: 'STIX Two Text', family: "'STIX Two Text', serif", href: googleFont('STIX+Two+Text:ital,wght@0,400..700;1,400..700'), scale: 98, note: 'the nearest thing to a modern Times' },
  { group: 'serif', id: 'source-serif', label: 'Source Serif 4', family: "'Source Serif 4', serif", href: googleFont('Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900'), scale: 96, note: "Adobe's transitional serif with optical sizes" },
  { group: 'serif', id: 'libre-caslon', label: 'Libre Caslon Text', family: "'Libre Caslon Text', serif", href: googleFont('Libre+Caslon+Text:ital,wght@0,400;0,700;1,400'), scale: 92, note: 'Caslon: the older, warmer ancestor of Times' },
  { group: 'serif', id: 'newsreader', label: 'Newsreader', family: "'Newsreader', serif", href: googleFont('Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800'), scale: 100, note: 'editorial serif with optical sizes' },
  { group: 'serif', id: 'eb-garamond', label: 'EB Garamond', family: "'EB Garamond', serif", href: googleFont('EB+Garamond:ital,wght@0,400..800;1,400..800'), scale: 106, note: 'old-style; softer and more bookish than Times' },
  { group: 'serif', id: 'crimson', label: 'Crimson Pro', family: "'Crimson Pro', serif", href: googleFont('Crimson+Pro:ital,wght@0,200..900;1,200..900'), scale: 108, note: 'book serif, lighter and more elegant than Times' },
  { group: 'serif', id: 'spectral', label: 'Spectral', family: "'Spectral', serif", href: googleFont('Spectral:ital,wght@0,300;0,400;0,500;0,600;1,400'), scale: 96, note: 'screen-first serif, airy and refined' },
  { group: 'serif', id: 'literata', label: 'Literata', family: "'Literata', serif", href: googleFont('Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900'), scale: 96, note: 'built for long reading (Google Play Books)' },
  { group: 'serif', id: 'pt-serif', label: 'PT Serif', family: "'PT Serif', serif", href: googleFont('PT+Serif:ital,wght@0,400;0,700;1,400;1,700'), scale: 96, note: 'sturdy and plain-spoken' },
  { group: 'serif', id: 'charter', label: 'Charter (system)', family: "Charter, 'Bitstream Charter', serif", scale: 96, note: 'ships with macOS; free to self-host for everyone else' },
  { group: 'serif', id: 'georgia', label: 'Georgia (system)', family: "Georgia, serif", scale: 94, note: 'the classic screen serif, installed nearly everywhere' },
];

const GROUPS = [
  ['favorites', 'your favorites'],
  ['sans', 'more like Inter / Mona Sans'],
  ['serif', 'more like Times'],
];

const WEIGHTS = [
  [400, 'regular'],
  [500, 'medium'],
  [600, 'semibold'],
  [700, 'bold'],
  [800, 'ultrabold'],
];

// ---------- colour ----------

// Backgrounds and text colours to try for each mode; the first of each list
// is what index.css ships.
const SHADES = {
  light: {
    bgs: [
      ['#fcfcfc', 'soft white (current)'],
      ['#ffffff', 'pure white'],
      ['#f6f8fa', 'github (cool)'],
      ['#f2f5f8', 'vinskal (cool)'],
      ['#eef2f6', 'mist (cool)'],
      ['#f5f5f5', 'neutral grey'],
      ['#fafaf9', 'stone (warm)'],
      ['#f7f5f0', 'paper (warm)'],
      ['#f4efe6', 'linen (warm)'],
      ['#fbf8f1', 'cream (warm)'],
    ],
    texts: [
      ['#262626', 'soft black (current)'],
      ['#000000', 'black'],
      ['#111111', 'near black'],
      ['#1f2328', 'github ink (cool)'],
      // The dark canvas turned around: the light pair mirrors the dark one.
      ['#0d1117', 'github canvas (cool)'],
      ['#2b2a27', 'warm ink'],
      ['#3a3a3a', 'graphite'],
    ],
  },
  dark: {
    bgs: [
      ['#0d1117', 'github (current)'],
      ['#000000', 'pure black'],
      ['#0a0a0a', 'near black'],
      ['#111111', 'ink'],
      ['#121212', 'material dark'],
      ['#161616', 'graphite'],
      ['#18181b', 'zinc'],
      ['#1c1c1d', "cliff's charcoal"],
      ['#1e1e1e', 'vs code'],
      ['#11151c', 'blue-black'],
      ['#1a1917', 'warm charcoal'],
      ['#1c1917', 'stone (warm)'],
      ['#171412', 'espresso'],
    ],
    texts: [
      ['#f2f2f2', 'soft white (current)'],
      ['#e8e8e8', "cliff's grey"],
      ['#ffffff', 'white'],
      ['#d6d6d6', 'dim'],
      ['#ede6db', 'warm paper'],
    ],
  },
};

// Link colours as light-mode / dark-mode pairs. Every light value clears
// 4.5:1 on white and every dark value on each dark background above.
const LINK_COLORS = [
  { id: 'none', label: 'none: text colour (current)', light: null, dark: null },
  // The apple ✦ link styles' palette (AI_LIGHT / AI_DARK below) held still:
  // each mode's stops averaged in OKLab, so the hue is the gradient's visual
  // centre, with chroma set to the stops' mean so the blend doesn't go grey.
  { id: 'apple', label: 'apple ✦ static (palette average)', light: '#951eaf', dark: '#e68dde' },
  { id: 'cliff', label: "cliff's magenta / teal", light: '#b509ac', dark: '#2698ba' },
  { id: 'classic', label: 'classic blue', light: '#0645ad', dark: '#7aa7ff' },
  { id: 'cobalt', label: 'cobalt', light: '#2563eb', dark: '#60a5fa' },
  { id: 'klein', label: 'klein blue', light: '#002fa7', dark: '#8ea2ff' },
  { id: 'indigo', label: 'indigo', light: '#4f46e5', dark: '#a5b4fc' },
  { id: 'violet', label: 'violet', light: '#7c3aed', dark: '#c4b5fd' },
  { id: 'teal', label: 'teal', light: '#0f766e', dark: '#5eead4' },
  { id: 'forest', label: 'forest', light: '#2f6b3a', dark: '#8fd19e' },
  { id: 'rust', label: 'rust', light: '#b5452c', dark: '#f0987a' },
  { id: 'orange', label: 'orange', light: '#c2410c', dark: '#fb923c' },
  { id: 'crimson', label: 'crimson', light: '#b91c1c', dark: '#f87171' },
  { id: 'slate', label: 'slate', light: '#5b6472', dark: '#9aa4b2' },
];

// The links in the prose and the resume · email · … row. Each style gets
// the link selectors and their :hover counterparts.
const LINK_SELECTORS = ['.inline-link', '.text-link'].map((s) => `html body ${s}`);
const tint = (pct) => `color-mix(in srgb, currentColor ${pct}%, transparent)`;

// The Apple Intelligence look: the Writing Tools palette flowing through the
// letters under a fine grain. Dark mode takes Apple's own pastels with a white
// sparkle and a glow. Light mode can't borrow either effect: white specks
// punch holes in dark letters and a glow on white reads as blur. So it runs
// deeper jewel tones with dark grain and no glow. Its weakest point along the
// gradient, grain included, is 6.7:1 on white, the margin the pastels keep on
// the darkest backgrounds.
const AI_LIGHT = ['#4338ca', '#6d28d9', '#7e22ce', '#a21caf', '#be185d', '#be123c'];
const AI_DARK = ['#8d9fff', '#bc82f3', '#c686ff', '#f5b9ea', '#ff6778', '#ffba71'];
const AI_TILE = '14em'; // one full pass through the palette
const AI_EDGE = '2.5em'; // the soft front of the shimmer sweep

// Sparse specks in one shade (1 = white, 0 = black): fractal noise, visible
// only where its red channel runs high. These numbers mark about 15% of
// pixels, at 7% opacity on average.
const grain = (shade) => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${shade} 0 0 0 0 ${shade} 0 0 0 0 ${shade} 7 0 0 0 -4.3'/></filter><rect width='100%' height='100%' filter='url(#g)'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};
const AI_GRADIENT = `linear-gradient(90deg, ${AI_LIGHT.map((_, i) => `var(--ai-${i})`).join(', ')}, var(--ai-0))`;

// How fast the shimmer sweeps through a word, and the underline grows with it.
const AI_SWEEP = '0.55s cubic-bezier(0.4, 0.05, 0.25, 1)';

// The three layers clipped to the letters, top first: a cover in the plain
// link colour (only the shimmer styles give it any size), the grain, then the
// palette. Only the palette moves.
const textLayers = (cover) => [
  { image: `linear-gradient(90deg, transparent, var(--lab-ink) ${AI_EDGE})`, size: cover, position: '100% 0', repeat: 'no-repeat', clip: 'text' },
  { image: 'var(--ai-grain)', size: '120px 120px', position: '0 0', repeat: 'repeat', clip: 'text' },
  { image: AI_GRADIENT, size: `${AI_TILE} 100%`, position: '0 0', repeat: 'repeat-x', clip: 'text' },
];
// A cover sized to hide the palette entirely, its soft front parked just
// past the left edge.
const COVER_FULL = `calc(100% + ${AI_EDGE}) 100%`;

// Underline layers to stack above the letters' layers, drawn below the text
// rather than clipped to it: a faint line in the link colour, and over it a
// line in the palette that is `grown` across.
const lineLayers = (grown) => [
  { image: `linear-gradient(90deg, ${AI_LIGHT.map((_, i) => `var(--ai-${i})`).join(', ')})`, size: `${grown} 1px`, position: '0 100%', repeat: 'no-repeat', clip: 'padding-box' },
  { image: `linear-gradient(${tint(28)}, ${tint(28)})`, size: '100% 1px', position: '0 100%', repeat: 'no-repeat', clip: 'padding-box' },
];

const layerList = (layers, key) => layers.map((l) => l[key]).join(', ');

// The base rule also covers :hover, so it outranks index.css's hover rule
// for the shipped link lines; a style's own hover rule still follows it.
const aiBase = (a, h, layers) => `
:root { ${AI_LIGHT.map((c, i) => `--ai-${i}: ${c};`).join(' ')} --ai-grain: ${grain(0)}; --ai-glow: transparent; }
html[data-theme="dark"] { ${AI_DARK.map((c, i) => `--ai-${i}: ${c};`).join(' ')} --ai-grain: ${grain(1)}; --ai-glow: rgb(198 134 255 / 0.45); }
@keyframes ai-flow {
  from { background-position: ${layerList(layers, 'position')}; }
  to { background-position: ${layers.map((l, i) => (i === layers.length - 1 ? `${AI_TILE} 0` : l.position)).join(', ')}; }
}
${a}, ${h} {
  text-decoration: none;
  -webkit-text-fill-color: transparent;
  background-image: ${layerList(layers, 'image')};
  background-size: ${layerList(layers, 'size')};
  background-position: ${layerList(layers, 'position')};
  background-repeat: ${layerList(layers, 'repeat')};
  -webkit-background-clip: ${layerList(layers, 'clip')};
  background-clip: ${layerList(layers, 'clip')};
  animation: ai-flow 8s linear infinite;
}
@media (prefers-reduced-motion: reduce) {
  ${a} { animation: none; transition: none; }
}`;

const AI_GLOW = 'filter: drop-shadow(0 0 0.3em var(--ai-glow));';

const LINK_STYLES = [
  { id: 'grow', label: 'line grows on hover (current)', css: () => '' },
  {
    id: 'underline',
    label: 'thin underline (previous)',
    css: (a, h) => `${a} { text-decoration: underline; text-underline-offset: 3px; }
${h} { opacity: 0.6; }`,
  },
  {
    id: 'ai-flow',
    label: 'apple ✦ always flowing',
    css: (a, h) => `${aiBase(a, h, textLayers('0 0'))}
${h} { ${AI_GLOW} opacity: 1; }`,
  },
  {
    id: 'ai-hover',
    label: 'apple ✦ flows on hover',
    css: (a, h) => `${aiBase(a, h, textLayers('0 0'))}
${a} { animation-play-state: paused; }
${h} { animation-play-state: running; ${AI_GLOW} opacity: 1; }`,
  },
  {
    // Plain at rest; hovering sweeps the colour through the word from the
    // left, like text Writing Tools has just rewritten.
    id: 'ai-shimmer',
    label: 'apple ✦ shimmer through on hover',
    css: (a, h) => `${aiBase(a, h, textLayers(COVER_FULL))}
${a}, ${h} {
  text-decoration: underline;
  text-underline-offset: 3px;
  animation-play-state: paused;
  transition: background-size ${AI_SWEEP}, filter ${AI_SWEEP}, text-decoration-color ${AI_SWEEP};
}
${h} { background-size: ${layerList(textLayers('0 100%'), 'size')}; animation-play-state: running; ${AI_GLOW} text-decoration-color: var(--ai-1); opacity: 1; }`,
  },
  {
    // The shimmer with "line grows on hover" for its underline: a faint line
    // at rest, and on hover a line in the palette grows from the left in step
    // with the colour sweeping through the letters above it.
    id: 'ai-shimmer-grow',
    label: 'apple ✦ shimmer + line grows on hover',
    css: (a, h) => `${aiBase(a, h, [...lineLayers('0%'), ...textLayers(COVER_FULL)])}
${a} {
  padding-bottom: 2px;
  animation-play-state: paused;
  transition: background-size ${AI_SWEEP}, filter ${AI_SWEEP};
}
${h} { background-size: ${layerList([...lineLayers('100%'), ...textLayers('0 100%')], 'size')}; animation-play-state: running; ${AI_GLOW} opacity: 1; }`,
  },
  {
    id: 'hover',
    label: 'underline on hover (cliff)',
    css: (a, h) => `${a} { text-decoration: none; }
${h} { text-decoration: underline; opacity: 1; }`,
  },
  {
    id: 'dotted',
    label: 'dotted underline',
    css: (a) => `${a} { text-decoration: underline dotted; text-decoration-thickness: 1.5px; text-underline-offset: 4px; }`,
  },
  {
    id: 'wavy',
    label: 'wavy underline',
    css: (a) => `${a} { text-decoration: underline wavy ${tint(60)}; text-decoration-thickness: 1px; text-underline-offset: 4px; }`,
  },
  {
    id: 'soft',
    label: 'soft thick underline',
    css: (a, h) => `${a} { text-decoration: underline ${tint(22)}; text-decoration-thickness: 0.4em; text-underline-offset: -0.22em; text-decoration-skip-ink: none; }
${h} { text-decoration-color: ${tint(40)}; opacity: 1; }`,
  },
  {
    id: 'highlight',
    label: 'highlighter',
    css: (a, h) => `${a} { text-decoration: none; background-color: ${tint(13)}; border-radius: 0.2em; padding: 0 0.12em; -webkit-box-decoration-break: clone; box-decoration-break: clone; }
${h} { background-color: ${tint(26)}; opacity: 1; }`,
  },
  {
    id: 'fill',
    label: 'ink fills on hover',
    css: (a, h) => `${a} { text-decoration: none; padding: 0 0.1em; margin: 0 -0.1em; transition: background-size 0.25s ease, color 0.25s ease;
  background: linear-gradient(var(--lab-ink), var(--lab-ink)) 0 100% / 100% 1px no-repeat; }
${h} { background-size: 100% 100%; color: var(--bg-primary); opacity: 1; }`,
  },
];

// ---------- theme toggle ----------

// Stand-ins for the navbar's toggle. The lab draws the chosen one into the
// navbar and hides the shipped one. Like the shipped one, each face shows the
// mode a press switches to.
const TOGGLES = [
  { id: 'half', label: 'half-filled circle (current)' },
  { id: 'phosphor-bold', label: 'phosphor bold sun / moon (previous)' },
  { id: 'phosphor-light', label: 'phosphor light sun / moon' },
  { id: 'lucide', label: 'lucide sun / moon (hairline)' },
  { id: 'morph', label: 'sun that morphs into a moon' },
  { id: 'switch', label: 'tiny switch' },
  { id: 'text', label: 'the word: "dark" / "light"' },
  { id: 'key', label: 'keycap: t' },
];
const SHIPPED_TOGGLE = TOGGLES[0].id;

// A sun whose rays fold away as a second circle bites it into a crescent.
// The geometry moves in DesignLab.css; this only sets which shape to show.
function MorphIcon({ shape }) {
  return (
    <svg className="lab-morph" data-shape={shape} viewBox="0 0 24 24" aria-hidden="true">
      <mask id="lab-morph-mask">
        <rect width="24" height="24" fill="#fff" />
        <circle className="lab-morph-bite" cx="17" cy="7" r="7" fill="#000" />
      </mask>
      <circle className="lab-morph-core" cx="12" cy="12" r="8" fill="currentColor" mask="url(#lab-morph-mask)" />
      <g className="lab-morph-rays" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line key={deg} x1="12" y1="1.8" x2="12" y2="3.6" transform={`rotate(${deg} 12 12)`} />
        ))}
      </g>
    </svg>
  );
}

function LabToggle({ variant }) {
  const { theme, toggleTheme } = useTheme();
  const [host, setHost] = useState(null);
  useEffect(() => setHost(document.querySelector('.navbar')), []);
  const next = theme === 'dark' ? 'light' : 'dark';
  const faces = {
    'phosphor-bold': <Icon icon={next === 'light' ? 'ph:sun-bold' : 'ph:moon-bold'} width="1em" height="1em" />,
    'phosphor-light': <Icon icon={next === 'light' ? 'ph:sun-light' : 'ph:moon-light'} width="1em" height="1em" />,
    lucide: <Icon icon={next === 'light' ? 'lucide:sun' : 'lucide:moon'} width="1em" height="1em" />,
    morph: <MorphIcon shape={next === 'light' ? 'sun' : 'moon'} />,
    switch: (
      <span className="lab-switch" aria-hidden="true">
        <span className="lab-switch-knob" />
      </span>
    ),
    text: <span>{next}</span>,
    key: <kbd className="lab-toggle-key">t</kbd>,
  };
  if (!host || !faces[variant]) return null;
  const isSwitch = variant === 'switch';

  return createPortal(
    <button
      type="button"
      className={`theme-toggle lab-toggle lab-toggle--${variant}`}
      onClick={toggleTheme}
      aria-label={isSwitch ? 'Dark theme' : 'Toggle theme'}
      aria-keyshortcuts="t"
      title="Toggle theme (T)"
      {...(isSwitch && { role: 'switch', 'aria-checked': theme === 'dark' })}
    >
      {faces[variant]}
    </button>,
    host
  );
}

// ---------- expanded details ----------

// Ways to set an open row's details apart from the rest of the page. The
// first option of each control is what Experiences.css ships; each control
// works on its own, and the presets are starting combinations.
const DETAIL_CONTROLS = [
  ['dTone', 'text', [['muted', 'muted (current)'], ['page', 'same as the page']]],
  ['dEmphasis', 'emphasis', [['both', 'lead words + stats (current)'], ['lead', 'lead words'], ['numbers', 'stats'], ['none', 'none']]],
  ['dMarkers', 'markers', [['number', 'numbers: 01, 02 (current)'], ['disc', 'dots'], ['dash', 'dashes'], ['none', 'none, spaced apart']]],
  ['dContainer', 'container', [['none', 'nothing (current)'], ['rule', 'rule on the left'], ['panel', 'soft panel']]],
  ['dSpacing', 'spacing', [['airy', 'airy, shorter lines (current)'], ['compact', 'compact']]],
  ['dTech', 'tech', [['dots', 'dot separated (current)'], ['comma', 'comma list'], ['chips', 'chips'], ['hidden', 'hidden']]],
];

const DETAIL_PRESETS = [
  { id: 'current', label: 'current', set: { dTone: 'muted', dEmphasis: 'both', dMarkers: 'number', dContainer: 'none', dSpacing: 'airy', dTech: 'dots' } },
  { id: 'previous', label: 'previous: plain, dots, left rule', set: { dTone: 'page', dEmphasis: 'none', dMarkers: 'disc', dContainer: 'rule', dSpacing: 'compact', dTech: 'comma' } },
  { id: 'quiet', label: 'quiet: dashes, chips', set: { dTone: 'muted', dEmphasis: 'lead', dMarkers: 'dash', dContainer: 'rule', dSpacing: 'airy', dTech: 'chips' } },
  { id: 'card', label: 'card: a soft panel', set: { dTone: 'muted', dEmphasis: 'both', dMarkers: 'number', dContainer: 'panel', dSpacing: 'airy', dTech: 'chips' } },
];

// The page's ink mixed into its background: lower is fainter.
const ink = (pct) => `color-mix(in srgb, var(--text-primary) ${pct}%, var(--bg-primary))`;

function detailsCss(s) {
  const body = 'html body .row-body';
  const list = 'html body .row-bullets';
  const item = `${list} li`;
  const tech = 'html body .row-tech';
  const plain = (sel) => `${sel} { font-weight: inherit; color: inherit; }`;
  const out = [];
  if (s.dTone === 'page') out.push(`${item}, ${tech} { color: var(--text-primary); }`);
  if (s.dEmphasis === 'none' || s.dEmphasis === 'numbers') out.push(plain('html body .row-lead'));
  if (s.dEmphasis === 'none' || s.dEmphasis === 'lead') out.push(plain('html body .row-stat'));
  if (s.dMarkers === 'disc') out.push(`${list} { list-style-type: disc; padding-left: 1.2em; } ${item}::marker { font-size: inherit; color: inherit; }`);
  if (s.dMarkers === 'dash') out.push(`${list} { list-style-type: '–  '; padding-left: 1.2em; }`);
  if (s.dMarkers === 'none') out.push(`${list} { list-style: none; padding-left: 0; } ${item} { margin-bottom: 1.4vh; }`);
  if (s.dContainer === 'rule') out.push(`${body} { margin-left: 0.2em; padding-left: 1.1em; border-left: 1px solid var(--border); }`);
  if (s.dContainer === 'panel') {
    out.push(`${body} { margin: 0.6vh 0 1.6vh; padding: 1.4vh 1.2em; border-radius: 10px; background: ${ink(4)}; }`);
  }
  if (s.dSpacing === 'compact') out.push(`${item} { line-height: 1.6; margin-bottom: 0.5vh; } ${list} { max-width: none; } ${tech} { margin-top: 1.2vh; }`);
  if (s.dTech === 'comma') out.push(`${tech} li:not(:last-child)::after { content: ', '; }`);
  if (s.dTech === 'chips') {
    out.push(`${tech} { display: flex; flex-wrap: wrap; gap: 6px; font-style: normal; }
${tech} li { padding: 0.15em 0.65em; border: 1px solid var(--border); border-radius: 999px; }
${tech} li::after { content: none !important; }`);
  }
  if (s.dTech === 'hidden') out.push(`${tech} { display: none; }`);
  return out.join('\n');
}

// The rows that open, as [key, title]: every experience and education entry.
const PREVIEW_ROWS = sections
  .filter((sec) => !sec.kind)
  .flatMap((sec) => sec.items.map((item, i) => [`${sec.id}-${i}`, item.title]));

// Opens a row and leaves it open while the panel is in use: the same tap a
// touchscreen makes, which holds a row open until it is tapped again.
function holdRowOpen(key) {
  const li = document.querySelector(`.work li.row[data-key="${key}"]`);
  if (!li) return;
  if (!li.classList.contains('is-open')) {
    li.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerType: 'touch' }));
    li.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }));
  }
  setTimeout(() => li.scrollIntoView({ block: 'center', behavior: 'smooth' }), 50);
}

// ---------- roles ----------

const COMPANY_DATES = [
  ['none', 'no dates on the company line (current)'],
  ['open', 'from its first role to present'],
  ['started', 'from its first role to the end of the last begun'],
];

// ---------- layouts ----------

// Ways to keep the work page organised as every list grows. Experiences.js
// reads the picks from <html data-lab-layout>, data-lab-fit and
// data-lab-pretend; the first layout is what ships.
const LAYOUTS = [
  { id: 'side', label: 'tabs down the side (current)', note: 'the section names down the left, staying put as you scroll; the section showing beside them' },
  { id: 'stack', label: 'stacked sections (previous)', note: 'every section in full, one under another: the page grows with every entry' },
  { id: 'tabs', label: 'tabs', note: 'one strip of section names with counts; one section showing, the line under the strip sliding to it. ← → move between tabs' },
  { id: 'columns', label: 'three columns', note: 'sections | entries | details: point at an entry and its details show on the right. Nothing ever expands, so nothing ever moves' },
  { id: 'split', label: 'experience + a tabbed column', note: 'experience in full on the left; education and writing tabbed in a narrow column on the right' },
];

// ---------- writing ----------

// Papers and shower thoughts, in one section. Experiences.js reads the picks
// from <html data-lab-writing-name>, data-lab-writing-order and
// data-lab-writing-line; the first of each is what ships.
const WRITING_CONTROLS = [
  ['wName', 'name', 'writing-name', [['writing', 'writing'], ['words', 'words'], ['ideas', 'ideas'], ['both', 'papers & thoughts']]],
  ['wOrder', 'arrange', 'writing-order', [['kinds', 'publications, then shower thoughts, each under its name'], ['date', 'one list, newest first; the line under says which']]],
  ['wMark', 'kind names', 'writing-label', [
    ['tracked', 'small, upright, spaced out (current)'],
    ['margin', 'a note in the right margin, by its first entry'],
    ['heading', 'a subheading: italic, full ink'],
    ['count', 'a line with a leader to how many'],
    ['tag', 'a small tag on each entry\'s line'],
    ['asterism', 'no names: ⁂ between the two'],
    ['centred', 'centred between hairlines'],
    ['rail', 'like a company line, entries on its rail (seen)'],
    ['ruled', 'with a hairline to the dates (seen)'],
    ['none', 'none: a gap, the line under says which (seen)'],
    ['italic', 'small italic (seen)'],
  ]],
  ['wWords', 'kind words', 'writing-words', [
    ['standard', 'publications / shower thoughts'],
    ['short', 'papers / thoughts'],
    ['review', 'peer reviewed / not peer reviewed'],
    ['shower', 'in print / in the shower'],
  ]],
  ['wLine', 'post line', 'writing-line', [['opening', 'its first sentence (current)'], ['quote', 'a line from it, in quotes'], ['time', 'how long it takes to read']]],
];

// The side layout, taken further. Each control works on its own; the
// presets are starting combinations. Switching and motion are behaviour,
// named on <html data-lab-side-switch> and data-lab-side-motion for
// Experiences.js; everything else is CSS, below.
const SIDE_CONTROLS = [
  ['sCount', 'numbers', [['none', 'none'], ['right', 'muted, at the right'], ['leader', 'dotted leader to the number'], ['hover', 'only while hovered'], ['words', 'in words, under the name'], ['super', 'superscript (previous)']]],
  ['sMarker', 'showing', [['ink', 'full ink, nothing else'], ['bar', 'a bar beside it (current)'], ['line', 'a line under the name'], ['arrow', 'an arrow beside it'], ['pill', 'a soft highlight behind it'], ['rule', 'a line drawn across to the list']]],
  ['sAlign', 'names', [['left', 'flush left'], ['right', 'flush right, against the list']]],
  ['sPlace', 'place', [['centred', 'names + list centred together'], ['hang', 'list in its usual column, names in the margin']]],
  ['sDivider', 'divider', [['none', 'none'], ['rule', 'a thin rule between']]],
  ['sHeading', 'over list', [['none', 'nothing'], ['rule', 'a rule, level with the names'], ['heading', 'the section name, as a heading']]],
  ['sType', 'type', [['italic', 'italic, like the headings'], ['roman', 'upright'], ['small', 'smaller']]],
  ['sSwitch', 'switch on', [['click', 'click'], ['hover', 'hover (a short rest)']]],
  ['sMotion', 'motion', [['y', 'slides up or down, with the tabs'], ['x', 'slides sideways (previous)'], ['fade', 'crossfade'], ['none', 'none']]],
  ['sHint', 'hint', [['end', '"hover for details", after the list'], ['plus', 'a + by each row, turning to ×'], ['chevron', 'a › by each row, turning down'], ['peek', 'the current role opens by itself, once'], ['open', 'the current role starts open'], ['none', 'nothing'], ['margin', '"hover for details", under the names (previous)']]],
];

const SIDE_PRESETS = [
  { id: 'current', label: 'current', set: { sCount: 'none', sMarker: 'bar', sAlign: 'right', sPlace: 'hang', sDivider: 'none', sHeading: 'rule', sType: 'italic', sSwitch: 'hover', sMotion: 'y', sHint: 'end' } },
  { id: 'quiet', label: 'quiet: names only, in the margin', set: { sCount: 'none', sMarker: 'ink', sAlign: 'right', sPlace: 'hang', sDivider: 'none', sHeading: 'none', sType: 'italic', sSwitch: 'hover', sMotion: 'y' } },
  { id: 'connected', label: 'connected: a line runs to the list', set: { sCount: 'none', sMarker: 'rule', sAlign: 'right', sPlace: 'hang', sDivider: 'rule', sHeading: 'none', sType: 'italic', sSwitch: 'hover', sMotion: 'y' } },
  { id: 'contents', label: 'contents: dotted leaders, like the rows', set: { sCount: 'leader', sMarker: 'ink', sAlign: 'left', sPlace: 'centred', sDivider: 'none', sHeading: 'rule', sType: 'italic', sSwitch: 'click', sMotion: 'y' } },
  { id: 'index', label: 'index: counts in words, a heading', set: { sCount: 'words', sMarker: 'bar', sAlign: 'right', sPlace: 'centred', sDivider: 'rule', sHeading: 'heading', sType: 'roman', sSwitch: 'click', sMotion: 'fade' } },
  { id: 'previous', label: 'previous', set: { sCount: 'super', sMarker: 'bar', sAlign: 'left', sPlace: 'centred', sDivider: 'none', sHeading: 'none', sType: 'italic', sSwitch: 'click', sMotion: 'x' } },
];

function sideCss(s) {
  const COL = 'html body .work-col[data-layout="side"]';
  const NAV = `${COL} .work-nav--vertical`;
  const out = [];
  const right = s.sAlign === 'right';
  const small = `align-self: baseline; font-size: 0.72rem; font-style: normal; vertical-align: 0; opacity: 0.5;`;

  if (s.sCount === 'none') out.push(`${NAV} .work-nav-count { display: none; }`);
  if (s.sCount === 'right') out.push(`${NAV} .work-nav-count { ${small} margin-${right ? 'right' : 'left'}: auto; }`);
  if (s.sCount === 'leader') out.push(`${NAV} .work-nav-leader { display: block; } ${NAV} .work-nav-count { ${small} }`);
  if (s.sCount === 'hover') {
    out.push(`${NAV} .work-nav-count { ${small} margin-${right ? 'right' : 'left'}: auto; opacity: 0; transition: opacity 0.2s ease; }
${NAV} .work-nav-tab:hover .work-nav-count, ${NAV} .work-nav-tab:focus-visible .work-nav-count { opacity: 0.5; }`);
  }
  if (s.sCount === 'words') out.push(`${NAV} .work-nav-count { display: none; } ${NAV} .work-nav-noun { display: block; }`);

  if (right) {
    out.push(`${NAV} .work-nav-tab { flex-direction: row-reverse; text-align: right; }
${NAV} .work-nav-noun { text-align: right; }
${COL} .work-side-hint { text-align: right; }
${NAV} .work-nav-marker { left: auto; right: -0.9em; }`);
  }

  const marker = `${NAV} .work-nav-marker`;
  if (s.sMarker === 'ink' || s.sMarker === 'rule') out.push(`${marker} { display: none; }`);
  if (s.sMarker === 'line') out.push(`${marker} { left: 0; right: 0; top: auto; bottom: -0.12em; width: auto; height: 1px; }`);
  if (s.sMarker === 'arrow') {
    out.push(`${marker} { left: auto; right: calc(100% + 0.5em); top: 0; bottom: auto; width: auto; height: auto; background: none; font-style: normal; }
${marker}::before { content: '→'; }`);
    if (right) out.push(`${marker} { right: auto; left: calc(100% + 0.5em); } ${marker}::before { content: '←'; }`);
  }
  if (s.sMarker === 'pill') {
    out.push(`${marker} { left: -0.45em; right: -0.45em; top: -0.1em; bottom: -0.12em; width: auto; height: auto; z-index: -1; border-radius: 6px; background: color-mix(in srgb, var(--text-primary) 8%, var(--bg-primary)); }`);
  }
  if (s.sMarker === 'rule') {
    // From the name to the list, drawn as it's picked. Flush right, it runs
    // across the gap from the name's end; flush left, a leader carries it
    // the rest of the way.
    const draw = `transform-origin: left center; animation: lab-rule-draw 0.45s cubic-bezier(0.22, 1, 0.36, 1);`;
    if (right) {
      out.push(`${NAV} .work-nav-tab[aria-selected="true"] .work-nav-label::after { content: ''; position: absolute; left: calc(100% + 0.5em); top: 58%; width: calc(var(--side-gap) - 0.5em); height: 1px; background: var(--text-primary); opacity: 0.6; ${draw} }`);
    } else {
      out.push(`${NAV} .work-nav-tab[aria-selected="true"] .work-nav-leader { display: block; border-bottom-style: solid; opacity: 0.6; margin-right: calc(0.4em - var(--side-gap)); ${draw} }
${NAV} .work-nav-tab[aria-selected="true"] .work-nav-count { display: none; }`);
    }
    out.push(`@keyframes lab-rule-draw { from { transform: scaleX(0); } }`);
  }

  if (s.sPlace === 'hang') {
    out.push(`@media (min-width: 1180px) {
  ${COL} { max-width: 640px; }
  ${COL} .work-side { display: block; position: relative; }
  ${COL} .work-side-nav { position: absolute; top: 0; bottom: 0; right: calc(100% + var(--side-gap)); width: 190px; }
}`);
  }
  if (s.sDivider === 'rule') out.push(`${COL} .work-side-main { min-height: 100%; padding-left: 2.2rem; border-left: 1px solid var(--border); } ${COL} .work-side { --side-gap: 2.2rem; }`);
  if (s.sHeading === 'rule') out.push(`${COL} .work-side-main { padding-top: 1.6vh; border-top: 1px solid var(--border); } ${COL} .work-side-nav-inner { padding-top: 1.6vh; }`);
  if (s.sHeading === 'heading') out.push(`${COL} .work-side-heading { display: block; }`);
  if (s.sType === 'roman') out.push(`${NAV} .work-nav-tab { font-style: normal; }`);
  if (s.sType === 'small') out.push(`${NAV} .work-nav-tab { font-size: 0.95rem; } ${NAV} { gap: 0.9vh; }`);

  // Saying that rows open. Every way but the old one hides the margin hint.
  if (s.sHint !== 'margin') out.push(`${COL} .work-side-hint { display: none; }`);
  if (s.sHint === 'end') out.push(`${COL} .work-end-hint { display: block; }`);
  if (s.sHint === 'plus' || s.sHint === 'chevron') {
    // Hung in the right margin, so the dates stay in line with the rows that
    // have nothing to open.
    const glyph = s.sHint === 'plus' ? "'+'" : "'›'";
    const turned = s.sHint === 'plus' ? 'rotate(45deg)' : 'rotate(90deg)';
    out.push(`${COL} button.row-head::after { content: ${glyph}; position: absolute; right: -1.5em; top: 50%; width: 1em; text-align: center; font-size: 0.95rem; font-style: normal; line-height: 1; color: color-mix(in srgb, var(--text-primary) 45%, var(--bg-primary)); transform: translateY(-50%); transition: transform 0.25s ease, color 0.2s ease; }
${COL} .row:hover > button.row-head::after { color: var(--text-primary); }
${COL} .row.is-open > button.row-head::after { transform: translateY(-50%) ${turned}; color: var(--text-primary); }`);
  }

  return out.join('\n');
}

// ---------- state ----------

const STORAGE_KEY = 'design-lab';
const DEFAULTS = {
  open: true,
  tab: 'type',
  body: 'satoshi',
  heading: 'same',
  weight: 400,
  size: null,
  italics: true,
  lightBg: SHADES.light.bgs[0][0],
  lightText: SHADES.light.texts[0][0],
  darkBg: SHADES.dark.bgs[0][0],
  darkText: SHADES.dark.texts[0][0],
  linkLight: null,
  linkDark: null,
  linkStyle: 'grow',
  indexLinks: false,
  toggle: SHIPPED_TOGGLE,
  companyDates: COMPANY_DATES[0][0],
  layout: LAYOUTS[0].id,
  fit: false,
  pretend: false,
  ...SIDE_PRESETS[0].set,
  ...DETAIL_PRESETS[0].set,
  ...Object.fromEntries(WRITING_CONTROLS.map(([key, , , options]) => [key, options[0][0]])),
};

const byId = (id) => FONTS.find((f) => f.id === id) ?? FONTS[0];

function loadState() {
  try {
    // Picks made before the colour tab existed were saved as 'fontlab'.
    const saved = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem('fontlab');
    const state = { ...DEFAULTS, ...JSON.parse(saved) };
    // A saved pick a control no longer offers falls back to what ships.
    for (const [key, , options] of DETAIL_CONTROLS) {
      if (!options.some(([value]) => value === state[key])) state[key] = DEFAULTS[key];
    }
    if (!TOGGLES.some((t) => t.id === state.toggle)) state.toggle = DEFAULTS.toggle;
    if (!COMPANY_DATES.some(([id]) => id === state.companyDates)) state.companyDates = DEFAULTS.companyDates;
    if (!LAYOUTS.some((l) => l.id === state.layout)) state.layout = DEFAULTS.layout;
    for (const [key, , options] of SIDE_CONTROLS) {
      if (!options.some(([value]) => value === state[key])) state[key] = DEFAULTS[key];
    }
    for (const [key, , , options] of WRITING_CONTROLS) {
      if (!options.some(([value]) => value === state[key])) state[key] = DEFAULTS[key];
    }
    return state;
  } catch {
    return DEFAULTS;
  }
}

// Fetch a face the first time it's picked, so browsing the list only costs
// the fonts actually looked at.
const loaded = new Set();
function ensureLoaded(font) {
  if (!font.href || loaded.has(font.href)) return;
  loaded.add(font.href);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = font.href;
  document.head.appendChild(link);
}

function overridesCss(state, body, heading, size) {
  const linkStyle = LINK_STYLES.find((s) => s.id === state.linkStyle) ?? LINK_STYLES[0];
  const hovers = LINK_SELECTORS.map((s) => `${s}:hover`).join(', ');
  const parts = [
    `html { font-size: ${size}%; }`,
    `html body { font-family: ${body.family}; }`,
    `html body h1, html body .work-heading { font-family: ${heading.family}; font-weight: ${state.weight}; }`,
    state.italics ? '' : 'html body * { font-style: normal !important; }',
  ];
  // A mode's shades are overridden only once they differ from what ships.
  for (const mode of ['light', 'dark']) {
    const [bg, text] = [state[`${mode}Bg`], state[`${mode}Text`]];
    if (bg === DEFAULTS[`${mode}Bg`] && text === DEFAULTS[`${mode}Text`]) continue;
    parts.push(`html[data-theme="${mode}"] {
  --bg-primary: ${bg};
  --text-primary: ${text};
  --border: color-mix(in srgb, ${text} 16%, ${bg});
}`);
  }
  // --lab-ink is the link colour, or the text colour when links have none.
  parts.push(
    state.linkLight
      ? `:root { --lab-ink: ${state.linkLight}; } html[data-theme="dark"] { --lab-ink: ${state.linkDark}; }`
      : ':root { --lab-ink: var(--text-primary); }',
    `${LINK_SELECTORS.join(', ')} { color: var(--lab-ink); }`,
    // Any other style starts from bare text: off with the shipped lines.
    linkStyle.id === 'grow'
      ? ''
      : `${LINK_SELECTORS.join(', ')} { background: none; padding-bottom: 0; transition: none; }`,
    linkStyle.css(LINK_SELECTORS.join(', '), hovers)
  );
  if (state.indexLinks) {
    // The title's text, line and icon all take their colour from its wrapper.
    parts.push('html body .is-external .row-link-line { color: var(--lab-ink); }');
  }
  if (state.toggle !== SHIPPED_TOGGLE) parts.push('html body .navbar .theme-toggle:not(.lab-toggle) { display: none; }');
  parts.push(detailsCss(state));
  if (state.layout === 'side') parts.push(sideCss(state));
  return parts.join('\n');
}

const fontOptions = GROUPS.map(([key, label]) => (
  <optgroup key={key} label={label}>
    {FONTS.filter((f) => f.group === key).map((f) => (
      <option key={f.id} value={f.id}>
        {f.label}
      </option>
    ))}
  </optgroup>
));

export default function DesignLab() {
  const [state, setState] = useState(loadState);
  const update = (patch) => setState((s) => ({ ...s, ...patch }));
  const { theme, toggleTheme } = useTheme();
  const showTheme = (mode) => {
    if (theme !== mode) toggleTheme();
  };

  const body = byId(state.body);
  // Headings follow the body unless set, or if a saved pick has left the list.
  const heading = FONTS.find((f) => f.id === state.heading) ?? body;
  const size = state.size ?? body.scale;

  // The overrides live in one <style> tag, with selectors one step more
  // specific than the site's own so they win regardless of injection order.
  useEffect(() => {
    ensureLoaded(body);
    ensureLoaded(heading);
    let tag = document.getElementById('design-lab-overrides');
    if (!tag) {
      tag = document.createElement('style');
      tag.id = 'design-lab-overrides';
      document.head.appendChild(tag);
    }
    tag.textContent = overridesCss(state, body, heading, size);
    // Swapping between faces that are already loaded fires no font event, so
    // nudge anything that measures text (the row leaders) to measure again.
    window.dispatchEvent(new Event('resize'));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage blocked: the choice just won't survive a reload.
    }
  }, [state, body, heading, size]);

  useEffect(() => () => document.getElementById('design-lab-overrides')?.remove(), []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-lab-company-dates', state.companyDates);
    root.setAttribute('data-lab-layout', state.layout);
    root.setAttribute('data-lab-fit', state.fit ? 'on' : 'off');
    root.setAttribute('data-lab-pretend', state.pretend ? 'on' : 'off');
    root.setAttribute('data-lab-side-switch', state.sSwitch);
    root.setAttribute('data-lab-side-motion', state.sMotion);
    root.setAttribute('data-lab-side-hint', state.sHint);
    root.setAttribute('data-lab-writing-name', state.wName);
    root.setAttribute('data-lab-writing-order', state.wOrder);
    root.setAttribute('data-lab-writing-line', state.wLine);
    root.setAttribute('data-lab-writing-label', state.wMark);
    root.setAttribute('data-lab-writing-words', state.wWords);
  }, [state.companyDates, state.layout, state.fit, state.pretend, state.sSwitch, state.sMotion, state.sHint, state.wName, state.wOrder, state.wLine, state.wMark, state.wWords]);
  useEffect(
    () => () => {
      for (const name of ['company-dates', 'layout', 'fit', 'pretend', 'side-switch', 'side-motion', 'side-hint', ...WRITING_CONTROLS.map(([, , attr]) => attr)]) {
        document.documentElement.removeAttribute(`data-lab-${name}`);
      }
    },
    []
  );

  // [ and ] step the body font through the list, for quick A/B flicking.
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.target.closest?.('input, select, textarea')) return;
      const step = e.key === ']' ? 1 : e.key === '[' ? -1 : 0;
      if (!step) return;
      setState((s) => {
        const i = FONTS.findIndex((f) => f.id === s.body);
        const next = FONTS[(i + step + FONTS.length) % FONTS.length];
        return { ...s, body: next.id, size: null };
      });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // The stand-in toggle stays in the navbar whether or not the panel is open.
  const toggle = <LabToggle variant={state.toggle} />;

  if (!state.open) {
    return (
      <>
        {toggle}
        <button type="button" className="lab-open" onClick={() => update({ open: true })} aria-label="Open design lab">
          Aa
        </button>
      </>
    );
  }

  const tabs = [
    ['type', 'type'],
    ['color', 'colour'],
    ['toggle', 'toggle'],
    ['details', 'details'],
    ['roles', 'roles'],
    ['writing', 'writing'],
    ['layout', 'layout'],
  ];

  return (
    <>
      {toggle}
      <aside className="lab" aria-label="Design lab">
        <div className="lab-head">
          <div className="lab-tabs" role="tablist">
            {tabs.map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                className="lab-tab"
                aria-selected={state.tab === id}
                onClick={() => update({ tab: id })}
              >
                {label}
              </button>
            ))}
          </div>
          <button type="button" className="lab-close" onClick={() => update({ open: false })} aria-label="Close design lab">
            ×
          </button>
        </div>

        {state.tab === 'type' && <TypeTab state={state} update={update} body={body} size={size} />}
        {state.tab === 'color' && <ColorTab state={state} update={update} theme={theme} showTheme={showTheme} />}
        {state.tab === 'toggle' && <ToggleTab state={state} update={update} />}
        {state.tab === 'details' && <DetailsTab state={state} update={update} />}
        {state.tab === 'roles' && <RolesTab state={state} update={update} />}
        {state.tab === 'writing' && <WritingTab state={state} update={update} />}
        {state.tab === 'layout' && <LayoutTab state={state} update={update} />}
      </aside>
    </>
  );
}

function SideControls({ state, update }) {
  const preset =
    SIDE_PRESETS.find((p) => Object.entries(p.set).every(([key, value]) => state[key] === value))?.id ?? 'custom';
  return (
    <>
      <hr className="lab-rule" />
      <label className="lab-field">
        <span>preset</span>
        <select
          value={preset}
          onChange={(e) => {
            const picked = SIDE_PRESETS.find((p) => p.id === e.target.value);
            if (picked) update(picked.set);
          }}
        >
          {SIDE_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
          {preset === 'custom' && <option value="custom">custom</option>}
        </select>
      </label>
      {SIDE_CONTROLS.map(([key, label, options]) => (
        <label key={key} className="lab-field">
          <span>{label}</span>
          <select value={state[key]} onChange={(e) => update({ [key]: e.target.value })}>
            {options.map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
      ))}
      <p className="lab-note">names in the margin need a window at least 1180px wide; narrower, they sit beside the list</p>
      <hr className="lab-rule" />
    </>
  );
}

function LayoutTab({ state, update }) {
  const picked = LAYOUTS.find((l) => l.id === state.layout) ?? LAYOUTS[0];
  return (
    <>
      <div className="lab-field lab-field--top">
        <span>work page</span>
        <div className="lab-options">
          {LAYOUTS.map((l) => (
            <label key={l.id} className="lab-check">
              <input type="radio" name="lab-layout" checked={state.layout === l.id} onChange={() => update({ layout: l.id })} />
              <span>{l.label}</span>
            </label>
          ))}
        </div>
      </div>
      <p className="lab-note">{picked.note}</p>
      {state.layout === 'side' && <SideControls state={state} update={update} />}
      <label className="lab-check">
        <input type="checkbox" checked={state.fit} onChange={(e) => update({ fit: e.target.checked })} />
        <span>cap each list at about a screen, scrolling inside</span>
      </label>
      <label className="lab-check">
        <input type="checkbox" checked={state.pretend} onChange={(e) => update({ pretend: e.target.checked })} />
        <span>pretend there's more: +3 roles, +3 papers, +6 thoughts</span>
      </label>
      <p className="lab-note">under 900px wide, every layout but stacked becomes tabs</p>
    </>
  );
}

function WritingTab({ state, update }) {
  return (
    <>
      {WRITING_CONTROLS.map(([key, label, , options]) => (
        <label key={key} className="lab-field">
          <span>{label}</span>
          <select value={state[key]} onChange={(e) => update({ [key]: e.target.value })}>
            {options.map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
      ))}
      <p className="lab-note">the paper and the shower thoughts, in one section; "pretend" on the layout tab fills it out</p>
    </>
  );
}

function RolesTab({ state, update }) {
  return (
    <>
      <label className="lab-field">
        <span>company</span>
        <select value={state.companyDates} onChange={(e) => update({ companyDates: e.target.value })}>
          {COMPANY_DATES.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <p className="lab-note">the dates on a company's line, over its roles</p>
    </>
  );
}

function ToggleTab({ state, update }) {
  return (
    <>
      <label className="lab-field">
        <span>toggle</span>
        <select value={state.toggle} onChange={(e) => update({ toggle: e.target.value })}>
          {TOGGLES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
      </label>
      <p className="lab-note">top right of the page; press it, or T, to watch it change</p>
    </>
  );
}

function DetailsTab({ state, update }) {
  const preset =
    DETAIL_PRESETS.find((p) => Object.entries(p.set).every(([key, value]) => state[key] === value))?.id ?? 'custom';
  return (
    <>
      <label className="lab-field">
        <span>hold open</span>
        <select value="" onChange={(e) => holdRowOpen(e.target.value)}>
          <option value="" disabled>
            pick a row…
          </option>
          {PREVIEW_ROWS.map(([key, title]) => (
            <option key={key} value={key}>
              {title}
            </option>
          ))}
        </select>
      </label>

      <label className="lab-field">
        <span>preset</span>
        <select
          value={preset}
          onChange={(e) => {
            const picked = DETAIL_PRESETS.find((p) => p.id === e.target.value);
            if (picked) update(picked.set);
          }}
        >
          {DETAIL_PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
          {preset === 'custom' && <option value="custom">custom</option>}
        </select>
      </label>

      <hr className="lab-rule" />

      {DETAIL_CONTROLS.map(([key, label, options]) => (
        <label key={key} className="lab-field">
          <span>{label}</span>
          <select value={state[key]} onChange={(e) => update({ [key]: e.target.value })}>
            {options.map(([value, text]) => (
              <option key={value} value={value}>
                {text}
              </option>
            ))}
          </select>
        </label>
      ))}

    </>
  );
}

function TypeTab({ state, update, body, size }) {
  return (
    <>
      <label className="lab-field">
        <span>body</span>
        <select value={body.id} onChange={(e) => update({ body: e.target.value, size: null })}>
          {fontOptions}
        </select>
      </label>

      <label className="lab-field">
        <span>headings</span>
        <select value={state.heading} onChange={(e) => update({ heading: e.target.value })}>
          <option value="same">same as body</option>
          {fontOptions}
        </select>
      </label>

      <label className="lab-field">
        <span>heading wt</span>
        <select value={state.weight} onChange={(e) => update({ weight: Number(e.target.value) })}>
          {WEIGHTS.map(([value, label]) => (
            <option key={value} value={value}>
              {label} ({value})
            </option>
          ))}
        </select>
      </label>

      <label className="lab-field lab-field--range">
        <span>size</span>
        <input
          type="range"
          min={70}
          max={120}
          value={size}
          onChange={(e) => update({ size: Number(e.target.value) })}
        />
        <output>{size}%</output>
      </label>

      <label className="lab-check">
        <input type="checkbox" checked={state.italics} onChange={(e) => update({ italics: e.target.checked })} />
        <span>keep italics</span>
      </label>

      <p className="lab-note">{body.note}</p>
      <p className="lab-hint">
        <kbd>[</kbd> <kbd>]</kbd> cycle body font
      </p>
    </>
  );
}

// A mode's background swatches (plus a free pick) and its text colours.
// Picking either flips the page into that mode so the change can be seen.
function ShadeRows({ mode, state, pick }) {
  const { bgs, texts } = SHADES[mode];
  const [bgKey, textKey] = [`${mode}Bg`, `${mode}Text`];
  const bg = state[bgKey];
  const bgName = bgs.find(([hex]) => hex === bg)?.[1] ?? 'custom';
  return (
    <>
      <div className="lab-field lab-field--top">
        <span>{mode} bg</span>
        <div>
          <div className="lab-swatches">
            {bgs.map(([hex, name]) => (
              <button
                key={hex}
                type="button"
                className="lab-swatch"
                style={{ background: hex }}
                title={`${name} ${hex}`}
                aria-label={`${name} ${hex}`}
                aria-pressed={bg === hex}
                onClick={() => pick(mode, { [bgKey]: hex })}
              />
            ))}
          </div>
          <div className="lab-picked">
            <input
              type="color"
              value={bg}
              onChange={(e) => pick(mode, { [bgKey]: e.target.value })}
              aria-label={`Custom ${mode} background`}
            />
            <span>
              {bgName} · {bg}
            </span>
          </div>
        </div>
      </div>

      <label className="lab-field">
        <span>{mode} text</span>
        <select value={state[textKey]} onChange={(e) => pick(mode, { [textKey]: e.target.value })}>
          {texts.map(([hex, name]) => (
            <option key={hex} value={hex}>
              {name} · {hex}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}

function ColorTab({ state, update, theme, showTheme }) {
  const linkPreset =
    LINK_COLORS.find((c) => c.light === state.linkLight && c.dark === state.linkDark)?.id ?? 'custom';
  const pick = (mode, patch) => {
    update(patch);
    showTheme(mode);
  };
  const setLink = (mode, hex) =>
    update({
      linkLight: mode === 'light' ? hex : state.linkLight ?? state.lightText,
      linkDark: mode === 'dark' ? hex : state.linkDark ?? state.darkText,
    });

  return (
    <>
      <div className="lab-field">
        <span>mode</span>
        <div className="lab-segmented">
          {['light', 'dark'].map((mode) => (
            <button key={mode} type="button" aria-pressed={theme === mode} onClick={() => showTheme(mode)}>
              {mode}
            </button>
          ))}
        </div>
      </div>

      <ShadeRows mode="light" state={state} pick={pick} />
      <ShadeRows mode="dark" state={state} pick={pick} />

      <hr className="lab-rule" />

      <label className="lab-field">
        <span>link colour</span>
        <select
          value={linkPreset}
          onChange={(e) => {
            const preset = LINK_COLORS.find((c) => c.id === e.target.value);
            if (preset) update({ linkLight: preset.light, linkDark: preset.dark });
          }}
        >
          {LINK_COLORS.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
          {linkPreset === 'custom' && <option value="custom">custom</option>}
        </select>
      </label>

      <div className="lab-field">
        <span>light · dark</span>
        <div className="lab-picked">
          {['light', 'dark'].map((mode) => {
            const hex = mode === 'light' ? state.linkLight ?? state.lightText : state.linkDark ?? state.darkText;
            return (
              <label key={mode} className="lab-picked">
                <input
                  type="color"
                  value={hex}
                  onChange={(e) => setLink(mode, e.target.value)}
                  aria-label={`Link colour in ${mode} mode`}
                />
                <span>{hex}</span>
              </label>
            );
          })}
        </div>
      </div>

      <label className="lab-field">
        <span>link style</span>
        <select value={state.linkStyle} onChange={(e) => update({ linkStyle: e.target.value })}>
          {LINK_STYLES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <label className="lab-check">
        <input type="checkbox" checked={state.indexLinks} onChange={(e) => update({ indexLinks: e.target.checked })} />
        <span>colour the publication title too</span>
      </label>
    </>
  );
}
