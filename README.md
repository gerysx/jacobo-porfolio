# Jacobo Álvarez · Web profesional

Web personal de Jacobo Álvarez, gestor de banca personal en Madrid. Astro + Tailwind, animaciones con GSAP y Lenis.

## Desarrollo

```bash
npm install
npm run indices   # descarga los datos de los índices (src/data/indices.json)
npm run dev
```

- Contenido (perfil, experiencia, certificaciones): `src/data/profile.ts`.
- Gráficas de mercados: `scripts/fetch-indices.mjs` descarga 5 años de S&P 500, Nasdaq 100, Euro Stoxx 50, IBEX 35, DAX y Nikkei desde Yahoo Finance (respaldo: Stooq). Se ejecuta en cada build y a diario con la GitHub Action `indices.yml`, que guarda el JSON y dispara un nuevo despliegue.
- Formulario de contacto: prepara un email con los datos y lo abre en el correo del visitante, con Jacobo como destinatario (sin servidor ni claves).

## Despliegue

Vercel (importar el repositorio, framework Astro, sin configuración extra).
