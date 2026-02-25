CREATE TABLE config (
  id SERIAL PRIMARY KEY,
  base_tax INTEGER NOT NULL,
  state_geom geometry(MultiPolygon, 4326) NOT NULL
);

CREATE INDEX state_geom_idx ON config USING GIST (state_geom);
