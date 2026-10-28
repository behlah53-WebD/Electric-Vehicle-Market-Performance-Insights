"use client";

import React from "react";
import { EVRecord } from "@/types/ev";

interface KpiMetricsRowProps {
  data: EVRecord[];
}

export const KpiMetricsRow: React.FC<KpiMetricsRowProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const totalSalesUnits = data.reduce((acc, curr) => acc + curr.annual_sales_units, 0);
  const avgRange = Math.round(data.reduce((acc, curr) => acc + curr.driving_range_km, 0) / data.length);
  const avgRating = (data.reduce((acc, curr) => acc + curr.customer_rating, 0) / data.length).toFixed(2);
  const totalCo2SavedTons = Math.round(data.reduce((acc, curr) => acc + curr.total_co2_abatement_tons, 0));

  // Top manufacturer
  const mfgCounts: Record<string, number> = {};
  data.forEach((d) => {
    mfgCounts[d.manufacturer] = (mfgCounts[d.manufacturer] || 0) + d.annual_sales_units;
  });
  const topMfg = Object.entries(mfgCounts).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];
  const topMfgShare = totalSalesUnits > 0 ? ((topMfg[1] / totalSalesUnits) * 100).toFixed(1) : "0";

  // Top battery technology
  const batCounts: Record<string, number> = {};
  data.forEach((d) => {
    batCounts[d.battery_technology] = (batCounts[d.battery_technology] || 0) + d.annual_sales_units;
  });
  const topBat = Object.entries(batCounts).sort((a, b) => b[1] - a[1])[0] || ["N/A", 0];
  const topBatShare = totalSalesUnits > 0 ? ((topBat[1] / totalSalesUnits) * 100).toFixed(1) : "0";

  const cards = [
    {
      id: "kpi-total-sales",
      title: "Total Annual Sales",
      value: `${(totalSalesUnits / 1_000_000).toFixed(2)}`,
      suffix: "M",
      unit: "Units Delivered",
      badge: "+24.8% YoY",
      badgeClass: "badge-emerald",
      gradient: "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)",
      glow: "rgba(6, 182, 212, 0.2)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      ),
      trend: "+24.8%",
      trendUp: true,
    },
    {
      id: "kpi-avg-range",
      title: "Avg Driving Range",
      value: `${avgRange}`,
      suffix: "",
      unit: "Kilometers (WLTP)",
      badge: "+38 km vs '23",
      badgeClass: "badge-sky",
      gradient: "linear-gradient(135deg, #38bdf8 0%, #0ea5e9 100%)",
      glow: "rgba(56, 189, 248, 0.2)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="6" width="16" height="12" rx="2"/>
          <path d="M23 13v-2a1 1 0 0 0-1-1h-1v4h1a1 1 0 0 0 1-1z"/>
          <line x1="7" y1="11" x2="7" y2="13"/>
          <line x1="11" y1="11" x2="11" y2="13"/>
        </svg>
      ),
      trend: "+38 km",
      trendUp: true,
    },
    {
      id: "kpi-market-leader",
      title: "Market Leader",
      value: topMfg[0].split(" ")[0],
      suffix: "",
      unit: `${topMfgShare}% Global Market Share`,
      badge: "Dominant OEM",
      badgeClass: "badge-violet",
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
      glow: "rgba(139, 92, 246, 0.2)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      trend: `#1 of ${Object.keys(mfgCounts).length}`,
      trendUp: true,
    },
    {
      id: "kpi-dominant-battery",
      title: "Dominant Battery",
      value: topBat[0].split(" ")[0] || "LFP",
      suffix: "",
      unit: `${topBatShare}% Share · ${topBat[0]}`,
      badge: "Chemistry Shift",
      badgeClass: "badge-amber",
      gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
      glow: "rgba(245, 158, 11, 0.2)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
        </svg>
      ),
      trend: `${topBatShare}% share`,
      trendUp: true,
    },
    {
      id: "kpi-satisfaction",
      title: "Customer Satisfaction",
      value: `${avgRating}`,
      suffix: "★",
      unit: "Average Rating (out of 5.0)",
      badge: "92% Positive",
      badgeClass: "badge-emerald",
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      glow: "rgba(16, 185, 129, 0.2)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
      trend: "92% positive",
      trendUp: true,
    },
    {
      id: "kpi-co2-abated",
      title: "Fleet CO₂ Abated",
      value: `${(totalCo2SavedTons / 1_000_000).toFixed(2)}`,
      suffix: "M",
      unit: "Metric Tons / Year",
      badge: "Net-Zero Impact",
      badgeClass: "badge-cyan",
      gradient: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
      glow: "rgba(52, 211, 153, 0.2)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      trend: "vs ICE baseline",
      trendUp: true,
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        marginBottom: 24,
      }}
    >
      {cards.map((c, i) => (
        <div
          key={c.id}
          id={c.id}
          className="glass-panel interactive animate-fade-in-up"
          style={{
            padding: "20px 22px",
            animationDelay: `${i * 0.06}s`,
          }}
        >
          {/* Top shimmer colored to card accent */}
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: 2,
            background: c.gradient,
          }} />

          {/* Header row */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
          }}>
            <span style={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
            }}>
              {c.title}
            </span>

            {/* Icon box */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "var(--radius-md)",
              background: c.gradient,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "rgba(255,255,255,0.9)",
              boxShadow: `0 4px 12px ${c.glow}`,
              flexShrink: 0,
            }}>
              {c.icon}
            </div>
          </div>

          {/* Value */}
          <div style={{
            display: "flex",
            alignItems: "baseline",
            gap: 4,
            marginBottom: 4,
          }}>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: "2.1rem",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#fff",
              lineHeight: 1,
            }}>
              {c.value}
            </span>
            {c.suffix && (
              <span style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text-secondary)",
              }}>
                {c.suffix}
              </span>
            )}
          </div>

          {/* Unit */}
          <div style={{
            fontSize: "0.78rem",
            color: "var(--text-tertiary)",
            marginBottom: 16,
          }}>
            {c.unit}
          </div>

          {/* Footer */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 12,
            borderTop: "1px solid var(--border-subtle)",
          }}>
            <span className={`badge ${c.badgeClass}`} style={{ fontSize: "0.66rem" }}>
              {c.badge}
            </span>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: "0.72rem",
              color: "var(--emerald-400)",
              fontWeight: 600,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              {c.trend}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
