#!/bin/sh
set -e

if [ -n "${DATABASE_URL}" ]; then
  echo "⏳ Esperando a la base de datos..."
  # Extrae host/puerto de DATABASE_URL si es posible; si no, intenta con valores por defecto
  DB_HOST=$(echo "$DATABASE_URL" | sed -n 's#.*@\([^:/]*\).*#\1#p')
  DB_PORT=$(echo "$DATABASE_URL" | sed -n 's#.*:\([0-9][0-9]*\)/.*#\1#p')
  if [ -z "$DB_HOST" ]; then DB_HOST="db"; fi
  if [ -z "$DB_PORT" ]; then DB_PORT="5432"; fi

  # Espera activa a Postgres
  for i in $(seq 1 60); do
    if pg_isready -h "$DB_HOST" -p "$DB_PORT" >/dev/null 2>&1; then
      echo "✅ Base de datos lista"
      break
    fi
    if [ "$i" -eq 60 ]; then
      echo "❌ Timeout esperando a Postgres (${DB_HOST}:${DB_PORT})"
      exit 1
    fi
    sleep 2
  done

  echo "⏳ Aplicando esquema/migraciones Prisma..."
  if [ -d "prisma/migrations" ] && [ "$(ls -A prisma/migrations 2>/dev/null)" ]; then
    npx prisma migrate deploy
  else
    # Para el proyecto actual (sin carpeta migrations) esto permite desplegar.
    # Recomendado: generar migraciones en desarrollo y usar migrate deploy en producción.
    npx prisma db push
  fi

  if [ "${PRISMA_SEED:-false}" = "true" ]; then
    echo "🌱 Ejecutando seed..."
    node prisma/seed.js
  fi
fi

exec "$@"
