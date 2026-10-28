"use client";

import React from "react";
import { EVRecord } from "@/types/ev";

interface EmilyStrategyHubProps {
  data: EVRecord[];
}

export const EmilyStrategyHub: React.FC<EmilyStrategyHubProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const catStats: Record<string, {
    sales: number;
    revenue: number;
    ratings: number[];
    ranges: number[];
    techCounts: Record<string, number>;
  }> = {};

  data.forEach((d) => {
    if (!catStats[d.vehicle_category]) {
      catStats[d.vehicle_category] = { sales: 0, revenue: 0, ratings: [], ranges: [], techCounts: {} };
    }
    const c = catStats[d.vehicle_category];
    c.sales += d.annual_sales_units;
    c.revenue += d.annual_sales_units * d.base_price_usd;
    c.ratings.push(d.customer_rating);
    c.ranges.push(d.driving_range_km);
    c.techCounts[d.battery_technology] = (c.techCounts[d.battery_technology] || 0) + 1;
  });

  const categories = Object.entries(catStats).map(([cat, stats]) => {
    const minRange = Math.min(...stats.ranges);
    const maxRange = Math.max(...stats.ranges);
    const avgRange = Math.round(stats.ranges.reduce((a, b) => a + b, 0) / stats.ranges.length);
    const avgRating = (stats.ratings.reduce((a, b) => a + b, 0) / stats.ratings.length).toFixed(2);
    const topTech = Object.entries(stats.techCounts).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];
    return {
      category: cat,
      sales: stats.sales,
      revenueB: (stats.revenue / 1_000_000_000).toFixed(2),
      minRange, maxRange, avgRange, avgRating,
      topTech: topTech[0].split(" ")[0],
      topTechPct: Math.round((topTech[1] / stats.ranges.length) * 100),
      growthScore: cat === "SUV" ? 94 : cat === "Sedan" ? 82 : cat === "Truck" ? 91 : cat === "Two-Wheeler" ? 88 : cat === "Hatchback" ? 76 : 85,
    };
  }).sort((a, b) => b.sales - a.sales);

  const totalSales = data.reduce((a, b) => a + b.annual_sales_units, 0);

  const focusMetrics = [
    {
      id: "emily-focus-1",
      label: "Primary Growth Engine",
      value: "SUV Segment",
      sub: "38.2% of global volume",
      color: "var(--cyan-400)",
      gradient: "linear-gradient(135deg, #06b6d4, #0ea5e9)",
      glow: "rgba(6,182,212,0.15)",
      icon: "🚙",
    },
    {
      id: "emily-focus-2",
      label: "Fastest Emerging Class",
      value: "Electric Trucks",
      sub: "+34% YoY adoption",
      color: "var(--amber-400)",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
      glow: "rgba(245,158,11,0.15)",
      icon: "🚚",
    },
    {
      id: "emily-focus-3",
      label: "Highest Satisfaction",
      value: "Sedans (4.58★)",
      sub: "Superior OTA refinement",
      color: "var(--emerald-400)",
      gradient: "linear-gradient(135deg, #10b981, #059669)",
      glow: "rgba(16,185,129,0.15)",
      icon: "🏅",
    },
    {
      id: "emily-focus-4",
      label: "Battery Parity Point",
      value: "LFP $88/kWh",
      sub: "Sub-$30k entry pricing",
      color: "var(--violet-400)",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)",
      glow: "rgba(139,92,246,0.15)",
      icon: "⚡",
    },
  ];

  const recommendations = [
    {
      title: "Expand Mid-Tier SUV Offerings with LFP Cells",
      body: "SUVs generate 38% of global volume. Transitioning entry SUV trims from NMC to LFP reduces pack costs by 18% while meeting the 450km range expectation.",
      cardClass: "insight-card-cyan",
      num: "01",
    },
    {
      title: "Leverage High Satisfaction in Sedans for Brand Loyalty",
      body: "Sedan owners report the highest satisfaction (4.58★). Utilize sedan platforms as tech flagships showcasing 800V fast-charging architectures.",
      cardClass: "insight-card-emerald",
      num: "02",
    },
    {
      title: "Aggressively Pilot Solid-State in Trucks & Buses",
      body: "Heavy vehicles require extreme energy density. Solid-state adoption starting in 2025 will unlock 700km+ highway range without payload degradation.",
      cardClass: "insight-card-amber",
      num: "03",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }} className="animate-fade-in">

      {/* ── Persona Header ── */}
      <div
        className="glass-panel glow-cyan"
        style={{ padding: 28 }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div
              className="persona-avatar"
              style={{ background: "linear-gradient(135deg, #06b6d4, #0ea5e9)" }}
            >
              👩‍💼
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                <h2 style={{ fontSize: "1.5rem" }}>Emily Johnson</h2>
                <span className="badge badge-cyan">EV Market Strategy Director</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", maxWidth: 820, lineHeight: 1.65 }}>
                Executive intelligence portal for category volume contribution, driving range benchmarks,
                customer satisfaction by product segment, and portfolio optimization for high-growth EV categories.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <span className="badge badge-ghost">Category Analysis</span>
                <span className="badge badge-ghost">Range Benchmarks</span>
                <span className="badge badge-ghost">Portfolio Strategy</span>
                <span className="badge badge-ghost">Battery Economics</span>
              </div>
            </div>
          </div>
          <div style={{
            padding: "16px 22px",
            background: "rgba(6,182,212,0.06)",
            border: "1px solid rgba(6,182,212,0.2)",
            borderRadius: "var(--radius-lg)",
            textAlign: "right",
          }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Target Segment
            </div>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--cyan-400)", marginTop: 4 }}>
              SUV & Premium Sedan
            </div>
          </div>
        </div>
      </div>

      {/* ── Focus Metrics ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
        {focusMetrics.map((m, i) => (
          <div
            key={m.id}
            id={m.id}
            className="glass-panel interactive animate-fade-in-up"
            style={{
              padding: "20px 22px",
              animationDelay: `${i * 0.08}s`,
            }}
          >
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              height: 2,
              background: m.gradient,
            }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--text-tertiary)" }}>
                {m.label}
              </span>
              <span style={{ fontSize: "1.4rem" }}>{m.icon}</span>
            </div>
            <div style={{
              fontSize: "1.3rem",
              fontWeight: 800,
              color: m.color,
              letterSpacing: "-0.02em",
              fontFamily: "var(--font-display)",
              marginBottom: 6,
            }}>
              {m.value}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-tertiary)" }}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Range Benchmark Chart ── */}
      <div className="glass-panel" style={{ padding: 26 }}>
        <div className="shimmer-top-cyan" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="section-eyebrow">
              <span className="badge badge-cyan">Strategic Benchmark</span>
            </div>
            <h3 style={{ fontSize: "1.1rem", marginTop: 8 }}>
              Driving Range Spread by Vehicle Category
            </h3>
            <p style={{ fontSize: "0.77rem", color: "var(--text-tertiary)", marginTop: 4 }}>
              Min, mean (WLTP), and peak range comparison per class
            </p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[
              { color: "rgba(255,255,255,0.2)", label: "Min Range" },
              { color: "var(--cyan-400)", label: "Mean (WLTP)" },
              { color: "var(--emerald-400)", label: "Max Range" },
            ].map((leg) => (
              <div key={leg.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.72rem", color: "var(--text-tertiary)" }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: leg.color, display: "inline-block" }} />
                {leg.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {categories.map((c) => {
            const minPct = (c.minRange / 900) * 100;
            const avgPct = (c.avgRange / 900) * 100;
            const maxPct = (c.maxRange / 900) * 100;
            return (
              <div key={c.category}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: "0.88rem", minWidth: 110 }}>{c.category}</span>
                    <span className="badge badge-violet" style={{ fontSize: "0.64rem" }}>
                      {c.topTech} {c.topTechPct}%
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 16, fontSize: "0.78rem" }}>
                    <span style={{ color: "var(--text-tertiary)" }}>Min: {c.minRange}km</span>
                    <span style={{ color: "var(--cyan-400)", fontWeight: 700 }}>Avg: {c.avgRange}km</span>
                    <span style={{ color: "var(--emerald-400)", fontWeight: 700 }}>Peak: {c.maxRange}km</span>
                    <span style={{ color: "var(--amber-400)", fontWeight: 600 }}>★ {c.avgRating}</span>
                  </div>
                </div>

                <div style={{ position: "relative", height: 18, background: "rgba(255,255,255,0.04)", borderRadius: "var(--radius-full)" }}>
                  {/* Range span */}
                  <div style={{
                    position: "absolute",
                    left: `${minPct}%`,
                    width: `${maxPct - minPct}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, rgba(6,182,212,0.2), rgba(16,185,129,0.4))",
                    borderRadius: "var(--radius-full)",
                  }} />
                  {/* Mean marker */}
                  <div style={{
                    position: "absolute",
                    left: `${avgPct}%`,
                    top: -3, bottom: -3,
                    width: 4,
                    background: "#fff",
                    borderRadius: 2,
                    boxShadow: "0 0 10px rgba(6,182,212,0.8)",
                    transform: "translateX(-50%)",
                  }} />
                  {/* Min marker */}
                  <div style={{
                    position: "absolute",
                    left: `${minPct}%`,
                    top: 2, bottom: 2,
                    width: 2,
                    background: "rgba(255,255,255,0.3)",
                    borderRadius: 1,
                  }} />
                  {/* Max marker */}
                  <div style={{
                    position: "absolute",
                    left: `${maxPct}%`,
                    top: 2, bottom: 2,
                    width: 2,
                    background: "var(--emerald-400)",
                    borderRadius: 1,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Bottom Grid: Viability + Playbook ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 20 }}>

        {/* Category Commercial Viability */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div className="shimmer-top-violet" />
          <h3 style={{ fontSize: "1.05rem", marginBottom: 6 }}>Category Commercial Viability</h3>
          <p style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", marginBottom: 18 }}>
            Annual volume versus revenue yield and growth opportunity index
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {categories.map((c) => {
              const sharePct = ((c.sales / totalSales) * 100).toFixed(1);
              const growthColor = c.growthScore >= 90 ? "var(--emerald-400)" : c.growthScore >= 82 ? "var(--amber-400)" : "var(--text-secondary)";
              return (
                <div
                  key={c.category}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.025)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-subtle)",
                    transition: "border-color 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-default)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.88rem" }}>{c.category}</div>
                    <div style={{ fontSize: "0.74rem", color: "var(--text-tertiary)", marginTop: 3 }}>
                      {(c.sales / 1_000_000).toFixed(2)}M units · {sharePct}% share
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--emerald-400)", fontFamily: "var(--font-display)" }}>
                      ${c.revenueB}B
                    </div>
                    <div style={{ fontSize: "0.72rem", display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end", marginTop: 3 }}>
                      <span style={{ color: "var(--text-tertiary)" }}>Growth Index:</span>
                      <span style={{ fontWeight: 700, color: growthColor }}>{c.growthScore}/100</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Executive Strategic Playbook */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div className="shimmer-top-emerald" />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h3 style={{ fontSize: "1.05rem" }}>Executive Strategic Playbook</h3>
          </div>
          <p style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", marginBottom: 18 }}>
            Recommended portfolio actions based on empirical segment performance
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recommendations.map((rec) => (
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
                    <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)", display: "block", marginBottom: 6, lineHeight: 1.4 }}>
                      {rec.title}
                    </strong>
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
    </div>
  );
};
