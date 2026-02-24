export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
      ? parseInt(process.env.DATABASE_PORT, 10)
      : 5432,
    name: process.env.DATABASE_NAME,
  },
});
