import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Edges, Float } from '@react-three/drei';
import * as THREE from 'three';
import { palette } from '../../config/theme.js';
import { skillGroups } from '../../data/skills.js';

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

function Monolith({ group }) {
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
          <Edges threshold={15}>
            <lineBasicMaterial color={group.accent} toneMapped={false} />
          </Edges>
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

        {/* Habilidades flotantes */}
        {group.skills.map((s, i) => (
          <Text
            key={s}
            position={[0, 1.1 - i * 0.62, 0.45]}
            fontSize={0.24}
            anchorX="center"
            anchorY="middle"
            color="#e4e4e7"
          >
            {s}
          </Text>
        ))}
      </group>
    </Float>
  );
}

export default function SkillsMonoliths() {
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
        <Monolith key={group.id} group={group} />
      ))}
    </group>
  );
}
