import type { NitroConfig } from 'nitropack'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/content', '@nuxt/eslint', '@nuxtjs/tailwindcss', '@nuxt/image', '@nuxtjs/color-mode', '@nuxtjs/i18n'],
  eslint: {
    checker: true,
    config: {
      stylistic: true,
    },
  },
  colorMode: {
    preference: 'system',
    dataValue: 'theme', // for daisyUI
  },
  routeRules: {
    '/products/download': { redirect: { to: '/products', statusCode: 302 } },
    '/download': { redirect: { to: '/products', statusCode: 302 } },
  },
  hooks: {
    async 'nitro:config'(nitroConfig) { await setDownloadRedirects(nitroConfig) },
  },
  i18n: {
    vueI18n: './i18n.config.ts',
    locales: ['en', 'de'],
    defaultLocale: 'en',
  },

})

// Creates redirects for our official downloads. These are needed by GNOME Boxes and other software debepnding on libosinfo.
// Links are registered at https://gitlab.com/libosinfo/osinfo-db/-/blob/4c64cef/data/os/manjaro.org/manjaro-rolling.xml.in
const setDownloadRedirects = async (nitroConfig: NitroConfig) => {
  const rules = nitroConfig!.routeRules
  const resp = await fetch('https://gitlab.manjaro.org/api/v4/projects/12597/repository/files/file-info.json/raw?ref=master')
  const isos = await resp.json()
  const add = (desktop: string) => {
    rules!['/download/' + desktop] = { redirect: { to: isos.official[desktop].image, statusCode: 302 } }
  }
  add('gnome')
  add('plasma')
  add('xfce')
}
