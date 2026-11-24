import * as THREE from "three";
import { materials } from "./materials";

export interface SatelliteInstance {
  group: THREE.Group;
  antennaDish: THREE.Mesh;
  wings: THREE.Group[];
  update: (frame: number, floatOffset?: { x?: number; y?: number; rotY?: number }) => void;
}

export function createSatelliteMesh(scale: number = 0.95): SatelliteInstance {
  const group = new THREE.Group();

  // 1. Corpo Central Cúbico Chanfrado
  const coreMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 1.4), materials.clayWhite);
  group.add(coreMesh);

  // Painéis laterais de serviço
  const panelL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.3, 1.0), materials.clayDarkSlate);
  panelL.position.x = -0.82;
  group.add(panelL);

  const panelR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.3, 1.0), materials.clayDarkSlate);
  panelR.position.x = 0.82;
  group.add(panelR);

  // Cúpula superior dourada
  const topDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.48, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    materials.clayGold
  );
  topDome.position.y = 0.9;
  group.add(topDome);

  // 2. Antena Parabólica Dourada (High-Gain) apontada para baixo
  const antennaGroup = new THREE.Group();
  const dishArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 16), materials.clayGold);
  dishArm.position.set(0, -1.0, 0.15);
  antennaGroup.add(dishArm);

  const antennaDish = new THREE.Mesh(
    new THREE.SphereGeometry(0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.5),
    materials.clayGold
  );
  antennaDish.rotation.x = -Math.PI / 1.25;
  antennaDish.position.set(0, -1.4, 0.35);
  antennaGroup.add(antennaDish);
  group.add(antennaGroup);

  // 3. Asas de Painéis Solares Articulados
  const wings: THREE.Group[] = [];

  const createWing = (isLeft: boolean) => {
    const wingG = new THREE.Group();
    const dir = isLeft ? -1 : 1;

    // Haste articulada
    const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.0, 16), materials.clayGold);
    strut.rotation.z = Math.PI / 2;
    strut.position.x = dir * 0.5;
    wingG.add(strut);

    // 3 Células solares por asa
    for (let c = 0; c < 3; c++) {
      const frameM = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.4, 0.06), materials.clayDarkSlate);
      frameM.position.x = dir * (1.4 + c * 1.02);
      wingG.add(frameM);

      const cell = new THREE.Mesh(new THREE.BoxGeometry(0.82, 1.32, 0.08), materials.claySolarBlue);
      cell.position.x = dir * (1.4 + c * 1.02);
      wingG.add(cell);
    }

    return wingG;
  };

  const leftWing = createWing(true);
  const rightWing = createWing(false);
  group.add(leftWing);
  group.add(rightWing);
  wings.push(leftWing, rightWing);

  group.scale.setScalar(scale);

  return {
    group,
    antennaDish,
    wings,
    update: (frame: number, floatOffset?: { x?: number; y?: number; rotY?: number }) => {
      const fx = floatOffset?.x ?? Math.sin(frame * 0.02) * 0.3;
      const fy = floatOffset?.y ?? Math.sin(frame * 0.04) * 0.15;
      const frot = floatOffset?.rotY ?? Math.sin(frame * 0.02) * 0.08;

      group.position.x = fx;
      group.position.y = (group.position.y || 0) + fy * 0.05;
      group.rotation.y = -0.45 + frot;
      group.rotation.x = 0.38;
    },
  };
}
