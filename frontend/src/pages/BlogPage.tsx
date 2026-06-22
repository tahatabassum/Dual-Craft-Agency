import { useEffect, useState } from 'react';
import { BookOpen } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import BlogCard from '../components/BlogCard';
import { blogApi } from '../lib/api';
import type { BlogPost } from '../types';

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    blogApi
      .list()
      .then((res) => setPosts(res.data))
      .catch(() => setError('Failed to load posts. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="pt-20">
      {/* ─── HEADER ─────────────────────────────────────────── */}
      <section className="section bg-navy">
        <div className="container-custom text-center">
          <AnimatedSection>
            <p className="section-label text-teal">Insights & Tips</p>
            <h1 className="text-5xl md:text-6xl font-heading font-black text-white mb-6">
              Our Blogs
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Practical articles on web development, SEO, and digital marketing 
              from the Dual Craft team.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── POSTS ──────────────────────────────────────────── */}
      <section className="section bg-offwhite">
        <div className="container-custom">
          {loading && (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 rounded-full border-3 border-teal border-t-transparent animate-spin" />
            </div>
          )}

          {error && (
            <div className="text-center py-24">
              <p className="text-charcoal/60">{error}</p>
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mx-auto mb-5">
                <BookOpen size={28} />
              </div>
              <h2 className="text-2xl font-heading font-bold text-navy mb-3">
                No posts yet
              </h2>
              <p className="text-charcoal/55">
                We're working on our first articles. Check back soon!
              </p>
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Grid of Posts (3/4 width) */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {posts.map((post, i) => (
                    <AnimatedSection key={post.id} delay={i * 0.08}>
                      <BlogCard post={post} variant="overlay" index={i} />
                    </AnimatedSection>
                  ))}
                </div>
              </div>

              {/* Sidebar (1/4 width) */}
              <div className="lg:col-span-1 space-y-8">
                {/* Featured Section */}
                <AnimatedSection delay={0.1}>
                  <div>
                    <div className="flex items-center gap-3 mb-4.5">
                      <h3 className="font-heading font-bold text-navy text-xs uppercase tracking-wider">
                        Featured
                      </h3>
                      <div className="flex-1 h-px bg-navy/10" />
                    </div>
                    <div className="space-y-4">
                      {posts.slice(0, 3).map((post, i) => (
                        <BlogCard key={`featured-${post.id}`} post={post} variant="row" index={i} />
                      ))}
                    </div>
                  </div>
                </AnimatedSection>

                {/* Latest Section */}
                <AnimatedSection delay={0.2}>
                  <div>
                    <div className="flex items-center gap-3 mb-4.5">
                      <h3 className="font-heading font-bold text-navy text-xs uppercase tracking-wider">
                        Latest
                      </h3>
                      <div className="flex-1 h-px bg-navy/10" />
                    </div>
                    <div className="space-y-4">
                      {posts.slice(0, 4).map((post, i) => (
                        <BlogCard key={`latest-${post.id}`} post={post} variant="row" index={i} />
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
