FROM node:16.16.0
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm ci
# node_modules installed
COPY . .
ADD "https://tradingtoolx.com/random.php" skipcache
RUN npm run build

