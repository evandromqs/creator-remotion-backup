# Índice de Referências Visuais (Reference Pack)

## Protocolo de Inteligência de Referências (para o Antigravity)

Antes de iniciar qualquer implementação:
1. Leia todos os arquivos dentro de `references/`.
2. Analise cada imagem ou sequência de referência disponível.
3. Identifique características visuais recorrentes.
4. Extraia regras concretas de cor, forma, composição, personagem e sombra.
5. Consulte este arquivo (`REFERENCE_INDEX.md`).
6. Utilize as referências como orientação de direção artística — **nunca** como assets para reprodução idêntica.
7. Se faltarem referências essenciais em alguma pasta, reporte o que está faltando em vez de inventar uma direção visual arbitrária.

---

## Meta Inicial da Biblioteca (20 a 30 referências organizadas por função)

| Pasta | Função | Conteúdo Recomendado | Status |
| :--- | :--- | :--- | :--- |
| `references/01-illustrations/` | Personagens e objetos | Personagens (frente, perfil, sentado, andando, apontando, segurando objetos) e objetos cotidianos (computadores, celulares, casas, veículos, livros, ferramentas) | A preencher |
| `references/02-color-palettes/` | Cores e combinações | Paleta Modern Explainer (`palette-modern-explainer.svg`) + combinações extras por projeto | 1 swatch base incluído |
| `references/03-composition/` | Enquadramento e organização | Distribuição de planos, equilíbrio visual e espaço negativo para texto | A preencher |
| `references/04-shadows-depth/` | Sombras e profundidade | Sombras suaves, difusas e sobreposição de camadas | A preencher |
| `references/05-animations/` | Movimentos e transições | Sequências quadro a quadro, GIFs ou vídeos curtos mostrando entrada, movimento, transformação e saída | A preencher |
| `references/06-typography/` | Tipografia animada | Hierarquia de títulos, legendas e textos em movimento | A preencher |
| `references/07-complete-scenes/` | Cenas completas | Combinação de personagens, objetos, fundo e elementos de apoio | Modelo `REF-001.md` incluído |
| `references/moodboards/` | Painéis consolidados | 3 pranchas permanentes com 6 a 9 imagens cada: **Style Board**, **Character Board** e **Motion Board** | A preencher |

---

## Painéis de Referência Permanentes (Moodboards)

Reúna de **6 a 9 imagens** em cada prancha visual dentro de `references/moodboards/`:
- **Style Board:** define a aparência geral.
- **Character Board:** define personagens e proporções.
- **Motion Board:** define como os elementos se movimentam.

---

## Modelo de Ficha de Referência (`REF-XXX`)

Crie uma ficha para cada referência adicionada (veja o exemplo completo em `references/07-complete-scenes/REF-001.md`):

```markdown
# REF-XXX — [Título curto da cena ou elemento]

- **Pasta:** `references/...`
- **Arquivo:** `nome-do-arquivo.png` (ou `.gif` / `.mp4`)

## O que aproveitar
- [Característica visual 1]
- [Característica visual 2]

## O que não copiar
- Não reproduzir exatamente o personagem.
- Não copiar logotipos ou elementos de marca.
- Não reproduzir a composição inteira de maneira idêntica.

## Aplicação
[Descrever como o agente deve aplicar essa referência ao criar elementos originais.]
```
