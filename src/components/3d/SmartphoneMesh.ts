import * as THREE from "three";
import { materials } from "./materials";

export interface SmartphoneInstance {
  group: THREE.Group;
  pin: THREE.Group;
  update: (frame: number) => void;
}

export function createSmartphoneMesh(scale: number = 1.0): SmartphoneInstance {
  const group = new THREE.Group();

  // 1. Chassi Unibody de Cerâmica Fosca Estilo iPhone
  const bodyGeo = new THREE.BoxGeometry(2.4, 4.8, 0.22);
  const body = new THREE.Mesh(bodyGeo, materials.clayDarkSlate);
  group.add(body);

  // Moldura frontal
  const screenBorderGeo = new THREE.BoxGeometry(2.28, 4.66, 0.05);
  const screenBorder = new THREE.Mesh(screenBorderGeo, materials.clayWhite);
  screenBorder.position.z = 0.1;
  group.add(screenBorder);

  // 2. Tela com Mapa Procedural Estilizado em Cerâmica
  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = 512;
  screenCanvas.height = 1024;
  const sCtx = screenCanvas.getContext("2d")!;

  sCtx.fillStyle = "#0f172a";
  sCtx.fillRect(0, 0, 512, 1024);

  // Estradas / linhas do mapa
  sCtx.strokeStyle = "rgba(56, 189, 248, 0.25)";
  sCtx.lineWidth = 6;
  sCtx.beginPath();
  sCtx.moveTo(80, 0);
  sCtx.bezierCurveTo(150, 300, 380, 400, 260, 1024);
  sCtx.stroke();

  sCtx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  sCtx.lineWidth = 4;
  sCtx.beginPath();
  sCtx.moveTo(0, 480);
  sCtx.lineTo(512, 540);
  sCtx.stroke();

  // Rota de navegação em ciano com glow
  sCtx.strokeStyle = "#38bdf8";
  sCtx.lineWidth = 10;
  sCtx.beginPath();
  sCtx.moveTo(260, 850);
  sCtx.lineTo(260, 520);
  sCtx.bezierCurveTo(260, 440, 200, 380, 180, 320);
  sCtx.stroke();

  const screenTexture = new THREE.CanvasTexture(screenCanvas);
  const screenMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.16, 4.5),
    new THREE.MeshStandardMaterial({
      map: screenTexture,
      roughness: 0.3,
      metalness: 0.1,
    })
  );
  screenMesh.position.z = 0.13;
  group.add(screenMesh);

  // 3. Pino de Localização 3D Flutuando sobre a tela
  const pinGroup = new THREE.Group();

  // Cabeça do pino (esfera em coral)
  const pinHead = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 32), materials.clayCoral);
  pinHead.position.y = 0.45;
  pinGroup.add(pinHead);

  // Ponta do pino (cone voltado para baixo)
  const pinCone = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.55, 32), materials.clayCoral);
  pinCone.rotation.x = Math.PI;
  pinCone.position.y = 0.18;
  pinGroup.add(pinCone);

  // Anel de pulso no chão da tela
  const pulseRingGeo = new THREE.TorusGeometry(0.4, 0.02, 16, 32);
  const pulseRing = new THREE.Mesh(
    pulseRingGeo,
    new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.6 })
  );
  pulseRing.position.set(0, 0, 0);
  pinGroup.add(pulseRing);

  pinGroup.position.set(-0.25, 0.1, 0.28);
  group.add(pinGroup);

  group.scale.setScalar(scale);

  return {
    group,
    pin: pinGroup,
    update: (frame: number) => {
      // Rotação sutil isométrica
      group.rotation.y = -0.3 + Math.sin(frame * 0.02) * 0.08;
      group.rotation.x = 0.28 + Math.cos(frame * 0.03) * 0.05;
      group.position.y = Math.sin(frame * 0.04) * 0.15;

      // Pino pulsa de forma tátil
      const bounce = Math.abs(Math.sin(frame * 0.08)) * 0.18;
      pinGroup.position.z = 0.28 + bounce;
      pulseRing.scale.setScalar(1.0 + (frame % 30) / 15);
      (pulseRing.material as THREE.MeshBasicMaterial).opacity = 1 - (frame % 30) / 30;
    },
  };
}
