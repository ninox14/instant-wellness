
FROM node:24

WORKDIR /app


COPY pnpm-lock.yaml ./pnpm-lock.yaml
COPY apps/front-end/package.json ./package.json



RUN npm install -g pnpm
RUN pnpm install


COPY . .


EXPOSE 3000

RUN pnpm build

CMD ["pnpm", "start"]

