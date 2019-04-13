FROM node:10.15-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn run build

FROM builder
RUN yarn global add serve
WORKDIR /app
COPY --from=builder /app/dist .
CMD ["serve", "-p", "80", "-s", "."]

FROM nginx:1.15.2-alpine
COPY --from=builder ./dist /var/www
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80