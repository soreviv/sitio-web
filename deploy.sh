#!/bin/bash

# ==============================================================================
# Script de Despliegue Automatizado
# ==============================================================================
# Propósito: Actualiza el sitio web en producción con los últimos cambios
#            del repositorio Git.
# Uso:       Ejecutar como root desde el servidor.
#            # /root/deploy.sh
# ==============================================================================

set -e # Salir inmediatamente si un comando falla

# --- Variables ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

REPO_DIR="/root/sitio-web"
WEB_ROOT="/var/www/otorrinonet.com"
WEB_USER="www-data"
BACKUP_DIR="/root/backups"

print_message() {
    echo -e "${2}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

print_message "🚀 Iniciando despliegue..." "$YELLOW"

# 1. Crear directorio de respaldos si no existe
mkdir -p "$BACKUP_DIR"

# 2. Asegurar que el directorio web exista y crear respaldo
print_message "🔎 Verificando que el directorio web $WEB_ROOT exista..." "$YELLOW"
mkdir -p "$WEB_ROOT"
chown "$WEB_USER":"$WEB_USER" "$WEB_ROOT"

BACKUP_FILE="$BACKUP_DIR/otorrinonet.com-$(date +%Y%m%d-%H%M%S).tar.gz"
print_message "📦 Creando respaldo del sitio actual en $BACKUP_FILE..." "$YELLOW"
tar -czf "$BACKUP_FILE" -C "$(dirname "$WEB_ROOT")" "$(basename "$WEB_ROOT")"

# 3. Navegar al directorio del repositorio
cd "$REPO_DIR" || { print_message "❌ Error: No se pudo encontrar el directorio del repositorio en $REPO_DIR." >&2; exit 1; }

# 4. Actualizar el código desde Git
print_message "📥 Descargando últimos cambios desde Git (rama main)..." "$YELLOW"
git checkout main
git pull origin main

# 5. Sincronizar archivos con el directorio web
# --delete: elimina archivos en el destino que ya no existen en el origen
print_message "🔄 Sincronizando archivos con el directorio web..." "$YELLOW"
rsync -av --delete \
      --exclude '.git*' \
      --exclude 'deploy.sh' \
      --exclude 'README.md' \
      --exclude 'docs/' \
      --exclude '.gitignore' \
      "$REPO_DIR/" "$WEB_ROOT/"

# 6. Establecer permisos correctos
print_message "🔒 Estableciendo permisos de archivos y directorios..." "$YELLOW"
chown -R "$WEB_USER":"$WEB_USER" "$WEB_ROOT"
find "$WEB_ROOT" -type d -exec chmod 755 {} \;
find "$WEB_ROOT" -type f -exec chmod 644 {} \;

# 7. Recargar PHP-FPM para limpiar caché de opcache
print_message "💨 Recargando PHP-FPM para aplicar cambios..." "$YELLOW"
systemctl reload php8.2-fpm

print_message "✅ ¡Despliegue completado con éxito!" "$GREEN"
print_message "ℹ️ Si necesitas revertir, el respaldo está en: $BACKUP_FILE" "$YELLOW"