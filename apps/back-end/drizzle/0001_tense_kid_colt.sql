CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE counties (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  geom geometry(MultiPolygon, 4326) NOT NULL
);

CREATE TABLE cities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  geom geometry(MultiPolygon, 4326) NOT NULL
);

CREATE INDEX counties_geom_idx ON counties USING GIST (geom);
CREATE INDEX cities_geom_idx ON cities USING GIST (geom);