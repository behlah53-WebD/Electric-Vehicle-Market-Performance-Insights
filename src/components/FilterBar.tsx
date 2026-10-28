"use client";

import React, { useState } from "react";
import { FilterState } from "@/types/ev";

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  categories: string[];
  batteryTechs: string[];
  manufacturers: string[];
  countries: string[];
  years: number[];
  onReset: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  setFilters,
  categories,
  batteryTechs,
  manufacturers,
  countries,
  years,
  onReset,
}) => {
  const [searchFocused, setSearchFocused] = useState(false);

  const isFiltered =
    filters.category !== "All" ||
    filters.batteryTech !== "All" ||
    filters.manufacturer !== "All" ||
    filters.country !== "All" ||
    filters.year !== "All" ||
    filters.search !== "";

  const activeFilterCount = [
    filters.category !== "All",
    filters.batteryTech !== "All",
    filters.manufacturer !== "All",
    filters.country !== "All",
    filters.year !== "All",
    filters.search !== "",
  ].filter(Boolean).length;

  return (
    <div
      className="glass-panel"
      style={{
        padding: "16px 22px",
        marginBottom: 22,
        borderRadius: "var(--radius-xl)",
      }}
    >
      <div className="shimmer-top-cyan" />

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 12,
      }}>

        {/* ── Filter Label ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <span style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--text-tertiary)",
          }}>
            Filters
          </span>
          {isFiltered && (
            <span style={{
              background: "var(--grad-brand)",
              color: "#fff",
              fontSize: "0.62rem",
              fontWeight: 700,
              padding: "1px 7px",
              borderRadius: "var(--radius-full)",
            }}>
              {activeFilterCount}
            </span>
          )}
        </div>

        {/* Vertical divider */}
        <div style={{
          width: 1,
          height: 28,
          background: "var(--border-subtle)",
          flexShrink: 0,
        }} />

        {/* ── Search Input ── */}
        <div style={{
          position: "relative",
          flex: "1 1 200px",
          minWidth: 180,
          maxWidth: 280,
        }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--text-tertiary)"
            strokeWidth="2"
            style={{
              position: "absolute",
              left: 11,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              transition: "stroke 0.2s",
              stroke: searchFocused ? "var(--cyan-400)" : "var(--text-tertiary)",
            }}
          >
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            id="filter-search"
            type="text"
            placeholder="Search model, OEM, ID…"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="input-field"
            style={{ paddingLeft: 34 }}
          />
        </div>

        {/* ── Select Dropdowns ── */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 8,
          flex: "3 1 500px",
        }}>

          <FilterSelect
            id="filter-category"
            value={filters.category}
            onChange={(v) => setFilters((prev) => ({ ...prev, category: v }))}
            placeholder="All Categories"
            icon="🚗"
          >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </FilterSelect>

          <FilterSelect
            id="filter-battery"
            value={filters.batteryTech}
            onChange={(v) => setFilters((prev) => ({ ...prev, batteryTech: v }))}
            placeholder="All Battery Techs"
            icon="🔋"
          >
            {batteryTechs.map((b) => <option key={b} value={b}>{b}</option>)}
          </FilterSelect>

          <FilterSelect
            id="filter-manufacturer"
            value={filters.manufacturer}
            onChange={(v) => setFilters((prev) => ({ ...prev, manufacturer: v }))}
            placeholder="All Manufacturers"
            icon="🏭"
          >
            {manufacturers.map((m) => <option key={m} value={m}>{m}</option>)}
          </FilterSelect>

          <FilterSelect
            id="filter-country"
            value={filters.country}
            onChange={(v) => setFilters((prev) => ({ ...prev, country: v }))}
            placeholder="All Countries"
            icon="🌍"
          >
            {countries.map((c) => <option key={c} value={c}>{c}</option>)}
          </FilterSelect>

          <FilterSelect
            id="filter-year"
            value={filters.year}
            onChange={(v) => setFilters((prev) => ({ ...prev, year: v }))}
            placeholder="All Years"
            icon="📅"
          >
            {years.map((y) => <option key={y} value={y.toString()}>{y}</option>)}
          </FilterSelect>

          {/* Reset */}
          {isFiltered && (
            <button
              id="filter-reset-btn"
              onClick={onReset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "9px 14px",
                background: "rgba(244, 63, 94, 0.08)",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                borderRadius: "var(--radius-md)",
                color: "var(--rose-400)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.18s ease",
                fontFamily: "var(--font-main)",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(244,63,94,0.14)";
                e.currentTarget.style.borderColor = "rgba(244,63,94,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(244,63,94,0.08)";
                e.currentTarget.style.borderColor = "rgba(244,63,94,0.3)";
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Internal FilterSelect Component ── */
interface FilterSelectProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: string;
  children: React.ReactNode;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  id,
  value,
  onChange,
  placeholder,
  icon,
  children,
}) => {
  const isActive = value !== "All";
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="select-field"
      style={{
        minWidth: 140,
        flex: "1 1 140px",
        borderColor: isActive ? "rgba(6,182,212,0.4)" : undefined,
        color: isActive ? "var(--cyan-400)" : undefined,
      }}
    >
      <option value="All">{icon} {placeholder}</option>
      {children}
    </select>
  );
};
