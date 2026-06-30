// HUD complementario mínimo en 2D sobre el entorno 3D.
// Aparece con un fundido una vez termina la intro cinematográfica.
export default function Overlay({ visible = true }) {
  return (
    <div
      className={`transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="hud left-6 top-6 flex items-center gap-2 text-zinc-300">
        <span className="inline-block h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(201,168,106,0.8)] animate-pulseGlow" />
      </div>

      <div className="hud right-6 top-6 hidden sm:block">
        INACAP
      </div>

      <div className="hud bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="animate-pulseGlow">desplázate para navegar el espacio</span>
        <span className="text-gold">▼</span>
      </div>
    </div>
  );
}
