# Dr. Alejandro Viveros Domínguez - Otorrinolaringología

Sitio web profesional del Dr. Alejandro Viveros Domínguez, especialista en otorrinolaringología y cirugía de cabeza y cuello.

## Stack Tecnológico y Despliegue

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PHP
- **Servidor**: Stack LEMP (Linux, Nginx, MariaDB, PHP)
- **Seguridad**: Certificados SSL vía Certbot, cabeceras de seguridad HTTP.
- **Automatización**: Scripts de Bash para configuración inicial (`initial-server-setup.sh`) y despliegues (`deploy.sh`).

## Características

- Diseño responsive
- Banner de cookies
- Aviso de privacidad
- Integración con redes sociales
- Formulario de contacto
- Sistema de citas
- Protección de contenido
- Optimización SEO

## Política de Imágenes y Rendimiento

- Formato preferente: WebP con fallback JPG/PNG solo cuando es necesario (compatibilidad).
- Perfiles y fotos: Máx 1200px lado mayor; variantes WebP (400, 800, 1200) generadas con calidad ~80.
- Logo: WebP principal + PNG fallback.
- SVG para iconografía y placeholders (ligeros <1KB).
- Evitamos almacenar originales muy grandes en el repositorio (se hace backup local temporal y luego se elimina).
- Estrategia de carga: <picture> + loading="lazy" y dimensiones fijas para prevenir CLS.
- Posibles mejoras futuras: placeholders blur base64, preloading selectivo de LCP, cache-control largo en VPS.

## Manifest & PWA (Pendiente Básico)

Se añadirá `manifest.json` con nombre corto, iconos y tema para mejorar integración en dispositivos móviles.

## Despliegue

Este proyecto incluye scripts para automatizar la configuración y las actualizaciones del sitio.

### 1. Configuración Inicial del Servidor

El script `docs/initial-server-setup.sh` está diseñado para configurar un nuevo servidor Debian/Ubuntu desde cero. Instala y configura el stack LEMP, obtiene certificados SSL con Certbot y realiza el despliegue inicial.

**Uso (como administrador del servidor):**
1.  Clona este repositorio en el servidor.
2.  Revisa y ajusta las variables dentro del script si es necesario.
3.  Ejecuta el script: `bash docs/initial-server-setup.sh`

### 2. Actualización del Sitio Web

Para futuras actualizaciones, el script `deploy.sh` automatiza el proceso. Este script descarga los últimos cambios desde Git, sincroniza los archivos con el directorio web y aplica los permisos correctos.

**Uso:**
1.  Asegúrate de haber subido tus cambios al repositorio de Git (`git push`).
2.  Conéctate al servidor.
3.  Ejecuta el script de despliegue (ubicado en el directorio home del administrador durante la configuración inicial).

## Contacto

Dr. Alejandro Viveros Domínguez
- Email: contacto@otorrinonet.com
- Dirección: Buenavista 20, Col. Lindavista, 07300, Gustavo A Madero, Ciudad de México

## Licencia

Este proyecto está bajo una licencia propietaria. Ver el archivo [LICENSE](LICENSE) para más detalles.
