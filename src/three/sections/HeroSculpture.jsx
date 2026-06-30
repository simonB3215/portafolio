import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { palette } from '../../config/theme.js';

const NODES = 90;

// Distribuye nodos en una esfera (espiral de Fibonacci) + aristas internas.
function useFractalGraph() {
  return useMemo(() => {
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < NODES; i++) {
      const y = 1 - (i / (NODES - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const radius = 1.6 + (i % 3) * 0.35; // capas concéntricas -> sensación fractal
      pts.push(
        new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius)
      );
    }
    const edges = [];
    for (let i = 0; i < NODES; i++) {
      for (let j = i + 1; j < NODES; j++) {
        if (pts[i].distanceTo(pts[j]) < 0.95) edges.push(pts[i], pts[j]);
      }
    }
    return { pts, edges };
  }, []);
}

// Escudo de energía exterior: gira y respira solo, SIN interacción
// (raycast desactivado para que el cursor alcance la escultura interior).
function EnergyShield() {
  const ref = useRef();
  useFrame((state, delta) => {
    const s = ref.current;
    if (!s) return;
    s.rotation.y -= delta * 0.08;
    s.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.03);
  });
  return (
    <group ref={ref}>
      <mesh raycast={() => null}>
        <icosahedronGeometry args={[2.5, 1]} />
        <meshStandardMaterial
          color={palette.amethyst}
          emissive={palette.amethyst}
          emissiveIntensity={0.5}
          transparent
          opacity={0.14}
          wireframe
        />
      </mesh>
      <mesh raycast={() => null}>
        <sphereGeometry args={[2.45, 24, 24]} />
        <meshBasicMaterial color={palette.amethyst} transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

export default function HeroSculpture() {
  const groupRef = useRef();
  const instRef = useRef();
  const matRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Estado de arrastre de la escultura interior
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });

  const { pts, edges } = useFractalGraph();
  const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(edges), [edges]);

  useEffect(() => {
    const onMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      vel.current = { x: dy * 0.006, y: dx * 0.006 };
      if (groupRef.current) {
        groupRef.current.rotation.y += dx * 0.006;
        groupRef.current.rotation.x += dy * 0.006;
      }
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = 'auto';
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    // Giro autónomo + inercia tras soltar (cuando no se está arrastrando)
    if (!dragging.current) {
      g.rotation.y += delta * 0.18 + vel.current.y;
      g.rotation.x += vel.current.x;
      vel.current.x *= 0.94;
      vel.current.y *= 0.94;
    }

    // Destellos del oro
    if (matRef.current) matRef.current.emissiveIntensity = 0.6 + Math.sin(t * 2.5) * 0.35;

    // Coloca los nodos instanciados una sola vez
    const mesh = instRef.current;
    if (mesh && !mesh.userData.placed) {
      for (let i = 0; i < NODES; i++) {
        dummy.position.copy(pts[i]);
        dummy.scale.setScalar(0.07 + (i % 4) * 0.02);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      mesh.userData.placed = true;
    }
  });

  return (
    <group>
      {/* Escultura interior ARRASTRABLE */}
      <group
        ref={groupRef}
        onPointerOver={() => {
          if (!dragging.current) document.body.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          if (!dragging.current) document.body.style.cursor = 'auto';
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          dragging.current = true;
          last.current = { x: e.clientX, y: e.clientY };
          vel.current = { x: 0, y: 0 };
          document.body.style.cursor = 'grabbing';
        }}
      >
        {/* Nodos de datos en oro pulido */}
        <instancedMesh ref={instRef} args={[null, null, NODES]}>
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            ref={matRef}
            color={palette.gold}
            emissive={palette.amber}
            emissiveIntensity={0.7}
            metalness={1}
            roughness={0.18}
          />
        </instancedMesh>

        {/* Estructuras de código (aristas) */}
        <lineSegments geometry={lineGeo}>
          <lineBasicMaterial color={palette.amber} transparent opacity={0.35} />
        </lineSegments>

        {/* Núcleo brillante */}
        <mesh>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshStandardMaterial color={palette.amber} emissive={palette.gold} emissiveIntensity={2} />
        </mesh>

        {/* Esfera invisible que da un volumen agarrable a la escultura */}
        <mesh>
          <sphereGeometry args={[2.4, 16, 16]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {/* Escudo de energía exterior (no interactivo) */}
      <EnergyShield />

      {/* Identidad — tamaño y posición ajustados para caber dentro del encuadre
          en la posición de lectura final de la cámara (no quedar cortado arriba). */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[0, 3.55, 0]}
          fontSize={0.6}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.04}
          color={palette.gold}
        >
          SIMÓN BUGUEÑO
          <meshStandardMaterial color={palette.gold} emissive={palette.amber} emissiveIntensity={1.5} toneMapped={false} />
        </Text>
        <Text
          position={[0, 2.85, 0]}
          fontSize={0.2}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.12}
          color="#d4d4d8"
        >
          DESARROLLO DE SOFTWARE · CIBERSEGURIDAD · INACAP
        </Text>

        {/* Texto 3D requerido */}
        <Text
          position={[0, -3.35, 0]}
          fontSize={0.42}
          maxWidth={8}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.02}
          color={palette.amethyst}
        >
          SOLUCIONES DE SOFTWARE ESCALABLES & ARQUITECTURA SEGURA
          <meshStandardMaterial color={palette.amethyst} emissive={palette.amethyst} emissiveIntensity={1.6} toneMapped={false} />
        </Text>
      </Float>
    </group>
  );
}
