import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';

export default function NotFoundPage() {
  return (
    <PageWrapper>
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg,#fff0f3 0%,#fdf8f5 50%,#fce8ec 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Big 404 */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: "'DM Serif Display',serif",
          fontSize: 'clamp(200px,30vw,400px)',
          color: 'rgba(248,196,207,0.3)',
          userSelect: 'none', pointerEvents: 'none',
          lineHeight: 1, fontStyle: 'italic',
          whiteSpace: 'nowrap',
        }}>
          404
        </div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 120, height: 120, borderRadius: '50%',
              background: 'linear-gradient(135deg,#f8c4cf,#fde0e6)',
              border: '2px solid rgba(242,168,182,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 40px',
              boxShadow: '0 30px 80px rgba(232,137,154,0.2)',
            }}
          >
            <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 48, color: '#d4697c' }}>?</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(40px,5vw,64px)', color: '#1a1a1a', marginBottom: 16 }}
          >
            Сторінку не знайдено
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: "'Jost',sans-serif", fontSize: 16, color: '#8a7070', fontWeight: 300, marginBottom: 48, maxWidth: 420, margin: '0 auto 48px' }}
          >
            Схоже, цієї сторінки не існує. Можливо, вона переїхала або ніколи не існувала — як ідеальна шкіра без догляду 🌸
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link to="/" style={{
              fontFamily: "'Jost',sans-serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
              background: '#1a1a1a', color: 'white', padding: '18px 44px',
              display: 'inline-block', transition: 'background 0.3s',
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#d4697c'}
              onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
            >
              На головну
            </Link>
            <Link to="/services" style={{
              fontFamily: "'Jost',sans-serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#1a1a1a', border: '1px solid #1a1a1a', padding: '18px 44px',
              display: 'inline-block', transition: 'all 0.3s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = 'white'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#1a1a1a'; }}
            >
              Послуги
            </Link>
          </motion.div>
        </div>

        {/* Floating petals */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -30, 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              rotate: [0, 360],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + i * 0.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
            style={{
              position: 'absolute',
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 25}%`,
              width: 8 + (i % 3) * 4,
              height: 8 + (i % 3) * 4,
              borderRadius: '50% 0',
              background: `rgba(248,196,207,${0.3 + i * 0.05})`,
              pointerEvents: 'none',
            }}
          />
        ))}
      </section>
    </PageWrapper>
  );
}
