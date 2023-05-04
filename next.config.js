const isProduction = process.env.NODE_ENV === "production";
const basePath = "/budget-tool";

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com", "www.example.com"],
  },
  basePath: basePath,
  env: {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  },
};
