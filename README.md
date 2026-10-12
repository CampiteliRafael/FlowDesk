# FlowDesk

FlowDesk e um projeto de portfolio: uma aplicacao demonstrativa para organizar e acompanhar solicitacoes de usuarios. O objetivo e demonstrar engenharia front-end com React, TypeScript, acessibilidade, testes e tratamento cuidadoso dos estados da interface.

> **Status:** MVP demonstrativo. A tela de entrada nao autentica usuarios e os dados nao representam um servico de producao.

## Escopo do MVP

- Overview com indicadores derivados dos dados demonstrativos.
- Central de solicitacoes com pesquisa, filtros, ordenacao e paginacao.
- Detalhes com atualizacao de status e prioridade, atribuicao, comentarios e historico.
- Login e saída demonstrativos, layout responsivo e estados de carregamento, erro e vazio.
- API simulada com validacao de entrada, cache de requisicoes e falhas reproduziveis.
- Testes automatizados dos fluxos principais.

Funcionalidades planejadas nao devem ser consideradas implementadas ate estarem disponiveis e testadas na aplicacao.

## Tecnologias

- Next.js com App Router
- React e TypeScript
- Tailwind CSS
- TanStack Query para consultas e mutacoes
- React Hook Form e Zod para validacao de formularios e fronteiras da API
- Vitest, React Testing Library e MSW para testes unitarios, de componentes e da camada HTTP
- Playwright para testes de ponta a ponta

## Requisitos

- Node.js compativel com a versao do Next.js instalada
- npm

## Executar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Validacoes

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Para executar o fluxo de ponta a ponta em Chromium (com o navegador do Playwright instalado):

```bash
npx playwright install chromium
npm run test:e2e
```

## Arquitetura e dados

- `src/app/` define rotas com o App Router; o grupo `(workspace)` organiza as paginas internas sem alterar suas URLs.
- `src/components/layout/` guarda a navegacao e o shell compartilhado entre paginas.
- `src/features/tickets/` concentra tipos, schemas, cliente HTTP, hooks, dados e API demonstrativos de tickets.
- A rota inicial apresenta uma entrada demonstrativa; continuar abre `/dashboard` e a opção **Sair** retorna à entrada e limpa o cache de consultas do cliente. Nenhuma credencial e validada, armazenada ou enviada.
- O dashboard calcula indicadores, grafico semanal e categorias usando os dados recebidos da API demonstrativa.
- A central permite buscar por titulo ou identificador, filtrar por status, prioridade e responsavel, ordenar os resultados, paginar e sincronizar os controles com a URL.
- Os detalhes permitem alterar status e prioridade, atribuir responsaveis, adicionar comentarios e consultar o historico pela API.
- O formulario de nova solicitacao valida os dados e cria itens na API demonstrativa.
- `src/app/globals.css` define os tokens de cor, superficie, foco, campos e status usados nas telas do projeto.
- A API guarda os dados em memoria no processo do servidor. Eles continuam disponiveis entre navegacoes enquanto esse processo estiver em execucao, mas sao reiniciados ao reiniciar o servidor e nao sao compartilhados entre processos/instancias.
- A API e local ao projeto: nao ha banco de dados, autenticacao real, persistencia duravel ou envio dos dados a servicos externos.
- O controle **Simular falha de API** provoca erros 503 nos pedidos da interface; desative-o e tente novamente para verificar a recuperacao dos estados de erro.

## Limites conhecidos

- Login e identidade sao apenas demonstrativos e nao protegem as rotas.
- A API em memoria e adequada para demonstracao local, mas nao para deploy com multiplos processos ou dados que precisem sobreviver a reinicios.
- Dados ficticios sao identificados na interface como demonstrativos.
