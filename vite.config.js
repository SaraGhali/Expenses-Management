import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'firebase-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Expenses Management System',
        short_name: 'Expenses',
        description: 'Track and manage your expenses efficiently with real-time income and expense tracking',
        theme_color: '#667eea',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/icon-192x192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/icon-512x512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any'
          }
        ],
        screenshots: [
          {
            src: '/screenshot-540.svg',
            sizes: '540x720',
            type: 'image/svg+xml',
            form_factor: 'narrow'
          },
          {
            src: '/screenshot-1280.svg',
            sizes: '1280x720',
            type: 'image/svg+xml',
            form_factor: 'wide'
          }
        ],
        categories: ['finance', 'productivity'],
        shortcuts: [
          {
            name: 'Add Expense',
            short_name: 'Add',
            description: 'Quickly add a new expense',
            url: '/expenses',
            icons: [
              {
                src: '/icon-192x192.svg',
                sizes: '192x192'
              }
            ]
          },
          {
            name: 'View Summary',
            short_name: 'Summary',
            description: 'View monthly summary',
            url: '/summary',
            icons: [
              {
                src: '/icon-192x192.svg',
                sizes: '192x192'
              }
            ]
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  server: {
    port: 3001,
    open: true
  }
})
