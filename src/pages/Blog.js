import React from 'react';

const Blog = ({ text }) => {
  return (
    <section className="boarders" style={{ minHeight: '80vh', padding: '2rem' }}>
      <h1>{text.blog}</h1>
      <p>Coming Soon...</p>
    </section>
  );
};

export default Blog;