# Orient Lara — Landing Page

Landing page institucional da **Orient Lara — Reforma e Construção Civil**.

Site estático em **HTML + CSS + JavaScript puro** (sem build, sem dependências).
Foi a escolha mais adequada: carrega rápido, é fácil de manter e publica em qualquer
hospedagem estática.

## Estrutura

```
orient-lara/
├── index.html              # página única (todas as seções)
├── assets/
│   ├── css/styles.css      # estilos + responsividade
│   ├── js/main.js          # menu, animações, formulário -> WhatsApp
│   └── img/                # logos (SVG/PNG) e imagens
│       └── obras/          # (opcional) fotos das obras executadas
├── .github/workflows/
│   └── deploy.yml          # CI: deploy automático na Vercel
├── vercel.json             # config da hospedagem (Vercel)
├── Logo Orient Lara/       # material de marca original (não usado em produção)
└── README.md
```

## Como rodar localmente

Basta abrir o `index.html` no navegador.
Para servir com um servidor local (recomendado, evita bloqueios de `file://`):

```bash
# Python 3
python -m http.server 8080
# depois acesse http://localhost:8080
```

## Publicar (Vercel + GitHub Actions)

O deploy é automático pelo workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):

- **push na `main`** → deploy de produção
- **pull request** → deploy de preview (URL de teste comentada no PR)

### Configuração inicial (uma vez só)

1. Instale a CLI e faça login:
   ```bash
   npm i -g vercel
   vercel login
   ```
2. Na raiz do projeto, crie/linke o projeto na Vercel:
   ```bash
   vercel link
   ```
   Isso gera `.vercel/project.json` (ignorado pelo git) com o `orgId` e o `projectId`.
3. Gere um token em **vercel.com → Account Settings → Tokens**.
4. No GitHub, em **Settings → Secrets and variables → Actions**, crie 3 secrets:
   | Secret | Onde encontrar |
   |---|---|
   | `VERCEL_TOKEN` | o token do passo 3 |
   | `VERCEL_ORG_ID` | campo `orgId` de `.vercel/project.json` |
   | `VERCEL_PROJECT_ID` | campo `projectId` de `.vercel/project.json` |
5. Faça commit e `git push`. O workflow roda sozinho na aba **Actions**.

> Não importe o repositório pela integração Git da Vercel — o deploy é feito só
> pelo Actions, para não duplicar publicações.

## Fotos das obras

As fotos aparecem **somente na seção "Obras executadas"** — as demais seções
(topo, Sobre etc.) usam apenas a identidade visual da marca.

A galeria usa as imagens em `assets/img/obras/` (`obra-1.jpg` … `obra-9.jpg`),
abertas em um lightbox ao clicar. As fotos originais enviadas ficam em
`assets/img/` (`img*.jpeg`) e foram recortadas/otimizadas para 1200×900 (4:3).

Para **trocar** uma foto, substitua o arquivo `assets/img/obras/obra-N.jpg`
(mesmo nome) e ajuste o texto/`alt` correspondente no `index.html`.
Para **adicionar** mais uma, copie um bloco `.gallery-item` no `index.html`
apontando para o novo arquivo.

## Identidade visual

| Cor            | HEX       | Uso                     |
|----------------|-----------|-------------------------|
| Vermelho       | `#cc3333` | primária / destaques    |
| Vermelho escuro| `#9b2727` | hover / gradientes      |
| Preto          | `#000000` | textos / fundos escuros |

Tipografia: **Jost** (títulos — sans geométrica que acompanha o traço do
logotipo "ORIENT LARA") e **DM Sans** (texto), via Google Fonts.

## Contato configurado

- E-mail: `orient.lara@outlook.com`
- Telefone/WhatsApp: `(11) 98742-7994` → `https://wa.me/5511987427994`
- Instagram: `@orient.lara`

Para alterar, procure por esses valores em `index.html` e `assets/js/main.js`.
