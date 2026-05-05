import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import PageWrapper from "../components/PageWrapper";
import useInView from "../hooks/useInView";
import { getServices, getStats, getReviews, getSpecialist } from "../lib/contentful";

function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView(0.5);
  useEffect(() => {
    if (!inView) return;
    let s = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      s += step;
      if (s >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(Math.floor(s));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* ============ POWDER COMPACT — optimized 3D ============ */
function PowderBox() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 }); // lerped mouse
  const imgRef = useRef(null);
  const [imgReady, setImgReady] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = "/powder-3d.png";
    img.onload = () => { imgRef.current = img; setImgReady(true); };
  }, []);

  useEffect(() => {
    if (!imgReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let t = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2x
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Затримка щоб DOM встиг розрахувати розміри
    const initTimer = setTimeout(resize, 100);

    const onMouse = (e) => {
      const r = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
      };
    };
    window.addEventListener("mousemove", onMouse);

    const sparks = [
      { ox: -0.38, oy: -0.38, ph: 0.0, sz: 1.0 },
      { ox: 0.40, oy: -0.34, ph: 1.3, sz: 0.8 },
      { ox: -0.42, oy: 0.22, ph: 2.5, sz: 0.9 },
      { ox: 0.36, oy: 0.34, ph: 0.8, sz: 1.1 },
      { ox: 0.05, oy: -0.46, ph: 3.2, sz: 0.7 },
    ];

    const draw = () => {
      const W = canvas.offsetWidth || 480;
      const H = canvas.offsetHeight || 560;

      // Smooth mouse lerp — плавний рух
      const sm = smoothMouseRef.current;
      sm.x += (mouseRef.current.x - sm.x) * 0.06;
      sm.y += (mouseRef.current.y - sm.y) * 0.06;
      const mx = sm.x;
      const my = sm.y;

      ctx.clearRect(0, 0, W, H);

      const fy = Math.sin(t * 1.1) * 9; // ~4s cycle, matches stat cards
      const tx = (mx - 0.5) * 18;
      const ty = (my - 0.5) * 10;

      const img = imgRef.current;
      const isMobile = W < 500;
      const scaleFactor = isMobile ? 1.1 : 1.15;
      const scale = Math.min((W * scaleFactor) / img.naturalWidth, (H * scaleFactor) / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      const dx = (W - dw) / 2 + tx * 0.4;
      const dy = (H - dh) / 2 + fy + ty * 0.28;
      const cx = dx + dw * 0.5;
      const cy = dy + dh * 0.5;

      /* ── 1. Shadow (спрощений — без shadowBlur) ── */
      const shadowGrad = ctx.createRadialGradient(
        cx + tx * 0.2, dy + dh * 0.96,
        0,
        cx + tx * 0.2, dy + dh * 0.96,
        dw * 0.45
      );
      shadowGrad.addColorStop(0, "rgba(160,70,100,0.22)");
      shadowGrad.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.ellipse(cx + tx * 0.2, dy + dh * 0.96, dw * 0.45, dh * 0.08, 0, 0, Math.PI * 2);
      ctx.fillStyle = shadowGrad;
      ctx.fill();

      /* ── 2. Perspective skew ── */
      ctx.save();
      const skewX = (mx - 0.5) * 0.04;
      const skewY = (my - 0.5) * 0.025;
      ctx.transform(1, skewY, skewX, 1,
        -cx * skewX - cy * skewY + cx * skewX,
        -cx * skewY - cy * skewY + cy * skewY
      );
      // Малюємо зображення і прибираємо чорний фон через multiply
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();

      /* ── 3. Specular glare ── */
      const glareX = dx + dw * (0.15 + mx * 0.25);
      const glareY = dy + dh * (0.08 + my * 0.16);
      const glareR = dw * 0.2;
      const gl = ctx.createRadialGradient(glareX, glareY, 0, glareX + dw * 0.06, glareY + dh * 0.05, glareR);
      gl.addColorStop(0, "rgba(255,255,255,0.32)");
      gl.addColorStop(0.5, "rgba(255,255,255,0.08)");
      gl.addColorStop(1, "transparent");
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(glareX, glareY, glareR * 1.2, glareR * 0.65, -0.4, 0, Math.PI * 2);
      ctx.fillStyle = gl;
      ctx.fill();
      ctx.restore();

      /* ── 4. Pink outer glow ── */
      const glow = ctx.createRadialGradient(cx, cy, dw * 0.2, cx, cy, dw * 0.75);
      glow.addColorStop(0, "rgba(248,196,207,0.12)");
      glow.addColorStop(1, "transparent");
      ctx.beginPath();
      ctx.arc(cx, cy, dw * 0.75, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      /* ── 5. Sparkles ── */
      sparks.forEach(({ ox, oy, ph, sz }) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.2 + ph);
        const r = (2 + 3.5 * pulse) * sz * (dw / 500);
        const sx = cx + ox * dw * 0.5 + Math.sin(t * 0.4 + ph) * 4;
        const sy = cy + oy * dh * 0.5 + Math.cos(t * 0.35 + ph) * 3;
        ctx.save();
        ctx.globalAlpha = 0.25 + 0.6 * pulse;
        ctx.strokeStyle = "#f2a8b6";
        ctx.lineWidth = 0.8;
        ctx.fillStyle = "rgba(255,240,243,0.95)";
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2 - Math.PI / 4;
          const lr = i % 2 === 0 ? r * 2.4 : r * 0.8;
          i === 0 ? ctx.moveTo(sx + Math.cos(a) * lr, sy + Math.sin(a) * lr)
                  : ctx.lineTo(sx + Math.cos(a) * lr, sy + Math.sin(a) * lr);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      /* ── 6. Orbit ring ── */
      ctx.save();
      ctx.translate(cx, cy + dh * 0.05);
      ctx.scale(1, 0.22);
      ctx.rotate(t * 0.06);
      ctx.beginPath();
      ctx.arc(0, 0, dw * 0.52, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(242,168,182,0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      t += 0.012;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
      clearTimeout(initTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouse);
    };
  }, [imgReady]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "100%", display: "block", position: "relative", zIndex: 1 }}
    />
  );
}

function Marquee() {
  const items = [
    "RF-ліфтинг",
    "✦",
    "Лазерна епіляція",
    "✦",
    "LPG масаж",
    "✦",
    "Мікрострумова терапія",
    "✦",
    "Кріоліполіз",
    "✦",
    "Ендосфера",
    "✦",
  ];
  return (
    <div
      style={{
        overflow: "hidden",
        borderTop: "1px solid rgba(242,168,182,0.25)",
        borderBottom: "1px solid rgba(242,168,182,0.25)",
        background: "#fff8f9",
        padding: "18px 0",
      }}
    >
      <motion.div
        animate={{ x: "-50%" }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{
          display: "flex",
          gap: 48,
          whiteSpace: "nowrap",
          width: "max-content",
        }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: 11,
              fontWeight: 300,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: item === "✦" ? "#e8899a" : "#8a7070",
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);

  const [statsRef, statsInView] = useInView();
  const [servRef, servInView] = useInView(0.1);
  const [ctaRef, ctaInView] = useInView();
  const [videoReady, setVideoReady] = useState(false);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    getServices().then(data => setServices(data.slice(0, 6))).catch(console.error);
    getStats().then(setStats).catch(console.error);
  }, []);

  return (
    <PageWrapper>
      {/* ═══════════ HERO ═══════════ */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          background:
            "linear-gradient(135deg,#fff0f3 0%,#fdf8f5 50%,#fce8ec 100%)",
          overflow: "hidden",
        }}
      >
        {/* Background radial — soft blurred blobs */}
        <div style={{ position:"absolute", inset:0, pointerEvents:"none", overflow:"hidden" }}>
          {/* Main pink blob */}
          <div style={{
            position:"absolute", right:"-5%", top:"10%",
            width:"55%", height:"80%",
            background:"radial-gradient(ellipse at center, rgba(248,196,207,0.35) 0%, rgba(242,168,182,0.15) 40%, transparent 70%)",
            filter:"blur(40px)",
            borderRadius:"50%",
          }}/>
          {/* Secondary peach blob */}
          <div style={{
            position:"absolute", right:"15%", bottom:"-10%",
            width:"40%", height:"60%",
            background:"radial-gradient(ellipse at center, rgba(252,232,236,0.4) 0%, rgba(248,196,207,0.1) 50%, transparent 70%)",
            filter:"blur(60px)",
            borderRadius:"50%",
          }}/>
          {/* Small accent blob */}
          <div style={{
            position:"absolute", right:"5%", top:"5%",
            width:"25%", height:"35%",
            background:"radial-gradient(ellipse at center, rgba(232,137,154,0.12) 0%, transparent 70%)",
            filter:"blur(30px)",
            borderRadius:"50%",
          }}/>
        </div>
        {/* Grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            backgroundImage:
              "linear-gradient(rgba(242,168,182,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(242,168,182,0.06) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity, width: "100%" }}>
          <div
            className="container hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 60,
              alignItems: "center",
              paddingTop: 80,
            }}
          >
            {/* ── Left: text ── */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 1,
                  delay: 3.2,
                  ease: [0.19, 1, 0.22, 1],
                }}
                style={{ marginBottom: 28 }}
              >
                <span
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.35em",
                    textTransform: "uppercase",
                    color: "#d4697c",
                  }}
                >
                  Нововолинськ · Апаратна косметологія
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1.2,
                  delay: 3.4,
                  ease: [0.19, 1, 0.22, 1],
                }}
                style={{
                  fontFamily: "'DM Serif Display',serif",
                  fontSize: "clamp(52px,6vw,96px)",
                  fontWeight: 400,
                  lineHeight: 1.0,
                  color: "#1a1a1a",
                  marginBottom: 32,
                }}
              >
                Твоя краса —<br />
                <em style={{ color: "#d4697c", fontStyle: "italic" }}>
                  наша
                </em>{" "}
                справа
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  delay: 3.6,
                  ease: [0.19, 1, 0.22, 1],
                }}
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontWeight: 300,
                  fontSize: 16,
                  color: "#8a7070",
                  lineHeight: 1.8,
                  maxWidth: 440,
                  marginBottom: 48,
                }}
              >
                Апаратна косметологія нового покоління. Передові технології та
                індивідуальний підхід для розкриття природної краси.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 3.8 }}
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
                className="hero-buttons hero-buttons-desktop"
              >
                <Link
                  to="/booking"
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 12,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    background: "#1a1a1a",
                    color: "white",
                    padding: "18px 44px",
                    display: "inline-block",
                    transition: "all 0.4s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#e8899a")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#1a1a1a")
                  }
                >
                  Записатись
                </Link>
                <Link
                  to="/services"
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 12,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#1a1a1a",
                    borderBottom: "1px solid #1a1a1a",
                    paddingBottom: 4,
                    transition: "color 0.3s, border-color 0.3s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#d4697c";
                    e.currentTarget.style.borderColor = "#d4697c";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#1a1a1a";
                    e.currentTarget.style.borderColor = "#1a1a1a";
                  }}
                >
                  Всі послуги →
                </Link>
              </motion.div>
            </div>

            {/* ── Right: 3D Powder compact ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.6,
                delay: 3.1,
                ease: [0.19, 1, 0.22, 1],
              }}
              style={{ 
                height: isMobile ? 360 : 620, 
                width: isMobile ? '100%' : undefined,
                position: "relative", 
                minHeight: 0 
              }}
              className="hero-powder"
            >
              {/* Radial glow BEHIND powder — desktop only */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                background: `radial-gradient(ellipse 70% 55% at 55% 52%, rgba(248,196,207,0.55) 0%, rgba(248,196,207,0.2) 45%, transparent 72%)`,
              }} className="hero-powder-glow" />
              {/* Canvas */}
              <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <PowderBox />
              </div>

              {/* "рухай мишею" hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4.2 }}
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(212,105,124,0.5)",
                    whiteSpace: "nowrap",
                  }}
                >
                  рухай мишею
                </span>
              </motion.div>

              {/* Floating stat cards — desktop only */}
              {!isMobile && <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="hero-stat-card"
                style={{
                  position: "absolute",
                  top: "14%",
                  left: "-5%",
                  background: "rgba(255,248,250,0.92)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(242,168,182,0.3)",
                  padding: "16px 24px",
                  minWidth: 160,
                  boxShadow: "0 20px 60px rgba(232,137,154,0.12)",
                  zIndex: 3,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: "#e8899a",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Досвід
                </div>
                <div
                  style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: 32,
                    color: "#1a1a1a",
                  }}
                >
                  8+
                </div>
                <div
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 12,
                    color: "#8a7070",
                    fontWeight: 300,
                  }}
                >
                  років роботи
                </div>
              </motion.div>}

              {!isMobile && <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="hero-stat-card"
                style={{
                  position: "absolute",
                  bottom: "20%",
                  right: "-8%",
                  background: "rgba(255,248,250,0.92)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(242,168,182,0.3)",
                  padding: "16px 24px",
                  minWidth: 180,
                  boxShadow: "0 20px 60px rgba(232,137,154,0.12)",
                  zIndex: 3,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: "#e8899a",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  Клієнти
                </div>
                <div
                  style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: 32,
                    color: "#1a1a1a",
                  }}
                >
                  800+
                </div>
                <div
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 12,
                    color: "#8a7070",
                    fontWeight: 300,
                  }}
                >
                  задоволених клієнтів
                </div>
              </motion.div>}

              {!isMobile && <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2,
                }}
                className="hero-stat-card"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "-10%",
                  background: "#1a1a1a",
                  padding: "14px 20px",
                  boxShadow: "0 20px 40px rgba(26,26,26,0.15)",
                  zIndex: 3,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: "#e8899a",
                    textTransform: "uppercase",
                    marginBottom: 4,
                  }}
                >
                  Рейтинг
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} style={{ color: "#f2a8b6", fontSize: 16 }}>
                      ★
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 11,
                    color: "rgba(255,240,243,0.6)",
                    fontWeight: 300,
                    marginTop: 4,
                  }}
                >
                  5.0 / 5.0
                </div>
              </motion.div>}
            </motion.div>

            {/* ── Mobile buttons — shown only on mobile, after powder ── */}
            <div className="hero-buttons-mobile" style={{ display: 'none', gap: 20, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', padding: '24px 0 40px' }}>
              <Link to="/booking" style={{ fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', background:'#1a1a1a', color:'white', padding:'18px 44px', display:'inline-block', width:'100%', textAlign:'center' }}
                onMouseEnter={e => e.currentTarget.style.background='#e8899a'}
                onMouseLeave={e => e.currentTarget.style.background='#1a1a1a'}
              >Записатись</Link>
              <Link to="/services" style={{ fontFamily:"'Jost',sans-serif", fontSize:12, letterSpacing:'0.2em', textTransform:'uppercase', color:'#1a1a1a', borderBottom:'1px solid #1a1a1a', paddingBottom:4 }}
                onMouseEnter={e => { e.currentTarget.style.color='#d4697c'; e.currentTarget.style.borderColor='#d4697c'; }}
                onMouseLeave={e => { e.currentTarget.style.color='#1a1a1a'; e.currentTarget.style.borderColor='#1a1a1a'; }}
              >Всі послуги →</Link>
            </div>

          </div>
        </motion.div>
      </section>
      <Marquee />
      <AlinaSection />

      {/* ═══════════ SERVICES ═══════════ */}
      <section style={{ padding: "120px 0", background: "#fffbf9" }}>
        <div className="container">
          <div
            ref={servRef}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr",
              gap: 80,
              alignItems: "start",
            }}
            className="services-grid"
          >
            <div
              style={{ position: "sticky", top: 120 }}
              className="services-sticky"
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={servInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <div
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "#d4697c",
                    marginBottom: 32,
                  }}
                >
                  Послуги
                </div>
                <h2
                  style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: "clamp(40px,4vw,64px)",
                    lineHeight: 1.1,
                    color: "#1a1a1a",
                    marginBottom: 32,
                  }}
                >
                  Апаратна
                  <br />
                  <em style={{ fontStyle: "italic", color: "#d4697c" }}>
                    косметологія
                  </em>
                </h2>
                <p
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 15,
                    color: "#8a7070",
                    lineHeight: 1.8,
                    fontWeight: 300,
                    marginBottom: 40,
                  }}
                >
                  Найсучасніше обладнання та індивідуальні програми для кожного
                  клієнта
                </p>
                <Link
                  to="/services"
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#1a1a1a",
                    borderBottom: "1px solid #1a1a1a",
                    paddingBottom: 4,
                    display: "inline-block",
                  }}
                >
                  Всі послуги
                </Link>
              </motion.div>
            </div>
            <div>
              {services.map((svc, i) => (
                <motion.div
                  key={svc.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={servInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.7 }}
                >
                  <Link to={`/services/${svc.serviceId}`} style={{ display: "block" }}>
                    <div
                      style={{
                        padding: "32px 0",
                        borderBottom: "1px solid rgba(242,168,182,0.2)",
                        display: "grid",
                        gridTemplateColumns: "auto 1fr auto",
                        gap: 32,
                        alignItems: "center",
                        transition: "all 0.4s",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#fff0f3";
                        e.currentTarget.style.padding = "32px 24px";
                        e.currentTarget.style.margin = "0 -24px";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.padding = "32px 0";
                        e.currentTarget.style.margin = "0";
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Jost',sans-serif",
                          fontSize: 11,
                          color: "#e8899a",
                          letterSpacing: "0.1em",
                          fontWeight: 300,
                        }}
                      >
                        {svc.num}
                      </span>
                      <div>
                        <h3
                          style={{
                            fontFamily: "'DM Serif Display',serif",
                            fontSize: 26,
                            color: "#1a1a1a",
                            marginBottom: 8,
                          }}
                        >
                          {svc.title}
                        </h3>
                        <p
                          style={{
                            fontFamily: "'Jost',sans-serif",
                            fontSize: 13,
                            color: "#8a7070",
                            fontWeight: 300,
                            lineHeight: 1.6,
                          }}
                        >
                          {svc.short}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: 20,
                          color: "#e8899a",
                          fontWeight: 200,
                        }}
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section
        ref={statsRef}
        style={{
          padding: "100px 0",
          background: "linear-gradient(135deg,#1a1a1a,#2d2020)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(248,196,207,0.05), transparent 70%)",
          }}
        />
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 40,
              textAlign: "center",
            }}
            className="stats-grid"
          >
            {(stats.length > 0
              ? stats.map(s => {
                  const numMatch = s.value.match(/(\d+)/);
                  const num = numMatch ? parseInt(numMatch[1]) : 0;
                  const suffix = s.value.replace(/\d+/, '');
                  return { value: num, suffix, label: s.label };
                })
              : [
                  { value: 8, suffix: "+", label: "Років досвіду" },
                  { value: 800, suffix: "+", label: "Задоволених клієнтів" },
                  { value: 11, suffix: "", label: "Видів процедур" },
                  { value: 98, suffix: "%", label: "Повертаються знову" },
                ]
            ).map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.8 }}
              >
                <div
                  style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: "clamp(48px,5vw,80px)",
                    color: "#f8c4cf",
                    fontWeight: 400,
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  {statsInView ? (
                    <Counter end={stat.value} suffix={stat.suffix} />
                  ) : (
                    `0${stat.suffix}`
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 12,
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    color: "rgba(255,240,243,0.4)",
                    fontWeight: 300,
                  }}
                >
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WhyUsSection />
      <TestimonialsSection />
      <CoursesSection />
      <GiftCertSection />

      {/* CTA */}
      <section
        ref={ctaRef}
        style={{
          padding: "140px 0",
          background: "linear-gradient(135deg,#fff0f3,#fde0e6)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,rgba(248,196,207,0.4),transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div className="container" style={{ position: "relative" }}>
          <motion.p
            initial={{ opacity: 0 }}
            animate={ctaInView ? { opacity: 1 } : {}}
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#d4697c",
              marginBottom: 32,
            }}
          >
            Готова до змін?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(48px,6vw,96px)",
              color: "#1a1a1a",
              lineHeight: 1.0,
              marginBottom: 48,
            }}
          >
            Починаємо твою
            <br />
            <em style={{ fontStyle: "italic", color: "#d4697c" }}>
              Beauty Story
            </em>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            style={{
              display: "flex",
              gap: 20,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link
              to="/booking"
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: "#1a1a1a",
                color: "white",
                padding: "20px 56px",
                display: "inline-block",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#d4697c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#1a1a1a")
              }
            >
              Записатись зараз
            </Link>
            <Link
              to="/contact"
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#d4697c",
                border: "1.5px solid #d4697c",
                padding: "20px 56px",
                display: "inline-block",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#d4697c";
                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#d4697c";
              }}
            >
              Зв'язатись
            </Link>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}

/* ═══════════ ALINA — INTERACTIVE, PINK TINT + GRID ═══════════ */
function AlinaSection() {
  const [ref, inView] = useInView(0.1);
  const [activeSpec, setActiveSpec] = useState(0);
  const [specialist, setSpecialist] = useState(null);

  useEffect(() => {
    getSpecialist().then(setSpecialist).catch(console.error);
  }, []);

  const specializations = [
    {
      title: "LPG масаж",
      desc: "Вакуумно-роликовий масаж для корекції фігури, зменшення целюліту та лімфодренажу. Результат видно після першого сеансу.",
      duration: "30–90 хв",
      effect: "Антицелюліт, контур",
    },
    {
      title: "RF-ліфтинг",
      desc: "Радіохвильова процедура для глибокого прогрівання шкіри та стимуляції колагену. Без операції, без відновлення.",
      duration: "45–60 хв",
      effect: "Підтягування, колаген",
    },
    {
      title: "Ендосфера",
      desc: "Компресійний масаж мікросферами — стимулює кровообіг, зменшує набряки та підтягує шкіру одночасно.",
      duration: "30–90 хв",
      effect: "Дренаж, пружність",
    },
    {
      title: "Morpheus8",
      desc: "Мікроголковий RF для глибокого оновлення шкіри. Ефект наростає з часом і тримається довго.",
      duration: "30–60 хв",
      effect: "Оновлення, текстура",
    },
    {
      title: "EMSLIM",
      desc: "20 000 м\'язових скорочень за сеанс — зміцнює м\'язи та формує рельєф без тренувань.",
      duration: "30–60 хв",
      effect: "Тонус, рельєф",
    },
    {
      title: "Лазерна епіляція",
      desc: "Перманентне видалення волосся на будь-яких зонах тіла. Безболісно, швидко, надовго.",
      duration: "10–60 хв",
      effect: "Видалення волосся",
    },
  ];

  return (
    <section
      ref={ref}
      style={{
        padding: "120px 0",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg,#fff0f3 0%,#fde8ed 50%,#fff0f3 100%)",
      }}
    >
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(242,168,182,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(242,168,182,0.09) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -40,
          top: "50%",
          transform: "translateY(-50%)",
          fontFamily: "'DM Serif Display',serif",
          fontSize: "clamp(120px,16vw,220px)",
          color: "rgba(212,105,124,0.06)",
          pointerEvents: "none",
          userSelect: "none",
          fontStyle: "italic",
          lineHeight: 1,
        }}
      >
        Alina
      </div>

      <div className="container" style={{ position: "relative" }}>
        {/* Header row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ marginBottom: 60 }}
        >
          <div
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: 11,
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "#d4697c",
              marginBottom: 16,
            }}
          >
            Майстер
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 20,
            }}
          >
            <h2
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: "clamp(44px,5.5vw,80px)",
                color: "#1a1a1a",
                lineHeight: 1.0,
              }}
            >
              {specialist?.name?.split(' ')[0] || 'Наталія'}{" "}
              <em style={{ fontStyle: "italic", color: "#d4697c" }}>
                {specialist?.name?.split(' ')[1] || 'Ковальчук'}
              </em>
            </h2>
            <Link
              to="/about"
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#1a1a1a",
                borderBottom: "1px solid rgba(26,26,26,0.35)",
                paddingBottom: 3,
                transition: "all 0.3s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#d4697c";
                e.currentTarget.style.borderColor = "#d4697c";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#1a1a1a";
                e.currentTarget.style.borderColor = "rgba(26,26,26,0.35)";
              }}
            >
              Більше про Наталію →
            </Link>
          </div>
        </motion.div>

        {/* 3-column grid: photo | info | interactive */}
        <div
          className="alina-3col"
          style={{
            display: "grid",
            gridTemplateColumns: "280px 1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
        >
          {/* COLUMN 1 — Photo placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9 }}
          >
            <div style={{ position: "relative" }}>
              {/* Real photo */}
              <div
                style={{
                  width: "100%",
                  aspectRatio: "3/4",
                  position: "relative",
                  overflow: "hidden",
                  border: "1px solid rgba(242,168,182,0.3)",
                }}
              >
                <img
                  src={specialist?.photo || "/alina-photo.jpg"}
                  alt={specialist?.name || "Наталія Ковальчук"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center top",
                    display: "block",
                  }}
                />
              </div>

              {/* Course badge */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 3.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  position: "absolute",
                  bottom: -20,
                  right: -20,
                  background: "#1a1a1a",
                  padding: "18px 22px",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "#e8899a",
                    marginBottom: 6,
                  }}
                >
                  Також проводить
                </div>
                <div
                  style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: 18,
                    color: "#f8c4cf",
                  }}
                >
                  Навчальні курси
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* COLUMN 2 — Bio + stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 21,
                color: "#2d2020",
                fontStyle: "italic",
                lineHeight: 1.65,
                marginBottom: 28,
              }}
            >
              {specialist?.role || 'Сертифікований спеціаліст з апаратної косметології з 8-річним досвідом'}
            </p>
            <p
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: 14,
                color: "#8a7070",
                lineHeight: 1.85,
                fontWeight: 300,
                marginBottom: 40,
              }}
            >
              {specialist?.bio || 'Постійно підвищую кваліфікацію, слідкую за новинками б\'юті-індустрії та передаю знання на авторських курсах. Кожна клієнтка — особлива.'}
            </p>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 0,
                marginBottom: 40,
                borderTop: "1px solid rgba(212,105,124,0.2)",
                paddingTop: 32,
              }}
            >
              {[
                ["8+", "Років досвіду"],
                ["800+", "Клієнтів"],
                ["11+", "Процедур"],
              ].map(([val, lbl], i) => (
                <div
                  key={i}
                  style={{
                    textAlign: "center",
                    borderRight:
                      i < 2 ? "1px solid rgba(212,105,124,0.2)" : "none",
                    padding: "0 12px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'DM Serif Display',serif",
                      fontSize: 40,
                      color: "#d4697c",
                      lineHeight: 1,
                      marginBottom: 6,
                    }}
                  >
                    {val}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Jost',sans-serif",
                      fontSize: 9,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "#8a7070",
                      fontWeight: 300,
                    }}
                  >
                    {lbl}
                  </div>
                </div>
              ))}
            </div>

            {/* Cert card */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                background: "white",
                border: "1px solid rgba(242,168,182,0.35)",
                padding: "24px 28px",
                boxShadow: "0 12px 40px rgba(212,105,124,0.1)",
              }}
            >
              <div
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 9,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#d4697c",
                  marginBottom: 10,
                }}
              >
                Сертифікований спеціаліст
              </div>
              <div
                style={{
                  fontFamily: "'DM Serif Display',serif",
                  fontSize: 20,
                  color: "#1a1a1a",
                  marginBottom: 6,
                }}
              >
                {specialist?.name || 'Наталія Ковальчук'}
              </div>
              <div style={{ display: "flex", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} style={{ color: "#e8899a", fontSize: 14 }}>
                    ★
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* COLUMN 3 — Interactive specializations */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
          >
            <div
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: 10,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#8a7070",
                marginBottom: 16,
              }}
            >
              Спеціалізація
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 7,
                marginBottom: 24,
              }}
            >
              {specializations.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSpec(i)}
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 11,
                    padding: "8px 16px",
                    border: "1px solid",
                    borderColor:
                      activeSpec === i ? "#d4697c" : "rgba(212,105,124,0.25)",
                    background: activeSpec === i ? "#d4697c" : "transparent",
                    color: activeSpec === i ? "white" : "#8a7070",
                    transition: "all 0.25s",
                    fontWeight: 300,
                  }}
                >
                  {s.title}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeSpec}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
                style={{
                  background: "white",
                  border: "1px solid rgba(242,168,182,0.3)",
                  padding: "28px 32px",
                  boxShadow: "0 10px 32px rgba(212,105,124,0.08)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: 26,
                    color: "#1a1a1a",
                    marginBottom: 12,
                  }}
                >
                  {specializations[activeSpec].title}
                </div>
                <p
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 13,
                    color: "#8a7070",
                    lineHeight: 1.75,
                    fontWeight: 300,
                    marginBottom: 24,
                  }}
                >
                  {specializations[activeSpec].desc}
                </p>
                <div style={{ display: "flex", gap: 24, marginBottom: 20 }}>
                  {[
                    ["Тривалість", specializations[activeSpec].duration],
                    ["Ефект", specializations[activeSpec].effect],
                  ].map(([lbl, val]) => (
                    <div key={lbl}>
                      <div
                        style={{
                          fontFamily: "'Jost',sans-serif",
                          fontSize: 9,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "#d4697c",
                          marginBottom: 5,
                        }}
                      >
                        {lbl}
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Serif Display',serif",
                          fontSize: 16,
                          color: "#1a1a1a",
                        }}
                      >
                        {val}
                      </div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/services"
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "#d4697c",
                    borderBottom: "1px solid rgba(212,105,124,0.4)",
                    paddingBottom: 2,
                    transition: "all 0.3s",
                  }}
                >
                  Детальніше →
                </Link>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
/* ═══════════ WHY US ═══════════ */
function WhyUsSection() {
  const [ref, inView] = useInView(0.1);
  const features = [
    {
      icon: "✦",
      title: "Сертифікований спеціаліст",
      desc: "Наталія регулярно проходить навчання та підвищення кваліфікації, слідкує за новинками",
    },
    {
      icon: "✦",
      title: "Преміум обладнання",
      desc: "Апарати провідних світових виробників з медичною сертифікацією",
    },
    {
      icon: "✦",
      title: "Індивідуальний підхід",
      desc: "Кожна програма розробляється персонально після консультації та аналізу шкіри",
    },
    {
      icon: "✦",
      title: "Безпека та стерильність",
      desc: "Повне дотримання санітарних норм, одноразові матеріали та стерильні інструменти",
    },
  ];
  return (
    <section ref={ref} style={{ padding: "120px 0", background: "#fffbf9" }}>
      <div className="container">
        <div style={{ textAlign: "center", marginBottom: 80 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#d4697c",
              marginBottom: 24,
            }}
          >
            Чому обирають нас
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(36px,4vw,60px)",
              color: "#1a1a1a",
            }}
          >
            Ваша довіра — наш{" "}
            <em style={{ fontStyle: "italic", color: "#d4697c" }}>пріоритет</em>
          </motion.h2>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
            gap: 32,
          }}
          className="whyus-grid"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1 }}
              style={{
                padding: "40px 32px",
                border: "1px solid rgba(242,168,182,0.2)",
                background: "#fffbf9",
                transition: "all 0.4s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#fff0f3";
                e.currentTarget.style.borderColor = "rgba(232,137,154,0.4)";
                e.currentTarget.style.transform = "translateY(-6px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#fffbf9";
                e.currentTarget.style.borderColor = "rgba(242,168,182,0.2)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  border: "1.5px solid #e8899a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 24,
                  color: "#d4697c",
                  fontSize: 16,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontFamily: "'DM Serif Display',serif",
                  fontSize: 22,
                  color: "#1a1a1a",
                  marginBottom: 16,
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 14,
                  color: "#8a7070",
                  lineHeight: 1.7,
                  fontWeight: 300,
                }}
              >
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════ TESTIMONIALS ═══════════ */
function TestimonialsSection() {
  const [ref, inView] = useInView(0.1);
  const [active, setActive] = useState(0);
  const [testimonials, setTestimonials] = useState([
    { name: "Олена Кравченко", role: "Постійна клієнтка", text: "Роблю LPG масаж вже пів року — результат перевершує всі очікування! Шкіра виглядає набагато молодшою і пружнішою.", rating: 5 },
    { name: "Марина Іваненко", role: "Клієнтка 2 роки", text: "Записалась на лазерну епіляцію — і жалкую тільки про одне, що не прийшла раніше. Сервіс на вищому рівні.", rating: 5 },
    { name: "Тетяна Мельник", role: "Клієнтка", text: "Ендосфера допомогла мені попрощатися з целюлітом! Бачу результат вже після 5 сеансів.", rating: 5 },
    { name: "Ірина Поліщук", role: "Клієнтка 1 рік", text: "Краще місця у Нововолинськ немає! Чистота, затишок і неймовірний результат.", rating: 5 },
  ]);

  useEffect(() => {
    getReviews().then(data => { if (data.length > 0) setTestimonials(data); }).catch(console.error);
  }, []);
  useEffect(() => {
    const timer = setInterval(
      () => setActive((a) => (a + 1) % testimonials.length),
      4000,
    );
    return () => clearInterval(timer);
  }, [testimonials.length]);
  return (
    <section
      ref={ref}
      style={{ padding: "120px 0", background: "#fff0f3", overflow: "hidden" }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
          className="testimonials-grid"
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
          >
            <div
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#d4697c",
                marginBottom: 32,
              }}
            >
              Відгуки
            </div>
            <h2
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: "clamp(36px,4vw,60px)",
                color: "#1a1a1a",
                lineHeight: 1.1,
                marginBottom: 40,
              }}
            >
              Вони нам
              <br />
              <em style={{ fontStyle: "italic", color: "#d4697c" }}>
                довіряють
              </em>
            </h2>
            <div style={{ position: "relative", minHeight: 220 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: "white",
                    padding: "40px",
                    border: "1px solid rgba(242,168,182,0.25)",
                    boxShadow: "0 20px 60px rgba(232,137,154,0.08)",
                  }}
                >
                  <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
                    {[...Array(testimonials[active].rating)].map((_, i) => (
                      <span key={i} style={{ color: "#e8899a", fontSize: 18 }}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p
                    style={{
                      fontFamily: "'Cormorant Garamond',serif",
                      fontSize: 20,
                      color: "#2d2020",
                      lineHeight: 1.7,
                      fontStyle: "italic",
                      marginBottom: 28,
                    }}
                  >
                    "{testimonials[active].text}"
                  </p>
                  <div
                    style={{
                      fontFamily: "'Jost',sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      color: "#1a1a1a",
                    }}
                  >
                    {testimonials[active].name}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Jost',sans-serif",
                      fontSize: 12,
                      color: "#e8899a",
                      fontWeight: 300,
                      marginTop: 4,
                    }}
                  >
                    {testimonials[active].role}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 28,
                alignItems: "center",
              }}
            >
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  style={{
                    width: i === active ? 32 : 8,
                    height: 8,
                    background:
                      i === active ? "#d4697c" : "rgba(212,105,124,0.25)",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    transition: "all 0.35s",
                  }}
                />
              ))}
              <span
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 11,
                  color: "#8a7070",
                  marginLeft: 8,
                  fontWeight: 300,
                }}
              >
                {active + 1} / {testimonials.length}
              </span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            {/* Group photo */}
            <div
              style={{
                position: "relative",
                overflow: "hidden",
                border: "1px solid rgba(242,168,182,0.25)",
              }}
            >
              <img
                src="/вониНамДовіряють2.jpg"
                alt="Вони нам довіряють"
                style={{
                  width: "100%",
                  height: 280,
                  objectFit: "cover",
                  objectPosition: "center top",
                  display: "block",
                  imageRendering: "high-quality",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background:
                    "linear-gradient(to top, rgba(255,240,243,0.85), transparent)",
                  pointerEvents: "none",
                }}
              />
            </div>
            {/* Rating card */}
            <div style={{ display: "flex", gap: 16, alignItems: "stretch" }}>
              <div
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg,#f8c4cf,#fde0e6)",
                  padding: "24px",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: 48,
                    color: "white",
                    lineHeight: 1,
                  }}
                >
                  5.0
                </div>
                <div
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.7)",
                    marginTop: 4,
                  }}
                >
                  Рейтинг
                </div>
                <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
                  {[...Array(5)].map((_, i) => (
                    <span key={i} style={{ color: "white", fontSize: 14 }}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1, background: "#1a1a1a", padding: "24px" }}>
                <div
                  style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: 36,
                    color: "#f8c4cf",
                    lineHeight: 1,
                  }}
                >
                  800+
                </div>
                <div
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "rgba(255,240,243,0.5)",
                    marginTop: 4,
                  }}
                >
                  клієнтів
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════ COURSES ═══════════ */
function CoursesSection() {
  const [ref, inView] = useInView(0.2);
  return (
    <section ref={ref} style={{ padding: "120px 0", background: "#fffbf9" }}>
      <div className="container">
        <div
          className="courses-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
          >
            <div
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#d4697c",
                marginBottom: 32,
              }}
            >
              Навчання
            </div>
            <h2
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: "clamp(36px,4vw,60px)",
                color: "#1a1a1a",
                lineHeight: 1.1,
                marginBottom: 24,
              }}
            >
              Курси та{" "}
              <em style={{ fontStyle: "italic", color: "#d4697c" }}>
                навчання
              </em>
            </h2>
            <p
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: 16,
                color: "#8a7070",
                lineHeight: 1.85,
                fontWeight: 300,
                marginBottom: 40,
              }}
            >
              Наталія проводить авторські курси з апаратної косметології.
              Теорія, практика на моделях, сертифікат після завершення. Невеликі
              групи до 5 осіб.
            </p>
            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 48,
              }}
            >
              {[
                "LPG масаж",
                "RF-ліфтинг",
                "Ендосфера",
                "Апаратні методики",
              ].map((course) => (
                <span
                  key={course}
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 12,
                    color: "#d4697c",
                    background: "rgba(212,105,124,0.08)",
                    border: "1px solid rgba(212,105,124,0.2)",
                    padding: "8px 20px",
                    fontWeight: 300,
                  }}
                >
                  {course}
                </span>
              ))}
            </div>
            <Link
              to="/contact"
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: "#1a1a1a",
                color: "white",
                padding: "18px 44px",
                display: "inline-block",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#d4697c")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#1a1a1a")
              }
            >
              Дізнатись більше
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <div
              style={{
                background: "linear-gradient(135deg,#fff0f3,#fde0e6)",
                padding: "56px 48px",
                border: "1px solid rgba(242,168,182,0.2)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -30,
                  right: -30,
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: "rgba(248,196,207,0.4)",
                  pointerEvents: "none",
                }}
              />
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    fontFamily: "'DM Serif Display',serif",
                    fontSize: 64,
                    color: "rgba(212,105,124,0.15)",
                    lineHeight: 1,
                    marginBottom: 16,
                  }}
                >
                  8+
                </div>
                <p
                  style={{
                    fontFamily: "'Jost',sans-serif",
                    fontSize: 13,
                    color: "#d4697c",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    marginBottom: 32,
                  }}
                >
                  Років практики викладача
                </p>
                {[
                  "Теорія + практика на моделях",
                  "Сертифікат після завершення",
                  "Невеликі групи до 5 осіб",
                  "Підтримка після навчання",
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 18,
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#d4697c",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "'Jost',sans-serif",
                        fontSize: 15,
                        color: "#2d2020",
                        fontWeight: 300,
                      }}
                    >
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════ GIFT CERTS ═══════════ */
function GiftCertSection() {
  const [ref, inView] = useInView(0.2);
  return (
    <section
      ref={ref}
      style={{
        padding: "100px 0",
        background: "linear-gradient(135deg,#1a1a1a,#2d2020)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "-5%",
          transform: "translateY(-50%)",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle,rgba(248,196,207,0.08),transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -40,
          fontFamily: "'DM Serif Display',serif",
          fontSize: 200,
          color: "rgba(248,196,207,0.03)",
          pointerEvents: "none",
          userSelect: "none",
          fontStyle: "italic",
          lineHeight: 1,
        }}
      >
        Gift
      </div>
      <div className="container">
        <div
          className="gift-cert-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
          >
            <div
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: 11,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#e8899a",
                marginBottom: 32,
              }}
            >
              Подарунки
            </div>
            <h2
              style={{
                fontFamily: "'DM Serif Display',serif",
                fontSize: "clamp(36px,4vw,60px)",
                color: "#f8c4cf",
                lineHeight: 1.1,
                marginBottom: 24,
              }}
            >
              Подарункові <em style={{ fontStyle: "italic" }}>сертифікати</em>
            </h2>
            <p
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: 16,
                color: "rgba(255,240,243,0.55)",
                lineHeight: 1.85,
                fontWeight: 300,
                marginBottom: 40,
              }}
            >
              У нас можна придбати подарунковий сертифікат на будь-яку суму або
              процедуру. Це час для себе, догляд який надихає, подарунок що
              точно запам'ятається.
            </p>
            <Link
              to="/contact"
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: 12,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: "#f2a8b6",
                color: "#1a1a1a",
                padding: "18px 44px",
                display: "inline-block",
                transition: "background 0.3s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#e8899a")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#f2a8b6")
              }
            >
              Придбати сертифікат
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="gift-cert-second-block"
          >
            <div style={{ background:"rgba(255,240,243,0.04)", border:"1px solid rgba(255,240,243,0.1)", padding:"56px 48px", textAlign:"center" }}>
              <div style={{ width:72, height:72, borderRadius:"50%", border:"1.5px solid rgba(242,168,182,0.35)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 28px", color:"#f2a8b6", fontSize:28 }}>◈</div>
              <h3 style={{ fontFamily:"'DM Serif Display',serif", fontSize:32, color:"#f8c4cf", marginBottom:16 }}>Сертифікат</h3>
              <p style={{ fontFamily:"'Jost',sans-serif", fontSize:15, color:"rgba(255,240,243,0.4)", fontWeight:300, marginBottom:32, lineHeight:1.7 }}>На будь-яку суму або конкретну процедуру — ви обираєте</p>
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {["На конкретну процедуру","На будь-яку суму","Дійсний 1 рік"].map((opt,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, background:"rgba(255,240,243,0.04)", padding:"14px 20px", border:"1px solid rgba(255,240,243,0.08)" }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:"#e8899a", flexShrink:0 }}/>
                    <span style={{ fontFamily:"'Jost',sans-serif", fontSize:14, color:"rgba(255,240,243,0.6)", fontWeight:300 }}>{opt}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
