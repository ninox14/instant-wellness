import { SQL, sql } from 'drizzle-orm';
import { createDrizzleInstance } from '../index.js';
import shapefile from 'shapefile';
import path from 'node:path';
import { config } from 'dotenv';
import { getConfigPath } from '../../utils/index.js';
import { config as configSchema } from '../schema/config.schema.js';
import { DrizzleClient } from '../constants.js';

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

  const stateSource = await shapefile.open(
    path.resolve(SHAPEFILES_LOCATION, 'State_Shoreline.shp'),
    path.resolve(SHAPEFILES_LOCATION, 'State_Shoreline.dbf'),
  );

  const stateData = await stateSource.read();
  await stateSource.cancel();

  await db.execute(
    sql`INSERT INTO config (base_tax, state_geom) VALUES (${BASE_STATE_TAX}, ST_Transform(
        ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(stateData.value.geometry)}), 26918), 
        4326)
  );`,
  );
}

async function seed({
  db,
  dbfFileName,
  shpFileName,
  tableName,
}: {
  db: DrizzleClient;
  shpFileName: string;
  dbfFileName: string;
  tableName: string;
}) {
  console.log(`Clearing ${tableName} table...`);

  await db.execute(sql`DELETE FROM ${sql.identifier(tableName)};`);

  console.log(`Seeding ${tableName}...`);
  console.log('Reading from shp & dbf files...');

  const source = await shapefile.open(
    path.resolve(SHAPEFILES_LOCATION, shpFileName),
    path.resolve(SHAPEFILES_LOCATION, dbfFileName),
  );

  let result = await source.read();

  const batch: SQL[] = [];
  let batchCount = 1;

  while (!result.done) {
    const { properties, geometry } = result.value;

    if (!properties) {
      result = await source.read();
      continue;
    }

    const geodataType = properties.boroname ? 4326 : 26918;
    const name = properties.NAME || properties.boroname;

    batch.push(
      sql`(${name}, ST_Transform(
        ST_SetSRID(ST_GeomFromGeoJSON(${JSON.stringify(geometry)}), ${geodataType}), 
        4326
      ))`,
    );

    if (batch.length >= BATCH_AMOUNT) {
      await db.execute(
        sql`INSERT INTO ${sql.identifier(tableName)}(name, geom) VALUES ${sql.join(batch, sql`,`)}`,
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
    sql`INSERT INTO ${sql.identifier(tableName)}(name, geom) VALUES ${sql.join(batch, sql`,`)}`,
  );

  console.log(
    `[Batch #${batchCount}] Inserted ${batch.length} records into db`,
  );
}

async function seedGISData(db: DrizzleClient) {
  await seedConfig(db);

  await seed({
    db,
    shpFileName: 'State_WaterPolygons.shp',
    dbfFileName: 'State_WaterPolygons.dbf',
    tableName: 'water',
  });

  await seed({
    db,
    shpFileName: 'Cities.shp',
    dbfFileName: 'Cities.dbf',
    tableName: 'cities',
  });

  await seed({
    db,
    shpFileName: 'Counties_Shoreline.shp',
    dbfFileName: 'Counties_Shoreline.dbf',
    tableName: 'counties',
  });

  await seed({
    db,
    shpFileName: 'NYC_Borough.shp',
    dbfFileName: 'NYC_Borough.dbf',
    tableName: 'borough',
  });
}

main().catch(console.error);
