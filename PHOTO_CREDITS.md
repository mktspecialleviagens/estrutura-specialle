# Fotos da página de captação

Todas as imagens abaixo são **provisórias**: foram selecionadas no Unsplash para destravar o
layout enquanto a Specialle não envia o material próprio. A Licença Unsplash permite uso
comercial sem atribuição obrigatória, mas a recomendação é trocar por fotos reais da agência
e dos clientes assim que possível.

| Uso | Arquivo | Conteúdo | Fonte |
| --- | --- | --- | --- |
| Hero, cena 1 | `src/assets/hero-europa-paris.jpg` | Torre Eiffel, Paris | https://images.unsplash.com/photo-1502602898657-3e91760cbb34 |
| Hero, cena 2 | `src/assets/hero-eua-miami.jpg` | Costa e prédios de Miami Beach | https://images.unsplash.com/photo-1589083130544-0d6a2926e519 |
| Hero, cena 3 | `src/assets/hero-cruzeiro.jpg` | Navio de cruzeiro ao pôr do sol | https://images.unsplash.com/photo-1554254648-2d58a1bc3fd5 |
| Destino Europa | `src/assets/destino-europa.jpg` | Coliseu, Roma | https://images.unsplash.com/photo-1552832230-c0197dd311b5 |
| Destino Estados Unidos | `src/assets/destino-eua.jpg` | Rua art déco em Miami Beach | https://images.unsplash.com/photo-1784253622017-dfa7b8857eac |
| Destino Cruzeiros | `src/assets/destino-cruzeiros.jpg` | Navio de cruzeiro | https://images.unsplash.com/photo-1511316695145-4992006ffddb |
| Sobre | `src/assets/sobre-specialle.jpg` | Mapa, passaporte e câmera | https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9 |
| Chamada final | `src/assets/cta-lisboa.jpg` | Bonde amarelo em Lisboa | https://images.unsplash.com/photo-1585208798174-6cedd86e019a |

## Loja, blog e artigos

Mesma origem e mesma condição de provisoriedade.

| Uso | Arquivo | Conteúdo | Fonte |
| --- | --- | --- | --- |
| Hero do blog | `public/loja/blog/images/europa-hero.jpg` | Torre Eiffel, Paris | https://images.unsplash.com/photo-1502602898657-3e91760cbb34 |
| Artigo Europa, capa | `public/loja/blog/images/europa-lisboa.jpg` | Bonde amarelo em Lisboa | https://images.unsplash.com/photo-1585208798174-6cedd86e019a |
| Artigo Europa, interna | `public/loja/blog/images/europa-estacao.jpg` | Estação de trem europeia | https://images.unsplash.com/photo-1744659959812-3197b751f71d |
| Artigo Flórida, capa | `public/loja/blog/images/eua-orlando.jpg` | Montanha-russa em Orlando | https://images.unsplash.com/photo-1621473909625-6a62ef5bedf7 |
| Artigo Flórida, interna | `public/loja/blog/images/eua-miami.jpg` | Orla de Miami Beach | https://images.unsplash.com/photo-1589083130544-0d6a2926e519 |
| Artigo Cruzeiros, capa | `public/loja/blog/images/cruzeiro-navio.jpg` | Navio em mar aberto | https://images.unsplash.com/photo-1613483381938-dedf64f2adbb |
| Artigo Cruzeiros, interna | `public/loja/blog/images/cruzeiro-varandas.jpg` | Fileiras de varandas | https://images.unsplash.com/photo-1772292192270-862979c924c8 |
| Seção "Equipe" da loja | hotlink no bundle | Coliseu, Roma | https://images.unsplash.com/photo-1552832230-c0197dd311b5 |
| Login do CRM | hotlink, 6 fotos | Destinos que a agência opera | ver `public/crm/index.html` |

As seis fotos nórdicas herdadas da matriz foram removidas junto com os artigos antigos.

## Substituições pendentes

- **Bloco Sobre** — trocar `sobre-specialle.jpg` pelas fotos do escritório na Washington Soares
  (varanda e mapa de acrílico). O componente `AboutSection.tsx` exibe um selo "Foto provisória"
  que deve ser removido junto com a troca.
- **Bloco Depoimentos** — `TestimonialsSection.tsx` está com três cartões vazios e a flag
  `pending = true`. Preencher com três mensagens reais de clientes (nome, destino, ano e
  autorização para publicar) e mudar a flag para `false`. Fotos dos clientes no destino são opcionais.
- **Destinos e hero** — se a Specialle tiver fotos próprias de clientes nos destinos que opera,
  elas valem mais que banco de imagens.
