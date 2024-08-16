import { defineNuxtConfig } from "nuxt3";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  components: true,
  css: [`@/assets/css/main.css`],
  app: {
    header: {
      link: [
        { rel: "icon", type: "image/x-icon", href: "icons/favicon.ico" },
        { rel: "manifest", href: "/manifest.json" },
      ],
    },
  },
});
