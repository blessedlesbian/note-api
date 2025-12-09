README — Note API (CRUD + JWT + PostgreSQL)
📒 Note API — Sistema de Notas com Autenticação JWT

API REST desenvolvida em Node.js + Express, com autenticação via JWT, persistência em PostgreSQL, arquitetura em múltiplas camadas e implementação dos princípios SOLID.

Essa API permite que um usuário:

Crie conta

Faça login e gere token JWT

Crie, edite, busque e delete Notas

Gerencie Tags

Busque notas por tag, termo e usuário

Acesse rotas protegidas por autenticação

🛠️ Tecnologias Utilizadas

Node.js

Express.js

PostgreSQL + pg

JWT (jsonwebtoken)

bcrypt

dotenv

Nodemon

Arquitetura MVC + Services

Princípios SOLID

📌 Funcionalidades da API
🔐 Autenticação

Registro de usuário (POST /auth/register)

Login com geração de JWT (POST /auth/login)

Middleware para validação de token

🗒️ Notas (Notes)

Criar nota

Listar notas

Buscar notas por ID

Buscar notas por usuário

Buscar notas por termo

Atualizar notas

Deletar notas

Buscar últimas 5 notas recentes

🏷️ Tags

Criar tag

Listar tags

Atualizar tag

Deletar tag

Buscar notas por nome da tag

👤 Usuários

Criar usuário com senha criptografada

Buscar usuários

Validação por email

Verificação segura com bcrypt

🧱 Estrutura do Projeto
notes-api/
│── src/
│   ├── controller/
│   │   ├── auth.js
│   │   ├── notes.js
│   │   └── tags.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── notes.js
│   │   └── tags.js
│   │
│   ├── services/
│   │   └── db.service.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── config/
│   │   └── main.js
│   │
│   └── index.js
│
├── package.json
├── .env
└── README.md

🗄️ Banco de Dados — PostgreSQL
Tabela users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

Tabela notes
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(150),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Tabela tags
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150),
    user_id INTEGER REFERENCES users(id)
);

🔑 Autenticação JWT

Após o login, o usuário recebe um token como:

{
  "token": "eyJhbGc..."
}


Para acessar rotas protegidas:

Postman → Authorization → Bearer Token
Bearer <seu-token-aqui>


Ou no header manual:

Authorization: Bearer seuTokenJWT

📡 Endpoints da API
🔐 Auth
Método	Rota	Descrição
POST	/auth/register	Cria um usuário
POST	/auth/login	Retorna um JWT
🗒️ Notes
Método	Rota	Descrição
GET	/notes	Lista todas as notas
GET	/notes/:id	Busca nota por ID
POST	/notes	Cria nova nota
PUT	/notes/:id	Atualiza nota
DELETE	/notes/:id	Deleta nota
GET	/notes/user/:userId	Lista notas por usuário
GET	/notes/search/:term	Busca notas por termo
GET	/notes/recent	Mostra últimas 5 notas
🏷️ Tags
Método	Rota	Descrição
GET	/tags	Lista todas as tags
POST	/tags	Cria uma tag
PUT	/tags/:id	Atualiza tag
DELETE	/tags/:id	Deleta tag
GET	/tags/search/:name	Busca notas por nome da tag
🧪 Testando no Postman

Registrar usuário

Fazer login e copiar o token

Na aba Authorization, selecionar
Type: Bearer Token

Colar o token no campo

Usar rotas protegidas normalmente

🧩 Minha Contribuição no Projeto (o que você fez no código)

✔ Configuração completa do PostgreSQL + conexão com Node
✔ Estruturação da arquitetura em múltiplas camadas
✔ Criação do auth controller com bcrypt + jwt
✔ Implementação do middleware de autenticação
✔ Criação das funções no db.service.js
✔ Ajuste das rotas RESTfull (auth, notes, tags)
✔ Tratamento de erros com try/catch
✔ Organização dos controllers
✔ Adaptação de código antigo para persistência real (antes era JSON)
✔ Correção das queries SQL
✔ Criação da lógica de login com:

busca no banco

comparação de hash

retorno de token

validação

✔ Correção de problemas no Postman
✔ Correção de problemas de import/export (ESM)
✔ Suporte para criação de usuário e login
✔ Ajuste da modelagem
✔ Auxílio com GitHub, Git e push/pull

Ou seja, você construiu uma API completa, funcional e profissional.

🚀 Como rodar o projeto
1. Instalar dependências
npm install

2. Criar o arquivo .env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=notes
JWT_SECRET="chave_super_secreta"

3. Rodar o servidor
npm run dev


Servidor disponível em:

http://localhost:3000

📄 Licença

MIT License.
