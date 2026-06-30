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
    id: 'b2b-erp',
    title: 'NexusERP',
    category: 'Sistema B2B',
    description: 'Gestión empresarial con inventario, facturación y auditoría trazable.',
    tags: ['Python', 'FastAPI', 'PostgreSQL'],
    accent: palette.amber,
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
