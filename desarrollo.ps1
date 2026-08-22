# Script para habilitar comandos de desarrollo (php, artisan, ng, npm) usando Docker
# Ejecuta este script con: . ./desarrollo.ps1

function artisan { 
    Write-Host "Ejecutando artisan en Docker..." -ForegroundColor DarkGray
    docker compose exec backend php artisan $args 
}

function php { 
    Write-Host "Ejecutando php en Docker..." -ForegroundColor DarkGray
    docker compose exec backend php $args 
}

function composer { 
    Write-Host "Ejecutando composer en Docker..." -ForegroundColor DarkGray
    docker compose exec backend composer $args 
}

function npm { 
    Write-Host "Ejecutando npm en Docker..." -ForegroundColor DarkGray
    docker compose exec frontend npm $args 
}

function ng { 
    Write-Host "Ejecutando ng en Docker..." -ForegroundColor DarkGray
    docker compose exec frontend ng $args 
}

Write-Host "---------------------------------------------------------" -ForegroundColor Cyan
Write-Host "¡Entorno de desarrollo configurado!" -ForegroundColor Green
Write-Host "Ahora puedes usar los siguientes comandos directamente:" -ForegroundColor White
Write-Host "  artisan <comando>  (ej: artisan migrate, artisan db:seed)"
Write-Host "  php <comando>"
Write-Host "  ng <comando>       (ej: ng g c nombre-componente)"
Write-Host "  npm <comando>      (ej: npm install)"
Write-Host "---------------------------------------------------------" -ForegroundColor Cyan
