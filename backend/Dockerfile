FROM node:20-alpine

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install --omit=dev

# Copia código
COPY . .

# Exposição da porta da API
EXPOSE 3001

# Comando de inicialização
CMD ["node", "server.js"]


