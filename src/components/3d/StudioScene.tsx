import React, { useEffect, useRef } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import * as THREE from "three";

export interface StudioSceneProps {
  cameraPos?: [number, number, number];
  cameraLookAt?: [number, number, number];
  cameraFov?: number;
  setupScene: (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
    update: (frame: number) => void;
    dispose?: () => void;
  };
}

export const StudioScene: React.FC<StudioSceneProps> = ({
  cameraPos = [0, 1.2, 23],
  cameraLookAt = [0, 0, 0],
  cameraFov = 36,
  setupScene,
}) => {
  const frame = useCurrentFrame();
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneInstanceRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    update: (frame: number) => void;
    dispose?: () => void;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = 1080;
    const height = 1920;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(cameraFov, width / height, 0.1, 1000);
    camera.position.set(...cameraPos);
    camera.lookAt(...cameraLookAt);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    mountRef.current.appendChild(renderer.domElement);

    // Iluminação de Estúdio Suave Padrão Apple / Spline
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff7ed, 2.4);
    keyLight.position.set(6, 12, 10);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    fillLight.position.set(-8, -2, 8);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 3.5);
    rimLight.position.set(0, 6, -8);
    scene.add(rimLight);

    // Configuração customizada da cena
    const custom = setupScene(scene, camera);

    sceneInstanceRef.current = {
      renderer,
      scene,
      camera,
      update: custom.update,
      dispose: custom.dispose,
    };

    custom.update(frame);
    renderer.render(scene, camera);

    return () => {
      if (sceneInstanceRef.current?.dispose) {
        sceneInstanceRef.current.dispose();
      }
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      sceneInstanceRef.current = null;
    };
  }, []);

  // Atualização em cada frame do Remotion
  useEffect(() => {
    if (sceneInstanceRef.current) {
      sceneInstanceRef.current.update(frame);
      sceneInstanceRef.current.renderer.render(
        sceneInstanceRef.current.scene,
        sceneInstanceRef.current.camera
      );
    }
  }, [frame]);

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 25%, #151c2b 0%, #090c13 70%, #030406 100%)",
        overflow: "hidden",
      }}
    >
      <div ref={mountRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />
    </AbsoluteFill>
  );
};
