# Depoimentos em vídeo

Coloque aqui os vídeos verticais dos clientes. A seção que os exibe é
`src/components/TestimonialsSection.tsx`.

## Nomes dos arquivos

| Arquivo | Obrigatório | O que é |
|---|---|---|
| `depoimento-1.mp4` a `depoimento-4.mp4` | sim | O vídeo. Sem ele o card não aparece. |
| `depoimento-1.jpg` a `depoimento-4.jpg` | não | A capa mostrada antes do play. Também aceita `.jpeg`, `.png` e `.webp`. |

O número do vídeo e o da capa precisam bater. Sem capa, o card mostra um fundo
roxo da paleta com o botão de play, nunca um retângulo preto.

## Formato

- Proporção 9:16 (vertical). O card recorta para 9:16, então um vídeo em outra
  proporção perde as bordas.
- MP4 com codec H.264 e áudio AAC, que é o que todo navegador de celular toca.
- Comprima antes de subir. Cada vídeo entra no build e vira cache do Cloudflare,
  mas arquivo de 100 MB é download de 100 MB para quem clicar no play.

## Como funciona na página

- Nenhum vídeo começa sozinho e nada é baixado antes do clique. O `src` só entra
  no elemento quando a pessoa aperta o play, então os arquivos não pesam no
  carregamento da página.
- Arquivo que não existe não vira card e não deixa buraco no grid. Com zero
  vídeos, a seção mostra o aviso de bloco pendente.
- Dois cards por linha no celular, quatro a partir do desktop.

## Legenda

A legenda com nome e destino é opcional e fica no array `legendas` de
`TestimonialsSection.tsx`, na posição correspondente ao número do arquivo.
Campo vazio significa card sem legenda.

## Antes de publicar

Só suba vídeo com autorização do cliente para publicar.
