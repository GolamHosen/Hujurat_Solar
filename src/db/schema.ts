import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  numeric,
  boolean,
  timestamp,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";

export const contentStatusEnum = pgEnum("content_status", ["draft", "published"]);
export const projectTypeEnum = pgEnum("project_type", ["residential", "commercial"]);
export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "quote_sent",
  "follow_up",
  "won",
  "lost",
]);
export const leadSourceEnum = pgEnum("lead_source", [
  "google_organic",
  "google_ads",
  "facebook",
  "instagram",
  "referral",
  "direct",
  "other",
]);

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull().default("Admin"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  name: varchar("name", { length: 160 }).notNull(),
  region: varchar("region", { length: 160 }),
  state: varchar("state", { length: 10 }).notNull().default("NSW"),
  blurb: text("blurb"),
  description: text("description"),
  heroImage: text("hero_image"),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  status: contentStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 160 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  summary: text("summary"),
  description: text("description"),
  icon: varchar("icon", { length: 60 }).notNull().default("sun"),
  heroImage: text("hero_image"),
  order: integer("order").notNull().default(0),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  status: contentStatusEnum("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  title: varchar("title", { length: 220 }).notNull(),
  summary: text("summary"),
  description: text("description"),
  challenge: text("challenge"),
  outcome: text("outcome"),
  suburb: varchar("suburb", { length: 120 }).notNull(),
  state: varchar("state", { length: 10 }).notNull().default("NSW"),
  postcode: varchar("postcode", { length: 10 }),
  locationId: integer("location_id").references(() => locations.id, { onDelete: "set null" }),
  systemSizeKw: numeric("system_size_kw", { precision: 6, scale: 2 }),
  batterySizeKwh: numeric("battery_size_kwh", { precision: 6, scale: 2 }),
  panelBrand: varchar("panel_brand", { length: 120 }),
  inverterBrand: varchar("inverter_brand", { length: 120 }),
  batteryBrand: varchar("battery_brand", { length: 120 }),
  projectType: projectTypeEnum("project_type").notNull().default("residential"),
  status: contentStatusEnum("status").notNull().default("draft"),
  featured: boolean("featured").notNull().default(false),
  featuredImage: text("featured_image"),
  installDate: date("install_date"),
  customerName: varchar("customer_name", { length: 160 }),
  customerTestimonial: text("customer_testimonial"),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  publishedAt: timestamp("published_at"),
});

export const projectImages = pgTable("project_images", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  alt: varchar("alt", { length: 255 }),
  caption: varchar("caption", { length: 255 }),
  order: integer("order").notNull().default(0),
});

export const projectVideos = pgTable("project_videos", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  title: varchar("title", { length: 255 }),
  description: text("description"),
  transcript: text("transcript"),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 220 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content"),
  coverImage: text("cover_image"),
  category: varchar("category", { length: 120 }),
  tags: text("tags").array(),
  authorName: varchar("author_name", { length: 160 }).notNull().default("Hujurat Solar Team"),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDescription: text("seo_description"),
  status: contentStatusEnum("status").notNull().default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  customerName: varchar("customer_name", { length: 160 }).notNull(),
  suburb: varchar("suburb", { length: 120 }),
  rating: integer("rating").notNull().default(5),
  content: text("content").notNull(),
  projectId: integer("project_id").references(() => projects.id, { onDelete: "set null" }),
  featured: boolean("featured").notNull().default(false),
  status: contentStatusEnum("status").notNull().default("published"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 60 }),
  suburb: varchar("suburb", { length: 120 }),
  propertyType: varchar("property_type", { length: 60 }),
  electricityBill: varchar("electricity_bill", { length: 60 }),
  interestedService: varchar("interested_service", { length: 160 }),
  systemSizeInterest: varchar("system_size_interest", { length: 60 }),
  batteryRequired: boolean("battery_required").default(false),
  message: text("message"),
  source: leadSourceEnum("source").notNull().default("direct"),
  status: leadStatusEnum("status").notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  filename: varchar("filename", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }),
  size: integer("size"),
  alt: varchar("alt", { length: 255 }),
  caption: varchar("caption", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
