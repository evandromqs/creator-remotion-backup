import * as THREE from "three";
import { materials } from "./materials";

export interface SpacetimeInstance {
  group: THREE.Group;
  grid: THREE.LineSegments;
  update: (frame: number) => void;
}

export function createSpacetimeMesh(scale: number = 1.0): SpacetimeInstance {
  const group = new THREE.Group();

  // Malha de grade 3D curvada pela gravidade
  const size = 16;
  const divisions = 24;
  const geometry = new THREE.PlaneGeometry(size, size, divisions, divisions);

  // Deformar os vértices para criar o funil de curvatura gravitacional de Einstein
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const dist = Math.sqrt(x * x + y * y);
    // Curvatura gravitacional 1 / (dist + const)
    const depth = -4.5 / (1.0 + dist * 0.45);
    pos.setZ(i, depth);
  }
  geometry.computeVertexNormals();

  const wireframeGeo = new THREE.WireframeGeometry(geometry);
  const grid = new THREE.LineSegments(
    wireframeGeo,
    new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    })
  );
  grid.rotation.x = -Math.PI / 2.3;
  group.add(grid);

  // Esfera de massa central (Terra gerando a gravidade)
  const massGeo = new THREE.SphereGeometry(1.6, 32, 32);
  const mass = new THREE.Mesh(massGeo, materials.clayDarkSlate);
  mass.position.set(0, -1.2, 0);
  group.add(mass);

  group.scale.setScalar(scale);

  return {
    group,
    grid,
    update: (frame: number) => {
      group.rotation.y = frame * 0.008;
      // Pulso sutil no tecido do espaço-tempo
      const pulse = Math.sin(frame * 0.05) * 0.05;
      grid.scale.set(1 + pulse, 1 + pulse, 1 + pulse * 2);
    },
  };
}
