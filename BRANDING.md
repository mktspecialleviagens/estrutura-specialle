# Identidade — Specialle Viagens

Clone da matriz Scandia Travel personalizado para a Specialle Viagens (Fortaleza, desde 1997).

## Paleta

Extraída do logo oficial (`Versões RGB do Logo.pdf` e `Adesivo.pdf` entregues pela cliente).

| Token | Hex | Uso |
| --- | --- | --- |
| `--specialle-purple` | `#280046` | Cor principal: títulos, botões, faixa de destinos |
| `--specialle-purple-dark` | `#1A002E` | Fundos escuros: hero, header, formulário, rodapé |
| `--specialle-violet` | `#6E3B96` | Tom médio: hovers, ícones, destaques de texto |
| `--specialle-lilac` | `#C9A6E0` | Acento sobre fundo escuro: eyebrows, CTA do hero |
| `--secondary` | `#F4F0F7` | Creme lilás para fundos de seção |
| `--foreground` | `#231F20` | Texto corrido |

Definidos em `src/index.css` e expostos no Tailwind em `tailwind.config.ts`.

## Tipografia

- **Montserrat** em tudo (títulos e corpo), carregada do Google Fonts. A cliente já usa a fonte
  no material impresso (`Montserrat-Regular.ttf` na pasta do projeto).

## Logo

`public/brand/logo.webp` é o logo oficial entregue pela cliente: 2000x667, com canal alpha e
fundo transparente. É o único arquivo de logo do projeto.

Nos fundos escuros o logo é invertido para branco por CSS, com
`style="filter:brightness(0) invert(1)"` na própria tag `<img>`. Isso evita manter um segundo
arquivo e garante que uma troca futura do logo valha para todas as áreas de uma vez. Os pontos
que usam o filtro são o topo e o rodapé da landing, a barra lateral do CRM, a tela de acesso do
dashboard, o topo e o rodapé da loja e do blog, e a página pública de proposta. O único ponto
sem filtro é a barra superior do dashboard, que tem fundo claro.

A paleta é ancorada na tinta do próprio logo, `#280046`, medida no arquivo entregue pela cliente.
Os PDFs vetoriais traziam `#430A62`, um roxo mais claro, que foi descartado em favor do arquivo
final. A rampa escura desce a partir do logo: `#280046` para a cor principal, `#1A002E` para os
fundos escuros e `#120020` para os overlays mais profundos.

## O que ainda falta para publicar

1. **WhatsApp** — `public/brand/config.js` está com `5585999625722`, assumido a partir de
   "+55 85 9962-5722". Confirmar o número antes de subir; sem WhatsApp válido o formulário não envia lead.
2. **Favicon** — hoje aponta para `logo.webp`. Um favicon dedicado, quadrado e em `.png` ou
   `.ico`, renderiza melhor na aba e em atalhos de celular.
3. **Fotos** — ver `PHOTO_CREDITS.md`. Escritório e depoimentos estão com placeholder marcado.
4. **Faixas de investimento** — as opções da etapa 5 do formulário (`src/components/StepForm.tsx`)
   são provisórias. Confirmar com a Anastacia.
5. **Domínio e tracking** — definir `og:url` em `index.html` e preencher `metaPixelId` /
   `ga4MeasurementId` em `config.js`, só então ligar `trackingEnabled`. Segredos nunca nesse arquivo.
6. **Cloudflare Pages + D1** — criar o projeto na conta da cliente, aplicar as migrations de
   `migrations/` e configurar `DB`, `DASH_KEY` e demais secrets. Ver `DEPLOY.md`.
7. **Artigos do blog** — os três artigos em `content/editorial-articles.js` foram reescritos para
   Europa, Flórida e cruzeiros, com fatos conferidos em fontes oficiais citadas no rodapé de cada
   texto. Revalidar as fontes antes de alterar qualquer dado: as regras de entrada na Europa e os
   horários da Brightline mudam. Os artigos saem assinados como "Por equipe Specialle Viagens",
   assinatura que vem do template em `functions/loja/blog/[slug].js`.
8. **Remoto do Git** — o `origin` ainda aponta para o repositório da matriz. Trocar pelo
   repositório próprio da Specialle antes de qualquer push.
