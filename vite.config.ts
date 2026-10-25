import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['icon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png', 'arshdeep-profile.jpg'],
        manifest: {
          id: './',
          name: 'Arshdeep Kaur | AI & ML Graduate Portfolio',
          short_name: 'Arshdeep AI',
          description: 'AI & ML Graduate with hands-on experience in Machine Learning, Computer Vision, and Data Analytics.',
          theme_color: '#090a0f',
          background_color: '#090a0f',
          display: 'standalone',
          start_url: './',
          scope: './',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: 'pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json}'],
          navigateFallback: 'index.html',
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
      {
        name: 'chat-api-middleware',
        configureServer(server) {
          server.middlewares.use('/api/chat', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method Not Allowed');
              return;
            }
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', async () => {
              try {
                const { query, retrievedChunks } = JSON.parse(body || '{}');
                const apiKey = process.env.GEMINI_API_KEY;
                if (!apiKey) {
                  res.statusCode = 503;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'No GEMINI_API_KEY configured' }));
                  return;
                }
                const { GoogleGenAI } = await import('@google/genai');
                const ai = new GoogleGenAI({ apiKey });
                const contextText = (retrievedChunks || [])
                  .map((c: { title: string; category: string; content: string }, i: number) => `[Source ${i + 1}: ${c.title} (${c.category})]\n${c.content}`)
                  .join('\n\n');

                const systemInstruction = `You are the official portfolio AI for Arshdeep Kaur, an AI & Machine Learning Graduate based in Chandigarh, India.
You must answer questions truthfully and exclusively using the provided verified context chunks below.
CRITICAL GROUNDING RULES:
1. Answer only using facts present in the provided context chunks.
2. If the user asks about something not mentioned in the context (for example personal trivia, unrelated topics, or claims not verified in the context), reply: "I don't have information about that in Arshdeep's verified portfolio."
3. If asked "Does she know React?", state that she has hands-on working knowledge of React, TypeScript, and Tailwind CSS for modern web and portfolio interfaces, while her primary specialization is Applied AI and Machine Learning.
4. Keep answers professional, concise, structured with bullet points where appropriate, and cite the source project or credential.`;

                const response = await ai.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: `Retrieved Verified Portfolio Facts:\n${contextText}\n\nUser Question: ${query}\n\nPlease provide a grounded, concise answer:`,
                  config: {
                    systemInstruction,
                  }
                });

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ answer: response.text }));
              } catch (err: unknown) {
                const errMsg = err instanceof Error ? err.message : 'Server error';
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: errMsg }));
              }
            });
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
