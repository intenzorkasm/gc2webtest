import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                contact: resolve(__dirname, 'contact.html'),
                projets: resolve(__dirname, 'projets.html'),
                services: resolve(__dirname, 'services.html'),
                equipe: resolve(__dirname, 'equipe.html'),
                intervention: resolve(__dirname, 'intervention.html'),
                partenaires: resolve(__dirname, 'partenaires.html'),
                admin: resolve(__dirname, 'admin.html'),
            },
        },
    },
})
