#!/bin/bash

# Script de instalación completa para servidor Vultr
# Sitio web Dr. Alejandro Viveros - Otorrinolaringología

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Variables
DOMAIN="otorrinonet.com"
NEW_SERVER_IP="66.42.95.115"
EMAIL="contacto@otorrinonet.com"

print_message() {
    echo -e "${2}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# 1. Actualizar sistema
print_message "🔄 Actualizando sistema..." "$YELLOW"
apt update && apt upgrade -y

# 2. Instalar LEMP Stack
print_message "📦 Instalando LEMP Stack..." "$YELLOW"
apt install -y nginx mariadb-server php8.2-fpm php8.2-mysql php8.2-cli php8.2-curl php8.2-gd php8.2-mbstring php8.2-xml php8.2-zip

# 3. Configurar firewall
print_message "🔒 Configurando firewall..." "$YELLOW"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# 4. Instalar Certbot
print_message "🔐 Instalando Certbot..." "$YELLOW"
apt install -y certbot python3-certbot-nginx

# 5. Instalar Git
print_message "📁 Instalando Git..." "$YELLOW"
apt install -y git

# 6. Clonar repositorio
print_message "📥 Clonando repositorio..." "$YELLOW"
cd /root
git clone https://github.com/soreviv/sitio-web.git otorrinonet.com

# 7. Configurar directorio web
print_message "🌐 Configurando directorio web..." "$YELLOW"
mkdir -p /var/www/otorrinonet.com
rsync -av --exclude '.git*' --exclude 'deploy.sh' --exclude 'README.md' --exclude 'docs/' --exclude '.gitignore' /root/otorrinonet.com/ /var/www/otorrinonet.com/
chown -R www-data:www-data /var/www/otorrinonet.com
find /var/www/otorrinonet.com -type f -exec chmod 644 {} \;
find /var/www/otorrinonet.com -type d -exec chmod 755 {} \;

# 8. Configurar Nginx (temporal sin SSL)
print_message "⚙️ Configurando Nginx temporal..." "$YELLOW"
cat > /etc/nginx/sites-available/otorrinonet.com << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root /var/www/otorrinonet.com;
    index index.html index.htm;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~ /\.ht {
        deny all;
    }
}
EOF

# 9. Activar sitio y desactivar default
print_message "🔗 Activando sitio..." "$YELLOW"
ln -sf /etc/nginx/sites-available/otorrinonet.com /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 10. Obtener certificado SSL
print_message "🔐 Obteniendo certificado SSL..." "$YELLOW"
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email $EMAIL

# 11. Copiar script de despliegue
print_message "📜 Configurando script de despliegue..." "$YELLOW"
cp /root/otorrinonet.com/deploy.sh /root/
chmod +x /root/deploy.sh

# 12. Configurar renovación automática SSL
print_message "🔄 Configurando renovación automática SSL..." "$YELLOW"
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

print_message "✅ ¡Instalación completa! Sitio disponible en https://$DOMAIN" "$GREEN"
print_message "📝 Para futuros despliegues, usa: /root/deploy.sh" "$YELLOW"
