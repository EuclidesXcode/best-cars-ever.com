# Best Cars Ever 🏎️

Timeline interativa dos melhores superesportivos dos anos 70 até hoje, com sistema de
votação (1 avaliação por usuário por carro) que define o ranking de cada década.
Construído com **Next.js 14 (App Router)**, **Supabase** (auth + dados) e **Tailwind**,
com **parallax** (framer-motion) e suporte a **pt / en / es**.

## Como funciona a votação

- Qualquer pessoa navega livremente.
- Logado, o usuário dá **1–5 estrelas + comentário opcional** em cada carro — **uma única vez**.
- Pode **editar ou apagar a própria avaliação apenas uma vez** (garantido por trigger no banco).
- A **média das notas** define o **ranking por década** (view `car_rankings`).

## Setup

### 1. Variáveis de ambiente
`.env.local` já está preenchido com o projeto Supabase. A `SUPABASE_SERVICE_ROLE`
**não** usa o prefixo `NEXT_PUBLIC_` de propósito (é uma chave de admin).

### 2. Banco de dados (passo manual — ~1 min)
No painel do Supabase → **SQL Editor**, rode na ordem:

1. `supabase/schema.sql`  — cria tabelas `cars` e `reviews`, a view de ranking, o trigger
   da "edição única" e as políticas de RLS.
2. `supabase/seed.sql`    — popula os carros icônicos (3 por década, 70s → 20s).

### 3. Auth
Em **Authentication → Providers → Email**, para testar rápido você pode
**desativar "Confirm email"** (assim o cadastro já loga). Em produção, deixe ligado.

### 4. Rodar
```bash
npm install
npm run dev      # http://localhost:3000
```

## Estrutura

```
src/
  app/            layout (providers + sessão), page (busca dados), globals.css
  components/     Hero, DecadeSection, CarCard (parallax), ReviewForm (votação),
                  RankingSection, TopBar, BottomNav (mobile app), AuthModal,
                  LanguageSwitcher, StarRating, providers (i18n/auth)
  lib/
    supabase/     client (browser), server, middleware (refresh de sessão)
    queries.ts    leitura: carros + ranking + review do usuário
    actions.ts    server actions: criar/editar/apagar review, signOut
    dictionaries.ts  traduções pt/en/es
    types.ts
supabase/         schema.sql, seed.sql
```

## Mobile
Pensado como app: barra inferior fixa com seção ativa (IntersectionObserver),
modais em bottom-sheet, `safe-area-inset`, alvos de toque generosos e timeline
que adapta o layout — não apenas encolhe o desktop.
