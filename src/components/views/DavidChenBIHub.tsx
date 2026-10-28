"use client";

import React from "react";
import { EVRecord } from "@/types/ev";
import { formatCurrency } from "@/utils/format";

interface DavidChenBIHubProps {
  data: EVRecord[];
}

export const DavidChenBIHub: React.FC<DavidChenBIHubProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const totalSales = data.reduce((a, b) => a + b.annual_sales_units, 0);

  const oemStats: Record<string, {
    sales: number; revenue: number; ratings: number[];
    efficiencies: number[]; countries: Record<string, number>;
    techs: Record<string, number>; ranges: number[];
    chargeTimes: number[]; prices: number[];
  }> = {};

  data.forEach((d) => {
    if (!oemStats[d.manufacturer]) {
      oemStats[d.manufacturer] = {
        sales: 0, revenue: 0, ratings: [], efficiencies: [],
        countries: {}, techs: {}, ranges: [], chargeTimes: [], prices: [],
      };
    }
    const o = oemStats[d.manufacturer];
    o.sales += d.annual_sales_units;
    o.revenue += d.annual_sales_units * d.base_price_usd;
    o.ratings.push(d.customer_rating);
    o.efficiencies.push(d.battery_efficiency_km_per_kwh);
    o.ranges.push(d.driving_range_km);
    o.chargeTimes.push(d.fast_charging_time_min);
    o.prices.push(d.base_price_usd);
    o.countries[d.manufacturing_country] = (o.countries[d.manufacturing_country] || 0) + d.annual_sales_units;
    o.techs[d.battery_technology] = (o.techs[d.battery_technology] || 0) + d.annual_sales_units;
  });

  const oems = Object.entries(oemStats).map(([oem, s]) => {
    const marketShare = (s.sales / totalSales) * 100;
    const avgRating = (s.ratings.reduce((a, b) => a + b, 0) / s.ratings.length).toFixed(2);
    const avgEff = (s.efficiencies.reduce((a, b) => a + b, 0) / s.efficiencies.length).toFixed(2);
    const avgRange = Math.round(s.ranges.reduce((a, b) => a + b, 0) / s.ranges.length);
    const avgCharge = Math.round(s.chargeTimes.reduce((a, b) => a + b, 0) / s.chargeTimes.length);
    const avgPrice = Math.round(s.prices.reduce((a, b) => a + b, 0) / s.prices.length);
    const topCountry = Object.entries(s.countries).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];
    const topTech = Object.entries(s.techs).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];
    return {
      oem, sales: s.sales,
      share: marketShare.toFixed(1),
      shareNum: marketShare,
      avgRating, avgEff, avgRange, avgCharge, avgPrice,
      primaryCountry: topCountry[0],
      topBatteryTech: topTech[0].split(" ")[0],
    };
  }).sort((a, b) => b.sales - a.sales);

  const hhi = Math.round(oems.reduce((acc, curr) => acc + (curr.shareNum * curr.shareNum), 0));
  const marketType = hhi < 1500 ? "Competitive" : hhi < 2500 ? "Moderately Concentrated" : "Highly Concentrated";
  const hhiColor = hhi < 1500 ? "var(--emerald-400)" : hhi < 2500 ? "var(--amber-400)" : "var(--rose-400)";

  const top4 = oems.slice(0, 4);

  const top4Colors = [
    { border: "rgba(6,182,212,0.3)", accent: "var(--cyan-400)", grad: "linear-gradient(135deg,#06b6d4,#0ea5e9)" },
    { border: "rgba(16,185,129,0.3)", accent: "var(--emerald-400)", grad: "linear-gradient(135deg,#10b981,#059669)" },
    { border: "rgba(139,92,246,0.3)", accent: "var(--violet-400)", grad: "linear-gradient(135deg,#8b5cf6,#6366f1)" },
    { border: "rgba(245,158,11,0.3)", accent: "var(--amber-400)", grad: "linear-gradient(135deg,#f59e0b,#d97706)" },
  ];

  const advisories = [
    {
      title: "Scale Manufacturing in Low-Cost Clusters",
      body: "China and North American Gigafactories capture 65% of global output due to localized supply chains for cathode and anode materials.",
      cardClass: "insight-card-violet",
      num: "01",
    },
    {
      title: "Differentiate via Charging Infrastructure",
      body: "Sub-20 minute charging capability directly correlates with customer satisfaction premiums of +0.3★ and higher price tolerance.",
      cardClass: "insight-card-cyan",
      num: "02",
    },
    {
      title: "Dual-Chemistry Platform Strategy",
      body: "Leading OEMs deploy LFP for entry/fleet trims and High-Nickel NMC / Solid-State for premium trims — maximizing both volume and margin.",
      cardClass: "insight-card-emerald",
      num: "03",
    },
  ];

  const rankColors = ["#fbbf24", "#94a3b8", "#d97706"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }} className="animate-fade-in">

      {/* ── Persona Header ── */}
      <div className="glass-panel glow-violet" style={{ padding: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            <div className="persona-avatar" style={{ background: "linear-gradient(135deg, #8b5cf6, #6366f1)" }}>
              💼
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                <h2 style={{ fontSize: "1.5rem" }}>David Chen</h2>
                <span className="badge badge-violet">Automotive BI Manager</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-tertiary)", maxWidth: 820, lineHeight: 1.65 }}>
                Competitive benchmarking hub monitoring OEM market share dynamics, HHI market concentration,
                geographical production footprints, and technological moats to guide market entry consulting.
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                <span className="badge badge-ghost">OEM Analysis</span>
                <span className="badge badge-ghost">HHI Concentration</span>
                <span className="badge badge-ghost">Tech Moats</span>
                <span className="badge badge-ghost">Market Entry</span>
              </div>
            </div>
          </div>

          {/* HHI metric */}
          <div style={{
            padding: "16px 22px",
            background: "rgba(139,92,246,0.06)",
            border: "1px solid rgba(139,92,246,0.2)",
            borderRadius: "var(--radius-lg)",
            textAlign: "right",
          }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              HHI Market Concentration
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: hhiColor, marginTop: 4, fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}>
              {hhi.toLocaleString("en-US")}
            </div>
            <div style={{ fontSize: "0.72rem", color: hhiColor, opacity: 0.8, marginTop: 2 }}>
              {marketType}
            </div>
          </div>
        </div>
      </div>

      {/* ── OEM Competitive Benchmark Table ── */}
      <div className="glass-panel" style={{ padding: 26 }}>
        <div className="shimmer-top-violet" />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div className="section-eyebrow">
              <span className="badge badge-violet">OEM Intelligence Matrix</span>
            </div>
            <h3 style={{ fontSize: "1.1rem", marginTop: 8 }}>Manufacturer Performance & Positioning</h3>
            <p style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", marginTop: 4 }}>
              Holistic benchmark: sales, share, satisfaction, tech, range, and charging speed
            </p>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                {["Rank & OEM", "Global Sales", "Market Share", "Rating", "Primary Hub", "Dominant Tech", "Avg Range", "Charge (10-80%)", "Efficiency"].map((col) => (
                  <th key={col}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {oems.map((o, index) => {
                const rankColor = rankColors[index] || "var(--text-tertiary)";
                return (
                  <tr key={o.oem}>
                    <td>
                      <span style={{
                        fontWeight: 800,
                        color: index < 3 ? rankColor : "var(--text-tertiary)",
                        fontFamily: "var(--font-display)",
                        fontSize: "0.8rem",
                        marginRight: 6,
                      }}>
                        #{index + 1}
                      </span>
                      <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{o.oem}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                      {(o.sales / 1_000_000).toFixed(2)}M
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontWeight: 700, color: "var(--cyan-400)" }}>{o.share}%</span>
                        <div style={{ width: 50, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                          <div style={{
                            width: `${Math.min(100, o.shareNum * 3.5)}%`,
                            height: "100%",
                            background: "linear-gradient(90deg, #06b6d4, #0ea5e9)",
                            borderRadius: 2,
                          }} />
                        </div>
                      </div>
                    </td>
                    <td style={{ color: "var(--emerald-400)", fontWeight: 700 }}>★ {o.avgRating}</td>
                    <td>
                      <span className="badge badge-ghost" style={{ fontSize: "0.68rem" }}>
                        {o.primaryCountry}
                      </span>
                    </td>
                    <td style={{ color: "var(--amber-400)", fontWeight: 600 }}>{o.topBatteryTech}</td>
                    <td style={{ fontWeight: 600, color: "var(--sky-400)" }}>{o.avgRange} km</td>
                    <td style={{ color: "var(--text-secondary)" }}>{o.avgCharge} min</td>
                    <td style={{ color: "var(--violet-400)", fontWeight: 600 }}>{o.avgEff} km/kWh</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom Grid: Top 4 Cards + Advisory ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 20 }}>

        {/* Top 4 OEM Capability Cards */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div className="shimmer-top-violet" />
          <h3 style={{ fontSize: "1.05rem", marginBottom: 6 }}>Top 4 OEM Capability Benchmark</h3>
          <p style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", marginBottom: 18 }}>
            Multi-attribute comparison: Range, Rating, Value, Charging, Volume
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {top4.map((o, idx) => {
              const cm = top4Colors[idx];
              return (
                <div
                  key={o.oem}
                  style={{
                    padding: "16px",
                    background: "rgba(255,255,255,0.025)",
                    border: `1px solid ${cm.border}`,
                    borderRadius: "var(--radius-lg)",
                    transition: "transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                >
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontWeight: 800, fontSize: "0.9rem", color: cm.accent }}>
                      {o.oem}
                    </span>
                    <span className="badge badge-ghost" style={{ fontSize: "0.65rem" }}>
                      {o.share}%
                    </span>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {[
                      { label: "Mean Range", value: `${o.avgRange} km`, color: "var(--sky-400)" },
                      { label: "Fast Charge", value: `${o.avgCharge} min`, color: "var(--emerald-400)" },
                      { label: "Rating", value: `★ ${o.avgRating}`, color: "var(--amber-400)" },
                      { label: "Avg Price", value: formatCurrency(o.avgPrice), color: "var(--text-primary)" },
                    ].map((stat) => (
                      <div key={stat.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.76rem" }}>
                        <span style={{ color: "var(--text-tertiary)" }}>{stat.label}</span>
                        <strong style={{ color: stat.color }}>{stat.value}</strong>
                      </div>
                    ))}
                  </div>

                  {/* Mini bar */}
                  <div style={{ marginTop: 12 }}>
                    <div className="progress-track" style={{ height: 3 }}>
                      <div className="progress-fill" style={{ width: `${o.shareNum * 4}%`, background: cm.grad }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consulting Advisory */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div className="shimmer-top-cyan" />
          <h3 style={{ fontSize: "1.05rem", marginBottom: 6 }}>Consulting Client Advisory</h3>
          <p style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", marginBottom: 18 }}>
            Strategic positioning for automotive clients entering or scaling EV market share
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {advisories.map((adv) => (
              <div key={adv.num} className={`insight-card ${adv.cardClass}`}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span style={{
                    fontSize: "0.65rem",
                    fontWeight: 800,
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-mono)",
                    paddingTop: 2,
                    flexShrink: 0,
                  }}>
                    {adv.num}
                  </span>
                  <div>
                    <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)", display: "block", marginBottom: 6, lineHeight: 1.4 }}>
                      {adv.title}
                    </strong>
                    <p style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", lineHeight: 1.6 }}>
                      {adv.body}
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
