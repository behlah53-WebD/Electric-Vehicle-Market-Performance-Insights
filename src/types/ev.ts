export interface EVRecord {
  vehicle_id: string;
  manufacturer: string;
  model: string;
  vehicle_category: "SUV" | "Sedan" | "Hatchback" | "Truck" | "Electric Bus" | "Two-Wheeler";
  battery_technology: "Lithium Iron Phosphate (LFP)" | "Nickel Manganese Cobalt (NMC)" | "Nickel Cobalt Aluminum (NCA)" | "Sodium-Ion" | "Solid-State";
  battery_capacity_kwh: number;
  driving_range_km: number;
  base_price_usd: number;
  annual_sales_units: number;
  customer_rating: number;
  manufacturing_country: string;
  fast_charging_time_min: number;
  energy_consumption_wh_per_km: number;
  co2_emissions_saved_tons_year: number;
  release_year: number;
  top_speed_kmh: number;
  acceleration_0_100_s: number;
  battery_warranty_years: number;
  battery_efficiency_km_per_kwh: number;
  range_to_price_ratio: number;
  customer_value_score: number;
  total_co2_abatement_tons: number;
}

export interface FilterState {
  category: string;
  batteryTech: string;
  manufacturer: string;
  country: string;
  year: string;
  search: string;
}

export type ActiveTab =
  | "overview"
  | "emily_strategy"
  | "david_bi"
  | "sarah_research"
  | "story_mode"
  | "mongo_workbench"
  | "performance_audit"
  | "tableau_embed";
