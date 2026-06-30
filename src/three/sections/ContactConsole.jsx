import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { palette } from '../../config/theme.js';

const links = [
  { label: 'GitHub', url: 'https://github.com', accent: palette.gold, x: -2.4 },
  { label: 'LinkedIn', url: 'https://linkedin.com', accent: palette.amethyst, x: 0 },
  { label: 'Email', url: 'mailto:hola@example.com', accent: palette.crimson, x: 2.4 },
];

// Icono 3D flotante. Al hacer clic emite un pulso y redirige.
function ContactIcon({ label, url, accent, x }) {
  const ref = useRef();
  const ringRef = useRef();
  const matRef = useRef();
  const [hovered, setHovered] = useState(false);
  const pulse = useRef(0); // 0 = inactivo, >0 = animando

  const handleClick = (e) => {
    e.stopPropagation();
    pulse.current = 0.0001; // arranca el pulso
    window.open(url, '_blank', 'noopener');
  };

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * (hovered ? 1.4 : 0.5);
      const s = THREE.MathUtils.damp(ref.current.scale.x, hovered ? 1.25 : 1, 6, delta);
      ref.current.scale.setScalar(s);
    }
    if (matRef.current) {
      matRef.current.emissiveIntensity = THREE.MathUtils.damp(
        matRef.current.emissiveIntensity,
        hovered ? 2 : 0.8,
        5,
        delta
      );
    }
    // Anima el anillo de pulso al hacer clic
    if (pulse.current > 0 && ringRef.current) {
      pulse.current += delta * 1.6;
      const scale = 1 + pulse.current * 3;
      ringRef.current.scale.setScalar(scale);
      ringRef.current.material.opacity = Math.max(0, 0.9 - pulse.current);
      if (pulse.current > 1) {
        pulse.current = 0;
        ringRef.current.scale.setScalar(0.001);
        ringRef.current.material.opacity = 0;
      }
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
      <group
        position={[x, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={handleClick}
      >
        <mesh ref={ref}>
          <icosahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            ref={matRef}
            color={accent}
            emissive={accent}
            emissiveIntensity={0.8}
            metalness={0.8}
            roughness={0.2}
            toneMapped={false}
          />
        </mesh>

        {/* Anillo de pulso (confirmación de redirección) */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} scale={0.001}>
          <ringGeometry args={[0.6, 0.72, 48]} />
          <meshBasicMaterial color={accent} transparent opacity={0} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>

        <Text position={[0, -0.95, 0]} fontSize={0.22} anchorX="center" color="#e4e4e7">
          {label}
        </Text>
      </group>
    </Float>
  );
}

function CrystalPortal() {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.15;
  });
  return (
    <group position={[0, 0, -1.5]}>
      <mesh ref={ref}>
        <torusGeometry args={[3.4, 0.18, 24, 80]} />
        <meshPhysicalMaterial
          color={palette.amethyst}
          emissive={palette.amethyst}
          emissiveIntensity={0.6}
          transmission={0.6}
          thickness={1}
          roughness={0.1}
          metalness={0.2}
          toneMapped={false}
        />
      </mesh>
      {/* Disco del portal */}
      <mesh>
        <circleGeometry args={[3.25, 64]} />
        <meshBasicMaterial color={palette.amethyst} transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export default function ContactConsole() {
  return (
    <group>
      <CrystalPortal />

      <Text position={[0, 2.4, 0]} fontSize={0.6} anchorX="center" letterSpacing={0.12} color={palette.gold}>
        CONTACTO
        <meshStandardMaterial color={palette.gold} emissive={palette.amber} emissiveIntensity={1.3} toneMapped={false} />
      </Text>
      <Text position={[0, 1.5, 0]} fontSize={0.2} anchorX="center" maxWidth={6} textAlign="center" color="#a1a1aa">
        Construyamos algo seguro · selecciona un canal
      </Text>

      <group position={[0, -0.2, 0]}>
        {links.map((l) => (
          <ContactIcon key={l.label} {...l} />
        ))}
      </group>
    </group>
  );
}
