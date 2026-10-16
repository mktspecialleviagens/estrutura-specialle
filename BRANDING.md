# Identidade — Specialle Viagens

Clone da matriz Scandia Travel personalizado para a Specialle Viagens (Fortaleza, desde 1997).

## Paleta

Extraída do logo oficial (`Versões RGB do Logo.pdf` e `Adesivo.pdf` entregues pela cliente).

| Token | Hex | Uso |
| --- | --- | --- |
| `--specialle-purple` | `#430A62` | Cor principal: títulos, botões, faixa de destinos |
| `--specialle-purple-dark` | `#2C0640` | Fundos escuros: hero, header, formulário, rodapé |
| `--specialle-violet` | `#6E3B96` | Tom médio: hovers, ícones, destaques de texto |
| `--specialle-lilac` | `#C9A6E0` | Acento sobre fundo escuro: eyebrows, CTA do hero |
| `--secondary` | `#F4F0F7` | Creme lilás para fundos de seção |
| `--foreground` | `#231F20` | Texto corrido |

Definidos em `src/index.css` e expostos no Tailwind em `tailwind.config.ts`.

## Tipografia

- **Montserrat** em tudo (títulos e corpo), carregada do Google Fonts. A cliente já usa a fonte
  no material impresso (`Montserrat-Regular.ttf` na pasta do projeto).
- **Corinthia** apenas na assinatura manuscrita "Specialle" do logo, via classe `.script`.

## Logo

`public/brand/logo-roxo.svg` (fundo claro) e `public/brand/logo-branco.svg` (fundo escuro) são
wordmarks montados em SVG a partir da paleta e das fontes da marca. **Pendente:** exportar o logo
vetorial real dos PDFs da cliente e substituir os dois arquivos. Os PNGs da Scandia foram removidos.

## O que ainda falta para publicar

1. **WhatsApp** — `public/brand/config.js` está com `5585999625722`, assumido a partir de
   "+55 85 9962-5722". Confirmar o número antes de subir; sem WhatsApp válido o formulário não envia lead.
2. **Logo real** — substituir os dois SVGs pelo arquivo oficial.
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
   horários da Brightline mudam. A assinatura do autor ainda não aparece nos artigos; definir se
   os textos saem em nome da agência ou de alguém da equipe.
8. **Remoto do Git** — o `origin` ainda aponta para o repositório da matriz. Trocar pelo
   repositório próprio da Specialle antes de qualquer push.
