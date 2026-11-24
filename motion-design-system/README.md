# Modern Explainer — Motion Design System para Remotion & Antigravity

Sistema de direção de arte e biblioteca de referência para produção padronizada de vídeos animados no estilo **Modern Explainer** usando **Remotion**, **React**, **TypeScript** e **SVG**.

## Decisão de Arquitetura

O **Modern Explainer** é a identidade visual principal: visualmente rico, contemporâneo e modular, sem depender de modelagem 3D complexa ou ilustrações manuais únicas para cada cena. Cada projeto pode adotar variações de paleta de cores, personagens e cenários sem alterar as regras fundamentais da linguagem visual.

## Estrutura do Pacote

```text
motion-design-system/
├── README.md
├── MOTION_DESIGN_SYSTEM.md       # Identidade visual completa (ilustração, formas, cores, cenário, sombras)
├── ANIMATION_RULES.md            # Regras determinísticas de animação no Remotion e presets
├── COMPONENT_LIBRARY.md          # Arquitetura de componentes reutilizáveis em React/SVG
├── REFERENCE_INDEX.md            # Índice de referências, modelo de ficha (REF) e moodboards
├── USAGE_EXAMPLES.md             # Exemplo "Como funciona a internet" e escopo de demonstração
├── ANTIGRAVITY_PROMPT.md         # Prompt pronto para inicializar o sistema no Antigravity
├── design-tokens.json            # Tokens de cores e proporções em formato estruturado
├── references/
│   ├── 01-illustrations/         # Personagens, objetos e cenários
│   ├── 02-color-palettes/        # Cores e combinações (inclui swatch SVG)
│   ├── 03-composition/           # Enquadramento e organização
│   ├── 04-shadows-depth/         # Sombras e profundidade
│   ├── 05-animations/            # Movimentos, sequências e transições
│   ├── 06-typography/            # Fontes e textos animados
│   ├── 07-complete-scenes/       # Cenas completas de referência e fichas REF
│   └── moodboards/               # Painéis visuais (Style, Character e Motion Board)
├── assets/                       # Assets originais ou licenciados (compatível com public/ do Remotion)
├── components/                   # Tokens TypeScript, tipos e futuros componentes React/SVG
└── examples/                     # Cenas e composições de demonstração (16:9 e 9:16)
```

## Fluxo de Trabalho Contínuo

1. **Você seleciona referências:** adiciona imagens, vídeos curtos, GIFs, capturas de cenas e exemplos de animação nas subpastas de `references/`.
2. **Antigravity analisa:** identifica características recorrentes, cria fichas de referência (`REF-XXX`) e atualiza `REFERENCE_INDEX.md`.
3. **Antigravity desenvolve:** constrói os componentes SVG e React necessários para reproduzir a linguagem visual.
4. **Gera uma demonstração:** cria uma sequência de 10 a 15 segundos com personagens, objetos, transições e textos.
5. **Você aprova o padrão:** ajusta proporções, cores, sombras e movimentos antes de liberar a biblioteca para novos vídeos.

> **Dica para referências de movimento:** prefira vídeos curtos ou GIFs acompanhados de uma descrição dos frames. Uma imagem estática mostra a aparência; uma sequência mostra o comportamento.

## Onde Pesquisar Referências

- **Behance** — Modern Explainer
- **Dribbble** — Flat Illustration
- **Pinterest** — Motion Design
- **Documentação oficial do Remotion**

> Use imagens externas apenas como referência de direção artística. Para os assets finais dos vídeos, utilize ilustrações originais ou recursos com licença adequada.
