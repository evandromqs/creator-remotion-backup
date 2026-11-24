import React, { useEffect, useRef } from "react";
import { AbsoluteFill } from "remotion";
import * as THREE from "three";
import { theme } from "../design/theme";

// Exemplo 2: Vox / Johnny Harris (Preto dramático, Spotlight cinematográfico, globo tátil com relevo, feixes de laser vermelhos de trajetória)
export const Style2VoxHarris: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = 1080;
    const height = 1920;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 4, 22);
    camera.lookAt(0, -1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    mountRef.current.appendChild(renderer.domElement);

    // Iluminação dramática de holofote (Spotlight único)
    const spot = new THREE.SpotLight(0xffffff, 8.0, 60, Math.PI / 4, 0.4);
    spot.position.set(15, 25, 20);
    scene.add(spot);

    const rim = new THREE.DirectionalLight(0xff4d4d, 3.0);
    rim.position.set(-15, -10, -5);
    scene.add(rim);

    // Terra Tátil e Escura
    const earthGeo = new THREE.SphereGeometry(5.4, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x11131a,
      roughness: 0.85,
      metalness: 0.2,
      wireframe: false,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    earth.position.y = -3;
    scene.add(earth);

    // Linha de trajetória vermelha de investigação rasgando a Terra
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-4.5, -1.0, 3.8),
      new THREE.Vector3(-1.0, 1.2, 5.5),
      new THREE.Vector3(3.2, 0.5, 4.6),
      new THREE.Vector3(7.5, 4.0, 2.0),
    ]);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.12, 12, false);
    const tubeMat = new THREE.MeshBasicMaterial({ color: 0xff4d4d });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    earth.add(tube);

    // Marcadores circulares na rota
    const pinGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const pinMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pin = new THREE.Mesh(pinGeo, pinMat);
    pin.position.set(-4.5, -1.0, 3.8);
    earth.add(pin);

    renderer.render(scene, camera);

    return () => {
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#020305", overflow: "hidden" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />

      {/* Tipografia Editorial de Documentário Investigativo */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 90,
          right: 90,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: theme.fonts.headline,
            fontSize: 28,
            fontWeight: 800,
            color: "#ff4d4d",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          // INVESTIGAÇÃO CIENTÍFICA
        </span>
        <span
          style={{
            fontFamily: theme.fonts.headline,
            fontSize: 110,
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.0,
            letterSpacing: "-0.05em",
            textTransform: "uppercase",
            textShadow: "0 10px 40px rgba(0,0,0,0.9)",
          }}
        >
          11 QUILÔMETROS FORA DA ROTA
        </span>
        <span
          style={{
            marginTop: 20,
            fontFamily: theme.fonts.headline,
            fontSize: 34,
            fontWeight: 700,
            color: "rgba(255,255,255,0.65)",
            textAlign: "center",
            letterSpacing: "0.05em",
          }}
        >
          O desvio que quase enterrou o GPS na Guerra Fria
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: theme.fonts.headline,
          fontSize: 26,
          fontWeight: 800,
          color: "rgba(255,255,255,0.5)",
          letterSpacing: "0.2em",
        }}
      >
        OPÇÃO 2: INVESTIGATIVE 3D (VOX / JOHNNY HARRIS)
      </div>
    </AbsoluteFill>
  );
};
