import { palette } from '../config/theme.js';

// Monolitos de habilidad. Cada uno se coloca alrededor de la estación SKILLS.
export const skillGroups = [
  {
    id: 'backend',
    title: 'BACKEND',
    accent: palette.gold,
    skills: [
      { name: 'Python', icon: 'python' },
      { name: 'Node.js', icon: 'nodedotjs' },
      { name: 'FastAPI', icon: 'fastapi' },
    ],
    position: [-6.5, 0, 0],
  },
  {
    id: 'frontend',
    title: 'FRONTEND',
    accent: palette.amber,
    skills: [
      { name: 'React', icon: 'react' },
      { name: 'Three.js', icon: 'threedotjs' },
      { name: 'Tailwind', icon: 'tailwindcss' },
    ],
    position: [-2.2, 0.6, -2],
  },
  {
    id: 'data',
    title: 'DATOS',
    accent: palette.amethyst,
    skills: [
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'Supabase', icon: 'supabase' },
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'Redis', icon: 'redis' },
    ],
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
