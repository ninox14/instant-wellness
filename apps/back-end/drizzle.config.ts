import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

const path =
  process.env.NODE_ENV === 'prod'
    ? `${process.cwd()}/config/.env.production.local`
    : `${process.cwd()}/config/.env.development.local`;

config({ path, quiet: true });

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/*.schema.ts',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
  migrations: { table: 'journal', schema: 'drizzle' },
});
