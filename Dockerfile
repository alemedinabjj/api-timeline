FROM node:18

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PORT 3332

# Copy package.json and package-lock.json
COPY package*.json ./

# Installing dependencies
RUN npm install 

# Copying source files
COPY . .

# Instalando o Prisma globalmente
RUN npm install -g prisma



# Sua configuração de exposição e inicialização do aplicativo
EXPOSE 3336
CMD [ "npm", "run", "start" ]
