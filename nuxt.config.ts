// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  devServer: {
    port: 3002,
  },
  runtimeConfig: {
    apiBase: process.env.API_BASE || "http://localhost:3001/",
    public: {
      apiBase: "/api",
    },
  },
});
