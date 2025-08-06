# RocketLog API

API para gerenciamento de entregas de encomendas.

## Pré-requisitos

- [Node.js](https://nodejs.org/en/) (v20.x ou superior)
- [Docker](https://www.docker.com/)

## Como rodar o projeto

1. **Clone o repositório:**

   ```bash
   git clone <url-do-repositorio>
   cd rocketlog
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure o banco de dados com Docker:**

   Na raiz do projeto, inicie o container do PostgreSQL:

   ```bash
   docker-compose up -d
   ```

4. **Configure as variáveis de ambiente:**

   Crie uma cópia do arquivo `.env-example` e renomeie para `.env`:

   ```bash
   cp .env-example .env
   ```

   O arquivo `.env` já vem com os valores padrão para o banco de dados Docker. Se você alterou as credenciais no `docker-compose.yml`, ajuste o `.env` de acordo.

5. **Rode as migrações do banco de dados:**

   ```bash
   npx prisma migrate dev
   ```

6. **Inicie a aplicação em modo de desenvolvimento:**

   ```bash
   npm run dev
   ```

   O servidor estará rodando em `http://localhost:3000`.

## Testes

Para rodar os testes, utilize o comando:

```bash
npm run test:dev
```
