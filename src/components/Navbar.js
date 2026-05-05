import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Головна', path: '/' },
  { label: 'Послуги', path: '/services' },
  { label: 'Про нас', path: '/about' },
  { label: 'Прайс', path: '/pricing' },
  { label: 'Галерея', path: '/gallery' },
  { label: 'Контакти', path: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.19, 1, 0.22, 1], delay: 2.9 }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
          padding: scrolled ? '16px 80px' : '28px 80px',
          background: scrolled ? 'rgba(255,248,250,0.94)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(242,168,182,0.2)' : 'none',
          transition: 'all 0.5s cubic-bezier(0.25,0.46,0.45,0.94)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: 'linear-gradient(90deg, transparent 0%, #f2a8b6 30%, #d4697c 50%, #f2a8b6 70%, transparent 100%)',
          opacity: scrolled ? 1 : 0,
          transition: 'opacity 0.5s',
        }} />
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg, #f8c4cf, #fde0e6)',
            border: '1.5px solid rgba(242,168,182,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#1a1a1a' }}>P</span>
          </div>
          <div>
            <div style={{
              fontFamily: "'DM Serif Display', serif", fontSize: 17, fontWeight: 400,
              color: '#1a1a1a', letterSpacing: '0.1em',
              transition: 'color 0.5s',
            }}>Pudra</div>
            <div style={{
              fontFamily: "'Jost', sans-serif", fontSize: 9,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              color: '#d4697c', fontWeight: 400,
            }}>Beauty Room</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'center' }} className="desktop-nav">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 12, fontWeight: 400,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: location.pathname === link.path ? '#d4697c' : '#2d2020',
                position: 'relative', paddingBottom: 4,
                transition: 'color 0.3s',
              }}
            >
              {link.label}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-indicator"
                  style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: 1, background: '#d4697c',
                  }}
                />
              )}
            </Link>
          ))}
        </div>

        {/* CTA + Hamburger */}
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link
            to="/booking"
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              background: '#1a1a1a', color: 'white',
              padding: '12px 28px',
              transition: 'background 0.3s',
              display: 'inline-block',
            }}
            className="desktop-nav"
            onMouseEnter={e => e.currentTarget.style.background = '#e8899a'}
            onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
          >
            Записатись
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none', cursor: 'none',
              display: 'flex', flexDirection: 'column', gap: 5,
              padding: '8px',
            }}
            className="hamburger"
          >
            <motion.span animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
              style={{ display: 'block', width: 24, height: 1, background: '#1a1a1a', transformOrigin: 'center' }} />
            <motion.span animate={{ opacity: menuOpen ? 0 : 1 }}
              style={{ display: 'block', width: 16, height: 1, background: '#1a1a1a' }} />
            <motion.span animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
              style={{ display: 'block', width: 24, height: 1, background: '#1a1a1a', transformOrigin: 'center' }} />
          </button>
        </div>
      </motion.nav>

      {/* Mobile / Full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 60px) 40px)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at calc(100% - 60px) 40px)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at calc(100% - 60px) 40px)' }}
            transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 999,
              background: '#fff0f3',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 48,
            }}
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              >
                <Link to={link.path} style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 'clamp(36px, 7vw, 64px)',
                  color: '#1a1a1a',
                  letterSpacing: '0.02em',
                }}>
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <Link to="/booking" style={{
                fontFamily: "'Jost', sans-serif", fontSize: 13,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                background: '#1a1a1a', color: 'white', padding: '18px 48px',
              }}>
                Записатись на прийом
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
        }
        @media (min-width: 901px) {
          .hamburger { display: none !important; }
        }
        @media (min-width: 901px) {
          nav { padding-left: 80px !important; padding-right: 80px !important; }
        }
      `}</style>
    </>
  );
}
