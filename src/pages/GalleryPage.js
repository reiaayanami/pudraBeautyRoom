import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import useInView from '../hooks/useInView';
import { getGalleryItems } from '../lib/contentful';

/* ── Before/After Slider ── */
function BeforeAfterSlider({ title, desc, beforeImg, afterImg, beforeColor, afterColor }) {
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);
  const containerRef = useRef(null);

  const updatePos = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPos((x / rect.width) * 100);
  };

  const onMouseDown = (e) => { dragging.current = true; e.preventDefault(); };
  const onMouseMove = (e) => { if (dragging.current) updatePos(e.clientX); };
  const onMouseUp   = () => { dragging.current = false; };
  const onTouchMove = (e) => { updatePos(e.touches[0].clientX); };

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousemove', onMouseMove);
    return () => { window.removeEventListener('mouseup', onMouseUp); window.removeEventListener('mousemove', onMouseMove); };
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 0, userSelect: 'none' }}>
      <div ref={containerRef} style={{ position: 'relative', height: 380, cursor: 'ew-resize' }}
        onMouseDown={onMouseDown} onTouchMove={onTouchMove}>

        {/* AFTER */}
        <div style={{ position: 'absolute', inset: 0, background: afterColor || '#fde0e6', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {afterImg
            ? <img src={afterImg} alt="після" style={{ width:'100%', height:'100%', objectFit:'cover' }} className="before-after-img" />
            : <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 80, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>P</span>
          }
          <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(255,255,255,0.85)', padding: '6px 14px' }}>
            <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4697c' }}>Після</span>
          </div>
        </div>

        {/* BEFORE */}
        <div style={{ position: 'absolute', inset: 0, clipPath: `inset(0 ${100 - pos}% 0 0)`, background: beforeColor || '#e8d0d8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {beforeImg
            ? <img src={beforeImg} alt="до" style={{ width:'100%', height:'100%', objectFit:'cover' }} className="before-after-img" />
            : <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 80, color: 'rgba(255,255,255,0.2)', fontStyle: 'italic' }}>P</span>
          }
          <div style={{ position: 'absolute', bottom: 16, left: 16, background: 'rgba(255,255,255,0.85)', padding: '6px 14px' }}>
            <span style={{ fontFamily: "'Jost',sans-serif", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#8a7070' }}>До</span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: `${pos}%`, width: 2, background: 'white', transform: 'translateX(-50%)', pointerEvents: 'none', boxShadow: '0 0 8px rgba(0,0,0,0.15)' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 44, height: 44, borderRadius: '50%', background: 'white', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <span style={{ color: '#d4697c', fontSize: 14 }}>◁</span>
            <span style={{ color: '#d4697c', fontSize: 14 }}>▷</span>
          </div>
        </div>
      </div>
      <div style={{ padding: '20px 24px', background: '#fff0f3', borderTop: '1px solid rgba(242,168,182,0.2)' }}>
        <h4 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: '#1a1a1a', marginBottom: 4 }}>{title}</h4>
        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: 13, color: '#8a7070', fontWeight: 300 }}>{desc}</p>
      </div>
    </div>
  );
}

/* ── Gallery items — градієнти для fallback якщо немає фото ── */
const gradients = [
  'linear-gradient(135deg,#fde0e6,#f2a8b6)',
  'linear-gradient(135deg,#f8c4cf,#fde0e6)',
  'linear-gradient(135deg,#f2a8b6,#f8c4cf)',
  'linear-gradient(135deg,#fce8ec,#fde0e6)',
  'linear-gradient(135deg,#f8c4cf,#fce8ec)',
  'linear-gradient(135deg,#fde0e6,#fce8ec)',
  'linear-gradient(135deg,#fff0f3,#fde0e6)',
  'linear-gradient(135deg,#f2a8b6,#fde0e6)',
  'linear-gradient(135deg,#fce8ec,#f8c4cf)',
  'linear-gradient(135deg,#fde0e6,#f2a8b6)',
  'linear-gradient(135deg,#fff0f3,#fce8ec)',
  'linear-gradient(135deg,#f8c4cf,#fff0f3)',
];

const categories = ['Всі', 'Instagram'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('Всі');
  const [lightbox, setLightbox] = useState(null);
  const [muted, setMuted] = useState(true);
  const [headerRef, headerInView] = useInView();
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    getGalleryItems().then(items =>
      setGalleryItems(items.map((item, i) => ({ ...item, gradient: gradients[i % gradients.length] })))
    ).catch(console.error);
  }, []);

  // Динамічні категорії — тільки ті що є в даних
  const categories = ['Всі', ...new Set(galleryItems.map(g => g.category).filter(Boolean))];

  const filtered = activeCategory==='Всі' ? galleryItems : galleryItems.filter(g=>g.category===activeCategory);

  return (
    <PageWrapper>
      {/* Hero */}
      <section style={{ padding:'180px 0 80px', background:'linear-gradient(135deg,#fff0f3,#fdf8f5)', overflow:'clip', position:'relative' }}>
        <div style={{ position:'absolute', bottom:-30, right:-20, fontFamily:"'DM Serif Display',serif", fontSize:'clamp(80px,15vw,200px)', color:'rgba(232,137,154,0.05)', pointerEvents:'none', userSelect:'none', fontStyle:'italic' }}>Gallery</div>
        <div className="container" ref={headerRef}>
          <motion.div initial={{ opacity:0, y:20 }} animate={headerInView?{opacity:1,y:0}:{}} style={{ fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:'0.3em', textTransform:'uppercase', color:'#d4697c', display:'flex', alignItems:'center', gap:16, marginBottom:32 }}>
            Галерея
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:40 }} animate={headerInView?{opacity:1,y:0}:{}} transition={{ delay:0.1 }} style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(48px,6vw,88px)', color:'#1a1a1a', lineHeight:1.0 }}>
            Результати, що <em style={{ fontStyle:'italic', color:'#d4697c' }}>говорять</em><br/>самі за себе
          </motion.h1>
        </div>
      </section>

      {/* Before/After sliders */}
      <section style={{ padding:'80px 0', background:'#fffbf9' }}>
        <div className="container">
          <div style={{ marginBottom:48, textAlign:'center' }}>
            <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:'0.3em', textTransform:'uppercase', color:'#d4697c', display:'flex', alignItems:'center', justifyContent:'center', gap:16, marginBottom:20 }}>
              До та після
            </div>
            <p style={{ fontFamily:"'Jost',sans-serif", fontSize:14, color:'#8a7070', fontWeight:300 }}>Перетягуйте лінію щоб порівняти результат</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24}} className="before-after-grid">
            <BeforeAfterSlider
              title="LPG масаж тіла"
              desc="Результат після курсу 12 сеансів"
              beforeImg="/beforeBlock1.png"
              afterImg="/afterBlock1.png"
            />
            <BeforeAfterSlider
              title="RF-ліфтинг обличчя"
              desc="Результат після 6 сеансів"
              beforeImg="/beforeBlock2.png"
              afterImg="/afterBlock2.png"
            />
          </div>
        </div>
      </section>

      {/* Filters */}
      <section style={{ padding:'0', background:'#fffbf9', borderBottom:'1px solid rgba(242,168,182,0.15)' }}>
        <div className="container">
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', padding:'24px 0' }}>
            {categories.map(cat=>(
              <button key={cat} onClick={()=>setActiveCategory(cat)} style={{ fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:'0.15em', textTransform:'uppercase', padding:'10px 24px', border:'1px solid', borderColor:activeCategory===cat?'#d4697c':'rgba(242,168,182,0.3)', background:activeCategory===cat?'#d4697c':'transparent', color:activeCategory===cat?'white':'#8a7070', cursor:'pointer', transition:'all 0.3s' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry grid */}
      <section style={{ padding:'60px 0 140px', background:'#fffbf9' }}>
        <div className="container">
          <div className="gallery-grid">
            <AnimatePresence>
              {filtered.map((item,i)=><GalleryItem key={item.id} item={item} index={i} onClick={()=>setLightbox(item)}/>)}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Lightbox — cursor auto for close button visibility */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={()=>{ setLightbox(null); setMuted(true); }}
            style={{ position:'fixed', inset:0, zIndex:10000, background:'rgba(26,26,26,0.96)', backdropFilter:'blur(20px)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'auto' }}
          >
            {/* Close button — always visible */}
            <button
              onClick={()=>{ setLightbox(null); setMuted(true); }}
              style={{ position:'absolute', top:24, right:24, background:'rgba(255,240,243,0.1)', border:'1px solid rgba(255,240,243,0.2)', color:'rgba(255,240,243,0.8)', width:48, height:48, borderRadius:'50%', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.3s', zIndex:10001 }}
              onMouseEnter={e=>{ e.currentTarget.style.background='#d4697c'; e.currentTarget.style.color='white'; }}
              onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,240,243,0.1)'; e.currentTarget.style.color='rgba(255,240,243,0.8)'; }}
            >✕</button>

            <motion.div
              initial={{ scale:0.85, opacity:0 }} animate={{ scale:1, opacity:1 }}
              exit={{ scale:0.85, opacity:0 }} transition={{ ease:[0.19,1,0.22,1] }}
              onClick={e=>e.stopPropagation()}
              style={{ maxWidth:560, width:'90%', cursor:'auto' }}
            >
              <div style={{ maxHeight: '70vh', background: lightbox.photo ? '#1a1a1a' : lightbox.gradient, marginBottom:24, position:'relative', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
                {lightbox.video
                  ? <>
                      <video src={lightbox.video} autoPlay muted={muted} loop playsInline style={{ width:'100%', maxHeight:'70vh', objectFit:'contain' }} />
                      <button
                        onClick={e => { e.stopPropagation(); setMuted(m => !m); }}
                        style={{ position:'absolute', bottom:12, right:12, width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)', color:'white', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)', transition:'all 0.3s' }}
                        onMouseEnter={e => e.currentTarget.style.background='rgba(212,105,124,0.6)'}
                        onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.15)'}
                      >
                        {muted ? '🔇' : '🔊'}
                      </button>
                    </>
                  : lightbox.photo
                  ? <img src={lightbox.photo} alt={lightbox.title} style={{ width:'100%', height:'auto', maxHeight:'70vh', objectFit:'contain' }} />
                  : <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:80, color:'rgba(255,255,255,0.2)', fontStyle:'italic' }}>P</span>
                }
                <div style={{ position:'absolute', top:12, right:12, background:'#d4697c', color:'white', padding:'4px 12px', fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase' }}>
                  {lightbox.video ? '▶ Reels' : lightbox.category}
                </div>
              </div>
              <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:'#f8c4cf', marginBottom:16 }}>{lightbox.title}</h3>
              {lightbox.permalink && (
                <a href={lightbox.permalink} target="_blank" rel="noopener noreferrer"
                  style={{ fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', color:'#f2a8b6', borderBottom:'1px solid rgba(242,168,182,0.4)', paddingBottom:2, display:'inline-block' }}
                >Відкрити в Instagram →</a>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-grid { columns: 3; gap: 12px; }
        .gallery-grid > * { break-inside: avoid; margin-bottom: 12px; }
        @media (max-width: 900px) { .gallery-grid { columns: 2 !important; } }
        @media (max-width: 560px) { .gallery-grid { columns: 1 !important; } }
      `}</style>
    </PageWrapper>
  );
}

function GalleryItem({ item, index, onClick }) {
  const [ref, inView] = useInView(0.1);
  const heights = [280,360,240,320,300,380];
  const h = heights[index % heights.length];
  return (
    <motion.div ref={ref} initial={{ opacity:0, y:30 }} animate={inView?{opacity:1,y:0}:{}} transition={{ delay:(index%3)*0.08 }}
      onClick={onClick}
      style={{ height:h, position:'relative', overflow:'hidden', cursor:'pointer', display:'block' }}
    >
      <motion.div
        style={{ height:'100%', background: item.photo ? 'none' : item.gradient, position:'relative', overflow:'hidden' }}
        whileHover={{ scale:1.03 }}
        transition={{ duration:0.4 }}
      >
        {/* Відео для рілсів */}
        {item.video ? (
          <video
            src={item.video}
            autoPlay muted loop playsInline
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }}
          />
        ) : item.photo ? (
          <img src={item.photo} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
        ) : (
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:64, color:'rgba(255,255,255,0.18)', fontStyle:'italic' }}>P</span>
          </div>
        )}

        {/* Hover overlay з blur */}
        <motion.div
          initial={{ opacity:0 }}
          whileHover={{ opacity:1 }}
          transition={{ duration:0.3 }}
          style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'20px' }}
        >
          {/* Blur шар */}
          <div style={{ position:'absolute', inset:0, backdropFilter:'blur(4px)', background:'linear-gradient(to top, rgba(26,26,26,0.85) 0%, rgba(26,26,26,0.2) 50%, transparent 100%)' }} />

          {/* Контент поверх blur */}
          <div style={{ position:'relative', zIndex:1 }}>
            {item.permalink ? (
              <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:15, color:'#fff0f3', display:'block', lineHeight:1.4 }}>{item.title}</span>
            ) : (
              <>
                <span style={{ fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#f2a8b6', marginBottom:6, display:'block' }}>{item.category}</span>
                <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:'#fff0f3' }}>{item.title}</span>
                {item.desc && <span style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:'rgba(255,240,243,0.7)', fontWeight:300, marginTop:4, display:'block' }}>{item.desc}</span>}
              </>
            )}
          </div>
        </motion.div>

        {/* Категорія badge */}
        <div style={{ position:'absolute', top:12, left:12, background:'rgba(255,248,250,0.88)', backdropFilter:'blur(8px)', padding:'4px 12px' }}>
          <span style={{ fontFamily:"'Jost',sans-serif", fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'#d4697c' }}>
            {item.video ? '▶ Reels' : item.category}
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}
