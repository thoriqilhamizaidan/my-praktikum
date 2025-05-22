import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
module.exports = {
  theme: {
    extend: {
      height: {
        'screen-full': '100vh',
      },
    },
  },
};