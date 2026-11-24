import React, { useEffect, useRef } from "react";
import { AbsoluteFill } from "remotion";
import * as THREE from "three";
import { theme } from "../design/theme";

// Exemplo 3: Technical Blueprint / NASA (Wireframe puro cirúrgico de 1px, malha isométrica, estética engenharia aeroespacial)
export const Style3Blueprint: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = 1080;
    const height = 1920;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 5, 25);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    mountRef.current.appendChild(renderer.domElement);

    // Globo Terra em Wireframe Icosaedro Matemático de Alta Densidade
    const earthGeo = new THREE.IcosahedronGeometry(5.2, 3);
    const wireframeGeo = new THREE.WireframeGeometry(earthGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const earthWire = new THREE.LineSegments(wireframeGeo, wireframeMat);
    scene.add(earthWire);

    // Esfera interna preta pura
    const innerGeo = new THREE.SphereGeometry(5.0, 32, 32);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x05070a });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

    // Anéis de coordenadas equatoriais e polares com linhas finas
    const ring1Geo = new THREE.RingGeometry(7.8, 7.85, 96);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x3df2ff, side: THREE.DoubleSide });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 2.3;
    scene.add(ring1);

    const ring2Geo = new THREE.RingGeometry(8.4, 8.45, 96);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xffb938, side: THREE.DoubleSide, opacity: 0.7, transparent: true });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 2.8;
    ring2.rotation.y = 0.5;
    scene.add(ring2);

    renderer.render(scene, camera);

    return () => {
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070a", overflow: "hidden" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />

      {/* Grid de retículo técnico e cruzetas nos 4 cantos */}
      <div style={{ position: "absolute", top: 80, left: 80, fontFamily: theme.fonts.numbers, fontSize: 20, color: "rgba(255,255,255,0.4)" }}>
        NAVSTAR_OS // 1575.42 MHz
      </div>
      <div style={{ position: "absolute", top: 80, right: 80, fontFamily: theme.fonts.numbers, fontSize: 20, color: "rgba(255,255,255,0.4)" }}>
        LAT 00°00'00" / LON 00°00'00"
      </div>

      {/* Tipografia Brutalista de Engenharia */}
      <div
        style={{
          position: "absolute",
          top: 220,
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
            fontFamily: theme.fonts.numbers,
            fontSize: 26,
            fontWeight: 800,
            color: "#3df2ff",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          [ RELATÓRIO TÉCNICO AEROESPACIAL ]
        </span>
        <span
          style={{
            fontFamily: theme.fonts.headline,
            fontSize: 98,
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
          }}
        >
          DESVIO RELATIVÍSTICO
        </span>
        <span
          style={{
            marginTop: 20,
            fontFamily: theme.fonts.numbers,
            fontSize: 140,
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1,
            letterSpacing: "-0.04em",
          }}
        >
          38 µs / DIA
        </span>
        <span
          style={{
            marginTop: 16,
            fontFamily: theme.fonts.numbers,
            fontSize: 28,
            fontWeight: 700,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.15em",
          }}
        >
          Δt = 45 µs (GR) &minus; 7 µs (SR)
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
        OPÇÃO 3: TECHNICAL BLUEPRINT (NASA / ENGENHARIA)
      </div>
    </AbsoluteFill>
  );
};
