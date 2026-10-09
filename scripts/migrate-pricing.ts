import "dotenv/config";
import { db, pool } from "@/db";
import { pricingPlans } from "@/db/schema";
import { sql } from "drizzle-orm";

async function run() {
  console.log("Checking and migrating pricing_plans table...");

  // Create table if not exists using raw SQL
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "pricing_plans" (
      "id" serial PRIMARY KEY NOT NULL,
      "slug" varchar(160) NOT NULL UNIQUE,
      "title" varchar(200) NOT NULL,
      "subtitle" varchar(255),
      "description" text,
      "price" varchar(60) DEFAULT '' NOT NULL,
      "price_suffix" varchar(60),
      "original_price" varchar(60),
      "badge" varchar(60),
      "image" text,
      "cta_text" varchar(80) DEFAULT 'Get a Free Quote' NOT NULL,
      "cta_link" varchar(255) DEFAULT '/contact' NOT NULL,
      "features" text DEFAULT '[]' NOT NULL,
      "specifications" text DEFAULT '[]' NOT NULL,
      "system_size_kw" varchar(20),
      "panel_count" varchar(20),
      "panel_brand" varchar(120),
      "inverter_brand" varchar(120),
      "featured" boolean DEFAULT false NOT NULL,
      "order" integer DEFAULT 0 NOT NULL,
      "seo_title" varchar(255),
      "seo_description" text,
      "status" "content_status" DEFAULT 'draft' NOT NULL,
      "created_at" timestamp DEFAULT now() NOT NULL,
      "updated_at" timestamp DEFAULT now() NOT NULL
    );
  `);
  console.log("pricing_plans table ensured.");

  // Check count
  const existing = await db.select().from(pricingPlans);
  console.log(`Current pricing plans in database: ${existing.length}`);

  if (existing.length === 0) {
    console.log("Seeding initial high-converting pricing plans...");
    await db.insert(pricingPlans).values([
      {
        slug: "6-6kw-essential-solar-system",
        title: "6.6kW Essential Solar System",
        subtitle: "Sydney's #1 Most Popular Household Solar System",
        description: "Perfect for 3-4 bedroom Sydney households looking to eliminate high quarterly electricity bills. Designed to maximize NSW STC rebates and deliver immediate daytime energy savings.",
        price: "$3,990",
        priceSuffix: "Fully Installed (Inc. Rebates)",
        originalPrice: "$5,490",
        badge: "Most Popular",
        image: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80",
        ctaText: "Get a Free Quote",
        ctaLink: "/contact?package=6.6kw-essential",
        features: JSON.stringify([
          "15x 440W Tier-1 N-Type TopCon Solar Panels",
          "5.0kW Sungrow High-Efficiency Smart Inverter",
          "Clean Energy Council (CEC) Accredited Sydney Installers",
          "Real-time Mobile App Solar Monitoring (Wi-Fi/4G)",
          "25-Year Linear Solar Panel Performance Warranty",
          "10-Year Comprehensive Inverter & Workmanship Warranty",
          "NSW & Federal STC Government Rebates Handled For You",
          "Complimentary Roof Inspection & Shade Analysis",
        ]),
        specifications: JSON.stringify([
          { label: "System Size", value: "6.6 kW DC" },
          { label: "Est. Daily Output", value: "24 – 28 kWh/day" },
          { label: "Panels", value: "15x 440W Tier-1 Mono PERC" },
          { label: "Inverter", value: "Sungrow 5.0kW Single Phase" },
          { label: "Est. Annual Savings", value: "Up to $1,850/year" },
          { label: "Warranty", value: "25 Yrs Panel / 10 Yrs Inverter" },
        ]),
        systemSizeKw: "6.6 kW",
        panelCount: "15 Panels",
        panelBrand: "JinkoSolar Tiger Neo N-Type",
        inverterBrand: "Sungrow SG5.0RS",
        featured: true,
        order: 1,
        seoTitle: "6.6kW Solar Panel Package Sydney | Best Price & Install",
        seoDescription: "Sydney's most popular 6.6kW solar package. Tier-1 panels, 5kW inverter, 25-year warranty, full CEC installation and rebates included.",
        status: "published",
      },
      {
        slug: "10kw-premium-family-ev-package",
        title: "10kW Premium Family & EV Package",
        subtitle: "Maximum Self-Consumption for Energy-Heavy Homes",
        description: "Engineered for larger families running ducted air conditioning, swimming pools, heat pumps, or electric vehicles. Heavy-duty power generation tailored for all seasons.",
        price: "$6,290",
        priceSuffix: "Fully Installed (Inc. Rebates)",
        originalPrice: "$7,890",
        badge: "Best Value",
        image: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80",
        ctaText: "Get a Free Quote",
        ctaLink: "/contact?package=10kw-premium",
        features: JSON.stringify([
          "23x 440W Ultra-High Output Tier-1 Solar Panels",
          "8.2kW European Engineered Fronius Primo Inverter",
          "Smart Export Meter & Zero-Export Ready Setup",
          "Ready for Future Home Battery & EV Charger Integration",
          "25-Year Product & 30-Year Performance Warranty",
          "10-Year Local Sydney Workmanship Guarantee",
          "Full Smart Meter Upgrade Assistance",
          "Priority 5-Day Installation Guarantee",
        ]),
        specifications: JSON.stringify([
          { label: "System Size", value: "10.12 kW DC" },
          { label: "Est. Daily Output", value: "38 – 45 kWh/day" },
          { label: "Panels", value: "23x 440W Trina Vertex S+" },
          { label: "Inverter", value: "Fronius Primo 8.2kW" },
          { label: "Est. Annual Savings", value: "Up to $2,900/year" },
          { label: "Warranty", value: "25 Yrs Panels / 10 Yrs Inverter" },
        ]),
        systemSizeKw: "10.0 kW",
        panelCount: "23 Panels",
        panelBrand: "Trina Solar Vertex S+ Dual-Glass",
        inverterBrand: "Fronius Primo 8.2-1",
        featured: false,
        order: 2,
        seoTitle: "10kW Solar System Sydney | High Capacity Solar Package",
        seoDescription: "Powerful 10kW residential solar package for Sydney homes with pool, air conditioning, or EV charging. Top tier components and warranties.",
        status: "published",
      },
      {
        slug: "solar-battery-independence-system",
        title: "Solar + 10kWh Battery Hybrid System",
        subtitle: "24/7 Clean Energy & Blackout Backup Protection",
        description: "Achieve up to 95% grid independence. Store your surplus solar during peak sunlight and power your home through evening peak tariff hours with emergency blackout circuit protection.",
        price: "$10,990",
        priceSuffix: "Complete Solar + Battery Package",
        originalPrice: "$13,490",
        badge: "Energy Independence",
        image: "https://images.unsplash.com/photo-1558441719-8b4e0c81d56b?auto=format&fit=crop&w=1200&q=80",
        ctaText: "Claim Battery Package",
        ctaLink: "/contact?package=battery-hybrid",
        features: JSON.stringify([
          "8.8kW Tier-1 Solar Panels + 10kWh Lithium Battery Storage",
          "Hybrid Smart Inverter with EPS Blackout Protection",
          "Time-of-Use Smart Automation to Beat Peak Grid Rates",
          "Seamless Switchover During Grid Power Outages",
          "10-Year Battery Warranty (6,000+ Cycle Life)",
          "25-Year Solar Panel Linear Warranty",
          "VPP (Virtual Power Plant) Compatibility Ready",
          "Real-time Battery Charge & Household Load App Tracking",
        ]),
        specifications: JSON.stringify([
          { label: "Solar Capacity", value: "8.8 kW DC (20 Panels)" },
          { label: "Battery Storage", value: "9.6 – 10.2 kWh Usable" },
          { label: "Inverter", value: "Sungrow 6.0kW Hybrid" },
          { label: "Backup", value: "Essential Circuits Auto-Switch" },
          { label: "Est. Annual Savings", value: "Up to $3,500/year" },
          { label: "Warranty", value: "10 Yrs Battery / 25 Yrs Panels" },
        ]),
        systemSizeKw: "8.8 kW + 10 kWh",
        panelCount: "20 Panels",
        panelBrand: "AIKO Neostar All-Black N-Type",
        inverterBrand: "Sungrow SH5.0RS Hybrid + SBR096 Battery",
        featured: false,
        order: 3,
        seoTitle: "Solar + Battery Package Sydney | 10kWh Home Battery Storage",
        seoDescription: "Cut power bills by up to 95% with our 8.8kW solar and 10kWh battery hybrid package in Sydney. Includes blackout emergency backup.",
        status: "published",
      },
      {
        slug: "commercial-solar-solution",
        title: "Commercial Solar Power System",
        subtitle: "Slash Operational Overheads for Sydney Businesses",
        description: "Custom commercial solar installations for offices, warehouses, retail centers, and workshops. Maximize instant asset write-offs and shield your bottom line against rising commercial tariffs.",
        price: "Custom Quote",
        priceSuffix: "Tailored to Your Energy Profile",
        originalPrice: null,
        badge: "Commercial & Business",
        image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&w=1200&q=80",
        ctaText: "Request Feasibility Study",
        ctaLink: "/contact?package=commercial",
        features: JSON.stringify([
          "Detailed Interval Meter Data & ROI Feasibility Study",
          "Tier-1 Commercial Grade Solar Array & Three-Phase Inverter",
          "Commercial Network Connection & Ausgrid/Endeavour Approvals",
          "Engineering Certificate & Roof Structural Assessment Included",
          "Eligible for Australian Small-Scale & Large-Scale Certificates",
          "Flexible Commercial Financing & Solar PPA Options Available",
          "Comprehensive Operations & Maintenance (O&M) Plan",
        ]),
        specifications: JSON.stringify([
          { label: "System Size", value: "15 kW to 100 kW+ Three-Phase" },
          { label: "Targeted Savings", value: "$4,000 – $25,000+/year" },
          { label: "Payback Period", value: "Est. 2.5 – 3.5 years" },
          { label: "Monitoring", value: "Commercial Multi-Site Portal" },
          { label: "Warranty", value: "25 Yrs Panels / 12 Yrs Inverter" },
        ]),
        systemSizeKw: "15kW – 100kW+",
        panelCount: "35+ Panels",
        panelBrand: "Canadian Solar / Jinko Commercial",
        inverterBrand: "Fronius Symo / Sungrow 3-Phase",
        featured: false,
        order: 4,
        seoTitle: "Commercial Solar Installers Sydney | Business Solar Packages",
        seoDescription: "Custom commercial solar systems for Sydney businesses, warehouses, and factories. Slash overheads and lock in long-term energy security.",
        status: "published",
      },
    ]);
    console.log("Successfully seeded 4 pricing plans!");
  }

  await pool.end();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
