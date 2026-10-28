/**
 * Electric Vehicle (EV) Industry Analytics - MongoDB Shell Script
 * Database: automotive_bi
 * Collection: ev_global_fleet
 * Run via: mongosh mongodb://localhost:27017/automotive_bi mongo_queries.js
 */

// 1. Database and Collection Setup
use("automotive_bi");

// 2. Drop existing collection if needed
db.ev_global_fleet.drop();

// 3. Create Collection with JSON Schema Validation
db.createCollection("ev_global_fleet", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "vehicle_id", "manufacturer", "model", "vehicle_category",
        "battery_technology", "battery_capacity_kwh", "driving_range_km",
        "base_price_usd", "annual_sales_units", "customer_rating",
        "manufacturing_country", "release_year"
      ],
      properties: {
        vehicle_id: { bsonType: "string" },
        manufacturer: { bsonType: "string" },
        model: { bsonType: "string" },
        vehicle_category: {
          enum: ["SUV", "Sedan", "Hatchback", "Truck", "Electric Bus", "Two-Wheeler"]
        },
        battery_technology: {
          enum: [
            "Lithium Iron Phosphate (LFP)",
            "Nickel Manganese Cobalt (NMC)",
            "Nickel Cobalt Aluminum (NCA)",
            "Sodium-Ion",
            "Solid-State"
          ]
        },
        battery_capacity_kwh: { bsonType: "double", minimum: 1.0, maximum: 600.0 },
        driving_range_km: { bsonType: "int", minimum: 10 },
        base_price_usd: { bsonType: "int", minimum: 1000 },
        annual_sales_units: { bsonType: "int", minimum: 0 },
        customer_rating: { bsonType: "double", minimum: 1.0, maximum: 5.0 },
        manufacturing_country: { bsonType: "string" },
        release_year: { bsonType: "int", minimum: 2020, maximum: 2026 }
      }
    }
  }
});

// 4. Performance Indexes
db.ev_global_fleet.createIndex({ vehicle_category: 1, release_year: -1 }, { name: "idx_category_year" });
db.ev_global_fleet.createIndex({ manufacturer: 1, annual_sales_units: -1 }, { name: "idx_mfg_sales" });
db.ev_global_fleet.createIndex({ battery_technology: 1, driving_range_km: -1 }, { name: "idx_battery_range" });
db.ev_global_fleet.createIndex({ manufacturing_country: 1 }, { name: "idx_country" });
db.ev_global_fleet.createIndex({ base_price_usd: 1, customer_rating: -1 }, { name: "idx_price_rating" });

print("=== MongoDB Schema and Indexes Created Successfully ===");

// 5. Aggregation Pipeline 1: Emily Johnson's Persona - Sales and Revenue by Vehicle Category
db.ev_global_fleet.aggregate([
  {
    $group: {
      _id: "$vehicle_category",
      total_sales_units: { $sum: "$annual_sales_units" },
      total_revenue_usd: { $sum: { $multiply: ["$annual_sales_units", "$base_price_usd"] } },
      avg_range_km: { $avg: "$driving_range_km" },
      avg_customer_rating: { $avg: "$customer_rating" },
      model_count: { $sum: 1 }
    }
  },
  { $sort: { total_sales_units: -1 } },
  {
    $project: {
      category: "$_id",
      total_sales_units: 1,
      total_revenue_usd: 1,
      avg_range_km: { $round: ["$avg_range_km", 1] },
      avg_customer_rating: { $round: ["$avg_customer_rating", 2] },
      model_count: 1,
      _id: 0
    }
  }
]);

// 6. Aggregation Pipeline 2: David Chen's Persona - Manufacturer Market Share & Benchmarking
db.ev_global_fleet.aggregate([
  {
    $group: {
      _id: "$manufacturer",
      total_volume: { $sum: "$annual_sales_units" },
      avg_rating: { $avg: "$customer_rating" },
      avg_efficiency: { $avg: "$battery_efficiency_km_per_kwh" },
      unique_technologies: { $addToSet: "$battery_technology" },
      primary_country: { $first: "$manufacturing_country" }
    }
  },
  { $sort: { total_volume: -1 } },
  { $limit: 10 },
  {
    $project: {
      manufacturer: "$_id",
      total_volume: 1,
      avg_rating: { $round: ["$avg_rating", 2] },
      avg_efficiency: { $round: ["$avg_efficiency", 2] },
      unique_technologies: 1,
      primary_country: 1,
      _id: 0
    }
  }
]);

// 7. Aggregation Pipeline 3: Dr. Sarah Williams' Persona - Battery Chemistry Deep Dive
db.ev_global_fleet.aggregate([
  {
    $group: {
      _id: "$battery_technology",
      sales_volume: { $sum: "$annual_sales_units" },
      avg_range: { $avg: "$driving_range_km" },
      avg_charging_min: { $avg: "$fast_charging_time_min" },
      avg_co2_saved_tons: { $avg: "$co2_emissions_saved_tons_year" },
      total_co2_abatement: { $sum: "$total_co2_abatement_tons" }
    }
  },
  { $sort: { sales_volume: -1 } },
  {
    $project: {
      battery_technology: "$_id",
      sales_volume: 1,
      avg_range_km: { $round: ["$avg_range", 1] },
      avg_charging_time_min: { $round: ["$avg_charging_min", 1] },
      total_co2_abatement_tons: { $round: ["$total_co2_abatement", 0] },
      _id: 0
    }
  }
]);

// 8. Aggregation Pipeline 4: Geographical Manufacturing Distribution & Hubs
db.ev_global_fleet.aggregate([
  {
    $group: {
      _id: "$manufacturing_country",
      annual_units: { $sum: "$annual_sales_units" },
      fleet_count: { $sum: 1 },
      avg_price: { $avg: "$base_price_usd" }
    }
  },
  { $sort: { annual_units: -1 } }
]);

// 9. Aggregation Pipeline 5: Multi-Faceted Market Segmentation ($facet)
db.ev_global_fleet.aggregate([
  {
    $facet: {
      price_tiers: [
        {
          $bucket: {
            groupBy: "$base_price_usd",
            boundaries: [0, 35000, 65000, 100000, 1000000],
            default: "Other",
            output: {
              count: { $sum: 1 },
              total_sales: { $sum: "$annual_sales_units" },
              avg_rating: { $avg: "$customer_rating" }
            }
          }
        }
      ],
      range_distribution: [
        {
          $bucketAuto: {
            groupBy: "$driving_range_km",
            buckets: 4,
            output: {
              count: { $sum: 1 },
              avg_price: { $avg: "$base_price_usd" }
            }
          }
        }
      ]
    }
  }
]);

print("=== MongoDB Queries Executed Successfully ===");
