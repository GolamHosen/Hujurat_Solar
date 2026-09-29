import "dotenv/config";
import { db, pool } from "@/db";
import {
  admins,
  services,
  locations,
  projects,
  projectImages,
  projectVideos,
  blogPosts,
  testimonials,
} from "@/db/schema";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";

const isProduction = process.env.NODE_ENV === "production";

async function main() {
  console.log("Seeding Hujurat Solar database...");

  await db.execute(sql`TRUNCATE TABLE project_images, project_videos, testimonials, projects, blog_posts, services, locations RESTART IDENTITY CASCADE`);

  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminEmail || !adminPassword) {
    console.error("ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required to seed the admin account.");
    console.error("Usage: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=secret npm run seed");
    process.exit(1);
  }

  const existingAdmin = await db.select().from(admins).where(sql`email = ${adminEmail}`);
  if (existingAdmin.length === 0) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await db.insert(admins).values({
      email: adminEmail,
      passwordHash,
      name: process.env.ADMIN_NAME?.trim() || "Hujurat Admin",
    });
    console.log("Created admin user:", adminEmail);
  }

  const locationRows = await db
    .insert(locations)
    .values([
      {
        slug: "sydney",
        name: "Sydney",
        region: "Greater Sydney",
        state: "NSW",
        blurb: "Solar panels, batteries and monitoring systems installed across the Greater Sydney metro area.",
        description:
          "Hujurat Solar supplies and installs residential and commercial solar systems across Greater Sydney. Our CEC-accredited installers work with homeowners, strata properties and businesses to design systems suited to Sydney's climate, roof types and energy retailers.",
        heroImage: "/images/location-suburb.jpg",
        seoTitle: "Solar Installer Sydney | Hujurat Solar Supply & Install",
        seoDescription:
          "Local Sydney solar installers offering residential and commercial solar panel, battery and monitoring installations. Get a free, no-obligation quote today.",
        status: "published",
      },
      {
        slug: "western-sydney",
        name: "Western Sydney",
        region: "Western Sydney",
        state: "NSW",
        blurb: "Servicing Western Sydney households and businesses with premium solar and battery systems.",
        description:
          "Western Sydney experiences some of the hottest summer temperatures in the Sydney basin, making solar and battery storage particularly valuable for managing air-conditioning costs. Hujurat Solar is based locally and services all Western Sydney suburbs.",
        heroImage: "/images/location-suburb.jpg",
        seoTitle: "Solar Installer Western Sydney | Hujurat Solar",
        seoDescription:
          "Trusted solar and battery installer for Western Sydney homes and businesses. Local team, genuine workmanship warranty, CEC-accredited installs.",
        status: "published",
      },
      {
        slug: "parramatta",
        name: "Parramatta",
        region: "Western Sydney",
        state: "NSW",
        blurb: "Our home base — fast quotes and local installs for Parramatta homes and businesses.",
        description:
          "Parramatta is home to our showroom and warehouse. We regularly install rooftop solar, battery storage and monitoring systems for houses, townhouses and commercial units throughout the Parramatta LGA.",
        heroImage: "/images/location-suburb.jpg",
        seoTitle: "Solar Panel Installation Parramatta | Hujurat Solar",
        seoDescription:
          "Local Parramatta solar installer. Residential and commercial solar, battery storage and system upgrades. Free site assessment and quote.",
        status: "published",
      },
      {
        slug: "blacktown",
        name: "Blacktown",
        region: "Western Sydney",
        state: "NSW",
        blurb: "Rooftop solar and battery installs across Blacktown and surrounding suburbs.",
        description:
          "Blacktown's mix of established homes and new estates gives us plenty of experience with tile, tin and Colorbond roofs. See our recent Blacktown solar and battery projects below.",
        heroImage: "/images/location-suburb.jpg",
        seoTitle: "Solar Installer Blacktown NSW | Hujurat Solar",
        seoDescription: "Blacktown solar panel and battery installation specialists. Local projects, real results, free quotes.",
        status: "published",
      },
      {
        slug: "penrith",
        name: "Penrith",
        region: "Western Sydney",
        state: "NSW",
        blurb: "Beat Penrith's summer heat with a correctly sized solar and battery system.",
        description:
          "Penrith regularly records the highest temperatures in Sydney during summer. A well-designed solar and battery system helps manage cooling costs while exporting excess energy back to the grid.",
        heroImage: "/images/location-suburb.jpg",
        seoTitle: "Solar Battery Installer Penrith | Hujurat Solar",
        seoDescription: "Solar panel and battery storage installation in Penrith. Locally based team, premium equipment, honest advice.",
        status: "published",
      },
      {
        slug: "liverpool",
        name: "Liverpool",
        region: "South Western Sydney",
        state: "NSW",
        blurb: "Residential and commercial solar installs across Liverpool and South Western Sydney.",
        description:
          "From single-storey family homes to commercial warehouses, our Liverpool projects cover a wide range of system sizes and roof configurations.",
        heroImage: "/images/location-suburb.jpg",
        seoTitle: "Solar Installation Liverpool NSW | Hujurat Solar",
        seoDescription: "Liverpool solar panel and battery installer. Residential and commercial systems, genuine local service.",
        status: "published",
      },
      {
        slug: "camden",
        name: "Camden",
        region: "South Western Sydney",
        state: "NSW",
        blurb: "Solar systems designed for Camden's growing suburbs and acreage properties.",
        description:
          "Camden's larger blocks and acreage properties often suit bigger systems and three-phase installs. We help homeowners size systems correctly for future EV charging and pool pumps.",
        heroImage: "/images/location-suburb.jpg",
        seoTitle: "Solar Installer Camden NSW | Hujurat Solar",
        seoDescription: "Camden solar and battery installation specialists, including acreage and rural properties.",
        status: "published",
      },
    ])
    .returning();

  const findLocation = (slug: string) => locationRows.find((l) => l.slug === slug)!;

  const serviceRows = await db
    .insert(services)
    .values([
      {
        slug: "solar-panels",
        title: "Solar Panels",
        summary: "Tier-1 solar panels supplied and installed by CEC-accredited installers.",
        description:
          "We supply and install high-efficiency, Tier-1 solar panels backed by strong manufacturer warranties. Every system is custom-designed around your roof orientation, shading and household usage to maximise self-consumption and long-term savings.",
        icon: "sun",
        heroImage: "/images/project-residential.jpg",
        order: 1,
        seoTitle: "Solar Panel Installation | Hujurat Solar Supply & Install",
        seoDescription: "Premium Tier-1 solar panel supply and installation across Sydney and Western Sydney. Free quotes, CEC-accredited installers.",
        status: "published",
      },
      {
        slug: "solar-battery",
        title: "Solar Battery Storage",
        summary: "Store your excess solar energy and use it after the sun goes down.",
        description:
          "Battery storage lets you use more of the power your panels generate, reducing reliance on grid electricity in the evening. We install a range of leading battery brands sized to your household's usage patterns.",
        icon: "battery",
        heroImage: "/images/project-battery.jpg",
        order: 2,
        seoTitle: "Solar Battery Installation Sydney | Hujurat Solar",
        seoDescription: "Home battery storage installation in Sydney. Compare battery sizes, brands and expected payback with our local experts.",
        status: "published",
      },
      {
        slug: "solar-installation",
        title: "Solar Installation",
        summary: "End-to-end installation from design through to grid connection.",
        description:
          "Our installation process covers site assessment, system design, council and network approvals, installation day, and grid connection paperwork — handled entirely by our in-house team.",
        icon: "wrench",
        heroImage: "/images/project-residential.jpg",
        order: 3,
        seoTitle: "Solar Installation Sydney | Hujurat Solar Supply & Install",
        seoDescription: "Full-service solar installation in Sydney, from design and approvals through to grid connection.",
        status: "published",
      },
      {
        slug: "solar-system-upgrades",
        title: "Solar System Upgrades",
        summary: "Add panels, upgrade your inverter, or add a battery to an existing system.",
        description:
          "Already have solar? We can assess your existing system and recommend upgrades such as additional panels, a higher-capacity inverter, or retrofitting a battery.",
        icon: "trending-up",
        heroImage: "/images/project-battery.jpg",
        order: 4,
        seoTitle: "Solar System Upgrades Sydney | Hujurat Solar",
        seoDescription: "Upgrade an existing solar system with more panels, a new inverter or battery storage.",
        status: "published",
      },
      {
        slug: "commercial-solar",
        title: "Commercial Solar",
        summary: "Reduce operating costs with commercial-scale solar systems.",
        description:
          "We design and install commercial solar systems for warehouses, retail premises, strata buildings and manufacturing facilities, including three-phase and larger inverter configurations.",
        icon: "building-2",
        heroImage: "/images/project-commercial.jpg",
        order: 5,
        seoTitle: "Commercial Solar Installation Sydney | Hujurat Solar",
        seoDescription: "Commercial solar installation for businesses across Sydney. Lower operating costs with a custom-designed system.",
        status: "published",
      },
      {
        slug: "residential-solar",
        title: "Residential Solar",
        summary: "Custom-designed solar systems for Australian homes.",
        description:
          "From compact townhouses to large family homes, we design residential solar systems that match your roof, household usage and budget.",
        icon: "home",
        heroImage: "/images/project-residential.jpg",
        order: 6,
        seoTitle: "Residential Solar Installation Sydney | Hujurat Solar",
        seoDescription: "Residential solar panel and battery installation across Sydney homes. Free, no-obligation quotes.",
        status: "published",
      },
      {
        slug: "solar-maintenance",
        title: "Solar Maintenance",
        summary: "Keep your system performing at its best with regular servicing.",
        description:
          "Regular maintenance including panel cleaning, inverter checks and system health reports helps protect your investment and catch faults early.",
        icon: "shield-check",
        heroImage: "/images/project-residential.jpg",
        order: 7,
        seoTitle: "Solar Panel Maintenance Sydney | Hujurat Solar",
        seoDescription: "Solar system maintenance and health checks across Sydney. Keep your panels and inverter performing at their best.",
        status: "published",
      },
      {
        slug: "solar-repairs",
        title: "Solar Repairs",
        summary: "Fast, honest diagnosis and repair of underperforming solar systems.",
        description:
          "If your system has stopped generating, is displaying fault codes, or you've noticed a spike in your electricity bill, our technicians can diagnose and repair the issue.",
        icon: "hammer",
        heroImage: "/images/project-battery.jpg",
        order: 8,
        seoTitle: "Solar Panel Repairs Sydney | Hujurat Solar",
        seoDescription: "Solar system fault diagnosis and repairs across Sydney. Fast response, honest pricing.",
        status: "published",
      },
      {
        slug: "solar-monitoring",
        title: "Solar Monitoring",
        summary: "Track your system's performance from your phone in real time.",
        description:
          "We install monitoring systems and apps so you can track generation, consumption and battery status in real time, and get alerted early if performance drops.",
        icon: "activity",
        heroImage: "/images/project-battery.jpg",
        order: 9,
        seoTitle: "Solar Monitoring Systems Sydney | Hujurat Solar",
        seoDescription: "Real-time solar monitoring installation for Sydney homes and businesses.",
        status: "published",
      },
    ])
    .returning();

  const findService = (slug: string) => serviceRows.find((s) => s.slug === slug)!;

  const projectRows = await db
    .insert(projects)
    .values([
      {
        slug: "12-6kw-solar-installation-parramatta",
        title: "12.6kW Solar Installation in Parramatta",
        summary: "A 12.6kW rooftop solar system installed on a double-storey family home in Parramatta.",
        description:
          "This Parramatta family were spending over $650 a quarter on electricity with a growing household and a pool pump running most days. We designed a 12.6kW system split across two roof faces to balance morning and afternoon generation, paired with a 10kW inverter to allow future battery expansion.",
        challenge:
          "The roof had two separate sections with different orientations and an existing evaporative cooling unit that needed to be worked around. We used a mix of panel tilt frames and careful cable routing to maximise usable roof space.",
        outcome:
          "The system now offsets close to 90% of the household's annual electricity usage, and the family has already seen their quarterly bill drop by more than $400.",
        suburb: "Parramatta",
        state: "NSW",
        postcode: "2150",
        locationId: findLocation("parramatta").id,
        systemSizeKw: "12.60",
        batterySizeKwh: null,
        panelBrand: "Jinko Solar Tiger Neo",
        inverterBrand: "Fronius Primo",
        batteryBrand: null,
        projectType: "residential",
        status: "published",
        featured: true,
        featuredImage: "/images/project-residential.jpg",
        installDate: "2024-11-08",
        customerName: "The Ahmed Family",
        customerTestimonial:
          "The Hujurat Solar team was professional from the first site visit through to installation day. Our power bills have dropped dramatically and the system looks great on the roof.",
        seoTitle: "12.6kW Solar Installation in Parramatta NSW | Hujurat Solar",
        seoDescription:
          "See our 12.6kW residential solar installation in Parramatta NSW. Explore the system, installation process, equipment and project results.",
        publishedAt: new Date("2024-11-15"),
      },
      {
        slug: "10kw-solar-battery-installation-blacktown",
        title: "10kW Solar and 13.5kWh Battery Installation in Blacktown",
        summary: "A 10kW solar system paired with a 13.5kWh battery for a Blacktown home targeting full energy independence.",
        description:
          "This Blacktown homeowner wanted to minimise their reliance on grid power and protect against rising electricity prices. We designed a 10kW solar array paired with a 13.5kWh battery, sized to cover the home's typical evening usage.",
        challenge:
          "The switchboard needed an upgrade to safely accommodate the battery and a new dedicated circuit. We coordinated the switchboard upgrade and battery install as a single project to minimise disruption.",
        outcome:
          "The household now runs almost entirely off stored solar energy overnight and only draws from the grid during extended cloudy periods.",
        suburb: "Blacktown",
        state: "NSW",
        postcode: "2148",
        locationId: findLocation("blacktown").id,
        systemSizeKw: "10.00",
        batterySizeKwh: "13.50",
        panelBrand: "REC Alpha Pure",
        inverterBrand: "Sungrow SH10RT",
        batteryBrand: "Sungrow SBR128",
        projectType: "residential",
        status: "published",
        featured: true,
        featuredImage: "/images/project-battery.jpg",
        installDate: "2024-09-22",
        customerName: "M. Nguyen",
        customerTestimonial:
          "Excellent communication throughout the whole process. They explained the battery sizing clearly and the install was clean and tidy.",
        seoTitle: "10kW Solar & 13.5kWh Battery Installation Blacktown | Hujurat Solar",
        seoDescription:
          "See our 10kW solar and 13.5kWh battery installation in Blacktown NSW, including system design, equipment and results.",
        publishedAt: new Date("2024-09-30"),
      },
      {
        slug: "40kw-commercial-solar-installation-liverpool",
        title: "40kW Commercial Solar Installation in Liverpool",
        summary: "A 40kW three-phase commercial solar system installed on a Liverpool warehouse.",
        description:
          "A logistics business operating from a Liverpool warehouse approached us to reduce daytime operating costs from refrigeration and forklift charging. We designed a 40kW three-phase system across the warehouse's north-facing roof.",
        challenge:
          "Working at height on a large warehouse roof required a full safety management plan and coordination with the business to install without interrupting daily operations.",
        outcome:
          "The business is projected to reduce its annual electricity costs by approximately 60%, with a payback period of under four years.",
        suburb: "Liverpool",
        state: "NSW",
        postcode: "2170",
        locationId: findLocation("liverpool").id,
        systemSizeKw: "40.00",
        batterySizeKwh: null,
        panelBrand: "Trina Solar Vertex",
        inverterBrand: "Huawei SUN2000",
        batteryBrand: null,
        projectType: "commercial",
        status: "published",
        featured: true,
        featuredImage: "/images/project-commercial.jpg",
        installDate: "2024-07-03",
        customerName: "Liverpool Logistics Co.",
        customerTestimonial: "Hujurat Solar managed the whole project with minimal disruption to our warehouse operations. Highly recommended for commercial sites.",
        seoTitle: "40kW Commercial Solar Installation Liverpool | Hujurat Solar",
        seoDescription: "See our 40kW three-phase commercial solar installation for a Liverpool warehouse, including design, equipment and results.",
        publishedAt: new Date("2024-07-20"),
      },
      {
        slug: "6-6kw-solar-installation-penrith",
        title: "6.6kW Solar Installation in Penrith",
        summary: "An entry-level 6.6kW solar system installed on a single-storey Penrith home.",
        description:
          "A retired couple in Penrith wanted a straightforward, reliable solar system to reduce their electricity costs without a large upfront investment. We recommended a 6.6kW system, the most common residential system size in NSW.",
        challenge: "Limited north-facing roof space meant careful panel layout across north and west roof faces to maximise generation.",
        outcome: "The system covers the majority of daytime usage and has reduced their quarterly bill by around $280.",
        suburb: "Penrith",
        state: "NSW",
        postcode: "2750",
        locationId: findLocation("penrith").id,
        systemSizeKw: "6.60",
        batterySizeKwh: null,
        panelBrand: "Jinko Solar Tiger Neo",
        inverterBrand: "GoodWe GW6000",
        batteryBrand: null,
        projectType: "residential",
        status: "published",
        featured: false,
        featuredImage: "/images/project-residential.jpg",
        installDate: "2024-05-14",
        customerName: "R. and S. Thompson",
        customerTestimonial: "Straightforward process from quote to installation. No pressure, just honest advice.",
        seoTitle: "6.6kW Solar Installation Penrith NSW | Hujurat Solar",
        seoDescription: "See our 6.6kW residential solar installation in Penrith NSW, including equipment, layout and results.",
        publishedAt: new Date("2024-05-25"),
      },
      {
        slug: "13-3kw-solar-battery-camden-acreage",
        title: "13.3kW Solar and Battery Installation on a Camden Acreage Property",
        summary: "A larger three-phase solar and battery system designed for an acreage property in Camden.",
        description:
          "This Camden acreage property has a large home, a workshop and plans for an EV in the near future. We designed a 13.3kW three-phase system with a 10kWh battery to support current and future usage.",
        challenge: "The property's outbuildings required additional cable runs and a sub-board to distribute power efficiently across the site.",
        outcome: "The homeowners now generate more energy than they currently use, banking credits for when their EV arrives next year.",
        suburb: "Camden",
        state: "NSW",
        postcode: "2570",
        locationId: findLocation("camden").id,
        systemSizeKw: "13.30",
        batterySizeKwh: "10.00",
        panelBrand: "REC Alpha Pure",
        inverterBrand: "Fronius Symo",
        batteryBrand: "BYD Battery-Box Premium HVS",
        projectType: "residential",
        status: "published",
        featured: false,
        featuredImage: "/images/project-battery.jpg",
        installDate: "2024-03-02",
        customerName: "The Whitfield Family",
        customerTestimonial: "They understood exactly what we needed for the property and future-proofed the system for our EV.",
        seoTitle: "13.3kW Solar & Battery Installation Camden | Hujurat Solar",
        seoDescription: "See our 13.3kW three-phase solar and battery installation on an acreage property in Camden NSW.",
        publishedAt: new Date("2024-03-15"),
      },
    ])
    .returning();

  const findProject = (slug: string) => projectRows.find((p) => p.slug === slug)!;

  await db.insert(projectImages).values([
    { projectId: findProject("12-6kw-solar-installation-parramatta").id, url: "/images/project-residential.jpg", alt: "12.6kW solar panels installed on Parramatta home roof", caption: "Completed 12.6kW array", order: 0 },
    { projectId: findProject("10kw-solar-battery-installation-blacktown").id, url: "/images/project-battery.jpg", alt: "10kW solar and battery installation in Blacktown", caption: "Battery and inverter setup", order: 0 },
    { projectId: findProject("40kw-commercial-solar-installation-liverpool").id, url: "/images/project-commercial.jpg", alt: "40kW commercial solar installation on Liverpool warehouse roof", caption: "Warehouse rooftop array", order: 0 },
    { projectId: findProject("6-6kw-solar-installation-penrith").id, url: "/images/project-residential.jpg", alt: "6.6kW solar installation in Penrith", caption: "Finished residential install", order: 0 },
    { projectId: findProject("13-3kw-solar-battery-camden-acreage").id, url: "/images/project-battery.jpg", alt: "13.3kW solar and battery installation on Camden acreage property", caption: "Acreage property solar and battery", order: 0 },
  ]);

  await db.insert(projectVideos).values([
    {
      projectId: findProject("10kw-solar-battery-installation-blacktown").id,
      url: "https://example.com/videos/blacktown-install.mp4",
      thumbnailUrl: "/images/project-battery.jpg",
      title: "10kW Solar and Battery Installation Walkthrough — Blacktown",
      description: "A walkthrough of the completed 10kW solar and 13.5kWh battery installation in Blacktown, NSW.",
      transcript:
        "In this video we walk through the completed 10 kilowatt solar and 13.5 kilowatt hour battery installation at a home in Blacktown, New South Wales. The system includes REC Alpha Pure panels, a Sungrow hybrid inverter and a Sungrow battery, sized to cover the household's typical evening electricity usage.",
    },
  ]);

  await db.insert(testimonials).values([
    {
      customerName: "The Ahmed Family",
      suburb: "Parramatta",
      rating: 5,
      content: "The Hujurat Solar team was professional from the first site visit through to installation day. Our power bills have dropped dramatically.",
      projectId: findProject("12-6kw-solar-installation-parramatta").id,
      featured: true,
      status: "published",
    },
    {
      customerName: "M. Nguyen",
      suburb: "Blacktown",
      rating: 5,
      content: "Excellent communication throughout the whole process. They explained the battery sizing clearly and the install was clean and tidy.",
      projectId: findProject("10kw-solar-battery-installation-blacktown").id,
      featured: true,
      status: "published",
    },
    {
      customerName: "Liverpool Logistics Co.",
      suburb: "Liverpool",
      rating: 5,
      content: "Hujurat Solar managed the whole project with minimal disruption to our warehouse operations. Highly recommended for commercial sites.",
      projectId: findProject("40kw-commercial-solar-installation-liverpool").id,
      featured: true,
      status: "published",
    },
    {
      customerName: "R. and S. Thompson",
      suburb: "Penrith",
      rating: 5,
      content: "Straightforward process from quote to installation. No pressure, just honest advice.",
      projectId: findProject("6-6kw-solar-installation-penrith").id,
      featured: false,
      status: "published",
    },
    {
      customerName: "The Whitfield Family",
      suburb: "Camden",
      rating: 5,
      content: "They understood exactly what we needed for the property and future-proofed the system for our EV.",
      projectId: findProject("13-3kw-solar-battery-camden-acreage").id,
      featured: false,
      status: "published",
    },
  ]);

  await db.insert(blogPosts).values([
    {
      slug: "how-much-does-solar-cost-in-australia",
      title: "How Much Does Solar Cost in Australia in 2025?",
      excerpt: "A breakdown of typical solar system costs in Australia by system size, and the factors that affect your price.",
      content:
        "The cost of a solar system in Australia depends on system size, panel and inverter brand, roof complexity and whether you add battery storage. As a general guide, a 6.6kW system typically costs between $4,500 and $7,000 after the federal rebate (STCs), while larger 10kW+ systems commonly range from $7,000 to $11,000. Adding a battery typically adds $6,000 to $14,000 depending on capacity and brand.\n\nSeveral factors affect your final price: the number of storeys, roof type (tile, tin or Colorbond), switchboard condition, and whether a single or three-phase inverter is required. Always compare quotes based on equipment brand and installer accreditation, not just price per watt.",
      coverImage: "/images/project-residential.jpg",
      category: "Costs & Rebates",
      tags: ["cost", "rebates", "australia"],
      authorName: "Hujurat Solar Team",
      seoTitle: "How Much Does Solar Cost in Australia in 2025? | Hujurat Solar",
      seoDescription: "A practical guide to solar system costs in Australia by system size, plus the key factors that affect your price.",
      status: "published",
      publishedAt: new Date("2025-01-10"),
    },
    {
      slug: "how-many-solar-panels-do-i-need",
      title: "How Many Solar Panels Do I Need for My Home?",
      excerpt: "A simple guide to sizing a solar system based on your electricity usage and roof space.",
      content:
        "The right number of solar panels depends on your household's average daily electricity usage, roof orientation, shading and available roof space. As a starting point, look at your quarterly electricity bill to find your average daily usage in kilowatt-hours (kWh).\n\nA typical Sydney household using around 20kWh per day is often well suited to a 6.6kW to 10kW system, which usually requires 15 to 22 standard 440-460W panels depending on the exact panel wattage chosen. Larger households, or those planning to add an EV or pool, should consider sizing up to 13kW or more.",
      coverImage: "/images/project-residential.jpg",
      category: "Guides",
      tags: ["system sizing", "guides"],
      authorName: "Hujurat Solar Team",
      seoTitle: "How Many Solar Panels Do I Need? | Hujurat Solar",
      seoDescription: "Learn how to size a solar system for your home based on electricity usage, roof space and future needs.",
      status: "published",
      publishedAt: new Date("2025-01-24"),
    },
    {
      slug: "is-solar-battery-worth-it",
      title: "Is a Solar Battery Worth It in 2025?",
      excerpt: "We break down the costs, savings and payback period for home battery storage in Australia.",
      content:
        "Whether a solar battery is worth it depends on your electricity usage pattern, feed-in tariff, and how much you pay for grid electricity in the evening. Households that use most of their electricity after the sun goes down — such as families running appliances in the evening — tend to see the strongest case for a battery.\n\nWith current battery prices and typical usage patterns, payback periods in Sydney generally range from 6 to 10 years, though state and federal battery rebate schemes can significantly shorten this. We recommend reviewing your actual usage data before committing to a battery size.",
      coverImage: "/images/project-battery.jpg",
      category: "Batteries",
      tags: ["battery", "roi"],
      authorName: "Hujurat Solar Team",
      seoTitle: "Is a Solar Battery Worth It in Australia? | Hujurat Solar",
      seoDescription: "An honest look at solar battery costs, savings and payback periods for Australian homes in 2025.",
      status: "published",
      publishedAt: new Date("2025-02-06"),
    },
    {
      slug: "solar-panel-maintenance-checklist",
      title: "Solar Panel Maintenance: A Simple Checklist for Homeowners",
      excerpt: "Keep your solar system performing at its best with this simple maintenance checklist.",
      content:
        "Solar panels are low maintenance, but a few simple checks each year can help protect your investment. Check your inverter display or monitoring app regularly for fault codes or unusually low generation. Keep an eye out for visible debris, bird droppings or shading from new tree growth.\n\nWe recommend a professional inspection every 2 to 3 years, including panel cleaning if needed, tightening of electrical connections, and a full system health check. If you notice a sudden drop in generation, contact your installer promptly rather than waiting for your next bill.",
      coverImage: "/images/project-commercial.jpg",
      category: "Maintenance",
      tags: ["maintenance", "tips"],
      authorName: "Hujurat Solar Team",
      seoTitle: "Solar Panel Maintenance Checklist | Hujurat Solar",
      seoDescription: "A simple, practical solar panel maintenance checklist to help Australian homeowners protect their system.",
      status: "published",
      publishedAt: new Date("2025-02-20"),
    },
  ]);

  console.log("Seed complete.");
}

main()
  .then(() => pool.end())
  .catch((err) => {
    console.error(err);
    return pool.end().finally(() => process.exit(1));
  });
