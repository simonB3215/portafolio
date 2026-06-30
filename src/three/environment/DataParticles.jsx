import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { palette } from '../../config/theme.js';

const COUNT = 600;
const RANGE_X = 60;
const RANGE_Y = 18;
const RANGE_Z = 120; // a lo largo de todo el recorrido

// Partículas flotantes (ámbar / carmesí) que cruzan la escena de forma dinámica.
export default function DataParticles() {
  const ref = useRef();

  const { positions, colors, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const speeds = new Float32Array(COUNT);

    const cAmber = new THREE.Color(palette.amber);
    const cCrimson = new THREE.Color(palette.crimson);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * RANGE_X;
      positions[i * 3 + 1] = (Math.random() - 0.5) * RANGE_Y;
      positions[i * 3 + 2] = -Math.random() * RANGE_Z + 10;

      const c = Math.random() > 0.5 ? cAmber : cCrimson;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      speeds[i] = 2 + Math.random() * 6;
    }
    return { positions, colors, speeds };
  }, []);

  useFrame((state, delta) => {
    const geo = ref.current;
    if (!geo) return;
    const arr = geo.attributes.position.array;
    const dt = Math.min(delta, 0.05);

    for (let i = 0; i < COUNT; i++) {
      // Flujo: las partículas cruzan en X y se reciclan al salir del rango
      arr[i * 3] += speeds[i] * dt;
      if (arr[i * 3] > RANGE_X / 2) arr[i * 3] = -RANGE_X / 2;
    }
    geo.attributes.position.needsUpdate = true;
  });

  return (
    <points>
      <bufferGeometry ref={ref}>
        <bufferAttribute attach="attributes-position" count={COUNT} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={COUNT} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.12}
        vertexColors
        transparent
        opacity={0.85}
        depthWrite={false}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
