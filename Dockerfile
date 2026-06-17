# Этап 1: Сборка
FROM node:18-alpine AS build
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
RUN npm install

# Копируем исходный код и собираем проект
COPY . .
RUN npm run build

# Этап 2: Раздача статики через Nginx
FROM nginx:stable-alpine

# Копируем результат сборки из папки dist первого этапа в директорию nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем кастомный конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
