# Contribuindo para o Ogum Tech

Obrigado por considerar contribuir para o Ogum Tech! 🙏

## 🤝 Como Contribuir

### 1. Fork e Clone

```bash
# Fork o repositório no GitHub
# Depois clone seu fork:
git clone https://github.com/SEU-USUARIO/ogum-tech.git
cd ogum-tech
```

### 2. Configurar Ambiente Local

```bash
# Instale as dependências
npm install

# Configure o .env (veja .env.example)
cp .env.example .env

# Execute as migrações
npx prisma migrate dev

# Popule com dados iniciais
npx prisma db seed

# Inicie o servidor
npm run dev
```

### 3. Crie uma Branch

Use nomes descritivos que sigam o padrão:

```bash
# Para novas funcionalidades
git checkout -b feature/nome-da-funcionalidade

# Para correções de bugs
git checkout -b fix/nome-do-bug

# Para melhorias de documentação
git checkout -b docs/descricao-da-melhoria

# Para refatorações
git checkout -b refactor/descricao-da-refatoracao
```

### 4. Faça suas Mudanças

- Escreva código limpo e bem documentado
- Siga os padrões de código do projeto
- Teste suas mudanças localmente
- Certifique-se de que o build funciona: `npm run build`

### 5. Commit suas Mudanças

Seguimos o padrão [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Formato: <tipo>: <descrição>

git commit -m "feat: adiciona cadastro de consulentes"
git commit -m "fix: corrige bug no cálculo de sequência da fila"
git commit -m "docs: atualiza README com instruções de deploy"
git commit -m "style: ajusta espaçamento no componente Header"
git commit -m "refactor: extrai lógica de autenticação para hook"
git commit -m "perf: otimiza query de giras abertas"
git commit -m "test: adiciona testes para Server Actions"
```

**Tipos de commit:**
- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação, estilos (não afeta código)
- `refactor:` - Refatoração de código
- `perf:` - Melhorias de performance
- `test:` - Adição ou correção de testes
- `chore:` - Tarefas de manutenção, configs

### 6. Push e Pull Request

```bash
# Push para seu fork
git push origin feature/nome-da-funcionalidade
```

Depois:
1. Vá para o GitHub e abra um Pull Request
2. Descreva suas mudanças claramente
3. Referencie issues relacionadas (se houver)
4. Aguarde review

## 📋 Checklist de Pull Request

Antes de abrir um PR, certifique-se de que:

- [ ] O código segue os padrões do projeto (ESLint passa)
- [ ] Build funciona sem erros (`npm run build`)
- [ ] Testou as mudanças localmente
- [ ] Adicionou/atualizou documentação se necessário
- [ ] Commits seguem o padrão Conventional Commits
- [ ] Branch está atualizada com `main`

## 🎨 Padrões de Código

### TypeScript
- Use tipos explícitos sempre que possível
- Evite `any`, prefira `unknown` ou tipos específicos
- Use interfaces para objetos complexos

### React/Next.js
- Prefira Server Components (padrão)
- Use Client Components (`'use client'`) apenas quando necessário
- Server Actions para mutações de dados

### Nomenclatura
- **Componentes:** PascalCase (`AdminForms.tsx`)
- **Funções:** camelCase (`getOpenGiras`)
- **Constantes:** UPPER_SNAKE_CASE (`JWT_SECRET`)
- **Arquivos de rota:** kebab-case

### CSS/Tailwind
- Use classes do Tailwind CSS
- Mantenha o design minimalista preto e branco
- Bordas sólidas (border-2), sem arredondamento
- Tipografia bold e uppercase em labels

## 🧪 Testes

Atualmente não temos testes automatizados, mas estamos abertos a contribuições nessa área!

Se quiser adicionar testes:
- Sugerimos Vitest para testes unitários
- Playwright para testes E2E
- React Testing Library para componentes

## 🐛 Reportando Bugs

Ao reportar bugs, inclua:

1. **Descrição clara** do problema
2. **Passos para reproduzir**
3. **Comportamento esperado** vs **comportamento atual**
4. **Screenshots** (se aplicável)
5. **Ambiente:**
   - OS (Windows, Mac, Linux)
   - Browser (Chrome, Firefox, Safari)
   - Node.js version

## 💡 Sugerindo Funcionalidades

Adoramos ideias novas! Ao sugerir funcionalidades:

1. Descreva o problema que a funcionalidade resolve
2. Explique a solução proposta
3. Considere alternativas
4. Pense em possíveis impactos (performance, UX, etc)

## 📞 Dúvidas

Se tiver dúvidas sobre como contribuir:

- Abra uma [issue](https://github.com/dev-mateus/ogum-tech/issues) no GitHub
- Marque como `question`
- Descreva sua dúvida claramente

## 🙏 Código de Conduta

Esperamos que todos os colaboradores:

- Sejam respeitosos e inclusivos
- Deem e recebam feedback construtivo
- Focarem no que é melhor para a comunidade
- Demonstrem empatia com outros membros

Não toleramos:
- Linguagem ofensiva ou discriminatória
- Assédio de qualquer tipo
- Spam ou autopromoção excessiva

## 📜 Licença

Ao contribuir para o Ogum Tech, você concorda que suas contribuições serão licenciadas sob a [MIT License](./LICENSE).

---

**Obrigado por contribuir para o Ogum Tech!** ⚔️
