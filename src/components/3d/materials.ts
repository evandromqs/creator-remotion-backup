import * as THREE from "three";

export const materials = {
  // Porcelana branca fosca acetinada (corpo do satélite, componentes principais)
  clayWhite: new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.35,
    metalness: 0.05,
  }),

  // Ardósia / grafite fosco aveludado (chassi, frames de painel)
  clayDarkSlate: new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.5,
    metalness: 0.08,
  }),

  // Azul safira acetinado profundo (células solares fotovoltaicas)
  claySolarBlue: new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.25,
    metalness: 0.2,
  }),

  // Ouro champanhe acetinado (antenas, hastes, detalhes de precisão)
  clayGold: new THREE.MeshStandardMaterial({
    color: 0xf59e0b,
    roughness: 0.3,
    metalness: 0.4,
  }),

  // Coral / âmbar vivo (pinos de alerta, laser, pulsos ativos)
  clayCoral: new THREE.MeshStandardMaterial({
    color: 0xf43f5e,
    roughness: 0.35,
    metalness: 0.1,
  }),

  // Ciano elétrico de sinal (ondas de rádio, telemetria)
  claySignalCyan: new THREE.MeshBasicMaterial({
    color: 0x38bdf8,
    transparent: true,
  }),

  // Cromado fosco vintage (Sputnik 1957)
  clayChrome: new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.2,
    metalness: 0.7,
  }),
};
