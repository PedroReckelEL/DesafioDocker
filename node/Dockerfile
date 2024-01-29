FROM node:latest

# Crie e defina o diretório de trabalho no contêiner
WORKDIR /var/www

# Copie os arquivos do projeto para o contêiner
COPY . .

# Instalar o dockerize
RUN apt-get update && apt-get install -y wget

RUN wget https://github.com/jwilder/dockerize/releases/download/v0.6.1/dockerize-linux-amd64-v0.6.1.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz \
    && rm dockerize-linux-amd64-v0.6.1.tar.gz

# Expondo a porta 5001
EXPOSE 5001

# Rode o comando node index.js para rodar o projeto
CMD ["node", "index.js"]