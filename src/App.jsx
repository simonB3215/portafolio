import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import Experience from './three/Experience.jsx';
import Overlay from './components/Overlay.jsx';
import { palette } from './config/theme.js';

export default function App() {
  // El dpr lo ajusta dinámicamente PerformanceMonitor para evitar lag.
  const [dpr, setDpr] = useState(1.5);
  // Controla la aparición del HUD tras la intro cinematográfica.
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      <Canvas
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={dpr}
        // La cámara arranca muy lejos: la intro hace el zoom-in hasta el HERO.
        camera={{ position: [0, 0, 130], fov: 50, near: 0.1, far: 260 }}
      >
        <color attach="background" args={[palette.graphite]} />
        <fog attach="fog" args={[palette.graphite, 14, 210]} />
        <Suspense fallback={null}>
          <Experience onPerf={setDpr} onIntroDone={() => setIntroDone(true)} />
        </Suspense>
      </Canvas>

      <Overlay visible={introDone} />
      <Loader
        containerStyles={{ background: palette.graphite }}
        barStyles={{ background: palette.gold }}
        dataStyles={{ color: palette.amber, fontFamily: 'monospace' }}
      />
    </>
  );
}
