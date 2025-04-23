# frontend-louis/Dockerfile

# Estágio de Build
FROM node:18-alpine as builder

WORKDIR /app

# Copia os arquivos de dependência
COPY package.json package-lock.json* ./

# Instala as dependências
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Constrói a aplicação web estática
# O comando 'build:web' no package.json é 'expo export --platform web'
# Expo exporta para a pasta 'dist' por padrão
RUN npm run build:web

# Estágio Final
FROM nginx:stable-alpine

# Copia a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos construídos do estágio anterior
# Expo exporta para 'dist' por padrão. Verifique se é o caso.
COPY --from=builder /app/dist /usr/share/nginx/html

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o Nginx em primeiro plano
CMD ["nginx", "-g", "daemon off;"]