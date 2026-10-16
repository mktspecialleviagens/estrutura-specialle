import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, join, relative } from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { editorialArticles } from '../content/editorial-articles.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = resolve(root, 'dist');
for (const file of ['index.html', 'crm/index.html', 'dash/index.html', 'dash/design.css', 'dash/design.js', 'loja/index.html', 'loja/blog/index.html', 'loja/assets/blog-editorial.css', 'loja/assets/article-editorial.css']) {
  assert(existsSync(join(dist, file)), `Arquivo ausente no build: ${file}`);
}
// As imagens dos artigos saem do próprio conteúdo editorial, para o check acompanhar
// qualquer troca de pauta sem depender de uma lista escrita à mão.
const imagensDeArtigos = new Set();
for (const article of editorialArticles) {
  if (article.cover_image?.startsWith('/')) imagensDeArtigos.add(article.cover_image.slice(1));
  for (const [, src] of (article.content ?? '').matchAll(/<img[^>]+src="\/([^"?#]+)"/g)) imagensDeArtigos.add(src);
}
for (const imagem of imagensDeArtigos) {
  assert(existsSync(join(dist, imagem)), `Imagem de artigo ausente no build: ${imagem}`);
}
for (const [, src] of readFileSync(join(root, 'public/loja/assets/blog-editorial.css'), 'utf8').matchAll(/url\('\/([^']+)'\)/g)) {
  assert(existsSync(join(dist, src)), `Imagem do blog ausente no build: ${src}`);
}
function inspect(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    assert(!/^(?:\.env(?:\..*)?|\.dev\.vars(?:\..*)?|\.git|node_modules|functions|migrations|config|wrangler\..*)$/.test(entry.name), `Arquivo privado no build: ${relative(dist, file)}`);
    if (entry.isDirectory()) inspect(file);
  }
}
inspect(dist);
const html = readFileSync(join(dist, 'index.html'), 'utf8');
assert(!html.includes('/src/main.tsx'), 'A landing não foi compilada.');
for (const [, asset] of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) {
  assert(existsSync(join(dist, asset.slice(1))), `Asset ausente: ${asset}`);
}
for (const file of ['crm/index.html', 'dash/index.html', 'dash/design.css', 'dash/design.js']) {
  assert(readFileSync(join(dist, file)).equals(readFileSync(join(root, 'public', file))), `Cópia divergente: ${file}`);
}
console.log('Build validado: landing, CRM, dashboard, loja e blog; sem arquivos privados.');

assert(!existsSync(join(dist, "lp")), "public/lp não faz parte desta Matrix.");
