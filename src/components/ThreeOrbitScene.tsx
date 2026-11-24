import React, { useEffect, useRef } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import * as THREE from "three";

interface ThreeOrbitSceneProps {
  era?: "modern" | "alert" | "vintage";
}

export const ThreeOrbitScene: React.FC<ThreeOrbitSceneProps> = ({ era = "modern" }) => {
  const frame = useCurrentFrame();
  const mountRef = useRef<HTMLDivElement>(null);

  // Instâncias estáveis do Three.js mantidas em ref
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const orbitGroupRef = useRef<THREE.Group | null>(null);
  const satellitesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = 1080;
    const height = 1920;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 8, 22);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x1e6bff, 2.5);
    dirLight.position.set(10, 20, 15);
    scene.add(dirLight);

    const redLight = new THREE.PointLight(0xff1f3d, 2.0, 50);
    redLight.position.set(-10, -10, 10);
    scene.add(redLight);

    // 5. Terra Central (Globo Wireframe Minimalista Dark)
    const earthGeo = new THREE.SphereGeometry(4.2, 28, 28);
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x05070a,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
      emissive: 0x1e6bff,
      emissiveIntensity: 0.35,
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // Núcleo interno opaco
    const coreGeo = new THREE.SphereGeometry(4.0, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x05070a });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    earthMesh.add(coreMesh);

    // 6. Grupo Orbital dos Satélites
    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);
    orbitGroupRef.current = orbitGroup;

    // 3 Anéis Orbitais com inclinações diferentes
    const orbitRadius = 7.8;
    const satellites: THREE.Mesh[] = [];

    const ringAngles = [
      { x: 0.9, y: 0.3, z: 0.4 },
      { x: -0.8, y: 0.6, z: -0.5 },
      { x: 0.2, y: -0.9, z: 0.8 },
    ];

    ringAngles.forEach((angles, ringIdx) => {
      const ringGroup = new THREE.Group();
      ringGroup.rotation.set(angles.x, angles.y, angles.z);
      orbitGroup.add(ringGroup);

      // Anel Linha
      const ringGeo = new THREE.RingGeometry(orbitRadius - 0.05, orbitRadius + 0.05, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: ringIdx === 0 ? 0xff1f3d : 0x1e6bff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      ringGroup.add(ringMesh);

      // 4 Satélites por anel
      for (let s = 0; s < 4; s++) {
        const satAngle = (s * Math.PI) / 2;
        const satGeo = new THREE.BoxGeometry(0.5, 0.5, 0.7);
        const satMat = new THREE.MeshStandardMaterial({
          color: ringIdx === 0 ? 0xff1f3d : 0xffffff,
          emissive: ringIdx === 0 ? 0xff1f3d : 0x1e6bff,
          emissiveIntensity: 0.8,
          metalness: 0.9,
          roughness: 0.1,
        });
        const sat = new THREE.Mesh(satGeo, satMat);
        sat.position.set(Math.cos(satAngle) * orbitRadius, 0, Math.sin(satAngle) * orbitRadius);
        ringGroup.add(sat);
        satellites.push(sat);
      }
    });

    satellitesRef.current = satellites;

    return () => {
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Animação determinística acoplada ao frame do Remotion
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    const angle = (frame * 0.015);
    const camRadius = interpolate(frame, [0, 450], [22, 18]);
    const camY = interpolate(frame, [0, 450], [8, 5]);

    // Rotação suave da câmera e da Terra
    cameraRef.current.position.x = Math.sin(angle * 0.5) * camRadius;
    cameraRef.current.position.z = Math.cos(angle * 0.5) * camRadius;
    cameraRef.current.position.y = camY;
    cameraRef.current.lookAt(0, 0, 0);

    if (earthMeshRef.current) {
      earthMeshRef.current.rotation.y = angle * 0.8;
    }

    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y = -angle * 0.4;
      orbitGroupRef.current.rotation.x = Math.sin(angle * 0.3) * 0.2;
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, [frame]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none", zIndex: 5 }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
    </AbsoluteFill>
  );
};
