import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppFAB from './components/WhatsAppFAB';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ContactPage from './pages/ContactPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

gsap.registerPlugin(ScrollTrigger);

// ─── Lenis + GSAP ScrollTrigger integration ──────────────────────────────────

function LenisProvider() {
  const location = useLocation();

  useEffect(() => {
    // Disable Lenis smooth scrolling on all admin panel pages
    if (location.pathname.startsWith('/admin')) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Keep GSAP ScrollTrigger in sync
    lenis.on('scroll', ScrollTrigger.update);
    
    const tickerUpdate = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerUpdate);
    };
  }, [location.pathname]);

  return null;
}

// ─── Scroll to top on route change ───────────────────────────────────────────

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// ─── Layout for public pages (with Navbar + Footer + FAB) ────────────────────

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-hidden min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 w-full overflow-x-hidden">
        {children}
      </div>
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LenisProvider />
        <ScrollToTop />
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
          <Route
            path="/services"
            element={
              <PublicLayout>
                <ServicesPage />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <AboutPage />
              </PublicLayout>
            }
          />
          <Route
            path="/projects"
            element={
              <PublicLayout>
                <ProjectsPage />
              </PublicLayout>
            }
          />
          <Route
            path="/projects/:slug"
            element={
              <PublicLayout>
                <ProjectDetailPage />
              </PublicLayout>
            }
          />
          <Route
            path="/blog"
            element={
              <PublicLayout>
                <BlogPage />
              </PublicLayout>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <PublicLayout>
                <BlogPostPage />
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <ContactPage />
              </PublicLayout>
            }
          />

          {/* Admin routes — no Navbar/Footer, no public listing */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={<AdminLoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
