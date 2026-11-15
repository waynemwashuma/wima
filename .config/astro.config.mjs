import { defineConfig } from 'astro/config'
import { website } from 'wima-docs-website-template'
import { getReflectionKindSlug } from 'wima-docs-website-template/utils/typedoc.js'

/**
 * @param {string} value
 */
function slugifyRouteSegment(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

export default defineConfig({
  outDir: './docs',
  publicDir: './assets',
  integrations: [
    website({
      apiSourceDir: 'packages',
      sourceBranch: 'dev',
      seo: {
        siteName: 'Wima',
        siteDescription: 'Wima is a modular, browser-focused game engine.',
        locale: 'en',
        socialImage: {
          src: '/branding/logo/wima-logo-dark.png',
          alt: 'Wima engine'
        }
      },
      theme: {
        default: 'auto',
        schemes: {
          light: {
            logo: {
              src: '/branding/logo/wima-logo-long-light.png',
              alt: 'Wima'
            },
            favicon: '/branding/logo/wima-logo-light.png',
            appleTouchIcon: '/branding/logo/wima-logo-light.png',
            colors: {
              background: '#ededed',
              panel: '#ffffffb8',
              surface: '#ffffffe6',
              surfaceRaised: '#ffffffe6',
              text: '#151515',
              muted: '#5f5f5f',
              border: '#14141429',
              borderStrong: '#2f9e44',
              accent: '#2f9e44',
              accentSecondary: '#6b9d38',
              codeBackground: '#ffffffe6',
              codeText: '#151515'
            }
          },
          dark: {
            logo: {
              src: '/branding/logo/wima-logo-long-dark.png',
              alt: 'Wima'
            },
            favicon: '/branding/logo/wima-logo-dark.png',
            appleTouchIcon: '/branding/logo/wima-logo-dark.png',
            colors: {
              background: '#1b1b1b',
              panel: '#252525eb',
              surface: '#2f2f2ff5',
              surfaceRaised: '#2f2f2ff5',
              text: '#f2f2f2',
              muted: '#aaaaaa',
              border: '#f0f0f029',
              borderStrong: '#70df78',
              accent: '#70df78',
              accentSecondary: '#b5d86c',
              codeBackground: '#252525eb',
              codeText: '#f2f2f2'
            }
          }
        }
      },
      apiEntryRoute: (path, reflection, category) => {
        const [packageName] = path.split('/')
        const typeName = reflection.name
        const packageRoute = slugifyRouteSegment(packageName)

        if (!category) {
          return `${packageRoute}/others/${getReflectionKindSlug(reflection.kind)}/${typeName}`
        }

        return `${packageRoute}/${slugifyRouteSegment(category)}/${typeName}`
      }
    })
  ]
})
