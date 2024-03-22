FROM docker.io/oven/bun:latest as build
WORKDIR /app

COPY ./package.json /app/
COPY . /app

ENV NODE_ENV="production"

RUN bun install
RUN bun run build

# stage 2 - build the final image and copy the react build files
FROM nginx
COPY --from=build /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]