import { motion } from 'framer-motion';
import '../components/styles/Blog.css';

const posts = [];

export default function Blog() {
  return (
    <motion.div
      className="blog-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="blog-heading">shower thoughts</h1>
      <div className="blog-divider" />
      {posts.length === 0
        ? <p className="blog-empty">no posts yet. check back soon.</p>
        : posts.map((post, i) => (
            <div key={i} className="blog-post-card">
              <span className="blog-post-date">{post.date}</span>
              <h2 className="blog-post-title">{post.title}</h2>
              <p className="blog-post-excerpt">{post.excerpt}</p>
            </div>
          ))
      }
    </motion.div>
  );
}
