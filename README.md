🛍️ Site de Vendas

Este é um projeto de site de vendas completo, com frontend (interface do usuário) e backend (servidor e banco de dados). O objetivo é permitir cadastro, login e gerenciamento de produtos com autenticação JWT.

🚀 Tecnologias Utilizadas 🖥️ Frontend Tecnologia React.js Cria as telas e componentes da aplicação. Vite Inicializa e roda o projeto React. LocalStorage Guarda o token JWT. Salva o login do usuário no navegador.

⚙️ Backend Tecnologia

Node.js Roda o código do servidor. Express.js Cria e gerencia a API. JWT (JSON Web Token) Faz a autenticação. bcrypt Criptografa senhas. CORS Permite a comunicação entre sites diferentes. dotenv Lê variáveis do arquivo .env. Guarda senhas e configs fora do código. Swagger UI Documenta a API. Mostra e testa os endpoints direto no navegador.

🗄️ Banco de Dados Tecnologia SQLite3 Armazena os dados. Banco leve e fácil de usar, sem servidor.

🔐 Autenticação

JWT + Middleware → O backend gera um token no login e o middleware valida nas rotas privadas.

Bearer Token → O token é enviado no header para acessar as rotas protegidas.

📁 SITEVENDAS/ │ ├── 📁 .github/workflows/ │ └── deploy.yml
│ ├── 📁 .vscode/ │ └── settings.json │ ├── 📁 backend/ │ ├── 📁 data/ │ ├── 📁 src/
│ ├── .env
│ ├── package-lock.json
│ ├── package.json
│ ├── tsconfig.json
│ ├── 📁 img/ │ │ ├── carrinho.html
├── checkout.html
├── index.html
├── login.html
├── styles.css
│ └── settings.json

⚡ Como Rodar 1️⃣ Backend cd backend npm install npm start

2️⃣ Frontend cd frontend npm install npm run dev

API: 👉 http://localhost:3001

📚 Swagger

Documentação da API: 👉 http://localhost:3001/api/docs/#/
