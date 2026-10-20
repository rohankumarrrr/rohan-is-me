import React, { Suspense } from 'react';
import './App.css';
import { ThemeProvider } from './hooks/useTheme';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Experiences from './components/Experiences';
import PostPage from './components/PostPage';
import { posts } from './data/posts';
import { usePath } from './hooks/useRoute';
import { Analytics } from '@vercel/analytics/react';

// Type and colour experiments panel. The build folds this to null, so
// production never even emits the chunk.
const DesignLab =
  process.env.NODE_ENV === 'development'
    ? React.lazy(() => import('./components/DesignLab'))
    : null;

function App() {
  // A post has a page of its own, at /shower-thoughts/<slug>; any other
  // address is home.
  const path = usePath();
  const post = posts.find((p) => path === `/shower-thoughts/${p.slug}`);

  return (
    <ThemeProvider>
      <div className="app">
        <Navbar />
        {post ? (
          <PostPage post={post} />
        ) : (
          <>
            <Home />
            {/* The work section and footer share the second screen, so
                scrolling down lands on a page of its own. */}
            <div className="work-page">
              <Experiences />
              <footer className="footer">© 2026 Rohan Kumar</footer>
            </div>
          </>
        )}
      </div>
      <Analytics />
      {DesignLab && (
        <Suspense fallback={null}>
          <DesignLab />
        </Suspense>
      )}
    </ThemeProvider>
  );
}

export default App;
