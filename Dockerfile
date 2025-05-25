# Use a imagem oficial do Node.js com a versão LTS
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de configuração do projeto
COPY package.json yarn.lock* package-lock.json* ./

# Instala as dependências do projeto (incluindo devDependencies para construção)
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Constrói a aplicação
RUN npm run build

# Remove as devDependencies após a construção
RUN npm prune --production

# Use uma imagem menor para a fase de produção
FROM node:20-alpine AS runner

WORKDIR /app

# Copia os arquivos necessários da fase de construção
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Expõe a porta que será usada (a mesma definida no seu package.json)
EXPOSE 18649

# Define a variável de ambiente para produção
ENV NODE_ENV production

# Comando para iniciar a aplicação
CMD ["npm", "start"]