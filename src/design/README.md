# 🎨 Design System & Regras de Estabilidade Geométrica (Anti-Bug)

## 📌 1. Tokens Oficiais de Paleta (4 Cores Estritas — `tokens.ts`)

| Token | Hex | Papel |
| :--- | :--- | :--- |
| **`BLACK`** | `#05070A` | Fundo dominante (~60%), contornos e sombras |
| **`WHITE`** | `#FFFFFF` | Tipografia base (~25%), linhas, alto contraste |
| **`BLUE`** | `#1E6BFF` | Tecnologia (~10%), circuitos elétricos, foco |
| **`RED`** | `#FF1F3D` | Alerta (~5%), conflito, falhas e impactos |

*Validação automática:* `node scripts/lint-colors.js`

---

## 🛡️ 2. As 5 Regras de Ouro de Estabilidade Geométrica (Zero Layout Shift)

Para impedir que elementos pulem, mudem de alinhamento ou vazem da tela durante a ativação de efeitos (`Shake`, `PunchIn`, `GlitchHit`, `ParticleBurst`), todo código deve obedecer às 5 regras abaixo (auditadas por `node scripts/lint-layout.js`):

### Regra 1: Proibição de Mutação de Árvore DOM nos Efeitos (`src/fx/`)
* **O Erro Passado:** `Shake`, `PunchIn` e `GlitchHit` retornavam `<>{children}</>` quando inativos (`rel < 0` ou `rel >= duration`) e montavam um `<div>` extra apenas durante os frames ativos.
* **A Regra:** Todo componente wrapper em `src/fx/` deve renderizar **sempre a mesma árvore DOM** do frame 0 ao fim da cena, alterando apenas valores numéricos de `transform` (`scale(1)` ou `translate3d(0,0,0)` quando inativo).

### Regra 2: Proibição de `width: "100%"` e `height: "100%"` em Wrappers de Efeito
* **O Erro Passado:** Quando `Shake`, `PunchIn` ou `GlitchHit` aplicavam `width: "100%", height: "100%"` dentro de uma cena `flexDirection: "column"`, o wrapper esticava para ocupar toda a altura restante da tela (empurrando elementos inferiores para fora) e perdia a centralização horizontal (`alignItems: "center"`), jogando elementos de largura fixa (como ícones ou cards) para a borda esquerda (`left: 0`).
* **A Regra:** Wrappers de efeito devem usar exclusivamente `display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative"`, abraçando o tamanho intrínseco do elemento filho.

### Regra 3: Proibição de `marginTop` no Filho Direto de `<GlitchHit>`, `<Shake>` ou `<PunchIn>`
* **O Erro Passado:** Colocar `marginTop` no elemento filho dentro de `<GlitchHit>` fazia as camadas clonadas (`position: absolute; inset: 0`) calcularem o topo de forma divergente da camada base devido a *margin collapse*.
* **A Regra:** O espaçamento (`marginTop`) deve ficar sempre em um `<div style={{ marginTop: ... }}>` **externo** ao `<Shake>` / `<GlitchHit>` / `<PunchIn>`.

### Regra 4: Slots Fixos com `opacity` em vez de Montagem Condicional (`{cond && ...}`)
* **O Erro Passado:** Montar carimbos e alertas finais com `{isActive && <div>...</div>}` no fluxo flex alterava a altura total da coluna no meio da cena e deixava `<ParticleBurst>` sem âncora relativa.
* **A Regra:** Sempre reservar o slot no layout com `opacity: isActive ? 1 : 0` e `position: "relative"`, garantindo que todos os elementos mantenham coordenadas `X, Y` imutáveis durante toda a cena.

### Regra 5: Frame Local Puro dentro de `<Sequence>` (`const f = useCurrentFrame()`)
* **O Erro Passado:** Usar `const f = currentFrame >= from ? currentFrame - from : currentFrame` dentro de cenas montadas via `<Sequence from={from}>`. Como `<Sequence>` já entrega `useCurrentFrame()` iniciando em `0`, qualquer cena cuja `duration` fosse maior que `from` sofria um reset abrupto para o frame `0` no meio da reprodução!
* **A Regra:** Dentro de `src/scenes/*.tsx`, usar sempre `const f = useCurrentFrame();` diretamente.
