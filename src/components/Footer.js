import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSiteSettings } from '../lib/contentful';

export default function Footer() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getSiteSettings().then(setSettings).catch(console.error);
  }, []);
  return (
    <footer style={{
      background: '#1a1a1a',
      color: '#fff0f3',
      padding: '80px 0 40px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background text */}
      <div style={{
        position: 'absolute', bottom: -40, right: -20,
        fontFamily: "'DM Serif Display', serif",
        fontSize: 'clamp(80px, 15vw, 200px)',
        color: 'rgba(255,240,243,0.03)',
        fontStyle: 'italic', pointerEvents: 'none',
        whiteSpace: 'nowrap', userSelect: 'none',
      }}>
        Pudra
      </div>

      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 60, marginBottom: 80,
        }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(248,196,207,0.2), rgba(253,224,230,0.2))',
                border: '1.5px solid rgba(242,168,182,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: '#f8c4cf' }}>P</span>
              </div>
              <div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 17, color: '#fff0f3' }}>Pudra</div>
                <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#e8899a', fontWeight: 400 }}>Beauty Room</div>
              </div>
            </div>
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 13, color: 'rgba(255,240,243,0.5)', lineHeight: 1.8, maxWidth: 240 }}>
              Краса без компромісів. Апаратна косметологія нового покоління у Нововолинську.
            </p>
            {/* Social */}
            <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
              {['Instagram', 'TikTok', 'Facebook'].map(s => (
                <a key={s} href="#" style={{
                  fontFamily: "'Jost', sans-serif", fontSize: 10,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(255,240,243,0.4)',
                  transition: 'color 0.3s',
                }}
                  onMouseEnter={e => e.target.style.color = '#f2a8b6'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,240,243,0.4)'}
                >{s}</a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#e8899a', marginBottom: 28 }}>Навігація</h4>
            {[['Головна', '/'], ['Послуги', '/services'], ['Про нас', '/about'], ['Прайс', '/pricing'], ['Галерея', '/gallery']].map(([l, p]) => (
              <div key={p} style={{ marginBottom: 14 }}>
                <Link to={p} style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: 'rgba(255,240,243,0.6)', transition: 'color 0.3s', fontWeight: 300 }}
                  onMouseEnter={e => e.target.style.color = '#fff0f3'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,240,243,0.6)'}
                >{l}</Link>
              </div>
            ))}
          </div>

          {/* Services */}
          <div>
            <h4 style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#e8899a', marginBottom: 28 }}>Послуги</h4>
            {['RF-ліфтинг', 'Мікрострумова терапія', 'Лазерна епіляція', 'LPG масаж', 'Кріотерапія', 'Ультразвукова чистка'].map(s => (
              <div key={s} style={{ marginBottom: 14 }}>
                <Link to="/services" style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: 'rgba(255,240,243,0.6)', fontWeight: 300, transition: 'color 0.3s' }}
                  onMouseEnter={e => e.target.style.color = '#fff0f3'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,240,243,0.6)'}
                >{s}</Link>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "'Jost', sans-serif", fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#e8899a', marginBottom: 28 }}>Контакти</h4>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#e8899a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Адреса</div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: 'rgba(255,240,243,0.6)', fontWeight: 300, lineHeight: 1.6 }}>{settings?.address || 'вул. Нововолинська, 51/2, Нововолинськ'}</p>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#e8899a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Телефон</div>
              <a href={`tel:${(settings?.phone || '+380676768798').replace(/\D/g,'')}`} style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: 'rgba(255,240,243,0.6)', fontWeight: 300, transition: 'color 0.3s' }}
                onMouseEnter={e => e.target.style.color = '#f2a8b6'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,240,243,0.6)'}
              >{settings?.phone || '+38 (067) 676-87-98'}</a>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#e8899a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Email</div>
              <a href={`mailto:${settings?.email || 'pudra.beautyroom@gmail.com'}`} style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: 'rgba(255,240,243,0.6)', fontWeight: 300, transition: 'color 0.3s' }}
                onMouseEnter={e => e.target.style.color = '#f2a8b6'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,240,243,0.6)'}
              >{settings?.email || 'pudra.beautyroom@gmail.com'}</a>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 11, color: '#e8899a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>Години роботи</div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 14, color: 'rgba(255,240,243,0.6)', fontWeight: 300, lineHeight: 1.6 }}>{settings?.workingHours || 'Пн–Сб: за попереднім записом'}</p>
            </div>
          </div>
        </div>

        {/* Marquee divider */}
        <div style={{
          borderTop: '1px solid rgba(255,240,243,0.06)',
          borderBottom: '1px solid rgba(255,240,243,0.06)',
          overflow: 'hidden', margin: '0 0 40px',
          padding: '16px 0',
        }}>
          <motion.div
            animate={{ x: '-50%' }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', width: 'max-content' }}
          >
            {[...Array(2)].map((_, ri) =>
              ['RF-ліфтинг', '✦', 'LPG масаж', '✦', 'Ендосфера', '✦', 'Лазерна епіляція', '✦', 'Кріоліполіз', '✦', 'EMSLIM', '✦', 'Мікротоки', '✦', 'Morpheus8', '✦'].map((item, i) => (
                <span key={`${ri}-${i}`} style={{
                  fontFamily: "'Jost', sans-serif", fontSize: 10,
                  letterSpacing: '0.3em', textTransform: 'uppercase',
                  color: item === '✦' ? '#e8899a' : 'rgba(255,240,243,0.25)',
                }}>{item}</span>
              ))
            )}
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: 0, display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 16,
        }}>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: 'rgba(255,240,243,0.3)', fontWeight: 300 }}>
            © 2026 Pudra Beauty Room. Усі права захищені.
          </p>
          <div style={{ display: 'flex', gap: 32 }}>
            {['Політика конфіденційності', 'Умови використання'].map(t => (
              <a key={t} href="#" style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: 'rgba(255,240,243,0.3)', transition: 'color 0.3s' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,240,243,0.7)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,240,243,0.3)'}
              >{t}</a>
            ))}
          </div>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: 12, color: 'rgba(255,240,243,0.2)', fontWeight: 300 }}>
            Нововолинськ, Ukraine
          </p>
        </div>
      </div>
    </footer>
  );
}
