"use client";

import React, { useState } from "react";

export const TableauEmbedView: React.FC = () => {
  const [embedUrl, setEmbedUrl] = useState<string>(
    "https://public.tableau.com/views/ElectricVehiclePopulationDataDashboard/EVMarketOverview"
  );
  const [deviceMode, setDeviceMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showTdsModal, setShowTdsModal] = useState<boolean>(false);
  const [copiedTds, setCopiedTds] = useState<boolean>(false);

  const deviceWidths = {
    desktop: "100%",
    tablet: "820px",
    mobile: "430px",
  };

  const samplePresets = [
    {
      label: "EV Market Overview",
      url: "https://public.tableau.com/views/ElectricVehiclePopulationDataDashboard/EVMarketOverview",
    },
    {
      label: "Battery Chemistry Lab",
      url: "https://public.tableau.com/views/ElectricVehiclePopulationDataDashboard/BatteryTechOverview",
    },
    {
      label: "Global OEM Intelligence",
      url: "https://public.tableau.com/views/ElectricVehiclePopulationDataDashboard/OEMCompetitiveMatrix",
    },
  ];

  const tdsCode = `<?xml version='1.0' encoding='utf-8' ?>
<datasource formatted-name='ev_market_data_tableau_ds' inline='true' version='18.1'>
  <connection class='federated'>
    <named-connection caption='MongoDB_EV_Fleet' name='mongodb_bi_conn'>
      <connection class='mongodb_bi' dbname='automotive_bi' port='3307' server='localhost' />
    </named-connection>
  </connection>
  <!-- Calculated Fields Defined in Tableau Engine -->
  <column caption='Range-to-Price Ratio' formula='([driving_range_km] / [base_price_usd]) * 1000' datatype='real' />
  <column caption='Battery Efficiency (km/kWh)' formula='[driving_range_km] / [battery_capacity_kwh]' datatype='real' />
  <column caption='Total CO2 Abatement (Tons)' formula='[annual_sales_units] * [co2_emissions_saved_tons_year]' datatype='real' />
  <column caption='Customer Value Score' formula='([customer_rating] / 5.0) * ([driving_range_km] / ([base_price_usd] / 10000))' datatype='real' />
  <column caption='Fast Charge Speed Index' formula='[battery_capacity_kwh] / [fast_charging_time_min]' datatype='real' />
  <!-- Geographic Hierarchy Mapping -->
  <column caption='Manufacturing Country' name='[manufacturing_country]' role='dimension' semantic-role='[Country].[ISO3166_2]' type='nominal' />
</datasource>`;

  const handleCopyTds = () => {
    navigator.clipboard.writeText(tdsCode);
    setCopiedTds(true);
    setTimeout(() => setCopiedTds(false), 2000);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* ── Header Control Bar ── */}
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
        <div className="shimmer-top-violet" />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "var(--radius-lg)",
                background: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(139, 92, 246, 0.35)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                  Live Tableau Cloud & Embedded Frame
                </h2>
                <span className="badge badge-violet">Tableau JS API v3</span>
                <span className="badge badge-emerald" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span className="pulse-dot" style={{ width: 6, height: 6 }} />
                  Live Sync
                </span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: 4 }}>
                Next.js container embedding Tableau Public / Server dashboards via responsive iframe and bidirectional Tableau Embedding API
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <button
              id="tds-modal-toggle"
              onClick={() => setShowTdsModal(!showTdsModal)}
              className="btn btn-secondary"
              style={{ padding: "8px 16px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {showTdsModal ? "Hide Tableau TDS" : "Inspect Tableau TDS"}
            </button>
            <a
              href="/data/ev_market_data.csv"
              download="ev_market_data.csv"
              className="btn btn-primary"
              style={{ padding: "8px 16px", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: 6 }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Tableau CSV
            </a>
          </div>
        </div>

        {/* ── Viewport Controls & URL Bar ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--border-subtle)" }}>
          {/* Preset Buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.74rem", color: "var(--text-tertiary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Presets:
            </span>
            {samplePresets.map((p) => (
              <button
                key={p.label}
                onClick={() => setEmbedUrl(p.url)}
                className="btn btn-secondary"
                style={{
                  padding: "5px 12px",
                  fontSize: "0.75rem",
                  background: embedUrl === p.url ? "rgba(6, 182, 212, 0.15)" : undefined,
                  borderColor: embedUrl === p.url ? "var(--cyan-400)" : undefined,
                  color: embedUrl === p.url ? "var(--cyan-400)" : undefined,
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Device Sizing Mode */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: "0.74rem", color: "var(--text-tertiary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Device Viewport:
            </span>
            <div style={{ display: "flex", background: "rgba(255, 255, 255, 0.04)", padding: 3, borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
              <button
                onClick={() => setDeviceMode("desktop")}
                style={{
                  padding: "5px 14px",
                  borderRadius: 6,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  outline: "none",
                  background: deviceMode === "desktop" ? "var(--grad-brand)" : "transparent",
                  color: deviceMode === "desktop" ? "#fff" : "var(--text-secondary)",
                  transition: "all 0.15s ease",
                }}
              >
                🖥️ Desktop (100%)
              </button>
              <button
                onClick={() => setDeviceMode("tablet")}
                style={{
                  padding: "5px 14px",
                  borderRadius: 6,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  outline: "none",
                  background: deviceMode === "tablet" ? "var(--grad-brand)" : "transparent",
                  color: deviceMode === "tablet" ? "#fff" : "var(--text-secondary)",
                  transition: "all 0.15s ease",
                }}
              >
                📱 Tablet (820px)
              </button>
              <button
                onClick={() => setDeviceMode("mobile")}
                style={{
                  padding: "5px 14px",
                  borderRadius: 6,
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "none",
                  outline: "none",
                  background: deviceMode === "mobile" ? "var(--grad-brand)" : "transparent",
                  color: deviceMode === "mobile" ? "#fff" : "var(--text-secondary)",
                  transition: "all 0.15s ease",
                }}
              >
                📲 Mobile (430px)
              </button>
            </div>
          </div>
        </div>

        {/* URL Input Bar */}
        <div style={{ marginTop: 14 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "var(--radius-md)",
              padding: "8px 14px",
            }}
          >
            <span style={{ fontSize: "0.8rem", color: "var(--cyan-400)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>
              URL
            </span>
            <input
              type="text"
              value={embedUrl}
              onChange={(e) => setEmbedUrl(e.target.value)}
              placeholder="Paste Tableau Public / Server share URL..."
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                color: "#fff",
                fontSize: "0.82rem",
                fontFamily: "var(--font-mono)",
                outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* ── TDS Specification Viewer Modal ── */}
      {showTdsModal && (
        <div
          className="glass-panel"
          style={{
            padding: "24px 28px",
            border: "1px solid var(--border-glow-violet)",
            background: "rgba(10, 15, 30, 0.95)",
            borderRadius: "var(--radius-xl)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="shimmer-top-violet" />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="badge badge-violet">ODBC Metadata</span>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff" }}>
                Tableau Data Source Specification (<code style={{ color: "var(--cyan-400)" }}>ev_market_data.tds</code>)
              </h4>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                onClick={handleCopyTds}
                className="btn btn-secondary"
                style={{ padding: "6px 14px", fontSize: "0.75rem" }}
              >
                {copiedTds ? "✔ Copied to Clipboard" : "📋 Copy XML"}
              </button>
              <button
                onClick={() => setShowTdsModal(false)}
                className="btn btn-secondary"
                style={{ padding: "6px 10px", fontSize: "0.75rem" }}
              >
                ✕
              </button>
            </div>
          </div>

          <pre
            style={{
              background: "var(--bg-base)",
              padding: 16,
              borderRadius: "var(--radius-md)",
              fontSize: "0.76rem",
              fontFamily: "var(--font-mono)",
              color: "var(--cyan-400)",
              maxHeight: 260,
              overflowY: "auto",
              border: "1px solid var(--border-subtle)",
              lineHeight: 1.6,
            }}
          >
            {tdsCode}
          </pre>
        </div>
      )}

      {/* ── Tableau Preview Frame Container ── */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          className="glass-panel"
          style={{
            width: deviceWidths[deviceMode],
            minHeight: 700,
            padding: "20px 24px",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
            border: "1px solid var(--border-default)",
            borderRadius: "var(--radius-xl)",
            background: "rgba(10, 14, 26, 0.8)",
          }}
        >
          {/* Top Frame Status Bar */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: 14,
              borderBottom: "1px solid var(--border-subtle)",
              marginBottom: 16,
              flexWrap: "wrap",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ display: "flex", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f43f5e" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f59e0b" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#10b981" }} />
              </div>
              <span style={{ fontSize: "0.76rem", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                Tableau Target: <strong style={{ color: "#fff" }}>{embedUrl.slice(0, 52)}...</strong>
              </span>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span className="badge badge-emerald" style={{ fontSize: "0.68rem" }}>
                Active Sandbox Embed
              </span>
              <span className="badge badge-ghost" style={{ fontSize: "0.68rem" }}>
                Viewport: {deviceMode}
              </span>
            </div>
          </div>

          {/* Embed Frame */}
          <div
            style={{
              position: "relative",
              flex: 1,
              minHeight: 640,
              background: "var(--bg-base)",
              borderRadius: "var(--radius-lg)",
              overflow: "hidden",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <iframe
              src={`${embedUrl}?:showVizHome=no&:embed=true&:toolbar=yes`}
              title="Tableau EV Analytics Dashboard"
              width="100%"
              height="100%"
              style={{ minHeight: 640, border: "none" }}
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </div>
  );
};
