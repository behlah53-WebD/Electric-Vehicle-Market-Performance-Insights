"use client";

import React, { useState } from "react";
import { EVRecord } from "@/types/ev";

interface SarahWilliamsResearchLabProps {
  data: EVRecord[];
}

export const SarahWilliamsResearchLab: React.FC<SarahWilliamsResearchLabProps> = ({ data }) => {
  const [activeChemistry, setActiveChemistry] = useState<string>("All");

  if (!data || data.length === 0) return null;

  const techProfiles: Record<string, {
    count: number; sales: number; avgRange: number;
    avgCapacity: number; avgChargeTime: number; avgWhKm: number;
    totalCo2: number; avgRating: number;
  }> = {};

  data.forEach((d) => {
    if (!techProfiles[d.battery_technology]) {
      techProfiles[d.battery_technology] = {
        count: 0, sales: 0, avgRange: 0, avgCapacity: 0,
        avgChargeTime: 0, avgWhKm: 0, totalCo2: 0, avgRating: 0,
      };
    }
    const t = techProfiles[d.battery_technology];
    t.count += 1;
    t.sales += d.annual_sales_units;
    t.avgRange += d.driving_range_km;
    t.avgCapacity += d.battery_capacity_kwh;
    t.avgChargeTime += d.fast_charging_time_min;
    t.avgWhKm += d.energy_consumption_wh_per_km;
    t.totalCo2 += d.total_co2_abatement_tons;
    t.avgRating += d.customer_rating;
  });

  const totalFleetCo2 = Object.values(techProfiles).reduce((acc, curr) => acc + curr.totalCo2, 0);

  const chemistries = [
    {
      name: "Lithium Iron Phosphate (LFP)",
      short: "LFP",
      cathode: "LiFePO4",
      densityWhKg: "160–210 Wh/kg",
      safetyRating: "Exceptional (4.9/5)",
      cycleLife: "3,500–5,000 cycles",
      cobaltFree: "Yes — 100% Cobalt-Free",
      thermalRunaway: "> 270°C",
      color: "var(--emerald-400)",
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      glow: "rgba(16,185,129,0.2)",
      accentClass: "badge-emerald",
      summary: "High safety, long cycle life, low cost, cobalt-free. Rapidly becoming the global standard for mass-market vehicles.",
    },
    {
      name: "Nickel Manganese Cobalt (NMC)",
      short: "NMC",
      cathode: "LiNixMnyCozO2 (811/622)",
      densityWhKg: "250–300 Wh/kg",
      safetyRating: "Good (4.3/5)",
      cycleLife: "1,800–2,500 cycles",
      cobaltFree: "No — Contains Co & Ni",
      thermalRunaway: "~210°C",
      color: "var(--sky-400)",
      gradient: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
      glow: "rgba(56,189,248,0.2)",
      accentClass: "badge-sky",
      summary: "High energy density enabling long highway range; traditionally dominant in premium SUVs and performance sedans.",
    },
    {
      name: "Nickel Cobalt Aluminum (NCA)",
      short: "NCA",
      cathode: "LiNiCoAlO2",
      densityWhKg: "260–320 Wh/kg",
      safetyRating: "Moderate (4.1/5)",
      cycleLife: "1,500–2,200 cycles",
      cobaltFree: "No — High Nickel, Aluminum",
      thermalRunaway: "~200°C",
      color: "var(--amber-400)",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      glow: "rgba(245,158,11,0.2)",
      accentClass: "badge-amber",
      summary: "Pioneered for high power output and rapid acceleration. Requires sophisticated thermal management systems.",
    },
    {
      name: "Sodium-Ion",
      short: "Na-Ion",
      cathode: "Na3V2(PO4)3 / Prussian Blue",
      densityWhKg: "140–170 Wh/kg",
      safetyRating: "Outstanding (5.0/5)",
      cycleLife: "4,000+ cycles",
      cobaltFree: "Yes — Lithium & Cobalt Free",
      thermalRunaway: "> 300°C",
      color: "var(--cyan-400)",
      gradient: "linear-gradient(135deg, #06b6d4, #0ea5e9)",
      glow: "rgba(6,182,212,0.2)",
      accentClass: "badge-cyan",
      summary: "Abundant raw materials with virtually zero cold-weather range degradation. Ideal for two-wheelers and urban hatchbacks.",
    },
    {
      name: "Solid-State",
      short: "Solid-State",
      cathode: "Solid Electrolyte / Li-Metal",
      densityWhKg: "380–500 Wh/kg",
      safetyRating: "Maximum (5.0/5)",
      cycleLife: "5,000+ cycles",
      cobaltFree: "Varies — Solid ceramic/sulfide",
      thermalRunaway: "> 400°C (Non-flammable)",
      color: "var(--violet-400)",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)",
      glow: "rgba(139,92,246,0.2)",
      accentClass: "badge-violet",
      summary: "Next-generation holy grail. Eliminates flammable liquid electrolyte, delivers 800km+ range and 10-minute fast charging.",
    },
  ];

  const filteredChemistries = activeChemistry === "All"
    ? chemistries
    : chemistries.filter((c) => c.name === activeChemistry);

  const policyRecs = [
    {
      num: "01",
      title: "Tiered Subsidies for Cobalt-Free Chemistries",
      body: "Incentivize LFP and Sodium-Ion adoption in commercial transit and urban commuting to eradicate ethical supply chain bottlenecks and lower entry barrier pricing.",
      cardClass: "insight-card-emerald",
    },
    {
      num: "02",
      title: "Megawatt Charging System (MCS) for Heavy Transport",
      body: "Electric buses and trucks displace 28–48 tons of CO₂ per vehicle per year. Mandating 1MW+ freight corridor chargers accelerates fleet electrification.",
      cardClass: "insight-card-cyan",
    },
    {
      num: "03",
      title: "Closed-Loop Battery Passports & Secondary Life",
      body: "Batteries retaining 75%+ capacity after automotive lifespan must be channeled to stationary grid storage, extending operational lifecycle to 20+ years.",
      cardClass: "insight-card-violet",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }} className="animate-fade-in">

      {/* ── Persona Header ── */}
      <div className="glass-panel glow-emerald" style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div className="persona-avatar" style={{ background: "linear-gradient(135deg, #10b981, #06b6d4)" }}>
              🔬
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                <h2 style={{ fontSize: "1.5rem" }}>Dr. Sarah Williams</h2>
                <span className="badge badge-emerald">Sustainable Mobility Research Analyst</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", maxWidth: 820, lineHeight: 1.65 }}>
                Advanced battery chemistry laboratory and lifecycle emissions observatory evaluating next-generation
                energy density, thermal safety, fast-charging physics, and empirical CO₂ abatement.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <span className="badge badge-ghost">Battery Chemistry</span>
                <span className="badge badge-ghost">Lifecycle Emissions</span>
                <span className="badge badge-ghost">Fast-Charge Physics</span>
                <span className="badge badge-ghost">CO₂ Abatement</span>
              </div>
            </div>
          </div>
          <div style={{
            padding: "16px 22px",
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "var(--radius-lg)",
            textAlign: "right",
          }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Total Decarbonization
            </div>
            <div style={{
              fontSize: "1.4rem",
              fontWeight: 800,
              color: "var(--emerald-400)",
              marginTop: 4,
              fontFamily: "var(--font-display)",
              letterSpacing: "-0.03em",
            }}>
              {(totalFleetCo2 / 1_000_000).toFixed(2)}M
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
              Tons CO₂ Avoided
            </div>
          </div>
        </div>
      </div>

      {/* ── Chemistry Selector ── */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
          marginRight: 4,
        }}>
          Chemistry Filter:
        </span>

        <button
          id="sarah-filter-all"
          onClick={() => setActiveChemistry("All")}
          style={{
            padding: "7px 16px",
            borderRadius: "var(--radius-md)",
            fontSize: "0.8rem",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-main)",
            border: "1px solid",
            transition: "all 0.18s ease",
            background: activeChemistry === "All" ? "linear-gradient(135deg,#06b6d4,#8b5cf6)" : "rgba(255,255,255,0.04)",
            color: activeChemistry === "All" ? "#fff" : "var(--text-tertiary)",
            borderColor: activeChemistry === "All" ? "transparent" : "var(--border-subtle)",
            boxShadow: activeChemistry === "All" ? "0 4px 14px rgba(6,182,212,0.3)" : "none",
          }}
        >
          All Chemistries ({chemistries.length})
        </button>

        {chemistries.map((c) => (
          <button
            key={c.name}
            id={`sarah-filter-${c.short.toLowerCase().replace(/[^a-z]/g, "-")}`}
            onClick={() => setActiveChemistry(c.name)}
            style={{
              padding: "7px 16px",
              borderRadius: "var(--radius-md)",
              fontSize: "0.8rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-main)",
              border: "1px solid",
              transition: "all 0.18s ease",
              background: activeChemistry === c.name ? c.gradient : "rgba(255,255,255,0.04)",
              color: activeChemistry === c.name ? "#fff" : "var(--text-tertiary)",
              borderColor: activeChemistry === c.name ? "transparent" : "var(--border-subtle)",
              boxShadow: activeChemistry === c.name ? `0 4px 14px ${c.glow}` : "none",
            }}
          >
            {c.short}
          </button>
        ))}
      </div>

      {/* ── Chemistry Deep-Dive Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 18 }}>
        {filteredChemistries.map((c, i) => {
          const profile = techProfiles[c.name] || { count: 0, sales: 0, avgRange: 0, avgCapacity: 0, avgChargeTime: 0, avgWhKm: 0, totalCo2: 0, avgRating: 0 };
          const meanRange = profile.count > 0 ? Math.round(profile.avgRange / profile.count) : 0;
          const meanCharge = profile.count > 0 ? Math.round(profile.avgChargeTime / profile.count) : 0;
          const meanWhKm = profile.count > 0 ? Math.round(profile.avgWhKm / profile.count) : 0;

          return (
            <div
              key={c.name}
              className="glass-panel animate-fade-in-up"
              style={{
                padding: 24,
                animationDelay: `${i * 0.07}s`,
                borderTop: `3px solid ${c.color}`,
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div>
                  <h3 style={{ fontSize: "1.05rem", marginBottom: 4 }}>{c.name}</h3>
                  <code style={{
                    fontSize: "0.72rem",
                    fontFamily: "var(--font-mono)",
                    color: "var(--cyan-400)",
                    background: "rgba(6,182,212,0.08)",
                    padding: "2px 7px",
                    borderRadius: 4,
                  }}>
                    {c.cathode}
                  </code>
                </div>
                <span className={`badge ${c.accentClass}`} style={{ fontSize: "0.66rem", flexShrink: 0 }}>
                  {c.cobaltFree.startsWith("Yes") ? "✓ Cobalt-Free" : "Contains Cobalt"}
                </span>
              </div>

              <p style={{ fontSize: "0.79rem", color: "var(--text-tertiary)", lineHeight: 1.6, marginBottom: 16 }}>
                {c.summary}
              </p>

              {/* Technical Specs Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
                padding: "14px 16px",
                background: "rgba(255,255,255,0.025)",
                borderRadius: "var(--radius-lg)",
                fontSize: "0.76rem",
                marginBottom: 14,
              }}>
                {[
                  { label: "Energy Density", value: c.densityWhKg, color: "var(--text-primary)" },
                  { label: "Thermal Runaway", value: c.thermalRunaway, color: "var(--emerald-400)" },
                  { label: "Cycle Lifespan", value: c.cycleLife, color: "var(--text-primary)" },
                  { label: "Safety Rating", value: c.safetyRating, color: "var(--cyan-400)" },
                ].map((spec) => (
                  <div key={spec.label}>
                    <div style={{ color: "var(--text-tertiary)", marginBottom: 3 }}>{spec.label}</div>
                    <div style={{ fontWeight: 700, color: spec.color }}>{spec.value}</div>
                  </div>
                ))}
              </div>

              {/* Fleet Empirical Metrics */}
              <div style={{
                paddingTop: 14,
                borderTop: "1px solid var(--border-subtle)",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
                textAlign: "center",
              }}>
                {[
                  { label: "Mean Range", value: `${meanRange} km`, color: c.color },
                  { label: "10-80% Charge", value: `${meanCharge} min`, color: "var(--emerald-400)" },
                  { label: "Consumption", value: `${meanWhKm} Wh/km`, color: "var(--amber-400)" },
                  { label: "CO₂ Saved", value: `${(profile.totalCo2 / 1_000_000).toFixed(1)}M T`, color: "var(--text-primary)" },
                ].map((m) => (
                  <div key={m.label}>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-tertiary)", marginBottom: 3 }}>{m.label}</div>
                    <div style={{ fontSize: "0.82rem", fontWeight: 700, color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Policy Framework ── */}
      <div className="glass-panel" style={{ padding: 26 }}>
        <div className="shimmer-top-emerald" />
        <div style={{ marginBottom: 18 }}>
          <div className="section-eyebrow">
            <span className="badge badge-emerald">Research Output</span>
          </div>
          <h3 style={{ fontSize: "1.1rem", marginTop: 8 }}>
            Evidence-Based Decarbonization Policy Framework
          </h3>
          <p style={{ fontSize: "0.77rem", color: "var(--text-tertiary)", marginTop: 4 }}>
            Recommendations for government incentives, charging mandates, and battery recycling circularity
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
          {policyRecs.map((rec) => (
            <div key={rec.num} className={`insight-card ${rec.cardClass}`}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span style={{
                  fontSize: "0.65rem",
                  fontWeight: 800,
                  color: "var(--text-tertiary)",
                  fontFamily: "var(--font-mono)",
                  paddingTop: 2,
                  flexShrink: 0,
                }}>
                  {rec.num}
                </span>
                <div>
                  <h4 style={{ fontSize: "0.86rem", fontWeight: 700, marginBottom: 6, lineHeight: 1.4 }}>
                    {rec.title}
                  </h4>
                  <p style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", lineHeight: 1.6 }}>
                    {rec.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
