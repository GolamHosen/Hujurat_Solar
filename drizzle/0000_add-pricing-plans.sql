CREATE TYPE "public"."content_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('google_organic', 'google_ads', 'facebook', 'instagram', 'referral', 'direct', 'other');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'quote_sent', 'follow_up', 'won', 'lost');--> statement-breakpoint
CREATE TYPE "public"."project_type" AS ENUM('residential', 'commercial');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(255) DEFAULT 'Admin' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(220) NOT NULL,
	"title" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text,
	"cover_image" text,
	"category" varchar(120),
	"tags" text[],
	"author_name" varchar(160) DEFAULT 'Hujurat Solar Team' NOT NULL,
	"seo_title" varchar(255),
	"seo_description" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(160) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(60),
	"suburb" varchar(120),
	"property_type" varchar(60),
	"electricity_bill" varchar(60),
	"interested_service" varchar(160),
	"system_size_interest" varchar(60),
	"battery_required" boolean DEFAULT false,
	"message" text,
	"preferred_date" varchar(60),
	"preferred_time_slot" varchar(60),
	"consultation_type" varchar(60),
	"source" "lead_source" DEFAULT 'direct' NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"name" varchar(160) NOT NULL,
	"region" varchar(160),
	"state" varchar(10) DEFAULT 'NSW' NOT NULL,
	"blurb" text,
	"description" text,
	"hero_image" text,
	"seo_title" varchar(255),
	"seo_description" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "locations_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"filename" varchar(255) NOT NULL,
	"mime_type" varchar(100),
	"size" integer,
	"alt" varchar(255),
	"caption" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pricing_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
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
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "pricing_plans_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "project_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"url" text NOT NULL,
	"alt" varchar(255),
	"caption" varchar(255),
	"order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project_videos" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"title" varchar(255),
	"description" text,
	"transcript" text
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(220) NOT NULL,
	"title" varchar(220) NOT NULL,
	"summary" text,
	"description" text,
	"challenge" text,
	"outcome" text,
	"suburb" varchar(120) NOT NULL,
	"state" varchar(10) DEFAULT 'NSW' NOT NULL,
	"postcode" varchar(10),
	"location_id" integer,
	"system_size_kw" numeric(6, 2),
	"battery_size_kwh" numeric(6, 2),
	"panel_brand" varchar(120),
	"inverter_brand" varchar(120),
	"battery_brand" varchar(120),
	"project_type" "project_type" DEFAULT 'residential' NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"featured_image" text,
	"install_date" date,
	"customer_name" varchar(160),
	"customer_testimonial" text,
	"seo_title" varchar(255),
	"seo_description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(160) NOT NULL,
	"title" varchar(200) NOT NULL,
	"summary" text,
	"description" text,
	"icon" varchar(60) DEFAULT 'sun' NOT NULL,
	"hero_image" text,
	"order" integer DEFAULT 0 NOT NULL,
	"seo_title" varchar(255),
	"seo_description" text,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" serial PRIMARY KEY NOT NULL,
	"customer_name" varchar(160) NOT NULL,
	"suburb" varchar(120),
	"rating" integer DEFAULT 5 NOT NULL,
	"content" text NOT NULL,
	"project_id" integer,
	"featured" boolean DEFAULT false NOT NULL,
	"status" "content_status" DEFAULT 'published' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_videos" ADD CONSTRAINT "project_videos_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_location_id_locations_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonials" ADD CONSTRAINT "testimonials_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;