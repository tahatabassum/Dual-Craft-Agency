import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  // Navbar background logic:
  // - Home page unscrolled: transparent (dark hero shows through)
  // - Inner pages unscrolled: solid navy (dark section starts below navbar, not behind it)
  // - Any page scrolled: white frosted glass
  const isHomePage = location.pathname === '/';
  const useLightText = !scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-[0_2px_20px_rgba(26,43,76,0.08)]'
          : isHomePage
          ? 'bg-transparent'
          : 'bg-[#1A2B4C]'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo — inverted (white) when on dark hero, normal when scrolled */}
          <Link
            to="/"
            onClick={(e) => {
              if (location.pathname === '/') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-3 flex-shrink-0"
          >
            <img
              src="/assets/logo-horizontal.svg"
              alt="Dual Craft"
              className={`h-9 md:h-11 w-auto transition-all duration-300 ${
                useLightText ? 'brightness-0 invert' : ''
              }`}
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) => {
                  if (isActive) {
                    return `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      useLightText
                        ? 'text-teal bg-white/10'
                        : 'text-teal bg-teal/10'
                    }`;
                  }
                  return `px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    useLightText
                      ? 'text-white/80 hover:text-white hover:bg-white/10'
                      : 'text-charcoal hover:text-navy hover:bg-navy/5'
                  }`;
                }}
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="ml-3 btn-primary text-sm py-2.5 px-5"
            >
              Get a Quote
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            id="navbar-hamburger"
            aria-label="Toggle navigation menu"
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              useLightText
                ? 'text-white hover:bg-white/10'
                : 'text-navy hover:bg-navy/5'
            }`}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } bg-white border-t border-navy/10 shadow-lg`}
      >
        <nav className="container-custom py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-teal bg-teal/10'
                    : 'text-charcoal hover:text-navy hover:bg-navy/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/contact" className="btn-primary mt-2 justify-center text-sm">
            Get a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
