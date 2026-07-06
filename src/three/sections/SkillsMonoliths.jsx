import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Edges, Float } from '@react-three/drei';
import * as THREE from 'three';
import { palette } from '../../config/theme.js';
import { skillGroups } from '../../data/skills.js';
import { getIconGeometry, TECH_COLORS } from './icons.js';

// Glifo 3D de una tecnología — balanceo (no giro completo) con color oficial sólido.
// Un giro de 360° muestra el canto delgado del icono la mayor parte del tiempo,
// haciéndolo irreconocible; el balanceo lo mantiene siempre casi de frente.
function SkillIcon({ icon, position, seed = 0 }) {
  const ref = useRef();
  const geometry = useMemo(() => getIconGeometry(icon), [icon]);
  const color = TECH_COLORS[icon] || palette.gold;

  useFrame((state) => {
    if (ref.current) {
      const t = state.clock.elapsedTime;
      ref.current.rotation.y = Math.sin(t * 0.6 + seed) * 0.45;
    }
  });

  return (
    <mesh ref={ref} position={position} geometry={geometry} scale={0.55}>
      {/* Material sin luces/reflejos: color plano y sólido, siempre resalta.
          DoubleSide es necesario porque el flip de Y en icons.js invierte el
          winding de los triángulos; con FrontSide se recortaban caras y se
          veía "transparente". */}
      <meshBasicMaterial color={color} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Trazas tipo microchip sobre la cara frontal del monolito.
function ChipTraces({ accent }) {
  const lines = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 6; i++) {
      const y = -1.6 + i * 0.55;
      pts.push(new THREE.Vector3(-0.7, y, 0.41), new THREE.Vector3(0.1, y, 0.41));
      pts.push(new THREE.Vector3(0.1, y, 0.41), new THREE.Vector3(0.1, y + 0.3, 0.41));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  return (
    <lineSegments geometry={lines}>
      <lineBasicMaterial color={accent} transparent opacity={0.8} toneMapped={false} />
    </lineSegments>
  );
}

function Monolith({ group, onSelect }) {
  const ref = useRef();
  const matRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;
    const targetY = group.position[1] + (hovered ? 0.6 : 0);
    m.position.y = THREE.MathUtils.damp(m.position.y, targetY, 4, delta);
    m.rotation.y = THREE.MathUtils.damp(m.rotation.y, hovered ? 0.5 : 0, 4, delta);
    if (matRef.current) {
      matRef.current.emissiveIntensity = THREE.MathUtils.damp(
        matRef.current.emissiveIntensity,
        hovered ? 1.4 : 0.25,
        4,
        delta
      );
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.4}>
      <group
        ref={ref}
        position={group.position}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (ref.current) {
            const worldPos = new THREE.Vector3();
            ref.current.getWorldPosition(worldPos);
            onSelect?.(group.id, [worldPos.x, worldPos.y, worldPos.z]);
          }
        }}
      >
        {/* Cuerpo de obsidiana */}
        <mesh castShadow>
          <boxGeometry args={[1.7, 4, 0.8]} />
          <meshStandardMaterial
            ref={matRef}
            color={palette.obsidian}
            emissive={group.accent}
            emissiveIntensity={0.25}
            metalness={0.7}
            roughness={0.25}
          />
          <Edges threshold={15} color={group.accent} fog />
        </mesh>

        <ChipTraces accent={group.accent} />

        {/* Título 3D */}
        <Text
          position={[0, 2.5, 0.1]}
          fontSize={0.34}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
          color={group.accent}
        >
          {group.title}
          <meshStandardMaterial color={group.accent} emissive={group.accent} emissiveIntensity={1.5} toneMapped={false} />
        </Text>

        {/* Iconos/logos de tecnologías (solo para grupos con icon) o texto (fallback).
            z=0.75 los adelanta bien lejos de la cara del monolito (0.4) para
            que, al ser más grandes, no choquen visualmente con el bloque vecino. */}
        {group.skills.map((s, i) => {
          const skill = typeof s === 'string' ? { name: s, icon: null } : s;
          const y = 1.1 - i * 0.75;
          const pos = [0, y, skill.icon ? 0.75 : 0.45];
          return skill.icon ? (
            <SkillIcon key={skill.name} icon={skill.icon} position={pos} seed={i * 1.7} />
          ) : (
            <Text
              key={skill.name}
              position={pos}
              fontSize={0.24}
              anchorX="center"
              anchorY="middle"
              color="#e4e4e7"
            >
              {skill.name}
            </Text>
          );
        })}
      </group>
    </Float>
  );
}

export default function SkillsMonoliths({ onSelectSkill }) {
  return (
    <group>
      <Text
        position={[0, 4.6, 0]}
        fontSize={0.7}
        anchorX="center"
        letterSpacing={0.1}
        color={palette.gold}
      >
        HABILIDADES
        <meshStandardMaterial color={palette.gold} emissive={palette.amber} emissiveIntensity={1.2} toneMapped={false} />
      </Text>
      {skillGroups.map((group) => (
        <Monolith key={group.id} group={group} onSelect={onSelectSkill} />
      ))}
    </group>
  );
}
