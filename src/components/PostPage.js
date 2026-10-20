import React, { useMemo } from 'react';
import { experience } from '../data/entries';
import { parsePost, readingTime } from '../data/posts';
import { linkTo } from '../hooks/useRoute';
import PageShell from './PageShell';
import './styles/PostPage.css';

// A post, on a page of its own. Like the rest of the site it's set in
// lowercase, whatever case it's written in. Names in it that are also
// experiences (amazon, pinterest, vinskal) lead back to that row of the work
// page; escape, the ×, or the "shower thoughts" crumb leads back to the post's
// own row there.

const MENTION = /\b(amazon music|amazon|pinterest|vinskal)\b/g;

// Where a mention of a company leads: the latest of its roles that has begun.
function keyFor(name) {
  const company = name.split(' ')[0];
  const i = experience.findIndex((entry) => entry.title.endsWith(`@ ${company}`) && !entry.starts);
  return i < 0 ? null : `experience-${i}`;
}

// Text with its mentions made into links.
const say = (text) =>
  text.split(MENTION).map((part, i) =>
    i % 2 === 0 ? (
      part
    ) : (
      <a key={i} className="inline-link mention" href="/" onClick={linkTo('/', { focusKey: keyFor(part) })}>
        {part}
      </a>
    )
  );

// A point's opening sentence carries it, as a work row's lead does.
function withLead(text) {
  const end = text.search(/[.?!](\s|$)/);
  if (end < 0) return say(text);
  return (
    <>
      <span className="post-lead">{say(text.slice(0, end + 1))}</span>
      {say(text.slice(end + 1))}
    </>
  );
}

export default function PostPage({ post }) {
  const blocks = useMemo(() => parsePost(post.body.toLowerCase()), [post.body]);

  return (
    <PageShell section={{ label: 'shower thoughts', focusKey: `writing-${post.slug}` }} title={post.title}>
      <article>
          <header className="post-head">
            <h1 className="post-title">
              {/* Its own box, the width of the words, so the work page's row
                  can grow into it when the page turns (useRoute.js). */}
              <span className="post-title-name" data-vt={`post-${post.slug}`}>
                {post.title}
              </span>
            </h1>
            <p className="post-meta">
              {post.date} · {readingTime(post.body)}
            </p>
          </header>

          <div className="post-body">
            {blocks.map((block, i) =>
              block.type === 'p' ? (
                <p key={i}>{say(block.text)}</p>
              ) : (
                <ul key={i}>
                  {block.items.map((paragraphs, j) => (
                    <li key={j}>
                      {paragraphs.map((text, k) => (
                        <p key={k}>{k === 0 ? withLead(text) : say(text)}</p>
                      ))}
                    </li>
                  ))}
                </ul>
              )
            )}
          </div>
          <p className="post-sign">— rohan</p>
      </article>
    </PageShell>
  );
}
