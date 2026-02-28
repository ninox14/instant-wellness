FROM node:24

WORKDIR /app

COPY pnpm-lock.yaml ./pnpm-lock.yaml
COPY apps/back-end/package.json ./package.json


RUN npm install -g pnpm
RUN pnpm install

COPY . .

EXPOSE 5000

CMD ["pnpm", "start"]
