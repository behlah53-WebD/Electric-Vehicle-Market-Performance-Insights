import json
import csv
import random
import os

random.seed(42)

MANUFACTURERS = [
    {"name": "Tesla", "country": "USA", "base_rep": 4.6},
    {"name": "BYD", "country": "China", "base_rep": 4.5},
    {"name": "Volkswagen", "country": "Germany", "base_rep": 4.2},
    {"name": "Hyundai", "country": "South Korea", "base_rep": 4.4},
    {"name": "BMW", "country": "Germany", "base_rep": 4.6},
    {"name": "Rivian", "country": "USA", "base_rep": 4.4},
    {"name": "Mercedes-Benz", "country": "Germany", "base_rep": 4.5},
    {"name": "Kia", "country": "South Korea", "base_rep": 4.3},
    {"name": "Ford", "country": "USA", "base_rep": 4.1},
    {"name": "Audi", "country": "Germany", "base_rep": 4.4},
    {"name": "NIO", "country": "China", "base_rep": 4.3},
    {"name": "Volvo", "country": "Sweden", "base_rep": 4.4},
    {"name": "Polestar", "country": "Sweden", "base_rep": 4.2},
    {"name": "General Motors", "country": "USA", "base_rep": 4.0},
    {"name": "Lucid Motors", "country": "USA", "base_rep": 4.5},
]

MODELS_BY_CATEGORY = {
    "SUV": [
        ("Model Y", "Tesla", 4.7), ("Tang EV", "BYD", 4.4), ("Song Plus EV", "BYD", 4.3),
        ("ID.4", "Volkswagen", 4.2), ("ID.5", "Volkswagen", 4.2), ("Ioniq 5", "Hyundai", 4.6),
        ("iX", "BMW", 4.6), ("iX3", "BMW", 4.3), ("R1S", "Rivian", 4.5),
        ("EQS SUV", "Mercedes-Benz", 4.6), ("EQB", "Mercedes-Benz", 4.3), ("EV6", "Kia", 4.5),
        ("EV9", "Kia", 4.6), ("Mustang Mach-E", "Ford", 4.3), ("Q4 e-tron", "Audi", 4.3),
        ("Q8 e-tron", "Audi", 4.4), ("ES6", "NIO", 4.4), ("ES8", "NIO", 4.5),
        ("EX90", "Volvo", 4.6), ("EX30", "Volvo", 4.4), ("Polestar 3", "Polestar", 4.4),
        ("Lyriq", "General Motors", 4.3), ("Blazer EV", "General Motors", 4.1), ("Gravity", "Lucid Motors", 4.7)
    ],
    "Sedan": [
        ("Model 3", "Tesla", 4.8), ("Model S", "Tesla", 4.7), ("Han EV", "BYD", 4.5),
        ("Seal", "BYD", 4.6), ("ID.7", "Volkswagen", 4.3), ("Ioniq 6", "Hyundai", 4.5),
        ("i4", "BMW", 4.6), ("i7", "BMW", 4.7), ("EQE Sedan", "Mercedes-Benz", 4.4),
        ("EQS Sedan", "Mercedes-Benz", 4.6), ("ET7", "NIO", 4.5), ("ET5", "NIO", 4.4),
        ("Polestar 2", "Polestar", 4.4), ("Celestiq", "General Motors", 4.5), ("Air Pure", "Lucid Motors", 4.7),
        ("Air Sapphire", "Lucid Motors", 4.8)
    ],
    "Hatchback": [
        ("Dolphin", "BYD", 4.4), ("Seagull", "BYD", 4.3), ("ID.3", "Volkswagen", 4.2),
        ("Kona Electric", "Hyundai", 4.3), ("Niro EV", "Kia", 4.2), ("Bolt EV", "General Motors", 4.1),
        ("EX30 Cross", "Volvo", 4.3), ("i3 Heritage", "BMW", 4.2), ("e-208 GT", "Volkswagen", 4.2),
        ("Cupra Born", "Volkswagen", 4.3), ("Megane E-Tech", "Volvo", 4.3)
    ],
    "Electric Bus": [
        ("K9 Electric Bus", "BYD", 4.5), ("B12 City Transit", "BYD", 4.4), ("eCitaro G", "Mercedes-Benz", 4.6),
        ("eCitaro Solo", "Mercedes-Benz", 4.5), ("7900 Electric", "Volvo", 4.5), ("8900 Electric", "Volvo", 4.4),
        ("ID. Buzz Bus Cargo", "Volkswagen", 4.3), ("E-Transit Coach", "Ford", 4.2)
    ],
    "Truck": [
        ("Cybertruck", "Tesla", 4.4), ("Semi Long-Haul", "Tesla", 4.6), ("R1T Adventure", "Rivian", 4.6),
        ("F-150 Lightning", "Ford", 4.4), ("Silverado EV", "General Motors", 4.3), ("Sierra EV Denali", "General Motors", 4.4),
        ("Hummer EV Pickup", "General Motors", 4.2), ("BYD Shark Pickup", "BYD", 4.4)
    ],
    "Two-Wheeler": [
        ("BMW CE 04", "BMW", 4.5), ("BMW CE 02", "BMW", 4.3), ("LiveWire One", "Ford", 4.4),
        ("LiveWire Del Mar", "Ford", 4.3), ("Zero SR/F", "Tesla", 4.5), ("Zero FXE", "Tesla", 4.4),
        ("BYD Scooter City", "BYD", 4.3), ("NIO E-Scooter ES1", "NIO", 4.3)
    ]
}

BATTERY_TECHS = [
    {"tech": "Lithium Iron Phosphate (LFP)", "base_eff": 6.8, "base_cost_mult": 0.82, "safety": 4.8, "degrad_pct_yr": 1.5, "fast_charge_min": 28},
    {"tech": "Nickel Manganese Cobalt (NMC)", "base_eff": 6.2, "base_cost_mult": 1.05, "safety": 4.3, "degrad_pct_yr": 2.2, "fast_charge_min": 22},
    {"tech": "Nickel Cobalt Aluminum (NCA)", "base_eff": 6.4, "base_cost_mult": 1.12, "safety": 4.1, "degrad_pct_yr": 2.4, "fast_charge_min": 24},
    {"tech": "Sodium-Ion", "base_eff": 5.4, "base_cost_mult": 0.65, "safety": 4.9, "degrad_pct_yr": 1.2, "fast_charge_min": 18},
    {"tech": "Solid-State", "base_eff": 7.6, "base_cost_mult": 1.45, "safety": 5.0, "degrad_pct_yr": 0.8, "fast_charge_min": 12},
]

YEARS = [2021, 2022, 2023, 2024, 2025]

def generate_record(idx):
    category = random.choices(
        ["SUV", "Sedan", "Hatchback", "Truck", "Electric Bus", "Two-Wheeler"],
        weights=[38, 28, 16, 8, 5, 5]
    )[0]
    
    model_tuple = random.choice(MODELS_BY_CATEGORY[category])
    model_name, brand, base_rating = model_tuple
    
    mfg_entry = next((m for m in MANUFACTURERS if m["name"] == brand), MANUFACTURERS[0])
    country = mfg_entry["country"]
    
    # Secondary manufacturing plants for global expansion
    if random.random() < 0.28:
        country = random.choice(["China", "USA", "Germany", "Mexico", "South Korea", "Sweden", "India", "France"])
        
    year = random.choices(YEARS, weights=[12, 18, 24, 26, 20])[0]
    
    # Battery technology distribution weighted by year
    if year <= 2022:
        b_weights = [35, 45, 18, 2, 0]
    elif year <= 2024:
        b_weights = [42, 38, 14, 4, 2]
    else:
        b_weights = [46, 32, 10, 8, 4]
        
    b_choice = random.choices(BATTERY_TECHS, weights=b_weights)[0]
    battery_tech = b_choice["tech"]
    
    # Specs based on category
    if category == "SUV":
        capacity_kwh = round(random.uniform(65, 108), 1)
        base_price = round(random.uniform(42000, 95000) * b_choice["base_cost_mult"], -2)
        wh_km = round(random.uniform(165, 230) / (b_choice["base_eff"] / 6.0), 1)
        sales_vol = int(random.uniform(18000, 240000) * (1.15 ** (year - 2021)))
        co2_saved = round(random.uniform(3.8, 5.2), 2)
        top_speed = random.choice([180, 190, 200, 210, 250])
        accel_0_100 = round(random.uniform(3.6, 7.2), 1)
    elif category == "Sedan":
        capacity_kwh = round(random.uniform(55, 102), 1)
        base_price = round(random.uniform(38000, 105000) * b_choice["base_cost_mult"], -2)
        wh_km = round(random.uniform(140, 195) / (b_choice["base_eff"] / 6.0), 1)
        sales_vol = int(random.uniform(15000, 210000) * (1.12 ** (year - 2021)))
        co2_saved = round(random.uniform(3.4, 4.6), 2)
        top_speed = random.choice([190, 210, 225, 250, 260])
        accel_0_100 = round(random.uniform(3.1, 6.5), 1)
    elif category == "Hatchback":
        capacity_kwh = round(random.uniform(35, 62), 1)
        base_price = round(random.uniform(21000, 42000) * b_choice["base_cost_mult"], -2)
        wh_km = round(random.uniform(125, 165) / (b_choice["base_eff"] / 6.0), 1)
        sales_vol = int(random.uniform(12000, 140000) * (1.10 ** (year - 2021)))
        co2_saved = round(random.uniform(2.6, 3.7), 2)
        top_speed = random.choice([150, 160, 175])
        accel_0_100 = round(random.uniform(6.5, 9.8), 1)
    elif category == "Truck":
        capacity_kwh = round(random.uniform(110, 190), 1)
        base_price = round(random.uniform(68000, 125000) * b_choice["base_cost_mult"], -2)
        wh_km = round(random.uniform(240, 360) / (b_choice["base_eff"] / 6.0), 1)
        sales_vol = int(random.uniform(6000, 58000) * (1.20 ** (year - 2021)))
        co2_saved = round(random.uniform(6.5, 9.2), 2)
        top_speed = random.choice([175, 190, 205])
        accel_0_100 = round(random.uniform(3.2, 5.8), 1)
    elif category == "Electric Bus":
        capacity_kwh = round(random.uniform(220, 450), 1)
        base_price = round(random.uniform(280000, 520000) * b_choice["base_cost_mult"], -2)
        wh_km = round(random.uniform(850, 1250) / (b_choice["base_eff"] / 6.0), 1)
        sales_vol = int(random.uniform(800, 9500) * (1.14 ** (year - 2021)))
        co2_saved = round(random.uniform(28.0, 48.0), 2)
        top_speed = random.choice([85, 100])
        accel_0_100 = round(random.uniform(11.0, 16.0), 1)
    else: # Two-Wheeler
        capacity_kwh = round(random.uniform(3.5, 18.0), 1)
        base_price = round(random.uniform(2800, 18500) * b_choice["base_cost_mult"], -2)
        wh_km = round(random.uniform(35, 75) / (b_choice["base_eff"] / 6.0), 1)
        sales_vol = int(random.uniform(8000, 85000) * (1.18 ** (year - 2021)))
        co2_saved = round(random.uniform(0.8, 1.6), 2)
        top_speed = random.choice([90, 110, 140, 180])
        accel_0_100 = round(random.uniform(3.2, 8.5), 1)

    # Driving Range calculation based on capacity and consumption
    range_km = int((capacity_kwh * 1000) / wh_km)
    
    # Fast charging time in minutes
    charge_time = round(b_choice["fast_charge_min"] * random.uniform(0.9, 1.25) * (capacity_kwh / 75.0) ** 0.35, 0)
    charge_time = int(max(10, min(80, charge_time)))
    
    # Rating jitter
    rating = round(min(5.0, max(3.1, base_rating + random.uniform(-0.35, 0.25))), 2)
    warranty_yrs = 8 if battery_tech in ["Lithium Iron Phosphate (LFP)", "Solid-State"] else 7
    if category in ["Electric Bus", "Truck"]:
        warranty_yrs = 10

    # Calculated metrics
    km_per_kwh = round(range_km / capacity_kwh, 2)
    range_to_price_ratio = round((range_km / base_price) * 1000, 2)
    customer_value_score = round((rating / 5.0) * (range_km / (base_price / 10000)), 2)
    total_co2_abatement = round(sales_vol * co2_saved, 1)

    return {
        "vehicle_id": f"EV-{10000 + idx}",
        "manufacturer": brand,
        "model": model_name,
        "vehicle_category": category,
        "battery_technology": battery_tech,
        "battery_capacity_kwh": capacity_kwh,
        "driving_range_km": range_km,
        "base_price_usd": int(base_price),
        "annual_sales_units": sales_vol,
        "customer_rating": rating,
        "manufacturing_country": country,
        "fast_charging_time_min": charge_time,
        "energy_consumption_wh_per_km": wh_km,
        "co2_emissions_saved_tons_year": co2_saved,
        "release_year": year,
        "top_speed_kmh": top_speed,
        "acceleration_0_100_s": accel_0_100,
        "battery_warranty_years": warranty_yrs,
        "battery_efficiency_km_per_kwh": km_per_kwh,
        "range_to_price_ratio": range_to_price_ratio,
        "customer_value_score": customer_value_score,
        "total_co2_abatement_tons": total_co2_abatement
    }

def main():
    os.makedirs("d:/project/data", exist_ok=True)
    records = [generate_record(i) for i in range(1250)]
    
    # Save as JSON
    json_path = "d:/project/data/ev_market_data.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(records, f, indent=2)
        
    # Save as CSV for Tableau Data Source
    csv_path = "d:/project/data/ev_market_data.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=records[0].keys())
        writer.writeheader()
        writer.writerows(records)

    print(f"Generated {len(records)} realistic EV records.")
    print(f"JSON saved to {json_path}")
    print(f"CSV saved to {csv_path}")

if __name__ == "__main__":
    main()
