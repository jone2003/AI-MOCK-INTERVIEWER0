/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:npg_LFD0cT4mVpEU@ep-ancient-poetry-a1ifw0kl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'}
  };