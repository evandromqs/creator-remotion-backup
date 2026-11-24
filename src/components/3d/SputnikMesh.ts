import * as THREE from "three";
import { materials } from "./materials";

export interface SputnikInstance {
  group: THREE.Group;
  update: (frame: number) => void;
}

export function createSputnikMesh(scale: number = 1.0): SputnikInstance {
  const group = new THREE.Group();

  // Esfera cromada vintage polida suave
  const sphereGeo = new THREE.SphereGeometry(1.4, 48, 48);
  const sphere = new THREE.Mesh(sphereGeo, materials.clayChrome);
  group.add(sphere);

  // Anel equatorial da carcaça do Sputnik
  const seamGeo = new THREE.TorusGeometry(1.42, 0.04, 16, 64);
  const seam = new THREE.Mesh(seamGeo, materials.clayDarkSlate);
  seam.rotation.x = Math.PI / 2;
  group.add(seam);

  // 4 Antenas icônicas inclinadas para trás
  const antennaGeo = new THREE.CylinderGeometry(0.035, 0.02, 6.2, 16);
  const angles = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];

  angles.forEach((ang) => {
    const ant = new THREE.Mesh(antennaGeo, materials.clayChrome);
    ant.position.set(Math.cos(ang) * 0.9, Math.sin(ang) * 0.9, -1.8);
    ant.rotation.x = Math.PI / 3.2;
    ant.rotation.z = ang - Math.PI / 2;
    group.add(ant);
  });

  group.scale.setScalar(scale);

  return {
    group,
    update: (frame: number) => {
      // Rotação suave no espaço
      group.rotation.y = frame * 0.02;
      group.rotation.x = 0.35 + Math.sin(frame * 0.03) * 0.1;
      group.position.y = (group.position.y || 0) + Math.sin(frame * 0.05) * 0.02;
    },
  };
}
