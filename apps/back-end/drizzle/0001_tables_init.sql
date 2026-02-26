CREATE TABLE "config" (
	"id" serial PRIMARY KEY NOT NULL,
	"base_tax" integer NOT NULL,
	"state_geom" geometry(MultiPolygon, 4326)
);
--> statement-breakpoint
CREATE TABLE "borough" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"geom" geometry(MultiPolygon, 4326)
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"geom" geometry(MultiPolygon, 4326)
);
--> statement-breakpoint
CREATE TABLE "counties" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"geom" geometry(MultiPolygon, 4326)
);
--> statement-breakpoint
CREATE TABLE "water" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"geom" geometry(MultiPolygon, 4326)
);
--> statement-breakpoint
CREATE INDEX "co_spatial_index" ON "config" USING gist ("state_geom");--> statement-breakpoint
CREATE INDEX "b_spatial_index" ON "borough" USING gist ("geom");--> statement-breakpoint
CREATE INDEX "ci_spatial_index" ON "cities" USING gist ("geom");--> statement-breakpoint
CREATE INDEX "c_spatial_index" ON "counties" USING gist ("geom");--> statement-breakpoint
CREATE INDEX "w_spatial_index" ON "water" USING gist ("geom");