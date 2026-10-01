import { defineConfig, fontProviders } from 'astro/config'
import sitemap from '@astrojs/sitemap'

export default defineConfig({
  site: 'https://example.invalid',
  integrations: [sitemap()],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Roboto Serif',
      cssVariable: '--font-roboto-serif',
      fallbacks: ['serif'],
      options: {
        variants: [
          {
            weight: 400,
            style: 'normal',
            src: ['./src/assets/fonts/roboto-serif.woff2'],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Roboto',
      cssVariable: '--font-roboto',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            weight: 400,
            style: 'normal',
            src: ['./src/assets/fonts/roboto-400.woff2'],
          },
          {
            weight: 300,
            style: 'normal',
            src: ['./src/assets/fonts/roboto-300.woff2'],
          },
        ],
      },
    },
  ],
})
