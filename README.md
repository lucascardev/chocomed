# 🍫 ChocoMED E-commerce & Clube de Fidelidade

ChocoMED é um e-commerce premium e clube de fidelidade focado em chocolates saudáveis, terapêuticos e artesanais direto do Vale do Jiquiriçá, Bahia. O projeto combina um visual cinematográfico com recursos modernos de compras, checkout simplificado via WhatsApp e acúmulo de pontos de fidelidade.

---

## ✨ Principais Funcionalidades

- **Experiência Visual Premium**: Vídeo de introdução cinematográfico em alta definição como plano de fundo na página inicial com controles de áudio em tempo real.
- **Catálogo de Produtos Saudáveis**: Listagem completa de chocolates medicinais detalhando ingredientes, benefícios e tabela nutricional.
- **Checkout Integrado via WhatsApp**: Finalização de pedidos rápida enviando os dados do carrinho e endereço de entrega diretamente para o WhatsApp de suporte.
- **Clube de Fidelidade (ChocoClube)**: Sistema integrado para usuários autenticados acumularem pontos a cada compra (R$ 1.00 = 1 ponto) e resgatarem receitas ou descontos.
- **Autenticação Segura**: Gerenciada inteiramente via Clerk para login social e e-mail.
- **Painel Administrativo**: Painel completo para gerenciamento de produtos, pedidos e clientes.

---

## 🛠️ Stack Tecnológica

- **Framework**: Next.js 16+ (App Router, Turbopack)
- **Banco de Dados**: MongoDB Atlas via Mongoose
- **Autenticação**: Clerk Authentication
- **Estilização**: Vanilla CSS (com CSS Modules)
- **Ícones**: Lucide React

---

## 🚀 Como Começar (Localmente)

### 1. Pré-requisitos
- Node.js v20 ou superior
- Conta no MongoDB Atlas
- Conta no Clerk

### 2. Configurando Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto contendo as seguintes credenciais:

```env
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=sua_publishable_key_aqui
CLERK_SECRET_KEY=sua_secret_key_aqui

# MongoDB Connection String
MONGODB_URI=mongodb+srv://lucascardev:<sua_senha>@pl-cluster.70qrh.mongodb.net/chocomed?appName=pl-cluster
```

### 3. Instalar Dependências
```bash
npm install
```

### 4. Semear o Banco de Dados (Seed)
Para preencher o catálogo de produtos e posts do blog iniciais, execute o servidor de desenvolvimento e acesse a rota de seed:
1. Inicie o servidor:
   ```bash
   npm run dev
   ```
2. Acesse no navegador ou via curl:
   ```bash
   curl http://localhost:3000/api/seed
   ```
   *Resposta esperada:* `{"success":true,"message":"Database seeded successfully"}`

### 5. Executar em Desenvolvimento
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 📦 Como Implantar no Vercel (Produção)

A plataforma Vercel oferece suporte nativo e otimizado para Next.js. Siga o passo a passo abaixo para implantar o ChocoMED:

### Passo 1: Preparar o Repositório GitHub
Certifique-se de que todo o código está commitado no seu repositório GitHub (com exceção do arquivo `.env.local` que está protegido no `.gitignore`).

### Passo 2: Criar Projeto no Vercel
1. Acesse o painel do [Vercel](https://vercel.com) e conecte com sua conta GitHub.
2. Clique em **Add New...** -> **Project**.
3. Selecione o repositório do **ChocoMED** e clique em **Import**.

### Passo 3: Configurar Variáveis de Ambiente no Vercel
Antes de clicar em Deploy, expanda a seção **Environment Variables** e insira as mesmas chaves do seu arquivo `.env.local`:

1. `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (Chave pública do Clerk)
2. `CLERK_SECRET_KEY` (Chave secreta do Clerk)
3. `MONGODB_URI` (String de conexão do MongoDB Atlas)

> [!IMPORTANT]
> Certifique-se de liberar o IP da Vercel no MongoDB Atlas (permitindo acesso temporário de qualquer lugar `0.0.0.0/0` nas configurações de Network Access do Atlas) para que as conexões de API funcionem sem bloqueio em produção.

### Passo 4: Implantar e Executar Seed em Produção
1. Clique em **Deploy**. O Vercel fará a build automática do projeto em menos de 1 minuto.
2. Com o site no ar, acesse a rota de seed de produção uma única vez para preencher o banco Atlas de produção:
   ```
   https://seu-dominio-vercel.vercel.app/api/seed
   ```

---

## 📞 WhatsApp Checkout e Suporte

Os pedidos criados na loja são direcionados para o número oficial configurado:
- **Suporte / Checkout**: `+55 (71) 99206-5352`
- **Mensagem pré-formatada**: O cliente envia uma mensagem detalhando o número do pedido, lista de produtos e o endereço de entrega completo fornecido no formulário do carrinho.
