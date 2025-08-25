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
# ¡Asegúrate de que estos valores son correctos!
DOMAIN="otorrinonet.com"
EMAIL="contacto@otorrinonet.com"
REPO_URL="https://github.com/soreviv/sitio-web.git"

print_message() {
    echo -e "${2}[$(date '+%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# 1. Actualizar sistema
print_message "🔄 Actualizando sistema..." "$YELLOW"
apt update && apt upgrade -y

# 2. Instalar LEMP Stack y Git
print_message "📦 Instalando dependencias (Nginx, MariaDB, PHP, Git)..." "$YELLOW"
apt install -y nginx mariadb-server php8.2-fpm php8.2-mysql php8.2-cli php8.2-curl php8.2-gd php8.2-mbstring php8.2-xml php8.2-zip git certbot python3-certbot-nginx

# 3. Asegurar MariaDB (de forma no interactiva)
print_message "🔑 Asegurando la instalación de MariaDB..." "$YELLOW"
# Genera una contraseña segura y la guarda en un archivo restringido.
MYSQL_ROOT_PASSWORD=$(openssl rand -base64 32)
mysql -e "UPDATE mysql.user SET Password = PASSWORD('$MYSQL_ROOT_PASSWORD') WHERE User = 'root';"
mysql -e "DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');"
mysql -e "DELETE FROM mysql.user WHERE User='';"
mysql -e "DELETE FROM mysql.db WHERE Db='test' OR Db='test\\_%';"
mysql -e "FLUSH PRIVILEGES;"
echo "La contraseña de root para MariaDB se ha guardado en /root/mysql_credentials.txt"
echo "MYSQL_ROOT_PASSWORD='$MYSQL_ROOT_PASSWORD'" > /root/mysql_credentials.txt
chmod 600 /root/mysql_credentials.txt

# 4. Configurar firewall
print_message "🔒 Configurando firewall (UFW)..." "$YELLOW"
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# 5. Clonar repositorio del sitio web
print_message "📥 Clonando repositorio desde $REPO_URL..." "$YELLOW"
cd /root
git clone "$REPO_URL" "$DOMAIN"

# 6. Configurar directorio web
print_message "🌐 Configurando directorio web en /var/www/$DOMAIN..." "$YELLOW"
mkdir -p "/var/www/$DOMAIN"
rsync -av --exclude '.git*' --exclude 'deploy.sh' --exclude 'README.md' --exclude 'docs/' --exclude '.gitignore' "/root/$DOMAIN/" "/var/www/$DOMAIN/"
chown -R www-data:www-data "/var/www/$DOMAIN"
find "/var/www/$DOMAIN" -type f -exec chmod 644 {} \;
find "/var/www/$DOMAIN" -type d -exec chmod 755 {} \;

# 7. Configurar Nginx (con cabeceras de seguridad)
print_message "⚙️ Configurando Nginx para $DOMAIN..." "$YELLOW"
cat > "/etc/nginx/sites-available/$DOMAIN" << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    root /var/www/$DOMAIN;
    index index.php index.html index.htm;

    # Ocultar versión de Nginx
    server_tokens off;

    # Cabeceras de seguridad
    # Certbot añadirá la cabecera HSTS automáticamente durante la configuración de SSL
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
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

# 8. Activar sitio y recargar Nginx
print_message "🔗 Activando sitio y recargando Nginx..." "$YELLOW"
ln -sf "/etc/nginx/sites-available/$DOMAIN" /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 9. Obtener certificado SSL con Certbot
print_message "🔐 Obteniendo certificado SSL para $DOMAIN..." "$YELLOW"
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "$EMAIL"

# 10. Ocultar versión de PHP
print_message "🙈 Ocultando la versión de PHP..." "$YELLOW"
sed -i 's/expose_php = On/expose_php = Off/' /etc/php/8.2/fpm/php.ini
systemctl restart php8.2-fpm

# 11. Copiar y preparar script de despliegue
print_message "📜 Configurando script de despliegue en /root/deploy.sh..." "$YELLOW"
cp "/root/$DOMAIN/deploy.sh" /root/
chmod +x /root/deploy.sh

# 12. Configurar renovación automática de SSL
print_message "🔄 Configurando renovación automática de SSL..." "$YELLOW"
echo "0 12 * * * /usr/bin/certbot renew --quiet" | crontab -

print_message "✅ ¡Instalación completa! Sitio disponible en https://$DOMAIN" "$GREEN"
print_message "📝 Para futuros despliegues, usa el comando: /root/deploy.sh" "$YELLOW"