import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"

export default defineConfig({
  // Cambiar cuando tengamos el dominio definitivo
  site: "https://jacobo-porfolio.vercel.app",
  integrations: [tailwind({ applyBaseStyles: false })],
})
