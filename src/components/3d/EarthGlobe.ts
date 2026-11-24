import * as THREE from "three";

export function createEarthCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  // Oceano: Slate escuro aveludado estilo Apple
  ctx.fillStyle = "#0c1222";
  ctx.fillRect(0, 0, 1024, 512);

  // Linhas geodésicas (paralelos e meridianos) finas e elegantes
  ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
  ctx.lineWidth = 1;
  for (let lat = 32; lat < 512; lat += 48) {
    ctx.beginPath();
    ctx.moveTo(0, lat);
    ctx.lineTo(1024, lat);
    ctx.stroke();
  }
  for (let lon = 0; lon <= 1024; lon += 64) {
    ctx.beginPath();
    ctx.moveTo(lon, 0);
    ctx.lineTo(lon, 512);
    ctx.stroke();
  }

  // Continentes estilizados em cerâmica aveludada
  ctx.fillStyle = "#1e293b";
  ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
  ctx.lineWidth = 2;

  const drawPolygon = (pts: [number, number][]) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(pts[i][0], pts[i][1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  // América do Norte
  drawPolygon([
    [100, 70], [180, 60], [280, 80], [290, 140], [260, 180],
    [230, 230], [200, 220], [170, 260], [140, 240], [120, 180],
    [80, 130], [90, 90]
  ]);

  // América do Sul
  drawPolygon([
    [220, 260], [280, 290], [310, 340], [290, 420], [260, 470],
    [230, 460], [210, 390], [200, 320], [210, 270]
  ]);

  // Europa
  drawPolygon([
    [450, 90], [520, 80], [550, 120], [540, 170], [480, 180],
    [450, 150], [440, 110]
  ]);

  // África
  drawPolygon([
    [460, 190], [540, 190], [570, 250], [550, 340], [520, 410],
    [490, 420], [470, 370], [440, 300], [440, 230]
  ]);

  // Ásia
  drawPolygon([
    [550, 80], [700, 70], [820, 90], [860, 160], [820, 240],
    [750, 270], [670, 260], [620, 220], [580, 230], [560, 170]
  ]);

  // Austrália
  drawPolygon([
    [780, 330], [850, 330], [880, 380], [860, 420], [810, 430],
    [770, 390], [770, 350]
  ]);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

export interface EarthGlobeInstance {
  group: THREE.Group;
  mesh: THREE.Mesh;
  texture: THREE.CanvasTexture;
  update: (frame: number) => void;
}

export function createEarthGlobe(radius: number = 4.8): EarthGlobeInstance {
  const group = new THREE.Group();

  // Inclinação axial real da Terra de 23.4 graus
  group.rotation.z = THREE.MathUtils.degToRad(-23.4);

  const texture = createEarthCanvasTexture();
  const earthGeo = new THREE.SphereGeometry(radius, 64, 64);
  const earthMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.75, // Aveludado fosco sem estouro de luz
    metalness: 0.0,
  });
  const mesh = new THREE.Mesh(earthGeo, earthMat);
  group.add(mesh);

  // Atmosfera aveludada suave (halo ciano)
  const atmosphereGeo = new THREE.SphereGeometry(radius * 1.03, 64, 64);
  const atmosphereMat = new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
    opacity: 0.22,
    side: THREE.BackSide,
  });
  const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
  group.add(atmosphere);

  // Anel orbital de luxo suave (como órbita do satélite)
  const orbitRingGeo = new THREE.TorusGeometry(radius * 1.58, 0.03, 16, 120);
  const orbitRingMat = new THREE.MeshBasicMaterial({
    color: 0xf59e0b,
    transparent: true,
    opacity: 0.35,
  });
  const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
  orbitRing.rotation.x = Math.PI / 2.3;
  group.add(orbitRing);

  return {
    group,
    mesh,
    texture,
    update: (frame: number) => {
      // Rotação física lógica de oeste para leste
      mesh.rotation.y = frame * 0.008;
    },
  };
}
