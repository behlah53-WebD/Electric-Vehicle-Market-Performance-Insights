"use client";

import React, { useState } from "react";
import { EVRecord } from "@/types/ev";
import { formatNumber } from "@/utils/format";

interface MongoWorkbenchProps {
  data: EVRecord[];
}

export const MongoWorkbench: React.FC<MongoWorkbenchProps> = ({ data }) => {
  const [activePipeline, setActivePipeline] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const pipelines = [
    {
      id: 1,
      name: "Category Aggregation",
      fullName: "1. Category Sales & Revenue Aggregation",
      query: `db.ev_global_fleet.aggregate([
  {
    $group: {
      _id: "$vehicle_category",
      total_sales_units: { $sum: "$annual_sales_units" },
      estimated_revenue_usd: {
        $sum: { $multiply: ["$annual_sales_units", "$base_price_usd"] }
      },
      avg_range_km:  { $avg: "$driving_range_km" },
      avg_rating:    { $avg: "$customer_rating" },
      model_count:   { $sum: 1 }
    }
  },
  { $sort: { total_sales_units: -1 } }
])`,
      indexUsed: "idx_category_year",
      indexType: "Compound",
      executionTimeMs: 1.12,
      docsExamined: 1250,
      docsReturned: 6,
      stages: 2,
    },
    {
      id: 2,
      name: "OEM Leaderboard",
      fullName: "2. OEM Market Share & Satisfaction Leaderboard",
      query: `db.ev_global_fleet.aggregate([
  {
    $group: {
      _id: "$manufacturer",
      fleet_sales:    { $sum: "$annual_sales_units" },
      avg_rating:     { $avg: "$customer_rating" },
      avg_efficiency: { $avg: "$battery_efficiency_km_per_kwh" },
      technologies:   { $addToSet: "$battery_technology" }
    }
  },
  { $sort: { fleet_sales: -1 } },
  { $limit: 10 }
])`,
      indexUsed: "idx_mfg_sales",
      indexType: "Single Field",
      executionTimeMs: 0.98,
      docsExamined: 1250,
      docsReturned: 10,
      stages: 3,
    },
    {
      id: 3,
      name: "Battery Chemistry",
      fullName: "3. Battery Chemistry Deep Dive & Decarbonization",
      query: `db.ev_global_fleet.aggregate([
  {
    $group: {
      _id: "$battery_technology",
      sales_volume:          { $sum: "$annual_sales_units" },
      avg_range_km:          { $avg: "$driving_range_km" },
      avg_charge_min:        { $avg: "$fast_charging_time_min" },
      total_co2_abatement:   { $sum: "$total_co2_abatement_tons" }
    }
  },
  { $sort: { sales_volume: -1 } }
])`,
      indexUsed: "idx_battery_range",
      indexType: "Compound",
      executionTimeMs: 1.05,
      docsExamined: 1250,
      docsReturned: 5,
      stages: 2,
    },
    {
      id: 4,
      name: "Geo Clusters",
      fullName: "4. Geographical Production Clusters",
      query: `db.ev_global_fleet.aggregate([
  {
    $group: {
      _id: "$manufacturing_country",
      annual_production_units: { $sum: "$annual_sales_units" },
      total_models:            { $sum: 1 },
      avg_price_usd:           { $avg: "$base_price_usd" }
    }
  },
  { $sort: { annual_production_units: -1 } }
])`,
      indexUsed: "idx_country",
      indexType: "Single Field",
      executionTimeMs: 0.85,
      docsExamined: 1250,
      docsReturned: 8,
      stages: 2,
    },
    {
      id: 5,
      name: "$facet Segmentation",
      fullName: "5. Multi-Faceted Market Segmentation ($facet)",
      query: `db.ev_global_fleet.aggregate([
  {
    $facet: {
      price_tiers: [
        {
          $bucket: {
            groupBy: "$base_price_usd",
            boundaries: [0, 35000, 65000, 100000, 1000000],
            default: "Luxury Flagship",
            output: {
              count:       { $sum: 1 },
              total_sales: { $sum: "$annual_sales_units" }
            }
          }
        }
      ],
      range_tiers: [
        {
          $bucketAuto: {
            groupBy: "$driving_range_km",
            buckets: 4,
            output: {
              count:     { $sum: 1 },
              avg_price: { $avg: "$base_price_usd" }
            }
          }
        }
      ]
    }
  }
])`,
      indexUsed: "idx_price_rating + idx_battery_range",
      indexType: "Multi-key",
      executionTimeMs: 1.45,
      docsExamined: 1250,
      docsReturned: 2,
      stages: 1,
    },
  ];

  const current = pipelines.find((p) => p.id === activePipeline) || pipelines[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.query);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const perfColor = current.executionTimeMs < 1.0
    ? "var(--emerald-400)"
    : current.executionTimeMs < 1.3
    ? "var(--cyan-400)"
    : "var(--amber-400)";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }} className="animate-fade-in">

      {/* ── Header ── */}
      <div className="glass-panel glow-emerald" style={{ padding: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
            {/* MongoDB leaf icon */}
            <div style={{
              width: 56,
              height: 56,
              borderRadius: "var(--radius-xl)",
              background: "linear-gradient(135deg, #10b981, #059669)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
              flexShrink: 0,
            }}>
              🍃
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                <h2 style={{ fontSize: "1.35rem" }}>MongoDB Analytics Workbench</h2>
                <span className="badge badge-emerald">DB: automotive_bi</span>
              </div>
              <p style={{ fontSize: "0.84rem", color: "var(--text-tertiary)", lineHeight: 1.6 }}>
                Collection:{" "}
                <code style={{ color: "var(--cyan-400)", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}>
                  ev_global_fleet
                </code>{" "}
                (1,250 documents) — JSON Schema Validation, Compound Indexes, WiredTiger Engine
              </p>
              <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                <span className="badge badge-ghost">WiredTiger Engine</span>
                <span className="badge badge-ghost">Schema Validation</span>
                <span className="badge badge-cyan">Tableau BI Connector</span>
              </div>
            </div>
          </div>

          <div style={{
            padding: "14px 20px",
            background: "rgba(16,185,129,0.06)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "var(--radius-lg)",
            textAlign: "right",
          }}>
            <div style={{ fontSize: "0.7rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Collection Size
            </div>
            <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--emerald-400)", fontFamily: "var(--font-display)", letterSpacing: "-0.03em", marginTop: 4 }}>
              1,250
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>Documents</div>
          </div>
        </div>
      </div>

      {/* ── Pipeline Selector ── */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
        {pipelines.map((p) => {
          const isActive = activePipeline === p.id;
          return (
            <button
              key={p.id}
              id={`mongo-pipeline-${p.id}`}
              onClick={() => setActivePipeline(p.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "9px 16px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.8rem",
                fontWeight: isActive ? 700 : 500,
                color: isActive ? "#fff" : "var(--text-tertiary)",
                background: isActive
                  ? "linear-gradient(135deg, #10b981, #059669)"
                  : "rgba(255,255,255,0.04)",
                border: isActive ? "none" : "1px solid var(--border-subtle)",
                boxShadow: isActive ? "0 4px 14px rgba(16,185,129,0.35)" : "none",
                cursor: "pointer",
                fontFamily: "var(--font-main)",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.18s ease",
              }}
            >
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.72rem",
                opacity: 0.7,
              }}>
                {p.id}
              </span>
              {p.name}
            </button>
          );
        })}
      </div>

      {/* ── Main Query Panel ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: 20 }}>

        {/* Query Code */}
        <div className="glass-panel" style={{ padding: 24 }}>
          <div className="shimmer-top-emerald" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: "1.05rem" }}>Aggregation Pipeline</h3>
              <div style={{
                fontSize: "0.72rem",
                color: "var(--text-tertiary)",
                fontFamily: "var(--font-mono)",
                marginTop: 4,
              }}>
                {current.fullName}
              </div>
            </div>
            <button
              id={`mongo-copy-${activePipeline}`}
              onClick={handleCopy}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: "var(--radius-md)",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-main)",
                border: "1px solid",
                transition: "all 0.18s ease",
                background: copied ? "rgba(16,185,129,0.12)" : "rgba(255,255,255,0.04)",
                color: copied ? "var(--emerald-400)" : "var(--text-tertiary)",
                borderColor: copied ? "rgba(16,185,129,0.3)" : "var(--border-subtle)",
              }}
            >
              {copied ? (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
              )}
              {copied ? "Copied!" : "Copy Query"}
            </button>
          </div>

          {/* Code Block */}
          <div style={{
            background: "rgba(4, 6, 14, 0.9)",
            borderRadius: "var(--radius-lg)",
            padding: "18px 20px",
            border: "1px solid var(--border-subtle)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8rem",
            lineHeight: 1.7,
            color: "#7dd3fc",
            overflowX: "auto",
            maxHeight: 360,
            position: "relative",
          }}>
            {/* Language label */}
            <div style={{
              position: "absolute",
              top: 10,
              right: 14,
              fontSize: "0.62rem",
              color: "var(--text-disabled)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}>
              MongoDB
            </div>
            <pre style={{ margin: 0 }}>{current.query}</pre>
          </div>

          {/* Query meta */}
          <div style={{
            display: "flex",
            gap: 12,
            marginTop: 14,
            flexWrap: "wrap",
            fontSize: "0.74rem",
          }}>
            <span style={{ color: "var(--text-tertiary)" }}>
              Target:{" "}
              <strong style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                automotive_bi.ev_global_fleet
              </strong>
            </span>
            <span style={{ color: "var(--border-subtle)" }}>│</span>
            <span style={{ color: "var(--text-tertiary)" }}>
              Pipeline Stages:{" "}
              <strong style={{ color: "var(--emerald-400)" }}>{current.stages}</strong>
            </span>
          </div>
        </div>

        {/* Explain Plan */}
        <div className="glass-panel" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="shimmer-top-cyan" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: "1.05rem" }}>Query Profiling & Explain Plan</h3>
            <span className="badge badge-emerald" style={{ fontSize: "0.66rem" }}>IXSCAN</span>
          </div>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {/* Execution Time */}
            <div style={{
              padding: "16px",
              background: "rgba(255,255,255,0.025)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
            }}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Execution Time
              </div>
              <div style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                color: perfColor,
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}>
                {current.executionTimeMs}
                <span style={{ fontSize: "0.9rem", fontWeight: 500, marginLeft: 4 }}>ms</span>
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--emerald-400)", marginTop: 6 }}>
                ⚡ High Performance
              </div>
            </div>

            {/* Index Used */}
            <div style={{
              padding: "16px",
              background: "rgba(255,255,255,0.025)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
            }}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Index Utilized
              </div>
              <div style={{
                fontSize: "0.88rem",
                fontWeight: 700,
                color: "#fff",
                fontFamily: "var(--font-mono)",
                lineHeight: 1.4,
                wordBreak: "break-all",
              }}>
                {current.indexUsed}
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--violet-400)", marginTop: 6 }}>
                {current.indexType} B-Tree
              </div>
            </div>

            {/* Docs Examined */}
            <div style={{
              padding: "16px",
              background: "rgba(255,255,255,0.025)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
            }}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Documents Examined
              </div>
              <div style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                color: "#fff",
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}>
                {formatNumber(current.docsExamined)}
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", marginTop: 6 }}>
                100% Corpus Coverage
              </div>
            </div>

            {/* Docs Returned */}
            <div style={{
              padding: "16px",
              background: "rgba(255,255,255,0.025)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--border-subtle)",
            }}>
              <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                Documents Returned
              </div>
              <div style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                color: "var(--emerald-400)",
                fontFamily: "var(--font-display)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}>
                {current.docsReturned}
              </div>
              <div style={{ fontSize: "0.68rem", color: "var(--text-tertiary)", marginTop: 6 }}>
                Aggregated Result
              </div>
            </div>
          </div>

          {/* Tableau Connection */}
          <div style={{
            padding: "14px 16px",
            background: "rgba(6,182,212,0.06)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid rgba(6,182,212,0.2)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span className="pulse-dot" />
              <strong style={{ fontSize: "0.82rem", color: "var(--cyan-400)" }}>
                Tableau Connection Active
              </strong>
            </div>
            <p style={{ fontSize: "0.76rem", color: "var(--text-tertiary)", lineHeight: 1.6 }}>
              Mapped via{" "}
              <code style={{ fontFamily: "var(--font-mono)", color: "var(--text-secondary)" }}>ev_market_data.tds</code>
              {" "}on port 3307 using MongoDB BI Connector with live SQL projection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
