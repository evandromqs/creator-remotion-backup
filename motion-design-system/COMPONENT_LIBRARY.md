# Biblioteca de Componentes Reutilizáveis (React + TypeScript + SVG)

Todos os componentes devem ser construídos em **SVG e React** com parâmetros configuráveis (`colors`, `size`, `position`, `expression`, `orientation`, `animation`).

## Mapeamento de Componentes

| Componente | Responsabilidade |
| :--- | :--- |
| `Character` | Personagens vetoriais 2D com proporções consistentes |
| `CharacterPose` | Variações de postura (frente, perfil, sentado, andando, apontando, segurando objetos) |
| `Object` / `AnimatedObject` | Objetos cotidianos ilustrados (notebook, roteador, servidor, casa, carro, livro etc.) |
| `Scene` | Composição de cenários com 1º, 2º e 3º planos e espaço negativo |
| `Background` | Fundos sólidos ou com variação tonal discreta |
| `AnimatedText` | Textos animados com hierarquia tipográfica clara |
| `MotionShape` / `GeometricShape` | Primitivas geométricas padronizadas (círculos, retângulos arredondados, linhas, setas, cards) |
| `Shadow` | Camadas de sombra difusa e suave com deslocamento discreto |
| `Transition` / `MotionTransition` | Transições geométricas e limpas entre cenas |
| `Callout` | Destaques, rótulos e indicações visuais |
| `Infographic` | Gráficos, diagramas e fluxos animados |

## Diretriz de Parametrização

- **Cores:** consumir tokens de `components/tokens.ts` / `design-tokens.json` permitindo sobrescrita por projeto.
- **Dimensão e Posição:** aceitar coordenadas e escala sem distorcer proporções.
- **Expressão e Orientação:** permitir variações discretas em personagens sem alterar o traço base.
- **Animação:** receber `startFrame`, duração ou preset compatível com `useCurrentFrame()`, `interpolate()` e `spring()`.
