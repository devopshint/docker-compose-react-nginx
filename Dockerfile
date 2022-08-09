FROM node:16.16.0 as ui
WORKDIR /app
COPY ./ui/package.json .
RUN npm install
COPY ./ui/ .

FROM node:16.16.0 as admin
WORKDIR /admin
COPY ./admin/package.json .
RUN npm install
COPY ./admin/ .

FROM ui as ui1
WORKDIR /app
RUN npm run build

FROM admin as admin1
WORKDIR /admin
RUN npm run build


FROM nginx
EXPOSE 3000 5001
COPY ./nginx/prod.conf /etc/nginx/conf.d/default.conf
COPY --from=ui1 /app/build /usr/share/nginx/html 
COPY --from=admin1 /admin/build /usr/share/nginx/admin 