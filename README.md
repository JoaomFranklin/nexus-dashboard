# ⚡ Nexus Dashboard

Dashboard pessoal moderno com autenticação por Magic Link, dados em tempo real e interface dark glass.

## Stack

- **Frontend/Backend**: Next.js 16 (App Router) + TypeScript
- **Auth + DB**: Supabase (Magic Link / JWT)
- **Estilização**: Tailwind CSS v4
- **APIs externas**:
  - Clima: [OpenWeatherMap](https://openweathermap.org/api)
  - Preços: [CoinGecko](https://coingecko.com) (BTC) + [Finnhub](https://finnhub.io) (ações)

## Features

| Feature | Descrição |
|---|---|
| 🔐 Magic Link | Login sem senha via email |
| 🌦️ Clima | Temperatura e condições em Foz do Iguaçu |
| ☀️/🌙 Dia/Noite | Indicador baseado no horário local |
| 💰 Mercado | BTC, Goldman Sachs (GS), Lockheed Martin (LMT) |
| 🕵️ Status Mossad | **FICTÍCIO** — simulação para entretenimento |
| 🏛️ Status Governo | **FICTÍCIO** — simulação para entretenimento |
| 🔍 Busca | Campo estilo Google, abre resultados em nova aba |

## Setup

### 1. Clone e instale

```bash
git clone https://github.com/JoaomFranklin/nexus-dashboard.git
cd nexus-dashboard
npm install
```

### 2. Configure variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite `.env.local` com suas chaves:

| Variável | Onde obter |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | [supabase.com](https://supabase.com) → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Mesmo lugar acima |
| `OPENWEATHER_API_KEY` | [openweathermap.org/api](https://openweathermap.org/api) — Free tier |
| `FINNHUB_API_KEY` | [finnhub.io](https://finnhub.io) — Free tier |

### 3. Configure o Supabase

No painel do Supabase:
1. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`
2. **Authentication → Email**: habilite "Enable Email Confirmations" e "Magic Link"

### 4. Rode localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## Estrutura do projeto

```
nexus-dashboard/
├── app/
│   ├── api/
│   │   ├── financial/route.ts   # BTC + GS + LMT
│   │   ├── status/route.ts      # Status fictícios
│   │   └── weather/route.ts     # Clima em Foz do Iguaçu
│   ├── auth/callback/route.ts   # Callback do Magic Link
│   ├── dashboard/page.tsx       # Página protegida
│   ├── login/page.tsx           # Formulário de Magic Link
│   └── page.tsx                 # Redirect inteligente
├── components/
│   ├── cards/
│   │   ├── DayNightCard.tsx
│   │   ├── FinancialCard.tsx
│   │   ├── GovernmentCard.tsx
│   │   ├── StatusCard.tsx
│   │   └── WeatherCard.tsx
│   ├── Dashboard.tsx            # Orquestra cards + polling
│   └── SearchBar.tsx
├── lib/
│   ├── supabase-client.ts       # Client-side Supabase
│   └── supabase-server.ts       # Server-side Supabase
└── middleware.ts                # Proteção de rotas
```

## Deploy (Vercel)

```bash
vercel --prod
```

Adicione as mesmas variáveis de ambiente no painel da Vercel. Atualize as URLs do Supabase para o domínio de produção.

---

> ⚠️ **Aviso**: Os cards "Status Mossad" e "Status Governo" são **100% fictícios**, gerados aleatoriamente para fins de entretenimento. Não representam dados reais de nenhuma organização ou governo.
