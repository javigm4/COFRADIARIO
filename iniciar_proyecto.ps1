# Script para iniciar el entorno de desarrollo de COFRADIARIO

Write-Host "Verificando instalación de Docker..." -ForegroundColor Cyan

try {
    $dockerVersion = docker --version
    Write-Host "Docker detectado: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Docker no está instalado o no está en el PATH." -ForegroundColor Red
    Write-Host "Por favor, instala Docker Desktop para Windows desde: https://www.docker.com/products/docker-desktop/"
    Write-Host "Una vez instalado y ejecutandose, vuelve a correr este script."
    exit 1
}

Write-Host "Iniciando contenedores (Base de datos, Backend, Frontend)..." -ForegroundColor Cyan
Write-Host "La primera vez esto puede tardar unos minutos ya que descargará las imágenes y construirá el proyecto." -ForegroundColor Yellow

# Ejecutar docker-compose up
# Usamos 'try' para capturar si docker-compose no existe (aunque docker desktop suele incluirlo)
try {
    # Intentar con docker compose (v2) primero, fallback a docker-compose (v1)
    docker compose up -d --build
    if ($LASTEXITCODE -ne 0) { throw "Error en docker compose" }
} catch {
    Write-Host "Intentando con comando legacy 'docker-compose'..." -ForegroundColor Yellow
    docker-compose up -d --build
}

Write-Host "`nEntorno iniciado." -ForegroundColor Green
Write-Host "El backend ejecutará automáticamente las migraciones y seeders al iniciar." -ForegroundColor Cyan
Write-Host "Puedes ver los logs del backend para confirmar cuando termine con: docker compose logs -f backend"
