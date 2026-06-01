import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  plugins: [vue()],
  // vite-ssg: emit each route as <route>/index.html so a plain static nginx
  // serves /resume → /resume/ → index.html without any try_files config.
  ssgOptions: {
    dirStyle: 'nested',
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split the heavy, rarely-changing libraries into their own cacheable
        // chunks so the app code stays small and a redeploy doesn't bust the
        // three.js / gsap caches. Function form so it's a no-op in the SSG
        // server build (where these are externalised, not chunked).
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion'
        },
      },
    },
  },
})
