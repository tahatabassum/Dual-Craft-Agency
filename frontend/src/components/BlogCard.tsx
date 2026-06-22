import { Link } from 'react-router-dom';
import { Clock, Calendar } from 'lucide-react';
import type { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'overlay' | 'row' | 'standard';
  index?: number;
}

const getCoverImage = (coverImage?: string, index: number = 0) => {
  if (coverImage && coverImage.trim() !== '') {
    if (coverImage.startsWith('/uploads')) {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const backendUrl = apiUrl.replace(/\/api$/, '') || window.location.origin;
      return `${backendUrl}${coverImage}`;
    }
    return coverImage;
  }
  // Curated list of premium development/design Unsplash images
  const placeholders = [
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80', // Web Design / Coding
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', // Digital Marketing
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80', // Tech / Development
    'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80', // Writing / Creative
  ];
  return placeholders[index % placeholders.length];
};

const getCategory = (post: BlogPost, index: number = 0) => {
  const title = post.title.toLowerCase();
  if (title.includes('seo') || title.includes('marketing') || title.includes('grow')) {
    return 'Digital Marketing';
  }
  if (title.includes('design') || title.includes('brand') || title.includes('logo')) {
    return 'Brand Strategy';
  }
  if (title.includes('dev') || title.includes('react') || title.includes('code') || title.includes('web')) {
    return 'Web Development';
  }
  const categories = ['Web Development', 'Digital Marketing', 'Brand Strategy', 'SEO & Growth'];
  return categories[index % categories.length];
};

function estimateReadTime(body?: string): number {
  const words = (body || '').split(' ').length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogCard({ post, variant = 'standard', index = 0 }: BlogCardProps) {
  const readTime = estimateReadTime(post.body || post.excerpt);
  const imageUrl = getCoverImage(post.cover_image, index);
  const category = getCategory(post, index);

  if (variant === 'row') {
    return (
      <Link to={`/blog/${post.slug}`} className="flex items-center gap-3.5 group">
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-navy/5 flex-shrink-0">
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=150&q=80';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-charcoal/40 text-[10px] font-semibold block mb-0.5">
            {formatDate(post.created_at)}
          </span>
          <h4 className="font-heading font-bold text-navy text-xs leading-snug line-clamp-2 
            group-hover:text-teal transition-colors duration-200">
            {post.title}
          </h4>
        </div>
      </Link>
    );
  }

  if (variant === 'overlay') {
    return (
      <Link 
        to={`/blog/${post.slug}`} 
        className="group relative block aspect-[3/4] rounded-2xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover hover:translate-y-[-4px]"
      >
        <div className="absolute inset-0 bg-navy">
          <img
            src={imageUrl}
            alt={post.title}
            className="w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-75"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/50 to-transparent z-10" />

        <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
          <span className="inline-block bg-white text-navy font-bold text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider mb-3 w-fit shadow-sm">
            {category}
          </span>

          <h3 className="text-lg font-heading font-black text-white leading-tight mb-2 group-hover:text-teal transition-colors duration-200 line-clamp-3">
            {post.title}
          </h3>

          {post.excerpt && (
            <p className="text-white/70 text-xs leading-relaxed font-medium line-clamp-2 mb-3">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-3 text-white/40 text-[10px] pt-3 border-t border-white/10 mt-1">
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              {formatDate(post.created_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={10} />
              {readTime} min read
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/blog/${post.slug}`} className="card group flex flex-col overflow-hidden">
      <div className="overflow-hidden aspect-[16/9] bg-navy/5">
        <img
          src={imageUrl}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80';
          }}
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-4 text-charcoal/50 text-xs mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(post.created_at)}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {readTime} min read
          </span>
        </div>

        <h3 className="text-lg font-heading font-bold text-navy mb-2 group-hover:text-teal 
          transition-colors duration-200 leading-snug">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="text-charcoal/65 text-sm leading-relaxed flex-1 line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-navy/10">
          <span className="text-teal text-sm font-semibold group-hover:underline">
            Read more →
          </span>
        </div>
      </div>
    </Link>
  );
}
