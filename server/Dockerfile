FROM node:16
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install class-transformer
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]
