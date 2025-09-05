Fecha: 2025-09-05

Contexto de reanudación:
- Archivo actualmente abierto en el editor: `.gitignore`.
- Últimas acciones confirmadas: backup de archivos creado en `/root/backups` en el VPS.
- Pendientes críticos: persistir HCAPTCHA_SECRET para PHP-FPM 8.2; reiniciar `php8.2-fpm` y `nginx`; verificar que PHP vea la variable; comprobar envío de emails y funcionamiento de la agenda en producción.

Estado actual resumido:
- Backup de archivos: disponible (ej. `otorrinonet.com_files_2025-09-02_140113.tar.gz`).
- DB dump: no confirmado (si se realizó, revisar `/root/backups`).
- HCAPTCHA secret: pendiente de persistir en servidor.

Punto para reanudar tras la siguiente interacción:
- Continuar aquí cuando finalice la siguiente interacción del usuario y me indique si quiere que implemente la opción A (añadir script no interactivo + crontab al repo) o la opción B (solo instrucciones para ejecutar en el VPS).

Instrucción rápida cuando reanudes:
- Si A: crear `deploy/backup-noninteractive.sh`, añadir ejemplo de `crontab` en `docs/backup.md` y commitear.
- Si B: ejecutar en el VPS los comandos ya provistos para persistir `HCAPTCHA_SECRET` y programar cron.

Notas de seguridad:
- No incluir secretos en el repositorio. Guardar `HCAPTCHA_SECRET` en `systemd` drop-in o `php-fpm` pool env y documentar en `docs/.env.example` (sin el valor real).

Recordatorio generado automáticamente por el asistente.
