import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageWrapper from "../components/PageWrapper";
import useInView from "../hooks/useInView";
import { getPricingItems } from "../lib/contentful";

export default function PricingPage() {
  const [priceData, setPriceData] = useState({});
  const [activeTab, setActiveTab] = useState("");
  const [headerRef, headerInView] = useInView();
  const [tableRef, tableInView] = useInView(0.1);

  useEffect(() => {
    getPricingItems().then(data => {
      setPriceData(data);
      setActiveTab(Object.keys(data)[0] || "");
    }).catch(console.error);
  }, []);

  return (
    <PageWrapper>
      <section
        style={{
          padding: "180px 0 80px",
          background: "linear-gradient(135deg,#fff0f3,#fdf8f5)",
          overflow: "clip",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: -30,
            right: -20,
            fontFamily: "'DM Serif Display',serif",
            fontSize: "clamp(80px,15vw,200px)",
            color: "rgba(232,137,154,0.05)",
            pointerEvents: "none",
            userSelect: "none",
            fontStyle: "italic",
          }}
        >
          Price
        </div>
        <div className="container" ref={headerRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: 11,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#d4697c",
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 32,
            }}
          >
            <span
              style={{
                display: "block",
                width: 40,
                height: 1,
                background: "#e8899a",
              }}
            />
            Прайс-лист
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(48px,6vw,88px)",
              color: "#1a1a1a",
              lineHeight: 1.0,
            }}
          >
            Ціни та{" "}
            <em style={{ fontStyle: "italic", color: "#d4697c" }}>
              пропозиції
            </em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: 16,
              color: "#8a7070",
              fontWeight: 300,
              maxWidth: 560,
              marginTop: 24,
            }}
          >
            Прозорі ціни без прихованих доплат. Ціни вказані від — фінальна
            вартість обговорюється на консультації. Перша консультація —
            безкоштовно.
          </motion.p>
        </div>
      </section>

      {/* Tabs */}
      <section
        style={{
          background: "#fffbf9",
          borderBottom: "1px solid rgba(242,168,182,0.15)",
        }}
      >
        <div className="container">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 0,
              paddingBottom: 0,
            }}
            className="pricing-tabs"
          >
            {Object.keys(priceData).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  fontFamily: "'Jost',sans-serif",
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  padding: "22px 28px",
                  border: "none",
                  background: "none",
                  borderBottom:
                    activeTab === tab
                      ? "2px solid #d4697c"
                      : "2px solid transparent",
                  color: activeTab === tab ? "#d4697c" : "#8a7070",
                  cursor: "none",
                  whiteSpace: "nowrap",
                  transition: "all 0.3s",
                  flexShrink: 0,
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={tableRef}
        style={{ padding: "80px 0 120px", background: "#fffbf9" }}
      >
        <div className="container">
          <div style={{ borderTop: "1px solid rgba(242,168,182,0.2)" }}>
            {(priceData[activeTab] || []).map((item, i) => (
              <motion.div
                key={`${activeTab}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={tableInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.04 }}
              >
                <div
                  className="pricing-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    gap: 32,
                    padding: "24px 16px",
                    borderBottom: "1px solid rgba(242,168,182,0.15)",
                    alignItems: "center",
                    transition: "background 0.3s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fff0f3")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div>
                    <h3
                      style={{
                        fontFamily: "'DM Serif Display',serif",
                        fontSize: 20,
                        color: "#1a1a1a",
                        marginBottom: item.duration ? 4 : 0,
                      }}
                    >
                      {item.name}
                    </h3>
                    {item.duration && (
                      <span
                        style={{
                          fontFamily: "'Jost',sans-serif",
                          fontSize: 12,
                          color: "#8a7070",
                          fontWeight: 300,
                        }}
                      >
                        {item.duration}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Serif Display',serif",
                      fontSize: 24,
                      color: "#d4697c",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.price} грн
                  </div>
                  <Link
                    to="/booking"
                    className="pricing-book-btn"
                    style={{
                      fontFamily: "'Jost',sans-serif",
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      background: "#1a1a1a",
                      color: "white",
                      padding: "10px 18px",
                      whiteSpace: "nowrap",
                      transition: "background 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#d4697c")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "#1a1a1a")
                    }
                  >
                    Записатись
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div
            style={{
              padding: "40px",
              background: "#fff0f3",
              border: "1px solid rgba(242,168,182,0.2)",
              marginTop: 48,
            }}
          >
            <p
              style={{
                fontFamily: "'Jost',sans-serif",
                fontSize: 14,
                color: "#8a7070",
                fontWeight: 300,
                lineHeight: 1.7,
              }}
            >
              <strong style={{ color: "#d4697c", fontWeight: 400 }}>
                Увага:{" "}
              </strong>
              Ціни вказані від і можуть змінюватись залежно від зони обробки,
              індивідуальних особливостей та обраної програми. Точна вартість
              розраховується на безкоштовній консультації.
            </p>
          </div>
        </div>
      </section>

      <section
        style={{
          padding: "100px 0",
          background: "#1a1a1a",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: "'DM Serif Display',serif",
              fontSize: "clamp(36px,4vw,60px)",
              color: "#f8c4cf",
              marginBottom: 20,
            }}
          >
            Курсові програми — <em style={{ fontStyle: "italic" }}>вигідно</em>
          </h2>
          <p
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: 16,
              color: "rgba(255,240,243,0.4)",
              fontWeight: 300,
              maxWidth: 500,
              margin: "0 auto 48px",
            }}
          >
            При записі на курс лікування ціна нижча порівняно з оплатою кожної
            процедури окремо
          </p>
          <Link
            to="/booking"
            style={{
              fontFamily: "'Jost',sans-serif",
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: "#f2a8b6",
              color: "#1a1a1a",
              padding: "18px 48px",
              display: "inline-block",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e8899a")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f2a8b6")}
          >
            Підібрати програму
          </Link>
        </div>
      </section>
    </PageWrapper>
  );
}
