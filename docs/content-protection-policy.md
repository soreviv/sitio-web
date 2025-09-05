Política de protección de contenido — sitio-web

Fecha: 2025-09-05

Propósito
- Documentar las reglas, responsabilidades y controles para proteger el contenido publicado en este proyecto y reducir riesgos legales, de seguridad y de privacidad.

Alcance
- Abarca todo contenido que se publique en el sitio web (páginas, formularios, archivos subidos por usuarios, comentarios, imágenes, PDFs) y los mecanismos técnicos que lo procesan.

Principios generales
- Cumplir la ley aplicable (legislación local sobre privacidad y propiedad intelectual). No publicar contenido ilegal.
- Minimizar la exposición: no almacenar secretos en el repo, usar variables de entorno y archivos de configuración fuera del control de versiones.
- Validar y sanear toda entrada del usuario antes de persistirla o mostrarla.

Contenido permitido y restringido
- Permitido: información clínica, información de contacto, material informativo de salud y marketing legítimo con consentimiento.
- Prohibido: contenido que promueva actividades ilegales, instrucciones para causar daño, material sexual explícito sin contexto médico, contenidos difamatorios, o contenido que infrinja derechos de autor sin permiso.

Manejo de uploads y archivos de usuario
- Validación: comprobar tipo MIME, extensión permitida y tamaño máximo.
- Almacenamiento: ubicar uploads fuera del árbol público o forzar descarga con cabeceras; evitar ejecución de código desde directorios de uploads.
- Sanear metadatos (por ejemplo, eliminar EXIF de imágenes si aplica).
- Escanear archivos si posible (virus/malware) antes de aceptar en producción.

Moderación y reporting
- Proveer un canal para reporte de contenido inapropiado (ej. email contacto@otorrinonet.com).
- Procedimiento: recibir reporte → evaluar en 24-72h → retirar contenido si vulnera políticas o la ley → notificar al reportante y, si aplica, al autor.

Derechos de autor y takedown
- Respetar copyright: requerir evidencia de autorización para materiales con copyright.
- Seguir proceso de notificación y retirada conforme normativa aplicable.

Privacidad y datos personales
- No recolectar más datos de los necesarios para la función (principio de minimización).
- Proteger datos en tránsito (TLS) y en reposo (acceso restringido a DB, backups cifrados en reposos externos preferible).
- Retención: definir plazos de retención razonables para datos personales (ej. 2 años) y procesos para eliminación.

Seguridad técnica y hardening
- Cabeceras HTTP recomendadas: Content-Security-Policy, X-Content-Type-Options: nosniff, X-Frame-Options: DENY, Referrer-Policy, Strict-Transport-Security.
- Saneamiento de output: escapar HTML, usar plantillas seguras y evitar incluir HTML sin sanitizar.
- Rate limiting y protección contra bots: usar mecanismos como hCaptcha (ya integrado para formularios) y, si procede, reglas en el WAF o fail2ban.
- Evitar exposición de información sensible en errores: configurar display_errors=Off en producción.

Registro, auditoría e incident response
- Registrar accesos y acciones críticas (creación/eliminación de contenido) con retención limitada.
- Tener un plan de respuesta a incidentes: detección, contención, erradicación, recuperación y lecciones aprendidas.

Backups y restauración
- Mantener backups regulares de archivos y BD (script `deploy/backup.sh` y variante no interactiva recomendada).
- Guardar copias offsite y rotarlas con política de retención.

Política técnica de Content Security Policy (CSP)
----------------------------------------------
Se recomienda implementar CSP para proteger contra XSS y carga de recursos no autorizados.

Ejemplo de cabecera CSP con nonce (generado por PHP en cada request):

	header("Content-Security-Policy: default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://js.hcaptcha.com https://hcaptcha.com 'nonce-<NONCE>'; connect-src 'self' https://www.google-analytics.com https://hcaptcha.com; img-src 'self' data: https://www.google-analytics.com; style-src 'self' 'unsafe-inline';");

En los scripts inline:

	<script nonce="<NONCE>">/* código inline */</script>

Pasos prácticos:
1. Generar un nonce por request en PHP (ejemplo: `$nonce = base64_encode(random_bytes(16));`).
2. Enviar la cabecera CSP con el nonce.
3. Añadir el atributo nonce a todos los scripts inline.
4. Permitir orígenes externos necesarios (gtag, hCaptcha, FullCalendar) en script-src.
5. Eliminar 'unsafe-inline' de script-src para máxima protección.
6. Probar en modo report-only y revisar violaciones en DevTools.

Ejemplo para Nginx en `docs/nginx-config-complete.conf`.

Responsabilidades del equipo
- Desarrolladores: no commitear secretos; seguir prácticas de validación y saneamiento; revisar PRs por riesgos de contenido.
- Administradores: gestionar env vars seguras, configurar FPM/systemd, mantener backups y supervisar alertas.
- Legal/Compliance: asesorar sobre contenido sensible o solicitudes de retirada.

Entradas en el proyecto (prácticas y controles concretos)
- No almacenar HCAPTCHA_SECRET ni otras claves en el repo; documentar en `docs/.env.example` (sin valores reales).
- Usar prepared statements (PDO) para persistencia — ya implementado en `procesar-formulario.php`.
- Habilitar y revisar logs de errores y correo para detectar fallos de procesamiento de formularios.

Implementación y checklist técnico (rápida)
- [ ] Validación y saneamiento en todos los endpoints que acepten datos (ya: `procesar-formulario.php`).
- [ ] hCaptcha activo en formularios públicos (ya integrado).
- [ ] Backups automáticos y offsite (recomendado: crear `deploy/backup-noninteractive.sh` y cron).
- [ ] Configurar cabeceras CSP y seguridad en Nginx (ver `docs/nginx-config-complete.conf`).
- [ ] No commitear credenciales ni secrets (añadir a `.gitignore` si aplica).

Contacto y reportes
- Reportes y preguntas sobre esta política: contacto@otorrinonet.com

Revisión
- Esta política debe revisarse al menos una vez al año o cuando se introduzcan nuevas funcionalidades que cambien el riesgo de contenido.

Fin del documento.
