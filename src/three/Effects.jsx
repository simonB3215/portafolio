import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

// Bloom para los acentos luminosos (oro, ámbar, púrpura) + viñeta sutil.
export default function Effects() {
  return (
    <EffectComposer disableNormalPass multisampling={0}>
      <Bloom
        intensity={0.9}
        luminanceThreshold={0.35}
        luminanceSmoothing={0.3}
        mipmapBlur
        radius={0.7}
      />
      <Vignette eskil={false} offset={0.3} darkness={0.75} />
    </EffectComposer>
  );
}
