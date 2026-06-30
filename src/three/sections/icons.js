import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';

// Datos oficiales de los glifos (paths SVG, licencia MIT/CC):
// GitHub vía simple-icons, LinkedIn y Email (sobre) vía Bootstrap Icons.
export const ICON_PATHS = {
  github: {
    viewBox: 24,
    d: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  },
  linkedin: {
    viewBox: 16,
    d: 'M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z',
  },
  email: {
    viewBox: 16,
    d: 'M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z',
  },
};

const cache = new Map();

// Convierte un path SVG en una geometría 3D extruida (placa con bisel),
// normalizada a ~1 unidad de tamaño y centrada en el origen.
export function getIconGeometry(type) {
  if (cache.has(type)) return cache.get(type);

  const { d, viewBox } = ICON_PATHS[type];
  const loader = new SVGLoader();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBox} ${viewBox}"><path d="${d}"/></svg>`;
  const { paths } = loader.parse(svg);

  const shapes = paths.flatMap((path) => SVGLoader.createShapes(path));

  const geometry = new THREE.ExtrudeGeometry(shapes, {
    depth: viewBox * 0.14,
    bevelEnabled: true,
    bevelThickness: viewBox * 0.035,
    bevelSize: viewBox * 0.02,
    bevelSegments: 2,
    curveSegments: 10,
  });

  // SVG usa Y hacia abajo; three.js usa Y hacia arriba.
  geometry.scale(1, -1, 1);
  geometry.center();

  geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  geometry.boundingBox.getSize(size);
  const scale = 1 / Math.max(size.x, size.y);
  geometry.scale(scale, scale, scale);
  geometry.center();

  cache.set(type, geometry);
  return geometry;
}
