import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { StudioScene } from "./3d/StudioScene";
import { createEarthGlobe } from "./3d/EarthGlobe";
import { createSatelliteMesh } from "./3d/SatelliteMesh";
import { createSputnikMesh } from "./3d/SputnikMesh";
import { createAtomicClockMesh } from "./3d/AtomicClockMesh";
import { createSmartphoneMesh } from "./3d/SmartphoneMesh";
import { createCarRiverMesh } from "./3d/CarRiverMesh";
import { createSpacetimeMesh } from "./3d/SpacetimeMesh";
import { MetricCounter } from "./MetricCounter";
import { materials } from "./3d/materials";

export interface SceneComponentProps {
  scene: any;
}

// ==========================================
// CENA 1: MapHook3D (0-177f)
// ==========================================
export const MapHook3D: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 1.2, 17]}
        cameraLookAt={[0, 0.6, 0]}
        setupScene={(s) => {
          const phone = createSmartphoneMesh(1.05);
          phone.group.position.y = 0.5;
          s.add(phone.group);
          return {
            update: () => phone.update(rel),
          };
        }}
      />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 2: GpsDriftCounter (177-399f)
// ==========================================
export const GpsDriftCounter: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - scene.from;

  const countSpr = spring({
    frame: rel - 10,
    fps,
    config: { damping: 18, stiffness: 60, mass: 1.0 },
  });
  const kmValue = interpolate(countSpr, [0, 1], [0.0, 11.0]);

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 1.2, 23]}
        cameraLookAt={[0, 0, 0]}
        setupScene={(s) => {
          const earth = createEarthGlobe(4.8);
          earth.group.position.set(0, -4.6, 0);
          s.add(earth.group);

          const sat = createSatelliteMesh(0.95);
          sat.group.position.set(0, 3.8, 0.5);
          s.add(sat.group);

          // Anéis de sinal descendo
          const waveGeo = new THREE.TorusGeometry(1.0, 0.03, 16, 64);
          const waves: THREE.Mesh[] = [];
          for (let i = 0; i < 3; i++) {
            const w = new THREE.Mesh(waveGeo, materials.claySignalCyan.clone());
            w.rotation.x = Math.PI / 2.2;
            s.add(w);
            waves.push(w);
          }

          return {
            update: (f) => {
              earth.update(f);
              sat.update(f);
              waves.forEach((w, idx) => {
                const phase = ((f + idx * 20) % 60) / 60;
                w.scale.setScalar(0.5 + phase * 3.2);
                w.position.set(0, 2.6 - phase * 4.5, 0.5);
                (w.material as THREE.MeshBasicMaterial).opacity = (1 - phase) * 0.45;
              });
            },
            dispose: () => {
              earth.texture.dispose();
            },
          };
        }}
      />
      <MetricCounter value={`+${kmValue.toFixed(1)}`} unit="KM" label="DESVIO ACUMULADO / DIA" marginTop={90} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 3: SputnikOrbit3D (399-597f)
// ==========================================
export const SputnikOrbit3D: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 0.8, 16]}
        cameraLookAt={[0, 0, 0]}
        setupScene={(s) => {
          const earth = createEarthGlobe(3.5);
          earth.group.position.set(0, -3.8, -2);
          s.add(earth.group);

          const sputnik = createSputnikMesh(1.2);
          sputnik.group.position.set(0, 2.2, 1.0);
          s.add(sputnik.group);

          return {
            update: () => {
              earth.update(rel);
              sputnik.update(rel);
            },
            dispose: () => earth.texture.dispose(),
          };
        }}
      />
      <MetricCounter value="1957" label="SATÉLITE SPUTNIK • GUERRA FRIA" marginTop={110} color="#f59e0b" />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 4: DopplerWaves (597-795f)
// ==========================================
export const DopplerWaves: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 1.0, 18]}
        cameraLookAt={[0, 0, 0]}
        setupScene={(s) => {
          const sat = createSatelliteMesh(0.85);
          s.add(sat.group);

          // Ondas Doppler frontais (azul comprimido)
          const blueRings: THREE.Mesh[] = [];
          for (let i = 0; i < 4; i++) {
            const r = new THREE.Mesh(
              new THREE.TorusGeometry(0.8 + i * 0.4, 0.025, 16, 48),
              new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.6 })
            );
            r.position.x = 1.8 + i * 0.7;
            r.rotation.y = Math.PI / 2;
            s.add(r);
            blueRings.push(r);
          }

          // Ondas Doppler traseiras (vermelho expandido)
          const redRings: THREE.Mesh[] = [];
          for (let i = 0; i < 3; i++) {
            const r = new THREE.Mesh(
              new THREE.TorusGeometry(1.2 + i * 0.9, 0.03, 16, 48),
              new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.5 })
            );
            r.position.x = -1.8 - i * 1.2;
            r.rotation.y = Math.PI / 2;
            s.add(r);
            redRings.push(r);
          }

          return {
            update: () => {
              sat.update(rel);
              blueRings.forEach((r, idx) => {
                r.position.x = 1.4 + idx * 0.7 + Math.sin(rel * 0.1) * 0.1;
              });
              redRings.forEach((r, idx) => {
                r.position.x = -1.5 - idx * 1.3 - Math.sin(rel * 0.05) * 0.15;
              });
            },
          };
        }}
      />
      <MetricCounter value="1575.42" unit="MHz" label="EFEITO DOPPLER NO ESPAÇO" marginTop={100} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 5: TriangulationGlobe (795-1080f)
// ==========================================
export const TriangulationGlobe: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 0, 24]}
        cameraLookAt={[0, 0, 0]}
        setupScene={(s) => {
          const earth = createEarthGlobe(4.5);
          s.add(earth.group);

          // 4 Satélites triangulando em ângulos cardeais
          const sats: THREE.Group[] = [];
          const angles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2];

          angles.forEach((ang) => {
            const sat = createSatelliteMesh(0.5);
            sat.group.position.set(Math.cos(ang) * 8.5, Math.sin(ang) * 8.5, 0);
            sat.group.lookAt(0, 0, 0);
            s.add(sat.group);
            sats.push(sat.group);

            // Cone de sinal suave conectando à Terra
            const coneGeo = new THREE.ConeGeometry(1.4, 7.5, 16);
            const coneMat = new THREE.MeshBasicMaterial({
              color: 0x38bdf8,
              transparent: true,
              opacity: 0.15,
            });
            const cone = new THREE.Mesh(coneGeo, coneMat);
            cone.position.set(Math.cos(ang) * 4.2, Math.sin(ang) * 4.2, 0);
            cone.quaternion.copy(sat.group.quaternion);
            cone.rotateX(Math.PI / 2);
            s.add(cone);
          });

          return {
            update: () => {
              earth.update(rel);
            },
            dispose: () => earth.texture.dispose(),
          };
        }}
      />
      <MetricCounter value="4 SINAIS" label="TRIANGULAÇÃO DO GPS NA TERRA" marginTop={90} color="#fbbf24" />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 6: SatelliteConstellation (1080-1230f)
// ==========================================
export const SatelliteConstellation: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 2.0, 32]}
        cameraLookAt={[0, 0, 0]}
        setupScene={(s) => {
          const earth = createEarthGlobe(3.2);
          s.add(earth.group);

          // 6 Planos orbitais com 31 satélites esféricos em miniatura
          const orbitCount = 6;
          for (let p = 0; p < orbitCount; p++) {
            const ringGeo = new THREE.TorusGeometry(8.5, 0.025, 16, 80);
            const ring = new THREE.Mesh(
              ringGeo,
              new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.25 })
            );
            ring.rotation.x = (Math.PI / 3) * (p % 3);
            ring.rotation.y = (p * Math.PI) / orbitCount;
            s.add(ring);

            // Satélites pontuais no anel
            for (let sat = 0; sat < 5; sat++) {
              const miniSat = new THREE.Mesh(
                new THREE.SphereGeometry(0.18, 16, 16),
                new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.2, metalness: 0.5 })
              );
              const angle = (sat * Math.PI * 2) / 5;
              miniSat.position.set(Math.cos(angle) * 8.5, Math.sin(angle) * 8.5, 0);
              ring.add(miniSat);
            }
          }

          return {
            update: () => {
              earth.update(rel);
              s.rotation.y = rel * 0.003;
            },
            dispose: () => earth.texture.dispose(),
          };
        }}
      />
      <MetricCounter value="31" unit="SATÉLITES" label="20.200 KM DE ALTITUDE" marginTop={90} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 7: AtomicClock3D (1230-1419f)
// ==========================================
export const AtomicClock3D: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 1.2, 19]}
        cameraLookAt={[0, 0.4, 0]}
        setupScene={(s) => {
          const clock = createAtomicClockMesh(1.0);
          clock.group.position.y = 0.5;
          s.add(clock.group);
          return {
            update: () => clock.update(rel),
          };
        }}
      />
      <MetricCounter value="10⁻⁹" unit="s" label="PRECISÃO DO RELÓGIO ATÔMICO DE CÉSIO" marginTop={100} color="#fbbf24" />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 8: ClockGlitchChaos (1419-1575f)
// ==========================================
export const ClockGlitchChaos: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 1.2, 19]}
        cameraLookAt={[0, 0.4, 0]}
        setupScene={(s) => {
          const clock = createAtomicClockMesh(1.0);
          clock.group.position.y = 0.5;
          s.add(clock.group);

          // Anéis vermelhos de alerta
          const warnGeo = new THREE.TorusGeometry(2.2, 0.05, 16, 64);
          const warnRing = new THREE.Mesh(
            warnGeo,
            new THREE.MeshBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.7 })
          );
          warnRing.rotation.x = Math.PI / 2;
          s.add(warnRing);

          return {
            update: () => {
              clock.update(rel);
              const jitter = Math.sin(rel * 0.5) * 0.08;
              clock.group.position.x = jitter;
              warnRing.scale.setScalar(1.0 + Math.abs(Math.sin(rel * 0.2)) * 0.3);
            },
          };
        }}
      />
      <MetricCounter value="TEMPO DESSINCRONIZOU" label="ALERTA DE DESVIO NO ESPAÇO" marginTop={100} color="#f43f5e" />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 9: EinsteinEquation (1575-1716f)
// ==========================================
export const EinsteinEquation: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 4.0, 22]}
        cameraLookAt={[0, -0.5, 0]}
        setupScene={(s) => {
          const spacetime = createSpacetimeMesh(1.1);
          s.add(spacetime.group);
          return {
            update: () => spacetime.update(rel),
          };
        }}
      />
      <MetricCounter value="RELATIVIDADE" label="2 EFEITOS OPOSTOS DE EINSTEIN" marginTop={90} color="#38bdf8" />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 10: TimeSlowSatellite (1716-1920f)
// ==========================================
export const TimeSlowSatellite: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - scene.from;

  const spr = spring({ frame: rel, fps, config: { damping: 14, stiffness: 80 } });
  const val = interpolate(spr, [0, 1], [0.0, -7.0]);

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 1.2, 18]}
        cameraLookAt={[0, 0, 0]}
        setupScene={(s) => {
          const sat = createSatelliteMesh(0.95);
          s.add(sat.group);

          // Rastro de partículas de velocidade
          const trailGeo = new THREE.SphereGeometry(0.08, 8, 8);
          const trail: THREE.Mesh[] = [];
          for (let i = 0; i < 15; i++) {
            const p = new THREE.Mesh(
              trailGeo,
              new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 })
            );
            s.add(p);
            trail.push(p);
          }

          return {
            update: () => {
              sat.update(rel);
              sat.group.position.x = Math.sin(rel * 0.03) * 2.5;
              trail.forEach((p, idx) => {
                p.position.set(
                  sat.group.position.x - idx * 0.35,
                  sat.group.position.y,
                  sat.group.position.z - idx * 0.2
                );
              });
            },
          };
        }}
      />
      <MetricCounter value={`${val.toFixed(1)}`} unit="µs/dia" label="DILATAÇÃO TEMPORAL POR VELOCIDADE" marginTop={90} color="#38bdf8" />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 11: TimeFastGravity (1920-2058f)
// ==========================================
export const TimeFastGravity: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 1.5, 23]}
        cameraLookAt={[0, 0, 0]}
        setupScene={(s) => {
          const earth = createEarthGlobe(4.2);
          earth.group.position.set(0, -5.2, 0);
          s.add(earth.group);

          const clock = createAtomicClockMesh(0.85);
          clock.group.position.set(0, 3.2, 0);
          s.add(clock.group);

          return {
            update: () => {
              earth.update(rel);
              clock.update(rel);
            },
            dispose: () => earth.texture.dispose(),
          };
        }}
      />
      <MetricCounter value="TEMPO ACELERA" label="GRAVIDADE MENOR A 20.000 KM" marginTop={90} color="#fbbf24" />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 12: BigNumberPop (2058-2136f)
// ==========================================
export const BigNumberPop: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - scene.from;

  const spr = spring({ frame: rel, fps, config: { damping: 12, stiffness: 100 } });
  const val = interpolate(spr, [0, 1], [0.0, 45.0]);

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 1.0, 20]}
        cameraLookAt={[0, 0.4, 0]}
        setupScene={(s) => {
          const clock = createAtomicClockMesh(0.9);
          clock.group.position.y = 0.5;
          s.add(clock.group);

          // Onda de choque dourada expandindo
          const shockGeo = new THREE.TorusGeometry(3.0, 0.06, 16, 64);
          const shock = new THREE.Mesh(
            shockGeo,
            new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.8 })
          );
          shock.rotation.x = Math.PI / 2;
          shock.position.y = 0.5;
          s.add(shock);

          return {
            update: () => {
              clock.update(rel);
              shock.scale.setScalar(1.0 + (rel % 40) / 20);
              (shock.material as THREE.MeshBasicMaterial).opacity = 0.9 - (rel % 40) / 40;
            },
          };
        }}
      />
      <MetricCounter value={`+${val.toFixed(1)}`} unit="µs/dia" label="GANHO TEMPORAL GRAVITACIONAL" marginTop={100} color="#fbbf24" />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 13: EquationResult (2136-2370f)
// ==========================================
export const EquationResult: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rel = frame - scene.from;

  const spr = spring({ frame: rel - 10, fps, config: { damping: 16, stiffness: 80 } });
  const val = interpolate(spr, [0, 1], [0, 38]);

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 1.2, 21]}
        cameraLookAt={[0, 0, 0]}
        setupScene={(s) => {
          const sat = createSatelliteMesh(0.9);
          s.add(sat.group);

          // Dois orbes colidindo (+45 dourado e -7 ciano)
          const orb1 = new THREE.Mesh(
            new THREE.SphereGeometry(0.7, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.2, emissive: 0xf59e0b, emissiveIntensity: 0.5 })
          );
          const orb2 = new THREE.Mesh(
            new THREE.SphereGeometry(0.7, 32, 32),
            new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.2, emissive: 0x0284c7, emissiveIntensity: 0.5 })
          );
          s.add(orb1);
          s.add(orb2);

          return {
            update: () => {
              sat.update(rel);
              const merge = Math.min(1, rel / 40);
              orb1.position.set(-2.5 * (1 - merge), -1.2, 0);
              orb2.position.set(2.5 * (1 - merge), -1.2, 0);
            },
          };
        }}
      />
      <MetricCounter value={`+${Math.round(val)}`} unit="µs/dia" label="+45 µs - 7 µs = DIFERENÇA CÓSMICA" marginTop={90} color="#fbbf24" />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 14: CarIntoRiver3D (2370-2634f)
// ==========================================
export const CarIntoRiver3D: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 4.5, 22]}
        cameraLookAt={[0, 0.5, 0]}
        setupScene={(s) => {
          const carRiver = createCarRiverMesh(1.1);
          s.add(carRiver.group);
          return {
            update: () => carRiver.update(rel),
          };
        }}
      />
      <MetricCounter value="11.4" unit="KM" label="DESVIO JOGARIA O CARRO NO RIO" marginTop={90} color="#f43f5e" />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 15: EngineersReprogram (2634-2859f)
// ==========================================
export const EngineersReprogram: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 0.5, 14]}
        cameraLookAt={[0, 0, 0]}
        setupScene={(s) => {
          const clock = createAtomicClockMesh(1.1);
          s.add(clock.group);

          // Anel de calibração em rotação contrária
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(2.0, 0.05, 16, 64),
            materials.clayGold
          );
          ring.rotation.x = Math.PI / 2;
          s.add(ring);

          return {
            update: () => {
              clock.update(rel);
              ring.rotation.z = -rel * 0.02;
            },
          };
        }}
      />
      <MetricCounter value="10.229999995" unit="MHz" label="RECALIBRAÇÃO MILITAR NO ESPAÇO" marginTop={100} color="#38bdf8" />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 16: Timeline1983 (2859-3030f)
// ==========================================
export const Timeline1983: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 1.2, 22]}
        cameraLookAt={[0, 0, 0]}
        setupScene={(s) => {
          const earth = createEarthGlobe(4.4);
          s.add(earth.group);

          // Anéis de sinal dourado civil expandindo globalmente
          const waveGeo = new THREE.TorusGeometry(6.0, 0.04, 16, 80);
          const wave = new THREE.Mesh(
            waveGeo,
            new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.6 })
          );
          wave.rotation.x = Math.PI / 2;
          s.add(wave);

          return {
            update: () => {
              earth.update(rel);
              wave.scale.setScalar(1.0 + (rel % 50) / 25);
              (wave.material as THREE.MeshBasicMaterial).opacity = 0.8 - (rel % 50) / 50;
            },
            dispose: () => earth.texture.dispose(),
          };
        }}
      />
      <MetricCounter value="1983" label="SINAL LIBERADO PARA USO CIVIL MUNDIAL" marginTop={90} color="#fbbf24" />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 17: WorldDependence (3030-3267f)
// ==========================================
export const WorldDependence: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 1.5, 24]}
        cameraLookAt={[0, 0, 0]}
        setupScene={(s) => {
          const earth = createEarthGlobe(4.6);
          s.add(earth.group);

          // Rotas de tráfego aéreo e conexões globais brilhando
          const routeGeo = new THREE.TorusGeometry(5.2, 0.02, 16, 80);
          for (let i = 0; i < 4; i++) {
            const r = new THREE.Mesh(
              routeGeo,
              new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.35 })
            );
            r.rotation.x = (i * Math.PI) / 4;
            r.rotation.y = (i * Math.PI) / 3;
            earth.group.add(r);
          }

          return {
            update: () => earth.update(rel),
            dispose: () => earth.texture.dispose(),
          };
        }}
      />
      <MetricCounter value="+6 BILHÕES" label="DISPOSITIVOS CONECTADOS HOJE" marginTop={90} />
    </AbsoluteFill>
  );
};

// ==========================================
// CENA 18: CtaLab (3267-3400f)
// ==========================================
export const CtaLab: React.FC<SceneComponentProps> = ({ scene }) => {
  const frame = useCurrentFrame();
  const rel = frame - scene.from;

  return (
    <AbsoluteFill>
      <StudioScene
        cameraPos={[0, 1.0, 18]}
        cameraLookAt={[0, 0, 0]}
        setupScene={(s) => {
          const sat = createSatelliteMesh(0.95);
          sat.group.position.set(0, 2.8, 0);
          s.add(sat.group);

          // Caixa de delivery em cerâmica vermelha
          const boxGeo = new THREE.BoxGeometry(1.6, 1.4, 1.6);
          const box = new THREE.Mesh(boxGeo, materials.clayCoral);
          box.position.set(0, -1.2, 0);
          box.rotation.y = 0.4;
          s.add(box);

          return {
            update: () => {
              sat.update(rel);
              box.rotation.y = 0.4 + rel * 0.01;
            },
          };
        }}
      />
      <MetricCounter value="EINSTEIN NO SEU DELIVERY" label="COMENTA AÍ E SEGUE O LABORATÓRIO!" marginTop={90} color="#fbbf24" />
    </AbsoluteFill>
  );
};

// ==========================================
// REGISTRO OFICIAL DAS 18 CENAS DINÂMICAS
// ==========================================
export const sceneComponentRegistry: Record<string, React.FC<SceneComponentProps>> = {
  MapHook3D,
  GpsDriftCounter,
  SputnikOrbit3D,
  DopplerWaves,
  TriangulationGlobe,
  SatelliteConstellation,
  AtomicClock3D,
  ClockGlitchChaos,
  EinsteinEquation,
  TimeSlowSatellite,
  TimeFastGravity,
  BigNumberPop,
  EquationResult,
  CarIntoRiver3D,
  EngineersReprogram,
  Timeline1983,
  WorldDependence,
  CtaLab,
};

export const getSceneComponent = (componentName: string): React.FC<SceneComponentProps> => {
  return sceneComponentRegistry[componentName] || MapHook3D;
};
