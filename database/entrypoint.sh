#!/usr/bin/env bash
set -Eeuo pipefail

/opt/mssql/bin/sqlservr &
sqlserver_pid=$!

sqlcmd_path="/opt/mssql-tools18/bin/sqlcmd"
if [[ ! -x "$sqlcmd_path" ]]; then
  sqlcmd_path="/opt/mssql-tools/bin/sqlcmd"
fi

database_name="${DB_NAME:-holakids}"

for attempt in {1..60}; do
  if "$sqlcmd_path" \
    -S localhost \
    -U sa \
    -P "$MSSQL_SA_PASSWORD" \
    -C \
    -Q "SELECT 1" > /dev/null 2>&1; then
    break
  fi

  if [[ "$attempt" -eq 60 ]]; then
    echo "SQL Server n'est pas devenu disponible dans le délai prévu." >&2
    exit 1
  fi

  sleep 2
done

escaped_database_name="${database_name//\]/\]\]}"
"$sqlcmd_path" \
  -S localhost \
  -U sa \
  -P "$MSSQL_SA_PASSWORD" \
  -C \
  -Q "IF DB_ID(N'$database_name') IS NULL EXEC(N'CREATE DATABASE [$escaped_database_name]');"

wait "$sqlserver_pid"

