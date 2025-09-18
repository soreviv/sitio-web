#!/bin/bash

# ==============================================================================
# Script de Configuración Inicial del Servidor v2.0
# ==============================================================================
# Propósito: Automatiza la configuración de un nuevo servidor Debian/Ubuntu
#            para alojar el sitio web, incluyendo un sistema de despliegue robusto.
# Uso:       Ejecutar como root en un servidor limpio.
#            # bash initial-server-setup-v2.sh
# ==============================================================================

set -e

# --- Variables de Configuración (Ajusta si es necesario) ---
DOMAIN="otorrinonet.com"
EMAIL="contacto@otorrinonet.com"
REPO_URL="https://github.com/soreviv/sitio-web.git"
PHP_VERSION="8.2"

# --- Colores ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# --- Directorios Estandarizados ---
SOURCE_DIR="/opt/source/sitio-web"
DEPLOY_DIR="/opt/deploy"
BACKUP_DIR="/opt/backups/sitio-web"
WEB_ROOT="/var/www/$DOMAIN"

# --- Funciones ---
print_message() {
    echo -e "${2:-$YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# --- Inicio del Script ---
print_message "🚀 Iniciando configuración completa del servidor para $DOMAIN..."

# 1. Actualizar sistema
print_message "🔄 Actualizando paquetes del sistema..."
apt update && apt upgrade -y

# 2. Añadir repositorio de PHP
print_message "➕ Añadiendo repositorio de PHP (Ondřej Surý PPA)..."
apt install -y software-properties-common
add-apt-repository ppa:ondrej/php -y
apt update

# 3. Instalar dependencias (LEMP, Git, Certbot, etc.)
print_message "📦 Instalando dependencias (Nginx, MariaDB, PHP, Git, Certbot)..."
apt install -y nginx mariadb-server \
    "php${PHP_VERSION}-fpm" "php${PHP_VERSION}-mysql" "php${PHP_VERSION}-cli" "php${PHP_VERSION}-curl" \
    "php${PHP_VERSION}-gd" "php${PHP_VERSION}-mbstring" "php${PHP_VERSION}-xml" "php${PHP_VERSION}-zip" \
    git certbot python3-certbot-nginx unzip

# 4. Iniciar y habilitar servicios
print_message "▶️ Iniciando y habilitando servicios Nginx y MariaDB..."
systemctl start nginx && systemctl enable nginx
systemctl start mariadb && systemctl enable mariadb

# 5. Asegurar MariaDB de forma no interactiva
print_message "🔑 Asegurando la instalación de MariaDB..."
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)

mysql -u root <<EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '$MYSQL_ROOT_PASSWORD';
DELETE FROM mysql.global_priv WHERE User='' OR Host NOT IN ('localhost', '127.0.0.1', '::1');
DELETE FROM mysql.db WHERE Db='test' OR Db LIKE 'test%_';
FLUSH PRIVILEGES;
EOF

echo "# Contraseña generada automáticamente para el usuario root de MariaDB." > /root/mysql_credentials.txt
echo "MYSQL_ROOT_PASSWORD='$MYSQL_ROOT_PASSWORD'" >> /root/mysql_credentials.txt
chmod 600 /root/mysql_credentials.txt
print_message "Guardada nueva contraseña de root de MariaDB en /root/mysql_credentials.txt" "$GREEN"

# 6. Configurar Firewall
print_message "🔒 Configurando firewall (UFW)..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# 7. Crear estructura de directorios
print_message "📂 Creando estructura de directorios profesional..."
mkdir -p "$SOURCE_DIR"
mkdir -p "$DEPLOY_DIR"
mkdir -p "$BACKUP_DIR"
mkdir -p "$WEB_ROOT"

# 8. Clonar repositorio
print_message "📥 Clonando repositorio en $SOURCE_DIR..."
git clone "$REPO_URL" "$SOURCE_DIR"

# 9. Crear script de despliegue en /opt/deploy/deploy.sh
print_message "✍️ Creando script de despliegue en $DEPLOY_DIR/deploy.sh..."
cat > "$DEPLOY_DIR/deploy.sh" << 'EOF'
#!/bin/bash
set -eo pipefail
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ENV_FILE="$SCRIPT_DIR/.env"
if [ -f "$ENV_FILE" ]; then
    source "$ENV_FILE"
else
    echo "❌ Error: Archivo de configuración .env no encontrado en $SCRIPT_DIR." >&2
    exit 1
fi
: "${REPO_DIR:?Variable REPO_DIR no definida en .env}"
: "${WEB_ROOT:?Variable WEB_ROOT no definida en .env}"
: "${WEB_USER:?Variable WEB_USER no definida en .env}"
: "${BACKUP_DIR:?Variable BACKUP_DIR no definida en .env}"
: "${PHP_FPM_SERVICE:?Variable PHP_FPM_SERVICE no definida en .env}"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'
print_message() {
    echo -e "${2:-$YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}
print_message "🚀 Iniciando despliegue..."
mkdir -p "$BACKUP_DIR"
BACKUP_FILE="$BACKUP_DIR/$(basename "$WEB_ROOT")-$(date +%Y%m%d-%H%M%S).tar.gz"
print_message "📦 Creando respaldo del sitio actual en $BACKUP_FILE..."
tar -czf "$BACKUP_FILE" -C "$(dirname "$WEB_ROOT")" "$(basename "$WEB_ROOT")"
print_message "Navegando al directorio del repositorio en $REPO_DIR..."
cd "$REPO_DIR" || { print_message "❌ Error: No se pudo encontrar el directorio del repositorio en $REPO_DIR." >&2; exit 1; }
print_message "📥 Descargando últimos cambios desde Git (rama main)..."
git fetch origin main
git reset --hard origin/main
print_message "🔄 Sincronizando archivos con el directorio web..."
rsync -av --delete --checksum \
      --exclude ".git/" --exclude ".github/" --exclude "docs/" \
      --exclude "deploy/" --exclude "deploy*.sh" --exclude "README.md" \
      --exclude ".gitignore" --exclude ".env*" --exclude "LICENSE" \
      "$REPO_DIR/" "$WEB_ROOT/"
print_message "🔒 Estableciendo permisos de archivos y directorios..."
chown -R "$WEB_USER":"$WEB_USER" "$WEB_ROOT"
find "$WEB_ROOT" -type d -exec chmod 755 {} \;
find "$WEB_ROOT" -type f -exec chmod 644 {} \;
print_message "💨 Recargando PHP-FPM para aplicar cambios..."
if systemctl is-active --quiet "$PHP_FPM_SERVICE"; then
    systemctl reload "$PHP_FPM_SERVICE"
else
    print_message "⚠️ Advertencia: El servicio $PHP_FPM_SERVICE no está activo. Saltando recarga." "$YELLOW"
fi
print_message "✅ ¡Despliegue completado con éxito!" "$GREEN"
print_message "ℹ️ Si necesitas revertir, el respaldo está en: $BACKUP_FILE"
EOF

# 10. Crear archivo de configuración .env para el script de despliegue
print_message "✍️ Creando archivo de configuración .env en $DEPLOY_DIR/.env..."
cat > "$DEPLOY_DIR/.env" <<EOF
REPO_DIR="$SOURCE_DIR"
WEB_ROOT="$WEB_ROOT"
WEB_USER="www-data"
BACKUP_DIR="$BACKUP_DIR"
PHP_FPM_SERVICE="php${PHP_VERSION}-fpm"
EOF

# 11. Establecer permisos de los scripts de despliegue
print_message "🔒 Estableciendo permisos para los scripts de despliegue..."
chmod +x "$DEPLOY_DIR/deploy.sh"
chmod 600 "$DEPLOY_DIR/.env"
chown -R root:root "$DEPLOY_DIR"

# 12. Configurar Nginx
print_message "⚙️ Configurando Nginx para $DOMAIN..."
# Snippet de seguridad
cat > /etc/nginx/snippets/security-headers.conf <<EOF
server_tokens off;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header X-XSS-Protection "1; mode=block" always;
EOF

# Configuración del sitio
cat > "/etc/nginx/sites-available/$DOMAIN" <<EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root $WEB_ROOT;
    index index.php index.html index.htm;

    include snippets/security-headers.conf;

    client_max_body_size 16M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php${PHP_VERSION}-fpm.sock;
    }

    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
        expires 30d;
        add_header Cache-Control "public";
    }

    location ~ /\.ht {
        deny all;
    }
}
EOF

# 13. Activar sitio y recargar Nginx
print_message "🔗 Activando sitio y probando configuración de Nginx..."
ln -sf "/etc/nginx/sites-available/$DOMAIN" /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# 14. Ejecutar el primer despliegue
print_message "✨ Ejecutando el primer despliegue para poblar el directorio web..."
bash "$DEPLOY_DIR/deploy.sh"

# 15. Obtener certificado SSL con Certbot
print_message "🔐 Obteniendo certificado SSL para $DOMAIN..."
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "$EMAIL"

# 16. Ocultar versión de PHP
print_message "🙈 Ocultando la versión de PHP en las cabeceras HTTP..."
sed -i 's/expose_php = On/expose_php = Off/' "/etc/php/${PHP_VERSION}/fpm/php.ini"
systemctl restart "php${PHP_VERSION}-fpm"

# 17. Configurar renovación automática de SSL
print_message "🔄 Configurando renovación automática de SSL..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

print_message "✅ ¡Instalación y despliegue inicial completados!" "$GREEN"
print_message "El sitio está disponible en: https://$DOMAIN" "$GREEN"
print_message "Para futuros despliegues, conéctate al servidor y ejecuta: bash $DEPLOY_DIR/deploy.sh" "$YELLOW"
