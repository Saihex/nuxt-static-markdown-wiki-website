// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  components: [
    {
      path: "~/components",
      pathPrefix: true
    }
  ],
  css: ["~/assets/css/primary.css"],
  modules: ["@nuxtjs/tailwindcss", "@nuxtjs/google-fonts", "@nuxt/image", "@nuxt/content"],

  routeRules: {
    "/**": {
      headers: {
        "cache-control": "public, max-age=7200"
      }
    }
  },
  ssr: true,

  tailwindcss: {},
  googleFonts: {
    preload: true,
    families: { Roboto: true },
  },

  content: {
    markdown: {
      // Object syntax can be used to override default options
      anchorLinks: {
        exclude: [0]
      }
    }
  },

  app: {
    head: {
      title: "Saihex",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Saihex Studios' official website.",
        },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "~/public/favicon.ico" },
      ] /*,
            script: [
                { hid: 'twitterWidgets', src: 'https://platform.twitter.com/widgets.js', defer: true }
            ]*/,
    },
  },
});