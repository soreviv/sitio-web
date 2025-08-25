## Comandos para ejecutar en el servidor (root@148.230.94.171)

# 1. Crear respaldo de la configuración actual
sudo cp /etc/nginx/sites-enabled/otorrinonet.com /etc/nginx/sites-enabled/otorrinonet.com.backup

# 2. Aplicar la nueva configuración
sudo cp /tmp/nginx-config-complete.conf /etc/nginx/sites-enabled/otorrinonet.com

# 3. Verificar configuración
sudo nginx -t

# 4. Si la configuración es válida, recargar Nginx
sudo systemctl reload nginx

# 5. Probar el sitio
echo "Probando HTTP (debe redirigir a HTTPS):"
curl -I http://otorrinonet.com

echo "Probando HTTPS:"
curl -I https://otorrinonet.com

echo "Probando en navegador: https://otorrinonet.com"
