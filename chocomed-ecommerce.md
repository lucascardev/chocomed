# Plano de Trabalho - ChocoMed E-commerce (`chocomed-ecommerce.md`)

Este documento contém o detalhamento das tarefas de desenvolvimento, atribuição de agentes e critérios de verificação para a criação do canal digital da ChocoMED.

---

## 📋 Informações Gerais
- **Tipo de Projeto**: WEB (Next.js)
- **Status**: Planejamento (Aguardando aprovação do usuário para iniciar a execução)

---

## 🎯 Critérios de Sucesso (Success Criteria)
1. **Autenticação**: Login/registro funcional via Clerk.
2. **Sincronização**: Cada usuário autenticado gera/atualiza um registro correspondente no MongoDB via Webhook seguro.
3. **E-commerce**: Catálogo funcional com listagem de produtos, carrinho reativo e botão de checkout que gera e redireciona para o link personalizado do WhatsApp.
4. **Calculadora**: Interface interativa de Impacto Glicêmico calculando a carga com base nos dados do usuário.
5. **Clube ChocoMED**: Acesso restrito a receitas para membros logados.
6. **Blog**: Artigos cadastrados no banco aparecendo na interface e acessíveis por slugs.
7. **Painel Admin**: Interface funcional protegida para gerenciamento dos módulos.
8. **UX & Estética**: Design de alto padrão nas cores Marrom Cacau, Creme/Bege e Verde-Oliva, sem utilizar violeta/roxo, totalmente responsivo.

---

## 🛠️ Tecnologias Escolhidas (Tech Stack)
- **Frontend & Backend**: Next.js 14+ (App Router, API Routes, React Server Components)
- **Estilização**: Vanilla CSS (CSS Modules) - Sem TailwindCSS
- **Banco de Dados**: MongoDB (Mongoose para modelagem)
- **Autenticação**: Clerk (`@clerk/nextjs`)
- **Bibliotecas Auxiliares**: `lucide-react` (ícones), `svix` (verificação de webhook do Clerk)

---

## 🗂️ Estrutura de Arquivos Planejada
Veja a seção 4 do [Plano de Implementação](file:///home/lucascardev/.gemini/antigravity/brain/7f79bc2c-6670-4f39-8401-6cd2adf63eaa/implementation_plan.md) para a estrutura detalhada de pastas e arquivos.

---

## 📝 Cronograma e Divisão de Tarefas (Task Breakdown)

### Fase 0: Preparação e Setup da Infraestrutura (P0)

#### Tarefa 0.1: Inicialização do Projeto Next.js e Instalação de Dependências
- **Agente**: `devops-engineer` | **Skill**: `app-builder`
- **Dependências**: Nenhuma (Início)
- **INPUT**: Diretório vazio.
- **OUTPUT**: Projeto Next.js inicializado com TypeScript, dependências principais (`@clerk/nextjs`, `mongoose`, `svix`, `lucide-react`) instaladas.
- **VERIFY**: Executar `npm run dev` e acessar a página padrão do Next.js sem erros de compilação.

#### Tarefa 0.2: Configuração de Conexão com MongoDB e Modelos Mongoose
- **Agente**: `database-architect` | **Skill**: `database-design`
- **Dependências**: Tarefa 0.1
- **INPUT**: URI do MongoDB nas variáveis de ambiente.
- **OUTPUT**: Arquivos em `src/lib/db.ts` e esquemas em `src/models/*.ts` (User, Product, Order, BlogPost, Recipe, Review, Lead).
- **VERIFY**: Script de teste conectando ao banco e executando uma inserção básica.

#### Tarefa 0.3: Configuração do Clerk no Next.js (Middleware e Layout)
- **Agente**: `security-auditor` | **Skill**: `clean-code`
- **Dependências**: Tarefa 0.1
- **INPUT**: Chaves do Clerk no arquivo `.env.local`.
- **OUTPUT**: Middleware do Clerk configurado para rotas públicas/privadas; `ClerkProvider` adicionado no root layout.
- **VERIFY**: Tentar acessar rotas protegidas (como `/clube`) sem login e confirmar redirecionamento para página de login do Clerk.

---

### Fase 1: Sincronização e Fluxo de Usuários (P1)

#### Tarefa 1.1: Webhook de Sincronização do Clerk para MongoDB
- **Agente**: `backend-specialist` | **Skill**: `api-patterns`
- **Dependências**: Tarefa 0.2, Tarefa 0.3
- **INPUT**: Configuração de evento `user.created` e `user.updated` no Clerk.
- **OUTPUT**: Rota de API em `src/app/api/webhooks/clerk/route.ts` que valida a assinatura com a biblioteca `svix` e persiste o usuário no MongoDB.
- **VERIFY**: Realizar registro de teste no Clerk e verificar se o documento correspondente com `clerkId` e `points: 0` foi criado no MongoDB.

---

### Fase 2: Módulo E-Commerce (P2)

#### Tarefa 2.1: Desenvolvimento da Interface do Catálogo de Produtos e Detalhes
- **Agente**: `frontend-specialist` | **Skill**: `frontend-design`
- **Dependências**: Tarefa 0.2
- **INPUT**: Coleção `Product` no MongoDB.
- **OUTPUT**: Landing page com vitrine de produtos e página dinâmica `/produtos/[slug]` exibindo imagens, detalhes nutricionais (carboidratos, índice glicêmico) e formulário de Avaliação.
- **VERIFY**: Carregar a página `/produtos/chocolate-cacau-70` e ver a renderização dos componentes visuais com a paleta Creme, Cacau e Verde-Oliva.

#### Tarefa 2.2: Carrinho de Compras Reativo e Checkout via WhatsApp
- **Agente**: `frontend-specialist` | **Skill**: `frontend-design`
- **Dependências**: Tarefa 2.1
- **INPUT**: Estado de carrinho no contexto React.
- **OUTPUT**: Página `/carrinho` com lista de itens, cálculo de totais, formulário para inserção de endereço/contato e botão "Finalizar Pedido via WhatsApp".
- **VERIFY**: Ao clicar em finalizar, confirmar a inserção do pedido no MongoDB como status 'pending' e redirecionamento correto para `https://wa.me/...` contendo a mensagem formatada com os detalhes do pedido.

---

### Fase 3: Recursos Interativos e Educativos (P2)

#### Tarefa 3.1: Calculadora de Impacto Glicêmico
- **Agente**: `frontend-specialist` | **Skill**: `frontend-design`
- **Dependências**: Nenhuma (estática em primeira instância, conectada aos produtos)
- **INPUT**: Seleção de chocolate ChocoMED e porção (em gramas), input de glicemia ou limite diário.
- **OUTPUT**: Página `/calculadora` interativa calculando Carga Glicêmica e exibindo o veredito seguro/moderado.
- **VERIFY**: Verificar se porções maiores geram avisos proporcionais corretos e comparativo visual (gráfico de barras) de carga glicêmica contra o chocolate convencional.

#### Tarefa 3.2: Blog Educativo e Captação de Leads
- **Agente**: `frontend-specialist` | **Skill**: `seo-fundamentals`
- **Dependências**: Tarefa 0.2
- **INPUT**: Coleção `BlogPost` e `Lead` no MongoDB.
- **OUTPUT**: Páginas `/blog` e `/blog/[slug]`, e componente de captura de lead para o E-book com gravação na coleção `Lead`.
- **VERIFY**: Preencher o formulário do e-book e constatar a inserção do e-mail no MongoDB e liberação do download direto.

#### Tarefa 3.3: Clube ChocoMED (Receitas Saudáveis Protegidas)
- **Agente**: `frontend-specialist` | **Skill**: `clean-code`
- **Dependências**: Tarefa 0.3, Tarefa 1.1
- **INPUT**: Autenticação ativa e coleção `Recipe`.
- **OUTPUT**: Rota `/clube` contendo o saldo de pontos do usuário e receitas saudáveis restritas a membros.
- **VERIFY**: Acesso não logado deve barrar o usuário; acesso logado deve ler dados do MongoDB e renderizar as receitas exclusivas.

---

### Fase 4: Painel Administrativo Integrado (P3)

#### Tarefa 4.1: Painel Administrativo (Gerenciamento de Produtos, Pedidos, Artigos e Receitas)
- **Agente**: `backend-specialist` | **Skill**: `api-patterns`
- **Dependências**: Todas as anteriores
- **INPUT**: Checagem de campo `isAdmin: true` no perfil do usuário no MongoDB.
- **OUTPUT**: Interface protegida `/admin` com abas para gerenciar o catálogo, criar artigos de blog, cadastrar receitas e listar pedidos vindos do WhatsApp.
- **VERIFY**: Acessar `/admin` com conta normal (deve dar erro 403 ou redirecionar); acessar com conta admin e testar criação de um novo chocolate.

---

## 🏁 Fase X: Verificação Final e Qualidade

Após a conclusão das tarefas, serão executadas as seguintes auditorias mandatórias:
1. **Análise de Tipos e Lint**:
   `npm run lint && npx tsc --noEmit`
2. **Auditoria de Segurança**:
   `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .`
3. **Auditoria de Acessibilidade e UX**:
   `python .agent/skills/frontend-design/scripts/ux_audit.py .`
4. **Build de Produção**:
   `npm run build`
5. **Verificação Visual Manual**:
   - Confirmar a ausência absoluta de cores roxas/violetas (Purple Ban).
   - Validar responsividade em celular, tablet e desktop.
