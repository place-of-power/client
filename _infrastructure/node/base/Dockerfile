# Определяем переменную NODE_VERSION (по умолчанию 20)
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

# Настройка пользователя (совместимость с хостом)
ARG PUID=1000
ARG PGID=1000
RUN apk add --no-cache shadow bash \
    && groupmod -g ${PGID} node \
    && usermod -u ${PUID} -g node -l app -m -d /home/app node \
    && usermod -p "*" app -s /bin/bash \
    && groupmod -n app node

# Рабочая директория
WORKDIR /var/www/app

# Создаем необходимые директории и настраиваем права
RUN mkdir -p /var/www/app/node_modules && \
    chmod -R 0775 /var/www/app && \
    chown -R app:app /var/www/app

# Переключаемся на пользователя app
USER app