# 🚀 Script de Despliegue Rápido para GitHub Pages (PowerShell)
# Este script automatiza el proceso de despliegue

Write-Host "🚀 Iniciando despliegue a GitHub Pages..." -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en un repositorio Git
if (-not (Test-Path .git)) {
    Write-Host "❌ Error: No estás en un repositorio Git" -ForegroundColor Red
    Write-Host "   Ejecuta: git init" -ForegroundColor Yellow
    exit 1
}

# Verificar remote
$remoteUrl = git remote get-url origin 2>$null
if (-not $remoteUrl) {
    Write-Host "⚠️  No tienes un remote configurado" -ForegroundColor Yellow
    Write-Host "   Configura tu remote con:" -ForegroundColor Yellow
    Write-Host "   git remote add origin https://github.com/Nachovn12/huertohogar-react.git" -ForegroundColor White
    $continue = Read-Host "¿Deseas continuar de todos modos? (s/n)"
    if ($continue -ne "s" -and $continue -ne "S") {
        exit 1
    }
}

# Agregar todos los cambios
Write-Host "📦 Agregando cambios..." -ForegroundColor Green
git add .

# Commit
$commitMsg = Read-Host "📝 Mensaje del commit (Enter para usar mensaje por defecto)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "feat: configurar GitHub Pages y CI/CD"
}

git commit -m $commitMsg

# Push
Write-Host "⬆️  Subiendo cambios a GitHub..." -ForegroundColor Green
$pushed = $false
try {
    git push origin main 2>$null
    $pushed = $true
} catch {
    try {
        git push origin master 2>$null
        $pushed = $true
    } catch {
        Write-Host "❌ Error al hacer push. Verifica tu conexión y permisos." -ForegroundColor Red
        exit 1
    }
}

if ($pushed) {
    Write-Host ""
    Write-Host "✅ ¡Listo! Tu sitio se está desplegando..." -ForegroundColor Green
    Write-Host "📍 URL: https://Nachovn12.github.io/huertohogar-react" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔍 Verifica el progreso en:" -ForegroundColor Yellow
    Write-Host "   https://github.com/Nachovn12/huertohogar-react/actions" -ForegroundColor White
    Write-Host ""
}
