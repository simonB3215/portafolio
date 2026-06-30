# Portafolio · Software & Ciberseguridad — Entorno 3D

Portafolio profesional **completamente en 3D e interactivo** para un especialista en
**Desarrollo de Software** y **Ciberseguridad**. Toda la interfaz es un espacio
tridimensional navegable: el usuario se desplaza con el scroll y la cámara viaja por
las distintas estaciones del recorrido.

## Stack

- **React 18** + **Vite** — base y bundling.
- **React Three Fiber (R3F)** + **Three.js** + **drei** — todo el entorno 3D.
- **@react-three/postprocessing** — efecto **bloom** sobre los acentos luminosos.
- **Tailwind CSS** — únicamente el HUD 2D complementario mínimo.

## Paleta

Negro grafito / gris carbón como base, con acentos luminosos:
**oro ámbar**, **naranja quemado**, **rojo carmesí** y **púrpura amatista**
(definidos en `src/config/theme.js`).

## Estructura

```
src/
├─ App.jsx                 # <Canvas> + cámara + Loader + HUD
├─ config/theme.js         # Paleta y posiciones (Z) de cada estación
├─ components/
│  └─ Overlay.jsx          # HUD 2D mínimo sobre el canvas
├─ three/
│  ├─ Experience.jsx       # ScrollControls + CameraRig + luces + composición
│  ├─ Effects.jsx          # EffectComposer (Bloom + Vignette)
│  ├─ environment/
│  │  ├─ GridFloor.jsx     # Cuadrícula de suelo luminosa infinita
│  │  └─ DataParticles.jsx # Flujos de partículas (ámbar / carmesí)
│  └─ sections/
│     ├─ HeroSculpture.jsx   # Escultura fractal de nodos + escudo púrpura + texto 3D
│     ├─ SkillsMonoliths.jsx # Monolitos de obsidiana con trazas de microchip
│     ├─ ProjectsPath.jsx    # Camino de paneles translúcidos + preview 3D
│     └─ ContactConsole.jsx  # Portal de cristal + iconos 3D con pulso al clic
└─ data/                   # Contenido (skills, projects)
```

## Recorrido (controlado por scroll)

La cámara viaja por el eje −Z a través de cuatro estaciones (`config/theme.js`):
`HERO → SKILLS → PROYECTOS → CONTACTO`, con parallax suave según el ratón.

## Optimización de rendimiento (3D)

- `dpr` limitado a `[1, 1.6]` para proteger pantallas hi-dpi.
- Nodos de la escultura con **instancedMesh** (una sola draw call); aristas y grafos
  precalculados una única vez con `useMemo`.
- Animaciones por *damping* en `useFrame` (sin re-renders de React) leyendo el puntero
  vía `state.pointer`.
- `EffectComposer` sin `normalPass` ni multisampling extra; `fog` para recortar
  geometría lejana.
- Respeto por `prefers-reduced-motion`.

## Scripts (pnpm)

```bash
pnpm install      # instala dependencias
pnpm dev          # desarrollo (http://localhost:5173)
pnpm build        # build de producción en dist/
pnpm preview      # sirve el build de producción
```

> **Nota sobre pnpm 11:** los ajustes viven en `pnpm-workspace.yaml`
> (`allowBuilds: { esbuild: true }`) para permitir el script de build de esbuild.
>
> Los enlaces de **Contacto** (GitHub / LinkedIn / Email) están en
> `src/three/sections/ContactConsole.jsx`; reemplázalos por los tuyos.
