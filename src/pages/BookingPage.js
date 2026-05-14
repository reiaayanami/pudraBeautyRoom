import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import useInView from '../hooks/useInView';
import { getServices } from '../lib/contentful';
import { formatPhone, validatePhone } from '../lib/phoneFormat';

const timeSlots = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
const days = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд'];

function generateDates() {
  const result = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    result.push(d);
  }
  return result;
}

function validateContact(data) {
  const errors = {};
  if (!data.name.trim() || data.name.trim().length < 2) errors.name = "Введіть ім'я";
  else if (/\d/.test(data.name)) errors.name = "Ім'я не може містити цифри";
  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;
  return errors;
}

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState('');
  const [contact, setContact] = useState({ name: '', phone: '', comment: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [done, setDone] = useState(false);
  const [headerRef, headerInView] = useInView();
  const [servicesList, setServicesList] = useState([]);
  const dates = generateDates();
  const location = useLocation();

  useEffect(() => {
    getServices()
      .then(data => {
        const titles = data.map(s => s.title);
        setServicesList(titles);
        // Автовибір послуги якщо прийшли з ServiceDetailPage
        if (location.state?.service && titles.includes(location.state.service)) {
          setSelectedServices([location.state.service]);
        }
      })
      .catch(() => setServicesList([
        'Ендосфера (обличчя)', 'Ендосфера (тіло)', 'LPG масаж (обличчя)', 'LPG масаж (тіло)',
        'RF-ліфтинг (обличчя)', 'RF-ліфтинг (тіло)', 'Кавітація', 'Кріоліполіз',
        'Вакуумно-роликовий масаж', 'Пресотерапія', 'EMSLIM', 'Мікротоки',
        'Мікроголковий RF Morpheus8', 'Лазерна епіляція', 'Безкоштовна консультація',
      ]));
  }, [location.state]);

  const toggleService = (svc) => {
    setSelectedServices(prev =>
      prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc]
    );
  };

  const handleContactChange = (field, value) => {
    if (field === 'phone') value = formatPhone(value);
    if (field === 'name') value = value.replace(/[^a-zA-ZА-ЯЄІЇҐа-яєіїґ'\-\s]/g, '');
    setContact(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const e = validateContact({ ...contact, [field]: value });
      setErrors(prev => ({ ...prev, [field]: e[field] }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const e = validateContact(contact);
    setErrors(prev => ({ ...prev, [field]: e[field] }));
  };

  const handleSubmit = () => {
    setTouched({ name: true, phone: true });
    const e = validateContact(contact);
    setErrors(e);
    if (Object.keys(e).length === 0) setDone(true);
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '16px 0', background: 'transparent', border: 'none',
    borderBottom: `1px solid ${errors[field] && touched[field] ? '#e85555' : 'rgba(242,168,182,0.4)'}`,
    fontFamily: "'Jost',sans-serif", fontSize: 15, color: '#1a1a1a', fontWeight: 300, outline: 'none',
  });

  return (
    <PageWrapper>
      <section style={{ padding:'160px 0 60px', background:'linear-gradient(135deg,#fff0f3,#fdf8f5)', position:'relative', overflow:'clip' }}>
        <div style={{ position:'absolute', bottom:-30, right:-20, fontFamily:"'DM Serif Display',serif", fontSize:'clamp(80px,15vw,200px)', color:'rgba(232,137,154,0.05)', pointerEvents:'none', userSelect:'none', fontStyle:'italic' }}>Booking</div>
        <div className="container" ref={headerRef}>
          <motion.div initial={{ opacity:0, y:20 }} animate={headerInView?{opacity:1,y:0}:{}} style={{ fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:'0.3em', textTransform:'uppercase', color:'#d4697c', display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
            Онлайн-запис
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:40 }} animate={headerInView?{opacity:1,y:0}:{}} transition={{ delay:0.1 }} style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(40px,5vw,72px)', color:'#1a1a1a', lineHeight:1.0 }}>
            Запис на <em style={{ fontStyle:'italic', color:'#d4697c' }}>процедуру</em>
          </motion.h1>
        </div>
      </section>

      {/* ── Notice banner ── */}
      <section style={{ background:'#1a1a1a', padding:'0' }}>
        <div className="container">
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.8 }}
            style={{ padding:'40px 0', display:'flex', alignItems:'center', justifyContent:'space-between', gap:32, flexWrap:'wrap' }}
          >
            <div style={{ display:'flex', alignItems:'flex-start', gap:20 }}>
              <div style={{ width:44, height:44, borderRadius:'50%', border:'1.5px solid rgba(242,168,182,0.4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#f2a8b6', fontSize:18, marginTop:2 }}>
                ◈
              </div>
              <div>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#e8899a', marginBottom:8 }}>
                  Повідомлення
                </div>
                <p style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(18px,2.5vw,26px)', color:'#fff0f3', lineHeight:1.3, marginBottom:8 }}>
                  Онлайн-запис наразі в розробці
                </p>
                <p style={{ fontFamily:"'Jost',sans-serif", fontSize:14, color:'rgba(255,240,243,0.5)', fontWeight:300, lineHeight:1.7 }}>
                  Для запису на процедуру, будь ласка, зателефонуйте нам — ми з радістю вас запишемо
                </p>
              </div>
            </div>
            <a
              href="tel:+380676768798"
              style={{ fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', background:'#f2a8b6', color:'#1a1a1a', padding:'18px 40px', display:'inline-block', transition:'background 0.3s', whiteSpace:'nowrap', flexShrink:0 }}
              onMouseEnter={e => e.currentTarget.style.background='#e8899a'}
              onMouseLeave={e => e.currentTarget.style.background='#f2a8b6'}
            >
              +38 (067) 676-87-98
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stepper */}
      {!done && (
        <section style={{ background:'#fffbf9', borderBottom:'1px solid rgba(242,168,182,0.15)', padding:'24px 80px' }} className="booking-stepper">
          <div className="container">
            <div style={{ display:'flex', alignItems:'center', gap:0 }}>
              {[['01','Послуги'],['02','Дата й час'],['03','Контакти']].map(([num,label],i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:0, flex:i<2?1:'none' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, cursor:step>i+1?'none':'default' }} onClick={()=>step>i+1&&setStep(i+1)}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:step>i+1?'#d4697c':step===i+1?'#1a1a1a':'transparent', border:step<=i+1?'1px solid rgba(242,168,182,0.4)':'none', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {step>i+1 ? <span style={{ color:'white', fontSize:14 }}>✓</span> :
                        <span style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:step===i+1?'white':'#8a7070' }}>{num}</span>}
                    </div>
                    <span className="booking-stepper-label" style={{ fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:step===i+1?'#1a1a1a':'#8a7070', whiteSpace:'nowrap' }}>{label}</span>
                  </div>
                  {i<2&&<div style={{ flex:1, height:1, background:'rgba(242,168,182,0.2)', margin:'0 20px' }}/>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{ padding:'80px 0 140px', background:'#fffbf9', minHeight:'60vh' }}>
        <div className="container">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="done" initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} style={{ maxWidth:600, margin:'0 auto', textAlign:'center', padding:'60px 0' }}>
                <div style={{ fontSize:56, marginBottom:32 }}>✦</div>
                <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:48, color:'#1a1a1a', marginBottom:20 }}>Записано! 🌸</h2>
                <p style={{ fontFamily:"'Jost',sans-serif", fontSize:16, color:'#8a7070', fontWeight:300, marginBottom:12 }}>
                  <strong style={{ color:'#1a1a1a', fontWeight:400 }}>{contact.name}</strong>, дякуємо за запис!
                </p>
                <div style={{ background:'#fff0f3', border:'1px solid rgba(242,168,182,0.3)', padding:'32px', marginBottom:32, textAlign:'left' }}>
                  {[
                    ['Послуги', selectedServices.join(', ')],
                    ['Дата', date?.toLocaleDateString('uk-UA',{day:'numeric',month:'long',weekday:'long'})],
                    ['Час', time],
                    ['Телефон', contact.phone],
                  ].map(([k,v])=>(
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(242,168,182,0.15)', gap:16, flexWrap:'wrap' }}>
                      <span style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:'#8a7070', letterSpacing:'0.1em', textTransform:'uppercase', flexShrink:0 }}>{k}</span>
                      <span style={{ fontFamily:"'Jost',sans-serif", fontSize:14, color:'#1a1a1a', fontWeight:300, textAlign:'right' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily:"'Jost',sans-serif", fontSize:14, color:'#8a7070', fontWeight:300 }}>Зателефонуємо для підтвердження протягом 30 хвилин.</p>
              </motion.div>

            ) : step===1 ? (
              <motion.div key="step1" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}>
                <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:36, color:'#1a1a1a', marginBottom:16 }}>
                  Оберіть <em style={{ fontStyle:'italic', color:'#d4697c' }}>послуги</em>
                </h2>
                <p style={{ fontFamily:"'Jost',sans-serif", fontSize:14, color:'#8a7070', fontWeight:300, marginBottom:40 }}>
                  Можна обрати декілька послуг одночасно
                </p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:10, marginBottom:48}} className="booking-services-grid">
                  {servicesList.map(svc=>{
                    const sel = selectedServices.includes(svc);
                    return (
                      <button key={svc} onClick={()=>toggleService(svc)} style={{ padding:'18px 20px', border:'1px solid', borderColor:sel?'#d4697c':'rgba(242,168,182,0.25)', background:sel?'#fff0f3':'transparent', fontFamily:"'Jost',sans-serif", fontSize:13, color:sel?'#d4697c':'#2d2020', textAlign:'left', cursor:'pointer', transition:'all 0.25s', fontWeight:300, position:'relative', display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ width:18, height:18, border:`1.5px solid ${sel?'#d4697c':'rgba(242,168,182,0.4)'}`, borderRadius:3, background:sel?'#d4697c':'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s' }}>
                          {sel && <span style={{ color:'white', fontSize:11 }}>✓</span>}
                        </span>
                        {svc}
                      </button>
                    );
                  })}
                </div>
                {selectedServices.length > 0 && (
                  <div style={{ marginBottom:32, padding:'16px 20px', background:'#fff0f3', border:'1px solid rgba(242,168,182,0.25)' }}>
                    <span style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:'#d4697c', letterSpacing:'0.1em' }}>
                      Обрано: {selectedServices.join(' · ')}
                    </span>
                  </div>
                )}
                <div style={{ display:'flex', justifyContent:'flex-end' }}>
                  <button disabled={selectedServices.length===0} onClick={()=>setStep(2)} style={{ fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', background:selectedServices.length>0?'#1a1a1a':'rgba(26,26,26,0.3)', color:'white', padding:'18px 48px', border:'none', cursor:selectedServices.length>0?'none':'default', transition:'background 0.3s' }}
                    onMouseEnter={e=>selectedServices.length>0&&(e.currentTarget.style.background='#d4697c')}
                    onMouseLeave={e=>e.currentTarget.style.background=selectedServices.length>0?'#1a1a1a':'rgba(26,26,26,0.3)'}
                  >Далі →</button>
                </div>
              </motion.div>

            ) : step===2 ? (
              <motion.div key="step2" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}>
                <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:36, color:'#1a1a1a', marginBottom:48 }}>Оберіть <em style={{ fontStyle:'italic', color:'#d4697c' }}>дату та час</em></h2>
                <div style={{ marginBottom:48 }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color:'#d4697c', marginBottom:20 }}>Дата</div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }} className="booking-dates-grid">
                    {dates.map((d,i)=>{
                      const sel = date && date.toDateString()===d.toDateString();
                      const dn = days[d.getDay()===0?6:d.getDay()-1];
                      return (
                        <button key={i} onClick={()=>setDate(d)} style={{ padding:'14px 12px', border:'1px solid', borderColor:sel?'#d4697c':'rgba(242,168,182,0.25)', background:sel?'#fff0f3':'transparent', cursor:'pointer', transition:'all 0.3s', minWidth:58, textAlign:'center' }}>
                          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, letterSpacing:'0.15em', textTransform:'uppercase', color:sel?'#d4697c':'#8a7070', marginBottom:4 }}>{dn}</div>
                          <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:22, color:sel?'#d4697c':'#1a1a1a' }}>{d.getDate()}</div>
                          <div style={{ fontFamily:"'Jost',sans-serif", fontSize:9, color:sel?'#e8899a':'#8a7070', marginTop:2 }}>{d.toLocaleDateString('uk-UA',{month:'short'})}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ marginBottom:56 }}>
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:'0.25em', textTransform:'uppercase', color:'#d4697c', marginBottom:20 }}>Час</div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {timeSlots.map(t=>{
                      const sel = time===t;
                      return (
                        <button key={t} onClick={()=>setTime(t)} style={{ padding:'11px 18px', border:'1px solid', borderColor:sel?'#d4697c':'rgba(242,168,182,0.25)', background:sel?'#d4697c':'transparent', color:sel?'white':'#2d2020', fontFamily:"'Jost',sans-serif", fontSize:14, fontWeight:300, cursor:'pointer', transition:'all 0.3s' }}>{t}</button>
                      );
                    })}
                  </div>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <button onClick={()=>setStep(1)} style={{ fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', background:'none', border:'1px solid rgba(242,168,182,0.3)', color:'#8a7070', padding:'16px 32px', cursor:'pointer' }}>← Назад</button>
                  <button disabled={!date||!time} onClick={()=>setStep(3)} style={{ fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', background:(date&&time)?'#1a1a1a':'rgba(26,26,26,0.3)', color:'white', padding:'18px 48px', border:'none', cursor:'pointer', transition:'background 0.3s' }}
                    onMouseEnter={e=>(date&&time)&&(e.currentTarget.style.background='#d4697c')}
                    onMouseLeave={e=>e.currentTarget.style.background=(date&&time)?'#1a1a1a':'rgba(26,26,26,0.3)'}
                  >Далі →</button>
                </div>
              </motion.div>

            ) : (
              <motion.div key="step3" initial={{ opacity:0, x:30 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-30 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:80}} className="booking-step3-grid">
                  <div>
                    <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:36, color:'#1a1a1a', marginBottom:48 }}>Ваші <em style={{ fontStyle:'italic', color:'#d4697c' }}>контакти</em></h2>
                    {[
                      { key:'name', label:"Ім'я *", type:'text', ph:"Ваше ім'я" },
                      { key:'phone', label:'Телефон *', type:'tel', ph:'+38 (063) 123-45-67' },
                      { key:'comment', label:'Коментар', type:'text', ph:'Побажання (необов\'язково)' },
                    ].map(field=>(
                      <div key={field.key} style={{ marginBottom:36 }}>
                        <label style={{ fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color:'#d4697c', display:'block', marginBottom:8 }}>{field.label}</label>
                        <input type={field.type} placeholder={field.ph} value={contact[field.key]}
                          onChange={e=>handleContactChange(field.key,e.target.value)}
                          onBlur={()=>handleBlur(field.key)}
                          style={inputStyle(field.key)}
                          onFocus={e=>e.target.style.borderBottomColor='#d4697c'}
                        />
                        {errors[field.key]&&touched[field.key]&&<p style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:'#e85555', marginTop:6, fontWeight:300 }}>{errors[field.key]}</p>}
                      </div>
                    ))}
                    <div style={{ display:'flex', justifyContent:'space-between', marginTop:24 }}>
                      <button onClick={()=>setStep(2)} style={{ fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', background:'none', border:'1px solid rgba(242,168,182,0.3)', color:'#8a7070', padding:'16px 32px', cursor:'pointer' }}>← Назад</button>
                      <button onClick={handleSubmit} style={{ fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', background:'#1a1a1a', color:'white', padding:'18px 48px', border:'none', cursor:'pointer', transition:'background 0.3s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='#d4697c'}
                        onMouseLeave={e=>e.currentTarget.style.background='#1a1a1a'}
                      >Підтвердити запис</button>
                    </div>
                  </div>
                  {/* Summary */}
                  <div style={{ background:'#fff0f3', border:'1px solid rgba(242,168,182,0.25)', padding:'36px 28px', alignSelf:'start'}} className="booking-summary">
                    <h4 style={{ fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#d4697c', marginBottom:24 }}>Ваш запис</h4>
                    {[
                      ['Послуги', selectedServices.length>0 ? selectedServices.join(', ') : '—'],
                      ['Дата', date?date.toLocaleDateString('uk-UA',{day:'numeric',month:'long',weekday:'short'}):'—'],
                      ['Час', time||'—'],
                    ].map(([k,v])=>(
                      <div key={k} style={{ padding:'12px 0', borderBottom:'1px solid rgba(242,168,182,0.15)' }}>
                        <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.15em', textTransform:'uppercase', color:'#8a7070', marginBottom:4 }}>{k}</div>
                        <div style={{ fontFamily:"'Jost',sans-serif", fontSize:13, color:'#1a1a1a', fontWeight:300, lineHeight:1.5 }}>{v}</div>
                      </div>
                    ))}
                    <p style={{ fontFamily:"'Jost',sans-serif", fontSize:12, color:'#8a7070', fontWeight:300, marginTop:20, lineHeight:1.6 }}>
                      Після підтвердження ми зателефонуємо для підтвердження
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </PageWrapper>
  );
}
