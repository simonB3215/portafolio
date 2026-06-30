import { Grid } from '@react-three/drei';
import { palette } from '../../config/theme.js';

// Cuadrícula de suelo luminosa que se extiende "infinitamente".
export default function GridFloor() {
  return (
    <Grid
      position={[0, -3.2, -40]}
      args={[200, 400]}
      cellSize={1.2}
      cellThickness={0.7}
      cellColor={palette.amethystDeep}
      sectionSize={6}
      sectionThickness={1.3}
      sectionColor={palette.gold}
      fadeDistance={70}
      fadeStrength={2}
      followCamera
      infiniteGrid
    />
  );
}
