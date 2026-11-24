import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { theme } from "../design/theme";

// Gerador procedural de textura leve de planeta (estilizada em cerâmica/clay com continentes reconhecíveis)
function createEarthCanvasTexture(): THREE.CanvasTexture {
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

export const StyleAppleSpline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mountRef = useRef<HTMLDivElement>(null);

  // Contador animado fluido: 0.0 -> 11.0 km
  const countSpring = spring({
    frame: frame - 15,
    fps,
    config: { damping: 18, stiffness: 60, mass: 1.0 },
  });
  const errorKm = interpolate(countSpring, [0, 1], [0.0, 11.0]);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = 1080;
    const height = 1920;

    const scene = new THREE.Scene();

    // Câmera de estúdio com profundidade e enquadramento cinematográfico
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 23);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mountRef.current.appendChild(renderer.domElement);

    // Iluminação de Estúdio Suave (Sem reflexos brancos estourados)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    // Key light difusa no topo
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.2);
    keyLight.position.set(6, 12, 10);
    scene.add(keyLight);

    // Fill light fria lateral
    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    fillLight.position.set(-8, -2, 8);
    scene.add(fillLight);

    // Rim light traseira suave
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 3.2);
    rimLight.position.set(0, 6, -8);
    scene.add(rimLight);

    // --- 1. O PLANETA TERRA COM TEXTURA E ROTAÇÃO FÍSICA LÓGICA ---
    const earthGroup = new THREE.Group();

    // Inclinação axial real da Terra (23.4 graus)
    earthGroup.rotation.z = THREE.MathUtils.degToRad(-23.4);
    earthGroup.position.set(0, -4.6, 0);

    const earthTexture = createEarthCanvasTexture();
    const earthGeo = new THREE.SphereGeometry(4.8, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.75, // Acabamento aveludado sem estouro de luz
      metalness: 0.0,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);

    // Rotação contínua e lógica de oeste para leste
    earthMesh.rotation.y = frame * 0.008;
    earthGroup.add(earthMesh);

    // Atmosfera aveludada suave (halo externo de luz ciano)
    const atmosphereGeo = new THREE.SphereGeometry(4.95, 64, 64);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    earthGroup.add(atmosphere);

    // Anel orbital do GPS elegante
    const orbitRingGeo = new THREE.TorusGeometry(7.6, 0.03, 16, 120);
    const orbitRingMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.35,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI / 2.3;
    earthGroup.add(orbitRing);

    scene.add(earthGroup);

    // --- 2. O SATÉLITE GPS ORBITANDO DE FORMA LÓGICA NO TOPO ---
    const satelliteGroup = new THREE.Group();

    const clayWhite = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.05,
    });

    const clayDarkSlate = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.45,
      metalness: 0.1,
    });

    const claySolarCell = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.25,
      metalness: 0.15,
    });

    const clayGold = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.3,
      metalness: 0.35,
    });

    // Corpo cúbico chanfrado
    const coreMesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.8, 1.4), clayWhite);
    satelliteGroup.add(coreMesh);

    // Detalhes em grafite lateral
    const panelL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.3, 1.0), clayDarkSlate);
    panelL.position.x = -0.82;
    satelliteGroup.add(panelL);
    const panelR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.3, 1.0), clayDarkSlate);
    panelR.position.x = 0.82;
    satelliteGroup.add(panelR);

    // Cúpula superior dourada
    const topDome = new THREE.Mesh(
      new THREE.SphereGeometry(0.48, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      clayGold
    );
    topDome.position.y = 0.9;
    satelliteGroup.add(topDome);

    // Antena Parabólica Dourada apontada para a Terra
    const dishArm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.7, 16), clayGold);
    dishArm.position.set(0, -1.0, 0.15);
    satelliteGroup.add(dishArm);

    const dishMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2.5),
      clayGold
    );
    dishMesh.rotation.x = -Math.PI / 1.25;
    dishMesh.position.set(0, -1.4, 0.35);
    satelliteGroup.add(dishMesh);

    // Asas solares articuladas em perspectiva
    const createWing = (isLeft: boolean) => {
      const g = new THREE.Group();
      const dir = isLeft ? -1 : 1;
      const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 1.0, 16), clayGold);
      strut.rotation.z = Math.PI / 2;
      strut.position.x = dir * 0.5;
      g.add(strut);

      for (let c = 0; c < 3; c++) {
        const frameM = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.4, 0.06), clayDarkSlate);
        frameM.position.x = dir * (1.4 + c * 1.02);
        g.add(frameM);

        const cell = new THREE.Mesh(new THREE.BoxGeometry(0.82, 1.32, 0.08), claySolarCell);
        cell.position.x = dir * (1.4 + c * 1.02);
        g.add(cell);
      }
      return g;
    };
    satelliteGroup.add(createWing(true));
    satelliteGroup.add(createWing(false));

    // Posicionamento do satélite no centro superior
    const satFloatX = Math.sin(frame * 0.02) * 0.3;
    const satFloatY = 3.8 + Math.sin(frame * 0.04) * 0.15;

    satelliteGroup.position.set(satFloatX, satFloatY, 0.5);
    satelliteGroup.rotation.y = -0.45 + Math.sin(frame * 0.02) * 0.08;
    satelliteGroup.rotation.x = 0.38;
    satelliteGroup.scale.setScalar(0.95);
    scene.add(satelliteGroup);

    // --- 3. PULSOS DE SINAL CONCÊNTRICOS DESCENDO PARA A TERRA ---
    for (let i = 0; i < 3; i++) {
      const wavePhase = ((frame + i * 20) % 60) / 60;
      const waveRadius = 0.5 + wavePhase * 3.2;
      const waveOpacity = (1 - wavePhase) * 0.45;

      const waveGeo = new THREE.TorusGeometry(waveRadius, 0.03, 16, 64);
      const waveMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: waveOpacity,
      });
      const waveMesh = new THREE.Mesh(waveGeo, waveMat);
      waveMesh.rotation.x = Math.PI / 2.2;
      waveMesh.position.set(satFloatX, satFloatY - 1.2 - wavePhase * 4.5, 0.5);
      scene.add(waveMesh);
    }

    renderer.render(scene, camera);

    return () => {
      renderer.dispose();
      earthTexture.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [frame]);

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 25%, #151c2b 0%, #090c13 70%, #030406 100%)",
        overflow: "hidden",
        fontFamily: theme.fonts.headline,
      }}
    >
      {/* Three.js Canvas: Domina a cena inteira sem caixas */}
      <div ref={mountRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />

      {/* Camada Minimalista de Métrica Numérica (Zero texto redundante repetindo a narração) */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 180,
          paddingBottom: 240,
          paddingLeft: 60,
          paddingRight: 60,
          boxSizing: "border-box",
          pointerEvents: "none",
        }}
      >
        {/* Espaço do Topo Livre (Câmera 3D respira) */}
        <div style={{ height: 20 }} />

        {/* DADO NUMÉRICO PURO E ANIMADO (Ilustra a métrica citada sem repetir o áudio) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 90,
            textShadow: "0 10px 40px rgba(0,0,0,0.8)",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
            <span
              style={{
                fontFamily: theme.fonts.caption,
                fontSize: 140,
                fontWeight: 900,
                color: "#ffffff",
                letterSpacing: "-0.05em",
                lineHeight: 0.9,
                textShadow: "0 15px 60px rgba(56, 189, 248, 0.4)",
              }}
            >
              +{errorKm.toFixed(1)}
            </span>
            <span
              style={{
                fontFamily: theme.fonts.headline,
                fontSize: 42,
                fontWeight: 800,
                color: "#38bdf8",
                letterSpacing: "-0.02em",
              }}
            >
              KM
            </span>
          </div>

          <span
            style={{
              fontFamily: theme.fonts.headline,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "0.24em",
              color: "#94a3b8",
              textTransform: "uppercase",
              marginTop: 8,
            }}
          >
            DESVIO ACUMULADO / DIA
          </span>
        </div>

        {/* LEGENDA TIKTOK PURA & DINÂMICA (Regra de 3 palavras, destaque âmbar com spring, máxima legibilidade) */}
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              fontFamily: theme.fonts.caption,
              fontSize: 62,
              fontWeight: 900,
              color: "#ffffff",
              textAlign: "center",
              lineHeight: 1.25,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "12px 28px",
              textShadow: "0 6px 24px rgba(0,0,0,0.95)",
            }}
          >
            <span style={{ margin: "0 6px", WebkitTextStroke: "10px #05070d", paintOrder: "stroke fill" }}>
              SEU
            </span>
            <span style={{ margin: "0 6px", WebkitTextStroke: "10px #05070d", paintOrder: "stroke fill" }}>
              GPS
            </span>
            <span
              style={{
                margin: "0 6px",
                color: "#fbbf24",
                transform: "scale(1.14)",
                display: "inline-block",
                WebkitTextStroke: "10px #05070d",
                paintOrder: "stroke fill",
                textShadow: "0 0 35px rgba(251, 191, 36, 0.7)",
              }}
            >
              ERRARIA
            </span>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
