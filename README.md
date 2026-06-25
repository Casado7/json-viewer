# Visor JSON

Un visor de archivos JSON con navegación en árbol, búsqueda, sintaxis coloreada, vista previa de imágenes y soporte para múltiples temas.

## Features

- Editor JSON con formato, minificación y copia
- Vista en árbol colapsable con búsqueda
- 8 temas base × 12 colores acento (96 combinaciones)
- Modo claro/oscuro/sistema
- Historial local (últimos 10 JSONs)
- Undo/Redo con Ctrl+Z
- Vista previa de imágenes al hover
- Scrollbar con color de acento
- Menú contextual en nodos (copiar valor, abrir enlace)
- Todo en español

## Requisitos

- [Bun](https://bun.sh) v1.0+

## Desarrollo local

```bash
bun install
bun run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Build

```bash
bun run build
bun run start
```

## Deploy en Vercel

El proyecto es una app Next.js estándar. Para desplegar:

### Opción 1: CLI de Vercel

```bash
npm i -g vercel
vercel
```

Seguir las instrucciones interactivas. Para producción:

```bash
vercel --prod
```

### Opción 2: Importar desde GitHub

1. Ir a [vercel.com/new](https://vercel.com/new)
2. Conectar con GitHub
3. Seleccionar el repositorio `Casado7/json-viewer`
4. Framework: **Next.js** (se detecta automáticamente)
5. Build Command: dejar el default
6. Output Directory: `.next` (default)
7. Click en **Deploy**

No requiere variables de entorno adicionales.

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Radix UI · Lucide Icons
