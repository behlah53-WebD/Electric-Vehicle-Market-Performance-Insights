"use client";

import React, { useState, useMemo } from "react";
import rawData from "@/data/ev_market_data.json";
import { EVRecord, FilterState, ActiveTab } from "@/types/ev";
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";
import { KpiMetricsRow } from "@/components/KpiMetricsRow";
import { ExecutiveOverview } from "@/components/views/ExecutiveOverview";
import { EmilyStrategyHub } from "@/components/views/EmilyStrategyHub";
import { DavidChenBIHub } from "@/components/views/DavidChenBIHub";
import { SarahWilliamsResearchLab } from "@/components/views/SarahWilliamsResearchLab";
import { TableauStoryView } from "@/components/views/TableauStoryView";
import { MongoWorkbench } from "@/components/views/MongoWorkbench";
import { PerformanceAudit } from "@/components/views/PerformanceAudit";
import { TableauEmbedView } from "@/components/views/TableauEmbedView";

export default function Home() {
  const allData = rawData as EVRecord[];

  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    batteryTech: "All",
    manufacturer: "All",
    country: "All",
    year: "All",
    search: "",
  });

  // Extract unique filter options
  const categories = useMemo(() => Array.from(new Set(allData.map((d) => d.vehicle_category))).sort(), [allData]);
  const batteryTechs = useMemo(() => Array.from(new Set(allData.map((d) => d.battery_technology))).sort(), [allData]);
  const manufacturers = useMemo(() => Array.from(new Set(allData.map((d) => d.manufacturer))).sort(), [allData]);
  const countries = useMemo(() => Array.from(new Set(allData.map((d) => d.manufacturing_country))).sort(), [allData]);
  const years = useMemo(() => Array.from(new Set(allData.map((d) => d.release_year))).sort((a, b) => b - a), [allData]);

  // Dynamic filter application
  const filteredData = useMemo(() => {
    return allData.filter((item) => {
      if (filters.category !== "All" && item.vehicle_category !== filters.category) return false;
      if (filters.batteryTech !== "All" && item.battery_technology !== filters.batteryTech) return false;
      if (filters.manufacturer !== "All" && item.manufacturer !== filters.manufacturer) return false;
      if (filters.country !== "All" && item.manufacturing_country !== filters.country) return false;
      if (filters.year !== "All" && item.release_year.toString() !== filters.year) return false;
      if (filters.search.trim() !== "") {
        const q = filters.search.toLowerCase();
        const match =
          item.model.toLowerCase().includes(q) ||
          item.manufacturer.toLowerCase().includes(q) ||
          item.vehicle_id.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [allData, filters]);

  const handleResetFilters = () => {
    setFilters({
      category: "All",
      batteryTech: "All",
      manufacturer: "All",
      country: "All",
      year: "All",
      search: "",
    });
  };

  // CSV Export for Tableau
  const handleExportCsv = () => {
    if (filteredData.length === 0) return;
    const headers = Object.keys(filteredData[0]).join(",");
    const rows = filteredData.map((item) =>
      Object.values(item)
        .map((val) => `"${val}"`)
        .join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ev_market_data_filtered_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Sticky Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredCount={filteredData.length}
        totalCount={allData.length}
        onExportCsv={handleExportCsv}
      />

      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          maxWidth: 1680,
          width: "100%",
          margin: "0 auto",
          padding: "28px 28px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Global Filter Bar */}
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          batteryTechs={batteryTechs}
          manufacturers={manufacturers}
          countries={countries}
          years={years}
          onReset={handleResetFilters}
        />

        {/* Executive KPI Summary */}
        <KpiMetricsRow data={filteredData} />

        {/* Tab Views */}
        {activeTab === "overview"          && <ExecutiveOverview data={filteredData} />}
        {activeTab === "emily_strategy"    && <EmilyStrategyHub data={filteredData} />}
        {activeTab === "david_bi"          && <DavidChenBIHub data={filteredData} />}
        {activeTab === "sarah_research"    && <SarahWilliamsResearchLab data={filteredData} />}
        {activeTab === "story_mode"        && <TableauStoryView data={filteredData} />}
        {activeTab === "mongo_workbench"   && <MongoWorkbench data={filteredData} />}
        {activeTab === "performance_audit" && <PerformanceAudit data={filteredData} totalCount={allData.length} />}
        {activeTab === "tableau_embed"     && <TableauEmbedView />}
      </main>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid var(--border-subtle)",
          background: "rgba(5, 8, 16, 0.97)",
          backdropFilter: "blur(20px)",
          padding: "24px 28px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top accent */}
        <div style={{
          position: "absolute",
          top: 0, left: 0, right: 0,
          height: 1,
          background: "linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.3) 30%, rgba(139,92,246,0.3) 70%, transparent 100%)",
        }} />

        <div style={{
          maxWidth: 1680,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
        }}>
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div>
              <div style={{
                fontSize: "0.82rem",
                fontWeight: 700,
                color: "var(--text-secondary)",
              }}>
                Global EV Market Intelligence Platform
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--text-disabled)" }}>
                Built with Next.js · MongoDB BI Connector · Tableau TDS
              </div>
            </div>
          </div>

          {/* Stack pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {["Next.js 16", "MongoDB 8.0", "Tableau TDS", "TypeScript", "1,250 Records"].map((item) => (
              <span key={item} className="badge badge-ghost" style={{ fontSize: "0.68rem" }}>
                {item}
              </span>
            ))}
          </div>

          {/* Architecture note */}
          <div style={{
            fontSize: "0.72rem",
            color: "var(--text-disabled)",
            textAlign: "right",
          }}>
            <span style={{ color: "var(--cyan-500)", fontWeight: 600 }}>All 3 Scenarios Fully Modeled</span>
            <br />
            Drive → DB → Tableau → Story → Web UI
          </div>
        </div>
      </footer>
    </div>
  );
}
