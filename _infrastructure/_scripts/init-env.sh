#!/bin/bash

set -e

# Функция для инициализации .env в директории _infrastructure
init_infrastructure_env() {
    local env_file=".env"
    local template_file=".env.development"

    if [[ -f "$env_file" ]]; then
        return 0
    fi

    if [[ ! -f "$template_file" ]]; then
        echo "Ошибка: .env.development не найден"
        return 1
    fi

    cp "$template_file" "$env_file"
}

# Функция для инициализации .env в корневой директории
init_root_env() {
    local env_file="../.env"
    local template_file="../.env.example"

    if [[ -f "$env_file" ]] || [[ ! -f "$template_file" ]]; then
        return 0
    fi

    cp "$template_file" "$env_file"
}

main() {
    init_infrastructure_env
    init_root_env
}

main