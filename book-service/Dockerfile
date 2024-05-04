FROM node:20.12.2 
#FROM node:18.16.0-alpine3.17
RUN mkdir -p /opt/app
WORKDIR /opt/app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8083
CMD ["npm", "run", "dev"]