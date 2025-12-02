# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [1.0.0] - 2025-01-XX

### 🎉 Versão Inicial

Sistema completo de gerenciamento de giras e filas de atendimento para terreiros de Umbanda.

### Adicionado

#### Autenticação e Autorização
- Sistema de login com email e senha
- Autenticação JWT com HTTP-only cookies
- Controle de acesso baseado em roles (admin/user)
- Expiração de token de 12 horas

#### Gestão Administrativa
- Cadastro de funções (Médium, Cambone, Ogã)
- Cadastro de tipos de gira (Preto-Velho, Caboclo, Exu, Pomba-Gira)
- Cadastro de usuários com atribuição de funções
- Abertura e fechamento de giras
- Marcação de presença de médiuns em giras

#### Gestão de Filas
- Adição de consulentes na fila de atendimento
- Sequenciamento automático de atendimentos
- Atribuição de médiuns aos consulentes
- Atualização de status da fila (Aguardando → Em Atendimento → Finalizado)
- Auto-refresh da fila a cada 5 segundos
- Interface visual com indicadores de status

#### Design e UX
- Design minimalista em preto e branco representando as cores do terreiro
- Tipografia bold e uppercase em labels
- Bordas sólidas (border-2) sem arredondamento
- Contraste WCAG AAA (21:1) para acessibilidade
- Interface responsiva para desktop e mobile
- Estados de foco visíveis

#### Tecnologias
- Next.js 15.5.6 com App Router
- React 18.3.1 (Server + Client Components)
- TypeScript 5.x para type safety
- Prisma 5.22.0 como ORM
- PostgreSQL via Supabase
- Tailwind CSS 4.x para estilização
- JWT (jose library) para autenticação
- bcryptjs para hash de senhas (10 rounds)
- Zod para validação de schemas

#### Deploy e Infraestrutura
- Deploy automatizado na Vercel
- Database PostgreSQL no Supabase
- CI/CD automático com GitHub
- Connection pooling para otimização de conexões
- Variáveis de ambiente seguras

#### Documentação
- README.md completo com instruções de instalação
- ARCHITECTURE.md detalhando a arquitetura do sistema
- DEPLOY.md com guia passo a passo de deploy
- CONTRIBUTING.md com diretrizes para contribuidores
- SECURITY_AUDIT.md com auditoria de segurança
- .env.example com template de variáveis

### Segurança
- Senhas hashadas com bcrypt (10 rounds)
- HTTP-only cookies para armazenamento de tokens
- Validação de inputs com Zod
- Proteção contra SQL Injection via Prisma ORM
- Autenticação obrigatória para rotas protegidas
- Autorização baseada em roles

### Performance
- Server-Side Rendering (SSR) para SEO
- Server Components para redução de JavaScript no cliente
- Auto-refresh otimizado com router.refresh()
- Connection pooling no PostgreSQL
- CSS otimizado com Tailwind (tree-shaking)

---

## Roadmap Futuro

### [1.1.0] - Planejado
- [ ] Cadastro de consulentes (autocomplete)
- [ ] Histórico de atendimentos por consulente
- [ ] Exportação de relatórios em PDF

### [1.2.0] - Planejado
- [ ] Dashboard com estatísticas
- [ ] Gráficos de atendimentos por tipo de gira
- [ ] Relatórios de produtividade de médiuns

### [2.0.0] - Planejado
- [ ] Notificações em tempo real (WebSockets)
- [ ] PWA (Progressive Web App)
- [ ] App mobile nativo (React Native)
- [ ] Dark mode toggle

### Melhorias Técnicas
- [ ] Testes E2E com Playwright
- [ ] Testes unitários com Vitest
- [ ] Storybook para componentes
- [ ] CI/CD com testes automatizados
- [ ] Docker para desenvolvimento local

---

[1.0.0]: https://github.com/dev-mateus/ogum-tech/releases/tag/v1.0.0
