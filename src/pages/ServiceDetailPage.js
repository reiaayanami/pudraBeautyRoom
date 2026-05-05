import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import useInView from '../hooks/useInView';
import { getServiceById } from '../lib/contentful';

function ServicePattern({ category }) {
  return (
    <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%', overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', right: '-5%', top: '50%', transform: 'translateY(-50%)', width: 380, height: 380, borderRadius: '50%', background: 'linear-gradient(135deg,#f8c4cf,#fde0e6)', opacity: 0.4 }} />
      <div style={{ position: 'absolute', right: '30%', top: '15%', width: 160, height: 160, borderRadius: '50%', background: '#f2a8b6', opacity: 0.3 }} />
      <div style={{ position: 'absolute', right: '10%', bottom: '10%', width: 100, height: 100, borderRadius: '50%', background: '#fde0e6', opacity: 0.45 }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(242,168,182,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(242,168,182,0.07) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '40%', background: 'linear-gradient(to right, #fdf8f5, transparent)' }} />
    </div>
  );
}

export default function ServiceDetailPage() {
  const { id } = useParams();
  const [svc, setSvc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView(0.1);

  useEffect(() => {
    getServiceById(id)
      .then(data => { setSvc(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <PageWrapper>
        <div style={{ padding: '200px 0', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 14, color: '#8a7070' }}>Завантаження...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!svc) {
    return (
      <PageWrapper>
        <div style={{ padding: '200px 0', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 60, marginBottom: 32 }}>Послугу не знайдено</h1>
          <Link to="/services" style={{ fontFamily: "'Jost',sans-serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', background: '#1a1a1a', color: 'white', padding: '16px 40px', display: 'inline-block' }}>← Всі послуги</Link>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <section style={{ padding: '180px 0 80px', background: 'linear-gradient(135deg,#fdf8f5,#fff0f3)', overflow: 'clip', position: 'relative', minHeight: 340 }}>
        <ServicePattern category={svc.category} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <Link to="/services" style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a7070', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 48, transition: 'color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#d4697c'}
            onMouseLeave={e => e.currentTarget.style.color = '#8a7070'}
          >← Всі послуги</Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4697c', background: 'rgba(212,105,124,0.08)', padding: '6px 16px', display: 'inline-block', marginBottom: 24 }}>{svc.category}</span>
            <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(40px,5vw,72px)', color: '#1a1a1a', lineHeight: 1.05, marginBottom: 16, maxWidth: 700 }}>{svc.title}</h1>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#d4697c', fontStyle: 'italic', fontWeight: 300 }}>{svc.tagline}</p>
          </motion.div>
        </div>
      </section>

      <section style={{ background: '#fff0f3', borderBottom: '1px solid rgba(242,168,182,0.2)' }}>
        <div className="container">
          <div style={{ display: 'flex', gap: 0, flexWrap:'wrap'}} className="service-stats-bar">
            {[['Вартість', svc.price], ['Тривалість', svc.duration], ['Курс', svc.sessions]].map(([label, val], i) => (
              <div key={label} style={{ flex: 1, minWidth: 140, padding: '28px 32px', borderRight: i < 2 ? '1px solid rgba(242,168,182,0.2)' : 'none' }}>
                <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#d4697c', marginBottom: 8 }}>{label}</div>
                <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: '#1a1a1a' }}>{val}</div>
              </div>
            ))}
            <div style={{ flex: 1, minWidth: 140, padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <Link to="/booking" state={{ service: svc.title }} style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', background: '#1a1a1a', color: 'white', padding: '14px 32px', transition: 'background 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#d4697c'}
                onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
              >Записатись</Link>
            </div>
          </div>
        </div>
      </section>

      <section ref={ref} style={{ padding: '80px 0 120px', background: '#fffbf9', overflow: 'visible' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 80, alignItems: 'start' }} className="service-detail-content">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 36, color: '#1a1a1a', marginBottom: 24 }}>Про процедуру</h2>
              <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 16, color: '#8a7070', lineHeight: 1.9, fontWeight: 300, marginBottom: 60 }}>{svc.fullDesc}</p>

              <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, color: '#1a1a1a', marginBottom: 32 }}>Переваги</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 60}} className="service-benefits-grid">
                {(svc.benefits || []).map((b, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.07 }}
                    style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '16px 20px', background: '#fff0f3', border: '1px solid rgba(242,168,182,0.2)' }}>
                    <span style={{ color: '#e8899a', flexShrink: 0, marginTop: 2 }}>◈</span>
                    <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 13, color: '#2d2020', fontWeight: 300, lineHeight: 1.5 }}>{b}</span>
                  </motion.div>
                ))}
              </div>

              <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, color: '#1a1a1a', marginBottom: 24 }}>Як проходить процедура</h3>
              <div style={{ marginBottom: 60 }}>
                {(svc.procedure || []).map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 24, padding: '20px 0', borderBottom: '1px solid rgba(242,168,182,0.15)' }}>
                    <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, color: 'rgba(232,137,154,0.3)', flexShrink: 0, lineHeight: 1 }}>0{i + 1}</span>
                    <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 15, color: '#2d2020', fontWeight: 300, lineHeight: 1.6, paddingTop: 4 }}>{step}</span>
                  </div>
                ))}
              </div>

              <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, color: '#1a1a1a', marginBottom: 24 }}>Протипоказання</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(svc.contraindications || []).map((c, i) => (
                  <span key={i} style={{ fontFamily: "'Jost',sans-serif", fontSize: 12, color: '#8a7070', background: 'rgba(138,112,112,0.08)', padding: '8px 16px', fontWeight: 300 }}>{c}</span>
                ))}
              </div>
            </motion.div>

            <div className="service-detail-sidebar">
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.7 }}
                style={{ position: 'sticky', top: 120 }}
              >
                <div style={{ background: '#fff0f3', border: '1px solid rgba(242,168,182,0.3)', padding: '40px 32px', marginBottom: 24 }}>
                  <h4 style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4697c', marginBottom: 32 }}>Деталі</h4>
                  {[['Вартість', svc.price], ['Тривалість', svc.duration], ['Курс', svc.sessions]].map(([label, val]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(242,168,182,0.2)' }}>
                      <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 12, color: '#8a7070', fontWeight: 300 }}>{label}</span>
                      <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 18, color: '#1a1a1a' }}>{val}</span>
                    </div>
                  ))}
                  <Link to="/booking" state={{ service: svc.title }} style={{ display: 'block', textAlign: 'center', fontFamily: "'Jost',sans-serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', background: '#1a1a1a', color: 'white', padding: '18px', marginTop: 32, transition: 'background 0.3s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#d4697c'}
                    onMouseLeave={e => e.currentTarget.style.background = '#1a1a1a'}
                  >Записатись</Link>
                </div>
                <div style={{ background: '#1a1a1a', padding: '32px', textAlign: 'center' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: '#f8c4cf', fontStyle: 'italic', marginBottom: 16, lineHeight: 1.5 }}>Маєш питання?</p>
                  <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 13, color: 'rgba(255,240,243,0.5)', fontWeight: 300, marginBottom: 24 }}>Відповімо протягом 15 хвилин</p>
                  <Link to="/contact" style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#f2a8b6', borderBottom: '1px solid rgba(242,168,182,0.3)', paddingBottom: 2 }}>Написати</Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
