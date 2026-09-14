# Sitio web — Psicóloga (Terapia Online)

Next.js 16 + Prisma (SQLite en desarrollo) + panel de administración propio.
Todo el contenido del sitio (textos, precios, blog, FAQ, testimonios, imágenes,
datos de contacto) vive en base de datos y se edita desde `/admin`, sin tocar código.

## Desarrollo local

```bash
npm install
npx prisma migrate dev   # crea/actualiza la base de datos local (dev.db)
npx prisma db seed       # carga el contenido inicial desde el brief
npm run dev
```

Sitio público: http://localhost:3000
Panel admin: http://localhost:3000/admin

Credenciales iniciales del panel (definidas en `.env`, cambiar la contraseña
desde `/admin/cuenta` después del primer login):

- Email: el valor de `ADMIN_EMAIL` en `.env`
- Contraseña: el valor de `ADMIN_PASSWORD` en `.env`

## Estructura

- `src/app/*` — páginas públicas (Inicio, Sobre mí, Servicios, Cómo trabajo, Blog, Contacto)
- `src/app/admin/*` — panel privado (protegido por `src/proxy.ts` + sesión firmada con JWT)
- `prisma/schema.prisma` — modelo de datos de todo el contenido editable
- `prisma/seed.ts` — contenido inicial cargado desde el brief original
- `src/lib/uploads.ts` — subida de imágenes a `/public/uploads` (ver nota de producción abajo)

## Antes de lanzar (pendientes del brief original)

Estos puntos quedaron marcados como "consultar" en el contenido inicial y se
completan desde el panel admin apenas la psicóloga confirme los datos:

1. Métodos de pago, momento del cobro, precios, factura, obra social (`/admin/pagos`, `/admin/servicios`)
2. Reserva directa en la web vs. WhatsApp (`/admin/configuracion` → Agenda y reserva)
3. Teléfono visible o solo tras contacto (`/admin/configuracion` → Contacto)
4. Usuarios de cada red social (`/admin/configuracion` → Redes sociales)
5. Nombre y descripción final del "Programa de 8 sesiones" (`/admin/servicios`)
6. Franja horaria específica de atención (`/admin/configuracion` → Agenda y reserva)
7. Testimonios reales (`/admin/testimonios`, quedan ocultos hasta publicarlos)
8. Contraseña definitiva del panel (`/admin/cuenta`)

## Producción

- **Base de datos**: cambiar `DATABASE_URL` a Postgres y reemplazar el driver
  adapter en `src/lib/prisma.ts` (`@prisma/adapter-better-sqlite3` →
  `@prisma/adapter-pg` o el que corresponda).
- **Imágenes**: `src/lib/uploads.ts` guarda archivos en `/public/uploads`, lo
  que requiere un sistema de archivos persistente (VPS, servidor propio,
  Docker con volumen). En una plataforma serverless de solo lectura (p. ej.
  Vercel) hay que reemplazar esa función por un servicio de blobs (Vercel
  Blob, S3, Cloudinary...); el resto del código no cambia porque todos los
  formularios llaman únicamente a `saveUploadedImage`.
- **`SESSION_SECRET`**: generar un valor nuevo y secreto para producción
  (no reusar el de `.env` de desarrollo).
