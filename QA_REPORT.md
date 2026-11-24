# 🔍 QA_REPORT.md — Auditoria de Qualidade e Conformidade

**Projeto:** A Origem Secreta do Bluetooth — O Rei Viking no Seu Celular  
**Composição Auditada:** `MainVideo` / `Bluetooth` (1080x1920 @ 30 FPS, 1760 frames / 58.67s)  
**Data:** 16/11/2026  

---

## 🚦 Tabela de Gates de Qualidade

| Critério | Status | Observações da Auditoria |
| :--- | :--- | :--- |
| **Duração (< 1 Minuto)** | ✅ APROVADO | Narração ElevenLabs `eleven_v4` com `57.76s` + cauda de loop = `58.67s` (`1760 frames`), estritamente abaixo de 60 segundos. |
| **Fonte Única de Tempo** | ✅ APROVADO | 100% dos gatilhos e faixas de cena calculados deterministicamente por `timing.ts` (`at()`, `sceneRange()`, `beats`) a partir de `alignment.json`. |
| **Paleta Restrita (4 Cores)** | ✅ APROVADO | Validado por `node scripts/lint-colors.js` sem erros (`#05070A`, `#FFFFFF`, `#1E6BFF`, `#FF1F3D`). |
| **Zona Segura (TikTok/Reels)** | ✅ APROVADO | Todos os elementos visuais respeitam o palco `Y: 185–1220px`, deixando a faixa de legendas (`Y ≈ 1360–1540px`) 100% livre de sobreposições. |
| **Integridade de Tipagem** | ✅ APROVADO | `npx tsc --noEmit` executado com **0 erros**. |
