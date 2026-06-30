// HUD complementario mínimo en 2D sobre el entorno 3D.
export default function Overlay() {
  return (
    <>
      <div className="hud left-6 top-6 flex items-center gap-2 text-zinc-300">
        <span className="inline-block h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(245,166,35,0.8)]" />
        dev<span className="text-gold">/</span>sec
      </div>

      <div className="hud right-6 top-6 hidden sm:block">
        Software · Ciberseguridad
      </div>

      <div className="hud bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="animate-pulseGlow">desplázate para navegar el espacio</span>
        <span className="text-gold">▼</span>
      </div>
    </>
  );
}
