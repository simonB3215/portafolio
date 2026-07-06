import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { palette } from '../../config/theme.js';
import { projects } from '../../data/projects.js';

// Previsualización por defecto: nudo toroidal que gira más rápido al hover.
function TorusPreview({ accent, active }) {
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

// Mini planeta: núcleo esférico con anillo tipo Saturno y halo atmosférico,
// con una leve inclinación axial para look de "planeta en el espacio".
function MiniPlanet({ accent, active }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * (active ? 1.1 : 0.35);
  });
  return (
    <group position={[0, 0.6, 0.15]} rotation={[0.35, 0, 0.18]}>
      <group ref={ref}>
        {/* Núcleo */}
        <mesh>
          <sphereGeometry args={[0.56, 32, 32]} />
          <meshStandardMaterial
            color={accent}
            emissive={accent}
            emissiveIntensity={active ? 1.3 : 0.5}
            metalness={0.25}
            roughness={0.55}
            toneMapped={false}
          />
        </mesh>
        {/* "Continentes" — relieve sutil sobre la superficie */}
        <mesh scale={1.01}>
          <icosahedronGeometry args={[0.56, 1]} />
          <meshBasicMaterial color={accent} wireframe transparent opacity={0.3} toneMapped={false} />
        </mesh>
      </group>

      {/* Anillo tipo Saturno */}
      <mesh rotation={[Math.PI / 2.3, 0, 0]}>
        <ringGeometry args={[0.79, 0.99, 48]} />
        <meshBasicMaterial color={accent} transparent opacity={active ? 0.8 : 0.5} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      {/* Halo atmosférico */}
      <mesh>
        <sphereGeometry args={[0.69, 24, 24]} />
        <meshBasicMaterial color={accent} transparent opacity={0.14} side={THREE.BackSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

// Router: elige la previsualización según el icono del proyecto.
function Preview({ accent, active, icon }) {
  if (icon === 'planet') return <MiniPlanet accent={accent} active={active} />;
  return <TorusPreview accent={accent} active={active} />;
}

// Geometría del marco compartida (se calcula una sola vez).
const PANEL_EDGES = new THREE.EdgesGeometry(new THREE.BoxGeometry(3.4, 4.2, 0.08));

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
          if (project.url) document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (project.url) window.open(project.url, '_blank', 'noopener');
        }}
      >
        {/* Panel translúcido (material ligero, sin transmission para evitar lag) */}
        <mesh>
          <boxGeometry args={[3.4, 4.2, 0.08]} />
          <meshStandardMaterial
            ref={panelMat}
            color={palette.charcoal}
            transparent
            opacity={0.16}
            roughness={0.2}
            metalness={0.2}
            emissive={project.accent}
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Marco luminoso */}
        <lineSegments geometry={PANEL_EDGES}>
          <lineBasicMaterial color={project.accent} transparent opacity={0.9} toneMapped={false} />
        </lineSegments>

        <Preview accent={project.accent} active={hovered} icon={project.icon} />

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
