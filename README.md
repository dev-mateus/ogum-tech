# Ogum Tech - Sistema de Gestão de Giras de Umbanda

Sistema completo para gerenciamento de filas de atendimento em giras de Umbanda, desenvolvido com Next.js 15 e Prisma.

## 🚀 Tecnologias

- **Next.js 15.5** - Framework fullstack com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização moderna
- **Prisma 5.22.0** - ORM para PostgreSQL
- **Supabase** - Backend-as-a-Service (PostgreSQL + Realtime)
- **JWT (jose)** - Autenticação com HTTP-only cookies
- **Zod** - Validação de schemas
- **Bcrypt** - Hash de senhas

## 📋 Funcionalidades

### Autenticação e Autorização
- Login com email/senha
- JWT com expiração de 12 horas
- Controle de acesso baseado em roles (admin/user)
- HTTP-only cookies para segurança

### Gestão Administrativa (Admin)
- Cadastro de funções (Médium, Cambone, Ogã)
- Cadastro de tipos de gira (Preto-Velho, Caboclo, Exu, Pomba-Gira)
- Cadastro de usuários com função
- Abertura e encerramento de giras
- Marcação de presença de médiuns

### Gestão de Filas
- Adição de consulentes na fila
- Sequência automática de atendimento
- Atribuição de médiuns aos consulentes
- Atualização de status (aguardando → atendendo → atendido)
- Auto-refresh a cada 5 segundos
- Interface visual com cores por status

## 🛠️ Instalação Local

### Pré-requisitos
- Node.js 18.x ou superior
- npm ou yarn
- Conta no Supabase (ou PostgreSQL local)

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/dev-mateus/ogum-tech.git
cd ogum-tech
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Auth
NEXTAUTH_SECRET="sua-chave-secreta-gerada-com-openssl"
NEXTAUTH_URL="http://localhost:3000"

# Supabase (opcional para Realtime)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="sua-anon-key"
```

4. **Gere uma chave secreta forte**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. **Rode as migrations do Prisma**
```bash
npx prisma migrate dev --name init_schema
```

6. **Popule o banco com dados iniciais**
```bash
npx prisma db seed
```

Isso criará:
- Funções: Médium, Cambone, Ogã
- Tipos de gira: Preto-Velho, Caboclo, Exu, Pomba-Gira
- Admin: `admin@ogum.local` / `Admin@123`
- Usuários teste: `maria@ogum.local`, `joao@ogum.local`, `ana@ogum.local` / `User@123`

7. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse http://localhost:3000

## 📦 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run start        # Inicia servidor de produção
npm run lint         # Roda ESLint
npx prisma studio    # Abre interface visual do banco
npx prisma db seed   # Popula banco com dados iniciais
```

## 🔐 Credenciais Padrão

### Admin
- Email: `admin@ogum.local`
- Senha: `Admin@123`

### Usuários de Teste
- Email: `maria@ogum.local` / `joao@ogum.local` / `ana@ogum.local`
- Senha: `User@123`

**⚠️ IMPORTANTE:** Altere essas senhas em produção!

## 🗂️ Estrutura do Projeto

```
ogum-tech/
├── src/
│   ├── app/
│   │   ├── actions/          # Server Actions (auth, admin, queue)
│   │   ├── dashboard/        # Páginas protegidas
│   │   │   ├── admin/        # Admin CRUD
│   │   │   └── gira/[id]/    # Detalhes da gira e fila
│   │   ├── login/            # Página de login
│   │   └── page.tsx          # Root redirect
│   ├── components/           # Componentes React
│   │   ├── AdminForms.tsx    # Formulários admin
│   │   ├── GiraQueue.tsx     # Gestão da fila
│   │   ├── Header.tsx        # Cabeçalho
│   │   └── Sidebar.tsx       # Menu lateral
│   └── lib/
│       ├── prisma.ts         # Cliente Prisma
│       ├── supabase.ts       # Cliente Supabase
│       └── validations.ts    # Schemas Zod
├── prisma/
│   ├── schema.prisma         # Schema do banco
│   └── seed.ts               # Script de seed
└── public/                   # Arquivos estáticos
```

## 🎯 Fluxo de Uso

1. **Admin abre uma gira**
   - Acessa `/dashboard/admin`
   - Seleciona tipo de gira e data
   - Marca presença dos médiuns

2. **Durante a gira**
   - Acessa a gira em `/dashboard/gira/[id]`
   - Adiciona consulentes na fila (nome é suficiente)
   - Atribui médium ao primeiro da fila
   - Muda status para "atendendo"
   - Finaliza atendimento → status "atendido"
   - Próximo consulente automaticamente

3. **Encerrar gira**
   - Admin retorna a `/dashboard/admin`
   - Encerra gira (só permite se fila vazia)

## 🔄 Real-time

Atualmente usa **auto-refresh a cada 5 segundos** no componente `GiraQueue`.

Para implementar Supabase Realtime (WebSocket):
- Configure as variáveis `NEXT_PUBLIC_SUPABASE_*`
- Substitua `useEffect` interval por `supabase.channel().on('postgres_changes')`

## 📊 Modelo de Dados

### Principais Entidades
- **Function** - Funções (Médium, Cambone, Ogã)
- **User** - Usuários do sistema (role: admin/user)
- **GiraType** - Tipos de gira (Preto-Velho, Caboclo...)
- **Gira** - Sessão de atendimento
- **GiraMedium** - Presença de médiuns na gira
- **QueueEntry** - Consulente na fila (sequence, status)

### Status da Fila
- `aguardando` - Esperando atendimento
- `atendendo` - Em atendimento
- `atendido` - Finalizado

## 🚀 Deploy

Veja instruções completas em [DEPLOY.md](./DEPLOY.md)

### Resumo Rápido (Vercel + Supabase)
1. Crie projeto no Supabase
2. Copie DATABASE_URL e DIRECT_URL
3. Conecte repo ao Vercel
4. Configure variáveis de ambiente
5. Deploy automático!

## 🐛 Troubleshooting

### Erro "PrismaClient is unable to connect"
- Verifique `DATABASE_URL` e `DIRECT_URL` no `.env`
- Confirme que IP está na whitelist do Supabase

### "Invalid credentials" no login
- Rode `npx prisma db seed` para criar usuários
- Verifique que migrations foram aplicadas

### Auto-refresh não funciona
- Componente `GiraQueue` precisa ser Client Component
- Verifique console do navegador para erros

## 📝 Licença

MIT

## 👥 Contribuindo

Pull requests são bem-vindos! Para mudanças grandes, abra uma issue primeiro.

---

**Desenvolvido com ❤️ para casas de Umbanda**


This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
