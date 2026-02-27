import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import fs from 'node:fs';

let path =
  process.env.NODE_ENV === 'prod'
    ? `${process.cwd()}/config/.env.production.local`
    : `${process.cwd()}/config/.env.development.local`;

const isPathExist = fs.existsSync(path);

if (!isPathExist) {
  path = `${process.cwd()}/.env`;
}

config({ path, quiet: true });

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/*.schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  migrations: { table: 'journal', schema: 'drizzle' },
});
