import { useMemo, useRef } from 'react';
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

export default function HeroSculpture() {
  const groupRef = useRef();
  const instRef = useRef();
  const shieldRef = useRef();
  const matRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { pts, edges } = useFractalGraph();
  const lineGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(edges), [edges]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    // Giro autónomo + reacción al cursor
    g.rotation.y += delta * 0.18;
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, state.pointer.y * 0.4, 3, delta);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -state.pointer.x * 0.25, 3, delta);

    // Destellos del oro
    if (matRef.current) matRef.current.emissiveIntensity = 0.6 + Math.sin(t * 2.5) * 0.35;

    // Escudo de energía: respira y contrarrota
    if (shieldRef.current) {
      shieldRef.current.rotation.y -= delta * 0.1;
      const s = 1 + Math.sin(t * 1.2) * 0.03;
      shieldRef.current.scale.setScalar(s);
    }

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
      <group ref={groupRef}>
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
      </group>

      {/* Escudo de energía púrpura translúcido */}
      <mesh ref={shieldRef}>
        <icosahedronGeometry args={[3.2, 1]} />
        <meshStandardMaterial
          color={palette.amethyst}
          emissive={palette.amethyst}
          emissiveIntensity={0.5}
          transparent
          opacity={0.12}
          wireframe
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.15, 32, 32]} />
        <meshBasicMaterial color={palette.amethyst} transparent opacity={0.04} side={THREE.BackSide} />
      </mesh>

      {/* Texto 3D flotante */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.6}>
        <Text
          position={[0, 3.4, 0]}
          fontSize={0.62}
          maxWidth={9}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.02}
          color={palette.gold}
        >
          SOLUCIONES DE SOFTWARE ESCALABLES
          <meshStandardMaterial color={palette.gold} emissive={palette.amber} emissiveIntensity={1.4} toneMapped={false} />
        </Text>
        <Text
          position={[0, -3.4, 0]}
          fontSize={0.5}
          maxWidth={9}
          textAlign="center"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.02}
          color={palette.amethyst}
        >
          & ARQUITECTURA SEGURA
          <meshStandardMaterial color={palette.amethyst} emissive={palette.amethyst} emissiveIntensity={1.6} toneMapped={false} />
        </Text>
      </Float>
    </group>
  );
}
