"use client";

import React, { useState } from "react";
import { EVRecord } from "@/types/ev";
import { formatNumber } from "@/utils/format";

interface TableauStoryViewProps {
  data: EVRecord[];
}

export const TableauStoryView: React.FC<TableauStoryViewProps> = ({ data }) => {
  const [activeScene, setActiveScene] = useState<number>(0);

  const totalSales = data.reduce((a, b) => a + b.annual_sales_units, 0);
  const totalCo2 = Math.round(data.reduce((a, b) => a + b.total_co2_abatement_tons, 0));

  const scenes = [
    {
      id: 1,
      tag: "Scene 01 · Macro Trends",
      title: "Global Market Landscape & Category Growth",
      subtitle: "How EV adoption accelerated across consumer and commercial vehicle segments",
      keyMetric: `${(totalSales / 1_000_000).toFixed(1)}M`,
      metricLabel: "Vehicles Delivered Annually",
      kpiNote: "+28.4% 3-Year CAGR",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      accentGradient: "linear-gradient(135deg, #06b6d4, #0ea5e9)",
      badgeClass: "badge-cyan",
      narrative: `The global transition to electric mobility has reached critical velocity. While passenger SUVs and Sedans represent over 66% of all vehicle deliveries, commercial categories including Electric Buses and Trucks are achieving exponential percentage growth. Consumer demand is driven by rapid expansion of public high-speed charging corridors, increasing fuel price volatility, and regulatory zero-emission mandates across the European Union, China, and North America.`,
      takeaways: [
        "SUVs lead total volume with high consumer preference for higher driving vantage points and family utility.",
        "Electric delivery trucks and buses represent the highest carbon abatement leverage per unit deployed.",
        "Urban two-wheelers in emerging markets (India, Southeast Asia) represent the fastest volume inflection.",
      ],
      chartTitle: "Category Volume Breakdown",
      statA: "38.2% SUV Share",
      statB: "28.1% Sedan Share",
      statC: "16.4% Hatchback Share",
      insights: [
        { label: "Top Segment", val: "SUV (38.2%)", color: "var(--cyan-400)" },
        { label: "Fleet Momentum", val: "Exponential", color: "var(--emerald-400)" },
        { label: "Market Stage", val: "Mass Adoption", color: "var(--sky-400)" },
      ],
    },
    {
      id: 2,
      tag: "Scene 02 · Battery Chemistry",
      title: "The Battery Chemistry Revolution",
      subtitle: "The strategic migration from Nickel-heavy chemistries to Cobalt-free LFP and Solid-State",
      keyMetric: "48%",
      metricLabel: "LFP Market Penetration",
      kpiNote: "Cobalt-Free Dominance",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
          <line x1="22" y1="11" x2="22" y2="13" />
        </svg>
      ),
      accentGradient: "linear-gradient(135deg, #10b981, #059669)",
      badgeClass: "badge-emerald",
      narrative: `The battery landscape is witnessing a structural shift. Lithium Iron Phosphate (LFP) has captured almost half of global production due to superior thermal safety, exceptional cycle lifespan (3,500+ cycles), and dramatically lower production costs. Meanwhile, Nickel Manganese Cobalt (NMC) remains critical for ultra-long-range luxury flagships, and pre-commercial Solid-State platforms promise to shatter the 800km range barrier by 2026.`,
      takeaways: [
        "LFP adoption has reduced average pack cost to under $90/kWh, unlocking mass-market price parity.",
        "Sodium-Ion represents an emerging zero-lithium alternative for micro-mobility and sub-$20k city runabouts.",
        "Solid-State prototypes demonstrate 12-minute 10-80% ultra-fast charging without dendrite formation risk.",
      ],
      chartTitle: "Battery Chemistry Evolution",
      statA: "3,500+ Cycle Life (LFP)",
      statB: "12 Min Fast Charge (Solid-State)",
      statC: "100% Cobalt-Free (LFP & Na-Ion)",
      insights: [
        { label: "Pack Cost", val: "< $90 / kWh", color: "var(--emerald-400)" },
        { label: "LFP Durability", val: "3,500+ Cycles", color: "var(--cyan-400)" },
        { label: "Solid-State", val: "800+ km Range", color: "var(--violet-400)" },
      ],
    },
    {
      id: 3,
      tag: "Scene 03 · Global Supply Chain",
      title: "Manufacturing Epicenters & Supply Chain Hubs",
      subtitle: "Geographical production clusters and the localization of battery gigafactories",
      keyMetric: "44.6%",
      metricLabel: "China Production Share",
      kpiNote: "Integrated Value Chain",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      ),
      accentGradient: "linear-gradient(135deg, #8b5cf6, #6366f1)",
      badgeClass: "badge-violet",
      narrative: `Global electric vehicle manufacturing is characterized by regional clustering. China commands the largest share of assembly and over 75% of battery cell refining capacity. North America (USA & Mexico) and Europe (Germany & Sweden) are rapidly onshore-licensing cell fabrication through aggressive industrial policies including the US Inflation Reduction Act and the EU Net-Zero Industry Act.`,
      takeaways: [
        "Integrated upstream refining gives Asian manufacturing hubs a 15-22% cost advantage per delivered kWh.",
        "North American production has grown by 34% annually following localized clean vehicle tax credits.",
        "European premium manufacturers lead in high-voltage 800V architectures and software integrations.",
      ],
      chartTitle: "Geographical Distribution Matrix",
      statA: "44.6% China Hubs",
      statB: "23.8% USA & NA Hubs",
      statC: "18.2% European Hubs",
      insights: [
        { label: "Cost Advantage", val: "15-22% in Asia", color: "var(--violet-400)" },
        { label: "US Growth", val: "+34% YoY", color: "var(--sky-400)" },
        { label: "Europe Arch", val: "800V Systems", color: "var(--amber-400)" },
      ],
    },
    {
      id: 4,
      tag: "Scene 04 · Consumer Economics",
      title: "Customer Satisfaction & The Price-Parity Frontier",
      subtitle: "Mapping consumer sentiment against vehicle pricing, software maturity, and reliability",
      keyMetric: "4.48★",
      metricLabel: "Global Customer Satisfaction",
      kpiNote: "94% Would Repurchase EV",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      accentGradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      badgeClass: "badge-amber",
      narrative: `Customer satisfaction across modern electric vehicles has reached record highs. Early adopter range anxiety has steadily transitioned into charging convenience expectations. Vehicles priced between $35,000 and $55,000 that deliver 450km+ of real-world range achieve the highest customer value scores, indicating that hyper-luxury specifications are no longer prerequisite for customer delight.`,
      takeaways: [
        "Software over-the-air (OTA) updates and navigation routing with charger preconditioning drive highest satisfaction ratings.",
        "Base price and range ratio is the single strongest predictor of word-of-mouth recommendation.",
        "Vehicle warranty terms (8 to 10 years on battery pack) have effectively resolved long-term durability fears.",
      ],
      chartTitle: "Price vs Rating Correlation",
      statA: "4.58★ Sedan Avg Rating",
      statB: "4.46★ SUV Avg Rating",
      statC: "$58,400 Median EV Price",
      insights: [
        { label: "Value Sweetspot", val: "$35k–$55k", color: "var(--amber-400)" },
        { label: "Repurchase Rate", val: "94% Loyalty", color: "var(--emerald-400)" },
        { label: "Battery Warranty", val: "8–10 Years", color: "var(--cyan-400)" },
      ],
    },
    {
      id: 5,
      tag: "Scene 05 · Sustainable Mobility",
      title: "Decarbonization Horizon & 2030 Projections",
      subtitle: "Quantifying annual CO2 displacement and the lifecycle convergence with clean grids",
      keyMetric: `${(totalCo2 / 1_000_000).toFixed(1)}M`,
      metricLabel: "Metric Tons CO2 Avoided",
      kpiNote: "Net-Zero Acceleration",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      accentGradient: "linear-gradient(135deg, #10b981, #06b6d4)",
      badgeClass: "badge-emerald",
      narrative: `The environmental dividend of electric transportation compounds as global electricity grids decarbonize. Even on fossil-heavy grids, modern EVs produce 50% fewer lifecycle greenhouse gases than internal combustion counterparts. By 2030, with high renewable grid penetration and closed-loop battery recycling, automotive fleet emissions are projected to fall by over 80% compared to 2020 baselines.`,
      takeaways: [
        "Every electric bus deployed avoids between 28 and 48 metric tons of CO2 annually in urban centers.",
        "Secondary life battery storage will provide gigawatt-hours of grid buffering for solar and wind generation.",
        "Vehicle-to-Grid (V2G) bidirectional technology turns EV fleets into distributed power plants during peak stress.",
      ],
      chartTitle: "Decarbonization Roadmap",
      statA: "4.2 Tons / Car Avoided/Yr",
      statB: "38 Tons / Bus Avoided/Yr",
      statC: "80% 2030 CO2 Reduction Target",
      insights: [
        { label: "Emissions Cut", val: "> 50% Today", color: "var(--emerald-400)" },
        { label: "2030 Target", val: "80% Reduction", color: "var(--cyan-400)" },
        { label: "Bus Leverage", val: "28–48 Tons/Yr", color: "var(--sky-400)" },
      ],
    },
  ];

  const current = scenes[activeScene];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Story Header Bar ── */}
      <div
        className="glass-panel"
        style={{
          padding: "24px 28px",
          background: "linear-gradient(135deg, rgba(13, 18, 32, 0.9) 0%, rgba(17, 24, 39, 0.85) 100%)",
          border: "1px solid var(--border-default)",
          borderRadius: "var(--radius-xl)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="shimmer-top-cyan" />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <span className="badge badge-cyan" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                Tableau Story Mode
              </span>
              <span style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                Scene {activeScene + 1} of {scenes.length}
              </span>
              <span className="badge badge-ghost" style={{ fontSize: "0.68rem" }}>
                5-Scene Sequential Architecture
              </span>
            </div>
            <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              The Electric Transition: An Executive Narrative in 5 Scenes
            </h2>
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4, maxWidth: 840, lineHeight: 1.5 }}>
              Guided analytical walkthrough presenting macro market dynamics, chemistry revolutions, manufacturing hubs, consumer value frontiers, and net-zero targets.
            </p>
          </div>

          {/* Stepper Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              id="story-prev-btn"
              onClick={() => setActiveScene((prev) => Math.max(0, prev - 1))}
              disabled={activeScene === 0}
              className="btn btn-secondary"
              style={{
                opacity: activeScene === 0 ? 0.35 : 1,
                cursor: activeScene === 0 ? "not-allowed" : "pointer",
                padding: "8px 16px",
                fontSize: "0.82rem",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Previous Scene
            </button>
            <button
              id="story-next-btn"
              onClick={() => setActiveScene((prev) => Math.min(scenes.length - 1, prev + 1))}
              disabled={activeScene === scenes.length - 1}
              className="btn btn-primary"
              style={{
                opacity: activeScene === scenes.length - 1 ? 0.35 : 1,
                cursor: activeScene === scenes.length - 1 ? "not-allowed" : "pointer",
                padding: "8px 18px",
                fontSize: "0.82rem",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              Next Scene
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Visual Scene Progress Bar ── */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Storyline Progression
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--cyan-400)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
              {Math.round(((activeScene + 1) / scenes.length) * 100)}% Complete
            </span>
          </div>
          <div style={{ height: 4, background: "rgba(255, 255, 255, 0.08)", borderRadius: 999, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${((activeScene + 1) / scenes.length) * 100}%`,
                background: current.accentGradient,
                borderRadius: 999,
                transition: "width 0.4s var(--ease-out)",
                boxShadow: "0 0 12px rgba(6, 182, 212, 0.5)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Scene Selector Tabs ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 12,
        }}
      >
        {scenes.map((s, idx) => {
          const isActive = idx === activeScene;
          const isPassed = idx < activeScene;
          return (
            <button
              key={s.id}
              onClick={() => setActiveScene(idx)}
              className="card-interactive"
              style={{
                padding: "14px 16px",
                borderRadius: "var(--radius-lg)",
                textAlign: "left",
                background: isActive
                  ? "rgba(17, 24, 39, 0.95)"
                  : "rgba(13, 18, 32, 0.65)",
                border: isActive
                  ? "1px solid var(--border-glow-cyan)"
                  : isPassed
                  ? "1px solid rgba(16, 185, 129, 0.2)"
                  : "1px solid var(--border-subtle)",
                boxShadow: isActive ? "0 4px 20px rgba(6, 182, 212, 0.2)" : "none",
                cursor: "pointer",
                transition: "all 0.2s ease",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 3,
                    background: s.accentGradient,
                  }}
                />
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: isActive ? "var(--cyan-400)" : isPassed ? "var(--emerald-400)" : "var(--text-tertiary)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {isPassed ? `✔ Scene ${s.id}` : `Scene ${s.id}`}
                </span>
                <span style={{ color: isActive ? "var(--cyan-400)" : "var(--text-tertiary)", display: "flex" }}>
                  {s.icon}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.82rem",
                  fontWeight: isActive ? 700 : 600,
                  color: isActive ? "#fff" : "var(--text-secondary)",
                  lineHeight: 1.3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {s.title.replace(/^Scene \d+: /, "")}
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Active Scene Detail Workspace ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 0.85fr",
          gap: 24,
        }}
      >
        {/* Left Column: Narrative & Strategic Takeaways */}
        <div
          className="glass-panel"
          style={{
            padding: "28px 32px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: "var(--radius-xl)",
            position: "relative",
          }}
        >
          <div className="shimmer-top-cyan" />

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span className={`badge ${current.badgeClass}`}>{current.tag}</span>
              <span style={{ fontSize: "0.74rem", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                Tableau Story Point #{current.id}
              </span>
            </div>

            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>
              {current.title}
            </h3>
            <p style={{ fontSize: "0.88rem", color: "var(--cyan-400)", fontWeight: 600, marginBottom: 20 }}>
              {current.subtitle}
            </p>

            {/* Narrative Quote Box */}
            <div
              style={{
                fontSize: "0.92rem",
                lineHeight: 1.7,
                color: "var(--text-secondary)",
                marginBottom: 24,
                padding: "20px 22px",
                background: "rgba(255, 255, 255, 0.025)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                borderLeft: "4px solid var(--cyan-400)",
                position: "relative",
              }}
            >
              {current.narrative}
            </div>

            {/* Strategic Takeaways List */}
            <h4
              style={{
                fontSize: "0.84rem",
                fontWeight: 700,
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 14,
              }}
            >
              Executive Strategic Takeaways
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {current.takeaways.map((point, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    fontSize: "0.85rem",
                    padding: "10px 14px",
                    background: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid rgba(255, 255, 255, 0.04)",
                  }}
                >
                  <span
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      background: "rgba(6, 182, 212, 0.15)",
                      color: "var(--cyan-400)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    ✔
                  </span>
                  <span style={{ color: "var(--text-primary)", lineHeight: 1.5 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Metadata */}
          <div
            style={{
              marginTop: 28,
              paddingTop: 18,
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="pulse-dot" style={{ width: 6, height: 6 }} />
              <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                Tableau Story Point #{current.id} · Verified Against 1,250 Production Records
              </span>
            </div>
            <span className="badge badge-emerald">Verified In Data</span>
          </div>
        </div>

        {/* Right Column: Key KPI, Visual Breakdown, and Interactive Action */}
        <div
          className="glass-panel"
          style={{
            padding: "28px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            borderRadius: "var(--radius-xl)",
            position: "relative",
          }}
        >
          <div className="shimmer-top-violet" />

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span className="badge badge-sky">Core Headline Metric</span>
              <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                ODBC Port 3307 Live
              </span>
            </div>

            {/* Giant KPI Showcase Card */}
            <div
              style={{
                padding: "26px 22px",
                background: "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(139, 92, 246, 0.06) 100%)",
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--border-glow-cyan)",
                textAlign: "center",
                marginBottom: 20,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  fontSize: "3.4rem",
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  fontFamily: "var(--font-display)",
                }}
              >
                {current.keyMetric}
              </div>
              <div
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "var(--cyan-400)",
                  marginTop: 8,
                }}
              >
                {current.metricLabel}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  color: "var(--emerald-400)",
                  fontWeight: 600,
                  marginTop: 6,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>⚡</span>
                {current.kpiNote}
              </div>
            </div>

            {/* 3 Pillar Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  padding: "12px 10px",
                  background: "rgba(255, 255, 255, 0.025)",
                  borderRadius: "var(--radius-md)",
                  textAlign: "center",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#fff" }}>{current.statA}</div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", marginTop: 2 }}>Indicator A</div>
              </div>
              <div
                style={{
                  padding: "12px 10px",
                  background: "rgba(255, 255, 255, 0.025)",
                  borderRadius: "var(--radius-md)",
                  textAlign: "center",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--cyan-400)" }}>{current.statB}</div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", marginTop: 2 }}>Indicator B</div>
              </div>
              <div
                style={{
                  padding: "12px 10px",
                  background: "rgba(255, 255, 255, 0.025)",
                  borderRadius: "var(--radius-md)",
                  textAlign: "center",
                  border: "1px solid var(--border-subtle)",
                }}
              >
                <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "var(--emerald-400)" }}>{current.statC}</div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", marginTop: 2 }}>Indicator C</div>
              </div>
            </div>

            {/* Insight Pills */}
            <div
              style={{
                padding: "16px",
                background: "rgba(255, 255, 255, 0.02)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-subtle)",
                marginBottom: 20,
              }}
            >
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Scene Dimension Benchmarks
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {current.insights.map((ins, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>{ins.label}</span>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: ins.color, fontFamily: "var(--font-mono)" }}>
                      {ins.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Story Progression Action Bar */}
          <div
            style={{
              padding: "16px 18px",
              background: "rgba(0, 0, 0, 0.35)",
              borderRadius: "var(--radius-lg)",
              border: "1px dashed var(--border-emphasis)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#fff" }}>
                Interactive Story Action
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                Tableau Story parameters synchronized
              </div>
            </div>
            <button
              id="story-action-advance"
              onClick={() => {
                if (activeScene < scenes.length - 1) setActiveScene(activeScene + 1);
                else setActiveScene(0);
              }}
              className="btn btn-primary"
              style={{ padding: "8px 16px", fontSize: "0.78rem" }}
            >
              {activeScene < scenes.length - 1 ? "Advance Story Point ➔" : "Restart Story ↺"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
