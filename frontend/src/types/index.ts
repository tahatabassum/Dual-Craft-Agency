// ─── Blog ─────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  body?: string;
  cover_image?: string;
  published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface BlogPostCreate {
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  cover_image?: string;
  published?: boolean;
}

export interface BlogPostUpdate {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  cover_image?: string;
  published?: boolean;
}

// ─── Auth ─────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface AdminUser {
  email: string;
  name?: string;
}

// ─── Project ──────────────────────────────────────────────────────────────

export interface Project {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  thumbnail: string;
  screenshots?: string[];
  liveUrl: string;
  githubUrl?: string;
  category: 'Web Development' | 'Digital Marketing' | 'SaaS';
}

// ─── Team ─────────────────────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  initials: string;
}

// ─── Contact ──────────────────────────────────────────────────────────────

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ContactResponse {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at: string;
}

// ─── Service ──────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  included: string[];
}
