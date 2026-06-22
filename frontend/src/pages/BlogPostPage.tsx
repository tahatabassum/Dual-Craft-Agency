import { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { blogApi } from '../lib/api';
import type { BlogPost } from '../types';
import MarkdownRenderer from '../components/MarkdownRenderer';
import AnimatedSection from '../components/AnimatedSection';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function estimateReadTime(body?: string): number {
  return Math.max(1, Math.ceil((body || '').split(' ').length / 200));
}

const getCoverImage = (coverImage?: string) => {
  if (coverImage && coverImage.trim() !== '') {
    if (coverImage.startsWith('/uploads')) {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const backendUrl = apiUrl.replace(/\/api$/, '') || window.location.origin;
      return `${backendUrl}${coverImage}`;
    }
    return coverImage;
  }
  return 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80';
};

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    blogApi
      .get(slug)
      .then((res) => setPost(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (notFound) return <Navigate to="/blog" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-10 h-10 rounded-full border-3 border-teal border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <main className="pt-24 pb-20 bg-offwhite min-h-screen">
      <div className="container-custom">
        {/* Back Link */}
        <div className="mb-6 animate-fade-in">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-charcoal/50 hover:text-teal text-sm font-semibold transition-colors animate-fade-in"
          >
            <ArrowLeft size={16} /> Back to Blog
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Post Content (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatedSection>
              <div className="space-y-4 mb-6">
                <h1 className="text-4xl md:text-5xl font-heading font-black text-navy leading-tight">
                  {post.title}
                </h1>
                
                <div className="flex items-center gap-5 text-charcoal/40 text-sm flex-wrap font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    {formatDate(post.created_at)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {estimateReadTime(post.body)} min read
                  </span>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-white rounded-2xl shadow-card p-8 md:p-12">
                <MarkdownRenderer content={post.body ?? ''} />
              </div>
            </AnimatedSection>

            {/* Back button at the bottom */}
            <AnimatedSection className="mt-8 text-center lg:text-left">
              <Link to="/blog" className="btn-secondary inline-flex">
                <ArrowLeft size={16} /> Back to Blog
              </Link>
            </AnimatedSection>
          </div>

          {/* Right Column: Cover Image (lg:col-span-4) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <AnimatedSection>
              <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-card-hover bg-navy">
                <img
                  src={getCoverImage(post.cover_image)}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80';
                  }}
                />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </main>
  );
}
