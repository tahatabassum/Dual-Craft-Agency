import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  return (
    <div
      className={`prose prose-lg max-w-none 
        prose-headings:font-heading prose-headings:text-navy
        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
        prose-p:text-charcoal/80 prose-p:leading-relaxed
        prose-a:text-teal prose-a:no-underline hover:prose-a:underline
        prose-strong:text-navy prose-strong:font-semibold
        prose-code:text-teal prose-code:bg-teal/10 prose-code:px-1.5 prose-code:py-0.5 
        prose-code:rounded prose-code:text-sm prose-code:font-mono
        prose-pre:bg-navy prose-pre:rounded-xl prose-pre:shadow-lg
        prose-blockquote:border-l-teal prose-blockquote:bg-teal/5 
        prose-blockquote:rounded-r-lg prose-blockquote:py-1
        prose-ul:text-charcoal/80 prose-ol:text-charcoal/80
        prose-li:marker:text-teal
        prose-hr:border-navy/20
        prose-img:rounded-xl prose-img:shadow-card
        ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
