# Jacobo Álvarez · Web profesional

Web personal de Jacobo Álvarez, gestor de banca personal en Madrid. Astro + Tailwind, animaciones con GSAP y Lenis.

## Desarrollo

```bash
npm install
npm run data      # descarga índices (src/data/indices.json) y noticias (src/data/news.json)
npm run dev
```

- Contenido (perfil, experiencia, certificaciones): `src/data/profile.ts`. El CV descargable es `public/CV_Jacobo_Alvarez.pdf`.
- Noticias: `scripts/fetch-news.mjs` recoge titulares de Expansión, Cinco Días, elEconomista, Investing.com y Bolsamanía (RSS), con enlace a la fuente. Página completa en `/noticias`.
- Gráficas de mercados: `scripts/fetch-indices.mjs` descarga 5 años de S&P 500, Nasdaq 100, Euro Stoxx 50, IBEX 35, DAX y Nikkei desde Yahoo Finance (respaldo: Stooq). Ambos scripts se ejecutan en cada build y cada 3 horas en días laborables con la GitHub Action `indices.yml`, que guarda los JSON en `main` y dispara un nuevo despliegue.
- Formulario de contacto: prepara un email con los datos y lo abre en el correo del visitante, con Jacobo como destinatario (sin servidor ni claves).

## Despliegue

Vercel (importar el repositorio, framework Astro, sin configuración extra).
