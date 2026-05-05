import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); setDone(true); return 100; }
        return p + Math.random() * 15;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          style={{
            position: 'fixed', inset: 0, zIndex: 99999,
            background: '#fff0f3',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '40px',
          }}
        >
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
            style={{ textAlign: 'center' }}
          >
            <div style={{
              width: 100, height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f8c4cf, #fde0e6)',
              border: '2px solid rgba(242,168,182,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 20px 60px rgba(232,137,154,0.2)',
            }}>
              <span style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 28, fontWeight: 400,
                color: '#1a1a1a', letterSpacing: '0.05em',
              }}>P</span>
            </div>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 22, fontWeight: 400,
              color: '#1a1a1a', letterSpacing: '0.2em',
              textTransform: 'uppercase',
            }}>Pudra Beauty Room</h2>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11, letterSpacing: '0.3em',
              textTransform: 'uppercase', color: '#d4697c',
              marginTop: 8,
            }}>Нововолинськ · Апаратна косметологія</p>
          </motion.div>

          {/* Progress bar */}
          <div style={{ width: 200 }}>
            <div style={{
              width: '100%', height: 1,
              background: 'rgba(242,168,182,0.2)',
              borderRadius: 1, overflow: 'hidden',
            }}>
              <motion.div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #e8899a, #f2a8b6)',
                  borderRadius: 1,
                }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <p style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 11, letterSpacing: '0.2em',
              color: '#e8899a', marginTop: 16,
              textAlign: 'center',
            }}>{Math.round(Math.min(progress, 100))}%</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
