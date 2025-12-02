# Guia de Deploy - Ogum Tech

Este guia cobre o deploy do sistema usando Vercel (frontend/backend) + Supabase (PostgreSQL).

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com) (free tier ok)
- Conta no [Vercel](https://vercel.com) (free tier ok)
- Repositório Git (GitHub, GitLab ou Bitbucket)

## 🗄️ Passo 1: Configurar Supabase

### 1.1 Criar Projeto

1. Acesse https://supabase.com/dashboard
2. Clique em "New Project"
3. Escolha:
   - **Name**: ogum-tech-production
   - **Database Password**: Gere uma senha forte (guarde!)
   - **Region**: Escolha mais próxima dos usuários (ex: South America - São Paulo)
   - **Pricing Plan**: Free (até 500MB, 2 projetos)

4. Aguarde ~2 minutos para provisionar

### 1.2 Obter Strings de Conexão

1. No dashboard, vá em **Settings** → **Database**
2. Em **Connection String**, copie:
   - **Connection pooling** (para `DATABASE_URL`):
     ```
     postgresql://postgres.xxxxx:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
     ```
   - **Direct connection** (para `DIRECT_URL`):
     ```
     postgresql://postgres.xxxxx:[PASSWORD]@aws-0-sa-east-1.compute-1.amazonaws.com:5432/postgres
     ```

3. Substitua `[PASSWORD]` pela senha que você criou

### 1.3 Whitelist de IPs (Opcional)

Por padrão, Supabase permite conexões de qualquer IP. Para maior segurança:

1. Em **Settings** → **Database** → **Connection Security**
2. Adicione apenas IPs confiáveis (Vercel tem IPs dinâmicos, então melhor deixar aberto ou usar Vercel Edge Middleware)

## 🚀 Passo 2: Deploy no Vercel

### 2.1 Conectar Repositório

1. Push seu código para GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: deploy inicial do ogum-tech"
   git branch -M main
   git remote add origin https://github.com/dev-mateus/ogum-tech.git
   git push -u origin main
   ```

2. Acesse https://vercel.com/new
3. Clique em "Import Git Repository"
4. Selecione seu repositório `ogum-tech`

### 2.2 Configurar Variáveis de Ambiente

Antes de fazer deploy, configure as variáveis:

1. Em **Configure Project** → **Environment Variables**, adicione:

```env
DATABASE_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
DIRECT_URL=postgresql://postgres.xxxxx:[PASSWORD]@aws-0-sa-east-1.compute-1.amazonaws.com:5432/postgres
NEXTAUTH_SECRET=<gere-uma-chave-forte>
NEXTAUTH_URL=https://ogum-tech.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<sua-anon-key>
```

2. Para gerar `NEXTAUTH_SECRET` forte:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. Para obter Supabase URL e ANON_KEY:
   - **Settings** → **API** → copie `URL` e `anon public`

### 2.3 Build Settings

Vercel detecta Next.js automaticamente, mas confirme:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (ou deixe padrão)
- **Output Directory**: `.next` (ou deixe padrão)
- **Install Command**: `npm install` (ou deixe padrão)

### 2.4 Deploy!

1. Clique em **Deploy**
2. Aguarde ~2-3 minutos
3. Vercel mostrará URL de produção: `https://ogum-tech-xxx.vercel.app`

## 🛠️ Passo 3: Rodar Migrations em Produção

Após primeiro deploy, você precisa criar as tabelas no Supabase:

### Opção A: Via Prisma Studio (Recomendado)

1. Baixe o Prisma localmente apontando para produção:
   ```bash
   # Crie .env.production com DATABASE_URL de produção
   npx prisma migrate deploy --schema=./prisma/schema.prisma
   ```

2. Popule dados iniciais:
   ```bash
   npx prisma db seed
   ```

### Opção B: Via Supabase SQL Editor

1. Acesse **SQL Editor** no dashboard Supabase
2. Copie o conteúdo de `prisma/migrations/XXX_init_schema/migration.sql`
3. Execute no editor
4. Insira dados iniciais manualmente ou rode seed localmente apontando para produção

## 🔐 Passo 4: Criar Usuário Admin em Produção

### Via Script (Recomendado)

1. Crie um arquivo `create-admin.ts`:
   ```typescript
   import { PrismaClient } from '@prisma/client'
   import { hash } from 'bcryptjs'

   const prisma = new PrismaClient()

   async function main() {
     const password = await hash('SenhaForte@2024', 10)
     const admin = await prisma.user.create({
       data: {
         name: 'Admin Produção',
         email: 'admin@seudominio.com.br',
         passwordHash: password,
         role: 'admin',
       },
     })
     console.log('Admin criado:', admin.email)
   }

   main().finally(() => prisma.$disconnect())
   ```

2. Configure `.env` com `DATABASE_URL` de produção temporariamente
3. Rode: `npx tsx create-admin.ts`

### Via Supabase SQL

Execute no SQL Editor:

```sql
INSERT INTO "User" (id, name, email, "passwordHash", role, "createdAt")
VALUES (
  gen_random_uuid(),
  'Admin Produção',
  'admin@seudominio.com.br',
  '$2a$10$HASH_GERADO_AQUI',  -- Use bcrypt online para gerar
  'admin',
  NOW()
);
```

## ✅ Passo 5: Verificar Deploy

1. Acesse `https://seu-app.vercel.app`
2. Deve redirecionar para `/login`
3. Faça login com credenciais do admin criado
4. Teste criar uma função, tipo de gira, usuário
5. Abra uma gira e adicione consulente

## 🔄 Passo 6: Configurar CI/CD

Vercel automaticamente faz redeploy a cada push no `main`:

```bash
git add .
git commit -m "feat: adiciona nova funcionalidade"
git push origin main
# Deploy automático em ~2 minutos
```

## 🛡️ Checklist de Segurança

Antes de ir para produção, revise:

- [ ] `NEXTAUTH_SECRET` forte (32+ bytes em hex)
- [ ] Senhas de admin fortes (min 12 caracteres, maiúsculas, números, símbolos)
- [ ] `DATABASE_URL` e `DIRECT_URL` usando credentials pool do Supabase
- [ ] Remova credenciais padrão (`admin@ogum.local`, etc)
- [ ] Remova seeds de teste em produção
- [ ] Configure domínio customizado no Vercel (ex: `app.seuterreiro.com.br`)
- [ ] Habilite SSL/HTTPS (Vercel faz automático)
- [ ] Configure CORS se tiver frontend separado
- [ ] Monitore logs de erro no Vercel Dashboard

## 📊 Monitoramento

### Vercel Analytics

1. Em **Settings** → **Analytics**, habilite Vercel Analytics (free tier: 2.5k pageviews/mês)
2. Monitore tempos de resposta e erros

### Supabase Logs

1. **Database** → **Logs**: Queries lentas, erros de conexão
2. **API** → **Logs**: Uso de Realtime, Auth

### Limites Free Tier

**Vercel Free:**
- 100 GB bandwidth/mês
- 100 horas serverless/mês
- Unlimited deployments

**Supabase Free:**
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth/mês

Para seu caso (50 usuários, 1x/semana, 100 atendimentos), free tier é mais do que suficiente!

## 🐛 Troubleshooting

### Erro "PrismaClient initialization error"

- Rode `npx prisma generate` localmente e commit
- Verifique que `DATABASE_URL` está configurado no Vercel
- Certifique-se que Supabase está online

### "Too many connections" no banco

- Use `DATABASE_URL` com connection pooling (porta 6543)
- Adicione `connection_limit=1` na connection string

### Deploy demora muito

- Vercel tem timeout de 10min para builds
- Otimize `node_modules`: use `npm ci` ao invés de `npm install`
- Verifique se não está instalando devDependencies em produção

### 500 Internal Server Error

- Verifique logs no Vercel Dashboard → **Deployments** → **Functions**
- Confirme que migrations foram aplicadas no banco
- Teste Server Actions localmente com mesmas variáveis de ambiente

## 🔄 Rollback

Se algo der errado:

1. Acesse Vercel Dashboard → **Deployments**
2. Encontre deploy anterior estável
3. Clique nos 3 pontinhos → **Promote to Production**

## 📚 Recursos Adicionais

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Prisma Deploy Docs](https://www.prisma.io/docs/guides/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

**Dúvidas?** Abra uma issue no repositório ou consulte a documentação oficial.
