import * as THREE from "three";
import { materials } from "./materials";

export interface AtomicClockInstance {
  group: THREE.Group;
  laserRing: THREE.Mesh;
  cesiumCore: THREE.Mesh;
  update: (frame: number) => void;
}

export function createAtomicClockMesh(scale: number = 1.0): AtomicClockInstance {
  const group = new THREE.Group();

  // 1. Câmara de Vácuo em Porcelana Fosca
  const chamberGeo = new THREE.CylinderGeometry(1.5, 1.5, 3.2, 48);
  const chamber = new THREE.Mesh(chamberGeo, materials.clayWhite);
  group.add(chamber);

  // Anéis dourados do ressonador de micro-ondas
  const ringGeo = new THREE.TorusGeometry(1.55, 0.08, 16, 64);
  const ring1 = new THREE.Mesh(ringGeo, materials.clayGold);
  ring1.position.y = 1.0;
  ring1.rotation.x = Math.PI / 2;
  group.add(ring1);

  const ring2 = new THREE.Mesh(ringGeo, materials.clayGold);
  ring2.position.y = -1.0;
  ring2.rotation.x = Math.PI / 2;
  group.add(ring2);

  // 2. Núcleo Interno de Césio (Tubo de vidro/azul brilhante visível)
  const coreGeo = new THREE.CylinderGeometry(0.5, 0.5, 3.6, 32);
  const cesiumCore = new THREE.Mesh(
    coreGeo,
    new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.2,
      metalness: 0.3,
      emissive: 0x0284c7,
      emissiveIntensity: 0.6,
    })
  );
  group.add(cesiumCore);

  // 3. Anel de Laser Pulsante de Nanossegundos
  const laserRingGeo = new THREE.TorusGeometry(1.8, 0.03, 16, 64);
  const laserRing = new THREE.Mesh(
    laserRingGeo,
    new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.8,
    })
  );
  laserRing.rotation.x = Math.PI / 2;
  group.add(laserRing);

  // Janelas ópticas de quartzo
  for (let i = 0; i < 4; i++) {
    const windowGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16);
    const win = new THREE.Mesh(windowGeo, materials.clayGold);
    const ang = (i * Math.PI) / 2;
    win.position.set(Math.cos(ang) * 1.5, 0, Math.sin(ang) * 1.5);
    win.rotation.z = Math.PI / 2;
    win.rotation.y = ang;
    group.add(win);
  }

  group.scale.setScalar(scale);

  return {
    group,
    laserRing,
    cesiumCore,
    update: (frame: number) => {
      group.rotation.y = frame * 0.015;
      group.rotation.x = 0.35 + Math.sin(frame * 0.03) * 0.05;

      // Pulso rápido de frequência do laser (simulando 9.192.631.770 Hz)
      const pulse = ((frame * 3) % 20) / 20;
      laserRing.scale.setScalar(1.0 + pulse * 0.25);
      (laserRing.material as THREE.MeshBasicMaterial).opacity = 0.9 - pulse * 0.7;
      laserRing.position.y = Math.sin(frame * 0.1) * 0.8;
    },
  };
}
