import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function ttsProxyPlugin(): Plugin {
  return {
    name: 'tts-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/tts', async (req, res) => {
        try {
          const url = new URL(req.url || '', 'http://localhost');
          const q = url.searchParams.get('q') || '';
          const tl = url.searchParams.get('tl') || 'en';

          if (!q) {
            res.statusCode = 400;
            res.end('Missing text parameter');
            return;
          }

          const fetchTtsChunk = async (chunkText: string): Promise<Buffer> => {
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
              chunkText
            )}&tl=${encodeURIComponent(tl)}&client=tw-ob`;

            const response = await fetch(ttsUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              },
            });

            if (!response.ok) {
              throw new Error(`Google TTS status ${response.status}`);
            }

            const arrayBuf = await response.arrayBuffer();
            return Buffer.from(arrayBuf);
          };

          // Split long text into safe segments under 180 chars
          const chunks: string[] = [];
          let remaining = q;
          while (remaining.length > 0) {
            if (remaining.length <= 180) {
              chunks.push(remaining);
              break;
            }
            let idx = remaining.lastIndexOf('.', 180);
            if (idx < 40) idx = remaining.lastIndexOf(' ', 180);
            if (idx < 0) idx = 180;
            chunks.push(remaining.slice(0, idx + 1).trim());
            remaining = remaining.slice(idx + 1).trim();
          }

          const buffers = await Promise.all(chunks.map((c) => fetchTtsChunk(c)));
          const combined = Buffer.concat(buffers);

          res.setHeader('Content-Type', 'audio/mpeg');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.end(combined);
        } catch (err: unknown) {
          console.error('[TTS Proxy Error]', err);
          res.statusCode = 500;
          res.end('TTS Proxy Error');
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ttsProxyPlugin()],
  server: {
    port: 3000,
    open: false,
    host: true,
  },
});
