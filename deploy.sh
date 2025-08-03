#!/bin/bash

# Colores para los mensajes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuración
REPO_PATH="/root/otorrinonet.com"
DEPLOY_PATH="/var/www/otorrinonet.com"
BACKUP_PATH="/root/backups/otorrinonet"
DATE=$(date +%Y%m%d_%H%M%S)
BRANCH="main"
DOMAIN="66.42.95.115"  # Cambiar por otorrinonet.com cuando el dominio esté configurado

# Función para imprimir mensajes
print_message() {
    echo -e "${2}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Función para crear respaldo
create_backup() {
    print_message "Creando respaldo..." "$YELLOW"
    if [ ! -d "$BACKUP_PATH" ]; then
        mkdir -p "$BACKUP_PATH"
    fi
    tar -czf "$BACKUP_PATH/backup_$DATE.tar.gz" -C "$DEPLOY_PATH" .
    if [ $? -eq 0 ]; then
        print_message "Respaldo creado exitosamente" "$GREEN"
    else
        print_message "Error al crear el respaldo" "$RED"
        exit 1
    fi
}

# Función para verificar sintaxis de PHP
check_php_syntax() {
    print_message "Verificando sintaxis de PHP..." "$YELLOW"
    find "$REPO_PATH" -name "*.php" -exec php -l {} \; | grep -v "No syntax errors"
    if [ $? -eq 0 ]; then
        print_message "Sintaxis PHP verificada" "$GREEN"
    else
        print_message "Error en la sintaxis PHP" "$RED"
        exit 1
    fi
}

# Función para verificar configuración de nginx
check_nginx_config() {
    print_message "Verificando configuración de nginx..." "$YELLOW"
    sudo nginx -t
    if [ $? -eq 0 ]; then
        print_message "Configuración de nginx correcta" "$GREEN"
    else
        print_message "Error en la configuración de nginx" "$RED"
        exit 1
    fi
}

# Inicio del despliegue
print_message "Iniciando despliegue..." "$YELLOW"

# Crear respaldo
create_backup

# Actualizar código desde el repositorio
cd "$REPO_PATH"
print_message "Actualizando código desde git..." "$YELLOW"
git fetch origin
git reset --hard "origin/$BRANCH"

# Verificar sintaxis y configuración
check_php_syntax
check_nginx_config

# Sincronizar archivos
print_message "Sincronizando archivos..." "$YELLOW"
rsync -av --delete --exclude '.git*' --exclude 'deploy.sh' --exclude 'README.md' \
    "$REPO_PATH/" "$DEPLOY_PATH/"

# Establecer permisos
print_message "Estableciendo permisos..." "$YELLOW"
sudo chown -R www-data:www-data "$DEPLOY_PATH"
sudo find "$DEPLOY_PATH" -type f -exec chmod 644 {} \;
sudo find "$DEPLOY_PATH" -type d -exec chmod 755 {} \;

# Limpiar caché
print_message "Limpiando caché..." "$YELLOW"
sudo systemctl reload nginx
sudo systemctl reload php8.2-fpm

# Verificar el sitio
print_message "Verificando el sitio..." "$YELLOW"
HTTP_RESPONSE=$(curl -sL -w "%{http_code}" "http://$DOMAIN" -o /dev/null)
if [ "$HTTP_RESPONSE" == "200" ]; then
    print_message "Sitio funcionando correctamente" "$GREEN"
else
    print_message "Error: El sitio no responde correctamente (HTTP $HTTP_RESPONSE)" "$RED"
    print_message "Iniciando rollback..." "$RED"
    tar -xzf "$BACKUP_PATH/backup_$DATE.tar.gz" -C "$DEPLOY_PATH"
    sudo systemctl reload nginx
    sudo systemctl reload php8.2-fpm
    print_message "Rollback completado" "$YELLOW"
    exit 1
fi

print_message "¡Despliegue completado exitosamente!" "$GREEN"
