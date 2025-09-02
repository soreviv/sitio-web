#!/usr/bin/env bash
set -euo pipefail

# Backup script
# Usage: sudo ./deploy/backup.sh [SITE_DIR]
# Default SITE_DIR: /var/www/otorrinonet.com

SITE_DIR="${1:-/var/www/otorrinonet.com}"
BACKUP_DIR="/root/backups"
mkdir -p "$BACKUP_DIR"

if [ ! -d "$SITE_DIR" ]; then
  echo "ERROR: sitio no encontrado en: $SITE_DIR"
  exit 1
fi

BASE_NAME=$(basename "$SITE_DIR")
TS=$(date +%F_%H%M%S)
TARFILE="$BACKUP_DIR/${BASE_NAME}_files_${TS}.tar.gz"

echo "Creando backup de archivos: $TARFILE"
sudo tar -C "$(dirname "$SITE_DIR")" -czf "$TARFILE" "$BASE_NAME"
echo "Backup de archivos completado: $TARFILE"

read -r -p "¿Deseas volcar la base de datos también? (y/N): " DUMP_DB
if [[ "$DUMP_DB" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  read -r -p "Tipo de BD (postgres/mysql): " DB_TYPE
  DB_TYPE=$(echo "$DB_TYPE" | tr '[:upper:]' '[:lower:]')
  read -r -p "Host (default: localhost): " DB_HOST
  DB_HOST=${DB_HOST:-localhost}
  if [ "$DB_TYPE" = "postgres" ] || [ "$DB_TYPE" = "pgsql" ]; then
    read -r -p "Puerto (default: 5432): " DB_PORT
    DB_PORT=${DB_PORT:-5432}
    read -r -p "Usuario: " DB_USER
    read -r -s -p "Password: " DB_PASS
    echo
    read -r -p "Nombre de la base de datos: " DB_NAME

    DUMPFILE="$BACKUP_DIR/${BASE_NAME}_db_${TS}.dump"
    echo "Realizando pg_dump en: $DUMPFILE"
    PGPASSWORD="$DB_PASS" pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -Fc -f "$DUMPFILE" "$DB_NAME"
    echo "Dump de Postgres creado: $DUMPFILE"

  elif [ "$DB_TYPE" = "mysql" ] || [ "$DB_TYPE" = "mariadb" ]; then
    read -r -p "Puerto (default: 3306): " DB_PORT
    DB_PORT=${DB_PORT:-3306}
    read -r -p "Usuario: " DB_USER
    read -r -s -p "Password: " DB_PASS
    echo
    read -r -p "Nombre de la base de datos: " DB_NAME

    DUMPFILE="$BACKUP_DIR/${BASE_NAME}_db_${TS}.sql"
    echo "Realizando mysqldump en: $DUMPFILE"
    mysqldump -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" > "$DUMPFILE"
    echo "Dump de MySQL creado: $DUMPFILE"

  else
    echo "Tipo de BD no reconocido: $DB_TYPE. Saltando dump." 
  fi
fi

echo "Backups en $BACKUP_DIR:"
ls -lh "$BACKUP_DIR" | sed -n '1,200p'

echo "Hecho. Asegúrate de mover los backups a un almacenamiento seguro fuera del VPS si es producción."
