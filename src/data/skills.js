import { palette } from '../config/theme.js';

// Monolitos de habilidad. Cada uno se coloca alrededor de la estación SKILLS.
export const skillGroups = [
  {
    id: 'backend',
    title: 'BACKEND',
    accent: palette.gold,
    skills: ['Python', 'Node.js', 'FastAPI', 'APIs'],
    position: [-6.5, 0, 0],
  },
  {
    id: 'frontend',
    title: 'FRONTEND',
    accent: palette.amber,
    skills: ['React', 'R3F', 'Three.js', 'Tailwind'],
    position: [-2.2, 0.6, -2],
  },
  {
    id: 'data',
    title: 'DATOS',
    accent: palette.amethyst,
    skills: ['MongoDB', 'Supabase', 'PostgreSQL', 'Redis'],
    position: [2.2, -0.3, -2],
  },
  {
    id: 'security',
    title: 'SEGURIDAD',
    accent: palette.crimson,
    skills: ['Pentesting', 'OWASP', 'Hardening', 'Auditoría'],
    position: [6.5, 0.4, 0],
  },
];
