CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"composite_tax" numeric NOT NULL,
	"city_tax" numeric NOT NULL,
	"state_rate" numeric NOT NULL,
	"special_rate" numeric NOT NULL,
	"county_rate" numeric NOT NULL,
	"tax_amount" numeric NOT NULL,
	"total_amount" numeric NOT NULL,
	"subtotal" numeric NOT NULL,
	"jurisdictions" text[] DEFAULT '{}',
	"timestamp" timestamp with time zone NOT NULL,
	"city" text,
	"county" text
);
