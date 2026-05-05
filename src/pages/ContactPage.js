import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageWrapper from '../components/PageWrapper';
import useInView from '../hooks/useInView';
import { getSiteSettings } from '../lib/contentful';
import { formatPhone, validatePhone } from '../lib/phoneFormat';

function validate(data) {
  const errors = {};
  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = "Введіть ім'я (мін. 2 символи)";
  } else if (/\d/.test(data.name)) {
    errors.name = "Ім'я не може містити цифри";
  }
  const phoneError = validatePhone(data.phone);
  if (phoneError) errors.phone = phoneError;
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Невірний формат email';
  }
  return errors;
}

export default function ContactPage() {
  const [headerRef, headerInView] = useInView();
  const [formRef, formInView] = useInView(0.2);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(console.error);
  }, []);

  const contactInfo = [
    { icon:'◎', label:'Адреса', value: settings?.address || 'вул. Нововолинська, 51/2, Нововолинськ' },
    { icon:'◈', label:'Телефон', value: settings?.phone || '+38 (067) 676-87-98', href: settings?.phone ? `tel:${settings.phone.replace(/\D/g,'')}` : 'tel:+380676768798' },
    { icon:'◇', label:'Email', value: settings?.email || 'pudra.beautyroom@gmail.com', href: `mailto:${settings?.email || 'pudra.beautyroom@gmail.com'}` },
    { icon:'◉', label:'Години роботи', value: settings?.workingHours || 'Пн–Сб: за попереднім записом' },
  ];

  const socials = [
    { name: 'Instagram', href: settings?.instagram || '#' },
    { name: 'TikTok', href: settings?.tiktok || '#' },
    { name: 'Facebook', href: settings?.facebook || '#' },
  ];

  const handleChange = (field, value) => {
    // For phone — only allow digits, +, (, ), -, space
    if (field === 'phone') {
      value = formatPhone(value);
    }
    // For name — only allow letters, spaces, hyphens, apostrophes
    if (field === 'name') {
      value = value.replace(/[^a-zA-ZА-ЯЄІЇҐа-яєіїґ'\-\s]/g, '');
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const newErrors = validate({ ...formData, [field]: value });
      setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const newErrors = validate(formData);
    setErrors(prev => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const allTouched = { name: true, phone: true, email: true };
    setTouched(allTouched);
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setSubmitting(true);
      setTimeout(() => { setSubmitting(false); setSent(true); }, 800);
    }
  };

  const inputBase = (field) => ({
    width: '100%', padding: '16px 0',
    background: 'transparent', border: 'none',
    borderBottom: `1px solid ${errors[field] && touched[field] ? '#e85555' : touched[field] && !errors[field] ? '#4caf7d' : 'rgba(242,168,182,0.4)'}`,
    fontFamily: "'Jost',sans-serif", fontSize: 15, color: '#1a1a1a', fontWeight: 300,
    outline: 'none', transition: 'border-color 0.3s',
  });

  return (
    <PageWrapper>
      <section style={{ padding:'180px 0 80px', background:'linear-gradient(135deg,#fff0f3,#fdf8f5)', overflow:'clip', position:'relative' }}>
        <div style={{ position:'absolute', bottom:-30, right:-20, fontFamily:"'DM Serif Display',serif", fontSize:'clamp(80px,15vw,200px)', color:'rgba(232,137,154,0.05)', pointerEvents:'none', userSelect:'none', fontStyle:'italic' }}>Contact</div>
        <div className="container" ref={headerRef}>
          <motion.div initial={{ opacity:0, y:20 }} animate={headerInView?{opacity:1,y:0}:{}} style={{ fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:'0.3em', textTransform:'uppercase', color:'#d4697c', display:'flex', alignItems:'center', gap:16, marginBottom:32 }}>
            Контакти
          </motion.div>
          <motion.h1 initial={{ opacity:0, y:40 }} animate={headerInView?{opacity:1,y:0}:{}} transition={{ delay:0.1 }} style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(48px,6vw,88px)', color:'#1a1a1a', lineHeight:1.0 }}>
            Зв'яжись<br/><em style={{ fontStyle:'italic', color:'#d4697c' }}>з нами</em>
          </motion.h1>
        </div>
      </section>

      <section style={{ padding:'100px 0', background:'#fffbf9' }}>
        <div className="container">
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:100, alignItems:'start'}} className="contact-grid">
            {/* Info */}
            <motion.div initial={{ opacity:0, x:-40 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.8 }}>
              <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:40, color:'#1a1a1a', marginBottom:48, lineHeight:1.2 }}>
                Ми завжди<br/><em style={{ fontStyle:'italic', color:'#d4697c' }}>на зв'язку</em>
              </h2>
              {contactInfo.map((item,i)=>(
                <motion.div key={i} initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2+i*0.1 }} style={{ display:'flex', gap:20, marginBottom:36 }}>
                  <div style={{ width:44, height:44, background:'#fff0f3', border:'1px solid rgba(242,168,182,0.3)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color:'#e8899a', fontSize:18 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color:'#d4697c', marginBottom:8 }}>{item.label}</div>
                    {item.href ? (
                      <a href={item.href} style={{ fontFamily:"'Jost',sans-serif", fontSize:15, color:'#2d2020', fontWeight:300, lineHeight:1.7, whiteSpace:'pre-line', display:'block', transition:'color 0.3s' }}
                        onMouseEnter={e=>e.currentTarget.style.color='#d4697c'}
                        onMouseLeave={e=>e.currentTarget.style.color='#2d2020'}
                      >{item.value}</a>
                    ) : (
                      <p style={{ fontFamily:"'Jost',sans-serif", fontSize:15, color:'#2d2020', fontWeight:300, lineHeight:1.7, whiteSpace:'pre-line' }}>{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
              <div style={{ marginTop:40, paddingTop:40, borderTop:'1px solid rgba(242,168,182,0.2)' }}>
                <div style={{ fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.3em', textTransform:'uppercase', color:'#d4697c', marginBottom:16 }}>Ми в соцмережах</div>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                  {socials.map(s=>(
                    <a key={s.name} href={s.href} style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:'#8a7070', background:'rgba(242,168,182,0.08)', border:'1px solid rgba(242,168,182,0.2)', padding:'10px 16px', transition:'all 0.3s' }}
                      onMouseEnter={e=>{ e.currentTarget.style.background='#fff0f3'; e.currentTarget.style.borderColor='#d4697c'; e.currentTarget.style.color='#d4697c'; }}
                      onMouseLeave={e=>{ e.currentTarget.style.background='rgba(242,168,182,0.08)'; e.currentTarget.style.borderColor='rgba(242,168,182,0.2)'; e.currentTarget.style.color='#8a7070'; }}
                    >{s.name}</a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <div ref={formRef}>
              <motion.div initial={{ opacity:0, x:40 }} animate={formInView?{opacity:1,x:0}:{}} style={{ background:'#fff0f3', padding:'56px 48px', border:'1px solid rgba(242,168,182,0.2)' }}>
                {sent ? (
                  <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} style={{ textAlign:'center', padding:'40px 0' }}>
                    <div style={{ fontSize:56, marginBottom:24 }}>✦</div>
                    <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:36, color:'#1a1a1a', marginBottom:16 }}>Повідомлення надіслано!</h3>
                    <p style={{ fontFamily:"'Jost',sans-serif", fontSize:15, color:'#8a7070', fontWeight:300 }}>Ми зв'яжемося з вами протягом 15 хвилин</p>
                  </motion.div>
                ) : (
                  <>
                    <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:32, color:'#1a1a1a', marginBottom:8 }}>Напиши нам</h3>
                    <p style={{ fontFamily:"'Jost',sans-serif", fontSize:14, color:'#8a7070', fontWeight:300, marginBottom:40 }}>Відповімо протягом 15 хвилин</p>
                    <form onSubmit={handleSubmit} noValidate>
                      {/* Name */}
                      <div style={{ marginBottom:32 }}>
                        <label style={{ fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color:'#d4697c', display:'block', marginBottom:8 }}>Ім'я *</label>
                        <input type="text" placeholder="Ваше ім'я" value={formData.name}
                          onChange={e=>handleChange('name',e.target.value)}
                          onBlur={()=>handleBlur('name')}
                          style={inputBase('name')}
                          onFocus={e=>e.target.style.borderBottomColor='#d4697c'}
                        />
                        {errors.name && touched.name && <p style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:'#e85555', marginTop:6, fontWeight:300 }}>{errors.name}</p>}
                      </div>
                      {/* Phone */}
                      <div style={{ marginBottom:32 }}>
                        <label style={{ fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color:'#d4697c', display:'block', marginBottom:8 }}>Телефон *</label>
                        <input type="tel" placeholder="+38 (063) 123-45-67" value={formData.phone}
                          onChange={e=>handleChange('phone',e.target.value)}
                          onBlur={()=>handleBlur('phone')}
                          style={inputBase('phone')}
                          onFocus={e=>e.target.style.borderBottomColor='#d4697c'}
                          maxLength={18}
                        />
                        {errors.phone && touched.phone && <p style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:'#e85555', marginTop:6, fontWeight:300 }}>{errors.phone}</p>}
                      </div>
                      {/* Email */}
                      <div style={{ marginBottom:32 }}>
                        <label style={{ fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color:'#d4697c', display:'block', marginBottom:8 }}>Email</label>
                        <input type="email" placeholder="your@email.com" value={formData.email}
                          onChange={e=>handleChange('email',e.target.value)}
                          onBlur={()=>handleBlur('email')}
                          style={inputBase('email')}
                          onFocus={e=>e.target.style.borderBottomColor='#d4697c'}
                        />
                        {errors.email && touched.email && <p style={{ fontFamily:"'Jost',sans-serif", fontSize:11, color:'#e85555', marginTop:6, fontWeight:300 }}>{errors.email}</p>}
                      </div>
                      {/* Message */}
                      <div style={{ marginBottom:48 }}>
                        <label style={{ fontFamily:"'Jost',sans-serif", fontSize:10, letterSpacing:'0.25em', textTransform:'uppercase', color:'#d4697c', display:'block', marginBottom:8 }}>Повідомлення</label>
                        <textarea placeholder="Напишіть своє запитання або побажання..." rows={4}
                          value={formData.message}
                          onChange={e=>setFormData({...formData,message:e.target.value})}
                          style={{ ...inputBase('message'), resize:'none' }}
                          onFocus={e=>e.target.style.borderBottomColor='#d4697c'}
                          onBlur={e=>e.target.style.borderBottomColor='rgba(242,168,182,0.4)'}
                        />
                      </div>
                      <button type="submit" disabled={submitting} style={{ width:'100%', padding:'20px', background:submitting?'#8a7070':'#1a1a1a', color:'white', border:'none', fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer', transition:'background 0.3s' }}
                        onMouseEnter={e=>!submitting&&(e.currentTarget.style.background='#d4697c')}
                        onMouseLeave={e=>!submitting&&(e.currentTarget.style.background='#1a1a1a')}
                      >
                        {submitting ? 'Надсилання...' : 'Надіслати повідомлення'}
                      </button>
                    </form>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section style={{ height:360, background:'linear-gradient(135deg,#f8c4cf,#fde0e6,#fff0f3)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(212,105,124,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(212,105,124,0.07) 1px, transparent 1px)', backgroundSize:'60px 60px' }}/>
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16 }}>
          <div style={{ width:50, height:50, borderRadius:'50% 50% 50% 0', background:'#d4697c', transform:'rotate(-45deg)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ transform:'rotate(45deg)', width:16, height:16, background:'white', borderRadius:'50%' }}/>
          </div>
          <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, color:'#1a1a1a' }}>вул. Нововолинська, 51/2, Нововолинськ</h3>
          <a href="https://maps.google.com/?q=вул.+Нововолинська,+51/2,+Нововолинськ,+Волинська+область,+45400" target="_blank" rel="noopener noreferrer" style={{ fontFamily:"'Jost',sans-serif", fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase', background:'#1a1a1a', color:'white', padding:'12px 28px', marginTop:8, display:'inline-block' }}>
            Відкрити в Google Maps
          </a>
        </div>
      </section>
    </PageWrapper>
  );
}
