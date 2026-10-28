"use client";

import React, { useState } from "react";
import { EVRecord } from "@/types/ev";
import { formatNumber, formatCurrency } from "@/utils/format";

interface ExecutiveOverviewProps {
  data: EVRecord[];
}

export const ExecutiveOverview: React.FC<ExecutiveOverviewProps> = ({ data }) => {
  const [selectedRecord, setSelectedRecord] = useState<EVRecord | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: 60, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }}>🔍</div>
        <h3 style={{ marginBottom: 8 }}>No matching vehicles found</h3>
        <p style={{ color: "var(--text-tertiary)", fontSize: "0.9rem" }}>
          Adjust your filters above to view active market data.
        </p>
      </div>
    );
  }

  const totalSales = data.reduce((a, b) => a + b.annual_sales_units, 0);

  // 1. Sales by Category
  const catMap: Record<string, { sales: number; count: number; avgRange: number; revenue: number }> = {};
  data.forEach((d) => {
    if (!catMap[d.vehicle_category]) {
      catMap[d.vehicle_category] = { sales: 0, count: 0, avgRange: 0, revenue: 0 };
    }
    catMap[d.vehicle_category].sales += d.annual_sales_units;
    catMap[d.vehicle_category].count += 1;
    catMap[d.vehicle_category].avgRange += d.driving_range_km;
    catMap[d.vehicle_category].revenue += d.annual_sales_units * d.base_price_usd;
  });

  const catColors: Record<string, { color: string; glow: string }> = {
    SUV:            { color: "#06b6d4", glow: "rgba(6,182,212,0.3)" },
    Sedan:          { color: "#8b5cf6", glow: "rgba(139,92,246,0.3)" },
    Hatchback:      { color: "#10b981", glow: "rgba(16,185,129,0.3)" },
    Truck:          { color: "#f59e0b", glow: "rgba(245,158,11,0.3)" },
    "Electric Bus": { color: "#a855f7", glow: "rgba(168,85,247,0.3)" },
    "Two-Wheeler":  { color: "#f43f5e", glow: "rgba(244,63,94,0.3)" },
  };

  const categories = Object.entries(catMap)
    .map(([cat, val]) => ({
      name: cat,
      sales: val.sales,
      share: ((val.sales / totalSales) * 100).toFixed(1),
      shareNum: (val.sales / totalSales) * 100,
      avgRange: Math.round(val.avgRange / val.count),
      revenueB: (val.revenue / 1_000_000_000).toFixed(2),
      color: catColors[cat]?.color || "#94a3b8",
      glow: catColors[cat]?.glow || "rgba(148,163,184,0.3)",
    }))
    .sort((a, b) => b.sales - a.sales);

  // 2. Top Manufacturers
  const mfgMap: Record<string, { sales: number; rating: number; count: number; models: Set<string> }> = {};
  data.forEach((d) => {
    if (!mfgMap[d.manufacturer]) {
      mfgMap[d.manufacturer] = { sales: 0, rating: 0, count: 0, models: new Set() };
    }
    mfgMap[d.manufacturer].sales += d.annual_sales_units;
    mfgMap[d.manufacturer].rating += d.customer_rating;
    mfgMap[d.manufacturer].count += 1;
    mfgMap[d.manufacturer].models.add(d.model);
  });

  const topMfgs = Object.entries(mfgMap)
    .map(([mfg, val]) => ({
      name: mfg,
      sales: val.sales,
      share: ((val.sales / totalSales) * 100).toFixed(1),
      shareNum: (val.sales / totalSales) * 100,
      rating: (val.rating / val.count).toFixed(2),
      modelsCount: val.models.size,
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 8);

  const maxMfgSales = topMfgs[0]?.sales || 1;

  // 3. Battery Tech Distribution
  const batMap: Record<string, { sales: number; avgChargeTime: number; count: number; avgEff: number }> = {};
  data.forEach((d) => {
    if (!batMap[d.battery_technology]) {
      batMap[d.battery_technology] = { sales: 0, avgChargeTime: 0, count: 0, avgEff: 0 };
    }
    batMap[d.battery_technology].sales += d.annual_sales_units;
    batMap[d.battery_technology].avgChargeTime += d.fast_charging_time_min;
    batMap[d.battery_technology].avgEff += d.battery_efficiency_km_per_kwh;
    batMap[d.battery_technology].count += 1;
  });

  const batColors: Record<string, string> = {
    "Lithium Iron Phosphate (LFP)": "#10b981",
    "Nickel Manganese Cobalt (NMC)": "#3b82f6",
    "Nickel Cobalt Aluminum (NCA)": "#f59e0b",
    "Sodium-Ion": "#06b6d4",
    "Solid-State": "#8b5cf6",
  };

  const batteryTechs = Object.entries(batMap)
    .map(([tech, val]) => ({
      name: tech,
      sales: val.sales,
      share: ((val.sales / totalSales) * 100).toFixed(1),
      shareNum: (val.sales / totalSales) * 100,
      avgChargeTime: Math.round(val.avgChargeTime / val.count),
      avgEfficiency: (val.avgEff / val.count).toFixed(2),
      color: batColors[tech] || "#94a3b8",
    }))
    .sort((a, b) => b.sales - a.sales);

  // 4. Manufacturing Country Distribution
  const ctryMap: Record<string, number> = {};
  data.forEach((d) => {
    ctryMap[d.manufacturing_country] = (ctryMap[d.manufacturing_country] || 0) + d.annual_sales_units;
  });
  const countries = Object.entries(ctryMap)
    .map(([c, s]) => ({
      country: c,
      sales: s,
      share: ((s / totalSales) * 100).toFixed(1),
      shareNum: (s / totalSales) * 100,
    }))
    .sort((a, b) => b.sales - a.sales);

  // 5. Sample for scatter visualization
  const scatterSample = data.slice(0, 60);

  const flagMap: Record<string, string> = {
    China: "🇨🇳", USA: "🇺🇸", Germany: "🇩🇪", "South Korea": "🇰🇷",
    Sweden: "🇸🇪", Mexico: "🇲🇽", India: "🇮🇳", France: "🇫🇷",
    Japan: "🇯🇵", UK: "🇬🇧",
  };

  const rankColors = ["#fbbf24", "#94a3b8", "#d97706"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }} className="animate-fade-in">

      {/* ── Row 1: Category Sales + Manufacturer Leaderboard ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))", gap: 20 }}>

        {/* Viz 1: Category Sales & Revenue */}
        <div className="glass-panel" style={{ padding: 26 }}>
          <div className="shimmer-top-cyan" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div className="section-eyebrow">
                <span className="badge badge-cyan">Visualization 1</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", marginTop: 8 }}>Annual Sales & Market Share by Category</h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginTop: 4 }}>
                Sales volume, fleet revenue, and mean driving autonomy
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.04em" }}>
                {(totalSales / 1_000_000).toFixed(2)}
                <span style={{ fontSize: "0.9rem", color: "var(--text-tertiary)", marginLeft: 4 }}>M</span>
              </div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>Total Units</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {categories.map((cat) => (
              <div key={cat.name}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, fontSize: "0.83rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: cat.color,
                      boxShadow: `0 0 8px ${cat.glow}`,
                      flexShrink: 0,
                    }} />
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{cat.name}</span>
                    <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                      {cat.avgRange} km avg
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <span style={{ color: "var(--text-tertiary)", fontSize: "0.75rem" }}>
                      ${cat.revenueB}B
                    </span>
                    <span style={{ fontWeight: 700, color: "#fff" }}>
                      {(cat.sales / 1_000_000).toFixed(2)}M
                    </span>
                    <span style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: cat.color,
                      minWidth: 36,
                      textAlign: "right",
                    }}>
                      {cat.share}%
                    </span>
                  </div>
                </div>
                <div className="progress-track-lg">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${cat.shareNum}%`,
                      background: `linear-gradient(90deg, ${cat.color}cc, ${cat.color})`,
                      boxShadow: `0 0 8px ${cat.glow}`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Viz 2: Manufacturer Leaderboard */}
        <div className="glass-panel" style={{ padding: 26 }}>
          <div className="shimmer-top-violet" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <div className="section-eyebrow">
                <span className="badge badge-violet">Visualization 2</span>
              </div>
              <h3 style={{ fontSize: "1.1rem", marginTop: 8 }}>Manufacturer Global Market Share</h3>
              <p style={{ fontSize: "0.78rem", color: "var(--text-tertiary)", marginTop: 4 }}>
                Sales ranking, global share, and customer satisfaction
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {topMfgs.map((m, idx) => {
              const widthPct = Math.round((m.sales / maxMfgSales) * 100);
              const rankColor = rankColors[idx] || "var(--text-tertiary)";
              const barGrad = idx === 0
                ? "linear-gradient(90deg, #06b6d4, #0ea5e9)"
                : idx === 1
                ? "linear-gradient(90deg, #8b5cf6, #6366f1)"
                : idx === 2
                ? "linear-gradient(90deg, #10b981, #059669)"
                : "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.12))";

              return (
                <div key={m.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {/* Rank */}
                  <span style={{
                    width: 26,
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    color: rankColor,
                    flexShrink: 0,
                    fontFamily: "var(--font-display)",
                  }}>
                    #{idx + 1}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5, fontSize: "0.82rem" }}>
                      <span style={{ fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {m.name}
                      </span>
                      <div style={{ display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--emerald-400)", fontWeight: 600 }}>
                          ★ {m.rating}
                        </span>
                        <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.8rem" }}>
                          {m.share}%
                        </span>
                      </div>
                    </div>
                    <div className="progress-track" style={{ height: 5 }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${widthPct}%`,
                          background: barGrad,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Row 2: Battery Chemistry + Geographic + Scatter ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20 }}>

        {/* Viz 3: Battery Chemistry */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div className="shimmer-top-amber" />
          <div className="section-eyebrow">
            <span className="badge badge-amber">Visualization 3</span>
          </div>
          <h3 style={{ fontSize: "1.05rem", marginTop: 8 }}>Battery Chemistry Distribution</h3>
          <p style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", marginTop: 4, marginBottom: 18 }}>
            Market share, 10-80% charge time, and energy efficiency
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {batteryTechs.map((bt) => (
              <div
                key={bt.name}
                style={{
                  padding: "12px 14px",
                  background: "rgba(255,255,255,0.025)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-lg)",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${bt.color}40`)}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: bt.color,
                      boxShadow: `0 0 6px ${bt.color}80`,
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: "0.82rem", fontWeight: 700 }}>{bt.name}</span>
                  </div>
                  <span style={{
                    fontSize: "0.9rem",
                    fontWeight: 800,
                    color: bt.color,
                    fontFamily: "var(--font-display)",
                  }}>
                    {bt.share}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="progress-track" style={{ marginBottom: 8 }}>
                  <div
                    className="progress-fill"
                    style={{
                      width: `${bt.shareNum}%`,
                      background: `linear-gradient(90deg, ${bt.color}80, ${bt.color})`,
                    }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                  <span>
                    ⚡ Charge{" "}
                    <strong style={{ color: "var(--text-secondary)" }}>{bt.avgChargeTime} min</strong>
                  </span>
                  <span>
                    🔋 {" "}
                    <strong style={{ color: "var(--text-secondary)" }}>{bt.avgEfficiency} km/kWh</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Viz 4: Manufacturing Hubs */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div className="shimmer-top-emerald" />
          <div className="section-eyebrow">
            <span className="badge badge-emerald">Visualization 4</span>
          </div>
          <h3 style={{ fontSize: "1.05rem", marginTop: 8 }}>Global Manufacturing Hubs</h3>
          <p style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", marginTop: 4, marginBottom: 18 }}>
            Geographic volume concentrations and export footprint
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {countries.map((c, i) => {
              const flag = flagMap[c.country] || "🏭";
              const isLeader = i < 2;
              return (
                <div
                  key={c.country}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    background: isLeader ? "rgba(6,182,212,0.04)" : "rgba(255,255,255,0.02)",
                    border: isLeader ? "1px solid rgba(6,182,212,0.2)" : "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-lg)",
                  }}
                >
                  <span style={{ fontSize: "1.3rem", flexShrink: 0 }}>{flag}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{c.country}</span>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                          {(c.sales / 1_000_000).toFixed(2)}M units
                        </span>
                        <span style={{
                          fontSize: "0.85rem",
                          fontWeight: 800,
                          color: isLeader ? "var(--cyan-400)" : "var(--text-secondary)",
                          fontFamily: "var(--font-display)",
                        }}>
                          {c.share}%
                        </span>
                      </div>
                    </div>
                    <div className="progress-track" style={{ height: 4 }}>
                      <div
                        className="progress-fill"
                        style={{
                          width: `${c.shareNum}%`,
                          background: isLeader
                            ? "linear-gradient(90deg, #06b6d4, #0ea5e9)"
                            : "rgba(255,255,255,0.2)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Viz 5: Price vs Satisfaction Scatter */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div className="shimmer-top" />
          <div className="section-eyebrow">
            <span className="badge badge-cyan">Visualization 5</span>
          </div>
          <h3 style={{ fontSize: "1.05rem", marginTop: 8 }}>Price vs Satisfaction Matrix</h3>
          <p style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", marginTop: 4, marginBottom: 12 }}>
            4-quadrant: Base Price (USD) × Customer Rating (1-5★)
          </p>

          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {Object.entries(catColors).map(([cat, { color }]) => (
              <div key={cat} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.68rem", color: "var(--text-tertiary)" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block" }} />
                {cat}
              </div>
            ))}
          </div>

          {/* SVG Scatter Plot */}
          <div style={{
            position: "relative",
            width: "100%",
            height: 200,
            background: "rgba(0,0,0,0.3)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}>
            {/* Grid lines */}
            <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
              {[25, 50, 75].map((pct) => (
                <React.Fragment key={pct}>
                  <line x1={`${pct}%`} y1="0" x2={`${pct}%`} y2="100%" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                  <line x1="0" y1={`${pct}%`} x2="100%" y2={`${pct}%`} stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
                </React.Fragment>
              ))}
              {/* Quadrant dividers */}
              <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4"/>
              <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4"/>
            </svg>

            {/* Quadrant labels */}
            <div style={{ position: "absolute", top: 6, left: 6, fontSize: "0.6rem", color: "var(--emerald-400)", fontWeight: 700 }}>
              VALUE
            </div>
            <div style={{ position: "absolute", top: 6, right: 6, fontSize: "0.6rem", color: "var(--violet-400)", fontWeight: 700 }}>
              LUXURY
            </div>
            <div style={{ position: "absolute", bottom: 6, left: 6, fontSize: "0.6rem", color: "var(--text-disabled)", fontWeight: 700 }}>
              BUDGET
            </div>
            <div style={{ position: "absolute", bottom: 6, right: 6, fontSize: "0.6rem", color: "var(--amber-400)", fontWeight: 700 }}>
              PREMIUM
            </div>

            {/* Scatter dots */}
            <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
              {scatterSample.map((pt, idx) => {
                const x = Math.min(95, Math.max(5, (pt.base_price_usd / 120000) * 100));
                const y = Math.min(95, Math.max(5, 100 - ((pt.customer_rating - 3.0) / 2.0) * 100));
                const color = catColors[pt.vehicle_category]?.color || "#38bdf8";
                const isSelected = selectedRecord?.vehicle_id === pt.vehicle_id;
                return (
                  <circle
                    key={idx}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r={isSelected ? 8 : 5}
                    fill={color}
                    fillOpacity={isSelected ? 1 : 0.75}
                    stroke="#fff"
                    strokeWidth={isSelected ? 2 : 0}
                    style={{ cursor: "pointer", transition: "all 0.2s" }}
                    onClick={() => setSelectedRecord(pt)}
                  >
                    <title>{`${pt.manufacturer} ${pt.model} | ${formatCurrency(pt.base_price_usd)} | ★${pt.customer_rating}`}</title>
                  </circle>
                );
              })}
            </svg>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "var(--text-disabled)", marginTop: 6 }}>
            <span>$0</span>
            <span style={{ color: "var(--text-tertiary)" }}>← Base Price →</span>
            <span>$120k+</span>
          </div>
        </div>
      </div>

      {/* ── Selected Vehicle Drawer ── */}
      {selectedRecord && (
        <div
          className="glass-panel glow-cyan animate-fade-in-up"
          style={{ padding: 24 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span className="badge badge-cyan" style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem" }}>
                {selectedRecord.vehicle_id}
              </span>
              <h3 style={{ fontSize: "1.15rem" }}>
                {selectedRecord.manufacturer} {selectedRecord.model}
              </h3>
              <span className="badge badge-ghost">{selectedRecord.release_year}</span>
              <span className="badge badge-emerald">★ {selectedRecord.customer_rating}</span>
            </div>
            <button
              onClick={() => setSelectedRecord(null)}
              className="btn btn-ghost"
              style={{ padding: "6px 10px", fontSize: "0.75rem" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Close
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
            {[
              { label: "Category & Tech", main: selectedRecord.vehicle_category, sub: selectedRecord.battery_technology, color: "var(--cyan-400)" },
              { label: "Range & Battery", main: `${selectedRecord.driving_range_km} km`, sub: `${selectedRecord.battery_capacity_kwh} kWh capacity`, color: "var(--sky-400)" },
              { label: "Base Price", main: formatCurrency(selectedRecord.base_price_usd), sub: `Value Score: ${selectedRecord.customer_value_score}`, color: "var(--violet-400)" },
              { label: "Fast Charge", main: `${selectedRecord.fast_charging_time_min} min`, sub: `${selectedRecord.energy_consumption_wh_per_km} Wh/km`, color: "var(--amber-400)" },
              { label: "Annual Sales", main: formatNumber(selectedRecord.annual_sales_units), sub: `Made in ${selectedRecord.manufacturing_country}`, color: "var(--emerald-400)" },
            ].map((spec) => (
              <div
                key={spec.label}
                style={{
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border-subtle)",
                  borderRadius: "var(--radius-lg)",
                }}
              >
                <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
                  {spec.label}
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: 2 }}>
                  {spec.main}
                </div>
                <div style={{ fontSize: "0.76rem", color: spec.color }}>
                  {spec.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Fleet Master Data Table ── */}
      <div className="glass-panel" style={{ padding: 26 }}>
        <div className="shimmer-top" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: "1.1rem" }}>
              Fleet Granular Master Table
              <span style={{
                marginLeft: 10,
                fontSize: "0.8rem",
                fontWeight: 500,
                color: "var(--text-tertiary)",
              }}>
                {data.length.toLocaleString("en-US")} vehicles
              </span>
            </h3>
            <p style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", marginTop: 4 }}>
              Database query results with calculated fields — Range/Price ratio, km/kWh, Customer Value
            </p>
          </div>
          <span className="badge badge-ghost">Top 12 preview</span>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                {["ID", "Vehicle Model", "Category", "Battery Tech", "Range (km)", "Base Price", "Annual Sales", "Rating", "km / kWh", "Value Score", "Action"].map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 12).map((item) => (
                <tr key={item.vehicle_id}>
                  <td style={{ fontFamily: "var(--font-mono)", color: "var(--cyan-400)", fontSize: "0.78rem" }}>
                    {item.vehicle_id}
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {item.manufacturer} {item.model}
                  </td>
                  <td>
                    <span className="badge badge-ghost" style={{ fontSize: "0.68rem" }}>
                      {item.vehicle_category}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>
                    {item.battery_technology.split(" ")[0]}
                  </td>
                  <td style={{ fontWeight: 700, color: "var(--sky-400)" }}>
                    {item.driving_range_km}
                  </td>
                  <td style={{ color: "var(--text-secondary)" }}>
                    {formatCurrency(item.base_price_usd)}
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {formatNumber(item.annual_sales_units)}
                  </td>
                  <td style={{ color: "var(--emerald-400)", fontWeight: 700 }}>
                    ★ {item.customer_rating}
                  </td>
                  <td style={{ color: "var(--amber-400)" }}>
                    {item.battery_efficiency_km_per_kwh}
                  </td>
                  <td style={{ color: "var(--violet-400)", fontWeight: 600 }}>
                    {item.customer_value_score}
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedRecord(item)}
                      className="btn btn-outline-cyan"
                      style={{ padding: "5px 10px", fontSize: "0.72rem" }}
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
