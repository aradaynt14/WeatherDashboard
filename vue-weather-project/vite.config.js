import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  // 1) load .env, .env.local, .env.development, .env.development.local
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  console.log('⚙️ loaded VITE_WEATHER_API_KEY:', env.VITE_WEATHER_API_KEY)

  return {
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
    }
  }
})
