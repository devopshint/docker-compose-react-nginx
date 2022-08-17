FROM node:alpine as devnode
WORKDIR /backend
COPY ./package.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]