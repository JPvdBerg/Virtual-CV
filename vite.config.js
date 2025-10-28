import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Use the repository name as the base path
  base: '/Virtual-CV/', 
  plugins: [react()],
})