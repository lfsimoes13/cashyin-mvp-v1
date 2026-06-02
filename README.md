# 🚀 CashYin — Integrated Frontend & Backend MVP

Este repositório consolidado contém a entrega integrada do **Frontend** (desenvolvido no Lovable com *TanStack Start*) e o **Backend Core API** (desenvolvido em *Node.js com Fastify e TypeScript*).

Ambos os projetos foram arquitetados e integrados para rodar de forma paralela e harmoniosa no mesmo ambiente local, com políticas de CORS flexíveis e comunicação de API já configurada e funcional.

---

## 📁 Estrutura do Monorrepósio

* 📁 **`cashin-frontend/`**: Interface administrativa do usuário (React, Vite, TanStack Router/Start).
* 📁 **`cashyin-core-api-main/`**: Core API de processamento financeiro PIX (Fastify, PostgreSQL, Redis, TypeScript).
* 📄 **`package.json` (Raiz)**: Orquestrador central de comandos para instalação e execução unificada.

---

## ⚡ Como Rodar Tudo com Apenas 1 Comando

Para facilitar ao máximo a execução e testes do projeto, criamos scripts centrais na raiz do repositório. Você não precisa navegar entre pastas ou abrir vários terminais.

### Passo 1: Instalar todas as dependências
Abra o terminal na raiz desta pasta e execute:
```bash
npm run install:all
```
> *Este comando instalará de forma inteligente todas as bibliotecas necessárias para o Frontend e para o Backend de uma única vez (usando pnpm internamente para o backend e npm para o frontend).*

### Passo 2: Iniciar ambos os servidores
Na raiz do projeto, execute:
```bash
npm run dev
```
> *Este comando iniciará o backend na porta **`3000`** e o frontend na porta **`5173`** simultaneamente na mesma janela do terminal, diferenciando os logs de cada um por cores.*

### Passo 3: Testar no Navegador
Abra o seu navegador em:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## 🛠️ Detalhes da Integração Realizada

### 1. Evitando Conflito de Portas de Rede
Por padrão, tanto o frontend quanto o backend tentavam subir na porta `3000`. Configuramos a porta do frontend de forma fixa para **`5173`** (padrão Vite), permitindo a coexistência pacífica de ambos localmente.

### 2. Autenticação e Bypass de Desenvolvimento (Auth 100% Funcional)
O backend protege todas as rotas financeiras `/v1/*` exigindo um cabeçalho `Authorization: Bearer <API_KEY>`. 

Para garantir que você consiga **testar a integração da API imediatamente** sem precisar configurar conexões complexas de banco de dados ou criar chaves de acesso no PostgreSQL de imediato, criamos uma **chave de bypass para desenvolvimento local**:
* **Chave de Desenvolvimento:** `ck_demo_key_1234567890123456789012345678901234567890123456789012345678901234`
* Esta chave está configurada no `.env` do frontend. Quando o backend roda em modo `development`, ele a aceita de forma nativa e simula a sessão do cliente demo (`00000000-0000-0000-0000-000000000001`).

### 3. Conexão Real no Dashboard
A página inicial do frontend (`/`) já está conectada de verdade ao backend!
* Ela consome a Server Function `getClientBalance` (em `src/lib/api/example.functions.ts`), que faz a chamada autenticada para `GET http://localhost:3000/v1/balance`.
* O card **"Saldo Disponível"** na Dashboard exibe o saldo real retornado pela API.
* **Segurança contra falhas:** Se o backend estiver desligado, o frontend exibe `R$ 0,00` de forma graciosa sem quebrar a tela.

### 4. Política de CORS Dinâmica
Configuramos o backend com suporte à variável de ambiente `CORS_ORIGINS`.
* **Local:** Autoriza automaticamente requisições vindas do localhost do frontend.
* **Produção:** Ao realizar o deploy da API (ex: na Railway ou Render), basta configurar a variável de ambiente `CORS_ORIGINS` com a URL pública do seu frontend (ex: `https://seu-front.netlify.app`) para manter tudo seguro e integrado.
