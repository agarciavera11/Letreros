# Panel Letreros FabLab

Panel web (React + Tailwind, sin backend propio) que muestra en vivo el
estado, horario y contadores de los 2 letreros del laboratorio FabLab,
leyendo directamente de la misma Firebase Realtime Database que usan
los letreros (`FIREBASE_DATABASE_URL` en `FabLabSign/config.h`).

- **Estado actual**: se calcula en el navegador con la misma regla que
  usa el firmware (`/schedule/<dia>/<hora>`, ventana 7:00-17:00).
- **Horario semanal**: grilla de `/schedule`, compartida por los 2
  letreros.
- **Contadores**: `/counts/<LETRERO X>/<fecha>/{people,blind}`, propios
  de cada letrero (ver pestañas "Letrero 1" / "Letrero 2").

Es solo lectura — no escribe nada en la base de datos.

## Ejecutar en desarrollo

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Compilar para producción

```bash
npm run build
```

Genera una carpeta `dist/` con archivos estáticos (HTML/CSS/JS) que
puedes abrir localmente o subir a cualquier hosting estático (no
necesita servidor propio, solo lee de Firebase desde el navegador).

## Estructura

- `src/lib/api.js` — llamadas a la REST API de Firebase RTDB.
- `src/lib/schedule.js` — misma lógica de horario/estado que el
  firmware.
- `src/hooks/usePolling.js` — refresco periódico (horario cada 5 min,
  contadores cada 8 s).
- `src/components/` — Header, selector de letrero, tarjeta de estado,
  grilla de horario, panel de contadores.
