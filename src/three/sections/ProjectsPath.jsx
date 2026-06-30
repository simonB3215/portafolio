import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { palette } from '../../config/theme.js';
import { projects } from '../../data/projects.js';

// Pequeña previsualización 3D que gira más rápido al hacer hover.
function Preview({ accent, active }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * (active ? 1.6 : 0.4);
    ref.current.rotation.y += delta * (active ? 2.0 : 0.5);
  });
  return (
    <mesh ref={ref} position={[0, 0.4, 0.15]}>
      <torusKnotGeometry args={[0.34, 0.12, 64, 8]} />
      <meshStandardMaterial
        color={accent}
        emissive={accent}
        emissiveIntensity={active ? 1.8 : 0.6}
        metalness={0.6}
        roughness={0.25}
        toneMapped={false}
      />
    </mesh>
  );
}

function ProjectPanel({ project, position, rotationY }) {
  const ref = useRef();
  const panelMat = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const g = ref.current;
    if (!g) return;
    const s = THREE.MathUtils.damp(g.scale.x, hovered ? 1.08 : 1, 5, delta);
    g.scale.setScalar(s);
    if (panelMat.current) {
      panelMat.current.opacity = THREE.MathUtils.damp(panelMat.current.opacity, hovered ? 0.32 : 0.16, 5, delta);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.05} floatIntensity={0.3}>
      <group
        ref={ref}
        position={position}
        rotation={[0, rotationY, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Panel translúcido */}
        <mesh>
          <boxGeometry args={[3.4, 4.2, 0.08]} />
          <meshPhysicalMaterial
            ref={panelMat}
            color={palette.charcoal}
            transparent
            opacity={0.16}
            transmission={0.6}
            roughness={0.15}
            metalness={0.1}
            emissive={project.accent}
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Marco luminoso */}
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(3.4, 4.2, 0.08)]} />
          <lineBasicMaterial color={project.accent} transparent opacity={0.9} toneMapped={false} />
        </lineSegments>

        <Preview accent={project.accent} active={hovered} />

        {/* Texto del proyecto */}
        <Text position={[0, -0.4, 0.12]} fontSize={0.34} anchorX="center" color="#fafafa">
          {project.title}
        </Text>
        <Text position={[0, -0.9, 0.12]} fontSize={0.16} anchorX="center" letterSpacing={0.1} color={project.accent}>
          {project.category.toUpperCase()}
          <meshBasicMaterial color={project.accent} toneMapped={false} />
        </Text>
        <Text
          position={[0, -1.45, 0.12]}
          fontSize={0.15}
          maxWidth={3}
          textAlign="center"
          anchorX="center"
          color="#a1a1aa"
        >
          {project.description}
        </Text>
        <Text position={[0, -1.95, 0.12]} fontSize={0.13} anchorX="center" letterSpacing={0.05} color="#71717a">
          {project.tags.join('  ·  ')}
        </Text>
      </group>
    </Float>
  );
}

export default function ProjectsPath() {
  // Camino en espiral: cada panel avanza en -Z y alterna en X / Y.
  return (
    <group>
      <Text position={[0, 5, 8]} fontSize={0.7} anchorX="center" letterSpacing={0.1} color={palette.crimson}>
        PROYECTOS
        <meshStandardMaterial color={palette.crimson} emissive={palette.crimson} emissiveIntensity={1.2} toneMapped={false} />
      </Text>

      {projects.map((p, i) => {
        const z = 6 - i * 12;
        const x = i % 2 === 0 ? -3.4 : 3.4;
        const y = Math.sin(i * 1.1) * 0.8;
        const rotationY = i % 2 === 0 ? 0.5 : -0.5;
        return (
          <ProjectPanel key={p.id} project={p} position={[x, y, z]} rotationY={rotationY} />
        );
      })}
    </group>
  );
}
