// Paleta elegante "Esmeralda & Oro".
// Base verde casi negro con acentos de esmeralda y oro champán.
// Nota: se conservan las claves (amethyst/crimson) por compatibilidad, pero
// ahora apuntan a tonos esmeralda dentro del esquema elegante.
export const palette = {
  graphite: '#0a0f0d', // verde casi negro
  charcoal: '#121a16', // carbón verdoso
  obsidian: '#18211c', // obsidiana verdosa (monolitos)

  gold: '#c9a86a', // oro champán (acento primario)
  amber: '#e3c58c', // oro claro (resaltes cálidos)
  orange: '#b8895a', // bronce (soporte)

  amethyst: '#3fa37a', // esmeralda (acento frío)
  amethystDeep: '#25634a', // esmeralda profunda (cuadrícula)
  crimson: '#2e7d5b', // esmeralda profunda (acento secundario)

  ivory: '#e8e2d4', // marfil cálido
};

// Posiciones (Z) de cada estación del recorrido. La cámara viaja hacia -Z.
export const stations = {
  hero: 0,
  skills: -26,
  projects: -52,
  contact: -96,
};
