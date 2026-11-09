import { defineConfig } from 'astro/config'
import { website } from 'wima-docs-website-template'

export default defineConfig({
  outDir: './docs',
  publicDir: './assets',
  integrations: [
    website({
      apiSourceDir: 'packages'
    })
  ]
})
