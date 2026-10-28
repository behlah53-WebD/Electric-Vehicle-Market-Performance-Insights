"use client";

import React, { useState, useEffect } from "react";
import { ActiveTab } from "@/types/ev";
import { formatNumber } from "@/utils/format";

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  filteredCount: number;
  totalCount: number;
  onExportCsv: () => void;
}

const tabs = [
  { id: "overview",           label: "Executive Overview",      icon: "▦",  color: "cyan"    },
  { id: "emily_strategy",     label: "Strategy Hub",            icon: "◈",  color: "sky"     },
  { id: "david_bi",           label: "OEM Intelligence",        icon: "◉",  color: "violet"  },
  { id: "sarah_research",     label: "Research Lab",            icon: "⬡",  color: "emerald" },
  { id: "story_mode",         label: "Tableau Story",           icon: "◫",  color: "amber"   },
  { id: "mongo_workbench",    label: "MongoDB Pipeline",        icon: "⬢",  color: "emerald" },
  { id: "performance_audit",  label: "Performance & QA",        icon: "⚡",  color: "rose"    },
  { id: "tableau_embed",      label: "Live Tableau",            icon: "⬛",  color: "violet"  },
] as const;

const colorMap: Record<string, { active: string; glow: string; badge: string }> = {
  cyan:    { active: "linear-gradient(135deg,#06b6d4,#0ea5e9)", glow: "rgba(6,182,212,0.35)",   badge: "badge-cyan"    },
  sky:     { active: "linear-gradient(135deg,#38bdf8,#0ea5e9)", glow: "rgba(56,189,248,0.35)",  badge: "badge-sky"     },
  violet:  { active: "linear-gradient(135deg,#8b5cf6,#6366f1)", glow: "rgba(139,92,246,0.35)",  badge: "badge-violet"  },
  emerald: { active: "linear-gradient(135deg,#10b981,#059669)", glow: "rgba(16,185,129,0.35)",  badge: "badge-emerald" },
  amber:   { active: "linear-gradient(135deg,#f59e0b,#d97706)", glow: "rgba(245,158,11,0.35)",  badge: "badge-amber"   },
  rose:    { active: "linear-gradient(135deg,#f43f5e,#e11d48)", glow: "rgba(244,63,94,0.35)",   badge: "badge-rose"    },
};

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  filteredCount,
  totalCount,
  onExportCsv,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeTabDef = tabs.find((t) => t.id === activeTab);
  const activeCm = colorMap[activeTabDef?.color ?? "cyan"];

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: scrolled
          ? "rgba(5, 8, 16, 0.92)"
          : "rgba(5, 8, 16, 0.75)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: `1px solid ${scrolled ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.06)"}`,
        transition: "background 0.3s ease, border-color 0.3s ease",
      }}
    >
      {/* Top accent line */}
      <div style={{
        height: 2,
        background: "linear-gradient(90deg, transparent 0%, #06b6d4 30%, #8b5cf6 70%, transparent 100%)",
        opacity: 0.8,
      }} />

      <div style={{ maxWidth: 1680, margin: "0 auto", padding: "0 28px" }}>

        {/* ── Brand Row ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 0 12px",
          gap: 16,
          flexWrap: "wrap",
        }}>

          {/* Logo + Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Logo mark */}
            <div style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 24px rgba(6,182,212,0.4), 0 0 48px rgba(139,92,246,0.2)",
              flexShrink: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
              </svg>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  background: "linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  whiteSpace: "nowrap",
                }}>
                  EV Market Intelligence Platform
                </h1>
                <span className="badge badge-cyan" style={{ fontSize: "0.62rem" }}>
                  Enterprise 2026
                </span>
              </div>
              <p style={{
                fontSize: "0.72rem",
                color: "var(--text-tertiary)",
                marginTop: 2,
                fontWeight: 400,
              }}>
                Strategy · BI · Research · MongoDB · Tableau
              </p>
            </div>
          </div>

          {/* Right Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>

            {/* Live status pill */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: "var(--radius-full)",
              fontSize: "0.75rem",
            }}>
              <span className="pulse-dot" style={{ width: 7, height: 7 }} />
              <span style={{ color: "var(--emerald-400)", fontWeight: 600 }}>MongoDB 8.0</span>
              <span style={{ color: "var(--text-disabled)", fontSize: "0.68rem" }}>│</span>
              <span style={{ color: "var(--text-tertiary)" }}>Tableau TDS Synced</span>
            </div>

            {/* Record counter */}
            <div style={{
              padding: "6px 14px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              fontSize: "0.78rem",
              color: "var(--text-tertiary)",
              whiteSpace: "nowrap",
            }}>
              <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{formatNumber(filteredCount)}</span>
              <span style={{ margin: "0 4px" }}>/</span>
              {formatNumber(totalCount)} records
            </div>

            {/* Export CSV */}
            <button
              onClick={onExportCsv}
              className="btn btn-secondary"
              style={{ fontSize: "0.78rem", padding: "6px 14px" }}
              title="Download filtered dataset as CSV for Tableau"
              id="export-csv-btn"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* ── Tab Navigation ── */}
        <nav
          style={{
            display: "flex",
            gap: 4,
            overflowX: "auto",
            paddingBottom: 1,
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          aria-label="Main navigation"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const cm = colorMap[tab.color];
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={isActive ? "nav-tab-active" : ""}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  padding: "9px 15px",
                  paddingBottom: isActive ? 10 : 9,
                  borderRadius: isActive ? "var(--radius-md) var(--radius-md) 0 0" : "var(--radius-md)",
                  fontSize: "0.8rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#fff" : "var(--text-tertiary)",
                  background: isActive
                    ? cm.active
                    : "transparent",
                  border: isActive
                    ? "none"
                    : "1px solid transparent",
                  boxShadow: isActive ? `0 4px 16px ${cm.glow}` : "none",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                  whiteSpace: "nowrap",
                  fontFamily: "var(--font-main)",
                  position: "relative",
                  overflow: "hidden",
                  flexShrink: 0,
                  marginBottom: isActive ? -1 : 0,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-secondary)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = "var(--text-tertiary)";
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <span style={{ fontSize: "0.9rem", opacity: isActive ? 1 : 0.7 }}>{tab.icon}</span>
                <span>{tab.label}</span>
                {isActive && (
                  <span style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.8)",
                    flexShrink: 0,
                  }} />
                )}
              </button>
            );
          })}
        </nav>

      </div>
    </header>
  );
};
