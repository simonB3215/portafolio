import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Experience from './three/Experience.jsx';
import Overlay from './components/Overlay.jsx';
import { palette } from './config/theme.js';

export default function App() {
  return (
    <>
      <Canvas
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.6]} // limita el pixel ratio para proteger el rendimiento
        camera={{ position: [0, 0, 9], fov: 50, near: 0.1, far: 200 }}
      >
        <color attach="background" args={[palette.graphite]} />
        <fog attach="fog" args={[palette.graphite, 14, 60]} />
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </Canvas>

      <Overlay />
      <Loader
        containerStyles={{ background: palette.graphite }}
        barStyles={{ background: palette.gold }}
        dataStyles={{ color: palette.amber, fontFamily: 'monospace' }}
      />
    </>
  );
}
