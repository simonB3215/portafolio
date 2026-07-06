import { palette } from '../config/theme.js';

// Paneles del camino/espiral de PROYECTOS. Se distribuyen a lo largo de -Z.
export const projects = [
  {
    id: 'saas-analytics',
    title: 'SentinelOps',
    category: 'Plataforma SaaS',
    description: 'Observabilidad y análisis de seguridad en tiempo real, multi-tenant.',
    tags: ['React', 'Node.js', 'Supabase'],
    accent: palette.gold,
  },
  {
    id: 'earth-monitor',
    title: 'EarthPulse 3D',
    category: 'Monitoreo Planetario',
    description: 'Dashboard 3D en tiempo real de terremotos, incendios y tormentas sobre un globo satelital, con datos de USGS y NASA.',
    tags: ['React', 'Three.js', 'D3-geo'],
    accent: palette.amber,
    icon: 'planet',
    url: 'https://github.com/simonB3215/proyecto-7-Planeta',
  },
  {
    id: 'threat-scanner',
    title: 'ReconGrid',
    category: 'Análisis de Superficie',
    description: 'Reconocimiento de red y priorización de vulnerabilidades.',
    tags: ['Python', 'MongoDB', 'OWASP'],
    accent: palette.crimson,
  },
  {
    id: 'crypto-vault',
    title: 'VaultLayer',
    category: 'Infraestructura Segura',
    description: 'Gestión de secretos con cifrado en reposo y rotación automática.',
    tags: ['Node.js', 'Redis', 'Zero Trust'],
    accent: palette.amethyst,
  },
];
