// import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  components: true,
  css: [`@/assets/css/main.css`],
  app: {
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "icons/favicon.ico" }],
    },
  },

  modules: ["@vite-pwa/nuxt"],
  pwa: {
    manifest: {
      name: "Super Tennis Availability",
      short_name: "Tennis",
      // start_url: "https://super-tennis-availability.vercel.app/",
      description: "A Tennis Court Availability Frontend",
      screenshots: [
        {
          src: "screenshot-1280x720.png",
          type: "image/png",
          sizes: "1280x720",
          form_factor: "wide",
        },
        {
          src: "screenshot-375x667.png",
          type: "image/png",
          sizes: "375x667",
          form_factor: "narrow",
        },
      ],
      icons: [
        {
          src: "icons/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "icons/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "icons/apple-touch-icon-new.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      theme_color: "#5d9caa",
      background_color: "#5d9caa",
    },

    workbox: {
      navigateFallback: "/",
    },

    // For DevTools debugging... I think?
    devOptions: { enabled: true, type: "module" },
  },
});
