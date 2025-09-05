#!/usr/bin/env bash
set -euo pipefail

# Script para aplicar cabeceras de seguridad y desplegar cambios desde el repo
# Uso en el VPS (ejecutar como root o con sudo):
# sudo bash deploy/apply-server-hardening.sh [SITE_DIR]

SITE_DIR="${1:-/var/www/otorrinonet.com}"
NGINX_SITES_AVAILABLE_DIR="/etc/nginx/sites-available"
SNIPPET_PATH="/etc/nginx/snippets/otorrinonet_security_headers.conf"
INCLUDE_DIRECTIVE="include snippets/otorrinonet_security_headers.conf;"
DOMAIN="otorrinonet.com"

echo "Sitio objetivo: $SITE_DIR"

# 1) Actualizar repo del sitio (si existe .git)
if [ -d "$SITE_DIR/.git" ]; then
  echo "Actualizando repo en $SITE_DIR"
  cd "$SITE_DIR"
  git fetch --all --prune
  git reset --hard origin/main
else
  echo "Advertencia: $SITE_DIR no parece ser un repo git. Saltando pull."
fi

# 2) Crear snippet de cabeceras (idempotente)
sudo mkdir -p "$(dirname "$SNIPPET_PATH")"
sudo tee "$SNIPPET_PATH" > /dev/null <<'EOF'
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Frame-Options DENY always;
add_header X-Content-Type-Options nosniff always;
add_header X-XSS-Protection "0" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Embedder-Policy "require-corp" always;
EOF
sudo chmod 644 "$SNIPPET_PATH"

# 3) Intentar incluir el snippet en el archivo de sitio que contenga el server_name
CONF_FILES=$(grep -Rl "server_name .*${DOMAIN}" "$NGINX_SITES_AVAILABLE_DIR" 2>/dev/null || true)
if [ -z "$CONF_FILES" ]; then
  echo "No se encontró archivo de sitio en $NGINX_SITES_AVAILABLE_DIR que contenga ${DOMAIN}."
  echo "Añade manualmente la línea: $INCLUDE_DIRECTIVE dentro del bloque server { ... } de tu config de nginx."
else
  for f in $CONF_FILES; do
    echo "Procesando $f"
    if ! grep -qF "$INCLUDE_DIRECTIVE" "$f"; then
      # Insertar el include justo después de la línea que contiene 'server {'
      sudo sed -i "/server {/a \    $INCLUDE_DIRECTIVE" "$f"
      echo "Incluido snippet en $f"
    else
      echo "Include ya presente en $f"
    fi
  done
fi

# 4) Añadir server_tokens off si no está presente en nginx.conf
if ! sudo grep -q "server_tokens off;" /etc/nginx/nginx.conf; then
  echo "Añadiendo server_tokens off; a /etc/nginx/nginx.conf"
  sudo sed -i '/http {/a \    server_tokens off;' /etc/nginx/nginx.conf || true
else
  echo "server_tokens off ya está presente"
fi

# 5) Probar y recargar nginx
echo "Probando configuración de nginx..."
sudo nginx -t

echo "Recargando nginx..."
sudo systemctl reload nginx

# 6) Reiniciar PHP-FPM 8.2
if systemctl list-units --type=service | grep -q "php8.2-fpm.service"; then
  echo "Reiniciando php8.2-fpm"
  sudo systemctl restart php8.2-fpm
else
  echo "Servicio php8.2-fpm no encontrado. Comprueba la versión instalada y reiníciala manualmente."
fi

echo "Hecho. Comprueba las cabeceras con:"
echo "curl -I -s https://${DOMAIN} | egrep -i 'content-security-policy|strict-transport-security|x-frame-options|x-content-type-options|referrer-policy|permissions-policy|cross-origin-opener-policy|cross-origin-embedder-policy|x-xss-protection|server'"
