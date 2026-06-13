import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // 1. Activation de React dans le moteur de compilation Vite
    react(),
    
    // 2. Configuration et automatisation de la PWA
    VitePWA({
      registerType: 'autoUpdate', // Met à jour l'application automatiquement dès qu'un changement est détecté
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'La Sirba - Menuiserie & Agencement Premium',
        short_name: 'La Sirba',
        description: 'Menuiserie bois, ameublement d\'art, aménagement intérieur et formation d\'excellence au Burkina Faso.',
        theme_color: '#FAF6F0',      // Ocre clair / lin pour la barre système du smartphone
        background_color: '#FAF6F0', // Couleur de fond lors du chargement de l'appli
        display: 'standalone',       // Force l'affichage en plein écran, sans la barre d'adresse du navigateur
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable' // Indispensable pour que l'icône s'adapte parfaitement sur Android
          }
        ]
      },
      workbox: {
        // Stratégie de mise en cache intelligente des fichiers locaux
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // Mise en cache des polices d'écriture Google Fonts pour le mode hors-ligne
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst', // Cherche d'abord dans le cache, ne consomme pas d'internet si déjà visité
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // Garde en mémoire pendant 1 an
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
});