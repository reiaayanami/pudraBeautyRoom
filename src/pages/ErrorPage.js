import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';

export default function ErrorPage() {
  return (
    <PageWrapper>
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg,#1a1a1a 0%,#2d2020 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: "'DM Serif Display',serif",
          fontSize: 'clamp(200px,30vw,400px)',
          color: 'rgba(248,196,207,0.05)',
          userSelect: 'none', pointerEvents: 'none',
          lineHeight: 1, fontStyle: 'italic',
        }}>
          500
        </div>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg,rgba(248,196,207,0.15),rgba(253,224,230,0.1))',
              border: '1px solid rgba(242,168,182,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 40px',
            }}
          >
            <span style={{ fontSize: 40 }}>⚡</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(36px,5vw,64px)', color: '#f8c4cf', marginBottom: 16 }}
          >
            Щось пішло не так
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: "'Jost',sans-serif", fontSize: 15, color: 'rgba(255,240,243,0.4)', fontWeight: 300, maxWidth: 400, margin: '0 auto 48px', lineHeight: 1.7 }}
          >
            Наш сервер тимчасово відпочиває. Будь ласка, спробуйте ще раз через кілька хвилин.
          </motion.p>

          <Link to="/" style={{
            fontFamily: "'Jost',sans-serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase',
            background: '#f2a8b6', color: '#1a1a1a', padding: '18px 48px',
            display: 'inline-block', transition: 'background 0.3s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = '#e8899a'}
            onMouseLeave={e => e.currentTarget.style.background = '#f2a8b6'}
          >
            Повернутись
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}
