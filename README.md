# Ogum Tech

[![Deploy on Vercel](https://vercel.com/button)](https://ogum-tech.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

Sistema moderno de gerenciamento de giras e filas de atendimento para terreiros de Umbanda.

**🌐 Produção:** [https://ogum-tech.vercel.app](https://ogum-tech.vercel.app)

## ✨ Características

- 🎨 **Design Minimalista**: Interface preto e branco representando as cores do terreiro
- ⚡ **Performance**: Server-Side Rendering com Next.js 15
- 🔒 **Segurança**: Autenticação JWT com bcrypt, HTTP-only cookies
- 📱 **Responsivo**: Funciona perfeitamente em desktop e mobile
- ♿ **Acessível**: WCAG AAA compliant (contraste 21:1)
- 🔄 **Tempo Real**: Auto-refresh da fila a cada 5 segundos

## 🚀 Stack Tecnológica

### Frontend/Backend (Fullstack)
- **Next.js 15.5.6** - App Router, Server Components, Server Actions
- **React 18.3.1** - UI Library
- **TypeScript 5.x** - Type Safety
- **Tailwind CSS 4.x** - Utility-First CSS

### Database & ORM
- **PostgreSQL** - Database (via Supabase)
- **Prisma 5.22.0** - ORM Type-Safe

### Autenticação & Segurança
- **JWT** (jose library) - Token-based authentication
- **bcryptjs** - Password hashing (10 rounds)
- **Zod** - Schema validation

### Deploy
- **Vercel** - Serverless deployment
- **Supabase** - PostgreSQL hosting

## 📋 Funcionalidades

### Para Administradores
- ✅ Cadastro de funções (Médium, Cambone, Ogã)
- ✅ Cadastro de tipos de giras (Preto-Velho, Caboclo, etc)
- ✅ Cadastro de usuários com roles
- ✅ Abertura e fechamento de giras
- ✅ Visualização de todas as giras

### Para Operadores
- ✅ Gestão de fila de atendimento
- ✅ Adição de consulentes na fila
- ✅ Atribuição de médiuns aos consulentes
- ✅ Atualização de status (Aguardando → Em Atendimento → Finalizado)
- ✅ Auto-refresh em tempo real

## 🛠️ Instalação Local

### Pré-requisitos
- Node.js 18+ e npm
- Conta no Supabase (ou PostgreSQL local)
- Git

### Passo a Passo

1. **Clone o repositório:**
```bash
git clone https://github.com/dev-mateus/ogum-tech.git
cd ogum-tech
```

2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto:

```env
# Database (Supabase ou PostgreSQL)
DATABASE_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:[PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres"

# JWT Secret (gere uma chave aleatória)
NEXTAUTH_SECRET="seu-secret-aqui"
```

> **Nota:** Use `openssl rand -base64 32` para gerar uma chave secreta segura.

4. **Execute as migrações do Prisma:**
```bash
npx prisma migrate dev
```

5. **Popule o banco de dados (opcional):**
```bash
npx prisma db seed
```

6. **Inicie o servidor de desenvolvimento:**
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🔑 Credenciais Padrão

Após executar o seed, use estas credenciais para login:

- **Email:** `admin@ogum.local`
- **Senha:** `Admin@123`

> ⚠️ **Importante:** Altere essas credenciais em produção!

## 📁 Estrutura do Projeto

```
ogum-tech/
├── prisma/
│   ├── schema.prisma        # Schema do banco de dados
│   └── seed.ts              # Dados iniciais
├── src/
│   ├── app/
│   │   ├── actions/         # Server Actions
│   │   │   ├── admin.ts     # Ações administrativas
│   │   │   ├── auth.ts      # Autenticação
│   │   │   └── queue.ts     # Gestão de fila
│   │   ├── dashboard/       # Área autenticada
│   │   │   ├── admin/       # Painel administrativo
│   │   │   ├── gira/[id]/   # Página de gira específica
│   │   │   └── page.tsx     # Lista de giras
│   │   └── login/           # Página de login
│   ├── components/          # Componentes React
│   │   ├── AdminForms.tsx   # Formulários administrativos
│   │   ├── GiraQueue.tsx    # Componente de fila
│   │   ├── Header.tsx       # Cabeçalho
│   │   └── Sidebar.tsx      # Menu lateral
│   └── lib/                 # Utilitários
│       ├── prisma.ts        # Cliente Prisma
│       └── validations.ts   # Schemas Zod
├── ARCHITECTURE.md          # Documentação da arquitetura
├── DEPLOY.md                # Guia de deploy
└── package.json             # Dependências
```

## 🚀 Deploy para Produção

### Vercel (Recomendado)

1. **Crie um projeto no Supabase:**
   - Acesse [supabase.com](https://supabase.com)
   - Crie um novo projeto
   - Copie as connection strings

2. **Deploy no Vercel:**
   - Conecte seu repositório GitHub
   - Configure as variáveis de ambiente:
     - `DATABASE_URL`
     - `DIRECT_URL`
     - `NEXTAUTH_SECRET`
   - Deploy automático!

Veja o arquivo [DEPLOY.md](./DEPLOY.md) para instruções detalhadas.

## 🗃️ Modelo de Dados

### Entidades Principais

- **User** - Usuários do sistema (Admin, Médium, Cambone, Ogã)
- **Function** - Funções disponíveis no terreiro
- **GiraType** - Tipos de giras (Preto-Velho, Caboclo, etc)
- **Gira** - Giras abertas/fechadas
- **GiraMedium** - Médiuns presentes em cada gira
- **QueueEntry** - Fila de atendimento

Veja o arquivo [ARCHITECTURE.md](./ARCHITECTURE.md) para o diagrama completo.

## 🎨 Design System

O projeto utiliza um design minimalista em **preto e branco**, representando as cores sagradas do terreiro de Umbanda:

- **Preto (#000000)**: Cor principal, força e proteção
- **Branco (#FFFFFF)**: Pureza e luz
- **Cinza (50-900)**: Variações para hierarquia visual

### Princípios de Design
- ✅ Tipografia bold e uppercase em labels
- ✅ Bordas sólidas (border-2) sem arredondamento
- ✅ Contraste máximo (WCAG AAA - 21:1)
- ✅ Estados de foco visíveis para acessibilidade

## 📚 Documentação Adicional

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitetura detalhada do sistema
- [DEPLOY.md](./DEPLOY.md) - Guia completo de deploy
- [SECURITY_AUDIT.md](./SECURITY_AUDIT.md) - Auditoria de segurança

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Convenções de Commit

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação, estilos
- `refactor:` - Refatoração de código
- `perf:` - Melhorias de performance
- `test:` - Adição de testes

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ por [Mateus](https://github.com/dev-mateus)

## 🙏 Agradecimentos

- Comunidade Next.js
- Equipe do Prisma
- Supabase Team
- Terreiros de Umbanda que inspiraram este projeto

---

**Ogum Tech** - Tecnologia a serviço da fé ⚔️
