# Guia de Deploy - Ogum Tech

Este guia descreve o processo completo de deploy do Ogum Tech usando **Vercel** (frontend/backend) e **Supabase** (PostgreSQL).

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com) (tier gratuito disponível)
- Conta no [Vercel](https://vercel.com) (tier gratuito disponível)
- Repositório Git (GitHub, GitLab ou Bitbucket)
- Node.js 18+ instalado localmente (para testes)

## 🗄️ Passo 1: Configurar Banco de Dados no Supabase

### 1.1 Criar Projeto

1. Acesse https://supabase.com/dashboard
2. Clique em **"New Project"**
3. Preencha os dados:
   - **Name**: `ogum-tech-production` (ou nome de sua preferência)
   - **Database Password**: Crie uma senha forte (anote em local seguro!)
   - **Region**: Escolha a região mais próxima dos usuários finais
     - Brasil: `South America (São Paulo)`
     - Outros: `US East`, `Europe`, etc.
   - **Pricing Plan**: Free (500MB, até 2 projetos)

4. Clique em **"Create new project"**
5. Aguarde ~2 minutos enquanto o Supabase provisiona o banco

### 1.2 Obter Strings de Conexão

1. No dashboard do projeto, navegue para **Settings** → **Database**

2. Role até **Connection String** e copie as duas URLs:

   **a) Connection Pooling (para `DATABASE_URL`):**
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```
   
   **b) Direct Connection (para `DIRECT_URL`):**
   ```
   postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
   ```

3. **Importante:** Substitua `[YOUR-PASSWORD]` pela senha que você criou

4. **Se a senha contém caracteres especiais**, codifique-a em URL:
   - `@` → `%40`
   - `&` → `%26`
   - `#` → `%23`
   - Exemplo: `WA@zPs&Yec7` → `WA%40zPs%26Yec7`

### 1.3 Executar Migrações (Via Vercel)

⚠️ **Nota:** Não é necessário criar tabelas manualmente. O Vercel executará as migrações automaticamente durante o deploy via `prisma generate`.

Se preferir criar as tabelas antes do deploy:

1. Configure o `.env` localmente com as strings de conexão
2. Execute:
   ```bash
   npx prisma migrate deploy
   ```

3. (Opcional) Popule com dados iniciais:
   ```bash
   npx prisma db seed
   ```

## 🚀 Passo 2: Deploy no Vercel

### 2.1 Preparar Repositório Git

1. Certifique-se de que todo o código está commitado:
   ```bash
   git add .
   git commit -m "feat: preparação para deploy em produção"
   ```

2. Faça push para o repositório remoto:
   ```bash
   git push origin main
   ```

### 2.2 Importar Projeto no Vercel

1. Acesse https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Selecione seu repositório `ogum-tech`
4. Vercel detectará automaticamente que é um projeto Next.js

### 2.3 Configurar Variáveis de Ambiente

⚠️ **CRÍTICO:** Configure todas as variáveis **ANTES** de fazer o primeiro deploy.

Na seção **Environment Variables**, adicione:

| Nome da Variável | Valor | Descrição |
|------------------|-------|-----------|
| `DATABASE_URL` | `postgresql://postgres.xxxxx:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres` | Connection pooling (porta 6543) |
| `DIRECT_URL` | `postgresql://postgres.xxxxx:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres` | Conexão direta (porta 5432) |
| `NEXTAUTH_SECRET` | (gere uma chave forte - veja abaixo) | Secret para assinar JWTs |

**Para gerar `NEXTAUTH_SECRET`:**

```bash
# Windows (PowerShell)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Linux/Mac
openssl rand -base64 32
```

### 2.4 Build Settings (Automático)

Vercel detecta Next.js automaticamente. Confirme que está configurado:

- **Framework Preset:** Next.js
- **Build Command:** `npm run build` (já inclui `prisma generate`)
- **Output Directory:** `.next`
- **Install Command:** `npm install` (já executa `postinstall: prisma generate`)

### 2.5 Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos enquanto Vercel:
   - Instala dependências (`npm install`)
   - Executa `postinstall` (gera Prisma Client)
   - Faz build (`npm run build`)
   - Deploy para CDN global

3. Ao finalizar, você receberá uma URL:
   ```
   https://ogum-tech.vercel.app
   ```

## ✅ Passo 3: Validar Deploy

### 3.1 Verificar Logs de Build

1. No dashboard do Vercel, clique no deploy
2. Vá em **"Logs"**
3. Verifique que não há erros, especialmente:
   - ✅ `prisma generate` executado com sucesso
   - ✅ Build Next.js concluído
   - ✅ Sem erros de conexão com banco

### 3.2 Testar Aplicação

1. Acesse a URL do deploy
2. Você deve ser redirecionado para `/login`
3. Entre com as credenciais padrão:
   - **Email:** `admin@ogum.local`
   - **Senha:** `Admin@123`

4. Teste as funcionalidades principais:
   - ✅ Login funcional
   - ✅ Dashboard carrega
   - ✅ Admin pode criar funções/tipos de gira
   - ✅ Admin pode abrir giras
   - ✅ Fila de atendimento funciona

### 3.3 Verificar Banco de Dados

1. No Supabase, vá em **Table Editor**
2. Verifique que as tabelas foram criadas:
   - `Function`
   - `User`
   - `GiraType`
   - `Gira`
   - `GiraMedium`
   - `QueueEntry`
   - `_prisma_migrations`

## 🔧 Passo 4: Executar Seed em Produção (Opcional)

Se você não executou o seed localmente antes:

### Opção 1: Via Vercel CLI

1. Instale Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Faça login:
   ```bash
   vercel login
   ```

3. Execute seed em produção:
   ```bash
   vercel env pull .env.production
   npx prisma db seed
   ```

### Opção 2: Manualmente via Supabase SQL Editor

1. No Supabase, vá em **SQL Editor**
2. Execute o SQL de seed (adapte conforme necessário):

```sql
-- Funções
INSERT INTO "Function" (name) VALUES
  ('Médium'),
  ('Cambone'),
  ('Ogã')
ON CONFLICT (name) DO NOTHING;

-- Tipos de Gira
INSERT INTO "GiraType" (name) VALUES
  ('Preto-Velho'),
  ('Caboclo'),
  ('Exu'),
  ('Pomba-Gira')
ON CONFLICT (name) DO NOTHING;

-- Admin (senha: Admin@123)
INSERT INTO "User" (name, email, password_hash, role, function_id, active)
VALUES (
  'Administrador',
  'admin@ogum.local',
  '$2a$10$YourBcryptHashHere',
  'admin',
  1,
  true
)
ON CONFLICT (email) DO NOTHING;
```

> **Nota:** Gere o hash bcrypt correto usando:
> ```bash
> node -e "console.log(require('bcryptjs').hashSync('Admin@123', 10))"
> ```

## 🔄 Passo 5: Deploy Contínuo (CI/CD)

Vercel configura CI/CD automaticamente:

- **Push para `main`** → Deploy de Produção
- **Pull Request** → Preview Deploy (URL temporária)
- **Merge de PR** → Deploy de Produção

### Redeploy Manual

Se precisar redesplegar sem mudanças de código:

1. No dashboard Vercel, vá em **Deployments**
2. Clique nos 3 pontinhos do último deploy
3. Selecione **"Redeploy"**

## 🐛 Troubleshooting

### Erro: "PrismaClient is unable to run in Vercel Edge Runtime"

**Solução:** Adicione ao `next.config.ts`:

```typescript
const config: NextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  }
}
```

### Erro: "Can't reach database server"

**Possíveis causas:**
1. Senha incorreta (verifique encoding de caracteres especiais)
2. String de conexão errada (porta 6543 para pooling, 5432 para direct)
3. Firewall do Supabase (improvável no tier gratuito)

**Solução:**
1. Verifique as variáveis de ambiente no Vercel
2. Teste a conexão usando Prisma Studio localmente:
   ```bash
   npx prisma studio
   ```

### Erro: "Environment variable not found: DATABASE_URL"

**Solução:**
1. Certifique-se de que `DATABASE_URL` está configurada no Vercel
2. Faça redeploy após adicionar a variável

### Prisma Client não gerado

**Solução:**
Adicione ao `package.json` (já deve estar presente):

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

### Auto-refresh não funciona

**Causa:** Hydration mismatch ou cache agressivo.

**Solução:**
1. Verifique que `router.refresh()` está sendo chamado
2. Adicione `no-store` em fetches críticos:
   ```typescript
   export const dynamic = 'force-dynamic'
   ```

## 🔐 Segurança Pós-Deploy

### ⚠️ ALTERE CREDENCIAIS PADRÃO

1. Faça login como admin
2. Vá em **Admin** → **Usuários**
3. Edite o usuário admin e altere a senha
4. (Opcional) Altere o email para um real

### Habilitar HTTPS (Automático)

Vercel fornece SSL/TLS automaticamente via Let's Encrypt. Todas as requisições HTTP são redirecionadas para HTTPS.

### Configurar Domínio Personalizado (Opcional)

1. No Vercel, vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `ogum.com.br`)
3. Configure DNS conforme instruções do Vercel:
   - Adicione registro `A` ou `CNAME`
4. Aguarde propagação DNS (~10min a 48h)

### Backups do Banco de Dados

Supabase faz backups automáticos:
- **Tier Gratuito:** Backups diários, retenção de 7 dias
- **Tier Pago:** Backups configuráveis, point-in-time recovery

## 📊 Monitoramento

### Logs da Vercel

1. Acesse **Project** → **Logs**
2. Monitore:
   - Erros de runtime
   - Latência de Server Actions
   - Cold starts

### Métricas do Supabase

1. Acesse **Database** → **Reports**
2. Monitore:
   - Número de conexões ativas
   - Queries por segundo
   - Tamanho do banco (limite de 500MB no tier free)

### Analytics (Opcional)

Adicione Google Analytics ou Vercel Analytics:

```bash
npm install @vercel/analytics
```

```tsx
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 🚀 Próximos Passos

- [ ] Configurar domínio personalizado
- [ ] Configurar notificações de erro (Sentry)
- [ ] Implementar rate limiting
- [ ] Adicionar testes E2E (Playwright)
- [ ] Configurar CI/CD com testes automáticos

## 📞 Suporte

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs

---

**Ogum Tech** - Deploy realizado com sucesso! ⚔️
