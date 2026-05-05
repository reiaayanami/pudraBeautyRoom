import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import useInView from '../hooks/useInView';
import { getSpecialist, getStats } from '../lib/contentful';

export default function AboutPage() {
  const [specialist, setSpecialist] = useState(null);
  const [stats, setStats] = useState([]);
  const [heroRef,    heroInView]    = useInView(0.2);
  const [missionRef, missionInView] = useInView(0.2);
  const [teamRef,    teamInView]    = useInView(0.1);
  const [certRef,    certInView]    = useInView(0.2);
  const [courseRef,  courseInView]  = useInView(0.2);

  useEffect(() => {
    getSpecialist().then(setSpecialist).catch(console.error);
    getStats().then(setStats).catch(console.error);
  }, []);

  const certifications = specialist?.certifications || [];
  const specializations = specialist?.specializations || [];

  return (
    <PageWrapper>
      {/* Hero */}
      <section style={{ padding: '180px 0 100px', background: 'linear-gradient(135deg,#fff0f3,#fdf8f5)', overflow: 'clip', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: -20, right: -20, fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(80px,15vw,200px)', color: 'rgba(232,137,154,0.05)', pointerEvents: 'none', userSelect: 'none', fontStyle: 'italic' }}>Story</div>
        <div className="container" ref={heroRef}>
          <motion.div initial={{ opacity:0, y:20 }} animate={heroInView?{opacity:1,y:0}:{}} style={{ fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:'0.3em', textTransform:'uppercase', color:'#d4697c', display:'flex', alignItems:'center', gap:16, marginBottom:32 }}>
            Про нас
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:40 }} animate={heroInView?{opacity:1,y:0}:{}} transition={{ delay:0.1 }} style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(48px,6vw,88px)', color:'#1a1a1a', lineHeight:1.0, maxWidth:700 }}>
            Pudra Beauty Room —<br/><em style={{ fontStyle:'italic', color:'#d4697c' }}>це більше ніж салон</em>
          </motion.h1>
        </div>
      </section>

      {/* Mission */}
      <section ref={missionRef} style={{ padding:'100px 0', background:'#fffbf9' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center'}} className="about-mission-grid">
            <motion.div initial={{ opacity:0, x:-40 }} animate={missionInView?{opacity:1,x:0}:{}}>
              <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(36px,4vw,56px)', color:'#1a1a1a', lineHeight:1.1, marginBottom:32 }}>
                Наша місія — <em style={{ fontStyle:'italic', color:'#d4697c' }}>розкрити</em> твою природну красу
              </h2>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:16, color:'#8a7070', lineHeight:1.9, fontWeight:300, marginBottom:24 }}>
                Pudra Beauty Room відкрилась у Нововолинську з однією ціллю — зробити преміальну апаратну косметологію доступною та зрозумілою для кожної жінки міста.
              </p>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:16, color:'#8a7070', lineHeight:1.9, fontWeight:300, marginBottom:40 }}>
                Ми не просто надаємо послуги — ми будуємо відносини з кожним клієнтом, розробляємо індивідуальні програми та супроводжуємо на шляху до ідеальної шкіри.
              </p>
              <Link to="/booking" style={{ fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', background:'#1a1a1a', color:'white', padding:'18px 44px', display:'inline-block', transition:'background 0.3s' }}
                onMouseEnter={e=>e.currentTarget.style.background='#d4697c'}
                onMouseLeave={e=>e.currentTarget.style.background='#1a1a1a'}
              >Познайомитись</Link>
            </motion.div>

            <motion.div initial={{ opacity:0, x:40 }} animate={missionInView?{opacity:1,x:0}:{}} transition={{ delay:0.2 }} style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}} className="about-stats-grid">
              {(stats.length > 0
                ? stats.map((s, i) => ({ val: s.value, label: s.label.replace(' ', '\n'), dark: i % 2 !== 0 }))
                : [
                    { val:'8+', label:'Років\nдосвіду', dark:false },
                    { val:'800+', label:'Задоволених\nклієнтів', dark:true },
                    { val:'11+', label:'Апаратних\nпроцедур', dark:true },
                    { val:'98%', label:'Повертаються\nзнову', dark:false },
                  ]
              ).map((s,i)=>(
                <div key={i} style={{ background:s.dark?'#1a1a1a':'#fff0f3', padding:'40px 28px', display:'flex', flexDirection:'column', justifyContent:'flex-end', minHeight:160 }}>
                  <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:44, color:s.dark?'#f8c4cf':'#d4697c', lineHeight:1, marginBottom:10 }}>{s.val}</div>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:'0.1em', color:s.dark?'rgba(255,240,243,0.5)':'#8a7070', fontWeight:300, whiteSpace:'pre-line', lineHeight:1.4 }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding:'100px 0', background:'linear-gradient(135deg,#1a1a1a,#2d2020)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 100%, rgba(248,196,207,0.06),transparent 60%)', pointerEvents:'none' }}/>
        <div className="container">
          <div style={{ textAlign:'center', marginBottom:72 }}>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(36px,4vw,60px)', color:'#f8c4cf' }}>Наші <em style={{ fontStyle:'italic' }}>цінності</em></h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1}} className="about-values-grid">
            {[
              { icon:'✦', title:'Професіоналізм', desc:'Постійне навчання та вдосконалення — основа нашої роботи' },
              { icon:'✦', title:'Прозорість', desc:'Чесні консультації, реалістичні очікування, справжній результат' },
              { icon:'✦', title:'Турбота', desc:'Кожна клієнтка — особлива. Індивідуальний підхід завжди' },
            ].map((v,i)=>(
              <div key={i} style={{ padding:'56px 40px', background:'rgba(255,240,243,0.03)', border:'1px solid rgba(255,240,243,0.06)', textAlign:'center' }}>
                <div style={{ width:48, height:48, borderRadius:'50%', border:'1.5px solid rgba(242,168,182,0.4)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', color:'#f2a8b6', fontSize:18 }}>{v.icon}</div>
                <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, color:'#fff0f3', marginBottom:16 }}>{v.title}</h3>
                <p style={{ fontFamily:"'Jost',sans-serif", fontSize:14, color:'rgba(255,240,243,0.4)', fontWeight:300, lineHeight:1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team — single specialist */}
      <section ref={teamRef} style={{ padding:'100px 0', background:'#fffbf9' }}>
        <div className="container">
          <div style={{ marginBottom:64 }}>
            <motion.div initial={{ opacity:0, y:20 }} animate={teamInView?{opacity:1,y:0}:{}} style={{ fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:'0.3em', textTransform:'uppercase', color:'#d4697c', display:'flex', alignItems:'center', gap:16, marginBottom:32 }}>
              Майстер
            </motion.div>
            <motion.h2 initial={{ opacity:0, y:30 }} animate={teamInView?{opacity:1,y:0}:{}} transition={{ delay:0.1 }} style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(36px,4vw,60px)', color:'#1a1a1a' }}>
              Людина, якій <em style={{ fontStyle:'italic', color:'#d4697c' }}>ви довіряєте</em>
            </motion.h2>
          </div>

          <motion.div initial={{ opacity:0, y:40 }} animate={teamInView?{opacity:1,y:0}:{}} transition={{ delay:0.15 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:64, alignItems:'center', background:'#fff0f3', border:'1px solid rgba(242,168,182,0.2)', padding:'56px'}} className="about-team-inner">
              {/* Avatar */}
              <div style={{ overflow:'hidden', border:'1px solid rgba(242,168,182,0.2)', height: 420 }}>
                <img src="/alina-photo.jpg" alt="Наталія Ковальчук" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top' }} />
              </div>
              {/* Info */}
              <div>
                <div style={{ width:'100%', height:280, overflow:'hidden', marginBottom:20, border:'1px solid rgba(242,168,182,0.2)' }}>
                  <img src="/вониНамДовіряють.jpg" alt="Вони нам довіряють" style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }}/>
                </div>
                <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:36, color:'#1a1a1a', marginBottom:8 }}>{specialist?.name || 'Наталія Ковальчук'}</h3>
                <p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', color:'#d4697c', marginBottom:28 }}>{specialist?.role || 'Засновниця & Головний косметолог'}</p>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:32 }}>
                  {[
                    { label:'Досвід', value:'8+ років практики' },
                    { label:'Статус', value:'Сертифікований спеціаліст' },
                    { label:'Спеціалізація', value:'Апаратна косметологія' },
                    { label:'Курси', value:'Проводить навчання' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', color:'#d4697c', marginBottom:6 }}>{label}</div>
                      <div style={{ fontFamily:"'Jost',sans-serif", fontSize:14, color:'#2d2020', fontWeight:300 }}>{value}</div>
                    </div>
                  ))}
                </div>

                <p style={{ fontFamily:"'Jost',sans-serif", fontSize:15, color:'#8a7070', lineHeight:1.8, fontWeight:300, marginBottom:32 }}>
                  {specialist?.bio || 'Наталія — сертифікований спеціаліст з апаратної косметології з 8-річним досвідом. Постійно підвищує кваліфікацію, слідкує за новинками б\'юті-індустрії та передає знання своїм учням на авторських курсах.'}
                </p>

                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {specializations.length > 0
                    ? specializations.map(spec=>(
                        <span key={spec} style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:'#d4697c', background:'rgba(212,105,124,0.08)', padding:'6px 16px', fontWeight:300 }}>{spec}</span>
                      ))
                    : ['LPG масаж', 'Ендосфера', 'RF-ліфтинг', 'EMSLIM', 'Кріоліполіз', 'Лазерна епіляція', 'Morpheus8'].map(spec=>(
                        <span key={spec} style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:'#d4697c', background:'rgba(212,105,124,0.08)', padding:'6px 16px', fontWeight:300 }}>{spec}</span>
                      ))
                  }
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Certifications */}
      <section ref={certRef} style={{ padding:'80px 0', background:'#fff0f3' }}>
        <div className="container">
          <motion.h2 initial={{ opacity:0, y:30 }} animate={certInView?{opacity:1,y:0}:{}} style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(32px,3vw,48px)', color:'#1a1a1a', marginBottom:56, textAlign:'center' }}>
            Сертифікати та <em style={{ fontStyle:'italic', color:'#d4697c' }}>досягнення</em>
          </motion.h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }} className="about-certs-grid">
            {(certifications.length > 0 ? certifications : [
              'Сертифікат апаратної косметології міжнародного зразка',
              'Офіційна сертифікація LPG Endermologie',
              'Курс RF та HIFU терапії (GBT Academy)',
              'Сертифікація Ендосфера-терапія',
              'Мікроголковий RF Morpheus8 — сертифікований спеціаліст',
              'EMSLIM — електромагнітна стимуляція м\'язів',
              'Лазерна безпека (BLS certification)',
              'Кріоліполіз — офіційна підготовка',
            ]).map((cert,i)=>(
              <motion.div key={i} initial={{ opacity:0, y:20 }} animate={certInView?{opacity:1,y:0}:{}} transition={{ delay:i*0.07 }}
                style={{ position:'relative', padding:'32px 28px 28px', background:'white', borderTop:'3px solid #e8899a', boxShadow:'0 4px 24px rgba(232,137,154,0.08)' }}>
                <div style={{ position:'absolute', top:16, right:20, fontFamily:"'DM Serif Display',serif", fontSize:32, color:'rgba(232,137,154,0.12)', fontWeight:400, lineHeight:1 }}>
                  {String(i+1).padStart(2,'0')}
                </div>
                <div style={{ width:36, height:36, borderRadius:'50%', background:'rgba(232,137,154,0.1)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
                  <span style={{ color:'#e8899a', fontSize:14 }}>✦</span>
                </div>
                <span style={{ fontFamily:"'Jost',sans-serif", fontSize:13, color:'#2d2020', fontWeight:300, lineHeight:1.6, display:'block' }}>{cert}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses teaser */}
      <section ref={courseRef} style={{ padding:'100px 0', background:'#fffbf9' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center' }}>
            <motion.div initial={{ opacity:0, x:-40 }} animate={courseInView?{opacity:1,x:0}:{}}>
              <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:'0.3em', textTransform:'uppercase', color:'#d4697c', display:'flex', alignItems:'center', gap:16, marginBottom:32 }}>
                Навчання
              </div>
              <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(36px,4vw,56px)', color:'#1a1a1a', lineHeight:1.1, marginBottom:24 }}>
                Хочеш навчитись? <em style={{ fontStyle:'italic', color:'#d4697c' }}>Ми навчаємо</em>
              </h2>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:16, color:'#8a7070', lineHeight:1.9, fontWeight:300, marginBottom:40 }}>
                Наталія проводить авторські курси з апаратної косметології. Теорія + практика на моделях, невеликі групи, сертифікат після завершення та підтримка після навчання.
              </p>
              <Link to="/contact" style={{ fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', background:'#1a1a1a', color:'white', padding:'18px 44px', display:'inline-block', transition:'background 0.3s' }}
                onMouseEnter={e=>e.currentTarget.style.background='#d4697c'}
                onMouseLeave={e=>e.currentTarget.style.background='#1a1a1a'}
              >Записатись на курс</Link>
            </motion.div>
            <motion.div initial={{ opacity:0, x:40 }} animate={courseInView?{opacity:1,x:0}:{}} transition={{ delay:0.2 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                {(specialist?.courses?.length > 0
                  ? specialist.courses
                  : ['LPG масаж', 'RF-ліфтинг', 'Ендосфера', 'Апаратні методики']
                ).map((text, i)=>(
                  <div key={i} style={{ padding:'28px 24px', border:'1px solid rgba(242,168,182,0.2)', display:'flex', alignItems:'center', gap:14, transition:'all 0.3s' }}
                    onMouseEnter={e=>{ e.currentTarget.style.background='#fff0f3'; e.currentTarget.style.borderColor='rgba(232,137,154,0.4)'; }}
                    onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(242,168,182,0.2)'; }}
                  >
                    <span style={{ color:'#e8899a', fontSize:16 }}>✦</span>
                    <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:18, color:'#1a1a1a' }}>{text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
