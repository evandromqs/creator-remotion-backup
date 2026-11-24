import React, { useEffect, useRef } from "react";
import { AbsoluteFill } from "remotion";
import * as THREE from "three";
import { theme } from "../design/theme";

// Exemplo 1: Cleo Abram Style (Grid perspectiva no chão, Terra glossy dark, anel elegante, tipografia monumental sem caixa)
export const Style1CleoAbram: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = 1080;
    const height = 1920;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.035);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 7, 24);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    mountRef.current.appendChild(renderer.domElement);

    // Grid perspectiva no chão (A marca registrada de Cleo Abram)
    const gridHelper = new THREE.GridHelper(60, 60, 0x3df2ff, 0x1a264a);
    gridHelper.position.y = -6.5;
    scene.add(gridHelper);

    // Luzes elegantes de estúdio
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffb938, 3.0);
    keyLight.position.set(12, 15, 10);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x3df2ff, 4.0);
    rimLight.position.set(-15, 10, -10);
    scene.add(rimLight);

    // Globo Terra: Vidro Escuro Glossy com relevo e anel de atmosfera
    const earthGeo = new THREE.SphereGeometry(5.0, 64, 64);
    const earthMat = new THREE.MeshPhysicalMaterial({
      color: 0x070b19,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.3,
      ior: 1.4,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    });
    const earth = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earth);

    // Anel orbital de luz âmbar/ciano
    const ringGeo = new THREE.TorusGeometry(8.2, 0.08, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x3df2ff });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.8;
    ring.rotation.y = 0.2;
    scene.add(ring);

    // Satélite minimalista em titânio polido no anel
    const satGeo = new THREE.BoxGeometry(0.8, 0.8, 1.2);
    const satMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0xffb938,
      emissiveIntensity: 0.6,
    });
    const sat = new THREE.Mesh(satGeo, satMat);
    sat.position.set(6.2, 3.8, 4.0);
    scene.add(sat);

    // Painéis solares do satélite
    const panelGeo = new THREE.BoxGeometry(3.2, 0.05, 0.8);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x0a1230, metalness: 0.8, roughness: 0.2 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(6.2, 3.8, 4.0);
    scene.add(panel);

    renderer.render(scene, camera);

    return () => {
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: "#05070d", overflow: "hidden" }}>
      {/* Three.js Canvas */}
      <div ref={mountRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />

      {/* Tipografia Monumental Editorial (Sem caixas nem molduras) */}
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
            fontFamily: theme.fonts.headline,
            fontSize: 32,
            fontWeight: 800,
            color: "#3df2ff",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          // O PROBLEMA DA RELATIVIDADE
        </span>
        <span
          style={{
            fontFamily: theme.fonts.headline,
            fontSize: 105,
            fontWeight: 900,
            color: "#f5f7ff",
            textAlign: "center",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            textShadow: "0 12px 36px rgba(0,0,0,0.8)",
          }}
        >
          SEM EINSTEIN, O GPS ERRARIA
        </span>
        <span
          style={{
            marginTop: 24,
            fontFamily: theme.fonts.numbers,
            fontSize: 150,
            fontWeight: 900,
            color: "#ffb938",
            lineHeight: 1,
            letterSpacing: "-0.05em",
            textShadow: "0 0 50px rgba(255, 185, 56, 0.6)",
          }}
        >
          +11.4 KM
        </span>
        <span
          style={{
            marginTop: 10,
            fontFamily: theme.fonts.headline,
            fontSize: 36,
            fontWeight: 800,
            color: "rgba(245,247,255,0.7)",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          A CADA 24 HORAS
        </span>
      </div>

      {/* Label inferior indicando o estilo */}
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
        OPÇÃO 1: TECH MINIMALISM (CLEO ABRAM)
      </div>
    </AbsoluteFill>
  );
};
