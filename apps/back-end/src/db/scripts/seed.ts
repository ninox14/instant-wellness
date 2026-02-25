import { sql } from 'drizzle-orm';
import { createDrizzleInstance, DrizzleClient } from '../index.js';
import shapefile from 'shapefile';
import path from 'node:path';
import { config } from 'dotenv';
import { getConfigPath } from '../../utils/index.js';
import { config as configSchema } from '../schema/config.schema.js';

config({ path: getConfigPath(), quiet: true });

const SHAPEFILES_LOCATION = path.resolve(process.cwd(), 'shapefiles');
const BATCH_AMOUNT = 50;
const BASE_STATE_TAX = 4;

async function main() {
  const db = createDrizzleInstance();

  await seedGISData(db);

  process.exit();
}

async function seedConfig(db: DrizzleClient) {
  const existingConfig = await db.select().from(configSchema).execute();

  if (existingConfig.length) {
    console.log('Config already exists, skipping step');
    return;
  }

  console.log('Seeding config...');
  console.log(`Base state tax: ${BASE_STATE_TAX}`);

  const source = await shapefile.open(
    path.resolve(SHAPEFILES_LOCATION, 'State_Shoreline.shp'),
    path.resolve(SHAPEFILES_LOCATION, 'State_Shoreline.dbf'),
  );

  const stateData = await source.read();
  await source.cancel();

  await db.execute(
    sql`INSERT INTO config (base_tax, state_geom) VALUES (${BASE_STATE_TAX}, ST_Transform(
        ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(stateData.value.geometry)}), 26918), 
        4326)
  );`,
  );
}

async function seedCounties(db: DrizzleClient) {
  console.log('Clearing cities table...');

  await db.execute(sql`DELETE FROM counties;`);

  console.log('Seeding counties...');
  console.log('Reading from shp & dbf files...');

  const source = await shapefile.open(
    path.resolve(SHAPEFILES_LOCATION, 'Counties_Shoreline.shp'),
    path.resolve(SHAPEFILES_LOCATION, 'Counties_Shoreline.dbf'),
  );

  let result = await source.read();

  const batch: string[] = [];
  let batchCount = 1;

  while (!result.done) {
    const { properties, geometry } = result.value;

    if (!properties) {
      result = await source.read();
      continue;
    }

    batch.push(
      `('${properties.NAME}', ST_Transform(
        ST_SetSRID(ST_GeomFromGeoJSON('${JSON.stringify(geometry)}'), 26918), 
        4326
      ))`,
    );

    if (batch.length >= BATCH_AMOUNT) {
      await db.execute(
        sql`INSERT INTO counties(name, geom) VALUES ${sql.raw(batch.join(','))}`,
      );

      console.log(
        `[Batch #${batchCount}] Inserted ${BATCH_AMOUNT} records into db`,
      );

      batchCount++;

      batch.length = 0;
    }

    result = await source.read();
  }

  await db.execute(
    sql`INSERT INTO counties(name, geom) VALUES ${sql.raw(batch.join(','))}`,
  );

  console.log(
    `[Batch #${batchCount}] Inserted ${batch.length} records into db`,
  );
}

async function seedCities(db: DrizzleClient) {
  console.log('Clearing cities table...');

  await db.execute(sql`DELETE FROM cities;`);

  console.log('Seeding cities...');
  console.log('Reading from shp & dbf files...');

  const source = await shapefile.open(
    path.resolve(SHAPEFILES_LOCATION, 'Cities.shp'),
    path.resolve(SHAPEFILES_LOCATION, 'Cities.dbf'),
  );

  let result = await source.read();

  const batch: string[] = [];
  let batchCount = 1;

  while (!result.done) {
    const { properties, geometry } = result.value;

    if (!properties) {
      result = await source.read();

      continue;
    }

    batch.push(
      `('${properties.NAME}', ST_Transform(
        ST_SetSRID(ST_GeomFromGeoJSON('${JSON.stringify(geometry)}'), 26918), 
        4326
      ))`,
    );

    if (batch.length >= BATCH_AMOUNT) {
      await db.execute(
        sql`INSERT INTO cities(name, geom) VALUES ${sql.raw(batch.join(','))}`,
      );

      console.log(
        `[Batch #${batchCount}] Inserted ${BATCH_AMOUNT} records into db`,
      );

      batchCount++;

      batch.length = 0;
    }

    result = await source.read();
  }

  await db.execute(
    sql`INSERT INTO cities(name, geom) VALUES ${sql.raw(batch.join(','))}`,
  );

  console.log(
    `[Batch #${batchCount}] Inserted ${batch.length} records into db`,
  );
}

async function seedGISData(db: DrizzleClient) {
  await seedConfig(db);
  await seedCounties(db);
  await seedCities(db);
}

main().catch(console.error);
