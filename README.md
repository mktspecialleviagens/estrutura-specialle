# Specialle Viagens — estrutura de captação

Clone da matriz Scandia Travel para a Specialle Viagens (Fortaleza, desde 1997): página de captação, CRM, dashboard, loja de guias, blog, propostas e APIs Cloudflare Pages + D1. A identidade da landing page já é a da Specialle; o que falta para publicar está em [BRANDING.md](BRANDING.md).

| Caminho | Conteúdo |
|---|---|
| `src/`, `index.html` | Página de captação React (Specialle) |
| `public/brand/` | Logos, configuração pública e tracking |
| `public/crm/` | CRM e pipeline (Specialle) |
| `public/dash/` | Dashboard (ainda com identidade Scandia) |
| `public/loja/` | Loja estática de guias e blog (ainda com identidade Scandia) |
| `functions/` | APIs, artigos e propostas públicas |
| `migrations/` | Esquema D1, aplicado explicitamente |
| `dist/` | Saída do build, ignorada pelo Git |

A loja de guias foi recebida como distribuição compilada; mudanças profundas nela exigem recuperar o projeto fonte.

Use Node 22 e npm: `npm ci`, `npm test`, `npm run build`, `npm run check:build`. O Vite serve a interface em `http://localhost:8080`; as Functions exigem Pages/Workers. Veja [DEPLOY.md](DEPLOY.md) para criar o projeto no Cloudflare.

## Blocos da landing page

1. `HeroSection` — promessa e CTA
2. `DestinationsStrip` — faixa de destinos
3. `ProblemSection` — o problema
4. `SolutionSection` — os quatro diferenciais
5. `HowItWorksSection` — as quatro etapas do atendimento
6. `DestinationsGrid` — Europa, Estados Unidos e cruzeiros
7. `ForWhoSection` — para quem é e para quem não é
8. `AboutSection` — 29 anos, escritório em Fortaleza
9. `TestimonialsSection` — depoimentos (placeholder)
10. `StepForm` — formulário em cinco etapas + contato
11. `FAQSection` — dúvidas frequentes
12. `FinalCTA` + `FooterCTA` — fechamento

O bloco de faixa de investimento previsto na copy original foi descartado nesta versão.
