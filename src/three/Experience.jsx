import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  ScrollControls,
  useScroll,
  Environment,
  PerformanceMonitor,
  AdaptiveDpr,
} from '@react-three/drei';
import { MathUtils } from 'three';

import { palette, stations } from '../config/theme.js';
import GridFloor from './environment/GridFloor.jsx';
import Effects from './Effects.jsx';

import HeroSculpture from './sections/HeroSculpture.jsx';
import SkillsMonoliths from './sections/SkillsMonoliths.jsx';
import ProjectsPath from './sections/ProjectsPath.jsx';
import ContactConsole from './sections/ContactConsole.jsx';

const INTRO_FROM = 130; // distancia inicial ("planeta"/núcleo estelar lejano)
const INTRO_DURATION = 4.6; // segundos
const FOG_FAR_START = 210; // deja entrever el núcleo como un punto de luz lejano
const FOG_FAR_END = 26; // oculta la estación SKILLS al llegar al HERO

// Aceleración + desaceleración (lento → rápido → lento).
const easeInOutCubic = (p) =>
  p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;

// Fase 1: zoom-in cinematográfico desde las profundidades hasta el HERO.
// Fase 2: recorrido controlado por scroll con parallax del ratón.
// Fase 3: zoom a sección seleccionada.
function CameraRig({ onIntroDone, selectedSkill, onDeselect }) {
  const scroll = useScroll();
  const startZ = 9;
  const endZ = stations.contact + 9;

  // Respeta "prefers-reduced-motion": omite la intro.
  const reduced = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );

  const elapsed = useRef(0);
  const done = useRef(false);
  const lastScrollOffset = useRef(0);

  useFrame((state, delta) => {
    const cam = state.camera;

    // --- Fase intro ---
    if (!done.current && !reduced) {
      elapsed.current += delta;
      const p = Math.min(elapsed.current / INTRO_DURATION, 1);
      const e = easeInOutCubic(p);

      cam.position.set(0, 0.5 * e, MathUtils.lerp(INTRO_FROM, startZ, e));
      cam.lookAt(0, 0, 0);

      // La niebla se cierra a medida que nos acercamos: oculta las estaciones
      // lejanas (p. ej. SKILLS) al llegar al HERO, evitando que se transparenten.
      if (state.scene.fog) state.scene.fog.far = MathUtils.lerp(FOG_FAR_START, FOG_FAR_END, e);

      if (p >= 1) {
        done.current = true;
        onIntroDone?.();
      }
      return;
    }

    if (reduced && !done.current) {
      // Sin animación: coloca la cámara directamente en la posición de lectura.
      cam.position.set(0, 0.5, startZ);
      if (state.scene.fog) state.scene.fog.far = FOG_FAR_END;
      done.current = true;
      onIntroDone?.();
    }

    // --- Fase selección de sección ---
    if (selectedSkill) {
      // Si el usuario intenta scrollear, deselecciona
      if (Math.abs(scroll.offset - lastScrollOffset.current) > 0.01) {
        onDeselect?.();
        lastScrollOffset.current = scroll.offset;
      } else {
        // selectedSkill.position ya viene en coordenadas mundiales (getWorldPosition).
        // Vista frontal y alineada con el monolito (no en ángulo) a una distancia
        // que encuadre título + iconos sin atravesar la caja (altura total ~5.5).
        const [sx, sy, sz] = selectedSkill.position;
        const targetX = sx;
        const targetY = sy + 0.6;
        const targetZ = sz + 8;

        cam.position.x = MathUtils.damp(cam.position.x, targetX, 4, delta);
        cam.position.y = MathUtils.damp(cam.position.y, targetY, 4, delta);
        cam.position.z = MathUtils.damp(cam.position.z, targetZ, 4, delta);
        cam.lookAt(sx, sy, sz);
        return; // Mientras hay selección, no ejecutar scroll
      }
    }

    // Guarda el offset actual para detectar scroll
    lastScrollOffset.current = scroll.offset;

    // --- Fase scroll ---
    const targetZ = startZ + (endZ - startZ) * scroll.offset;
    const px = state.pointer.x;
    const py = state.pointer.y;
    const lambda = 3;

    cam.position.x = MathUtils.damp(cam.position.x, px * 1.6, lambda, delta);
    cam.position.y = MathUtils.damp(cam.position.y, 0.5 + py * 0.8, lambda, delta);
    cam.position.z = MathUtils.damp(cam.position.z, targetZ, lambda, delta);
    cam.lookAt(px * 0.6, py * 0.4, targetZ - 8);
  });

  return null;
}

function Sections({ onSelectSkill }) {
  return (
    <>
      <group position={[0, 0, stations.hero]}>
        <HeroSculpture />
      </group>
      <group position={[0, 0, stations.skills]}>
        <SkillsMonoliths onSelectSkill={onSelectSkill} />
      </group>
      <group position={[0, 0, stations.projects]}>
        <ProjectsPath />
      </group>
      <group position={[0, 0, stations.contact]}>
        <ContactConsole />
      </group>
    </>
  );
}

export default function Experience({ onPerf, onIntroDone }) {
  const lightRef = useRef();
  // El scroll permanece bloqueado hasta que termina la intro cinematográfica.
  const [introDone, setIntroDone] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);

  const handleIntroDone = () => {
    setIntroDone(true);
    onIntroDone?.();
  };

  const handleSelectSkill = (skillId, position) => {
    setSelectedSkill({ id: skillId, position });
  };

  const handleDeselect = () => {
    if (selectedSkill) {
      setSelectedSkill(null);
    }
  };

  // Mientras hay una habilidad seleccionada, cualquier click (incluso fuera del
  // canvas de R3F) la deselecciona. Se registra con un pequeño retraso para no
  // capturar el mismo click que originó la selección.
  useEffect(() => {
    if (!selectedSkill) return;
    const timer = setTimeout(() => {
      window.addEventListener('pointerdown', handleDeselect);
    }, 0);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', handleDeselect);
    };
  }, [selectedSkill]);

  return (
    <>
      {/* Baja el dpr automáticamente si los FPS caen (anti-lag) */}
      <PerformanceMonitor
        onDecline={() => onPerf?.(1)}
        onIncline={() => onPerf?.(1.5)}
      />
      <AdaptiveDpr pixelated />

      <ScrollControls pages={4} damping={0.28} enabled={introDone}>
        {/* Iluminación base del entorno */}
        <ambientLight intensity={0.25} />
        <directionalLight ref={lightRef} position={[6, 10, 6]} intensity={0.8} color={palette.amber} />
        <pointLight position={[-8, 4, 4]} intensity={40} color={palette.amethyst} distance={40} />
        <pointLight position={[8, -2, -30]} intensity={50} color={palette.crimson} distance={50} />
        <Environment preset="night" />

        {/* Entorno global */}
        <GridFloor />

        <CameraRig onIntroDone={handleIntroDone} selectedSkill={selectedSkill} onDeselect={handleDeselect} />
        <Sections onSelectSkill={handleSelectSkill} />

        <Effects />
      </ScrollControls>
    </>
  );
}
