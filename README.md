# FlowDesk

FlowDesk é um MVP demonstrativo para organizar e acompanhar solicitações de usuários. O projeto explora engenharia front-end com React, TypeScript, acessibilidade, testes automatizados e tratamento dos estados da interface.

> **Escopo:** a entrada e a saída são demonstrativas. Não há autenticação real e os dados não representam um serviço de produção.

## Funcionalidades

- Visão geral com indicadores calculados a partir de dados demonstrativos.
- Central de solicitações com pesquisa, filtros, ordenação e paginação.
- Detalhes com atualização de status e prioridade, atribuição, comentários e histórico.
- Formulário para criação de solicitações.
- Estados de carregamento, erro e lista vazia.
- Simulação de falhas da API para observar os estados de erro e recuperação.

## Tecnologias

- Next.js com App Router
- React e TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form e Zod
- Vitest, React Testing Library e MSW
- Playwright para testes de ponta a ponta

## Executar localmente

Requisitos: Node.js compatível com a versão do Next.js instalada e npm.

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Verificações

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Para os testes de ponta a ponta:

```bash
npx playwright install chromium
npm run test:e2e
```

## Organização e dados

- `src/app/` contém as rotas do App Router.
- `src/components/layout/` contém navegação e estrutura compartilhada.
- `src/features/tickets/` concentra tipos, schemas, cliente HTTP, hooks e API demonstrativa.
- A API mantém os dados em memória; eles reiniciam com o servidor e não são compartilhados entre processos.
- A entrada não valida, armazena nem envia credenciais. A opção de saída limpa o cache de consultas.

O projeto não utiliza banco de dados, persistência durável ou autenticação real. Os dados são fictícios e destinados à demonstração.
