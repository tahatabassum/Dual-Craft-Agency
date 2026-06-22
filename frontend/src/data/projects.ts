import type { Project } from '../types';

export const projects: Project[] = [
  {
    slug: 'advantage-ai',
    title: 'AdVantage AI',
    description: 'Digital Marketing Analytics SaaS platform powered by AI insights',
    longDescription: `AdVantage AI is a comprehensive digital marketing analytics platform that leverages artificial intelligence to provide actionable insights for businesses. The platform aggregates data from multiple marketing channels, analyzes campaign performance, and delivers AI-driven recommendations to maximize ROI.

Key features include real-time dashboard analytics, competitor benchmarking, automated campaign suggestions, and detailed performance reports — all designed to give marketers a competitive edge.`,
    techStack: ['React', 'Python', 'FastAPI', 'PostgreSQL', 'OpenAI API', 'Render'],
    thumbnail: '/assets/thumbnails/advantage-ai.png',
    screenshots: [],
    liveUrl: 'https://advantage-ai-1.onrender.com/',
    category: 'SaaS',
  },
  {
    slug: 'resume-ai',
    title: 'Resume AI',
    description: 'AI-powered resume builder and analyzer for job seekers',
    longDescription: `Resume AI helps job seekers craft optimized, ATS-friendly resumes using artificial intelligence. Users can input their experience, and the AI analyzes the content to provide improvement suggestions, keyword optimization, and formatting recommendations tailored to specific job descriptions.

The platform also offers resume scoring, industry-specific templates, and actionable feedback to increase interview callback rates.`,
    techStack: ['React', 'TypeScript', 'FastAPI', 'OpenAI API', 'SQLite', 'Render'],
    thumbnail: '/assets/thumbnails/resume-ai.png',
    screenshots: [],
    liveUrl: 'https://resumeai-ntab.onrender.com/',
    category: 'SaaS',
  },
  {
    slug: 'smile-care-dental',
    title: 'Smile Care Dental',
    description: 'Professional dental clinic website with appointment booking',
    longDescription: `Smile Care Dental is a client project — a professional website built for a local dental clinic. The site showcases the clinic's services, team, and facilities while providing patients with a seamless experience to learn about treatments and get in touch.

The design prioritizes trust, clarity, and ease of use — essential for healthcare clients. Features include a services overview, about the team, patient testimonials, and a clear call-to-action for booking consultations.`,
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vercel'],
    thumbnail: '/assets/thumbnails/smile-care.png',
    screenshots: [],
    liveUrl: 'https://smile-care-dental-liard.vercel.app/',
    category: 'Web Development',
  },
];
