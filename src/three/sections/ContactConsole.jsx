import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';
import { palette } from '../../config/theme.js';
import { getIconGeometry } from './icons.js';

const links = [
  { label: 'GitHub', icon: 'github', url: 'https://github.com/simonB3215', accent: palette.gold, x: -2.4 },
  { label: 'LinkedIn', icon: 'linkedin', url: 'https://www.linkedin.com/in/simon-bugue%C3%B1o-77a42529b/', accent: palette.amethyst, x: 0 },
  { label: 'Email', icon: 'email', url: 'mailto:simon.bueguenio@gmail.com', accent: palette.crimson, x: 2.4 },
];

// Icono 3D flotante (glifo real extruido). Al hacer clic emite un pulso y redirige.
function ContactIcon({ label, icon, url, accent, x }) {
  const ref = useRef();
  const ringRef = useRef();
  const matRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const pulse = useRef(0); // 0 = inactivo, >0 = animando
  const geometry = useMemo(() => getIconGeometry(icon), [icon]);

  const handleClick = (e) => {
    e.stopPropagation();
    pulse.current = 0.0001; // arranca el pulso
    if (url.startsWith('mailto:')) {
      // Si no hay cliente de correo predeterminado, location.href no hace
      // nada visible. Copiamos la dirección al portapapeles como acción
      // principal (siempre funciona) e intentamos abrir el cliente de
      // correo como beneficio extra si existe.
      const email = url.replace('mailto:', '');
      navigator.clipboard?.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener');
    }
  };

  useFrame((state, delta) => {
    if (ref.current) {
      // Balanceo (no giro completo): mantiene el glifo siempre legible,
      // de frente, en vez de mostrar su reverso espejado a mitad de vuelta.
      const t = state.clock.elapsedTime;
      const swing = hovered ? 1.8 : 0.6;
      const amount = hovered ? 0.5 : 0.22;
      ref.current.rotation.y = Math.sin(t * swing + x) * amount;
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
        <mesh ref={ref} geometry={geometry} scale={1.05}>
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

        <Text position={[0, -0.95, 0]} fontSize={0.22} anchorX="center" color={copied ? accent : '#e4e4e7'}>
          {copied ? '¡Copiado!' : label}
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
        <torusGeometry args={[3.4, 0.18, 16, 64]} />
        <meshStandardMaterial
          color={palette.amethyst}
          emissive={palette.amethyst}
          emissiveIntensity={0.9}
          roughness={0.15}
          metalness={0.4}
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
