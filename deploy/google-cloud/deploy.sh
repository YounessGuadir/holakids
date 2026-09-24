#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
project_root="$(cd "$script_dir/../.." && pwd)"

read -r -p "Google Cloud Project ID: " google_project_id
read -r -p "Supabase Session Pooler host: " db_host
read -r -p "Supabase database username (postgres.PROJECT_REF): " db_username
read -r -s -p "Supabase database password: " db_password
printf '\n'
read -r -s -p "HOLAKIDS admin password: " admin_password
printf '\n'

if [[ -z "$google_project_id" || -z "$db_host" || -z "$db_username" || -z "$db_password" || -z "$admin_password" ]]; then
  echo "Tous les champs sont obligatoires."
  exit 1
fi

yaml_quote() {
  local escaped=${1//\'/\'\'}
  printf "'%s'" "$escaped"
}

jwt_secret="$(openssl rand -base64 48 | tr -d '\n')"
client_password="$(openssl rand -base64 24 | tr -d '\n')"
env_file="$(mktemp)"
trap 'rm -f "$env_file"' EXIT

{
  printf 'DB_URL: %s\n' "$(yaml_quote "jdbc:postgresql://${db_host}:5432/postgres?sslmode=require")"
  printf 'DB_USERNAME: %s\n' "$(yaml_quote "$db_username")"
  printf 'DB_PASSWORD: %s\n' "$(yaml_quote "$db_password")"
  printf "DB_POOL_MAX_SIZE: '5'\n"
  printf "DB_POOL_MIN_IDLE: '0'\n"
  printf "DDL_AUTO: 'update'\n"
  printf "CORS_ALLOWED_ORIGINS: 'https://younessguadir.github.io'\n"
  printf 'JWT_SECRET: %s\n' "$(yaml_quote "$jwt_secret")"
  printf "JWT_EXPIRATION_MS: '86400000'\n"
  printf "SEED_ENABLED: 'true'\n"
  printf "DATASET_PATH: 'datasets/products.json'\n"
  printf "ADMIN_EMAIL: 'AbdelatifMada@gmail.com'\n"
  printf 'ADMIN_PASSWORD: %s\n' "$(yaml_quote "$admin_password")"
  printf "CLIENT_EMAIL: 'client@holakids.ma'\n"
  printf 'CLIENT_PASSWORD: %s\n' "$(yaml_quote "$client_password")"
  printf "UPLOAD_DIRECTORY: '/tmp/holakids-uploads'\n"
} > "$env_file"

gcloud config set project "$google_project_id"
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

gcloud run deploy holakids-api \
  --source "$project_root/backend" \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1 \
  --min 0 \
  --max 1 \
  --concurrency 40 \
  --timeout 300 \
  --env-vars-file "$env_file"

service_url="$(gcloud run services describe holakids-api --region europe-west1 --format='value(status.url)')"
echo
echo "Backend deploye: ${service_url}"
echo "Health: ${service_url}/api/v1/health"
echo "Swagger: ${service_url}/swagger-ui/index.html"
echo "GitHub variable VITE_API_URL: ${service_url}/api/v1"
