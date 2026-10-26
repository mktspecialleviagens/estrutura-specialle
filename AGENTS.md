# Specialle Viagens — clone da matriz

- Clone da matriz Scandia Travel personalizado para a Specialle Viagens. Leia `README.md`, `BRANDING.md` e `DEPLOY.md`.
- Captação em `src/`; CRM, dashboard, loja e blog estático em `public/`; APIs em `functions/`.
- Toda a identidade visual já é Specialle: landing page, CRM, dashboard, loja e blog. O conteúdo dos artigos em `content/editorial-articles.js` ainda é o da matriz.
- O bundle compilado da loja recebeu troca pontual de literais de cor, nome e caminho de logo. Não fazer edições estruturais nele sem o projeto fonte.
- `public/lp/` não faz parte desta base.
- Não copie fotos, vídeos, telefone, IDs de pixels, GA4, domínios ou credenciais de outro cliente.
- As fotos em `src/assets/` são de banco de imagens e provisórias; veja `PHOTO_CREDITS.md`.
- Build em `dist/`. Nunca versionar `dist/`, `node_modules/`, `.dev.vars`, `.env*` ou `wrangler.toml` local.
- D1 remoto tem binding `DB`. Não executar migrations nem gravar em banco para testar aparência.
- Antes do push: `npm test`, `npm run build`, `npm run check:build` e revisão de referências de cliente.
- O `origin` é o repositório da Specialle. Push em `main` publica no Pages na hora.
- Após deploy: confirmar status do Pages e rotas públicas.
- A loja de guias é bundle estático recebido da origem; evitar edições amplas no arquivo minificado sem sua fonte.
