import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import useInView from '../hooks/useInView';
import { getServices } from '../lib/contentful';

const categories = ['Всі', 'Апаратні', 'Епіляція'];

export default function ServicesPage() {
 const [activeCategory, setActiveCategory] = useState('Всі');
 const [headerRef, headerInView] = useInView();
 const [allServices, setAllServices] = useState([]);

 useEffect(() => {
   getServices().then(setAllServices).catch(console.error);
 }, []);

 const filtered = activeCategory === 'Всі' ? allServices : allServices.filter(s => s.category === activeCategory);

 return (
 <PageWrapper>
 <section style={{ padding: '180px 0 100px', background: 'linear-gradient(135deg, #fff0f3 0%, #fdf8f5 100%)', position: 'relative', overflow: 'clip' }}>
 <div style={{ position: 'absolute', top: 0, right: 0, width: '50%', height: '100%', background: 'radial-gradient(ellipse at 80% 50%, rgba(248,196,207,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />
 <div style={{ position: 'absolute', bottom: -30, right: -20, fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(80px,15vw,200px)', color: 'rgba(232,137,154,0.05)', pointerEvents: 'none', userSelect: 'none', fontStyle: 'italic' }}>Beauty</div>
 <div className="container">
 <div ref={headerRef}>
 <motion.div initial={{ opacity: 0, y: 20 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#d4697c', display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
 <span style={{ display: 'block', width: 40, height: 1, background: '#e8899a' }} />Наші послуги
 </motion.div>
 <motion.h1 initial={{ opacity: 0, y: 40 }} animate={headerInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1 }} style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(48px,6vw,96px)', color: '#1a1a1a', lineHeight: 1.0, maxWidth: 700 }}>
 Апаратна<br /><em style={{ fontStyle: 'italic', color: '#d4697c' }}>косметологія</em>
 </motion.h1>
 </div>
 </div>
 </section>

 {/* Filters */}
 <section style={{ padding: '0', background: '#fffbf9', borderBottom: '1px solid rgba(242,168,182,0.15)' }}>
 <div className="container">
 <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '24px 0' }}>
 {categories.map(cat => (
 <button key={cat} onClick={() => setActiveCategory(cat)} style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '10px 24px', border: '1px solid', borderColor: activeCategory === cat ? '#d4697c' : 'rgba(242,168,182,0.3)', background: activeCategory === cat ? '#d4697c' : 'transparent', color: activeCategory === cat ? 'white' : '#8a7070', cursor: 'none', transition: 'all 0.3s' }}>
 {cat}
 </button>
 ))}
 </div>
 </div>
 </section>

 <section style={{ padding: '80px 0 140px', background: '#fffbf9' }}>
 <div className="container">
 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 2}} className="services-catalog-grid">
 {filtered.map((svc, i) => <ServiceCard key={svc.serviceId} svc={svc} index={i} />)}
 </div>
 </div>
 </section>

 <section style={{ padding: '100px 0', background: '#1a1a1a', textAlign: 'center' }}>
 <div className="container">
 <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(36px,4vw,64px)', color: '#f8c4cf', marginBottom: 24 }}>Не знаєш з чого почати?</h2>
 <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 15, color: 'rgba(255,240,243,0.5)', fontWeight: 300, marginBottom: 48, maxWidth: 480, margin: '0 auto 48px' }}>
 Запишись на безкоштовну консультацію — підберемо програму індивідуально
 </p>
 <Link to="/booking" style={{ fontFamily: "'Jost',sans-serif", fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', background: '#f2a8b6', color: '#1a1a1a', padding: '18px 48px', display: 'inline-block', transition: 'background 0.3s' }}
 onMouseEnter={e => e.currentTarget.style.background = '#e8899a'}
 onMouseLeave={e => e.currentTarget.style.background = '#f2a8b6'}
 >Безкоштовна консультація</Link>
 </div>
 </section>
 </PageWrapper>
 );
}

function ServiceCard({ svc, index }) {
 const [ref, inView] = useInView(0.1);
 const [hovered, setHovered] = useState(false);
 return (
 <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: (index % 3) * 0.1, duration: 0.7 }}>
 <Link to={`/services/${svc.serviceId}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ display: 'block', padding: '48px 40px', border: '1px solid rgba(242,168,182,0.15)', background: hovered ? '#fff0f3' : '#fffbf9', transition: 'all 0.4s', position: 'relative', overflow: 'hidden' }}>
 <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(248,196,207,0.1),transparent)', opacity: hovered ? 1 : 0, transition: 'opacity 0.4s' }} />
 <div style={{ position: 'relative' }}>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
 <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, color: '#e8899a', letterSpacing: '0.1em', fontWeight: 300 }}>{svc.num}</span>
 <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4697c', background: 'rgba(212,105,124,0.08)', padding: '4px 12px' }}>{svc.category}</span>
 </div>
 <h3 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 24, color: '#1a1a1a', marginBottom: 16, lineHeight: 1.2 }}>{svc.title}</h3>
 <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 14, color: '#8a7070', lineHeight: 1.7, fontWeight: 300, marginBottom: 32 }}>{svc.desc}</p>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
 {[['Тривалість', svc.duration], ['Ефект', svc.effect]].map(([label, val]) => (
 <div key={label}>
 <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#e8899a', marginBottom: 4 }}>{label}</div>
 <div style={{ fontFamily: "'Jost',sans-serif", fontSize: 13, color: '#2d2020', fontWeight: 300 }}>{val}</div>
 </div>
 ))}
 </div>
 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
 <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: '#d4697c' }}>{svc.price}</span>
 <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1a1a', borderBottom: '1px solid', paddingBottom: 2 }}>Детальніше</span>
 </div>
 </div>
 </Link>
 </motion.div>
 );
}
