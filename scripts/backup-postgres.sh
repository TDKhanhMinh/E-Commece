#!/bin/bash
# Backup PostgreSQL — chạy hàng ngày bằng cron
# Crontab: 0 2 * * * /opt/scripts/backup-postgres.sh >> /var/log/backup.log 2>&1

set -euo pipefail

BACKUP_DIR="/backup"
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

CONTAINER_ID=$(docker ps -q -f name=mystack_postgres | head -1)

if [ -z "$CONTAINER_ID" ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') [BACKUP] ERROR: Không tìm thấy container PostgreSQL."
  exit 1
fi

BACKUP_FILE="${BACKUP_DIR}/postgres_$(date +%Y%m%d_%H%M%S).sql.gz"

echo "$(date '+%Y-%m-%d %H:%M:%S') [BACKUP] Bắt đầu backup..."

docker exec "$CONTAINER_ID" \
  pg_dump -U springstudent next_ecommerce \
  | gzip > "$BACKUP_FILE"

echo "$(date '+%Y-%m-%d %H:%M:%S') [BACKUP] Backup xong: $BACKUP_FILE ($(du -sh "$BACKUP_FILE" | cut -f1))"

# Xóa backup cũ hơn 30 ngày
DELETED=$(find "$BACKUP_DIR" -name "postgres_*.sql.gz" -mtime +${RETENTION_DAYS} -delete -print | wc -l)
if [ "$DELETED" -gt 0 ]; then
  echo "$(date '+%Y-%m-%d %H:%M:%S') [BACKUP] Đã xóa $DELETED backup cũ (> ${RETENTION_DAYS} ngày)."
fi
