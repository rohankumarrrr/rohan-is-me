// Shower thoughts: { slug, title, date, quote, body }, each on a page of its
// own at /shower-thoughts/<slug>. A body is a small slice of markdown:
// paragraphs split by blank lines, list items that open with "* ", and an
// indented line that carries an item on as a paragraph of its own. See
// parsePost below. `quote` is a line from it to show elsewhere on the site.

export const posts = [];

// Blocks: { type: 'p', text } and { type: 'ul', items: [[paragraph, ...], ...] }.
export function parsePost(body) {
  const blocks = [];
  for (const chunk of body.split(/\n\s*\n/)) {
    const lines = chunk.split('\n');
    if (!lines[0].startsWith('* ')) {
      blocks.push({ type: 'p', text: lines.join(' ').trim() });
      continue;
    }
    const items = [];
    for (const line of lines) {
      if (line.startsWith('* ')) items.push([line.slice(2).trim()]);
      else if (line.trim()) items[items.length - 1].push(line.trim());
    }
    blocks.push({ type: 'ul', items });
  }
  return blocks;
}

// About 230 words a minute.
export function readingTime(body) {
  const words = body.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 230))} min read`;
}
