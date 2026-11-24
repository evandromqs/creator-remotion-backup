import * as THREE from "three";
import { materials } from "./materials";

export interface CarRiverInstance {
  group: THREE.Group;
  car: THREE.Group;
  update: (frame: number) => void;
}

export function createCarRiverMesh(scale: number = 1.0): CarRiverInstance {
  const group = new THREE.Group();

  // 1. Estrada Asfáltica Curvada em Cerâmica Ardósia
  const roadCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.2, 0.5, -1.8),
    new THREE.Vector3(-0.5, 0.5, -0.4),
    new THREE.Vector3(0.8, 0.4, 0.8),
    new THREE.Vector3(2.2, 0.3, 1.8),
  ]);
  const roadGeo = new THREE.TubeGeometry(roadCurve, 40, 0.28, 8, false);
  const road = new THREE.Mesh(roadGeo, materials.clayDarkSlate);
  group.add(road);

  // Faixa amarela central da estrada
  const lineGeo = new THREE.TubeGeometry(roadCurve, 40, 0.04, 8, false);
  const line = new THREE.Mesh(lineGeo, materials.clayGold);
  line.position.y += 0.04;
  group.add(line);

  // 2. Rio de Cerâmica Azul em Curva
  const riverCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.8, -0.8, 2.0),
    new THREE.Vector3(0.2, -0.8, 0.2),
    new THREE.Vector3(2.0, -0.8, -1.8),
  ]);
  const riverGeo = new THREE.TubeGeometry(riverCurve, 40, 0.65, 8, false);
  const river = new THREE.Mesh(riverGeo, materials.claySolarBlue);
  group.add(river);

  // 3. Miniatura do Carro em Clay (Maior e visível)
  const car = new THREE.Group();

  // Chassi do carro
  const carBody = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.6, 2.2), materials.clayCoral);
  car.add(carBody);

  // Cabine / Janelas
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.5, 1.2), materials.clayWhite);
  cabin.position.set(0, 0.5, -0.15);
  car.add(cabin);

  // 4 Rodas
  const wheelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.2, 16);
  const wheelMat = materials.clayDarkSlate;

  [
    [-0.62, -0.2, 0.65],
    [0.62, -0.2, 0.65],
    [-0.62, -0.2, -0.65],
    [0.62, -0.2, -0.65],
  ].forEach(([x, y, z]) => {
    const w = new THREE.Mesh(wheelGeo, wheelMat);
    w.rotation.z = Math.PI / 2;
    w.position.set(x, y, z);
    car.add(w);
  });

  group.add(car);
  group.rotation.x = 0.55;
  group.rotation.y = -0.4;
  group.scale.setScalar(scale);

  return {
    group,
    car,
    update: (relFrame: number) => {
      // Carro anda pela estrada e aos poucos desvia em direção ao rio
      const progress = Math.min(0.95, Math.max(0.05, (relFrame % 180) / 180));
      const pointOnRoad = roadCurve.getPoint(progress);

      // Desvio suave simulando o erro de 11km
      const drift = Math.sin(progress * Math.PI) * 0.8;

      car.position.set(pointOnRoad.x, pointOnRoad.y + 0.35 - drift * 0.4, pointOnRoad.z + drift);
      car.rotation.y = -0.6 + drift * 0.3;
      car.rotation.z = drift * 0.2;

      group.rotation.x = 0.55;
      group.rotation.y = -0.4 + Math.sin(relFrame * 0.02) * 0.05;
    },
  };
}
