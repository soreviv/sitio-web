#!/bin/bash

# ==============================================================================
# Script de Configuración Inicial del Servidor
# ==============================================================================
# Propósito: Automatiza la configuración de un nuevo servidor Debian/Ubuntu
#            para alojar el sitio web del Dr. Alejandro Viveros.
# Uso:       Ejecutar como root en un servidor limpio.
#            # bash initial-server-setup.sh
# ==============================================================================

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# --- Variables de Configuración ---
DOMAIN="otorrinonet.com"
EMAIL="contacto@otorrinonet.com"
REPO_URL="https://github.com/soreviv/sitio-web.git"  # ✅ Sin espacios

print_message() {
    echo -e "${2}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# 1. Actualizar sistema
print_message "🔄 Actualizando sistema..." "$YELLOW"
apt update && apt upgrade -y

# 2. Añadir repositorio de PHP
print_message "➕ Añadiendo repositorio de PHP (Ondřej Surý PPA)..." "$YELLOW"
apt install -y software-properties-common
add-apt-repository ppa:ondrej/php -y
apt update

# 3. Instalar LEMP Stack y Git
print_message "📦 Instalando dependencias (Nginx, MariaDB, PHP 8.2, Git)..." "$YELLOW"
apt install -y nginx mariadb-server php8.2-fpm php8.2-mysql php8.2-cli php8.2-curl php8.2-gd php8.2-mbstring php8.2-xml php8.2-zip git certbot python3-certbot-nginx

# Asegurar servicios
systemctl start nginx
systemctl enable nginx
systemctl start mariadb
systemctl enable mariadb

# 4. Asegurar MariaDB (compatible con MariaDB 10.6+)
print_message "🔑 Asegurando la instalación de MariaDB..." "$YELLOW"
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)

mysql -u root << EOF
ALTER USER 'root'@'localhost' IDENTIFIED BY '$MYSQL_ROOT_PASSWORD';
DELETE FROM mysql.global_priv WHERE User='' OR Host NOT IN ('localhost', '127.0.0.1', '::1');
DELETE FROM mysql.db WHERE Db='test' OR Db LIKE 'test\_%';
FLUSH PRIVILEGES;
EOF

echo "MYSQL_ROOT_PASSWORD='$MYSQL_ROOT_PASSWORD'" > /root/mysql_credentials.txt
chmod 600 /root/mysql_credentials.txt

# 5. Firewall
print_message "🔒 Configurando firewall (UFW)..." "$YELLOW"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# 6. Clonar repositorio como $DOMAIN
print_message "📥 Clonando repositorio en /root/$DOMAIN..." "$YELLOW"
cd /root
git clone "$REPO_URL" "$DOMAIN"

# 7. Configurar directorio web
print_message "🌐 Configurando directorio web en /var/www/$DOMAIN..." "$YELLOW"
mkdir -p "/var/www/$DOMAIN"
rsync -av --exclude='.git*' --exclude='deploy.sh' --exclude='README.md' --exclude='docs/' --exclude='.gitignore' "/root/$DOMAIN/" "/var/www/$DOMAIN/"
chown -R www-data:www-data "/var/www/$DOMAIN"  # ✅ Corregido
find "/var/www/$DOMAIN" -type f -exec chmod 644 {} \;
find "/var/www/$DOMAIN" -type d -exec chmod 755 {} \;

# 8. Configurar Nginx
print_message "⚙️ Configurando Nginx para $DOMAIN..." "$YELLOW"
cat > "/etc/nginx/sites-available/$DOMAIN" << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root /var/www/$DOMAIN;
    index index.php index.html index.htm;

    server_tokens off;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        try_files \$uri \$uri/ /index.php?\
query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.2-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }
}
EOF

# 9. Activar sitio
print_message "🔗 Activando sitio y recargando Nginx..." "$YELLOW"
ln -sf "/etc/nginx/sites-available/$DOMAIN" /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 10. SSL con Certbot
print_message "🔐 Obteniendo certificado SSL..." "$YELLOW"
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "$EMAIL"

# 11. Ocultar versión de PHP
print_message "🙈 Ocultando versión de PHP..." "$YELLOW"
sed -i 's/expose_php = On/expose_php = Off/' /etc/php/8.2/fpm/php.ini
systemctl restart php8.2-fpm

# 12. Copiar script de despliegue
print_message "📜 Configurando script de despliegue..." "$YELLOW"
if [ -f "/root/$DOMAIN/deploy.sh" ]; then
    cp "/root/$DOMAIN/deploy.sh" /root/deploy.sh
    chmod +x /root/deploy.sh
else
    print_message "⚠️  Advertencia: deploy.sh no encontrado en el repositorio" "$YELLOW"
fi

# 13. Renovación automática de SSL
print_message "🔄 Configurando renovación automática de SSL..." "$YELLOW"
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

print_message "✅ ¡Instalación completa! Sitio disponible en https://$DOMAIN" "$GREEN"
print_message "📝 Para futuros despliegues, usa: /root/deploy.sh" "$YELLOW"