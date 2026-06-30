import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, Environment, Sparkles } from '@react-three/drei';
import { MathUtils } from 'three';

import { palette, stations } from '../config/theme.js';
import GridFloor from './environment/GridFloor.jsx';
import DataParticles from './environment/DataParticles.jsx';
import Effects from './Effects.jsx';

import HeroSculpture from './sections/HeroSculpture.jsx';
import SkillsMonoliths from './sections/SkillsMonoliths.jsx';
import ProjectsPath from './sections/ProjectsPath.jsx';
import ContactConsole from './sections/ContactConsole.jsx';

// Mueve la cámara a lo largo del recorrido (-Z) según el scroll, con
// parallax suave dependiente del ratón.
function CameraRig() {
  const scroll = useScroll();
  const startZ = 9;
  const endZ = stations.contact + 9;

  useFrame((state, delta) => {
    const targetZ = startZ + (endZ - startZ) * scroll.offset;
    const px = state.pointer.x;
    const py = state.pointer.y;
    const lambda = 3;

    const cam = state.camera;
    cam.position.x = MathUtils.damp(cam.position.x, px * 1.6, lambda, delta);
    cam.position.y = MathUtils.damp(cam.position.y, 0.5 + py * 0.8, lambda, delta);
    cam.position.z = MathUtils.damp(cam.position.z, targetZ, lambda, delta);
    // Mira ligeramente hacia adelante en el eje del recorrido
    cam.lookAt(px * 0.6, py * 0.4, targetZ - 8);
  });

  return null;
}

function Sections() {
  return (
    <>
      <group position={[0, 0, stations.hero]}>
        <HeroSculpture />
      </group>
      <group position={[0, 0, stations.skills]}>
        <SkillsMonoliths />
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

export default function Experience() {
  const lightRef = useRef();

  return (
    <ScrollControls pages={4} damping={0.28}>
      {/* Iluminación base del entorno */}
      <ambientLight intensity={0.25} />
      <directionalLight ref={lightRef} position={[6, 10, 6]} intensity={0.8} color={palette.amber} />
      <pointLight position={[-8, 4, 4]} intensity={40} color={palette.amethyst} distance={40} />
      <pointLight position={[8, -2, -30]} intensity={50} color={palette.crimson} distance={50} />
      <Environment preset="night" />

      {/* Entorno global */}
      <GridFloor />
      <DataParticles />
      <Sparkles count={120} scale={[40, 12, 120]} size={2} speed={0.3} color={palette.amber} opacity={0.5} />

      <CameraRig />
      <Sections />

      <Effects />
    </ScrollControls>
  );
}
